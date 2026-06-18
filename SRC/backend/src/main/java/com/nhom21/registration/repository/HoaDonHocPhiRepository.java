package com.nhom21.registration.repository;

import com.nhom21.registration.domain.HoaDonHocPhi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface HoaDonHocPhiRepository extends JpaRepository<HoaDonHocPhi, Long> {
    List<HoaDonHocPhi> findBySinhVienId(Long sinhVienId);
    Optional<HoaDonHocPhi> findBySinhVienIdAndHocKy(Long sinhVienId, String hocKy);
}
