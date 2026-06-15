package com.nhom21.registration.service;

import com.nhom21.registration.domain.LopHocPhan;
import java.util.List;

public interface ILopHocPhanService {
    List<LopHocPhan> layTatCaLopHocPhan();
    LopHocPhan layLopHocPhanChiTiet(Long id);
    LopHocPhan taoMoiLopHocPhan(LopHocPhan lopHocPhan);
    LopHocPhan capNhatLopHocPhan(Long id, LopHocPhan lopHocPhanDetails);
    void xoaLopHocPhan(Long id);
    List<LopHocPhan> timKiemLopHocPhan(String keyword);
}
