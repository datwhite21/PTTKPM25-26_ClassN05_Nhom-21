package com.nhom21.registration.factory;

import com.nhom21.registration.domain.LoaiNguoiDung;
import com.nhom21.registration.domain.NguoiDung;

public class NguoiDungFactory {

    public static NguoiDung taoNguoiDung(String email, String matKhau, LoaiNguoiDung loai) {
        if (email == null || matKhau == null || loai == null) {
            throw new IllegalArgumentException("Thông tin email, mật khẩu hoặc loại người dùng không được null");
        }
        return NguoiDung.builder()
                .email(email)
                .matKhau(matKhau)
                .vaiTro(loai)
                .hoTen("Chưa thiết lập")
                .build();
    }
}
