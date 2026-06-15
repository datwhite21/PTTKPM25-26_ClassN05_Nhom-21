package com.nhom21.registration.domain;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "lop_hoc_phan")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class LopHocPhan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ma_lop_hp", nullable = false, unique = true)
    private String maLopHP;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mon_hoc_id", nullable = false)
    private MonHoc monHoc;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "giang_vien_id", nullable = false)
    private GiangVien giangVien;

    @Column(name = "si_so_toi_da", nullable = false)
    private Integer siSoToiDa;

    @Column(name = "si_so_hien_tai", nullable = false)
    private Integer siSoHienTai;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai", nullable = false)
    private TrangThaiLopHocPhan trangThai;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dot_dang_ky_id", nullable = false)
    private DotDangKy dotDangKy;

    @OneToMany(mappedBy = "lopHocPhan", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties("lopHocPhan")
    private List<LichHoc> dsLichHoc;

    public LopHocPhan(Long id, String maLopHP, MonHoc monHoc, GiangVien giangVien, Integer siSoToiDa, Integer siSoHienTai, TrangThaiLopHocPhan trangThai, DotDangKy dotDangKy) {
        this.id = id;
        this.maLopHP = maLopHP;
        this.monHoc = monHoc;
        this.giangVien = giangVien;
        this.siSoToiDa = siSoToiDa;
        this.siSoHienTai = siSoHienTai;
        this.trangThai = trangThai;
        this.dotDangKy = dotDangKy;
    }

    public void tangSiSo() {
        if (siSoHienTai >= siSoToiDa) {
            throw new IllegalStateException("Lớp học phần đã đầy sĩ số!");
        }
        this.siSoHienTai++;
    }

    public void giamSiSo() {
        if (siSoHienTai <= 0) {
            throw new IllegalStateException("Sĩ số lớp không thể nhỏ hơn 0!");
        }
        this.siSoHienTai--;
    }

    public boolean kiemTraConCho() {
        return this.siSoHienTai < this.siSoToiDa;
    }

    public void chuyenTrangThai(TrangThaiLopHocPhan newTrangThai) {
        if (this.trangThai == newTrangThai) {
            return;
        }
        boolean valid = false;
        switch (this.trangThai) {
            case MOI_TAO:
                if (newTrangThai == TrangThaiLopHocPhan.MO_DANG_KY || newTrangThai == TrangThaiLopHocPhan.HUY_LOP) {
                    valid = true;
                }
                break;
            case MO_DANG_KY:
                if (newTrangThai == TrangThaiLopHocPhan.DONG_DANG_KY || newTrangThai == TrangThaiLopHocPhan.HUY_LOP) {
                    valid = true;
                }
                break;
            case DONG_DANG_KY:
                if (newTrangThai == TrangThaiLopHocPhan.DANG_HOC) {
                    valid = true;
                }
                break;
            case DANG_HOC:
                if (newTrangThai == TrangThaiLopHocPhan.KET_THUC) {
                    valid = true;
                }
                break;
            case HUY_LOP:
            case KET_THUC:
                break;
        }
        if (!valid) {
            throw new IllegalStateException("Không thể chuyển trạng thái từ " + this.trangThai + " sang " + newTrangThai);
        }
        this.trangThai = newTrangThai;
    }
}
