package com.nhom21.registration.repository;

import com.nhom21.registration.domain.SinhVien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface SinhVienRepository extends JpaRepository<SinhVien, Long> {
    Optional<SinhVien> findByMaSV(String maSV);
    Optional<SinhVien> findByNguoiDungId(Long nguoiDungId);
}
