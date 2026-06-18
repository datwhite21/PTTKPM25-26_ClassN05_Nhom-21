package com.nhom21.registration.service;

import com.nhom21.registration.domain.*;
import com.nhom21.registration.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import com.nhom21.registration.exception.WaitlistException;

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

    @Autowired
    private WaitlistRepository waitlistRepository;

    @Autowired
    private LichThiRepository lichThiRepository;

    @Autowired
    private HoaDonHocPhiRepository hoaDonHocPhiRepository;

    @Override
    @Transactional(noRollbackFor = WaitlistException.class)
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

        // Kiểm tra giới hạn Ngành học của đợt đăng ký
        if (dot.getDsNganh() != null && !dot.getDsNganh().isEmpty() && sv.getNganh() != null) {
            boolean nganhHopLe = false;
            for (Nganh n : dot.getDsNganh()) {
                if (n.getId().equals(sv.getNganh().getId())) {
                    nganhHopLe = true;
                    break;
                }
            }
            if (!nganhHopLe) {
                throw new IllegalStateException("Đợt đăng ký này không giới hạn cho Ngành học của bạn (" + sv.getNganh().getTenNganh() + ")!");
            }
        }

        if (lhp.getTrangThai() != TrangThaiLopHocPhan.MO_DANG_KY) {
            throw new IllegalStateException("Lớp học phần hiện tại không mở để đăng ký!");
        }

        // 3. Kiểm tra xem sinh viên đã đăng ký môn học này (ở bất kỳ lớp học phần nào) và thành công chưa
        List<DangKy> activeDk = dangKyRepository.findBySinhVienIdAndTrangThai(sinhVienId, TrangThaiDangKy.THANH_CONG);
        for (DangKy dk : activeDk) {
            if (dk.getLopHocPhan().getMonHoc().getId().equals(lhp.getMonHoc().getId())) {
                if (dk.getLopHocPhan().getId().equals(lopHPId)) {
                    throw new IllegalStateException("Bạn đã đăng ký thành công lớp học phần này từ trước!");
                } else {
                    throw new IllegalStateException("Bạn đã đăng ký một lớp học phần khác của môn học này!");
                }
            }
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

        // 5.5. Kiểm tra trùng lịch thi
        if (kiemTraTrungLichThi(sinhVienId, lopHPId)) {
            throw new IllegalStateException("Trùng lịch thi với lớp học phần đã đăng ký!");
        }

        // 6. Kiểm tra sĩ số còn chỗ trống không. Nếu hết, thực hiện xếp hàng chờ (Waitlist)
        if (!lhp.kiemTraConCho()) {
            Optional<Waitlist> wlOpt = waitlistRepository.findBySinhVienIdAndLopHocPhanId(sinhVienId, lopHPId);
            if (wlOpt.isPresent()) {
                throw new IllegalStateException("Bạn đã nằm trong danh sách chờ của lớp học phần này!");
            }
            List<Waitlist> currentWaitlist = waitlistRepository.findByLopHocPhanIdOrderByThuTuAsc(lopHPId);
            int nextPosition = currentWaitlist.isEmpty() ? 1 : currentWaitlist.get(currentWaitlist.size() - 1).getThuTu() + 1;
            
            Waitlist waitlist = Waitlist.builder()
                    .sinhVien(sv)
                    .lopHocPhan(lhp)
                    .ngayCho(LocalDateTime.now())
                    .thuTu(nextPosition)
                    .build();
            waitlistRepository.save(waitlist);
            
            throw new WaitlistException("WAITLIST: Bạn đã được xếp vào danh sách chờ ở vị trí số " + nextPosition, nextPosition);
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

        DangKy savedDk = dangKyRepository.save(newDangKy);

        // Cập nhật công nợ học phí
        capNhatHocPhi(sv, lhp.getDotDangKy().getTenDot(), lhp.getMonHoc().getSoTinChi());

        return savedDk;
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

        // Giảm học phí của sinh viên hủy đăng ký
        capNhatHocPhi(dk.getSinhVien(), lhp.getDotDangKy().getTenDot(), -lhp.getMonHoc().getSoTinChi());

        // Tự động đẩy sinh viên tiếp theo trong Waitlist lên thành công (FIFO)
        List<Waitlist> waitlist = waitlistRepository.findByLopHocPhanIdOrderByThuTuAsc(lhp.getId());
        for (Waitlist wl : waitlist) {
            Long svId = wl.getSinhVien().getId();
            boolean hopLe = true;

            // 1. Kiểm tra xem sinh viên đã có đăng ký thành công môn học này chưa
            List<DangKy> activeDk = dangKyRepository.findBySinhVienIdAndTrangThai(svId, TrangThaiDangKy.THANH_CONG);
            for (DangKy active : activeDk) {
                if (active.getLopHocPhan().getMonHoc().getId().equals(lhp.getMonHoc().getId())) {
                    hopLe = false;
                    break;
                }
            }

            // 2. Kiểm tra điều kiện môn học tiên quyết
            if (hopLe && !kiemTraDieuKienTienQuyet(svId, lhp.getMonHoc().getId())) {
                hopLe = false;
            }

            // 3. Kiểm tra trùng lịch học
            if (hopLe) {
                List<LichHoc> lichMoi = lichHocRepository.findByLopHocPhanId(lhp.getId());
                if (kiemTraTrungLich(svId, lichMoi)) {
                    hopLe = false;
                }
            }

            // 4. Kiểm tra trùng lịch thi
            if (hopLe && kiemTraTrungLichThi(svId, lhp.getId())) {
                hopLe = false;
            }

            // Xóa khỏi waitlist
            waitlistRepository.delete(wl);

            if (hopLe) {
                // Thăng hạng thành công
                lhp.tangSiSo();
                lopHocPhanRepository.save(lhp);

                DangKy newDangKy = DangKy.builder()
                        .sinhVien(wl.getSinhVien())
                        .lopHocPhan(lhp)
                        .ngayDangKy(LocalDateTime.now())
                        .trangThai(TrangThaiDangKy.THANH_CONG)
                        .build();
                dangKyRepository.save(newDangKy);

                // Cập nhật công nợ học phí cho sinh viên được thăng hạng
                capNhatHocPhi(wl.getSinhVien(), lhp.getDotDangKy().getTenDot(), lhp.getMonHoc().getSoTinChi());

                break; // Đã thăng hạng thành công 1 người, kết thúc
            }
        }
    }

    private boolean kiemTraTrungLichThi(Long sinhVienId, Long lopHPId) {
        Optional<LichThi> lichThiMoiOpt = lichThiRepository.findByLopHocPhanId(lopHPId);
        if (lichThiMoiOpt.isEmpty()) {
            return false;
        }
        LichThi lichThiMoi = lichThiMoiOpt.get();

        List<DangKy> activeDks = dangKyRepository.findBySinhVienIdAndTrangThai(sinhVienId, TrangThaiDangKy.THANH_CONG);
        for (DangKy dk : activeDks) {
            if (dk.getLopHocPhan().getId().equals(lopHPId)) {
                continue;
            }
            Optional<LichThi> ltOpt = lichThiRepository.findByLopHocPhanId(dk.getLopHocPhan().getId());
            if (ltOpt.isPresent()) {
                LichThi lt = ltOpt.get();
                if (lt.getNgayThi().equals(lichThiMoi.getNgayThi()) && lt.getCaThi().equalsIgnoreCase(lichThiMoi.getCaThi())) {
                    return true;
                }
            }
        }
        return false;
    }

    private void capNhatHocPhi(SinhVien sv, String hocKy, int creditsDelta) {
        Optional<HoaDonHocPhi> hdOpt = hoaDonHocPhiRepository.findBySinhVienIdAndHocKy(sv.getId(), hocKy);
        if (hdOpt.isPresent()) {
            HoaDonHocPhi hd = hdOpt.get();
            int newCredits = Math.max(0, hd.getTongTinChi() + creditsDelta);
            hd.setTongTinChi(newCredits);
            hd.setTongTien(newCredits * 500000.0);
            if (creditsDelta > 0 && newCredits > 0) {
                hd.setTrangThai("CHUA_THANH_TOAN");
            }
            hoaDonHocPhiRepository.save(hd);
        } else {
            if (creditsDelta > 0) {
                HoaDonHocPhi hd = HoaDonHocPhi.builder()
                        .sinhVien(sv)
                        .hocKy(hocKy)
                        .tongTinChi(creditsDelta)
                        .tongTien(creditsDelta * 500000.0)
                        .trangThai("CHUA_THANH_TOAN")
                        .build();
                hoaDonHocPhiRepository.save(hd);
            }
        }
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
