import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axios';
import { Search, Book, Clock, AlertTriangle, CheckCircle, Trash2, Loader2, ArrowLeft } from 'lucide-react';

interface UserData {
  id: number;
  email: string;
  hoTen: string;
  vaiTro: string;
  sinhVienId: number;
  maSV: string;
}

interface LichHoc {
  id: number;
  thu: number;
  tietBatDau: number;
  tietKetThuc: number;
  phongHoc: string;
}

interface LopHocPhan {
  id: number;
  maLopHP: string;
  siSoHienTai: number;
  siSoToiDa: number;
  trangThai: string;
  monHoc: {
    id: number;
    maMon: string;
    tenMon: string;
    soTinChi: number;
  };
  giangVien: {
    id: number;
    maGV: string;
    nguoiDung: {
      hoTen: string;
    };
  };
  dsLichHoc: LichHoc[];
}

interface DangKy {
  id: number;
  lopHocPhan: LopHocPhan;
  trangThai: string;
}

const CourseRegistration: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [classes, setClasses] = useState<LopHocPhan[]>([]);
  const [registrations, setRegistrations] = useState<DangKy[]>([]);
  const [cart, setCart] = useState<LopHocPhan[]>([]);
  
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [expandedSubjects, setExpandedSubjects] = useState<Record<number, boolean>>({});
  
  const navigate = useNavigate();

  const toggleSubject = (subjectId: number) => {
    setExpandedSubjects(prev => ({ ...prev, [subjectId]: !prev[subjectId] }));
  };

  const getGroupedClasses = () => {
    const groups: Record<number, { subject: LopHocPhan['monHoc']; sections: LopHocPhan[] }> = {};
    classes.forEach(lop => {
      if (!lop.monHoc) return;
      const sub = lop.monHoc;
      if (!groups[sub.id]) {
        groups[sub.id] = {
          subject: sub,
          sections: []
        };
      }
      groups[sub.id].sections.push(lop);
    });
    return Object.values(groups);
  };

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
    loadData(parsedUser.sinhVienId);
  }, [navigate]);

  const loadData = async (studentId: number, searchKeyword?: string, keepError = false) => {
    try {
      setLoading(true);
      if (!keepError) {
        setError(null);
      }
      
      // Load classes
      const searchUrl = searchKeyword ? `/course-sections/search?keyword=${encodeURIComponent(searchKeyword)}` : '/course-sections/search';
      const classesRes = await apiClient.get(searchUrl);
      setClasses(classesRes.data);

      // Load registered classes
      const regRes = await apiClient.get(`/registrations/student/${studentId}`);
      setRegistrations(regRes.data);
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách lớp học phần!');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      loadData(user.sinhVienId, keyword);
    }
  };

  // Check if a class is already registered
  const getRegisteredRecord = (classId: number) => {
    return registrations.find(r => r.lopHocPhan?.id === classId && r.trangThai === 'THANH_CONG');
  };

  // Check for conflicts between a class and already registered classes
  const checkScheduleConflict = (targetClass: LopHocPhan) => {
    if (!targetClass.dsLichHoc || targetClass.dsLichHoc.length === 0) return null;

    // Gather all schedules from registered classes
    const registeredSchedules: { thu: number; start: number; end: number; sourceName: string }[] = [];
    registrations.forEach(r => {
      if (r.lopHocPhan?.dsLichHoc && r.trangThai === 'THANH_CONG') {
        r.lopHocPhan.dsLichHoc.forEach(lh => {
          registeredSchedules.push({
            thu: lh.thu,
            start: lh.tietBatDau,
            end: lh.tietKetThuc,
            sourceName: r.lopHocPhan.monHoc?.tenMon || r.lopHocPhan.maLopHP
          });
        });
      }
    });

    // Gather all schedules from cart classes
    cart.forEach(c => {
      if (c.id !== targetClass.id && c.dsLichHoc) {
        c.dsLichHoc.forEach(lh => {
          registeredSchedules.push({
            thu: lh.thu,
            start: lh.tietBatDau,
            end: lh.tietKetThuc,
            sourceName: `Giỏ: ${c.monHoc?.tenMon || c.maLopHP}`
          });
        });
      }
    });

    // Check overlap
    for (const targetLich of targetClass.dsLichHoc) {
      for (const regLich of registeredSchedules) {
        if (targetLich.thu === regLich.thu) {
          const overlap = !(targetLich.tietKetThuc < regLich.start || targetLich.tietBatDau > regLich.end);
          if (overlap) return regLich.sourceName; // Return what it conflicts with!
        }
      }
    }

    return null;
  };

  const addToCart = (lop: LopHocPhan) => {
    if (cart.some(c => c.id === lop.id)) return;
    
    // Check conflicts
    const conflictName = checkScheduleConflict(lop);
    if (conflictName) {
      setError(`Không thể chọn lớp ${lop.maLopHP} vì trùng lịch với "${conflictName}"!`);
      setTimeout(() => setError(null), 4000);
      return;
    }
    
    setCart([...cart, lop]);
    setSuccessMsg(`Đã thêm lớp ${lop.maLopHP} vào giỏ tạm thời.`);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(c => c.id !== id));
  };

  const handleRegisterCart = async () => {
    if (cart.length === 0 || !user) return;
    setSubmitLoading(true);
    setError(null);
    setSuccessMsg(null);

    let successCount = 0;
    const failures: string[] = [];

    // Register each class in the cart
    for (const lop of cart) {
      try {
        await apiClient.post('/registrations', {
          sinhVienId: user.sinhVienId,
          lopHocPhanId: lop.id
        });
        successCount++;
      } catch (err: any) {
        failures.push(`Lớp ${lop.maLopHP}: ${err.message}`);
      }
    }

    if (successCount > 0) {
      setSuccessMsg(`Đăng ký thành công ${successCount} lớp học phần!`);
      setCart([]);
    }
    if (failures.length > 0) {
      setError(`Có lỗi xảy ra:\n${failures.join('\n')}`);
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Reload lists
    loadData(user.sinhVienId, keyword, true);
    setSubmitLoading(false);
  };

  const handleCancelRegistration = async (registrationId: number, classCode: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn hủy đăng ký lớp ${classCode}?`)) return;
    
    setSubmitLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      await apiClient.delete(`/registrations/${registrationId}`);
      setSuccessMsg(`Đã hủy đăng ký thành công lớp ${classCode}.`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (user) {
        loadData(user.sinhVienId, keyword, true);
      }
    } catch (err: any) {
      setError(err.message || 'Không thể hủy đăng ký lớp học phần này!');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSubmitLoading(false);
    }
  };

  const formatSchedule = (lichHocs: LichHoc[]) => {
    if (!lichHocs || lichHocs.length === 0) return 'Chưa xếp lịch';
    return lichHocs.map(lh => `T${lh.thu} (${lh.tietBatDau}-${lh.tietKetThuc}) [${lh.phongHoc}]`).join(', ');
  };

  const totalCreditsInCart = cart.reduce((sum, c) => sum + (c.monHoc?.soTinChi || 0), 0);

  return (
    <div className="container">
      {/* Back to Dashboard */}
      <button className="btn btn-secondary" onClick={() => navigate('/student/dashboard')} style={{
        marginBottom: '20px',
        padding: '8px 16px',
        fontSize: '13px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        <ArrowLeft size={16} />
        <span>Quay lại Dashboard</span>
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Book size={28} style={{ color: 'var(--accent-primary)' }} />
            <span>Đăng Ký Học Phần</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            Đợt đăng ký Học kỳ 1 năm học 2026-2027
          </p>
        </div>
      </div>

      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      {error && <div className="alert alert-danger" style={{ whiteSpace: 'pre-line' }}>{error}</div>}

      {/* Main Grid: Search & List left, Sidebar right */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }} className="grid-cols-2">
        
        {/* Left Side: Course Search and Table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Search Card */}
          <div className="card" style={{ padding: '20px' }}>
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <input
                  type="text"
                  placeholder="Nhập tên môn học, mã lớp hoặc giảng viên..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  style={{ paddingLeft: '44px' }}
                />
                <Search size={18} style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-tertiary)'
                }} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ padding: '0 24px' }}>
                Tìm kiếm
              </button>
            </form>
          </div>

          {/* Classes grouped by Subject */}
          {loading ? (
            <div className="card" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px', gap: '8px' }}>
              <Loader2 className="animate-spin" size={24} style={{ color: 'var(--accent-primary)' }} />
              <span>Đang tải danh sách...</span>
            </div>
          ) : classes.length === 0 ? (
            <div className="card" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <AlertTriangle size={36} style={{ color: 'var(--text-tertiary)', marginBottom: '8px' }} />
              <p>Không tìm thấy môn học hoặc lớp học phần nào khớp với từ khóa tìm kiếm!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {getGroupedClasses().map(group => {
                const sub = group.subject;
                const isExpanded = !!expandedSubjects[sub.id];
                const count = group.sections.length;

                return (
                  <div key={sub.id} className="card" style={{ padding: '0px', overflow: 'hidden' }}>
                    {/* Subject Header (Accordion toggle) */}
                    <div
                      onClick={() => toggleSubject(sub.id)}
                      style={{
                        padding: '16px 20px',
                        backgroundColor: 'var(--bg-secondary)',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: isExpanded ? '1px solid var(--border-color)' : 'none',
                        transition: 'background-color 0.2s',
                      }}
                      className="subject-header-hover"
                    >
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '16px', color: 'var(--text-primary)' }}>
                          {sub.tenMon}
                        </div>
                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          Mã môn: <strong style={{ color: 'var(--text-primary)' }}>{sub.maMon}</strong> | Số tín chỉ: <strong style={{ color: 'var(--text-primary)' }}>{sub.soTinChi} TC</strong>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span className="badge badge-info">{count} Lớp học phần</span>
                        <span style={{
                          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s',
                          fontSize: '14px',
                          color: 'var(--text-secondary)'
                        }}>
                          ▼
                        </span>
                      </div>
                    </div>

                    {/* Expandable Class Sections Table */}
                    {isExpanded && (
                      <div className="table-container" style={{ border: 'none', boxShadow: 'none', borderRadius: 0 }}>
                        <table>
                          <thead>
                            <tr>
                              <th>Mã Lớp</th>
                              <th>Giảng viên</th>
                              <th>Lịch học</th>
                              <th>Sĩ số</th>
                              <th style={{ textAlign: 'center' }}>Hành động</th>
                            </tr>
                          </thead>
                          <tbody>
                            {group.sections.map(lop => {
                              const regRecord = getRegisteredRecord(lop.id);
                              const isRegistered = !!regRecord;
                              const isFull = lop.siSoHienTai >= lop.siSoToiDa;
                              const isInCart = cart.some(c => c.id === lop.id);
                              const conflictName = checkScheduleConflict(lop);
                              const isConflict = !!conflictName;

                              return (
                                <tr key={lop.id}>
                                  <td style={{ fontWeight: '600' }}>{lop.maLopHP}</td>
                                  <td>{lop.giangVien?.nguoiDung?.hoTen || 'Chưa phân công'}</td>
                                  <td style={{ fontSize: '13px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                      {lop.dsLichHoc && lop.dsLichHoc.length > 0 ? (
                                        lop.dsLichHoc.map((lh, index) => (
                                          <div key={lh.id || index} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Clock size={13} style={{ color: 'var(--text-tertiary)' }} />
                                            <span>Thứ {lh.thu === 8 ? 'CN' : lh.thu} (tiết {lh.tietBatDau}-{lh.tietKetThuc}) [{lh.phongHoc}]</span>
                                          </div>
                                        ))
                                      ) : (
                                        <span>Chưa xếp lịch</span>
                                      )}
                                    </div>
                                  </td>
                                  <td>
                                    <span className={`badge ${isFull ? 'badge-danger' : 'badge-success'}`}>
                                      {lop.siSoHienTai} / {lop.siSoToiDa}
                                    </span>
                                  </td>
                                  <td style={{ textAlign: 'center' }}>
                                    {isRegistered ? (
                                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                        <span className="badge badge-success" style={{ gap: '4px' }}>
                                          <CheckCircle size={12} /> Đã Đăng Ký
                                        </span>
                                        <button
                                          onClick={() => handleCancelRegistration(regRecord.id, lop.maLopHP)}
                                          className="btn btn-secondary"
                                          disabled={submitLoading}
                                          style={{
                                            padding: '6px 10px',
                                            color: 'var(--color-danger)',
                                            borderColor: 'var(--color-danger-border)',
                                            backgroundColor: 'transparent'
                                          }}
                                          title="Hủy đăng ký"
                                        >
                                          <Trash2 size={14} />
                                        </button>
                                      </div>
                                    ) : isInCart ? (
                                      <button
                                        className="btn btn-secondary"
                                        onClick={() => removeFromCart(lop.id)}
                                        style={{ padding: '8px 14px', fontSize: '13px', width: '100px' }}
                                      >
                                        Đang chọn
                                      </button>
                                    ) : isConflict ? (
                                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                        <button
                                          className="btn btn-secondary"
                                          disabled
                                          style={{ padding: '8px 14px', fontSize: '13px', color: 'var(--text-tertiary)', width: '100px' }}
                                        >
                                          Trùng lịch
                                        </button>
                                        <div style={{ fontSize: '11px', color: 'var(--color-danger)', maxWidth: '160px', textAlign: 'center', fontWeight: '500' }}>
                                          ({conflictName})
                                        </div>
                                      </div>
                                    ) : isFull ? (
                                      <button
                                        className="btn btn-secondary"
                                        disabled
                                        style={{ padding: '8px 14px', fontSize: '13px', color: 'var(--color-danger)', width: '100px' }}
                                      >
                                        Đầy lớp
                                      </button>
                                    ) : (
                                      <button
                                        className="btn btn-primary"
                                        onClick={() => addToCart(lop)}
                                        style={{ padding: '8px 14px', fontSize: '13px', width: '100px' }}
                                      >
                                        Chọn lớp
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Side: Temporary Checkout Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Cart Card */}
          <div className="card card-glass" style={{
            position: 'sticky',
            top: '90px',
            borderLeft: '4px solid var(--accent-primary)',
          }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>GIỎ ĐĂNG KÝ TẠM THỜI</span>
              <span className="badge badge-info" style={{ borderRadius: '6px' }}>{cart.length}</span>
            </h3>

            {cart.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-secondary)', border: '1px dashed var(--border-color)', borderRadius: 'var(--border-radius-md)' }}>
                <Book size={32} style={{ color: 'var(--text-tertiary)', marginBottom: '8px' }} />
                <p style={{ fontSize: '14px' }}>Chưa chọn lớp học phần nào.</p>
                <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '4px' }}>Hãy nhấn "Chọn lớp" bên cạnh danh sách để thêm vào giỏ.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  maxHeight: '320px',
                  overflowY: 'auto',
                  paddingRight: '4px'
                }}>
                  {cart.map(lop => (
                    <div key={lop.id} style={{
                      backgroundColor: 'var(--bg-primary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--border-radius-md)',
                      padding: '12px 14px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-primary)' }}>
                          {lop.monHoc?.tenMon}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          Mã lớp: <strong>{lop.maLopHP}</strong> | Số TC: <strong>{lop.monHoc?.soTinChi} TC</strong>
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '4px' }}>
                          <Clock size={10} /> Lịch: {formatSchedule(lop.dsLichHoc)}
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(lop.id)}
                        style={{
                          backgroundColor: 'transparent',
                          border: 'none',
                          color: 'var(--color-danger)',
                          cursor: 'pointer',
                          padding: '6px'
                        }}
                        title="Bỏ chọn"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '600' }}>
                  <span>Tổng số tín chỉ:</span>
                  <span style={{ color: 'var(--accent-primary)', fontSize: '16px', fontWeight: '800' }}>
                    {totalCreditsInCart} TC
                  </span>
                </div>

                <button
                  onClick={handleRegisterCart}
                  className="btn btn-primary"
                  disabled={submitLoading}
                  style={{ width: '100%', height: '44px', fontWeight: '700' }}
                >
                  {submitLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Đang đăng ký học phần...</span>
                    </>
                  ) : (
                    <span>XÁC NHẬN ĐĂNG KÝ HỌC PHẦN</span>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CourseRegistration;
