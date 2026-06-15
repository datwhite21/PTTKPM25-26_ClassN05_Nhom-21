package com.nhom21.registration.service;

import com.nhom21.registration.domain.*;
import com.nhom21.registration.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class DangKyServiceImpl implements IDangKyService {

    @Autowired
    private SinhVienRepository sinhVienRepository;

    @Autowired
    private LopHocPhanRepository lopHocPhanRepository;

    @Autowired
    private DangKyRepository dangKyRepository;

    @Autowired
    private LichHocRepository lichHocRepository;

    @Autowired
    private KetQuaHocTapRepository ketQuaHocTapRepository;

    @Autowired
    private MonHocRepository monHocRepository;

    @Override
    @Transactional
    public DangKy thucHienDangKy(Long sinhVienId, Long lopHPId) {
        // 1. Kiểm tra tồn tại Sinh viên và Lớp học phần
        SinhVien sv = sinhVienRepository.findById(sinhVienId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy sinh viên id: " + sinhVienId));

        // KHÓA BI QUAN (Pessimistic Lock) trên dòng LopHocPhan để ngăn chặn tranh chấp slot ở giây cuối cùng
        LopHocPhan lhp = lopHocPhanRepository.findByIdForUpdate(lopHPId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy lớp học phần id: " + lopHPId));

        // 2. Kiểm tra trạng thái đợt đăng ký và trạng thái lớp học phần
        DotDangKy dot = lhp.getDotDangKy();
        if (dot == null || !dot.getTrangThaiMo() || LocalDateTime.now().isBefore(dot.getNgayMo()) || LocalDateTime.now().isAfter(dot.getNgayDong())) {
            throw new IllegalStateException("Cổng đăng ký tín chỉ hiện đang đóng!");
        }

        if (lhp.getTrangThai() != TrangThaiLopHocPhan.MO_DANG_KY) {
            throw new IllegalStateException("Lớp học phần hiện tại không mở để đăng ký!");
        }

        // 3. Kiểm tra xem sinh viên đã đăng ký lớp học phần này trước đó và thành công chưa
        boolean daDangKy = dangKyRepository.existsBySinhVienIdAndLopHocPhanIdAndTrangThai(sinhVienId, lopHPId, TrangThaiDangKy.THANH_CONG);
        if (daDangKy) {
            throw new IllegalStateException("Bạn đã đăng ký thành công lớp học phần này từ trước!");
        }

        // 4. Kiểm tra điều kiện môn học tiên quyết
        boolean datTienQuyet = kiemTraDieuKienTienQuyet(sinhVienId, lhp.getMonHoc().getId());
        if (!datTienQuyet) {
            throw new IllegalStateException("Bạn chưa đạt điều kiện môn học tiên quyết bắt buộc!");
        }

        // 5. Kiểm tra trùng lịch học
        List<LichHoc> lichMoi = lichHocRepository.findByLopHocPhanId(lopHPId);
        boolean trungLich = kiemTraTrungLich(sinhVienId, lichMoi);
        if (trungLich) {
            throw new IllegalStateException("Trùng thời khóa biểu với một lớp học phần khác đã đăng ký!");
        }

        // 6. Kiểm tra sĩ số còn chỗ trống không
        if (!lhp.kiemTraConCho()) {
            throw new IllegalStateException("Lớp học phần đã hết chỗ trống!");
        }

        // 7. Thực hiện đăng ký
        lhp.tangSiSo();
        lopHocPhanRepository.save(lhp);

        DangKy newDangKy = DangKy.builder()
                .sinhVien(sv)
                .lopHocPhan(lhp)
                .ngayDangKy(LocalDateTime.now())
                .trangThai(TrangThaiDangKy.THANH_CONG)
                .build();

        return dangKyRepository.save(newDangKy);
    }

    @Override
    @Transactional
    public void huyDangKy(Long dangKyId) {
        DangKy dk = dangKyRepository.findById(dangKyId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy bản ghi đăng ký id: " + dangKyId));

        if (dk.getTrangThai() == TrangThaiDangKy.DA_HUY) {
            throw new IllegalStateException("Phiếu đăng ký này đã được hủy từ trước!");
        }

        LopHocPhan lhp = lopHocPhanRepository.findByIdForUpdate(dk.getLopHocPhan().getId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy lớp học phần liên quan!"));

        // Giảm sĩ số hiện tại của lớp
        lhp.giamSiSo();
        lopHocPhanRepository.save(lhp);

        // Cập nhật trạng thái phiếu đăng ký sang DA_HUY
        dk.setTrangThai(TrangThaiDangKy.DA_HUY);
        dangKyRepository.save(dk);
    }

    @Override
    public List<LichHoc> layLichHocSinhVien(Long sinhVienId) {
        List<DangKy> activeDk = dangKyRepository.findBySinhVienIdAndTrangThai(sinhVienId, TrangThaiDangKy.THANH_CONG);
        List<LichHoc> listLich = new ArrayList<>();
        for (DangKy dk : activeDk) {
            listLich.addAll(lichHocRepository.findByLopHocPhanId(dk.getLopHocPhan().getId()));
        }
        return listLich;
    }

    @Override
    public boolean kiemTraDieuKienTienQuyet(Long sinhVienId, Long monHocId) {
        MonHoc mh = monHocRepository.findById(monHocId).orElse(null);
        if (mh == null) {
            return true;
        }
        List<MonHoc> tienQuyets = mh.getMonTienQuyet();
        if (tienQuyets == null || tienQuyets.isEmpty()) {
            return true;
        }

        // Với mỗi môn tiên quyết, sinh viên phải có kết quả học tập và đạt điểm >= 4.0
        for (MonHoc tq : tienQuyets) {
            KetQuaHocTap kq = ketQuaHocTapRepository.findBySinhVienIdAndMonHocId(sinhVienId, tq.getId()).orElse(null);
            if (kq == null || !kq.kiemTraDat()) {
                return false;
            }
        }
        return true;
    }

    @Override
    public boolean kiemTraTrungLich(Long sinhVienId, List<LichHoc> lichHocsMoi) {
        List<LichHoc> lichHienTai = layLichHocSinhVien(sinhVienId);
        if (lichHocsMoi == null || lichHocsMoi.isEmpty()) {
            return false;
        }

        for (LichHoc lm : lichHocsMoi) {
            for (LichHoc lh : lichHienTai) {
                // Kiểm tra trùng: Cùng thứ và có khoảng tiết overlap
                if (lm.getThu().equals(lh.getThu())) {
                    boolean overlap = !(lm.getTietKetThuc() < lh.getTietBatDau() || lm.getTietBatDau() > lh.getTietKetThuc());
                    if (overlap) {
                        return true; // Trùng lịch
                    }
                }
            }
        }
        return false;
    }

    @Override
    public List<DangKy> layDanhSachDangKySinhVien(Long sinhVienId) {
        return dangKyRepository.findBySinhVienIdAndTrangThai(sinhVienId, TrangThaiDangKy.THANH_CONG);
    }
}
