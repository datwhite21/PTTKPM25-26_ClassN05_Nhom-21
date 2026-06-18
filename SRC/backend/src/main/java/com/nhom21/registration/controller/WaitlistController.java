package com.nhom21.registration.controller;

import com.nhom21.registration.domain.Waitlist;
import com.nhom21.registration.repository.WaitlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/waitlist")
@CrossOrigin(origins = "*")
public class WaitlistController {

    @Autowired
    private WaitlistRepository waitlistRepository;

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Waitlist>> layWaitlistSinhVien(@PathVariable("studentId") Long studentId) {
        List<Waitlist> list = waitlistRepository.findBySinhVienId(studentId);
        return ResponseEntity.ok(list);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> huyWaitlist(@PathVariable("id") Long id) {
        waitlistRepository.deleteById(id);
        return ResponseEntity.ok().body(Map.of("message", "Hủy hàng chờ thành công."));
    }
}
