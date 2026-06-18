import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axios';
import { Plus, Edit3, Trash2, X, Check, AlertCircle, Loader2, BookOpen, UserCheck } from 'lucide-react';

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
  monTienQuyet?: MonHoc[];
}

interface Khoa {
  id: number;
  maKhoa: string;
  tenKhoa: string;
}

interface GiangVien {
  id: number;
  maGV: string;
  nguoiDung: {
    hoTen: string;
    email: string;
  };
  khoa: Khoa;
}

const AdminManagement: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState<'subject' | 'lecturer'>('subject');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Data states
  const [subjects, setSubjects] = useState<MonHoc[]>([]);
  const [lecturers, setLecturers] = useState<GiangVien[]>([]);
  const [khoas, setKhoas] = useState<Khoa[]>([]);

  // Search states
  const [subjectSearch, setSubjectSearch] = useState('');
  const [lecturerSearch, setLecturerSearch] = useState('');

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Subject Form states
  const [subjectMaMon, setSubjectMaMon] = useState('');
  const [subjectTenMon, setSubjectTenMon] = useState('');
  const [subjectSoTinChi, setSubjectSoTinChi] = useState(3);
  const [subjectPrerequisites, setSubjectPrerequisites] = useState<number[]>([]);

  // Lecturer Form states
  const [lecturerMaGV, setLecturerMaGV] = useState('');
  const [lecturerHoTen, setLecturerHoTen] = useState('');
  const [lecturerEmail, setLecturerEmail] = useState('');
  const [lecturerKhoaId, setLecturerKhoaId] = useState('');

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

      const [subRes, lectRes, khoaRes] = await Promise.all([
        apiClient.get('/admin/mon-hoc'),
        apiClient.get('/admin/giang-vien'),
        apiClient.get('/admin/khoa')
      ]);

      setSubjects(subRes.data);
      setLecturers(lectRes.data);
      setKhoas(khoaRes.data);

      if (khoaRes.data.length > 0) {
        setLecturerKhoaId(khoaRes.data[0].id.toString());
      }
    } catch (err: any) {
      setError(err.message || 'Không thể tải dữ liệu giáo vụ!');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setError(null);
    setSuccess(null);

    if (activeTab === 'subject') {
      setSubjectMaMon('');
      setSubjectTenMon('');
      setSubjectSoTinChi(3);
      setSubjectPrerequisites([]);
    } else {
      setLecturerMaGV('');
      setLecturerHoTen('');
      setLecturerEmail('');
      if (khoas.length > 0) setLecturerKhoaId(khoas[0].id.toString());
    }
    setModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingId(item.id);
    setError(null);
    setSuccess(null);

    if (activeTab === 'subject') {
      const mh = item as MonHoc;
      setSubjectMaMon(mh.maMon);
      setSubjectTenMon(mh.tenMon);
      setSubjectSoTinChi(mh.soTinChi);
      setSubjectPrerequisites(mh.monTienQuyet ? mh.monTienQuyet.map(p => p.id) : []);
    } else {
      const gv = item as GiangVien;
      setLecturerMaGV(gv.maGV);
      setLecturerHoTen(gv.nguoiDung?.hoTen || '');
      setLecturerEmail(gv.nguoiDung?.email || '');
      setLecturerKhoaId(gv.khoa?.id?.toString() || '');
    }
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      if (activeTab === 'subject') {
        const payload = {
          maMon: subjectMaMon.trim(),
          tenMon: subjectTenMon.trim(),
          soTinChi: subjectSoTinChi,
          monTienQuyetIds: subjectPrerequisites
        };

        if (editingId) {
          await apiClient.put(`/admin/mon-hoc/${editingId}`, payload);
          setSuccess(`Cập nhật môn học ${subjectTenMon} thành công!`);
        } else {
          await apiClient.post('/admin/mon-hoc', payload);
          setSuccess(`Thêm môn học ${subjectTenMon} thành công!`);
        }
      } else {
        const payload = {
          maGV: lecturerMaGV.trim(),
          hoTen: lecturerHoTen.trim(),
          email: lecturerEmail.trim(),
          khoaId: Number(lecturerKhoaId)
        };

        if (editingId) {
          await apiClient.put(`/admin/giang-vien/${editingId}`, payload);
          setSuccess(`Cập nhật giảng viên ${lecturerHoTen} thành công!`);
        } else {
          await apiClient.post('/admin/giang-vien', payload);
          setSuccess(`Thêm giảng viên ${lecturerHoTen} thành công!`);
        }
      }
      setModalOpen(false);
      loadAllData();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Lỗi khi lưu thông tin!');
    }
  };

  const handleDelete = async (id: number, name: string) => {
    const typeLabel = activeTab === 'subject' ? 'môn học' : 'giảng viên';
    if (!window.confirm(`Bạn có chắc chắn muốn xóa ${typeLabel} "${name}"? Hành động này không thể hoàn tác!`)) return;

    setError(null);
    setSuccess(null);

    try {
      if (activeTab === 'subject') {
        await apiClient.delete(`/admin/mon-hoc/${id}`);
      } else {
        await apiClient.delete(`/admin/giang-vien/${id}`);
      }
      setSuccess(`Đã xóa thành công ${typeLabel} "${name}".`);
      loadAllData();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || `Không thể xóa ${typeLabel} này do ràng buộc dữ liệu.`);
    }
  };

  const handlePrereqToggle = (id: number) => {
    setSubjectPrerequisites(prev =>
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  // Filters
  const filteredSubjects = subjects.filter(
    s => s.maMon.toLowerCase().includes(subjectSearch.toLowerCase()) ||
         s.tenMon.toLowerCase().includes(subjectSearch.toLowerCase())
  );

  const filteredLecturers = lecturers.filter(
    l => l.maGV.toLowerCase().includes(lecturerSearch.toLowerCase()) ||
         (l.nguoiDung?.hoTen || '').toLowerCase().includes(lecturerSearch.toLowerCase()) ||
         (l.nguoiDung?.email || '').toLowerCase().includes(lecturerSearch.toLowerCase())
  );

  return (
    <div className="container">
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px' }}>Quản Lý Danh Mục Hệ Thống {user ? `- ${user.hoTen}` : ''}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            Quản lý trực tiếp danh mục môn học, giảng viên và các môn học tiên quyết
          </p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Plus size={18} />
          <span>{activeTab === 'subject' ? 'THÊM MÔN HỌC MỚI' : 'THÊM GIẢNG VIÊN MỚI'}</span>
        </button>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger" style={{ whiteSpace: 'pre-line' }}>{error}</div>}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
        <button
          onClick={() => setActiveTab('subject')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            backgroundColor: activeTab === 'subject' ? 'var(--bg-secondary)' : 'transparent',
            color: activeTab === 'subject' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            border: 'none',
            borderBottom: activeTab === 'subject' ? '2px solid var(--accent-primary)' : 'none',
            fontWeight: 700,
            fontSize: '15px',
            cursor: 'pointer'
          }}
        >
          <BookOpen size={18} />
          <span>Quản lý Môn Học</span>
        </button>
        <button
          onClick={() => setActiveTab('lecturer')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            backgroundColor: activeTab === 'lecturer' ? 'var(--bg-secondary)' : 'transparent',
            color: activeTab === 'lecturer' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            border: 'none',
            borderBottom: activeTab === 'lecturer' ? '2px solid var(--accent-primary)' : 'none',
            fontWeight: 700,
            fontSize: '15px',
            cursor: 'pointer'
          }}
        >
          <UserCheck size={18} />
          <span>Quản lý Giảng Viên</span>
        </button>
      </div>

      {/* Search inputs */}
      <div className="card" style={{ padding: '16px', marginBottom: '20px' }}>
        {activeTab === 'subject' ? (
          <input
            type="text"
            placeholder="Tìm kiếm môn học theo mã môn, tên môn..."
            value={subjectSearch}
            onChange={(e) => setSubjectSearch(e.target.value)}
            style={{ margin: 0 }}
          />
        ) : (
          <input
            type="text"
            placeholder="Tìm kiếm giảng viên theo mã GV, họ tên, email..."
            value={lecturerSearch}
            onChange={(e) => setLecturerSearch(e.target.value)}
            style={{ margin: 0 }}
          />
        )}
      </div>

      {/* Tables container */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px', gap: '8px' }}>
            <Loader2 className="animate-spin" size={24} style={{ color: 'var(--accent-primary)' }} />
            <span>Đang tải danh sách...</span>
          </div>
        ) : activeTab === 'subject' ? (
          /* SUBJECT TABLE */
          filteredSubjects.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <AlertCircle size={36} style={{ color: 'var(--text-tertiary)', marginBottom: '8px' }} />
              <p>Không tìm thấy môn học nào!</p>
            </div>
          ) : (
            <div className="table-container" style={{ border: 'none', boxShadow: 'none', borderRadius: 0 }}>
              <table>
                <thead>
                  <tr>
                    <th>Mã Môn</th>
                    <th>Tên Môn</th>
                    <th>Số Tín Chỉ</th>
                    <th>Môn Tiên Quyết</th>
                    <th style={{ textAlign: 'center' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubjects.map(mh => (
                    <tr key={mh.id}>
                      <td style={{ fontWeight: '600' }}>{mh.maMon}</td>
                      <td style={{ fontWeight: '600' }}>{mh.tenMon}</td>
                      <td>{mh.soTinChi} TC</td>
                      <td>
                        {mh.monTienQuyet && mh.monTienQuyet.length > 0 ? (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {mh.monTienQuyet.map(p => (
                              <span key={p.id} className="badge badge-info" style={{ fontSize: '11px' }}>
                                {p.tenMon} ({p.maMon})
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}>Không có</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button
                            className="btn btn-secondary"
                            onClick={() => openEditModal(mh)}
                            style={{ padding: '6px 10px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <Edit3 size={14} />
                            <span>Sửa</span>
                          </button>
                          <button
                            className="btn btn-secondary"
                            onClick={() => handleDelete(mh.id, mh.tenMon)}
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
          )
        ) : (
          /* LECTURER TABLE */
          filteredLecturers.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <AlertCircle size={36} style={{ color: 'var(--text-tertiary)', marginBottom: '8px' }} />
              <p>Không tìm thấy giảng viên nào!</p>
            </div>
          ) : (
            <div className="table-container" style={{ border: 'none', boxShadow: 'none', borderRadius: 0 }}>
              <table>
                <thead>
                  <tr>
                    <th>Mã Giảng Viên</th>
                    <th>Họ và Tên</th>
                    <th>Email liên hệ</th>
                    <th>Khoa trực thuộc</th>
                    <th style={{ textAlign: 'center' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLecturers.map(gv => (
                    <tr key={gv.id}>
                      <td style={{ fontWeight: '600' }}>{gv.maGV}</td>
                      <td style={{ fontWeight: '600' }}>{gv.nguoiDung?.hoTen || 'N/A'}</td>
                      <td>{gv.nguoiDung?.email || 'N/A'}</td>
                      <td>{gv.khoa?.tenKhoa}</td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button
                            className="btn btn-secondary"
                            onClick={() => openEditModal(gv)}
                            style={{ padding: '6px 10px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <Edit3 size={14} />
                            <span>Sửa</span>
                          </button>
                          <button
                            className="btn btn-secondary"
                            onClick={() => handleDelete(gv.id, gv.nguoiDung?.hoTen || gv.maGV)}
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
          )
        )}
      </div>

      {/* Modal dialog */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px' }}>
                {editingId 
                  ? (activeTab === 'subject' ? 'Chỉnh sửa môn học' : 'Chỉnh sửa giảng viên') 
                  : (activeTab === 'subject' ? 'Thêm môn học mới' : 'Thêm giảng viên mới')}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {activeTab === 'subject' ? (
                /* SUBJECT FORM FIELDS */
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                        Mã Môn Học
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ví dụ: BAS001"
                        value={subjectMaMon}
                        onChange={(e) => setSubjectMaMon(e.target.value)}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                        Số tín chỉ
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        max="10"
                        value={subjectSoTinChi}
                        onChange={(e) => setSubjectSoTinChi(Number(e.target.value))}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                      Tên môn học
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: Tin học đại cương"
                      value={subjectTenMon}
                      onChange={(e) => setSubjectTenMon(e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                      Môn tiên quyết liên kết (Chọn nhiều)
                    </label>
                    <div style={{
                      maxHeight: '180px',
                      overflowY: 'auto',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--border-radius-md)',
                      padding: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}>
                      {subjects
                        .filter(s => !editingId || s.id !== editingId)
                        .map(s => (
                          <label key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                            <input
                              type="checkbox"
                              checked={subjectPrerequisites.includes(s.id)}
                              onChange={() => handlePrereqToggle(s.id)}
                              style={{ width: 'auto', margin: 0 }}
                            />
                            <span>{s.tenMon} ({s.maMon})</span>
                          </label>
                        ))}
                      {subjects.filter(s => !editingId || s.id !== editingId).length === 0 && (
                        <p style={{ color: 'var(--text-tertiary)', fontSize: '12px', textAlign: 'center', margin: 0 }}>
                          Không có môn học khả dụng khác
                        </p>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                /* LECTURER FORM FIELDS */
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                        Mã giảng viên
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ví dụ: GV001"
                        value={lecturerMaGV}
                        onChange={(e) => setLecturerMaGV(e.target.value)}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                        Khoa trực thuộc
                      </label>
                      <select value={lecturerKhoaId} onChange={(e) => setLecturerKhoaId(e.target.value)} required>
                        {khoas.map(k => (
                          <option key={k.id} value={k.id}>
                            {k.tenKhoa}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                      Họ và Tên
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: TS. Nguyễn Văn A"
                      value={lecturerHoTen}
                      onChange={(e) => setLecturerHoTen(e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                      Email tài khoản
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="Ví dụ: gv1@school.edu.vn"
                      value={lecturerEmail}
                      onChange={(e) => setLecturerEmail(e.target.value)}
                      disabled={editingId !== null} // Lock email for existing users
                    />
                    {editingId && (
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                        Không thể sửa email tài khoản của giảng viên đã tạo.
                      </span>
                    )}
                  </div>
                </>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>
                  Hủy bỏ
                </button>
                <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={18} />
                  <span>{editingId ? 'Lưu cập nhật' : 'Tạo mới'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManagement;
