package com.nhom21.registration.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "sinh_vien")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class SinhVien {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ma_sv", nullable = false, unique = true)
    private String maSV;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nguoi_dung_id", nullable = false)
    private NguoiDung nguoiDung;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nganh_id", nullable = false)
    private Nganh nganh;

    @Transient
    private com.nhom21.registration.strategy.HocPhiStrategy hocPhiStrategy;

    public String getHoTen() {
        return this.nguoiDung != null ? this.nguoiDung.getHoTen() : "Không tên";
    }

    public void setHocPhiStrategy(com.nhom21.registration.strategy.HocPhiStrategy strategy) {
        this.hocPhiStrategy = strategy;
    }

    public double tinhTongHocPhi(int soTinChi, double donGiaCoBan) {
        if (this.hocPhiStrategy == null) {
            throw new IllegalStateException("Học phí strategy chưa được thiết lập!");
        }
        return this.hocPhiStrategy.tinhHocPhi(soTinChi, donGiaCoBan);
    }
}
