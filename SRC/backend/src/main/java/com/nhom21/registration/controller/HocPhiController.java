package com.nhom21.registration.controller;

import com.nhom21.registration.domain.HoaDonHocPhi;
import com.nhom21.registration.repository.HoaDonHocPhiRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/hoc-phi")
@CrossOrigin(origins = "*")
public class HocPhiController {

    @Autowired
    private HoaDonHocPhiRepository hoaDonHocPhiRepository;

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<HoaDonHocPhi>> layDanhSachHocPhi(@PathVariable("studentId") Long studentId) {
        List<HoaDonHocPhi> list = hoaDonHocPhiRepository.findBySinhVienId(studentId);
        return ResponseEntity.ok(list);
    }

    @PostMapping("/pay/{invoiceId}")
    public ResponseEntity<?> thanhToanHocPhi(@PathVariable("invoiceId") Long invoiceId) {
        HoaDonHocPhi hd = hoaDonHocPhiRepository.findById(invoiceId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy hóa đơn học phí id: " + invoiceId));
        
        hd.setTrangThai("DA_THANH_TOAN");
        hd.setNgayThanhToan(LocalDateTime.now());
        hoaDonHocPhiRepository.save(hd);

        return ResponseEntity.ok().body(Map.of("message", "Thanh toán học phí thành công."));
    }
}
