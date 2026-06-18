package com.nhom21.registration.service;

import com.nhom21.registration.domain.LopHocPhan;
import com.nhom21.registration.domain.TrangThaiLopHocPhan;
import com.nhom21.registration.repository.LopHocPhanRepository;
import com.nhom21.registration.observer.NotificationObserver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.List;

@Service
public class LopHocPhanServiceImpl implements ILopHocPhanService {

    @Autowired
    private LopHocPhanRepository lopHocPhanRepository;

    private final List<NotificationObserver> observers = new ArrayList<>();

    public void attach(NotificationObserver observer) {
        if (observer != null && !observers.contains(observer)) {
            observers.add(observer);
        }
    }

    public void detach(NotificationObserver observer) {
        observers.remove(observer);
    }

    private void notifyObservers(String message) {
        for (NotificationObserver obs : observers) {
            obs.update(message);
        }
    }

    @Override
    public List<LopHocPhan> layTatCaLopHocPhan() {
        return lopHocPhanRepository.findAll();
    }

    @Override
    public LopHocPhan layLopHocPhanChiTiet(Long id) {
        return lopHocPhanRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy lớp học phần với ID: " + id));
    }

    @Override
    @Transactional
    public LopHocPhan taoMoiLopHocPhan(LopHocPhan lopHocPhan) {
        if (lopHocPhanRepository.findByMaLopHP(lopHocPhan.getMaLopHP()).isPresent()) {
            throw new IllegalStateException("Mã lớp học phần đã tồn tại: " + lopHocPhan.getMaLopHP());
        }
        if (lopHocPhan.getDsLichHoc() != null) {
            for (com.nhom21.registration.domain.LichHoc lh : lopHocPhan.getDsLichHoc()) {
                lh.setLopHocPhan(lopHocPhan);
            }
        }
        return lopHocPhanRepository.save(lopHocPhan);
    }

    @Override
    @Transactional
    public LopHocPhan capNhatLopHocPhan(Long id, LopHocPhan details) {
        LopHocPhan existing = layLopHocPhanChiTiet(id);
        
        // Kiểm tra chuyển trạng thái sang HUY_LOP để kích hoạt thông báo
        if (details.getTrangThai() == TrangThaiLopHocPhan.HUY_LOP && existing.getTrangThai() != TrangThaiLopHocPhan.HUY_LOP) {
            notifyObservers("Cảnh báo: Lớp học phần " + existing.getMaLopHP() + " đã bị hủy! Vui lòng kiểm tra lại thời khóa biểu.");
        }

        existing.setMaLopHP(details.getMaLopHP());
        existing.setSiSoToiDa(details.getSiSoToiDa());
        if (details.getSiSoToiThieu() != null) {
            existing.setSiSoToiThieu(details.getSiSoToiThieu());
        }
        existing.setTrangThai(details.getTrangThai());
        if (details.getGiangVien() != null) {
            existing.setGiangVien(details.getGiangVien());
        }
        if (details.getMonHoc() != null) {
            existing.setMonHoc(details.getMonHoc());
        }
        if (details.getDotDangKy() != null) {
            existing.setDotDangKy(details.getDotDangKy());
        }
        
        // Cập nhật dsLichHoc
        if (existing.getDsLichHoc() != null) {
            existing.getDsLichHoc().clear();
        } else {
            existing.setDsLichHoc(new java.util.ArrayList<>());
        }
        if (details.getDsLichHoc() != null) {
            for (com.nhom21.registration.domain.LichHoc lh : details.getDsLichHoc()) {
                lh.setLopHocPhan(existing);
                existing.getDsLichHoc().add(lh);
            }
        }
        
        return lopHocPhanRepository.save(existing);
    }

    @Override
    @Transactional
    public void xoaLopHocPhan(Long id) {
        LopHocPhan existing = layLopHocPhanChiTiet(id);
        lopHocPhanRepository.delete(existing);
    }

    @Override
    public List<LopHocPhan> timKiemLopHocPhan(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return layTatCaLopHocPhan();
        }
        return lopHocPhanRepository.searchLopHocPhan(keyword.trim());
    }
}
