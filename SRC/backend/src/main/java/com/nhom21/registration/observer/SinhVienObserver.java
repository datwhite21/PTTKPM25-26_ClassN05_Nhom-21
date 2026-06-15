package com.nhom21.registration.observer;

import com.nhom21.registration.domain.SinhVien;
import java.util.ArrayList;
import java.util.List;

public class SinhVienObserver implements NotificationObserver {

    private final SinhVien sinhVien;
    private final List<String> receivedNotifications = new ArrayList<>();

    public SinhVienObserver(SinhVien sinhVien) {
        this.sinhVien = sinhVien;
    }

    @Override
    public void update(String message) {
        String formattedMessage = String.format("Gửi đến Sinh viên %s (%s): %s", 
                sinhVien.getHoTen(), sinhVien.getMaSV(), message);
        receivedNotifications.add(formattedMessage);
        System.out.println(formattedMessage);
    }

    public List<String> getReceivedNotifications() {
        return receivedNotifications;
    }

    public SinhVien getSinhVien() {
        return sinhVien;
    }
}
