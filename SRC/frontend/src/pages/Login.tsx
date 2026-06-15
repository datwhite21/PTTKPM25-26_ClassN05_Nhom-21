import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axios';
import { GraduationCap, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (user: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const userData = response.data;
      
      // Store in local storage
      localStorage.setItem('user', JSON.stringify(userData));
      onLoginSuccess(userData);

      // Redirect based on role
      if (userData.vaiTro === 'GIAO_VU') {
        navigate('/admin/course-sections');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 73px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: 'radial-gradient(circle at top right, rgba(99, 102, 241, 0.08), transparent 40%), radial-gradient(circle at bottom left, rgba(139, 92, 246, 0.08), transparent 40%)'
    }}>
      <div className="card card-glass" style={{
        width: '100%',
        maxWidth: '450px',
        padding: '40px',
        borderRadius: 'var(--border-radius-xl)',
        boxShadow: 'var(--shadow-xl)',
        textAlign: 'center',
      }}>
        {/* Brand Icon */}
        <div style={{
          width: '64px',
          height: '64px',
          background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
          color: '#ffffff',
          borderRadius: 'var(--border-radius-lg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          boxShadow: '0 8px 24px rgba(99, 102, 241, 0.25)'
        }}>
          <GraduationCap size={36} />
        </div>

        <h1 style={{
          fontSize: '26px',
          fontWeight: '800',
          marginBottom: '8px',
          fontFamily: 'var(--font-display)'
        }}>
          Đăng Nhập Hệ Thống
        </h1>
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '14px',
          marginBottom: '32px'
        }}>
          Cổng Đăng Ký Học Phần & Tín Chỉ Nhóm 21
        </p>

        {error && (
          <div className="alert alert-danger" style={{ textAlign: 'left' }}>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
          {/* Email input */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              marginBottom: '6px',
              color: 'var(--text-secondary)'
            }}>
              Email trường học
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                placeholder="sv1@school.edu.vn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ paddingLeft: '44px' }}
              />
              <Mail size={18} style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-tertiary)'
              }} />
            </div>
          </div>

          {/* Password input */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              marginBottom: '6px',
              color: 'var(--text-secondary)'
            }}>
              Mật khẩu
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingLeft: '44px' }}
              />
              <Lock size={18} style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-tertiary)'
              }} />
            </div>
          </div>

          {/* Sign In button */}
          <button type="submit" className="btn btn-primary" disabled={loading} style={{
            marginTop: '10px',
            width: '100%',
            height: '46px',
            fontSize: '15px'
          }}>
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Đang xử lý...</span>
              </>
            ) : (
              <>
                <span>ĐĂNG NHẬP</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Demo Hints */}
        <div style={{
          marginTop: '32px',
          padding: '16px',
          backgroundColor: 'var(--bg-tertiary)',
          borderRadius: 'var(--border-radius-md)',
          fontSize: '12px',
          color: 'var(--text-secondary)',
          textAlign: 'left',
          border: '1px dashed var(--border-color)'
        }}>
          <strong style={{ display: 'block', marginBottom: '4px', color: 'var(--text-primary)' }}>
            💡 Tài khoản thử nghiệm (Seeds):
          </strong>
          Sinh viên: <code>sv1@school.edu.vn</code> (Mật khẩu: <code>123456</code>)<br />
          Giáo vụ: <code>admin1@school.edu.vn</code> (Mật khẩu: <code>123456</code>)
        </div>
      </div>
    </div>
  );
};

export default Login;
