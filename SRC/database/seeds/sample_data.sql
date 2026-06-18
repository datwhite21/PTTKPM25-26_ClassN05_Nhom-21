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
(5, 'FIT004', 'Kiến trúc phần mềm nâng cao', 3),
(6, 'BAS002', 'Triết học Mác - Lênin', 3),
(7, 'BAS003', 'Kinh tế chính trị Mác - Lênin', 2),
(8, 'BAS004', 'Chủ nghĩa xã hội khoa học', 2),
(9, 'BAS005', 'Lịch sử Đảng Cộng sản Việt Nam', 2),
(10, 'BAS006', 'Tư tưởng Hồ Chí Minh', 2),
(11, 'BAS007', 'Tiếng Anh 1', 3),
(12, 'BAS008', 'Tiếng Anh 2', 3),
(13, 'BAS009', 'Giải tích 1', 3),
(14, 'BAS010', 'Giải tích 2', 3),
(15, 'BAS011', 'Đại số tuyến tính', 3),
(16, 'BAS012', 'Vật lý đại cương', 3),
(17, 'BAS014', 'Pháp luật đại cương', 2),
(18, 'FIT005', 'Nhập môn Công nghệ thông tin', 2),
(19, 'FIT006', 'Kỹ thuật lập trình', 3),
(20, 'FIT007', 'Toán rời rạc', 3),
(21, 'FIT008', 'Kiến trúc máy tính', 3),
(22, 'FIT009', 'Hệ điều hành', 3),
(23, 'FIT010', 'Mạng máy tính', 3),
(24, 'FIT011', 'Cơ sở dữ liệu', 3),
(25, 'FIT012', 'Hệ quản trị cơ sở dữ liệu', 3),
(26, 'FIT013', 'Phân tích thiết kế hệ thống', 3),
(27, 'FIT014', 'Công nghệ phần mềm', 3),
(28, 'FIT015', 'Lập trình Web', 3),
(29, 'FIT016', 'Lập trình di động', 3),
(30, 'FIT017', 'Trí tuệ nhân tạo', 3),
(31, 'FIT018', 'An toàn thông tin', 3),
(32, 'FIT019', 'Thiết kế giao diện người dùng', 3);

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
INSERT INTO ket_qua_hoc_tap (id, sinh_vien_id, mon_hoc_id, diem_chuyen_can, diem_giua_ky, diem_cuoi_ky, diem_trung_binh, trang_thai_dat) VALUES
(1, 1, 1, 9.0, 8.0, 8.6, 8.5, TRUE),
(2, 2, 1, 5.0, 4.0, 2.2, 3.0, FALSE), -- SV002 trượt Tin đại cương -> không được đăng ký OOP
(3, 3, 1, 8.0, 7.0, 6.8, 7.0, TRUE),
(4, 1, 6, 9.0, 8.0, 7.5, 7.8, TRUE),   -- Triết học Mác - Lênin (3 TC)
(5, 1, 7, 8.5, 7.0, 7.0, 7.2, TRUE),   -- Kinh tế chính trị Mác - Lênin (2 TC)
(6, 1, 8, 9.5, 8.5, 8.0, 8.3, TRUE),   -- Chủ nghĩa xã hội khoa học (2 TC)
(7, 1, 9, 8.0, 7.5, 7.0, 7.3, TRUE),   -- Lịch sử Đảng Cộng sản Việt Nam (2 TC)
(8, 1, 10, 9.0, 8.0, 8.0, 8.1, TRUE),  -- Tư tưởng Hồ Chí Minh (2 TC)
(9, 1, 11, 8.5, 9.0, 8.5, 8.7, TRUE),  -- Tiếng Anh 1 (3 TC)
(10, 1, 12, 9.0, 8.5, 7.5, 8.0, TRUE), -- Tiếng Anh 2 (3 TC)
(11, 1, 13, 10.0, 9.5, 9.0, 9.3, TRUE),-- Giải tích 1 (3 TC)
(12, 1, 14, 9.0, 7.5, 8.0, 8.0, TRUE), -- Giải tích 2 (3 TC)
(13, 1, 15, 9.5, 8.5, 8.5, 8.6, TRUE), -- Đại số tuyến tính (3 TC)
(14, 1, 16, 8.0, 7.0, 7.5, 7.4, TRUE), -- Vật lý đại cương (3 TC)
(15, 1, 17, 9.0, 8.0, 7.0, 7.5, TRUE), -- Pháp luật đại cương (2 TC)
(16, 1, 18, 9.5, 8.5, 9.0, 8.9, TRUE), -- Nhập môn Công nghệ thông tin (2 TC)
(17, 1, 19, 10.0, 9.0, 8.5, 8.8, TRUE),-- Kỹ thuật lập trình (3 TC)
(18, 1, 20, 9.0, 8.0, 7.5, 7.8, TRUE), -- Toán rời rạc (3 TC)
(19, 1, 21, 8.5, 7.5, 7.0, 7.3, TRUE), -- Kiến trúc máy tính (3 TC)
(20, 1, 22, 9.0, 8.5, 8.0, 8.3, TRUE), -- Hệ điều hành (3 TC)
(21, 1, 23, 9.5, 8.0, 8.0, 8.2, TRUE), -- Mạng máy tính (3 TC)
(22, 1, 24, 10.0, 9.0, 8.5, 8.8, TRUE),-- Cơ sở dữ liệu (3 TC)
(23, 1, 25, 9.0, 8.0, 8.0, 8.1, TRUE), -- Hệ quản trị cơ sở dữ liệu (3 TC)
(24, 1, 26, 9.5, 8.5, 7.5, 8.0, TRUE), -- Phân tích thiết kế hệ thống (3 TC)
(25, 1, 27, 8.5, 8.0, 8.0, 8.1, TRUE), -- Công nghệ phần mềm (3 TC)
(26, 1, 28, 9.0, 9.0, 8.5, 8.7, TRUE), -- Lập trình Web (3 TC)
(27, 1, 29, 9.5, 8.5, 8.0, 8.3, TRUE), -- Lập trình di động (3 TC)
(28, 1, 30, 8.0, 7.5, 7.0, 7.3, TRUE), -- Trí tuệ nhân tạo (3 TC)
(29, 1, 31, 9.0, 8.0, 8.0, 8.1, TRUE), -- An toàn thông tin (3 TC)
(30, 1, 32, 9.5, 9.0, 8.5, 8.8, TRUE); -- Thiết kế giao diện người dùng (3 TC)

