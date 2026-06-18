package com.nhom21.registration.controller;

import com.nhom21.registration.domain.KetQuaHocTap;
import com.nhom21.registration.repository.KetQuaHocTapRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/results")
@CrossOrigin(origins = "*")
public class KetQuaHocTapController {

    @Autowired
    private KetQuaHocTapRepository ketQuaHocTapRepository;

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<KetQuaHocTap>> layKetQuaHocTap(@PathVariable("studentId") Long studentId) {
        List<KetQuaHocTap> results = ketQuaHocTapRepository.findBySinhVienId(studentId);
        return ResponseEntity.ok(results);
    }
}
