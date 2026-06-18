import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axios';
import { BookOpen, AlertCircle, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';

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
}

interface KetQuaHocTap {
  id: number;
  monHoc: MonHoc;
  diemChuyenCan: number | null;
  diemGiuaKy: number | null;
  diemCuoiKy: number | null;
  diemTrungBinh: number;
  trangThaiDat: boolean;
}

const AcademicResult: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [results, setResults] = useState<KetQuaHocTap[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
    loadResultsData(parsedUser.sinhVienId);
  }, [navigate]);

  const loadResultsData = async (studentId: number) => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.get(`/results/student/${studentId}`);
      setResults(res.data || []);
    } catch (err: any) {
      setError(err.message || 'Không thể tải kết quả học tập!');
    } finally {
      setLoading(false);
    }
  };

  const getHe4Grade = (diem10: number) => {
    if (diem10 >= 8.5) return { val: 4.0, letter: 'A' };
    if (diem10 >= 7.0) return { val: 3.0, letter: 'B' };
    if (diem10 >= 5.5) return { val: 2.0, letter: 'C' };
    if (diem10 >= 4.0) return { val: 1.0, letter: 'D' };
    return { val: 0.0, letter: 'F' };
  };

  // GPA calculation
  const totalCredits = results.reduce((sum, r) => sum + (r.monHoc?.soTinChi || 0), 0);
  const weightedSumHe10 = results.reduce((sum, r) => sum + (r.diemTrungBinh * (r.monHoc?.soTinChi || 0)), 0);
  const weightedSumHe4 = results.reduce((sum, r) => {
    const he4 = getHe4Grade(r.diemTrungBinh).val;
    return sum + (he4 * (r.monHoc?.soTinChi || 0));
  }, 0);

  const gpaHe10 = totalCredits > 0 ? (weightedSumHe10 / totalCredits) : 0.0;
  const gpaHe4 = totalCredits > 0 ? (weightedSumHe4 / totalCredits) : 0.0;

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', gap: '10px' }}>
        <Loader2 className="animate-spin" size={32} style={{ color: 'var(--accent-primary)' }} />
        <span style={{ fontWeight: 600 }}>Đang tải kết quả học tập...</span>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Back Button */}
      <button 
        onClick={() => navigate('/student/dashboard')}
        className="btn btn-secondary" 
        style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px' }}
      >
        <ArrowLeft size={16} />
        <span>Về trang chủ</span>
      </button>

      {/* Title block */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px' }}>Bảng Điểm Học Tập {user ? `- ${user.hoTen}` : ''}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            Xem chi tiết điểm thành phần, điểm trung bình và xếp loại học tập
          </p>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* GPA summary cards */}
      <div className="grid-cols-3" style={{ marginBottom: '32px' }}>
        
        {/* GPA He 10 */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderLeft: '4px solid var(--accent-primary)' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 700 }}>ĐIỂM TRUNG BÌNH (HỆ 10)</span>
          <h3 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)' }}>
            {gpaHe10.toFixed(2)} <span style={{ fontSize: '16px', color: 'var(--text-secondary)', fontWeight: 500 }}>/ 10.0</span>
          </h3>
        </div>

        {/* GPA He 4 */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderLeft: '4px solid var(--accent-secondary)' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 700 }}>GPA TÍCH LŨY (HỆ 4)</span>
          <h3 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)' }}>
            {gpaHe4.toFixed(2)} <span style={{ fontSize: '16px', color: 'var(--text-secondary)', fontWeight: 500 }}>/ 4.0</span>
          </h3>
        </div>

        {/* Total Credits */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderLeft: '4px solid var(--color-success)' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 700 }}>TỔNG SỐ TÍN CHỈ TÍCH LŨY</span>
          <h3 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)' }}>
            {totalCredits} <span style={{ fontSize: '16px', color: 'var(--text-secondary)', fontWeight: 500 }}>Tín chỉ</span>
          </h3>
        </div>
      </div>

      {/* Results Table */}
      <div className="card" style={{ padding: '0px', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Chi tiết điểm các môn học</h3>
        </div>

        {results.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <BookOpen size={36} style={{ color: 'var(--text-tertiary)', marginBottom: '8px' }} />
            <p>Chưa ghi nhận kết quả học tập nào!</p>
          </div>
        ) : (
          <div className="table-container" style={{ border: 'none', boxShadow: 'none', borderRadius: 0 }}>
            <table>
              <thead>
                <tr>
                  <th>Mã Môn</th>
                  <th>Tên Môn Học</th>
                  <th style={{ textAlign: 'center' }}>Số TC</th>
                  <th style={{ textAlign: 'center' }}>Điểm Chuyên Cần</th>
                  <th style={{ textAlign: 'center' }}>Điểm Giữa Kỳ</th>
                  <th style={{ textAlign: 'center' }}>Điểm Cuối Kỳ</th>
                  <th style={{ textAlign: 'center' }}>Điểm TB (Hệ 10)</th>
                  <th style={{ textAlign: 'center' }}>Điểm Chữ</th>
                  <th style={{ textAlign: 'center' }}>Trạng Thái</th>
                </tr>
              </thead>
              <tbody>
                {results.map(r => {
                  const he4 = getHe4Grade(r.diemTrungBinh);
                  return (
                    <tr key={r.id}>
                      <td style={{ fontWeight: '600' }}>{r.monHoc?.maMon}</td>
                      <td style={{ fontWeight: '600' }}>{r.monHoc?.tenMon}</td>
                      <td style={{ textAlign: 'center', fontWeight: '600' }}>{r.monHoc?.soTinChi}</td>
                      <td style={{ textAlign: 'center' }}>{r.diemChuyenCan !== null ? r.diemChuyenCan.toFixed(1) : '-'}</td>
                      <td style={{ textAlign: 'center' }}>{r.diemGiuaKy !== null ? r.diemGiuaKy.toFixed(1) : '-'}</td>
                      <td style={{ textAlign: 'center' }}>{r.diemCuoiKy !== null ? r.diemCuoiKy.toFixed(1) : '-'}</td>
                      <td style={{ textAlign: 'center', fontWeight: '700', color: r.trangThaiDat ? 'var(--text-primary)' : 'var(--color-danger)' }}>
                        {r.diemTrungBinh.toFixed(1)}
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: '700' }}>{he4.letter}</td>
                      <td style={{ textAlign: 'center' }}>
                        {r.trangThaiDat ? (
                          <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCircle size={12} />
                            <span>Đạt</span>
                          </span>
                        ) : (
                          <span className="badge badge-danger" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <AlertCircle size={12} />
                            <span>Chưa đạt</span>
                          </span>
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
    </div>
  );
};

export default AcademicResult;
