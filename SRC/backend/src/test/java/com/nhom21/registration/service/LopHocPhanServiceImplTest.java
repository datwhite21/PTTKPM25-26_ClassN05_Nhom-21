package com.nhom21.registration.service;

import com.nhom21.registration.domain.*;
import com.nhom21.registration.repository.LopHocPhanRepository;
import com.nhom21.registration.observer.NotificationObserver;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class LopHocPhanServiceImplTest {

    @Mock
    private LopHocPhanRepository lopHocPhanRepository;

    @InjectMocks
    private LopHocPhanServiceImpl lopHocPhanService;

    private LopHocPhan sampleLhp;
    private MonHoc sampleMonHoc;
    private GiangVien sampleGiangVien;
    private DotDangKy sampleDotDangKy;
    private List<LichHoc> sampleLichHocs;

    @BeforeEach
    void setUp() {
        sampleMonHoc = MonHoc.builder().id(1L).maMon("FIT001").tenMon("Lập trình hướng đối tượng").soTinChi(3).build();
        sampleGiangVien = GiangVien.builder().id(1L).maGV("GV001").build();
        sampleDotDangKy = DotDangKy.builder().id(1L).tenDot("Đợt 1").trangThaiMo(true).build();

        sampleLichHocs = new ArrayList<>();
        sampleLichHocs.add(LichHoc.builder().id(1L).thu(2).tietBatDau(1).tietKetThuc(3).phongHoc("A101").build());

        sampleLhp = LopHocPhan.builder()
                .id(1L)
                .maLopHP("LHP001")
                .monHoc(sampleMonHoc)
                .giangVien(sampleGiangVien)
                .siSoToiDa(40)
                .siSoToiThieu(10)
                .siSoHienTai(0)
                .trangThai(TrangThaiLopHocPhan.MOI_TAO)
                .dotDangKy(sampleDotDangKy)
                .dsLichHoc(sampleLichHocs)
                .build();
        
        for (LichHoc lh : sampleLichHocs) {
            lh.setLopHocPhan(sampleLhp);
        }
    }

    @Test
    void testLayTatCaLopHocPhan() {
        List<LopHocPhan> list = Arrays.asList(sampleLhp);
        when(lopHocPhanRepository.findAll()).thenReturn(list);

        List<LopHocPhan> result = lopHocPhanService.layTatCaLopHocPhan();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("LHP001", result.get(0).getMaLopHP());
        verify(lopHocPhanRepository, times(1)).findAll();
    }

    @Test
    void testLayLopHocPhanChiTiet_Success() {
        when(lopHocPhanRepository.findById(1L)).thenReturn(Optional.of(sampleLhp));

        LopHocPhan result = lopHocPhanService.layLopHocPhanChiTiet(1L);

        assertNotNull(result);
        assertEquals("LHP001", result.getMaLopHP());
        verify(lopHocPhanRepository, times(1)).findById(1L);
    }

    @Test
    void testLayLopHocPhanChiTiet_NotFound() {
        when(lopHocPhanRepository.findById(2L)).thenReturn(Optional.empty());

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            lopHocPhanService.layLopHocPhanChiTiet(2L);
        });

        assertEquals("Không tìm thấy lớp học phần với ID: 2", exception.getMessage());
        verify(lopHocPhanRepository, times(1)).findById(2L);
    }

    @Test
    void testTaoMoiLopHocPhan_Success() {
        when(lopHocPhanRepository.findByMaLopHP("LHP001")).thenReturn(Optional.empty());
        when(lopHocPhanRepository.save(any(LopHocPhan.class))).thenReturn(sampleLhp);

        LopHocPhan result = lopHocPhanService.taoMoiLopHocPhan(sampleLhp);

        assertNotNull(result);
        assertEquals("LHP001", result.getMaLopHP());
        verify(lopHocPhanRepository, times(1)).findByMaLopHP("LHP001");
        verify(lopHocPhanRepository, times(1)).save(sampleLhp);
    }

    @Test
    void testTaoMoiLopHocPhan_Success_NullLichHoc() {
        sampleLhp.setDsLichHoc(null);
        when(lopHocPhanRepository.findByMaLopHP("LHP001")).thenReturn(Optional.empty());
        when(lopHocPhanRepository.save(any(LopHocPhan.class))).thenReturn(sampleLhp);

        LopHocPhan result = lopHocPhanService.taoMoiLopHocPhan(sampleLhp);

        assertNotNull(result);
        assertNull(result.getDsLichHoc());
        verify(lopHocPhanRepository, times(1)).save(sampleLhp);
    }

    @Test
    void testTaoMoiLopHocPhan_DuplicateCode() {
        when(lopHocPhanRepository.findByMaLopHP("LHP001")).thenReturn(Optional.of(sampleLhp));

        IllegalStateException exception = assertThrows(IllegalStateException.class, () -> {
            lopHocPhanService.taoMoiLopHocPhan(sampleLhp);
        });

        assertEquals("Mã lớp học phần đã tồn tại: LHP001", exception.getMessage());
        verify(lopHocPhanRepository, times(1)).findByMaLopHP("LHP001");
        verify(lopHocPhanRepository, never()).save(any());
    }

    @Test
    void testCapNhatLopHocPhan_Success_FullUpdate() {
        LopHocPhan existingLhp = LopHocPhan.builder()
                .id(1L)
                .maLopHP("LHP_OLD")
                .siSoToiDa(30)
                .siSoToiThieu(5)
                .siSoHienTai(0)
                .trangThai(TrangThaiLopHocPhan.MOI_TAO)
                .dsLichHoc(null) // test null existing list
                .build();

        MonHoc newMon = MonHoc.builder().id(2L).maMon("FIT002").build();
        GiangVien newGv = GiangVien.builder().id(2L).maGV("GV002").build();
        DotDangKy newDot = DotDangKy.builder().id(2L).tenDot("Đợt 2").build();

        List<LichHoc> newLichHocs = new ArrayList<>();
        newLichHocs.add(LichHoc.builder().id(2L).thu(3).tietBatDau(4).tietKetThuc(6).phongHoc("B202").build());

        LopHocPhan details = LopHocPhan.builder()
                .maLopHP("LHP_NEW")
                .siSoToiDa(50)
                .siSoToiThieu(15)
                .trangThai(TrangThaiLopHocPhan.MO_DANG_KY)
                .giangVien(newGv)
                .monHoc(newMon)
                .dotDangKy(newDot)
                .dsLichHoc(newLichHocs)
                .build();

        when(lopHocPhanRepository.findById(1L)).thenReturn(Optional.of(existingLhp));
        when(lopHocPhanRepository.save(any(LopHocPhan.class))).thenAnswer(invocation -> invocation.getArgument(0));

        LopHocPhan updated = lopHocPhanService.capNhatLopHocPhan(1L, details);

        assertNotNull(updated);
        assertEquals("LHP_NEW", updated.getMaLopHP());
        assertEquals(50, updated.getSiSoToiDa());
        assertEquals(15, updated.getSiSoToiThieu());
        assertEquals(TrangThaiLopHocPhan.MO_DANG_KY, updated.getTrangThai());
        assertEquals(newGv, updated.getGiangVien());
        assertEquals(newMon, updated.getMonHoc());
        assertEquals(newDot, updated.getDotDangKy());
        assertEquals(1, updated.getDsLichHoc().size());
        assertEquals("B202", updated.getDsLichHoc().get(0).getPhongHoc());
        assertEquals(existingLhp, updated.getDsLichHoc().get(0).getLopHocPhan());
    }

    @Test
    void testCapNhatLopHocPhan_Success_NullDetails() {
        LopHocPhan existingLhp = LopHocPhan.builder()
                .id(1L)
                .maLopHP("LHP_OLD")
                .siSoToiDa(30)
                .siSoToiThieu(5)
                .siSoHienTai(0)
                .trangThai(TrangThaiLopHocPhan.MOI_TAO)
                .dsLichHoc(new ArrayList<>(sampleLichHocs))
                .build();

        LopHocPhan details = LopHocPhan.builder()
                .maLopHP("LHP_NEW")
                .siSoToiDa(50)
                .siSoToiThieu(null) // test null handling for siSoToiThieu
                .trangThai(TrangThaiLopHocPhan.MOI_TAO)
                .giangVien(null)     // test null handling for giangVien
                .monHoc(null)        // test null handling for monHoc
                .dotDangKy(null)     // test null handling for dotDangKy
                .dsLichHoc(null)     // test null handling for dsLichHoc
                .build();

        when(lopHocPhanRepository.findById(1L)).thenReturn(Optional.of(existingLhp));
        when(lopHocPhanRepository.save(any(LopHocPhan.class))).thenAnswer(invocation -> invocation.getArgument(0));

        LopHocPhan updated = lopHocPhanService.capNhatLopHocPhan(1L, details);

        assertNotNull(updated);
        assertEquals("LHP_NEW", updated.getMaLopHP());
        assertEquals(50, updated.getSiSoToiDa());
        assertEquals(5, updated.getSiSoToiThieu()); // kept existing
        assertNull(updated.getGiangVien()); // remains null or kept what was there (existing was null)
        assertTrue(updated.getDsLichHoc().isEmpty()); // cleared
    }

    @Test
    void testCapNhatLopHocPhan_HuyLopNotifyObservers() {
        LopHocPhan existingLhp = LopHocPhan.builder()
                .id(1L)
                .maLopHP("LHP001")
                .trangThai(TrangThaiLopHocPhan.MO_DANG_KY)
                .build();

        LopHocPhan details = LopHocPhan.builder()
                .maLopHP("LHP001")
                .trangThai(TrangThaiLopHocPhan.HUY_LOP)
                .build();

        NotificationObserver observerMock1 = mock(NotificationObserver.class);
        NotificationObserver observerMock2 = mock(NotificationObserver.class);

        // test attach duplicates and nulls safely
        lopHocPhanService.attach(observerMock1);
        lopHocPhanService.attach(observerMock1); // duplicate
        lopHocPhanService.attach(null);          // null
        lopHocPhanService.attach(observerMock2);

        when(lopHocPhanRepository.findById(1L)).thenReturn(Optional.of(existingLhp));
        when(lopHocPhanRepository.save(any(LopHocPhan.class))).thenAnswer(invocation -> invocation.getArgument(0));

        LopHocPhan updated = lopHocPhanService.capNhatLopHocPhan(1L, details);

        assertEquals(TrangThaiLopHocPhan.HUY_LOP, updated.getTrangThai());
        verify(observerMock1, times(1)).update(contains("LHP001"));
        verify(observerMock2, times(1)).update(contains("LHP001"));

        // test detach
        lopHocPhanService.detach(observerMock1);
        
        // update again, state remains HUY_LOP so notifyObservers should NOT trigger
        updated = lopHocPhanService.capNhatLopHocPhan(1L, details);
        verify(observerMock1, times(1)).update(anyString()); // still 1 time from previous run
        verify(observerMock2, times(1)).update(anyString()); // still 1 time from previous run
    }

    @Test
    void testXoaLopHocPhan() {
        when(lopHocPhanRepository.findById(1L)).thenReturn(Optional.of(sampleLhp));

        lopHocPhanService.xoaLopHocPhan(1L);

        verify(lopHocPhanRepository, times(1)).findById(1L);
        verify(lopHocPhanRepository, times(1)).delete(sampleLhp);
    }

    @Test
    void testTimKiemLopHocPhan_NullOrEmptyKeyword() {
        List<LopHocPhan> list = Arrays.asList(sampleLhp);
        when(lopHocPhanRepository.findAll()).thenReturn(list);

        List<LopHocPhan> resultNull = lopHocPhanService.timKiemLopHocPhan(null);
        List<LopHocPhan> resultEmpty = lopHocPhanService.timKiemLopHocPhan("");
        List<LopHocPhan> resultBlank = lopHocPhanService.timKiemLopHocPhan("   ");

        assertNotNull(resultNull);
        assertEquals(1, resultNull.size());
        assertNotNull(resultEmpty);
        assertEquals(1, resultEmpty.size());
        assertNotNull(resultBlank);
        assertEquals(1, resultBlank.size());

        verify(lopHocPhanRepository, times(3)).findAll();
        verify(lopHocPhanRepository, never()).searchLopHocPhan(anyString());
    }

    @Test
    void testTimKiemLopHocPhan_ValidKeyword() {
        List<LopHocPhan> list = Arrays.asList(sampleLhp);
        when(lopHocPhanRepository.searchLopHocPhan("FIT")).thenReturn(list);

        List<LopHocPhan> result = lopHocPhanService.timKiemLopHocPhan("  FIT  ");

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("LHP001", result.get(0).getMaLopHP());
        verify(lopHocPhanRepository, times(1)).searchLopHocPhan("FIT");
        verify(lopHocPhanRepository, never()).findAll();
    }
}
