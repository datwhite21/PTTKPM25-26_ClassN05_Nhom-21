import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axios';
import { Plus, Edit3, Trash2, X, Check, AlertCircle, Loader2 } from 'lucide-react';

interface UserData {
  id: number;
  email: string;
  hoTen: string;
  vaiTro: string;
}

interface MonHoc {
  id: number;
  maMon: string;
  tenMon: string;
  soTinChi: number;
}

interface GiangVien {
  id: number;
  maGV: string;
  nguoiDung: {
    hoTen: string;
  };
}

interface DotDangKy {
  id: number;
  tenDot: string;
  trangThaiMo: boolean;
}

interface LopHocPhan {
  id: number;
  maLopHP: string;
  siSoHienTai: number;
  siSoToiDa: number;
  siSoToiThieu: number;
  trangThai: string;
  monHoc: MonHoc;
  giangVien: GiangVien;
  dotDangKy: DotDangKy;
  dsLichHoc?: {
    id?: number;
    thu: number;
    tietBatDau: number;
    tietKetThuc: number;
    phongHoc: string;
  }[];
}

const AdminCourseSections: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [sections, setSections] = useState<LopHocPhan[]>([]);
  const [courses, setCourses] = useState<MonHoc[]>([]);
  const [lecturers, setLecturers] = useState<GiangVien[]>([]);
  const [periods, setPeriods] = useState<DotDangKy[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formMaLop, setFormMaLop] = useState('');
  const [formSiSoToiDa, setFormSiSoToiDa] = useState(40);
  const [formSiSoToiThieu, setFormSiSoToiThieu] = useState(10);
  const [formSiSoHienTai, setFormSiSoHienTai] = useState(0);
  const [formTrangThai, setFormTrangThai] = useState('MOI_TAO');
  const [formMonHocId, setFormMonHocId] = useState('');
  const [formGiangVienId, setFormGiangVienId] = useState('');
  const [formDotId, setFormDotId] = useState('');
  const [formSessions, setFormSessions] = useState<{ thu: number; tietBatDau: number; tietKetThuc: number; phongHoc: string; }[]>([]);
  
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
    setUser(parsedUser);
    loadAllData();
  }, [navigate]);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [secRes, courRes, lectRes, perRes] = await Promise.all([
        apiClient.get('/admin/course-sections'),
        apiClient.get('/admin/mon-hoc'),
        apiClient.get('/admin/giang-vien'),
        apiClient.get('/admin/dot-dang-ky')
      ]);

      setSections(secRes.data);
      setCourses(courRes.data);
      setLecturers(lectRes.data);
      setPeriods(perRes.data);

      if (courRes.data.length > 0) setFormMonHocId(courRes.data[0].id.toString());
      if (lectRes.data.length > 0) setFormGiangVienId(lectRes.data[0].id.toString());
      if (perRes.data.length > 0) setFormDotId(perRes.data[0].id.toString());
    } catch (err: any) {
      setError(err.message || 'Không thể tải dữ liệu giáo vụ!');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormMaLop('');
    setFormSiSoToiDa(40);
    setFormSiSoToiThieu(10);
    setFormSiSoHienTai(0);
    setFormTrangThai('MOI_TAO');
    if (courses.length > 0) setFormMonHocId(courses[0].id.toString());
    if (lecturers.length > 0) setFormGiangVienId(lecturers[0].id.toString());
    if (periods.length > 0) setFormDotId(periods[0].id.toString());
    setFormSessions([]);
    setModalOpen(true);
  };

  const openEditModal = (lop: LopHocPhan) => {
    setEditingId(lop.id);
    setFormMaLop(lop.maLopHP);
    setFormSiSoToiDa(lop.siSoToiDa);
    setFormSiSoToiThieu(lop.siSoToiThieu || 10);
    setFormSiSoHienTai(lop.siSoHienTai);
    setFormTrangThai(lop.trangThai);
    setFormMonHocId(lop.monHoc?.id?.toString() || '');
    setFormGiangVienId(lop.giangVien?.id?.toString() || '');
    setFormDotId(lop.dotDangKy?.id?.toString() || '');
    setFormSessions(lop.dsLichHoc ? lop.dsLichHoc.map(lh => ({
      thu: lh.thu,
      tietBatDau: lh.tietBatDau,
      tietKetThuc: lh.tietKetThuc,
      phongHoc: lh.phongHoc
    })) : []);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const payload = {
      maLopHP: formMaLop,
      siSoToiDa: Number(formSiSoToiDa),
      siSoToiThieu: Number(formSiSoToiThieu),
      siSoHienTai: formSiSoHienTai,
      trangThai: formTrangThai,
      monHoc: { id: Number(formMonHocId) },
      giangVien: { id: Number(formGiangVienId) },
      dotDangKy: { id: Number(formDotId) },
      dsLichHoc: formSessions
    };

    try {
      if (editingId) {
        await apiClient.put(`/admin/course-sections/${editingId}`, payload);
        setSuccess(`Cập nhật lớp học phần ${formMaLop} thành công!`);
      } else {
        await apiClient.post('/admin/course-sections', payload);
        setSuccess(`Tạo mới lớp học phần ${formMaLop} thành công!`);
      }
      setModalOpen(false);
      loadAllData();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Lỗi khi lưu lớp học phần!');
    }
  };

  const handleDelete = async (id: number, maLop: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa lớp học phần ${maLop}? Hành động này không thể hoàn tác!`)) return;

    setError(null);
    setSuccess(null);

    try {
      await apiClient.delete(`/admin/course-sections/${id}`);
      setSuccess(`Đã xóa thành công lớp học phần ${maLop}.`);
      loadAllData();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Không thể xóa lớp học phần này (có thể lớp học phần đã có sinh viên đăng ký).');
    }
  };

  const getTrangThaiBadge = (trangThai: string) => {
    switch (trangThai) {
      case 'MOI_TAO':
        return <span className="badge badge-info">Mới tạo</span>;
      case 'MO_DANG_KY':
        return <span className="badge badge-success">Mở đăng ký</span>;
      case 'DONG_DANG_KY':
        return <span className="badge badge-warning">Đóng đăng ký</span>;
      case 'HUY_LOP':
        return <span className="badge badge-danger">Bị hủy</span>;
      case 'DANG_HOC':
        return <span className="badge badge-success">Đang học</span>;
      case 'KET_THUC':
        return <span className="badge badge-secondary">Kết thúc</span>;
      default:
        return <span className="badge badge-secondary">{trangThai}</span>;
    }
  };

  return (
    <div className="container">
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px' }}>Bảng Điều Khiển Giáo Vụ {user ? `- ${user.hoTen}` : ''}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            Quản lý danh sách, sĩ số và trạng thái của các lớp học phần
          </p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Plus size={18} />
          <span>TẠO LỚP HỌC PHẦN MỚI</span>
        </button>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger" style={{ whiteSpace: 'pre-line' }}>{error}</div>}

      {/* Classes Table */}
      <div className="card" style={{ padding: '0px', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '16px' }}>Danh sách lớp học phần hệ thống</h3>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px', gap: '8px' }}>
            <Loader2 className="animate-spin" size={24} style={{ color: 'var(--accent-primary)' }} />
            <span>Đang tải danh sách lớp...</span>
          </div>
        ) : sections.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <AlertCircle size={36} style={{ color: 'var(--text-tertiary)', marginBottom: '8px' }} />
            <p>Chưa có lớp học phần nào được khởi tạo!</p>
          </div>
        ) : (
          <div className="table-container" style={{ border: 'none', boxShadow: 'none', borderRadius: 0 }}>
            <table>
              <thead>
                <tr>
                  <th>Mã Lớp HP</th>
                  <th>Môn Học</th>
                  <th>Số TC</th>
                  <th>Giảng Viên</th>
                  <th>Đợt Đăng Ký</th>
                  <th>Lịch Học</th>
                  <th>Sĩ Số (Min/Max)</th>
                  <th>Trạng Thái</th>
                  <th style={{ textAlign: 'center' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {sections.map(lop => (
                  <tr key={lop.id}>
                    <td style={{ fontWeight: '600' }}>{lop.maLopHP}</td>
                    <td>
                      <div style={{ fontWeight: '600' }}>{lop.monHoc?.tenMon}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Mã môn: {lop.monHoc?.maMon}</div>
                    </td>
                    <td style={{ fontWeight: '600' }}>{lop.monHoc?.soTinChi} TC</td>
                    <td>{lop.giangVien?.nguoiDung?.hoTen || 'Chưa phân công'}</td>
                    <td>{lop.dotDangKy?.tenDot || 'Chưa gán'}</td>
                    <td>
                      {lop.dsLichHoc && lop.dsLichHoc.length > 0 ? (
                        lop.dsLichHoc.map((lh, idx) => (
                          <div key={idx} style={{ fontSize: '12px' }}>
                            Thứ {lh.thu === 8 ? 'CN' : lh.thu} (Tiết {lh.tietBatDau}-{lh.tietKetThuc}) [{lh.phongHoc}]
                          </div>
                        ))
                      ) : (
                        <span style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}>Chưa xếp lịch</span>
                      )}
                    </td>
                    <td>
                      <span style={{ fontWeight: '600' }}>{lop.siSoHienTai}</span> / {lop.siSoToiDa} <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>(Min: {lop.siSoToiThieu})</span>
                      {lop.siSoHienTai < (lop.siSoToiThieu || 10) && (
                        <div style={{ color: 'var(--color-danger)', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '4px' }}>
                          <AlertCircle size={12} />
                          <span>Dưới chỉ tiêu</span>
                        </div>
                      )}
                    </td>
                    <td>{getTrangThaiBadge(lop.trangThai)}</td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button
                          className="btn btn-secondary"
                          onClick={() => openEditModal(lop)}
                          style={{ padding: '6px 10px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Edit3 size={14} />
                          <span>Sửa</span>
                        </button>
                        <button
                          className="btn btn-secondary"
                          onClick={() => handleDelete(lop.id, lop.maLopHP)}
                          style={{
                            padding: '6px 10px',
                            fontSize: '13px',
                            color: 'var(--color-danger)',
                            borderColor: 'var(--color-danger-border)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Trash2 size={14} />
                          <span>Xóa</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CRUD Modal Dialog */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px' }}>
                {editingId ? `Chỉnh Sửa Lớp: ${formMaLop}` : 'Tạo Mới Lớp Học Phần'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Row 1: Code, Max Size, Min Size */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                    Mã Lớp Học Phần
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: INT3110_L01"
                    value={formMaLop}
                    onChange={(e) => setFormMaLop(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                    Sĩ số tối thiểu
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formSiSoToiThieu}
                    onChange={(e) => setFormSiSoToiThieu(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                    Sĩ số tối đa
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formSiSoToiDa}
                    onChange={(e) => setFormSiSoToiDa(Number(e.target.value))}
                  />
                </div>
              </div>

              {/* Row 2: Course selection */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                  Môn học liên kết
                </label>
                <select value={formMonHocId} onChange={(e) => setFormMonHocId(e.target.value)} required>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.tenMon} ({c.maMon} - {c.soTinChi} TC)
                    </option>
                  ))}
                </select>
              </div>

              {/* Row 3: Lecturer selection */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                  Giảng viên phụ trách
                </label>
                <select value={formGiangVienId} onChange={(e) => setFormGiangVienId(e.target.value)} required>
                  {lecturers.map(g => (
                    <option key={g.id} value={g.id}>
                      {g.nguoiDung?.hoTen} ({g.maGV})
                    </option>
                  ))}
                </select>
              </div>

              {/* Row 4: Registration Period */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                  Đợt đăng ký tín chỉ
                </label>
                <select value={formDotId} onChange={(e) => setFormDotId(e.target.value)} required>
                  {periods.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.tenDot} {p.trangThaiMo ? '[ĐANG MỞ]' : '[ĐÃ ĐÓNG]'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Row 5: Status selection */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                  Trạng thái lớp học phần
                </label>
                <select value={formTrangThai} onChange={(e) => setFormTrangThai(e.target.value)} required>
                  <option value="MOI_TAO">Mới tạo (Chưa hiển thị đăng ký)</option>
                  <option value="MO_DANG_KY">Mở đăng ký</option>
                  <option value="DONG_DANG_KY">Đóng đăng ký</option>
                  <option value="HUY_LOP">Hủy lớp</option>
                  <option value="DANG_HOC">Đang học</option>
                  <option value="KET_THUC">Kết thúc</option>
                </select>
              </div>

              {/* Timetable schedule config */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>
                    Lịch học tuần (Chi tiết buổi học)
                  </label>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setFormSessions([...formSessions, { thu: 2, tietBatDau: 1, tietKetThuc: 3, phongHoc: 'A1-101' }])}
                    style={{ padding: '6px 12px', fontSize: '12px' }}
                  >
                    + Thêm buổi học
                  </button>
                </div>

                {formSessions.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)', fontSize: '13px', fontStyle: 'italic', textAlign: 'center', padding: '12px 0' }}>
                    Chưa thiết lập buổi học nào cho lớp học phần này.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {formSessions.map((session, index) => (
                      <div key={index} style={{
                        display: 'grid',
                        gridTemplateColumns: '1.2fr 1fr 1fr 1.5fr auto',
                        gap: '8px',
                        alignItems: 'center',
                        backgroundColor: 'var(--bg-tertiary)',
                        padding: '8px',
                        borderRadius: 'var(--border-radius-sm)'
                      }}>
                        <div>
                          <select
                            value={session.thu}
                            onChange={(e) => {
                              const updated = [...formSessions];
                              updated[index].thu = Number(e.target.value);
                              setFormSessions(updated);
                            }}
                            style={{ padding: '6px', fontSize: '13px' }}
                          >
                            <option value={2}>Thứ 2</option>
                            <option value={3}>Thứ 3</option>
                            <option value={4}>Thứ 4</option>
                            <option value={5}>Thứ 5</option>
                            <option value={6}>Thứ 6</option>
                            <option value={7}>Thứ 7</option>
                            <option value={8}>Chủ Nhật</option>
                          </select>
                        </div>
                        <div>
                          <select
                            value={session.tietBatDau}
                            onChange={(e) => {
                              const updated = [...formSessions];
                              updated[index].tietBatDau = Number(e.target.value);
                              setFormSessions(updated);
                            }}
                            style={{ padding: '6px', fontSize: '13px' }}
                          >
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(t => (
                              <option key={t} value={t}>Tiết {t}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <select
                            value={session.tietKetThuc}
                            onChange={(e) => {
                              const updated = [...formSessions];
                              updated[index].tietKetThuc = Number(e.target.value);
                              setFormSessions(updated);
                            }}
                            style={{ padding: '6px', fontSize: '13px' }}
                          >
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(t => (
                              <option key={t} value={t}>Tiết {t}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <input
                            type="text"
                            required
                            placeholder="Phòng (ví dụ: A1-101)"
                            value={session.phongHoc}
                            onChange={(e) => {
                              const updated = [...formSessions];
                              updated[index].phongHoc = e.target.value;
                              setFormSessions(updated);
                            }}
                            style={{ padding: '6px', fontSize: '13px', margin: 0 }}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setFormSessions(formSessions.filter((_, i) => i !== index));
                          }}
                          style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: 'var(--color-danger)',
                            cursor: 'pointer',
                            padding: '4px'
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>
                  Hủy bỏ
                </button>
                <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={18} />
                  <span>{editingId ? 'Lưu cập nhật' : 'Tạo lớp'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCourseSections;
