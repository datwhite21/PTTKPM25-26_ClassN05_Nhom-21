package com.nhom21.registration.service;

import com.nhom21.registration.domain.*;
import com.nhom21.registration.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;
import com.nhom21.registration.exception.WaitlistException;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1;MODE=MySQL",
    "spring.datasource.driver-class-name=org.h2.Driver",
    "spring.datasource.username=sa",
    "spring.datasource.password=",
    "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect",
    "spring.jpa.hibernate.ddl-auto=create-drop"
})
public class DangKyIntegrationTest {

    @Autowired
    private IDangKyService dangKyService;

    @Autowired
    private SinhVienRepository sinhVienRepository;

    @Autowired
    private LopHocPhanRepository lopHocPhanRepository;

    @Autowired
    private NguoiDungRepository nguoiDungRepository;

    @Autowired
    private KhoaRepository khoaRepository;

    @Autowired
    private NganhRepository nganhRepository;

    @Autowired
    private GiangVienRepository giangVienRepository;

    @Autowired
    private MonHocRepository monHocRepository;

    @Autowired
    private DotDangKyRepository dotDangKyRepository;

    @Autowired
    private DangKyRepository dangKyRepository;

    @Autowired
    private LichThiRepository lichThiRepository;

    @Autowired
    private WaitlistRepository waitlistRepository;

    @Autowired
    private HoaDonHocPhiRepository hoaDonHocPhiRepository;

    private List<Long> sinhVienIds = new ArrayList<>();
    private Long lopHPId;
    private Long lopHP2Id;


    @BeforeEach
    void setUp() {
        // Clear database tables to ensure isolation
        dangKyRepository.deleteAll();
        waitlistRepository.deleteAll();
        lichThiRepository.deleteAll();
        hoaDonHocPhiRepository.deleteAll();
        sinhVienRepository.deleteAll();
        lopHocPhanRepository.deleteAll();
        giangVienRepository.deleteAll();
        nguoiDungRepository.deleteAll();
        nganhRepository.deleteAll();
        khoaRepository.deleteAll();
        monHocRepository.deleteAll();
        dotDangKyRepository.deleteAll();

        // 1. Seed Khoa & Nganh
        Khoa khoa = khoaRepository.save(new Khoa(null, "FIT", "Khoa CNTT"));
        Nganh nganh = nganhRepository.save(new Nganh(null, "CNTT", "Cong nghe thong tin", khoa));

        // 2. Seed GiangVien
        NguoiDung ndGv = nguoiDungRepository.save(new NguoiDung(null, "gv@school.edu", "123", "GV A", LoaiNguoiDung.GIANG_VIEN));
        GiangVien gv = giangVienRepository.save(new GiangVien(null, "GV01", ndGv, khoa));

        // 3. Seed MonHoc (without prerequisite requirement for simple test setup)
        MonHoc mon = monHocRepository.save(new MonHoc(null, "FIT01", "Lap trinh huong doi tuong", 3, new ArrayList<>()));

        // 4. Seed DotDangKy (Active period)
        DotDangKy dot = dotDangKyRepository.save(DotDangKy.builder()
                .tenDot("Dot 1")
                .ngayMo(LocalDateTime.now().minusDays(1))
                .ngayDong(LocalDateTime.now().plusDays(10))
                .trangThaiMo(true)
                .build());

        // 5. Seed LopHocPhan (Max size = 2 to trigger concurrency full exception)
        LopHocPhan lhp = lopHocPhanRepository.save(new LopHocPhan(null, "LHP_OOP", mon, gv, 2, 0, TrangThaiLopHocPhan.MO_DANG_KY, dot));
        lopHPId = lhp.getId();

        LopHocPhan lhp2 = lopHocPhanRepository.save(new LopHocPhan(null, "LHP_OOP_2", mon, gv, 2, 0, TrangThaiLopHocPhan.MO_DANG_KY, dot));
        lopHP2Id = lhp2.getId();


        // 6. Seed 5 SinhVien
        for (int i = 1; i <= 5; i++) {
            NguoiDung ndSv = nguoiDungRepository.save(new NguoiDung(null, "sv" + i + "@school.edu", "123", "SV " + i, LoaiNguoiDung.SINH_VIEN));
            SinhVien sv = sinhVienRepository.save(SinhVien.builder().maSV("SV0" + i).nguoiDung(ndSv).nganh(nganh).build());
            sinhVienIds.add(sv.getId());
        }
    }

