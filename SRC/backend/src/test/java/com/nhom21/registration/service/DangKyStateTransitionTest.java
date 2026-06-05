package com.nhom21.registration.service;

import com.nhom21.registration.domain.DangKy;
import com.nhom21.registration.domain.LopHocPhan;
import com.nhom21.registration.domain.TrangThaiDangKy;
import com.nhom21.registration.domain.TrangThaiLopHocPhan;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class DangKyStateTransitionTest {

    private LopHocPhan lopHocPhan;
    private DangKy dangKy;

    @BeforeEach
    void setUp() {
        lopHocPhan = LopHocPhan.builder()
                .id(1L)
                .maLopHP("LHP01")
                .siSoToiDa(3)
                .siSoHienTai(0)
                .trangThai(TrangThaiLopHocPhan.MOI_TAO)
                .build();

        dangKy = DangKy.builder()
                .id(1L)
                .trangThai(TrangThaiDangKy.CHO_DUYET)
                .build();
    }

    @Test
    void testSiSoHienTaiBanDauBangKhong() {
        assertEquals(0, lopHocPhan.getSiSoHienTai());
        assertTrue(lopHocPhan.kiemTraConCho());
    }

    @Test
    void testTangSiSoHopLe() {
        lopHocPhan.tangSiSo();
        assertEquals(1, lopHocPhan.getSiSoHienTai());
        assertTrue(lopHocPhan.kiemTraConCho());
    }

    @Test
    void testTangSiSoChamNguongToiDa() {
        lopHocPhan.tangSiSo(); // 1
        lopHocPhan.tangSiSo(); // 2
        lopHocPhan.tangSiSo(); // 3
        assertEquals(3, lopHocPhan.getSiSoHienTai());
        assertFalse(lopHocPhan.kiemTraConCho());

        // Tăng tiếp khi đã đầy phải ném ra ngoại lệ
        assertThrows(IllegalStateException.class, () -> {
            lopHocPhan.tangSiSo();
        });
    }

    @Test
    void testGiamSiSoHopLe() {
        lopHocPhan.tangSiSo(); // 1
        lopHocPhan.giamSiSo(); // 0
        assertEquals(0, lopHocPhan.getSiSoHienTai());
    }

    @Test
    void testGiamSiSoDuoiMucKhongNgoaiLe() {
        // Giảm sĩ số khi đang bằng 0 phải ném ra ngoại lệ
        assertThrows(IllegalStateException.class, () -> {
            lopHocPhan.giamSiSo();
        });
    }

    @Test
    void testLopHocPhanChuyenTrangThaiHopLe() {
        // MOI_TAO -> MO_DANG_KY -> DONG_DANG_KY -> DANG_HOC -> KET_THUC
        assertEquals(TrangThaiLopHocPhan.MOI_TAO, lopHocPhan.getTrangThai());
        
        lopHocPhan.chuyenTrangThai(TrangThaiLopHocPhan.MO_DANG_KY);
        assertEquals(TrangThaiLopHocPhan.MO_DANG_KY, lopHocPhan.getTrangThai());

        lopHocPhan.chuyenTrangThai(TrangThaiLopHocPhan.DONG_DANG_KY);
        assertEquals(TrangThaiLopHocPhan.DONG_DANG_KY, lopHocPhan.getTrangThai());

        lopHocPhan.chuyenTrangThai(TrangThaiLopHocPhan.DANG_HOC);
        assertEquals(TrangThaiLopHocPhan.DANG_HOC, lopHocPhan.getTrangThai());

        lopHocPhan.chuyenTrangThai(TrangThaiLopHocPhan.KET_THUC);
        assertEquals(TrangThaiLopHocPhan.KET_THUC, lopHocPhan.getTrangThai());
    }

    @Test
    void testLopHocPhanChuyenTrangThaiHuyLop() {
        // MOI_TAO -> HUY_LOP
        lopHocPhan.chuyenTrangThai(TrangThaiLopHocPhan.HUY_LOP);
        assertEquals(TrangThaiLopHocPhan.HUY_LOP, lopHocPhan.getTrangThai());
    }

    @Test
    void testLopHocPhanChuyenTrangThaiKhongHopLe() {
        // MOI_TAO -> DANG_HOC (Không hợp lệ)
        assertThrows(IllegalStateException.class, () -> {
            lopHocPhan.chuyenTrangThai(TrangThaiLopHocPhan.DANG_HOC);
        });

        // Đi sang HUY_LOP rồi sang KET_THUC (Không hợp lệ)
        lopHocPhan.chuyenTrangThai(TrangThaiLopHocPhan.HUY_LOP);
        assertThrows(IllegalStateException.class, () -> {
            lopHocPhan.chuyenTrangThai(TrangThaiLopHocPhan.KET_THUC);
        });
    }

    @Test
    void testDangKyChuyenTrangThaiHopLe() {
        // CHO_DUYET -> THANH_CONG
        assertEquals(TrangThaiDangKy.CHO_DUYET, dangKy.getTrangThai());
        dangKy.chuyenTrangThai(TrangThaiDangKy.THANH_CONG);
        assertEquals(TrangThaiDangKy.THANH_CONG, dangKy.getTrangThai());

        // THANH_CONG -> DA_HUY
        dangKy.chuyenTrangThai(TrangThaiDangKy.DA_HUY);
        assertEquals(TrangThaiDangKy.DA_HUY, dangKy.getTrangThai());
    }

    @Test
    void testDangKyChuyenTrangThaiTuChoiDuyet() {
        // CHO_DUYET -> DA_HUY (Từ chối duyệt)
        dangKy.chuyenTrangThai(TrangThaiDangKy.DA_HUY);
        assertEquals(TrangThaiDangKy.DA_HUY, dangKy.getTrangThai());
    }

    @Test
    void testDangKyChuyenTrangThaiKhongHopLe() {
        // DA_HUY -> THANH_CONG (Không hợp lệ)
        dangKy.chuyenTrangThai(TrangThaiDangKy.DA_HUY);
        assertThrows(IllegalStateException.class, () -> {
            dangKy.chuyenTrangThai(TrangThaiDangKy.THANH_CONG);
        });
    }
}
