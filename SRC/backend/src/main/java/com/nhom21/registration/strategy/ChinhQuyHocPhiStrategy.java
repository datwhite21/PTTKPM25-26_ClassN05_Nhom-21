package com.nhom21.registration.strategy;

public class ChinhQuyHocPhiStrategy implements HocPhiStrategy {
    @Override
    public double tinhHocPhi(int soTinChi, double donGiaCoBan) {
        return soTinChi * donGiaCoBan;
    }
}
