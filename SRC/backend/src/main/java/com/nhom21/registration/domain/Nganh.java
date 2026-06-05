package com.nhom21.registration.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "nganh")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Nganh {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ma_nganh", nullable = false, unique = true)
    private String maNganh;

    @Column(name = "ten_nganh", nullable = false)
    private String tenNganh;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "khoa_id", nullable = false)
    private Khoa khoa;
}
