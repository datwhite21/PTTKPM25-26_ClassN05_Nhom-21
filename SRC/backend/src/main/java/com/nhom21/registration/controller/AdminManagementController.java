package com.nhom21.registration.controller;

import com.nhom21.registration.domain.*;
import com.nhom21.registration.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AdminManagementController {

    @Autowired
    private MonHocRepository monHocRepository;

    @Autowired
    private GiangVienRepository giangVienRepository;

    @Autowired
    private NguoiDungRepository nguoiDungRepository;

    @Autowired
    private KhoaRepository khoaRepository;

    // --- KHOA ---
    @GetMapping("/admin/khoa")
    public ResponseEntity<List<Khoa>> layTatCaKhoa() {
        return ResponseEntity.ok(khoaRepository.findAll());
    }

    // --- MON HOC ---
    @PostMapping("/admin/mon-hoc")
    @Transactional
    public ResponseEntity<?> taoMonHoc(@RequestBody Map<String, Object> payload) {
        try {
            String maMon = (String) payload.get("maMon");
            String tenMon = (String) payload.get("tenMon");
            Integer soTinChi = Integer.valueOf(payload.get("soTinChi").toString());
            
            if (monHocRepository.findAll().stream().anyMatch(m -> m.getMaMon().equalsIgnoreCase(maMon))) {
                return ResponseEntity.badRequest().body(Map.of("message", "Mã môn học đã tồn tại!"));
            }

            MonHoc mh = new MonHoc();
            mh.setMaMon(maMon);
            mh.setTenMon(tenMon);
            mh.setSoTinChi(soTinChi);

            List<Number> prIds = (List<Number>) payload.get("monTienQuyetIds");
            List<MonHoc> prList = new ArrayList<>();
            if (prIds != null) {
                for (Number prId : prIds) {
                    monHocRepository.findById(prId.longValue()).ifPresent(prList::add);
                }
            }
            mh.setMonTienQuyet(prList);

            return ResponseEntity.status(HttpStatus.CREATED).body(monHocRepository.save(mh));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Lỗi: " + e.getMessage()));
        }
    }

    @PutMapping("/admin/mon-hoc/{id}")
    @Transactional
    public ResponseEntity<?> capNhatMonHoc(@PathVariable("id") Long id, @RequestBody Map<String, Object> payload) {
        try {
            MonHoc mh = monHocRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy môn học"));

            String maMon = (String) payload.get("maMon");
            String tenMon = (String) payload.get("tenMon");
            Integer soTinChi = Integer.valueOf(payload.get("soTinChi").toString());

            if (monHocRepository.findAll().stream().anyMatch(m -> m.getMaMon().equalsIgnoreCase(maMon) && !m.getId().equals(id))) {
                return ResponseEntity.badRequest().body(Map.of("message", "Mã môn học đã tồn tại!"));
            }

            mh.setMaMon(maMon);
            mh.setTenMon(tenMon);
            mh.setSoTinChi(soTinChi);

            List<Number> prIds = (List<Number>) payload.get("monTienQuyetIds");
            List<MonHoc> prList = new ArrayList<>();
            if (prIds != null) {
                for (Number prId : prIds) {
                    monHocRepository.findById(prId.longValue()).ifPresent(prList::add);
                }
            }
            mh.setMonTienQuyet(prList);

            return ResponseEntity.ok(monHocRepository.save(mh));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Lỗi: " + e.getMessage()));
        }
    }

    @DeleteMapping("/admin/mon-hoc/{id}")
    @Transactional
    public ResponseEntity<?> xoaMonHoc(@PathVariable("id") Long id) {
        try {
            MonHoc mh = monHocRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy môn học"));
            monHocRepository.delete(mh);
            return ResponseEntity.ok(Map.of("message", "Xóa môn học thành công."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Không thể xóa môn học (có thể đã được liên kết với lớp học phần)."));
        }
    }

    // --- GIANG VIEN ---
    @PostMapping("/admin/giang-vien")
    @Transactional
    public ResponseEntity<?> taoGiangVien(@RequestBody Map<String, Object> payload) {
        try {
            String maGV = (String) payload.get("maGV");
            String hoTen = (String) payload.get("hoTen");
            String email = (String) payload.get("email");
            Long khoaId = Long.valueOf(payload.get("khoaId").toString());

            if (giangVienRepository.findAll().stream().anyMatch(g -> g.getMaGV().equalsIgnoreCase(maGV))) {
                return ResponseEntity.badRequest().body(Map.of("message", "Mã giảng viên đã tồn tại!"));
            }

            Optional<NguoiDung> existingUser = nguoiDungRepository.findByEmail(email);
            NguoiDung user;
            if (existingUser.isPresent()) {
                user = existingUser.get();
                if (user.getVaiTro() != LoaiNguoiDung.GIANG_VIEN) {
                    return ResponseEntity.badRequest().body(Map.of("message", "Email đã tồn tại với vai trò khác!"));
                }
            } else {
                user = new NguoiDung();
                user.setEmail(email);
                user.setMatKhau("123456");
                user.setHoTen(hoTen);
                user.setVaiTro(LoaiNguoiDung.GIANG_VIEN);
                user = nguoiDungRepository.save(user);
            }

            GiangVien gv = new GiangVien();
            gv.setMaGV(maGV);
            gv.setNguoiDung(user);
            gv.setKhoa(khoaRepository.findById(khoaId).orElseThrow(() -> new IllegalArgumentException("Không tìm thấy khoa")));

            return ResponseEntity.status(HttpStatus.CREATED).body(giangVienRepository.save(gv));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Lỗi: " + e.getMessage()));
        }
    }

    @PutMapping("/admin/giang-vien/{id}")
    @Transactional
    public ResponseEntity<?> capNhatGiangVien(@PathVariable("id") Long id, @RequestBody Map<String, Object> payload) {
        try {
            GiangVien gv = giangVienRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy giảng viên"));

            String maGV = (String) payload.get("maGV");
            String hoTen = (String) payload.get("hoTen");
            String email = (String) payload.get("email");
            Long khoaId = Long.valueOf(payload.get("khoaId").toString());

            if (giangVienRepository.findAll().stream().anyMatch(g -> g.getMaGV().equalsIgnoreCase(maGV) && !g.getId().equals(id))) {
                return ResponseEntity.badRequest().body(Map.of("message", "Mã giảng viên đã tồn tại!"));
            }

            NguoiDung user = gv.getNguoiDung();
            user.setHoTen(hoTen);
            user.setEmail(email);
            nguoiDungRepository.save(user);

            gv.setMaGV(maGV);
            gv.setKhoa(khoaRepository.findById(khoaId).orElseThrow(() -> new IllegalArgumentException("Không tìm thấy khoa")));

            return ResponseEntity.ok(giangVienRepository.save(gv));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Lỗi: " + e.getMessage()));
        }
    }

    @DeleteMapping("/admin/giang-vien/{id}")
    @Transactional
    public ResponseEntity<?> xoaGiangVien(@PathVariable("id") Long id) {
        try {
            GiangVien gv = giangVienRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy giảng viên"));
            giangVienRepository.delete(gv);
            return ResponseEntity.ok(Map.of("message", "Xóa giảng viên thành công."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Không thể xóa giảng viên (có thể đã được phân công dạy lớp học phần)."));
        }
    }
}
