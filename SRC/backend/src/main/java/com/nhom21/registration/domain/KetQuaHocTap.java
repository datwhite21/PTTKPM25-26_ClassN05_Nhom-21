package com.nhom21.registration.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ket_qua_hoc_tap")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class KetQuaHocTap {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sinh_vien_id", nullable = false)
    private SinhVien sinhVien;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mon_hoc_id", nullable = false)
    private MonHoc monHoc;

    @Column(name = "diem_chuyen_can")
    private Double diemChuyenCan;

    @Column(name = "diem_giua_ky")
    private Double diemGiuaKy;

    @Column(name = "diem_cuoi_ky")
    private Double diemCuoiKy;

    @Column(name = "diem_trung_binh", nullable = false)
    private Double diemTrungBinh;

    @Column(name = "trang_thai_dat", nullable = false)
    private Boolean trangThaiDat;

    @PrePersist
    @PreUpdate
    public void tinhDiemTrungBinh() {
        if (this.diemChuyenCan != null && this.diemGiuaKy != null && this.diemCuoiKy != null) {
            this.diemTrungBinh = Math.round((this.diemChuyenCan * 0.1 + this.diemGiuaKy * 0.3 + this.diemCuoiKy * 0.6) * 10.0) / 10.0;
            this.trangThaiDat = this.diemTrungBinh >= 4.0;
        }
    }

    public boolean kiemTraDat() {
        return this.trangThaiDat != null ? this.trangThaiDat : false;
    }
}
