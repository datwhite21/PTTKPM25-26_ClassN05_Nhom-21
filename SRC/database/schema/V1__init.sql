-- Database Initialization Script for Course Registration System
-- Clean up existing tables
DROP TABLE IF EXISTS ket_qua_hoc_tap;
DROP TABLE IF EXISTS dang_ky;
DROP TABLE IF EXISTS lich_hoc;
DROP TABLE IF EXISTS lop_hoc_phan;
DROP TABLE IF EXISTS dot_dang_ky;
DROP TABLE IF EXISTS mon_tien_quyet;
DROP TABLE IF EXISTS mon_hoc;
DROP TABLE IF EXISTS sinh_vien;
DROP TABLE IF EXISTS giang_vien;
DROP TABLE IF EXISTS nganh;
DROP TABLE IF EXISTS khoa;
DROP TABLE IF EXISTS nguoi_dung;

-- 1. Table nguoi_dung
CREATE TABLE nguoi_dung (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    mat_khau VARCHAR(255) NOT NULL,
    ho_ten VARCHAR(255) NOT NULL,
    vai_tro VARCHAR(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Table khoa
CREATE TABLE khoa (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ma_khoa VARCHAR(50) NOT NULL UNIQUE,
    ten_khoa VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Table nganh
CREATE TABLE nganh (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ma_nganh VARCHAR(50) NOT NULL UNIQUE,
    ten_nganh VARCHAR(255) NOT NULL,
    khoa_id BIGINT NOT NULL,
    CONSTRAINT fk_nganh_khoa FOREIGN KEY (khoa_id) REFERENCES khoa(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Table sinh_vien
CREATE TABLE sinh_vien (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ma_sv VARCHAR(50) NOT NULL UNIQUE,
    nguoi_dung_id BIGINT NOT NULL UNIQUE,
    nganh_id BIGINT NOT NULL,
    CONSTRAINT fk_sinhvien_nguoidung FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung(id) ON DELETE CASCADE,
    CONSTRAINT fk_sinhvien_nganh FOREIGN KEY (nganh_id) REFERENCES nganh(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Table giang_vien
CREATE TABLE giang_vien (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ma_gv VARCHAR(50) NOT NULL UNIQUE,
    nguoi_dung_id BIGINT NOT NULL UNIQUE,
    khoa_id BIGINT NOT NULL,
    CONSTRAINT fk_giangvien_nguoidung FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung(id) ON DELETE CASCADE,
    CONSTRAINT fk_giangvien_khoa FOREIGN KEY (khoa_id) REFERENCES khoa(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Table mon_hoc
CREATE TABLE mon_hoc (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ma_mon VARCHAR(50) NOT NULL UNIQUE,
    ten_mon VARCHAR(255) NOT NULL,
    so_tin_chi INT NOT NULL CHECK (so_tin_chi > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Table mon_tien_quyet (many-to-many relationship)
CREATE TABLE mon_tien_quyet (
    mon_hoc_id BIGINT NOT NULL,
    mon_tien_quyet_id BIGINT NOT NULL,
    PRIMARY KEY (mon_hoc_id, mon_tien_quyet_id),
    CONSTRAINT fk_tinquyet_mon FOREIGN KEY (mon_hoc_id) REFERENCES mon_hoc(id) ON DELETE CASCADE,
    CONSTRAINT fk_tinquyet_tq FOREIGN KEY (mon_tien_quyet_id) REFERENCES mon_hoc(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Table dot_dang_ky
CREATE TABLE dot_dang_ky (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ten_dot VARCHAR(255) NOT NULL,
    ngay_mo DATETIME NOT NULL,
    ngay_dong DATETIME NOT NULL,
    trang_thai_mo BOOLEAN NOT NULL DEFAULT FALSE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Table lop_hoc_phan
CREATE TABLE lop_hoc_phan (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ma_lop_hp VARCHAR(50) NOT NULL UNIQUE,
    mon_hoc_id BIGINT NOT NULL,
    giang_vien_id BIGINT NOT NULL,
    si_so_toi_da INT NOT NULL CHECK (si_so_toi_da > 0),
    si_so_hien_tai INT NOT NULL DEFAULT 0,
    trang_thai VARCHAR(50) NOT NULL,
    dot_dang_ky_id BIGINT NOT NULL,
    CONSTRAINT fk_lophp_mon FOREIGN KEY (mon_hoc_id) REFERENCES mon_hoc(id),
    CONSTRAINT fk_lophp_giangvien FOREIGN KEY (giang_vien_id) REFERENCES giang_vien(id),
    CONSTRAINT fk_lophp_dot FOREIGN KEY (dot_dang_ky_id) REFERENCES dot_dang_ky(id),
    CONSTRAINT chk_siso CHECK (si_so_hien_tai <= si_so_toi_da AND si_so_hien_tai >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Table lich_hoc
CREATE TABLE lich_hoc (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    lop_hoc_phan_id BIGINT NOT NULL,
    thu INT NOT NULL,
    tiet_bat_dau INT NOT NULL,
    tiet_ket_thuc INT NOT NULL,
    phong_hoc VARCHAR(50) NOT NULL,
    CONSTRAINT fk_lichhoc_lophp FOREIGN KEY (lop_hoc_phan_id) REFERENCES lop_hoc_phan(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Table dang_ky
CREATE TABLE dang_ky (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sinh_vien_id BIGINT NOT NULL,
    lop_hoc_phan_id BIGINT NOT NULL,
    ngay_dang_ky DATETIME NOT NULL,
    trang_thai VARCHAR(50) NOT NULL,
    CONSTRAINT fk_dangky_sinhvien FOREIGN KEY (sinh_vien_id) REFERENCES sinh_vien(id) ON DELETE CASCADE,
    CONSTRAINT fk_dangky_lophp FOREIGN KEY (lop_hoc_phan_id) REFERENCES lop_hoc_phan(id),
    CONSTRAINT uq_sv_lophp UNIQUE (sinh_vien_id, lop_hoc_phan_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Table ket_qua_hoc_tap
CREATE TABLE ket_qua_hoc_tap (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sinh_vien_id BIGINT NOT NULL,
    mon_hoc_id BIGINT NOT NULL,
    diem_trung_binh DOUBLE NOT NULL CHECK (diem_trung_binh >= 0.0 AND diem_trung_binh <= 10.0),
    trang_thai_dat BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_kq_sinhvien FOREIGN KEY (sinh_vien_id) REFERENCES sinh_vien(id) ON DELETE CASCADE,
    CONSTRAINT fk_kq_mon FOREIGN KEY (mon_hoc_id) REFERENCES mon_hoc(id),
    CONSTRAINT uq_sv_mon UNIQUE (sinh_vien_id, mon_hoc_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
