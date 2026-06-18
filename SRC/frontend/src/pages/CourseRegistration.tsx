import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axios';
import { Search, Book, Clock, AlertTriangle, CheckCircle, Trash2, Loader2, ArrowLeft } from 'lucide-react';

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
  thu: number;
  tietBatDau: number;
  tietKetThuc: number;
  phongHoc: string;
}

interface LopHocPhan {
  id: number;
  maLopHP: string;
  siSoHienTai: number;
  siSoToiDa: number;
  trangThai: string;
  monHoc: {
    id: number;
    maMon: string;
    tenMon: string;
    soTinChi: number;
  };
  giangVien: {
    id: number;
    maGV: string;
    nguoiDung: {
      hoTen: string;
    };
  };
  dsLichHoc: LichHoc[];
}

interface DangKy {
  id: number;
  lopHocPhan: LopHocPhan;
  trangThai: string;
}

interface LichThi {
  id: number;
  lopHocPhan: {
    id: number;
  };
  ngayThi: string;
  caThi: string;
  phongThi: string;
}

const CourseRegistration: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [classes, setClasses] = useState<LopHocPhan[]>([]);
  const [registrations, setRegistrations] = useState<DangKy[]>([]);
  const [cart, setCart] = useState<LopHocPhan[]>([]);
  const [lichThis, setLichThis] = useState<LichThi[]>([]);
  
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [activeSubjectId, setActiveSubjectId] = useState<number | null>(null);
  
  const navigate = useNavigate();


  const getGroupedClasses = () => {
    const groups: Record<number, { subject: LopHocPhan['monHoc']; sections: LopHocPhan[] }> = {};
    classes.forEach(lop => {
      if (!lop.monHoc) return;
      const sub = lop.monHoc;
      if (!groups[sub.id]) {
        groups[sub.id] = {
          subject: sub,
          sections: []
        };
      }
      groups[sub.id].sections.push(lop);
    });
    return Object.values(groups);
  };

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
    loadData(parsedUser.sinhVienId);
  }, [navigate]);

  const loadData = async (studentId: number, searchKeyword?: string, keepError = false) => {
    try {
      setLoading(true);
      if (!keepError) {
        setError(null);
      }
      
      // Load classes
      const searchUrl = searchKeyword ? `/course-sections/search?keyword=${encodeURIComponent(searchKeyword)}` : '/course-sections/search';
      const classesRes = await apiClient.get(searchUrl);
      const fetchedClasses = classesRes.data || [];
      setClasses(fetchedClasses);

      // Auto-select the first subject as default if none selected
      if (fetchedClasses.length > 0) {
        const groups: Record<number, boolean> = {};
        fetchedClasses.forEach((lop: LopHocPhan) => {
          if (lop.monHoc) {
            groups[lop.monHoc.id] = true;
          }
        });
        const subjectIds = Object.keys(groups).map(Number);
        if (subjectIds.length > 0) {
          setActiveSubjectId(prev => {
            if (prev !== null && subjectIds.includes(prev)) return prev;
            return subjectIds[0];
          });
        }
      } else {
        setActiveSubjectId(null);
      }

      // Load registered classes
      const regRes = await apiClient.get(`/registrations/student/${studentId}`);
      setRegistrations(regRes.data);

      // Load exam schedules
      const examRes = await apiClient.get('/lich-thi');
      setLichThis(examRes.data || []);
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách lớp học phần!');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      loadData(user.sinhVienId, keyword);
    }
  };

  // Check if a class is already registered
  const getRegisteredRecord = (classId: number) => {
    return registrations.find(r => r.lopHocPhan?.id === classId && r.trangThai === 'THANH_CONG');
  };

  // Check for conflicts between a class and already registered classes
  const checkScheduleConflict = (targetClass: LopHocPhan) => {
    if (!targetClass.dsLichHoc || targetClass.dsLichHoc.length === 0) return null;

    // Gather all schedules from registered classes
    const registeredSchedules: { thu: number; start: number; end: number; sourceName: string }[] = [];
    registrations.forEach(r => {
      if (r.lopHocPhan?.dsLichHoc && r.trangThai === 'THANH_CONG') {
        r.lopHocPhan.dsLichHoc.forEach(lh => {
          registeredSchedules.push({
            thu: lh.thu,
            start: lh.tietBatDau,
            end: lh.tietKetThuc,
            sourceName: r.lopHocPhan.monHoc?.tenMon || r.lopHocPhan.maLopHP
          });
        });
      }
    });

    // Gather all schedules from cart classes
    cart.forEach(c => {
      if (c.id !== targetClass.id && c.dsLichHoc) {
        c.dsLichHoc.forEach(lh => {
          registeredSchedules.push({
            thu: lh.thu,
            start: lh.tietBatDau,
            end: lh.tietKetThuc,
            sourceName: `Giỏ: ${c.monHoc?.tenMon || c.maLopHP}`
          });
        });
      }
    });

    // Check overlap
    for (const targetLich of targetClass.dsLichHoc) {
      for (const regLich of registeredSchedules) {
        if (targetLich.thu === regLich.thu) {
          const overlap = !(targetLich.tietKetThuc < regLich.start || targetLich.tietBatDau > regLich.end);
          if (overlap) return regLich.sourceName; // Return what it conflicts with!
        }
      }
    }

    return null;
  };

  const addToCart = (lop: LopHocPhan) => {
    if (cart.some(c => c.id === lop.id)) return;
    
    // Check if there is already a class section of the same subject in the cart
    const hasSameSubjectInCart = cart.some(c => c.monHoc?.id === lop.monHoc?.id);
    if (hasSameSubjectInCart) {
      setError(`Môn học "${lop.monHoc?.tenMon}" đã có lớp học phần khác trong giỏ hàng. Vui lòng bỏ chọn lớp cũ trước.`);
      setTimeout(() => setError(null), 4000);
      return;
    }

    // Check if there is already a registered class section of the same subject
    const hasSameSubjectRegistered = registrations.some(r => r.lopHocPhan?.monHoc?.id === lop.monHoc?.id && r.trangThai === 'THANH_CONG');
    if (hasSameSubjectRegistered) {
      setError(`Bạn đã đăng ký một lớp học phần khác của môn học "${lop.monHoc?.tenMon}". Vui lòng hủy lớp học phần cũ trước.`);
      setTimeout(() => setError(null), 4000);
      return;
    }
    
    // Check conflicts
    const conflictName = checkScheduleConflict(lop);
    if (conflictName) {
      setError(`Không thể chọn lớp ${lop.maLopHP} vì trùng lịch với "${conflictName}"!`);
      setTimeout(() => setError(null), 4000);
      return;
    }

    const examConflict = checkExamConflict(lop);
    if (examConflict) {
      setError(`Không thể chọn lớp ${lop.maLopHP} vì trùng lịch thi với "${examConflict}"!`);
      setTimeout(() => setError(null), 4000);
      return;
    }
    
    setCart([...cart, lop]);
    setSuccessMsg(`Đã thêm lớp ${lop.maLopHP} vào giỏ tạm thời.`);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(c => c.id !== id));
  };

  const checkExamConflict = (targetClass: LopHocPhan) => {
    const targetLichThi = lichThis.find(lt => lt.lopHocPhan?.id === targetClass.id);
    if (!targetLichThi) return null;

    for (const r of registrations) {
      if (r.trangThai === 'THANH_CONG') {
        const regLichThi = lichThis.find(lt => lt.lopHocPhan?.id === r.lopHocPhan?.id);
        if (regLichThi) {
          if (regLichThi.ngayThi === targetLichThi.ngayThi && regLichThi.caThi === targetLichThi.caThi) {
            return `${r.lopHocPhan?.monHoc?.tenMon || r.lopHocPhan?.maLopHP} (Ngày ${new Date(regLichThi.ngayThi).toLocaleDateString('vi-VN')} - Ca ${regLichThi.caThi})`;
          }
        }
      }
    }
    return null;
  };

  const handleJoinWaitlist = async (lopHPId: number, classCode: string) => {
    if (!user) return;
    setSubmitLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const res = await apiClient.post('/registrations', {
        sinhVienId: user.sinhVienId,
        lopHocPhanId: lopHPId
      });
      if (res.status === 202 || (res.data && res.data.status === 'WAITLIST')) {
        setSuccessMsg(res.data.message || `Bạn đã được xếp vào danh sách chờ lớp ${classCode}.`);
      } else {
        setSuccessMsg(`Đăng ký thành công lớp học phần ${classCode}!`);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      loadData(user.sinhVienId, keyword, true);
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || 'Không thể đăng ký hàng chờ!';
      setError(errMsg);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleRegisterCart = async () => {
    if (cart.length === 0 || !user) return;
    setSubmitLoading(true);
    setError(null);
    setSuccessMsg(null);

    let successCount = 0;
    const failures: string[] = [];
    const waitlists: string[] = [];

    // Register each class in the cart
    for (const lop of cart) {
      try {
        const res = await apiClient.post('/registrations', {
          sinhVienId: user.sinhVienId,
          lopHocPhanId: lop.id
        });
        if (res.status === 202 || (res.data && res.data.status === 'WAITLIST')) {
          waitlists.push(`Lớp ${lop.maLopHP}: ${res.data.message || 'Xếp vào hàng chờ thành công.'}`);
        } else {
          successCount++;
        }
      } catch (err: any) {
        failures.push(`Lớp ${lop.maLopHP}: ${err.response?.data?.message || err.message}`);
      }
    }

    let msg = '';
    if (successCount > 0) {
      msg += `Đăng ký thành công ${successCount} lớp học phần!\n`;
    }
    if (waitlists.length > 0) {
      msg += `Hàng chờ: \n${waitlists.join('\n')}\n`;
    }
    if (msg) {
      setSuccessMsg(msg);
      setCart([]);
    }
    if (failures.length > 0) {
      setError(`Có lỗi xảy ra:\n${failures.join('\n')}`);
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Reload lists
    loadData(user.sinhVienId, keyword, true);
    setSubmitLoading(false);
  };

  const handleCancelRegistration = async (registrationId: number, classCode: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn hủy đăng ký lớp ${classCode}?`)) return;
    
    setSubmitLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      await apiClient.delete(`/registrations/${registrationId}`);
      setSuccessMsg(`Đã hủy đăng ký thành công lớp ${classCode}.`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (user) {
        loadData(user.sinhVienId, keyword, true);
      }
    } catch (err: any) {
      setError(err.message || 'Không thể hủy đăng ký lớp học phần này!');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSubmitLoading(false);
    }
  };

  const formatSchedule = (lichHocs: LichHoc[]) => {
    if (!lichHocs || lichHocs.length === 0) return 'Chưa xếp lịch';
    return lichHocs.map(lh => `T${lh.thu} (${lh.tietBatDau}-${lh.tietKetThuc}) [${lh.phongHoc}]`).join(', ');
  };

  const totalCreditsInCart = cart.reduce((sum, c) => sum + (c.monHoc?.soTinChi || 0), 0);

  return (
    <div className="container">
      {/* Back to Dashboard */}
      <button className="btn btn-secondary" onClick={() => navigate('/student/dashboard')} style={{
        marginBottom: '20px',
        padding: '8px 16px',
        fontSize: '13px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        <ArrowLeft size={16} />
        <span>Quay lại Dashboard</span>
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Book size={28} style={{ color: 'var(--accent-primary)' }} />
            <span>Đăng Ký Học Phần</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            Đợt đăng ký Học kỳ 1 năm học 2026-2027
          </p>
        </div>
      </div>

      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      {error && <div className="alert alert-danger" style={{ whiteSpace: 'pre-line' }}>{error}</div>}

      {/* Main Grid: Search & List left, Sidebar right */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }} className="grid-cols-2">
        
        {/* Left Side: Course Search and Table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Search Card */}
          <div className="card" style={{ padding: '20px' }}>
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <input
                  type="text"
                  placeholder="Nhập tên môn học, mã lớp hoặc giảng viên..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  style={{ paddingLeft: '44px' }}
                />
                <Search size={18} style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-tertiary)'
                }} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ padding: '0 24px' }}>
                Tìm kiếm
              </button>
            </form>
          </div>

          {/* Classes grouped by Subject */}
          {loading ? (
            <div className="card" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px', gap: '8px' }}>
              <Loader2 className="animate-spin" size={24} style={{ color: 'var(--accent-primary)' }} />
              <span>Đang tải danh sách...</span>
            </div>
          ) : classes.length === 0 ? (
            <div className="card" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <AlertTriangle size={36} style={{ color: 'var(--text-tertiary)', marginBottom: '8px' }} />
              <p>Không tìm thấy môn học hoặc lớp học phần nào khớp với từ khóa tìm kiếm!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Khung chứa tên các môn học dạng ô vuông/thẻ */}
              <div>
                <h2 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                  <Book size={16} style={{ color: 'var(--accent-primary)' }} />
                  <span>DANH SÁCH MÔN HỌC MỞ DỰ KIẾN</span>
                </h2>
                <div className="subject-selector-grid">
                  {getGroupedClasses().map(group => {
                    const sub = group.subject;
                    const isSelected = activeSubjectId === sub.id;
                    const count = group.sections.length;
                    
                    // Check if any class section of this subject is already registered
                    const registeredSectionOfSub = registrations.find(
                      r => r.lopHocPhan?.monHoc?.id === sub.id && r.trangThai === 'THANH_CONG'
                    );
                    
                    // Check if any class section of this subject is currently in the cart
                    const cartSectionOfSub = cart.find(c => c.monHoc?.id === sub.id);

                    return (
                      <div
                        key={sub.id}
                        onClick={() => setActiveSubjectId(sub.id)}
                        className={`subject-selector-card ${isSelected ? 'active' : ''}`}
                      >
                        <div className="subject-card-title">{sub.tenMon}</div>
                        <div className="subject-card-meta">
                          <span>Mã: <strong>{sub.maMon}</strong> | <strong>{sub.soTinChi} TC</strong></span>
                          {registeredSectionOfSub ? (
                            <span className="badge badge-success" style={{ padding: '2px 8px', fontSize: '10px' }}>Đã đăng ký</span>
                          ) : cartSectionOfSub ? (
                            <span className="badge badge-warning" style={{ padding: '2px 8px', fontSize: '10px' }}>Đang chọn</span>
                          ) : (
                            <span className="badge badge-info" style={{ padding: '2px 8px', fontSize: '10px' }}>{count} Lớp</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Danh sách lớp học phần của môn đang chọn */}
              {activeSubjectId && (
                (() => {
                  const selectedGroup = getGroupedClasses().find(g => g.subject.id === activeSubjectId);
                  if (!selectedGroup) return null;
                  const sub = selectedGroup.subject;
                  
                  return (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                          LỚP HỌC PHẦN MỞ CỦA MÔN: <strong style={{ color: 'var(--accent-primary)' }}>{sub.tenMon.toUpperCase()}</strong>
                        </h3>
                      </div>

                      <div className="class-card-grid">
                        {selectedGroup.sections.map(lop => {
                          const regRecord = getRegisteredRecord(lop.id);
                          const isRegistered = !!regRecord;
                          const isFull = lop.siSoHienTai >= lop.siSoToiDa;
                          const isInCart = cart.some(c => c.id === lop.id);
                          const conflictName = checkScheduleConflict(lop);
                          const isConflict = !!conflictName;
                          const examConflictName = checkExamConflict(lop);
                          const isExamConflict = !!examConflictName;
                          
                          // Check if another class section of this subject is registered
                          const otherRegRecord = registrations.find(
                            r => r.lopHocPhan?.monHoc?.id === sub.id && r.lopHocPhan?.id !== lop.id && r.trangThai === 'THANH_CONG'
                          );
                          const isOtherRegistered = !!otherRegRecord;

                          // Check if another class section of this subject is in the cart
                          const otherInCart = cart.some(c => c.monHoc?.id === sub.id && c.id !== lop.id);

                          // Calculate capacity percentage for progress bar
                          const capacityPercent = Math.min(100, (lop.siSoHienTai / lop.siSoToiDa) * 100);
                          let capacityColorClass = 'success';
                          if (capacityPercent >= 90) capacityColorClass = 'danger';
                          else if (capacityPercent >= 75) capacityColorClass = 'warning';

                          return (
                            <div key={lop.id} className="class-section-card">
                              <div>
                                {/* Card Header */}
                                <div className="class-card-header">
                                  <span className="class-card-code">{lop.maLopHP}</span>
                                  <span className={`badge ${isFull ? 'badge-danger' : 'badge-success'}`}>
                                    {isFull ? 'Hết chỗ' : 'Còn chỗ'}
                                  </span>
                                </div>

                                {/* Card Body */}
                                <div className="class-card-body">
                                  {/* Lecturer */}
                                  <div className="class-info-row">
                                    <span style={{ fontWeight: '600' }}>Giảng viên:</span>
                                    <span>{lop.giangVien?.nguoiDung?.hoTen || 'Chưa phân công'}</span>
                                  </div>

                                  {/* Schedule */}
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <span style={{ fontWeight: '600', fontSize: '13px', color: 'var(--text-secondary)' }}>Lịch học:</span>
                                    {lop.dsLichHoc && lop.dsLichHoc.length > 0 ? (
                                      lop.dsLichHoc.map((lh, index) => (
                                        <div key={lh.id || index} className="class-info-row" style={{ paddingLeft: '4px' }}>
                                          <Clock size={13} className="class-info-icon" />
                                          <span>Thứ {lh.thu === 8 ? 'CN' : lh.thu} (tiết {lh.tietBatDau}-{lh.tietKetThuc}) [{lh.phongHoc}]</span>
                                        </div>
                                      ))
                                    ) : (
                                      <span style={{ fontSize: '13px', color: 'var(--text-tertiary)', paddingLeft: '4px' }}>Chưa xếp lịch</span>
                                    )}
                                  </div>

                                  {/* Capacity progress bar */}
                                  <div className="class-capacity-container">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '500' }}>
                                      <span>Sĩ số:</span>
                                      <strong>{lop.siSoHienTai} / {lop.siSoToiDa}</strong>
                                    </div>
                                    <div className="class-capacity-bar">
                                      <div
                                        className={`class-capacity-fill ${capacityColorClass}`}
                                        style={{ width: `${capacityPercent}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Card Footer Actions */}
                              <div className="class-card-footer">
                                {isRegistered ? (
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <span className="badge badge-success" style={{ justifyContent: 'center', width: '100%', padding: '8px 12px', gap: '6px' }}>
                                      <CheckCircle size={14} /> ĐÃ ĐĂNG KÝ
                                    </span>
                                    <button
                                      onClick={() => handleCancelRegistration(regRecord.id, lop.maLopHP)}
                                      className="btn btn-danger"
                                      disabled={submitLoading}
                                      style={{ width: '100%', padding: '8px 12px', fontSize: '13px' }}
                                    >
                                      Hủy học phần
                                    </button>
                                  </div>
                                ) : isOtherRegistered ? (
                                  <button
                                    className="btn btn-secondary"
                                    disabled
                                    style={{ width: '100%', padding: '10px 12px', fontSize: '13px', color: 'var(--text-tertiary)' }}
                                    title={`Bạn đã đăng ký lớp ${otherRegRecord.lopHocPhan?.maLopHP}. Hãy hủy đăng ký lớp đó trước.`}
                                  >
                                    Đã đăng ký lớp khác
                                  </button>
                                ) : isInCart ? (
                                  <button
                                    className="btn btn-secondary"
                                    onClick={() => removeFromCart(lop.id)}
                                    style={{ width: '100%', padding: '10px 12px', fontSize: '13px', color: 'var(--accent-primary)', borderColor: 'var(--accent-primary)', backgroundColor: 'transparent' }}
                                  >
                                    Đang chọn (Bỏ chọn)
                                  </button>
                                ) : otherInCart ? (
                                  <button
                                    className="btn btn-secondary"
                                    disabled
                                    style={{ width: '100%', padding: '10px 12px', fontSize: '13px', color: 'var(--text-tertiary)' }}
                                    title="Một lớp khác của môn học này đã có trong giỏ. Vui lòng bỏ chọn lớp đó trước."
                                  >
                                    Đã chọn lớp khác
                                  </button>
                                ) : isConflict ? (
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
                                    <button
                                      className="btn btn-secondary"
                                      disabled
                                      style={{ width: '100%', padding: '10px 12px', fontSize: '13px', color: 'var(--text-tertiary)' }}
                                    >
                                      Trùng lịch
                                    </button>
                                    <div style={{ fontSize: '11px', color: 'var(--color-danger)', textAlign: 'center', fontWeight: '500' }}>
                                      ({conflictName})
                                    </div>
                                  </div>
                                ) : isExamConflict ? (
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
                                    <button
                                      className="btn btn-secondary"
                                      disabled
                                      style={{ width: '100%', padding: '10px 12px', fontSize: '13px', color: 'var(--color-danger)' }}
                                    >
                                      Trùng lịch thi
                                    </button>
                                    <div style={{ fontSize: '11px', color: 'var(--color-danger)', textAlign: 'center', fontWeight: '500' }}>
                                      ({examConflictName})
                                    </div>
                                  </div>
                                ) : isFull ? (
                                  <button
                                    className="btn btn-warning"
                                    onClick={() => handleJoinWaitlist(lop.id, lop.maLopHP)}
                                    disabled={submitLoading}
                                    style={{ width: '100%', padding: '10px 12px', fontSize: '13px' }}
                                  >
                                    Đăng ký hàng chờ
                                  </button>
                                ) : (
                                  <button
                                    className="btn btn-primary"
                                    onClick={() => addToCart(lop)}
                                    style={{ width: '100%', padding: '10px 12px', fontSize: '13px' }}
                                  >
                                    Chọn lớp
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()
              )}
            </div>
          )}
        </div>

        {/* Right Side: Temporary Checkout Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Cart Card */}
          <div className="card card-glass" style={{
            position: 'sticky',
            top: '90px',
            borderLeft: '4px solid var(--accent-primary)',
          }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>GIỎ ĐĂNG KÝ TẠM THỜI</span>
              <span className="badge badge-info" style={{ borderRadius: '6px' }}>{cart.length}</span>
            </h3>

            {cart.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-secondary)', border: '1px dashed var(--border-color)', borderRadius: 'var(--border-radius-md)' }}>
                <Book size={32} style={{ color: 'var(--text-tertiary)', marginBottom: '8px' }} />
                <p style={{ fontSize: '14px' }}>Chưa chọn lớp học phần nào.</p>
                <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '4px' }}>Hãy nhấn "Chọn lớp" bên cạnh danh sách để thêm vào giỏ.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  maxHeight: '320px',
                  overflowY: 'auto',
                  paddingRight: '4px'
                }}>
                  {cart.map(lop => (
                    <div key={lop.id} style={{
                      backgroundColor: 'var(--bg-primary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--border-radius-md)',
                      padding: '12px 14px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-primary)' }}>
                          {lop.monHoc?.tenMon}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          Mã lớp: <strong>{lop.maLopHP}</strong> | Số TC: <strong>{lop.monHoc?.soTinChi} TC</strong>
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '4px' }}>
                          <Clock size={10} /> Lịch: {formatSchedule(lop.dsLichHoc)}
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(lop.id)}
                        style={{
                          backgroundColor: 'transparent',
                          border: 'none',
                          color: 'var(--color-danger)',
                          cursor: 'pointer',
                          padding: '6px'
                        }}
                        title="Bỏ chọn"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '600' }}>
                  <span>Tổng số tín chỉ:</span>
                  <span style={{ color: 'var(--accent-primary)', fontSize: '16px', fontWeight: '800' }}>
                    {totalCreditsInCart} TC
                  </span>
                </div>

                <button
                  onClick={handleRegisterCart}
                  className="btn btn-primary"
                  disabled={submitLoading}
                  style={{ width: '100%', height: '44px', fontWeight: '700' }}
                >
                  {submitLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Đang đăng ký học phần...</span>
                    </>
                  ) : (
                    <span>XÁC NHẬN ĐĂNG KÝ HỌC PHẦN</span>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CourseRegistration;
