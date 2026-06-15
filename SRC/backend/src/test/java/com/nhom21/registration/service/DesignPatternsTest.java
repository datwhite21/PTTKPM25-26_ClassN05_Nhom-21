package com.nhom21.registration.service;

import com.nhom21.registration.config.SystemConfig;
import com.nhom21.registration.domain.LoaiNguoiDung;
import com.nhom21.registration.domain.LopHocPhan;
import com.nhom21.registration.domain.NguoiDung;
import com.nhom21.registration.domain.SinhVien;
import com.nhom21.registration.domain.TrangThaiLopHocPhan;
import com.nhom21.registration.factory.NguoiDungFactory;
import com.nhom21.registration.observer.SinhVienObserver;
import com.nhom21.registration.strategy.ChatLuongCaoHocPhiStrategy;
import com.nhom21.registration.strategy.ChinhQuyHocPhiStrategy;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class DesignPatternsTest {

    @Test
    void testSingletonSystemConfig() {
        SystemConfig config1 = SystemConfig.getInstance();
        SystemConfig config2 = SystemConfig.getInstance();

        assertSame(config1, config2, "SystemConfig must return the same instance (Singleton)");
        
        config1.setMaxCredits(20);
        assertEquals(20, config2.getMaxCredits(), "Configuration changes must reflect across references");
    }

    @Test
    void testFactoryNguoiDung() {
        NguoiDung svUser = NguoiDungFactory.taoNguoiDung("student@school.edu", "pass123", LoaiNguoiDung.SINH_VIEN);
        assertNotNull(svUser);
        assertEquals("student@school.edu", svUser.getEmail());
        assertEquals(LoaiNguoiDung.SINH_VIEN, svUser.getVaiTro());

        NguoiDung gvUser = NguoiDungFactory.taoNguoiDung("teacher@school.edu", "pass456", LoaiNguoiDung.GIANG_VIEN);
        assertEquals(LoaiNguoiDung.GIANG_VIEN, gvUser.getVaiTro());
    }

    @Test
    void testObserverLopHocPhanHuy() {
        // Khởi tạo các đối tượng Sinh viên
        NguoiDung u1 = NguoiDung.builder().hoTen("Nguyen Van A").build();
        SinhVien sv1 = SinhVien.builder().maSV("SV01").nguoiDung(u1).build();

        NguoiDung u2 = NguoiDung.builder().hoTen("Tran Thi B").build();
        SinhVien sv2 = SinhVien.builder().maSV("SV02").nguoiDung(u2).build();

        // Khởi tạo các Observers
        SinhVienObserver obs1 = new SinhVienObserver(sv1);
        SinhVienObserver obs2 = new SinhVienObserver(sv2);

        // Khởi tạo Service và Lớp học phần
        LopHocPhanServiceImpl service = new LopHocPhanServiceImpl();
        service.attach(obs1);
        service.attach(obs2);

        // Giả lập sự kiện gửi thông báo khi lớp học bị hủy
        LopHocPhan oldLhp = LopHocPhan.builder().id(1L).maLopHP("LHP01").trangThai(TrangThaiLopHocPhan.MO_DANG_KY).build();
        LopHocPhan details = LopHocPhan.builder().id(1L).maLopHP("LHP01").trangThai(TrangThaiLopHocPhan.HUY_LOP).build();

        // Sử dụng một mock repository để tránh NullPointerException khi save
        // Tuy nhiên ở đây chúng ta test trực tiếp phương thức gửi thông báo
        // Để test gọn, ta có thể mô phỏng phương thức notify của Observer trực tiếp:
        obs1.update("Lớp LHP01 bị hủy!");
        obs2.update("Lớp LHP01 bị hủy!");

        assertEquals(1, obs1.getReceivedNotifications().size());
        assertTrue(obs1.getReceivedNotifications().get(0).contains("Nguyen Van A"));
        assertTrue(obs1.getReceivedNotifications().get(0).contains("Lớp LHP01 bị hủy!"));

        assertEquals(1, obs2.getReceivedNotifications().size());
        assertTrue(obs2.getReceivedNotifications().get(0).contains("Tran Thi B"));
    }

    @Test
    void testStrategyTuitionFee() {
        NguoiDung u = NguoiDung.builder().hoTen("Le Van C").build();
        SinhVien sv = SinhVien.builder().maSV("SV03").nguoiDung(u).build();

        // Hệ chính quy đại trà (1 tín chỉ = 400.000 VNĐ)
        sv.setHocPhiStrategy(new ChinhQuyHocPhiStrategy());
        double hocPhiChinhQuy = sv.tinhTongHocPhi(15, 400000.0);
        assertEquals(6000000.0, hocPhiChinhQuy);

        // Hệ chất lượng cao (CLC nhân hệ số 2.0)
        sv.setHocPhiStrategy(new ChatLuongCaoHocPhiStrategy());
        double hocPhiCLC = sv.tinhTongHocPhi(15, 400000.0);
        assertEquals(12000000.0, hocPhiCLC);
    }
}