    @Test
    void testConcurrencyRegistrationLimitedSlots() throws InterruptedException {
        int threadCount = 5;
        ExecutorService executorService = Executors.newFixedThreadPool(threadCount);
        CountDownLatch latch = new CountDownLatch(1);
        CountDownLatch finishLatch = new CountDownLatch(threadCount);

        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger failCount = new AtomicInteger(0);

        for (int i = 0; i < threadCount; i++) {
            final Long svId = sinhVienIds.get(i);
            executorService.execute(() -> {
                try {
                    latch.await(); // Wait for start signal to launch concurrent requests
                    dangKyService.thucHienDangKy(svId, lopHPId);
                    successCount.incrementAndGet();
                } catch (Exception e) {
                    failCount.incrementAndGet();
                    System.out.println("Registration rejected: " + e.getMessage());
                } finally {
                    finishLatch.countDown();
                }
            });
        }

        latch.countDown(); // Release latch to start all threads concurrently
        finishLatch.await(); // Wait for execution to finish

        // Verify slot limitation: Only 2 should succeed, 3 should fail
        assertEquals(2, successCount.get(), "Only 2 registration requests should succeed");
        assertEquals(3, failCount.get(), "3 registration requests should fail due to full slots");

        // Verify state persistence
        LopHocPhan finalLhp = lopHocPhanRepository.findById(lopHPId).orElseThrow();
        assertEquals(2, finalLhp.getSiSoHienTai(), "Final class size must be exactly 2");
    }

    @Test
    void testDuplicateSubjectRegistration() {
        Long svId = sinhVienIds.get(0);
        // Đăng ký lớp OOP đầu tiên thành công
        assertDoesNotThrow(() -> dangKyService.thucHienDangKy(svId, lopHPId));

        // Đăng ký lớp OOP thứ hai -> phải ném IllegalStateException vì trùng môn học
        IllegalStateException ex = assertThrows(IllegalStateException.class, () -> {
            dangKyService.thucHienDangKy(svId, lopHP2Id);
        });
        assertTrue(ex.getMessage().contains("lớp học phần khác của môn học này"));
    }

    @Test
    void testExamConflictCheck() {
        Long svId = sinhVienIds.get(0);

        // 1. Lớp 1 (lopHPId) có lịch thi
        LopHocPhan lhp1 = lopHocPhanRepository.findById(lopHPId).orElseThrow();
        lichThiRepository.save(LichThi.builder()
                .lopHocPhan(lhp1)
                .ngayThi(LocalDate.of(2026, 7, 10))
                .caThi("CA1")
                .phongThi("A1-101")
                .build());

        // 2. Tạo môn học 2 và lớp học phần 3 (lopHP3)
        MonHoc mon2 = monHocRepository.save(new MonHoc(null, "FIT02", "Cấu trúc dữ liệu", 3, new ArrayList<>()));
        LopHocPhan lhp3 = lopHocPhanRepository.save(new LopHocPhan(null, "LHP_DSA", mon2, lhp1.getGiangVien(), 30, 0, TrangThaiLopHocPhan.MO_DANG_KY, lhp1.getDotDangKy()));
        lichThiRepository.save(LichThi.builder()
                .lopHocPhan(lhp3)
                .ngayThi(LocalDate.of(2026, 7, 10)) // Cùng ngày
                .caThi("CA1") // Cùng ca -> Trùng!
                .phongThi("A1-102")
                .build());

        // Đăng ký lớp 1 thành công
        assertDoesNotThrow(() -> dangKyService.thucHienDangKy(svId, lopHPId));

        // Đăng ký lớp 3 -> Bị từ chối vì trùng lịch thi
        IllegalStateException ex = assertThrows(IllegalStateException.class, () -> {
            dangKyService.thucHienDangKy(svId, lhp3.getId());
        });
        assertTrue(ex.getMessage().contains("Trùng lịch thi"));
    }

