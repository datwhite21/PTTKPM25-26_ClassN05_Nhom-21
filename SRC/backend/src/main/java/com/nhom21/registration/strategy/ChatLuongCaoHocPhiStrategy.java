package com.nhom21.registration.strategy;

public class ChatLuongCaoHocPhiStrategy implements HocPhiStrategy {
    @Override
    public double tinhHocPhi(int soTinChi, double donGiaCoBan) {
        return soTinChi * donGiaCoBan * 2.0;
    }
}
