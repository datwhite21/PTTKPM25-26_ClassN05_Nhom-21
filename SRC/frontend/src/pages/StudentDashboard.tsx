import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axios';
import { Calendar, BookOpen, Clock, Award, ChevronRight, Loader2 } from 'lucide-react';

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
  thu: number; // 2 -> 8 (8 is Chủ nhật)
  tietBatDau: number;
  tietKetThuc: number;
  phongHoc: string;
  lopHocPhan: {
    id: number;
    maLopHP: string;
    siSoHienTai: number;
    siSoToiDa: number;
    monHoc: {
      maMon: string;
      tenMon: string;
      soTinChi: number;
    };
    giangVien: {
      maGV: string;
      nguoiDung: {
        hoTen: string;
      };
    };
  };
}

const StudentDashboard: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [schedule, setSchedule] = useState<LichHoc[]>([]);
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
    fetchSchedule(parsedUser.sinhVienId);
  }, [navigate]);

  const fetchSchedule = async (studentId: number) => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/registrations/student/${studentId}/schedule`);
      setSchedule(response.data);
    } catch (err: any) {
      setError(err.message || 'Không thể tải lịch học!');
    } finally {
      setLoading(false);
    }
  };

  // Group schedule to calculate total registered credits
  const getUniqueClasses = () => {
    const classMap = new Map<number, any>();
    schedule.forEach(item => {
      if (item.lopHocPhan) {
        classMap.set(item.lopHocPhan.id, item.lopHocPhan);
      }
    });
    return Array.from(classMap.values());
  };

  const uniqueClasses = getUniqueClasses();
  const registeredCredits = uniqueClasses.reduce((sum, item) => sum + (item.monHoc?.soTinChi || 0), 0);
  const totalAccumulatedCredits = 72 + registeredCredits; // 72 is base credits for simulation

  // Helper to place schedule items in UI grid
  // Rows: Tiết 1-3, Tiết 4-6, Tiết 7-9, Tiết 10-12
  // Columns: Thứ 2 (2) -> Chủ Nhật (8)
  const timeSlots = [
    { label: 'Tiết 1-3', range: [1, 3] },
    { label: 'Tiết 4-6', range: [4, 6] },
    { label: 'Tiết 7-9', range: [7, 9] },
    { label: 'Tiết 10-12', range: [10, 12] }
  ];
  const daysOfWeek = [2, 3, 4, 5, 6, 7, 8];

  const getDayName = (day: number) => {
    if (day === 8) return 'Chủ Nhật';
    return `Thứ ${day}`;
  };

  const getScheduleItem = (day: number, startTiet: number) => {
    return schedule.find(item => item.thu === day && item.tietBatDau === startTiet);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', gap: '10px' }}>
        <Loader2 className="animate-spin" size={32} style={{ color: 'var(--accent-primary)' }} />
        <span style={{ fontWeight: 600 }}>Đang tải thông tin...</span>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
        color: '#ffffff',
        borderRadius: 'var(--border-radius-lg)',
        padding: '32px',
        marginBottom: '24px',
        boxShadow: 'var(--shadow-lg)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <span style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            padding: '4px 12px',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            display: 'inline-block',
            marginBottom: '12px'
          }}>
            Hệ thống quản lý học tập
          </span>
          <h1 style={{ color: '#ffffff', fontSize: '28px', marginBottom: '8px' }}>
            Xin chào, {user?.hoTen}!
          </h1>
          <p style={{ opacity: 0.9, fontSize: '15px' }}>
            Mã số sinh viên: <strong>{user?.maSV}</strong> | Email: <strong>{user?.email}</strong>
          </p>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate('/student/registration')} style={{
          backgroundColor: '#ffffff',
          color: 'var(--accent-primary)',
          border: 'none',
          padding: '14px 28px',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>ĐĂNG KÝ HỌC PHẦN NGAY</span>
          <ChevronRight size={18} />
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Stats and Info Grid */}
      <div className="grid-cols-3" style={{ marginBottom: '24px' }}>
        {/* Info Box 1: Credits progress */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 600 }}>TIẾN ĐỘ TÍN CHỈ</span>
            <Award size={20} style={{ color: 'var(--accent-primary)' }} />
          </div>
          <div>
            <h3 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '6px' }}>
              {totalAccumulatedCredits} <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500 }}>/ 120 Tín chỉ</span>
            </h3>
            {/* Progress bar */}
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: 'var(--bg-tertiary)',
              borderRadius: '9999px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${(totalAccumulatedCredits / 120) * 100}%`,
                height: '100%',
                background: 'linear-gradient(90deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
                borderRadius: '9999px',
                transition: 'var(--transition-smooth)'
              }} />
            </div>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginTop: '6px' }}>
              Đã tích lũy: 72 TC | Đăng ký mới: {registeredCredits} TC
            </span>
          </div>
        </div>

        {/* Info Box 2: Registered Classes list */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 600 }}>LỚP ĐÃ ĐĂNG KÝ</span>
            <BookOpen size={20} style={{ color: 'var(--accent-secondary)' }} />
          </div>
          <div>
            <h3 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '6px' }}>
              {uniqueClasses.length} <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500 }}>Lớp học phần</span>
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block' }}>
              Danh sách chi tiết hiển thị trong phần thời khóa biểu phía dưới.
            </span>
          </div>
        </div>

        {/* Info Box 3: Open period status banner */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderLeft: '4px solid var(--color-success)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 600 }}>CỔNG ĐĂNG KÝ HỌC</span>
            <span className="badge badge-success">ĐANG MỞ</span>
          </div>
          <div>
            <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
              Học kỳ 1 năm học 2026-2027
            </p>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={12} /> Hạn cuối: 30/06/2026
            </span>
          </div>
        </div>
      </div>

      {/* Timetable schedule grid */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={20} style={{ color: 'var(--accent-primary)' }} />
            <span>Thời Khóa Biểu Tuần</span>
          </h2>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Học kỳ 1 (2026 - 2027)
          </span>
        </div>

        {schedule.length === 0 ? (
          <div style={{
            padding: '40px',
            textAlign: 'center',
            backgroundColor: 'var(--bg-primary)',
            borderRadius: 'var(--border-radius-md)',
            border: '1px dashed var(--border-color)',
            color: 'var(--text-secondary)'
          }}>
            <Calendar size={48} style={{ color: 'var(--text-tertiary)', marginBottom: '12px' }} />
            <p style={{ fontWeight: 600, marginBottom: '4px' }}>Bạn chưa đăng ký lớp học phần nào!</p>
            <p style={{ fontSize: '13px', marginBottom: '16px' }}>Hãy chọn môn học và lập lịch trong đợt đăng ký tín chỉ này.</p>
            <button className="btn btn-primary" onClick={() => navigate('/student/registration')}>
              Đi đến trang đăng ký
            </button>
          </div>
        ) : (
          <div className="schedule-grid">
            {/* Headers */}
            <div className="schedule-header">Tiết</div>
            {daysOfWeek.map(day => (
              <div key={day} className="schedule-header">
                {getDayName(day)}
              </div>
            ))}

            {/* Grid rows */}
            {timeSlots.map((slot, rowIndex) => (
              <React.Fragment key={rowIndex}>
                {/* Time Label */}
                <div className="schedule-time-label">
                  <div>
                    <div style={{ fontWeight: 700 }}>{slot.label}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                      {slot.range[0] === 1 ? '7:00-9:30' : 
                       slot.range[0] === 4 ? '9:40-12:10' : 
                       slot.range[0] === 7 ? '13:00-15:30' : '15:40-18:10'}
                    </div>
                  </div>
                </div>

                {/* Day Columns */}
                {daysOfWeek.map(day => {
                  const item = getScheduleItem(day, slot.range[0]);
                  return (
                    <div key={`${day}-${rowIndex}`} className="schedule-cell">
                      {item ? (
                        <div className="schedule-slot">
                          <div className="schedule-slot-title">
                            {item.lopHocPhan?.monHoc?.tenMon}
                          </div>
                          <div className="schedule-slot-desc">
                            Mã: {item.lopHocPhan?.maLopHP}
                          </div>
                          <div className="schedule-slot-desc" style={{ display: 'flex', alignItems: 'center', gap: '3px', marginTop: '4px' }}>
                            <Clock size={10} /> Phòng: {item.phongHoc}
                          </div>
                          <div className="schedule-slot-desc">
                            GV: {item.lopHocPhan?.giangVien?.nguoiDung?.hoTen || 'Chưa phân công'}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
