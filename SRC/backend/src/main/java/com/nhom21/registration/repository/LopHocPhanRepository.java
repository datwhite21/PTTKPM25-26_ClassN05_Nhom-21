package com.nhom21.registration.repository;

import com.nhom21.registration.domain.LopHocPhan;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface LopHocPhanRepository extends JpaRepository<LopHocPhan, Long> {
    
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT l FROM LopHocPhan l WHERE l.id = :id")
    Optional<LopHocPhan> findByIdForUpdate(@Param("id") Long id);

    Optional<LopHocPhan> findByMaLopHP(String maLopHP);

    @Query("SELECT l FROM LopHocPhan l WHERE " +
           "LOWER(l.maLopHP) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(l.monHoc.tenMon) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(l.giangVien.nguoiDung.hoTen) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<LopHocPhan> searchLopHocPhan(@Param("keyword") String keyword);
}
