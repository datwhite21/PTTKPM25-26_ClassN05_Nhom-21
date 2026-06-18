import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axios';
import { CreditCard, ArrowLeft, Loader2, DollarSign, CheckCircle2, AlertCircle, QrCode, X } from 'lucide-react';

interface UserData {
  id: number;
  email: string;
  hoTen: string;
  vaiTro: string;
  sinhVienId: number;
  maSV: string;
}

interface HoaDonHocPhi {
  id: number;
  hocKy: string;
  tongTinChi: number;
  tongTien: number;
  trangThai: string; // CHUA_THANH_TOAN, DA_THANH_TOAN
  ngayThanhToan: string | null;
}

const TuitionPayment: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [invoices, setInvoices] = useState<HoaDonHocPhi[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Modal state
  const [selectedInvoice, setSelectedInvoice] = useState<HoaDonHocPhi | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);

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
    loadInvoices(parsedUser.sinhVienId);
  }, [navigate]);

  const loadInvoices = async (studentId: number) => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.get(`/hoc-phi/student/${studentId}`);
      setInvoices(res.data || []);
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách hóa đơn học phí!');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPayment = (invoice: HoaDonHocPhi) => {
    setSelectedInvoice(invoice);
    setShowQRModal(true);
  };

  const handleClosePayment = () => {
    setSelectedInvoice(null);
    setShowQRModal(false);
  };

  const handleConfirmPayment = async () => {
    if (!selectedInvoice || !user) return;
    
    try {
      setPaymentLoading(true);
      setError(null);
      setSuccess(null);
      await apiClient.post(`/hoc-phi/pay/${selectedInvoice.id}`);
      setSuccess(`Thanh toán thành công cho học kỳ: ${selectedInvoice.hocKy}`);
      setShowQRModal(false);
      setSelectedInvoice(null);
      await loadInvoices(user.sinhVienId);
    } catch (err: any) {
      setError(err.message || 'Giao dịch thanh toán thất bại!');
      setShowQRModal(false);
      setSelectedInvoice(null);
    } finally {
      setPaymentLoading(false);
    }
  };

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', gap: '10px' }}>
        <Loader2 className="animate-spin" size={32} style={{ color: 'var(--accent-primary)' }} />
        <span style={{ fontWeight: 600 }}>Đang tải thông tin học phí...</span>
      </div>
    );
  }

  // Calculate totals
  const unpaidInvoices = invoices.filter(i => i.trangThai === 'CHUA_THANH_TOAN');
  const totalUnpaidAmount = unpaidInvoices.reduce((sum, i) => sum + i.tongTien, 0);

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
          <CreditCard size={28} style={{ color: 'var(--accent-primary)' }} />
          <span>Thanh Toán Học Phí</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
          Theo dõi công nợ học phí và thanh toán học phí qua phương thức quét mã QR Ngân hàng (giả lập).
        </p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        {/* Unpaid Card */}
        <div className="card card-glass" style={{ borderLeft: '4px solid var(--color-danger, #ef4444)', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 600 }}>TỔNG HỌC PHÍ CHƯA THANH TOÁN</span>
              <h2 style={{ fontSize: '30px', fontWeight: '800', marginTop: '8px', color: 'var(--text-primary)' }}>
                {formatVND(totalUnpaidAmount)}
              </h2>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-danger, #ef4444)'
            }}>
              <DollarSign size={24} />
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="card card-glass" style={{ borderLeft: '4px solid var(--accent-primary)', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 600 }}>ĐƠN GIÁ HỌC PHÍ</span>
              <h2 style={{ fontSize: '24px', fontWeight: '800', marginTop: '8px', color: 'var(--text-primary)' }}>
                {formatVND(500000)} / Tín chỉ
              </h2>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'rgba(99, 102, 241, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-primary)'
            }}>
              <AlertCircle size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Table Card */}
      <div className="card" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: 'var(--text-secondary)' }}>
          DANH SÁCH HÓA ĐƠN HỌC PHÍ
        </h3>

        {invoices.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Không tìm thấy hóa đơn học phí nào cho sinh viên này.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                  <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontWeight: 600 }}>Học Kỳ</th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontWeight: 600 }}>Tổng Tín Chỉ</th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontWeight: 600 }}>Số Tiền</th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontWeight: 600 }}>Trạng Thái</th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontWeight: 600 }}>Ngày Thanh Toán</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', color: 'var(--text-secondary)', fontWeight: 600 }}>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map(invoice => (
                  <tr key={invoice.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.2s' }}>
                    <td style={{ padding: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>{invoice.hocKy}</td>
                    <td style={{ padding: '16px', color: 'var(--text-primary)' }}>{invoice.tongTinChi} TC</td>
                    <td style={{ padding: '16px', color: 'var(--text-primary)', fontWeight: 600 }}>{formatVND(invoice.tongTien)}</td>
                    <td style={{ padding: '16px' }}>
                      <span className={`badge ${invoice.trangThai === 'DA_THANH_TOAN' ? 'badge-success' : 'badge-danger'}`}>
                        {invoice.trangThai === 'DA_THANH_TOAN' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                      </span>
                    </td>
                    <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>
                      {invoice.ngayThanhToan ? new Date(invoice.ngayThanhToan).toLocaleString('vi-VN') : '-'}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      {invoice.trangThai === 'CHUA_THANH_TOAN' && invoice.tongTien > 0 ? (
                        <button
                          onClick={() => handleOpenPayment(invoice)}
                          className="btn btn-primary"
                          style={{
                            padding: '6px 14px',
                            fontSize: '12px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <QrCode size={14} />
                          <span>Thanh toán</span>
                        </button>
                      ) : (
                        <span style={{ color: 'var(--text-tertiary)', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={14} style={{ color: 'var(--color-success, #22c55e)' }} />
                          Hoàn tất
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* QR payment mockup modal */}
      {showQRModal && selectedInvoice && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="card" style={{
            width: '90%',
            maxWidth: '420px',
            position: 'relative',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            border: '1px solid var(--border-color)',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 20px',
              borderBottom: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-secondary)'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <QrCode size={18} style={{ color: 'var(--accent-primary)' }} />
                <span>Chuyển Khoản Học Phí</span>
              </h3>
              <button 
                onClick={handleClosePayment} 
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                Vui lòng dùng ứng dụng Ngân hàng (Banking) quét mã QR bên dưới để thực hiện thanh toán tự động hoặc chuyển khoản tay.
              </div>

              {/* QR Code Graphic Mockup */}
              <div style={{
                padding: '12px',
                backgroundColor: '#fff',
                borderRadius: '12px',
                boxShadow: 'var(--shadow-md)',
                display: 'inline-block'
              }}>
                <svg width="200" height="200" viewBox="0 0 100 100" style={{ display: 'block' }}>
                  {/* Outer border & markers */}
                  <rect x="5" y="5" width="20" height="20" fill="none" stroke="#0f172a" strokeWidth="4" />
                  <rect x="9" y="9" width="12" height="12" fill="#0f172a" />
                  <rect x="75" y="5" width="20" height="20" fill="none" stroke="#0f172a" strokeWidth="4" />
                  <rect x="79" y="9" width="12" height="12" fill="#0f172a" />
                  <rect x="5" y="75" width="20" height="20" fill="none" stroke="#0f172a" strokeWidth="4" />
                  <rect x="9" y="79" width="12" height="12" fill="#0f172a" />
                  
                  {/* Inside fake QR bits */}
                  <rect x="35" y="5" width="6" height="6" fill="#0f172a" />
                  <rect x="45" y="10" width="8" height="4" fill="#0f172a" />
                  <rect x="60" y="5" width="4" height="12" fill="#0f172a" />
                  <rect x="35" y="25" width="12" height="6" fill="#0f172a" />
                  <rect x="55" y="20" width="14" height="6" fill="#0f172a" />
                  <rect x="5" y="35" width="8" height="6" fill="#0f172a" />
                  <rect x="20" y="40" width="18" height="4" fill="#0f172a" />
                  <rect x="45" y="35" width="12" height="12" fill="#0f172a" />
                  <rect x="65" y="30" width="8" height="14" fill="#0f172a" />
                  <rect x="80" y="35" width="15" height="4" fill="#0f172a" />
                  
                  <rect x="5" y="55" width="14" height="8" fill="#0f172a" />
                  <rect x="25" y="50" width="8" height="18" fill="#0f172a" />
                  <rect x="40" y="60" width="22" height="6" fill="#0f172a" />
                  <rect x="70" y="55" width="6" height="6" fill="#0f172a" />
                  <rect x="85" y="50" width="10" height="10" fill="#0f172a" />
                  
                  <rect x="35" y="75" width="14" height="4" fill="#0f172a" />
                  <rect x="55" y="70" width="6" height="18" fill="#0f172a" />
                  <rect x="70" y="80" width="25" height="6" fill="#0f172a" />
                  <rect x="80" y="70" width="10" height="4" fill="#0f172a" />
                  
                  <rect x="35" y="85" width="6" height="10" fill="#0f172a" />
                  <rect x="45" y="90" width="8" height="6" fill="#0f172a" />
                  
                  {/* Center branding icon */}
                  <rect x="42" y="42" width="16" height="16" rx="4" fill="var(--accent-primary, #6366f1)" />
                  <path d="M47 50 L53 50 M50 47 L50 53" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>

              {/* Transfer Details */}
              <div style={{
                width: '100%',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '8px',
                padding: '12px 16px',
                fontSize: '13px',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Ngân hàng:</span>
                  <strong style={{ color: 'var(--text-primary)' }}>BIDV Chi nhánh Hà Nội</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Số tài khoản:</span>
                  <strong style={{ color: 'var(--text-primary)' }}>1234 5678 90</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Tên thụ hưởng:</span>
                  <strong style={{ color: 'var(--text-primary)' }}>TRUONG DAI HOC N21</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Số tiền chuyển:</span>
                  <strong style={{ color: 'var(--accent-primary)', fontSize: '15px' }}>{formatVND(selectedInvoice.tongTien)}</strong>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', borderTop: '1px solid var(--border-color)', paddingTop: '6px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Nội dung chuyển khoản:</span>
                  <strong style={{ color: 'var(--text-primary)', wordBreak: 'break-all' }}>
                    {user?.maSV} THANH TOAN HOC PHI
                  </strong>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              display: 'flex',
              gap: '12px',
              padding: '16px 20px',
              borderTop: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-secondary)'
            }}>
              <button 
                onClick={handleClosePayment} 
                className="btn btn-secondary" 
                style={{ flex: 1, padding: '10px' }}
                disabled={paymentLoading}
              >
                Hủy bỏ
              </button>
              <button 
                onClick={handleConfirmPayment} 
                className="btn btn-primary" 
                style={{ flex: 1.5, padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                disabled={paymentLoading}
              >
                {paymentLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <span>Xác nhận chuyển khoản</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TuitionPayment;
