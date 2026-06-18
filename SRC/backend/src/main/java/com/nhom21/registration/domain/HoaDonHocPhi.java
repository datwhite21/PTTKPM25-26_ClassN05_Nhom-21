package com.nhom21.registration.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "hoa_don_hoc_phi")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class HoaDonHocPhi {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sinh_vien_id", nullable = false)
    private SinhVien sinhVien;

    @Column(name = "hoc_ky", nullable = false)
    private String hocKy;

    @Column(name = "tong_tin_chi", nullable = false)
    private Integer tongTinChi;

    @Column(name = "tong_tien", nullable = false)
    private Double tongTien;

    @Column(name = "trang_thai", nullable = false)
    private String trangThai; // CHUA_THANH_TOAN, DA_THANH_TOAN

    @Column(name = "ngay_thanh_toan")
    private LocalDateTime ngayThanhToan;
}
