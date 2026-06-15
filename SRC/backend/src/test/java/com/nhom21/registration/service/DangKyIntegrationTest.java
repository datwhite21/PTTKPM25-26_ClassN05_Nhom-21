package com.nhom21.registration.service;

import com.nhom21.registration.domain.*;
import com.nhom21.registration.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;
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

    private List<Long> sinhVienIds = new ArrayList<>();
    private Long lopHPId;

    @BeforeEach
    void setUp() {
        // Clear database tables to ensure isolation
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
        DotDangKy dot = dotDangKyRepository.save(new DotDangKy(null, "Dot 1", LocalDateTime.now().minusDays(1), LocalDateTime.now().plusDays(10), true));

        // 5. Seed LopHocPhan (Max size = 2 to trigger concurrency full exception)
        LopHocPhan lhp = lopHocPhanRepository.save(new LopHocPhan(null, "LHP_OOP", mon, gv, 2, 0, TrangThaiLopHocPhan.MO_DANG_KY, dot));
        lopHPId = lhp.getId();

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
}
