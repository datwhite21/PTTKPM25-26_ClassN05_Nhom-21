package com.nhom21.registration.repository;

import com.nhom21.registration.domain.KetQuaHocTap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface KetQuaHocTapRepository extends JpaRepository<KetQuaHocTap, Long> {
    Optional<KetQuaHocTap> findBySinhVienIdAndMonHocId(Long sinhVienId, Long monHocId);
    List<KetQuaHocTap> findBySinhVienId(Long sinhVienId);
}
