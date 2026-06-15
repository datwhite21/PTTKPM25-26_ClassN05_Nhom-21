package com.nhom21.registration.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "dot_dang_ky")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class DotDangKy {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ten_dot", nullable = false)
    private String tenDot;

    @Column(name = "ngay_mo", nullable = false)
    private LocalDateTime ngayMo;

    @Column(name = "ngay_dong", nullable = false)
    private LocalDateTime ngayDong;

    @Column(name = "trang_thai_mo", nullable = false)
    private Boolean trangThaiMo;
}