-- 12. Seed dang_ky
-- Hai sinh viên đăng ký trước vào lớp LHP_OOP_01
INSERT INTO dang_ky (id, sinh_vien_id, lop_hoc_phan_id, ngay_dang_ky, trang_thai) VALUES
(1, 1, 1, '2026-06-02 08:30:00', 'THANH_CONG'),
(2, 3, 1, '2026-06-02 09:15:00', 'THANH_CONG');

-- 13. Seed dot_dang_ky_nganh
INSERT INTO dot_dang_ky_nganh (dot_dang_ky_id, nganh_id) VALUES
(1, 1),
(1, 2),
(1, 3);

-- 14. Seed lich_thi
-- OOP Class 1 (lop_hoc_phan_id = 1) -> Exam on 2026-07-10, CA1, Room A1-101
-- DSA Class (lop_hoc_phan_id = 2) -> Exam on 2026-07-12, CA2, Room A1-102
-- PTTK Class (lop_hoc_phan_id = 3) -> Exam on 2026-07-10, CA1, Room B2-203 (This overlaps with OOP Class 1 in CA1!)
-- OOP Class 2 (lop_hoc_phan_id = 4) -> Exam on 2026-07-15, CA3, Room A1-101
INSERT INTO lich_thi (lop_hoc_phan_id, ngay_thi, ca_thi, phong_thi) VALUES
(1, '2026-07-10', 'CA1', 'A1-101'),
(2, '2026-07-12', 'CA2', 'A1-102'),
(3, '2026-07-10', 'CA1', 'B2-203'),
(4, '2026-07-15', 'CA3', 'A1-101');

-- 15. Seed hoa_don_hoc_phi
INSERT INTO hoa_don_hoc_phi (sinh_vien_id, hoc_ky, tong_tin_chi, tong_tien, trang_thai, ngay_thanh_toan) VALUES
(1, 'Học kỳ 1 năm học 2026-2027', 3, 1500000.0, 'CHUA_THANH_TOAN', NULL),
(2, 'Học kỳ 1 năm học 2026-2027', 0, 0.0, 'CHUA_THANH_TOAN', NULL),
(3, 'Học kỳ 1 năm học 2026-2027', 3, 1500000.0, 'DA_THANH_TOAN', '2026-06-10 10:00:00');
