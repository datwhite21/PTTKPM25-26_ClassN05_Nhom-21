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

    @Column(name = "diem_kiem_tra")
    private Double diemKiemTra;

    @Column(name = "diem_thi")
    private Double diemThi;

    @Column(name = "diem_tong_ket")
    private Double diemTongKet;

    public Double tinhDiemTongKet() {
        if (diemChuyenCan == null || diemKiemTra == null || diemThi == null) {
            return 0.0;
        }
        this.diemTongKet = 0.1 * diemChuyenCan + 0.3 * diemKiemTra + 0.6 * diemThi;
        // Round to 1 decimal place
        this.diemTongKet = Math.round(this.diemTongKet * 10.0) / 10.0;
        return this.diemTongKet;
    }

    public boolean kiemTraDat() {
        Double finalScore = this.diemTongKet != null ? this.diemTongKet : tinhDiemTongKet();
        return finalScore >= 4.0; // Điểm hệ 10 >= 4.0 (Điểm D trở lên) là Đạt
    }
}
