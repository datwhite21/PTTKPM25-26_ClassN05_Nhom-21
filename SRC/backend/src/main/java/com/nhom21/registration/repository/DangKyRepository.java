package com.nhom21.registration.repository;

import com.nhom21.registration.domain.DangKy;
import com.nhom21.registration.domain.TrangThaiDangKy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface DangKyRepository extends JpaRepository<DangKy, Long> {
    Optional<DangKy> findBySinhVienIdAndLopHocPhanId(Long sinhVienId, Long lopHocPhanId);
    boolean existsBySinhVienIdAndLopHocPhanIdAndTrangThai(Long sinhVienId, Long lopHocPhanId, TrangThaiDangKy trangThai);
    List<DangKy> findBySinhVienIdAndTrangThai(Long sinhVienId, TrangThaiDangKy trangThai);
}
