package com.nhom21.registration.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "lich_hoc")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LichHoc {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "thu", nullable = false)
    private Integer thu; // 2 -> 7, 8 (Chủ nhật)

    @Column(name = "tiet_bat_dau", nullable = false)
    private Integer tietBatDau;

    @Column(name = "tiet_ket_thuc", nullable = false)
    private Integer tietKetThuc;

    @Column(name = "phong_hoc", nullable = false)
    private String phongHoc;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lop_hoc_phan_id", nullable = false)
    private LopHocPhan lopHocPhan;
}
