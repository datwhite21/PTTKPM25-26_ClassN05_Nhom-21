package com.nhom21.registration.repository;

import com.nhom21.registration.domain.DotDangKy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DotDangKyRepository extends JpaRepository<DotDangKy, Long> {
}
