package com.nhom21.registration.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "dang_ky")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class DangKy {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sinh_vien_id", nullable = false)
    private SinhVien sinhVien;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lop_hoc_phan_id", nullable = false)
    private LopHocPhan lopHocPhan;

    @Column(name = "ngay_dang_ky", nullable = false)
    private LocalDateTime ngayDangKy;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai", nullable = false)
    private TrangThaiDangKy trangThai;

    public void chuyenTrangThai(TrangThaiDangKy newTrangThai) {
        if (this.trangThai == newTrangThai) {
            return;
        }
        boolean valid = false;
        switch (this.trangThai) {
            case CHO_DUYET:
                if (newTrangThai == TrangThaiDangKy.THANH_CONG || newTrangThai == TrangThaiDangKy.DA_HUY) {
                    valid = true;
                }
                break;
            case THANH_CONG:
                if (newTrangThai == TrangThaiDangKy.DA_HUY) {
                    valid = true;
                }
                break;
            case DA_HUY:
                break;
        }
        if (!valid) {
            throw new IllegalStateException("Không thể chuyển trạng thái đăng ký từ " + this.trangThai + " sang " + newTrangThai);
        }
        this.trangThai = newTrangThai;
    }
}
