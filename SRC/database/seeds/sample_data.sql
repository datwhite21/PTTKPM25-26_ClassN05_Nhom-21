-- Seed Data for Course Registration System
-- 1. Seed nguoi_dung
INSERT INTO nguoi_dung (id, email, mat_khau, ho_ten, vai_tro) VALUES
(1, 'sv1@school.edu.vn', '123456', 'Nguyễn Văn Anh', 'SINH_VIEN'),
(2, 'sv2@school.edu.vn', '123456', 'Trần Thị Bình', 'SINH_VIEN'),
(3, 'sv3@school.edu.vn', '123456', 'Lê Hoàng Cường', 'SINH_VIEN'),
(4, 'sv4@school.edu.vn', '123456', 'Phạm Minh Duy', 'SINH_VIEN'),
(5, 'gv1@school.edu.vn', '123456', 'TS. Nguyễn Văn Hùng', 'GIANG_VIEN'),
(6, 'gv2@school.edu.vn', '123456', 'ThS. Lê Thị Mai', 'GIANG_VIEN'),
(7, 'admin1@school.edu.vn', '123456', 'Giáo vụ Trần Quốc Bảo', 'GIAO_VU');

-- 2. Seed khoa
INSERT INTO khoa (id, ma_khoa, ten_khoa) VALUES
(1, 'FIT', 'Khoa Công nghệ thông tin'),
(2, 'FME', 'Khoa Cơ khí');

-- 3. Seed nganh
INSERT INTO nganh (id, ma_nganh, ten_nganh, khoa_id) VALUES
(1, 'CNTT', 'Công nghệ thông tin', 1),
(2, 'KHMT', 'Khoa học máy tính', 1),
(3, 'CKT', 'Cơ kỹ thuật', 2);

-- 4. Seed sinh_vien
INSERT INTO sinh_vien (id, ma_sv, nguoi_dung_id, nganh_id) VALUES
(1, 'SV001', 1, 1),
(2, 'SV002', 2, 1),
(3, 'SV003', 3, 2),
(4, 'SV004', 4, 3);

-- 5. Seed giang_vien
INSERT INTO giang_vien (id, ma_gv, nguoi_dung_id, khoa_id) VALUES
(1, 'GV001', 5, 1),
(2, 'GV002', 6, 1);

-- 6. Seed mon_hoc
INSERT INTO mon_hoc (id, ma_mon, ten_mon, so_tin_chi) VALUES
(1, 'BAS001', 'Tin học đại cương', 3),
(2, 'FIT001', 'Lập trình hướng đối tượng', 3),
(3, 'FIT002', 'Cấu trúc dữ liệu và giải thuật', 3),
(4, 'FIT003', 'Phân tích và thiết kế phần mềm', 4),
(5, 'FIT004', 'Kiến trúc phần mềm nâng cao', 3);

-- 7. Seed mon_tien_quyet
-- Lập trình hướng đối tượng cần Tin học đại cương làm tiên quyết
INSERT INTO mon_tien_quyet (mon_hoc_id, mon_tien_quyet_id) VALUES
(2, 1),
(3, 1),
(4, 2);

-- 8. Seed dot_dang_ky
INSERT INTO dot_dang_ky (id, ten_dot, ngay_mo, ngay_dong, trang_thai_mo) VALUES
(1, 'Đợt đăng ký Tín chỉ Học kỳ 1 năm học 2026-2027', '2026-06-01 00:00:00', '2026-06-30 23:59:59', TRUE);

-- 9. Seed lop_hoc_phan
INSERT INTO lop_hoc_phan (id, ma_lop_hp, mon_hoc_id, giang_vien_id, si_so_toi_da, si_so_hien_tai, trang_thai, dot_dang_ky_id) VALUES
(1, 'LHP_OOP_01', 2, 1, 40, 2, 'MO_DANG_KY', 1),
(2, 'LHP_DSA_01', 3, 1, 30, 0, 'MO_DANG_KY', 1),
(3, 'LHP_PTTK_01', 4, 2, 50, 0, 'MO_DANG_KY', 1),
(4, 'LHP_OOP_02', 2, 2, 2, 0, 'MO_DANG_KY', 1); -- Sĩ số tối đa = 2 để dễ test đầy chỗ

-- 10. Seed lich_hoc
INSERT INTO lich_hoc (id, lop_hoc_phan_id, thu, tiet_bat_dau, tiet_ket_thuc, phong_hoc) VALUES
(1, 1, 2, 1, 3, 'A1-101'),
(2, 2, 2, 4, 6, 'A1-102'),
(3, 3, 4, 1, 4, 'B2-203'),
(4, 4, 3, 1, 3, 'A1-101'),
(5, 3, 6, 1, 2, 'B2-203');

-- 11. Seed ket_qua_hoc_tap
-- SV001 đã học đạt Tin học đại cương (đạt 8.5) -> có quyền học OOP
INSERT INTO ket_qua_hoc_tap (id, sinh_vien_id, mon_hoc_id, diem_trung_binh, trang_thai_dat) VALUES
(1, 1, 1, 8.5, TRUE),
(2, 2, 1, 3.0, FALSE), -- SV002 trượt Tin đại cương -> không được đăng ký OOP
(3, 3, 1, 7.0, TRUE);

-- 12. Seed dang_ky
-- Hai sinh viên đăng ký trước vào lớp LHP_OOP_01
INSERT INTO dang_ky (id, sinh_vien_id, lop_hoc_phan_id, ngay_dang_ky, trang_thai) VALUES
(1, 1, 1, '2026-06-02 08:30:00', 'THANH_CONG'),
(2, 3, 1, '2026-06-02 09:15:00', 'THANH_CONG');
