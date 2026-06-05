package com.nhom21.registration.repository;

import com.nhom21.registration.domain.LichHoc;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LichHocRepository extends JpaRepository<LichHoc, Long> {
    List<LichHoc> findByLopHocPhanId(Long lopHocPhanId);
}
