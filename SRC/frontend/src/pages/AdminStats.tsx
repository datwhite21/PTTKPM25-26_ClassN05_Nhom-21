import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axios';
import { BarChart3, ArrowLeft, Loader2, Download, AlertTriangle, AlertCircle, Users } from 'lucide-react';

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
  siSoToiThieu: number;
  siSoToiDa: number;
  trangThai: string;
}

const AdminStats: React.FC = () => {
  const [sections, setSections] = useState<LopHocPhan[]>([]);
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
    if (parsedUser.vaiTro !== 'GIAO_VU') {
      navigate('/student/dashboard');
      return;
    }
    loadSections();
  }, [navigate]);

  const loadSections = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.get('/admin/course-sections');
      setSections(res.data || []);
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách lớp học phần!');
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = (title: string, list: LopHocPhan[]) => {
    const BOM = "\uFEFF";
    let csvContent = "Mã Lớp,Tên Môn Học,Giảng Viên,Sĩ Số Hiện Tại,Sĩ Số Tối Thiểu,Sĩ Số Tối Đa,Trạng Thái\n";
    list.forEach(lop => {
      const lecturer = lop.giangVien?.nguoiDung?.hoTen || 'Chưa phân công';
      csvContent += `"${lop.maLopHP}","${lop.monHoc?.tenMon}","${lecturer}",${lop.siSoHienTai},${lop.siSoToiThieu || 10},${lop.siSoToiDa},"${lop.trangThai}"\n`;
    });

    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', gap: '10px' }}>
        <Loader2 className="animate-spin" size={32} style={{ color: 'var(--accent-primary)' }} />
        <span style={{ fontWeight: 600 }}>Đang tải báo cáo thống kê...</span>
      </div>
    );
  }

  // Filter sections
  const underCapacity = sections.filter(s => s.siSoHienTai < (s.siSoToiThieu || 10));
  const overCapacity = sections.filter(s => s.siSoHienTai >= s.siSoToiDa);

  return (
    <div className="container">
      <button 
        onClick={() => navigate('/admin/course-sections')}
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
        <span>Quay lại Quản lý lớp</span>
      </button>

      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <BarChart3 size={28} style={{ color: 'var(--accent-primary)' }} />
          <span>Báo Cáo & Thống Kê Lớp Học Phần</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
          Xem thống kê các lớp học phần thiếu sĩ số tối thiểu (nguy cơ hủy lớp) và đầy sĩ số tối đa. Xuất báo cáo CSV phục vụ lưu trữ.
        </p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Summary Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        {/* Total Class Sections */}
        <div className="card card-glass" style={{ borderLeft: '4px solid var(--accent-primary)', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>TỔNG LỚP HỌC PHẦN</span>
              <h2 style={{ fontSize: '28px', fontWeight: '800', marginTop: '4px', color: 'var(--text-primary)' }}>{sections.length}</h2>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
              <Users size={20} style={{ margin: 'auto' }} />
            </div>
          </div>
        </div>

        {/* Under Capacity */}
        <div className="card card-glass" style={{ borderLeft: '4px solid var(--color-warning, #f59e0b)', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>LỚP THIẾU SĨ SỐ (&lt; 10)</span>
              <h2 style={{ fontSize: '28px', fontWeight: '800', marginTop: '4px', color: 'var(--color-warning, #f59e0b)' }}>{underCapacity.length}</h2>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-warning, #f59e0b)' }}>
              <AlertTriangle size={20} style={{ margin: 'auto' }} />
            </div>
          </div>
        </div>

        {/* Over Capacity */}
        <div className="card card-glass" style={{ borderLeft: '4px solid var(--color-danger, #ef4444)', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>LỚP ĐÃ ĐẦY SĨ SỐ</span>
              <h2 style={{ fontSize: '28px', fontWeight: '800', marginTop: '4px', color: 'var(--color-danger, #ef4444)' }}>{overCapacity.length}</h2>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-danger, #ef4444)' }}>
              <AlertCircle size={20} style={{ margin: 'auto' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Under Capacity Sections */}
      <div className="card" style={{ padding: '20px', marginBottom: '28px', borderTop: '4px solid var(--color-warning, #f59e0b)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} style={{ color: 'var(--color-warning, #f59e0b)' }} />
            <span>Lớp học phần thiếu sĩ số tối thiểu (Cần xem xét hủy lớp)</span>
          </h3>
          <button 
            onClick={() => downloadCSV('Lop_thieu_si_so_toi_thieu', underCapacity)}
            className="btn btn-secondary" 
            disabled={underCapacity.length === 0}
            style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Download size={14} />
            <span>Xuất CSV</span>
          </button>
        </div>

        {underCapacity.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Không có lớp học phần nào dưới sĩ số tối thiểu.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                  <th style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>Mã Lớp</th>
                  <th style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>Môn Học</th>
                  <th style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>Giảng Viên</th>
                  <th style={{ padding: '10px 12px', color: 'var(--text-secondary)', textAlign: 'center' }}>Sĩ Số</th>
                  <th style={{ padding: '10px 12px', color: 'var(--text-secondary)', textAlign: 'center' }}>Tối Thiểu</th>
                  <th style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>Trạng Thái</th>
                </tr>
              </thead>
              <tbody>
                {underCapacity.map(lop => (
                  <tr key={lop.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px 10px', fontWeight: 600, color: 'var(--text-primary)' }}>{lop.maLopHP}</td>
                    <td style={{ padding: '12px 10px', color: 'var(--text-primary)' }}>{lop.monHoc?.tenMon}</td>
                    <td style={{ padding: '12px 10px', color: 'var(--text-primary)' }}>{lop.giangVien?.nguoiDung?.hoTen || 'Chưa phân công'}</td>
                    <td style={{ padding: '12px 10px', textAlign: 'center', color: 'var(--color-warning, #f59e0b)', fontWeight: 700 }}>{lop.siSoHienTai}</td>
                    <td style={{ padding: '12px 10px', textAlign: 'center', color: 'var(--text-secondary)' }}>{lop.siSoToiThieu || 10}</td>
                    <td style={{ padding: '12px 10px' }}>
                      <span className="badge badge-info">{lop.trangThai}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Over Capacity / Full Sections */}
      <div className="card" style={{ padding: '20px', borderTop: '4px solid var(--color-danger, #ef4444)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={18} style={{ color: 'var(--color-danger, #ef4444)' }} />
            <span>Lớp học phần đã đầy sĩ số tối đa</span>
          </h3>
          <button 
            onClick={() => downloadCSV('Lop_day_si_so_toi_da', overCapacity)}
            className="btn btn-secondary" 
            disabled={overCapacity.length === 0}
            style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Download size={14} />
            <span>Xuất CSV</span>
          </button>
        </div>

        {overCapacity.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Không có lớp học phần nào đã đầy sĩ số.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                  <th style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>Mã Lớp</th>
                  <th style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>Môn Học</th>
                  <th style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>Giảng Viên</th>
                  <th style={{ padding: '10px 12px', color: 'var(--text-secondary)', textAlign: 'center' }}>Sĩ Số</th>
                  <th style={{ padding: '10px 12px', color: 'var(--text-secondary)', textAlign: 'center' }}>Tối Đa</th>
                  <th style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>Trạng Thái</th>
                </tr>
              </thead>
              <tbody>
                {overCapacity.map(lop => (
                  <tr key={lop.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px 10px', fontWeight: 600, color: 'var(--text-primary)' }}>{lop.maLopHP}</td>
                    <td style={{ padding: '12px 10px', color: 'var(--text-primary)' }}>{lop.monHoc?.tenMon}</td>
                    <td style={{ padding: '12px 10px', color: 'var(--text-primary)' }}>{lop.giangVien?.nguoiDung?.hoTen || 'Chưa phân công'}</td>
                    <td style={{ padding: '12px 10px', textAlign: 'center', color: 'var(--color-danger, #ef4444)', fontWeight: 700 }}>{lop.siSoHienTai}</td>
                    <td style={{ padding: '12px 10px', textAlign: 'center', color: 'var(--text-secondary)' }}>{lop.siSoToiDa}</td>
                    <td style={{ padding: '12px 10px' }}>
                      <span className="badge badge-info">{lop.trangThai}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminStats;