    @Test
    void testWaitlistPlacement() {
        Long sv1 = sinhVienIds.get(0);
        Long sv2 = sinhVienIds.get(1);
        Long sv3 = sinhVienIds.get(2);

        // Sĩ số tối đa của lopHPId là 2
        assertDoesNotThrow(() -> dangKyService.thucHienDangKy(sv1, lopHPId));
        assertDoesNotThrow(() -> dangKyService.thucHienDangKy(sv2, lopHPId));

        // Đăng ký sv3 -> đầy sĩ số -> Phải được ném vào hàng chờ
        WaitlistException ex = assertThrows(WaitlistException.class, () -> {
            dangKyService.thucHienDangKy(sv3, lopHPId);
        });
        assertTrue(ex.getMessage().contains("WAITLIST: Bạn đã được xếp vào danh sách chờ ở vị trí số 1"));

        // Kiểm tra database có record waitlist
        List<Waitlist> wlList = waitlistRepository.findByLopHocPhanIdOrderByThuTuAsc(lopHPId);
        assertEquals(1, wlList.size());
        assertEquals(sv3, wlList.get(0).getSinhVien().getId());
        assertEquals(1, wlList.get(0).getThuTu());
    }

    @Test
    void testFifoWaitlistPromotion() {
        Long sv1 = sinhVienIds.get(0);
        Long sv2 = sinhVienIds.get(1);
        Long sv3 = sinhVienIds.get(2);

        // Đăng ký sv1 và sv2 (đầy lớp)
        DangKy dk1 = dangKyService.thucHienDangKy(sv1, lopHPId);
        dangKyService.thucHienDangKy(sv2, lopHPId);

        // sv3 đăng ký -> vào waitlist
        assertThrows(WaitlistException.class, () -> dangKyService.thucHienDangKy(sv3, lopHPId));

        // sv1 hủy đăng ký -> sv3 phải được thăng hạng tự động (FIFO)
        assertDoesNotThrow(() -> dangKyService.huyDangKy(dk1.getId()));

        // Kiểm tra sv3 đăng ký thành công
        List<DangKy> sv3Dk = dangKyRepository.findBySinhVienIdAndTrangThai(sv3, TrangThaiDangKy.THANH_CONG);
        assertEquals(1, sv3Dk.size());
        assertEquals(lopHPId, sv3Dk.get(0).getLopHocPhan().getId());

        // Kiểm tra waitlist trống
        assertTrue(waitlistRepository.findByLopHocPhanIdOrderByThuTuAsc(lopHPId).isEmpty());
    }

    @Test
    void testTuitionInvoiceUpdates() {
        Long sv1 = sinhVienIds.get(0);

        // Đăng ký OOP (3 tín chỉ) -> Tạo hóa đơn 1,500,000
        DangKy dk = dangKyService.thucHienDangKy(sv1, lopHPId);

        List<HoaDonHocPhi> invoices = hoaDonHocPhiRepository.findBySinhVienId(sv1);
        assertEquals(1, invoices.size());
        assertEquals(3, invoices.get(0).getTongTinChi());
        assertEquals(1500000.0, invoices.get(0).getTongTien());
        assertEquals("CHUA_THANH_TOAN", invoices.get(0).getTrangThai());

        // Hủy đăng ký -> Hóa đơn giảm về 0 tín chỉ
        dangKyService.huyDangKy(dk.getId());
        invoices = hoaDonHocPhiRepository.findBySinhVienId(sv1);
        assertEquals(1, invoices.size());
        assertEquals(0, invoices.get(0).getTongTinChi());
        assertEquals(0.0, invoices.get(0).getTongTien());
    }
}

