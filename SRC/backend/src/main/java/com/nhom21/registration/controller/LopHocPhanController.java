package com.nhom21.registration.controller;

import com.nhom21.registration.domain.*;
import com.nhom21.registration.repository.*;
import com.nhom21.registration.service.ILopHocPhanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class LopHocPhanController {

    @Autowired
    private ILopHocPhanService lopHocPhanService;

    @Autowired
    private MonHocRepository monHocRepository;

    @Autowired
    private GiangVienRepository giangVienRepository;

    @Autowired
    private DotDangKyRepository dotDangKyRepository;

    @Autowired
    private LichThiRepository lichThiRepository;

    @GetMapping("/lich-thi")
    public ResponseEntity<List<LichThi>> layTatCaLichThi() {
        return ResponseEntity.ok(lichThiRepository.findAll());
    }

    @GetMapping("/admin/mon-hoc")
    public ResponseEntity<List<MonHoc>> layTatCaMonHoc() {
        return ResponseEntity.ok(monHocRepository.findAll());
    }

    @GetMapping("/mon-hoc")
    public ResponseEntity<List<MonHoc>> layDanhSachMonHoc() {
        return ResponseEntity.ok(monHocRepository.findAll());
    }

    @GetMapping("/admin/giang-vien")
    public ResponseEntity<List<GiangVien>> layTatCaGiangVien() {
        return ResponseEntity.ok(giangVienRepository.findAll());
    }

    @GetMapping("/admin/dot-dang-ky")
    public ResponseEntity<List<DotDangKy>> layTatCaDotDangKy() {
        return ResponseEntity.ok(dotDangKyRepository.findAll());
    }

    @GetMapping("/course-sections/search")
    public ResponseEntity<List<LopHocPhan>> timKiemLop(@RequestParam(value = "keyword", required = false) String keyword) {
        return ResponseEntity.ok(lopHocPhanService.timKiemLopHocPhan(keyword));
    }

    @GetMapping("/admin/course-sections")
    public ResponseEntity<List<LopHocPhan>> layDanhSachLop() {
        return ResponseEntity.ok(lopHocPhanService.layTatCaLopHocPhan());
    }

    @GetMapping("/admin/course-sections/{id}")
    public ResponseEntity<LopHocPhan> layChiTietLop(@PathVariable("id") Long id) {
        return ResponseEntity.ok(lopHocPhanService.layLopHocPhanChiTiet(id));
    }

    @PostMapping("/admin/course-sections")
    public ResponseEntity<LopHocPhan> taoMoiLop(@RequestBody LopHocPhan lopHocPhan) {
        LopHocPhan res = lopHocPhanService.taoMoiLopHocPhan(lopHocPhan);
        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }

    @PutMapping("/admin/course-sections/{id}")
    public ResponseEntity<LopHocPhan> capNhatLop(@PathVariable("id") Long id, @RequestBody LopHocPhan details) {
        LopHocPhan res = lopHocPhanService.capNhatLopHocPhan(id, details);
        return ResponseEntity.ok(res);
    }

    @DeleteMapping("/admin/course-sections/{id}")
    public ResponseEntity<Map<String, String>> xoaLop(@PathVariable("id") Long id) {
        lopHocPhanService.xoaLopHocPhan(id);
        return ResponseEntity.ok(Map.of("message", "Xóa lớp học phần thành công."));
    }
}
