# Tài liệu Thiết kế Tương tác (Sequence Diagram) - Hệ thống Đăng ký Tín chỉ

Tài liệu này đặc tả cách thức các đối tượng trong hệ thống giao tiếp với nhau theo trình tự thời gian để thực hiện các nghiệp vụ chính.

---

## 1. Biểu đồ Sequence Diagram cho UC-01: Đăng ký học phần

Biểu đồ này mô tả luồng đăng ký học phần của Sinh viên, bao gồm các bước xác thực, kiểm tra điều kiện tiên quyết, trùng lịch học, kiểm tra sĩ số, và khóa dòng bi quan (Pessimistic Locking) để đảm bảo an toàn đồng thời.

### 1.1 Biểu đồ hình ảnh (PNG độ phân giải cao)
Chi tiết file biểu đồ trình tự lưu trữ tại: [sequence-diagram-registration.png](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/Design/sketches/sequence-diagram-registration.png)

![Biểu đồ trình tự đăng ký tín chỉ](../../Design/sketches/sequence-diagram-registration.png)

### 1.2 Biểu đồ dạng mã nguồn Mermaid
```mermaid
sequenceDiagram
  autonumber
  actor SV as Sinh viên
  participant UI as Giao diện React
  participant C as DangKyController
  participant S as DangKyServiceImpl
  participant R_LHP as LopHocPhanRepository
  participant R_DK as DangKyRepository
  participant DB as Cơ sở dữ liệu MySQL

  SV->>UI: Nhập mã lớp học phần & nhấn "Đăng ký"
  UI->>C: POST /api/registrations {sinhVienId, lopHocPhanId}
  
  activate C
  C->>S: thucHienDangKy(sinhVienId, lopHocPhanId)
  
  activate S
  Note over S: 1. Kiểm tra tồn tại Sinh viên & Lớp học phần
  
  S->>S: kiemTraDieuKienTienQuyet(sinhVienId, monHocId)
  alt Sinh viên chưa đạt môn tiên quyết
    S-->>C: ném IllegalStateException("Chưa đạt môn tiên quyết")
    C-->>UI: Trả về HTTP 409 Conflict (Thông báo lỗi)
    UI-->>SV: Hiển thị lỗi thiếu môn tiên quyết
  end

  S->>S: kiemTraTrungLich(sinhVienId, lichMoi)
  alt Sinh viên bị trùng lịch học
    S-->>C: ném IllegalStateException("Trùng thời khóa biểu")
    C-->>UI: Trả về HTTP 409 Conflict (Thông báo lỗi)
    UI-->>SV: Hiển thị lỗi trùng lịch học
  end

  Note over S: 2. Gọi khóa bi quan trên lớp học phần
  S->>R_LHP: findByIdForUpdate(lopHPId)
  activate R_LHP
  R_LHP->>DB: SELECT FOR UPDATE (Lock row)
  DB-->>R_LHP: Trả về thực thể LopHocPhan
  R_LHP-->>S: Trả về thực thể LopHocPhan
  deactivate R_LHP

  alt Lớp học phần đã đầy sĩ số (siSoHienTai >= siSoToiDa)
    S-->>C: ném IllegalStateException("Lớp đã hết chỗ")
    C-->>UI: Trả về HTTP 409 Conflict (Thông báo lỗi)
    UI-->>SV: Hiển thị lỗi hết chỗ
  end

  Note over S: 3. Tăng sĩ số và Lưu phiếu đăng ký
  S->>R_LHP: tangSiSo() & save(lhp)
  activate R_LHP
  R_LHP->>DB: UPDATE lop_hoc_phan SET si_so_hien_tai = si_so_hien_tai + 1
  R_LHP-->>S: Thành công
  deactivate R_LHP

  S->>R_DK: save(newDangKy)
  activate R_DK
  R_DK->>DB: INSERT INTO dang_ky (sinh_vien_id, lop_hoc_phan_id, ...)
  R_DK-->>S: Trả về thực thể DangKy
  deactivate R_DK

  S-->>C: Trả về thực thể DangKy
  deactivate S
  
  C-->>UI: Trả về HTTP 201 Created (Đối tượng DangKy)
  deactivate C
  
  UI-->>SV: Hiển thị thông báo "Đăng ký thành công" và cập nhật TKB
```

---

## 2. Biểu đồ Sequence Diagram cho UC-02: Mở lớp học phần

Mô tả luồng tương tác khi Giáo vụ tạo lập một lớp học phần mới trên hệ thống, hệ thống thực hiện kiểm tra chéo lịch giảng dạy của Giảng viên và tính khả dụng của phòng học.

```mermaid
sequenceDiagram
  autonumber
  actor GVU as Giáo vụ
  participant UI as Giao diện React
  participant C as LopHocPhanController
  participant S as LopHocPhanService
  participant R_GV as GiangVienRepository
  participant R_LH as LichHocRepository
  participant R_LHP as LopHocPhanRepository
  participant DB as Cơ sở dữ liệu MySQL

  GVU->>UI: Nhập thông tin môn học, giảng viên, lịch dạy, phòng học
  UI->>C: POST /api/admin/course-sections (Form data)
  activate C
  
  C->>S: moLopHocPhan(monHocId, giangVienId, siSoToiDa, lichHocs)
  activate S
  
  S->>R_GV: findById(giangVienId)
  R_GV-->>S: Trả về đối tượng GiangVien
  
  Note over S: Kiểm tra trùng lịch giảng dạy của Giảng viên
  S->>R_LH: checkGiangVienConflict(giangVienId, lichHocs)
  R_LH-->>S: Boolean (Không trùng)
  
  Note over S: Kiểm tra trùng phòng học
  S->>R_LH: checkPhongHocConflict(phongHoc, lichHocs)
  R_LH-->>S: Boolean (Không trùng)

  S->>R_LHP: save(newLopHocPhan)
  activate R_LHP
  R_LHP->>DB: INSERT INTO lop_hoc_phan (...)
  R_LHP-->>S: Trả về thực thể LopHocPhan
  deactivate R_LHP

  S-->>C: Trả về thực thể LopHocPhan
  deactivate S
  
  C-->>UI: Trả về HTTP 201 Created (LopHocPhan)
  deactivate C
  
  UI-->>GVU: Hiển thị thông báo "Mở lớp học phần thành công"
```

---

## 3. Liên kết sơ đồ bản vẽ kỹ thuật
Ảnh thiết kế biểu đồ trình tự nghiệp vụ đăng ký tín chỉ chi tiết được lưu trữ tại:
[Design/sketches/sequence-diagram-registration.png](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/Design/sketches/sequence-diagram-registration.png)
