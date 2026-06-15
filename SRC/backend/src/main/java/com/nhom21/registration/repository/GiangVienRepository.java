package com.nhom21.registration.repository;

import com.nhom21.registration.domain.GiangVien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface GiangVienRepository extends JpaRepository<GiangVien, Long> {
    Optional<GiangVien> findByNguoiDungId(Long nguoiDungId);
}
