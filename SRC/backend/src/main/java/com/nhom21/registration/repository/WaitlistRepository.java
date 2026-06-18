package com.nhom21.registration.repository;

import com.nhom21.registration.domain.Waitlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface WaitlistRepository extends JpaRepository<Waitlist, Long> {
    List<Waitlist> findByLopHocPhanIdOrderByThuTuAsc(Long lopHocPhanId);
    List<Waitlist> findBySinhVienId(Long sinhVienId);
    Optional<Waitlist> findBySinhVienIdAndLopHocPhanId(Long sinhVienId, Long lopHocPhanId);
}
