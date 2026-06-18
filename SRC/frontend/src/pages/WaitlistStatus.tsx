import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axios';
import { Clock, ArrowLeft, Loader2, Trash2 } from 'lucide-react';

interface UserData {
  id: number;
  email: string;
  hoTen: string;
  vaiTro: string;
  sinhVienId: number;
  maSV: string;
}

interface LopHocPhan {
  id: number;
  maLopHP: string;
  monHoc: {
    id: number;
    maMon: string;
    tenMon: string;
    soTinChi: number;
  };
  giangVien: {
    nguoiDung: {
      hoTen: string;
    };
  };
  siSoHienTai: number;
  siSoToiDa: number;
}

interface Waitlist {
  id: number;
  ngayCho: string;
  thuTu: number;
  lopHocPhan: LopHocPhan;
}

const WaitlistStatus: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [waitlists, setWaitlists] = useState<Waitlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
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
    loadWaitlists(parsedUser.sinhVienId);
  }, [navigate]);

  const loadWaitlists = async (studentId: number) => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.get(`/waitlist/student/${studentId}`);
      setWaitlists(res.data || []);
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách hàng chờ!');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelWaitlist = async (id: number, classCode: string) => {
    if (!window.confirm(`Bạn có muốn rút khỏi hàng chờ của lớp ${classCode}?`)) return;
    
    try {
      setActionLoading(true);
      setError(null);
      setSuccess(null);
      await apiClient.delete(`/waitlist/${id}`);
      setSuccess(`Rút khỏi hàng chờ lớp ${classCode} thành công.`);
      if (user) {
        await loadWaitlists(user.sinhVienId);
      }
    } catch (err: any) {
      setError(err.message || 'Không thể rút khỏi hàng chờ!');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', gap: '10px' }}>
        <Loader2 className="animate-spin" size={32} style={{ color: 'var(--accent-primary)' }} />
        <span style={{ fontWeight: 600 }}>Đang tải danh sách chờ...</span>
      </div>
    );
  }

  return (
    <div className="container">
      <button 
        onClick={() => navigate('/student/dashboard')}
        className="btn btn-secondary" 
        style={{
          marginBottom: '20px',
          padding: '8px 16px',
          fontSize: '13px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        <ArrowLeft size={16} />
        <span>Quay lại Dashboard</span>
      </button>

      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Clock size={28} style={{ color: 'var(--accent-primary)' }} />
          <span>Danh Sách Chờ Đăng Ký (Waitlist)</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
          Danh sách các lớp học phần bạn đang xếp hàng chờ. Khi lớp có chỗ trống, bạn sẽ được tự động xếp vào lớp theo thứ tự (FIFO) nếu không có xung đột lịch học/thi hoặc thiếu điều kiện tiên quyết.
        </p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {waitlists.length === 0 ? (
        <div className="card" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <Clock size={40} style={{ color: 'var(--text-tertiary)', marginBottom: '12px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>Không có môn học nào đang chờ</h3>
          <p style={{ fontSize: '14px', marginTop: '4px' }}>Hãy chọn "Đăng ký hàng chờ" ở các lớp học phần đã đầy trong phần Đăng ký học.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {waitlists.map(wl => (
            <div key={wl.id} className="card card-glass" style={{ borderLeft: '4px solid var(--accent-secondary)' }}>
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>{wl.lopHocPhan.monHoc?.tenMon}</h3>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Mã lớp: <strong>{wl.lopHocPhan.maLopHP}</strong></span>
                  </div>
                  <div style={{
                    backgroundColor: 'rgba(14, 165, 233, 0.15)',
                    color: 'var(--accent-secondary, #0ea5e9)',
                    padding: '6px 12px',
                    borderRadius: 'var(--border-radius-sm)',
                    fontSize: '14px',
                    fontWeight: 700,
                    textAlign: 'center'
                  }}>
                    Vị trí: #{wl.thuTu}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Giảng viên:</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{wl.lopHocPhan.giangVien?.nguoiDung?.hoTen || 'Chưa phân công'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Số tín chỉ:</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{wl.lopHocPhan.monHoc?.soTinChi} TC</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Ngày xếp hàng:</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{new Date(wl.ngayCho).toLocaleString('vi-VN')}</strong>
                  </div>
                </div>

                <button
                  onClick={() => handleCancelWaitlist(wl.id, wl.lopHocPhan.maLopHP)}
                  className="btn btn-danger"
                  disabled={actionLoading}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px' }}
                >
                  <Trash2 size={16} />
                  <span>Rút khỏi hàng chờ</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WaitlistStatus;
