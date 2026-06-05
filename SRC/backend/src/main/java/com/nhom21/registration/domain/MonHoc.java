package com.nhom21.registration.domain;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "mon_hoc")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MonHoc {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ma_mon", nullable = false, unique = true)
    private String maMon;

    @Column(name = "ten_mon", nullable = false)
    private String tenMon;

    @Column(name = "so_tin_chi", nullable = false)
    private Integer soTinChi;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "mon_tien_quyet",
        joinColumns = @JoinColumn(name = "mon_id"),
        inverseJoinColumns = @JoinColumn(name = "mon_tien_quyet_id")
    )
    private List<MonHoc> monTienQuyet;
}
