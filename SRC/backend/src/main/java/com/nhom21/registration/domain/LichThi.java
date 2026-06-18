package com.nhom21.registration.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "lich_thi")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class LichThi {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lop_hoc_phan_id", nullable = false, unique = true)
    private LopHocPhan lopHocPhan;

    @Column(name = "ngay_thi", nullable = false)
    private LocalDate ngayThi;

    @Column(name = "ca_thi", nullable = false)
    private String caThi;

    @Column(name = "phong_thi", nullable = false)
    private String phongThi;
}
