package com.nhom21.registration.repository;

import com.nhom21.registration.domain.Nganh;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NganhRepository extends JpaRepository<Nganh, Long> {
}
