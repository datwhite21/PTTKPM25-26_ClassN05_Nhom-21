import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, GraduationCap, ShieldAlert } from 'lucide-react';

interface NavbarProps {
  user: {
    hoTen: string;
    vaiTro: string;
    email: string;
  } | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 24px',
      backgroundColor: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border-color)',
      boxShadow: 'var(--shadow-sm)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Brand Logo & Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => {
        if (user) {
          navigate(user.vaiTro === 'SINH_VIEN' ? '/student/dashboard' : '/admin/course-sections');
        }
      }}>
        <div style={{
          background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
          color: '#fff',
          width: '40px',
          height: '40px',
          borderRadius: 'var(--border-radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-glow)'
        }}>
          <GraduationCap size={24} />
        </div>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '800', lineHeight: 1.2, fontFamily: 'var(--font-display)' }}>
            N21 REGISTRATION
          </h2>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 500 }}>
            Học phần & Tín chỉ
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      {user && user.vaiTro === 'SINH_VIEN' && (
        <div style={{ display: 'flex', gap: '20px' }}>
          <button 
            onClick={() => navigate('/student/dashboard')} 
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: 'var(--text-secondary)', 
              fontWeight: 600, 
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'var(--transition-smooth)'
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = 'var(--accent-primary)')}
            onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            Thời khóa biểu
          </button>
          <button 
            onClick={() => navigate('/student/study-plan')} 
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: 'var(--text-secondary)', 
              fontWeight: 600, 
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'var(--transition-smooth)'
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = 'var(--accent-primary)')}
            onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            Chương trình đào tạo
          </button>
          <button 
            onClick={() => navigate('/student/results')} 
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: 'var(--text-secondary)', 
              fontWeight: 600, 
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'var(--transition-smooth)'
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = 'var(--accent-primary)')}
            onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            Kết quả học tập
          </button>
          <button 
            onClick={() => navigate('/student/registration')} 
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: 'var(--text-secondary)', 
              fontWeight: 600, 
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'var(--transition-smooth)'
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = 'var(--accent-primary)')}
            onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            Đăng ký học
          </button>
          <button 
            onClick={() => navigate('/student/waitlist')} 
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: 'var(--text-secondary)', 
              fontWeight: 600, 
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'var(--transition-smooth)'
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = 'var(--accent-primary)')}
            onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            Hàng chờ đăng ký
          </button>
          <button 
            onClick={() => navigate('/student/tuition')} 
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: 'var(--text-secondary)', 
              fontWeight: 600, 
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'var(--transition-smooth)'
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = 'var(--accent-primary)')}
            onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            Học phí
          </button>
        </div>
      )}

      {/* Navigation Links for Admin */}
      {user && user.vaiTro === 'GIAO_VU' && (
        <div style={{ display: 'flex', gap: '20px' }}>
          <button 
            onClick={() => navigate('/admin/course-sections')} 
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: 'var(--text-secondary)', 
              fontWeight: 600, 
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'var(--transition-smooth)'
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = 'var(--accent-primary)')}
            onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            Lớp học phần
          </button>
          <button 
            onClick={() => navigate('/admin/management')} 
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: 'var(--text-secondary)', 
              fontWeight: 600, 
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'var(--transition-smooth)'
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = 'var(--accent-primary)')}
            onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            Quản lý danh mục
          </button>
          <button 
            onClick={() => navigate('/admin/stats')} 
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: 'var(--text-secondary)', 
              fontWeight: 600, 
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'var(--transition-smooth)'
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = 'var(--accent-primary)')}
            onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            Báo cáo & Thống kê
          </button>
        </div>
      )}

      {/* User Actions */}
      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-tertiary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-primary)'
            }}>
              {user.vaiTro === 'GIAO_VU' ? <ShieldAlert size={20} /> : <User size={20} />}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
              <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>
                {user.hoTen}
              </span>
              <span style={{
                fontSize: '11px',
                fontWeight: '700',
                color: user.vaiTro === 'GIAO_VU' ? 'var(--color-danger)' : 'var(--accent-primary)',
                letterSpacing: '0.05em'
              }}>
                {user.vaiTro === 'GIAO_VU' ? 'GIÁO VỤ (ADMIN)' : 'SINH VIÊN'}
              </span>
            </div>
          </div>

          <button onClick={handleLogout} className="btn btn-secondary" style={{
            padding: '8px 14px',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <LogOut size={16} />
            <span>Đăng xuất</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
