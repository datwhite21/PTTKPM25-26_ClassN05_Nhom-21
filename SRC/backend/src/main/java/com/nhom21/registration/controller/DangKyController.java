package com.nhom21.registration.controller;

import com.nhom21.registration.domain.DangKy;
import com.nhom21.registration.domain.LichHoc;
import com.nhom21.registration.service.IDangKyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/registrations")
public class DangKyController {

    @Autowired
    private IDangKyService dangKyService;

    @PostMapping
    public ResponseEntity<?> dangKyHocPhan(@RequestBody Map<String, Long> payload) {
        Long sinhVienId = payload.get("sinhVienId");
        Long lopHPId = payload.get("lopHocPhanId");
        
        if (sinhVienId == null || lopHPId == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Thiếu thông tin sinhVienId hoặc lopHocPhanId"));
        }

        try {
            DangKy res = dangKyService.thucHienDangKy(sinhVienId, lopHPId);
            return ResponseEntity.status(HttpStatus.CREATED).body(res);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "Đã xảy ra lỗi hệ thống!"));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> huyDangKy(@PathVariable("id") Long id) {
        try {
            dangKyService.huyDangKy(id);
            return ResponseEntity.ok().body(Map.of("message", "Hủy đăng ký học phần thành công."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "Đã xảy ra lỗi hệ thống!"));
        }
    }

    @GetMapping("/student/{id}/schedule")
    public ResponseEntity<?> layLichHoc(@PathVariable("id") Long studentId) {
        try {
            List<LichHoc> schedule = dangKyService.layLichHocSinhVien(studentId);
            return ResponseEntity.ok(schedule);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "Không thể truy xuất lịch học!"));
        }
    }
}
