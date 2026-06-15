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
