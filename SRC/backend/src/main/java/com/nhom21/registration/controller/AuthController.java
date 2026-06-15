package com.nhom21.registration.controller;

import com.nhom21.registration.domain.GiangVien;
import com.nhom21.registration.domain.NguoiDung;
import com.nhom21.registration.domain.SinhVien;
import com.nhom21.registration.domain.LoaiNguoiDung;
import com.nhom21.registration.repository.GiangVienRepository;
import com.nhom21.registration.repository.NguoiDungRepository;
import com.nhom21.registration.repository.SinhVienRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private NguoiDungRepository nguoiDungRepository;

    @Autowired
    private SinhVienRepository sinhVienRepository;

    @Autowired
    private GiangVienRepository giangVienRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String password = payload.get("password");

        if (email == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email và mật khẩu không được để trống!"));
        }

        Optional<NguoiDung> userOpt = nguoiDungRepository.findByEmail(email);
        if (userOpt.isEmpty() || !userOpt.get().getMatKhau().equals(password)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Email hoặc mật khẩu không chính xác!"));
        }

        NguoiDung user = userOpt.get();
        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("email", user.getEmail());
        response.put("hoTen", user.getHoTen());
        response.put("vaiTro", user.getVaiTro().name());

        if (user.getVaiTro() == LoaiNguoiDung.SINH_VIEN) {
            Optional<SinhVien> sv = sinhVienRepository.findByNguoiDungId(user.getId());
            if (sv.isPresent()) {
                response.put("sinhVienId", sv.get().getId());
                response.put("maSV", sv.get().getMaSV());
            }
        } else if (user.getVaiTro() == LoaiNguoiDung.GIANG_VIEN) {
            Optional<GiangVien> gv = giangVienRepository.findByNguoiDungId(user.getId());
            if (gv.isPresent()) {
                response.put("giangVienId", gv.get().getId());
                response.put("maGV", gv.get().getMaGV());
            }
        }

        return ResponseEntity.ok(response);
    }
}
