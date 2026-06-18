package com.nhom21.registration.controller;

import com.nhom21.registration.domain.DangKy;
import com.nhom21.registration.domain.LichHoc;
import com.nhom21.registration.service.IDangKyService;
import com.nhom21.registration.exception.WaitlistException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/registrations")
@CrossOrigin(origins = "*")
public class DangKyController {

    @Autowired
    private IDangKyService dangKyService;

    public static class DangKyRequest {
        private Long sinhVienId;
        private Long lopHocPhanId;

        public Long getSinhVienId() { return sinhVienId; }
        public void setSinhVienId(Long sinhVienId) { this.sinhVienId = sinhVienId; }
        public Long getLopHocPhanId() { return lopHocPhanId; }
        public void setLopHocPhanId(Long lopHocPhanId) { this.lopHocPhanId = lopHocPhanId; }
    }

    @PostMapping
    public ResponseEntity<?> dangKyHocPhan(@RequestBody DangKyRequest payload) {
        Long sinhVienId = payload.getSinhVienId();
        Long lopHPId = payload.getLopHocPhanId();
        
        if (sinhVienId == null || lopHPId == null) {
            throw new IllegalArgumentException("Thiếu thông tin sinhVienId hoặc lopHocPhanId");
        }

        try {
            DangKy res = dangKyService.thucHienDangKy(sinhVienId, lopHPId);
            return ResponseEntity.status(HttpStatus.CREATED).body(res);
        } catch (WaitlistException e) {
            return ResponseEntity.status(HttpStatus.ACCEPTED)
                    .body(Map.of("message", e.getMessage(), "status", "WAITLIST", "position", e.getPosition()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> huyDangKy(@PathVariable("id") Long id) {
        dangKyService.huyDangKy(id);
        return ResponseEntity.ok().body(Map.of("message", "Hủy đăng ký học phần thành công."));
    }

    @GetMapping("/student/{id}/schedule")
    public ResponseEntity<List<LichHoc>> layLichHoc(@PathVariable("id") Long studentId) {
        List<LichHoc> schedule = dangKyService.layLichHocSinhVien(studentId);
        return ResponseEntity.ok(schedule);
    }

    @GetMapping("/student/{id}")
    public ResponseEntity<List<DangKy>> layDanhSachDangKy(@PathVariable("id") Long studentId) {
        List<DangKy> registrations = dangKyService.layDanhSachDangKySinhVien(studentId);
        return ResponseEntity.ok(registrations);
    }
}
