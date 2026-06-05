package com.nhom21.registration.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "nguoi_dung")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NguoiDung {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "mat_khau", nullable = false)
    private String matKhau;

    @Column(name = "ho_ten", nullable = false)
    private String hoTen;

    @Enumerated(EnumType.STRING)
    @Column(name = "vai_tro", nullable = false)
    private LoaiNguoiDung vaiTro;
}
