import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axios';
import { CheckCircle, AlertCircle, HelpCircle, Lock, Loader2, ArrowLeft, Search } from 'lucide-react';

interface UserData {
  id: number;
  email: string;
  hoTen: string;
  vaiTro: string;
  sinhVienId: number;
  maSV: string;
}

interface MonHoc {
  id: number;
  maMon: string;
  tenMon: string;
  soTinChi: number;
  monTienQuyet: {
    id: number;
    maMon: string;
    tenMon: string;
  }[];
}

interface KetQuaHocTap {
  id: number;
  monHoc: {
    id: number;
  };
  diemChuyenCan: number | null;
  diemGiuaKy: number | null;
  diemCuoiKy: number | null;
  diemTrungBinh: number;
  trangThaiDat: boolean;
}

const StudyPlan: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [courses, setCourses] = useState<MonHoc[]>([]);
  const [results, setResults] = useState<KetQuaHocTap[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PASSED' | 'ELIGIBLE' | 'LOCKED'>('ALL');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.vaiTro !== 'SINH_VIEN') {
      navigate('/admin/course-sections');
      return;
    }
    setUser(parsedUser);
    loadStudyPlanData(parsedUser.sinhVienId);
  }, [navigate]);

  const loadStudyPlanData = async (studentId: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const [coursesRes, resultsRes] = await Promise.all([
        apiClient.get('/mon-hoc'),
        apiClient.get(`/results/student/${studentId}`)
      ]);
      
      setCourses(coursesRes.data || []);
      setResults(resultsRes.data || []);
    } catch (err: any) {
      setError(err.message || 'Không thể tải chương trình đào tạo!');
    } finally {
      setLoading(false);
    }
  };

  const getCourseStatus = (course: MonHoc) => {
    // 1. Check if course is in results
    const result = results.find(r => r.monHoc?.id === course.id);
    if (result) {
      return result.trangThaiDat ? 'PASSED' : 'FAILED';
    }

    // 2. Check if all prerequisites are passed
    if (!course.monTienQuyet || course.monTienQuyet.length === 0) {
      return 'ELIGIBLE';
    }

    const allPrereqsPassed = course.monTienQuyet.every(prereq => {
      const prResult = results.find(r => r.monHoc?.id === prereq.id);
      return prResult && prResult.trangThaiDat;
    });

    return allPrereqsPassed ? 'ELIGIBLE' : 'LOCKED';
  };

  const getStatusBadge = (status: string, result?: KetQuaHocTap) => {
    switch (status) {
      case 'PASSED':
        return (
          <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
            <CheckCircle size={14} />
            <span>Đã đạt ({result?.diemTrungBinh.toFixed(1)})</span>
          </span>
        );
      case 'FAILED':
        return (
          <span className="badge badge-danger" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
            <AlertCircle size={14} />
            <span>Học lại ({result?.diemTrungBinh.toFixed(1)})</span>
          </span>
        );
      case 'ELIGIBLE':
        return (
          <span className="badge badge-info" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
            <HelpCircle size={14} />
            <span>Sẵn sàng học</span>
          </span>
        );
      case 'LOCKED':
        return (
          <span className="badge badge-secondary" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
            <Lock size={14} />
            <span>Chưa đủ điều kiện</span>
          </span>
        );
      default:
        return null;
    }
  };

  // Filtered courses
  const getFilteredCourses = () => {
    return courses.filter(course => {
      // Search check
      const matchSearch = course.tenMon.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          course.maMon.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!matchSearch) return false;

      // Status filter check
      const status = getCourseStatus(course);
      if (filterStatus === 'ALL') return true;
      if (filterStatus === 'PASSED') return status === 'PASSED';
      if (filterStatus === 'ELIGIBLE') return status === 'ELIGIBLE';
      if (filterStatus === 'LOCKED') return status === 'LOCKED' || status === 'FAILED';
      
      return true;
    });
  };

  const filtered = getFilteredCourses();
  
  // Compulsory are BAS001, FIT001, FIT002, FIT003
  // Elective is FIT004 (or others)
  const isCompulsory = (course: MonHoc) => {
    return course.maMon !== 'FIT004';
  };

  const compulsoryCourses = filtered.filter(isCompulsory);
  const electiveCourses = filtered.filter(c => !isCompulsory(c));

  // Credits calculation
  const totalCreditsInProgram = courses.reduce((sum, c) => sum + c.soTinChi, 0);
  const completedCredits = courses.reduce((sum, c) => {
    const status = getCourseStatus(c);
    return status === 'PASSED' ? sum + c.soTinChi : sum;
  }, 0);

  const renderCourseTable = (coursesList: MonHoc[]) => {
    return (
      <div className="card" style={{ padding: '0px', overflow: 'hidden' }}>
        <div className="table-container" style={{ border: 'none', boxShadow: 'none', borderRadius: 0 }}>
          <table>
            <thead>
              <tr>
                <th style={{ width: '120px' }}>Mã Môn</th>
                <th>Tên Môn Học</th>
                <th style={{ textAlign: 'center', width: '100px' }}>Số TC</th>
                <th>Môn Học Tiên Quyết</th>
                <th style={{ textAlign: 'center', width: '220px' }}>Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              {coursesList.map(course => {
                const status = getCourseStatus(course);
                const result = results.find(r => r.monHoc?.id === course.id);
                return (
                  <tr key={course.id}>
                    <td style={{ fontWeight: 600 }}>{course.maMon}</td>
                    <td style={{ fontWeight: 600 }}>{course.tenMon}</td>
                    <td style={{ textAlign: 'center', fontWeight: 600 }}>{course.soTinChi}</td>
                    <td>
                      {course.monTienQuyet && course.monTienQuyet.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {course.monTienQuyet.map(pre => {
                            const isPrePassed = results.find(r => r.monHoc?.id === pre.id)?.trangThaiDat;
                            return (
                              <span key={pre.id} style={{ 
                                color: isPrePassed ? 'var(--color-success)' : 'var(--text-primary)',
                                fontSize: '13px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px'
                              }}>
                                <span style={{ 
                                  width: '6px', 
                                  height: '6px', 
                                  borderRadius: '50%', 
                                  backgroundColor: isPrePassed ? 'var(--color-success)' : 'var(--text-tertiary)' 
                                }} />
                                {pre.tenMon} ({pre.maMon})
                              </span>
                            );
                          })}
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-tertiary)', fontSize: '13px' }}>Không có</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', justifyContent: 'center' }}>
                        {getStatusBadge(status, result)}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', gap: '10px' }}>
        <Loader2 className="animate-spin" size={32} style={{ color: 'var(--accent-primary)' }} />
        <span style={{ fontWeight: 600 }}>Đang tải chương trình đào tạo...</span>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Back to Dashboard */}
      <button 
        onClick={() => navigate('/student/dashboard')}
        className="btn btn-secondary" 
        style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px' }}
      >
        <ArrowLeft size={16} />
        <span>Về trang chủ</span>
      </button>

      {/* Header & Stats */}
      <div style={{
        background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
        color: '#ffffff',
        borderRadius: 'var(--border-radius-lg)',
        padding: '32px',
        marginBottom: '32px',
        boxShadow: 'var(--shadow-lg)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '24px'
      }}>
        <div>
          <h1 style={{ color: '#ffffff', fontSize: '28px', marginBottom: '8px' }}>Chương Trình Đào Tạo</h1>
          <p style={{ opacity: 0.9, fontSize: '15px' }}>
            Sinh viên: <strong>{user?.hoTen}</strong> | Ngành: <strong>Công nghệ thông tin</strong>
          </p>
        </div>

        {/* Credits progress circular/card */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          padding: '16px 28px',
          borderRadius: 'var(--border-radius-md)',
          textAlign: 'center',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.9, display: 'block', marginBottom: '4px' }}>
            Tiến độ hoàn thành
          </span>
          <h3 style={{ color: '#ffffff', fontSize: '24px', fontWeight: '800' }}>
            {completedCredits} / {totalCreditsInProgram} TC
          </h3>
          <span style={{ fontSize: '12px', opacity: 0.8 }}>
            Tích lũy đạt {((completedCredits / totalCreditsInProgram) * 100).toFixed(0)}% chương trình
          </span>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '20px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Search Input */}
          <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
            <input
              type="text"
              placeholder="Tìm kiếm môn học theo tên hoặc mã môn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '40px', width: '100%' }}
            />
            <Search size={18} style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-tertiary)'
            }} />
          </div>

          {/* Filter Status Buttons */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button 
              className={`btn ${filterStatus === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterStatus('ALL')}
              style={{ fontSize: '13px', padding: '8px 16px' }}
            >
              Tất cả ({courses.length})
            </button>
            <button 
              className={`btn ${filterStatus === 'PASSED' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterStatus('PASSED')}
              style={{ fontSize: '13px', padding: '8px 16px' }}
            >
              Đã đạt ({courses.filter(c => getCourseStatus(c) === 'PASSED').length})
            </button>
            <button 
              className={`btn ${filterStatus === 'ELIGIBLE' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterStatus('ELIGIBLE')}
              style={{ fontSize: '13px', padding: '8px 16px' }}
            >
              Sẵn sàng học ({courses.filter(c => getCourseStatus(c) === 'ELIGIBLE').length})
            </button>
            <button 
              className={`btn ${filterStatus === 'LOCKED' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterStatus('LOCKED')}
              style={{ fontSize: '13px', padding: '8px 16px' }}
            >
              Chưa đủ điều kiện ({courses.filter(c => {
                const s = getCourseStatus(c);
                return s === 'LOCKED' || s === 'FAILED';
              }).length})
            </button>
          </div>
        </div>
      </div>

      {/* Program Courses List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        
        {/* Compulsory Section */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ width: '4px', height: '24px', backgroundColor: 'var(--accent-primary)', borderRadius: '2px' }} />
            <h2 style={{ fontSize: '20px', fontWeight: '800' }}>Học Phần Bắt Buộc ({compulsoryCourses.length})</h2>
          </div>

          {compulsoryCourses.length === 0 ? (
            <div className="card" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              Không tìm thấy môn học bắt buộc nào phù hợp bộ lọc!
            </div>
          ) : (
            renderCourseTable(compulsoryCourses)
          )}
        </div>

        {/* Elective Section */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ width: '4px', height: '24px', backgroundColor: 'var(--accent-secondary)', borderRadius: '2px' }} />
            <h2 style={{ fontSize: '20px', fontWeight: '800' }}>Học Phần Tự Chọn ({electiveCourses.length})</h2>
          </div>

          {electiveCourses.length === 0 ? (
            <div className="card" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              Không tìm thấy môn học tự chọn nào phù hợp bộ lọc!
            </div>
          ) : (
            renderCourseTable(electiveCourses)
          )}
        </div>

      </div>
    </div>
  );
};

export default StudyPlan;
