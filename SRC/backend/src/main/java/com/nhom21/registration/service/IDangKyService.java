package com.nhom21.registration.service;

import com.nhom21.registration.domain.DangKy;
import com.nhom21.registration.domain.LichHoc;
import java.util.List;

public interface IDangKyService {
    DangKy thucHienDangKy(Long sinhVienId, Long lopHPId);
    void huyDangKy(Long dangKyId);
    List<LichHoc> layLichHocSinhVien(Long sinhVienId);
    List<DangKy> layDanhSachDangKySinhVien(Long sinhVienId);
    boolean kiemTraDieuKienTienQuyet(Long sinhVienId, Long monHocId);
    boolean kiemTraTrungLich(Long sinhVienId, List<LichHoc> lichHocsMoi);
}
