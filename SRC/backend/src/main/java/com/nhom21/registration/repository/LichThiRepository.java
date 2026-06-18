package com.nhom21.registration.repository;

import com.nhom21.registration.domain.LichThi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface LichThiRepository extends JpaRepository<LichThi, Long> {
    Optional<LichThi> findByLopHocPhanId(Long lopHocPhanId);
}
