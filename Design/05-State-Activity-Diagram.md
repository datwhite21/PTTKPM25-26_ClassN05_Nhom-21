# Tài liệu Thiết kế Trạng thái và Hành vi - Hệ thống Đăng ký Tín chỉ

Tài liệu này đặc tả vòng đời trạng thái của các thực thể phức tạp trong hệ thống và sơ đồ hoạt động (luồng quy trình) cho nghiệp vụ Đăng ký học phần.

---

## 1. Biểu đồ trạng thái (State Machine Diagram) của Lớp học phần

Thực thể `LopHocPhan` có vòng đời phức tạp bắt đầu từ khi được Giáo vụ mở cho đến khi kết thúc học kỳ.

### 1.1 Biểu đồ hình ảnh (PNG độ phân giải cao)
Chi tiết file biểu đồ trạng thái lưu trữ tại: [state-diagram-lophocphan.png](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/Design/sketches/state-diagram-lophocphan.png)

![Biểu đồ trạng thái lớp học phần](../../Design/sketches/state-diagram-lophocphan.png)

### 1.2 Biểu đồ dạng mã nguồn Mermaid
```mermaid
stateDiagram-v2
  [*] --> MOI_TAO : Giáo vụ tạo lớp (sĩ số = 0)
  MOI_TAO --> MO_DANG_KY : Bắt đầu đợt đăng ký tín chỉ
  
  state MO_DANG_KY {
    [*] --> CON_CHO
    CON_CHO --> DAY_SI_SO : Sĩ số hiện tại = Sĩ số tối đa
    DAY_SI_SO --> CON_CHO : Sinh viên hủy đăng ký (Sĩ số < Tối đa)
  }

  MO_DANG_KY --> DONG_DANG_KY : Kết thúc thời gian mở cổng
  MO_DANG_KY --> HUY_LOP : Sĩ số quá ít (< sĩ số tối thiểu mở lớp)
  MOI_TAO --> HUY_LOP : Giáo vụ chủ động hủy lớp

  DONG_DANG_KY --> DANG_HOC : Học kỳ mới bắt đầu
  DANG_HOC --> KET_THUC : Kết thúc học kỳ & hoàn thành nhập điểm
  KET_THUC --> [*]
```

---

## 2. Biểu đồ trạng thái (State Machine Diagram) của Đăng ký học phần (DangKy)

Thực thể `DangKy` (Phiếu đăng ký) đại diện cho yêu cầu đăng ký một lớp học phần của sinh viên, trải qua các trạng thái từ chờ duyệt cho đến thành công hoặc bị hủy.

### 2.1 Biểu đồ hình ảnh (PNG độ phân giải cao)
Chi tiết file biểu đồ trạng thái lưu trữ tại: [state-diagram-dangky.png](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/Design/sketches/state-diagram-dangky.png)

![Biểu đồ trạng thái đăng ký học phần](../../Design/sketches/state-diagram-dangky.png)

### 2.2 Biểu đồ dạng mã nguồn Mermaid
```mermaid
stateDiagram-v2
  [*] --> CHO_DUYET : Sinh viên tạo phiếu đăng ký cần duyệt (Ví dụ: đăng ký muộn, quá hạn tín chỉ đặc biệt)
  [*] --> THANH_CONG : Sinh viên đăng ký trực tuyến thành công thường quy
  
  CHO_DUYET --> THANH_CONG : Giáo vụ phê duyệt phiếu đăng ký
  CHO_DUYET --> DA_HUY : Sinh viên rút đơn hoặc Giáo vụ từ chối duyệt
  
  THANH_CONG --> DA_HUY : Sinh viên chủ động hủy môn hoặc Giáo vụ hủy lớp học phần
  DA_HUY --> [*]
```

---

## 3. Biểu đồ hoạt động (Activity Diagram) cho Quy trình đăng ký môn học

Mô tả chi tiết luồng xử lý của hệ thống khi Sinh viên nhấn nút đăng ký một lớp học phần, bao gồm các bước kiểm tra điều kiện tuần tự và song song.

### 3.1 Biểu đồ hình ảnh (PNG độ phân giải cao)
Chi tiết file biểu đồ hoạt động lưu trữ tại: [activity-diagram-registration.png](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/Design/sketches/activity-diagram-registration.png)

![Biểu đồ hoạt động quy trình đăng ký môn học](../../Design/sketches/activity-diagram-registration.png)

### 3.2 Biểu đồ dạng mã nguồn Mermaid
```mermaid
  flowchart TD
    Start([Bắt đầu đăng ký]) --> Step1[Sinh viên chọn lớp học phần và bấm Đăng ký]
    Step1 --> Step2{Đợt đăng ký mở?}
    
    Step2 -- Không --> Err1[Báo lỗi: Cổng đăng ký đang đóng] --> End([Kết thúc])
    Step2 -- Có --> Step3{Lớp học phần có đang mở?}
    
    Step3 -- Không --> Err2[Báo lỗi: Lớp học phần đang đóng] --> End
    Step3 -- Có --> ParallelStart[Thực hiện kiểm tra điều kiện song song]
    
    ParallelStart --> CheckPre[Kiểm tra môn tiên quyết]
    ParallelStart --> CheckSched[Kiểm tra trùng lịch học]
    ParallelStart --> CheckCredit[Kiểm tra giới hạn tín chỉ]
    
    CheckPre --> MergeCheck
    CheckSched --> MergeCheck
    CheckCredit --> MergeCheck
    
    MergeCheck{Tất cả điều kiện hợp lệ?}
    
    MergeCheck -- Không --> Err3[Hiển thị chi tiết lỗi kiểm tra điều kiện] --> End
    MergeCheck -- Có --> LockRow[Khóa bi quan dòng lớp học phần]
    
    LockRow --> CheckSlot{Còn chỗ trống?}
    CheckSlot -- Không --> Err4[Báo lỗi: Lớp học phần đã đầy] --> End
    CheckSlot -- Có --> DBUpdate[1. Tăng sĩ số lớp thêm 1 \n 2. Lưu bản ghi đăng ký]
    
    DBUpdate --> Confirm[Gửi thông báo Đăng ký thành công] --> End
```

---

## 4. Liên kết sơ đồ hình ảnh xuất bản
Các sơ đồ hình ảnh chất lượng cao lưu trữ tại:
- Biểu đồ trạng thái Lớp học phần: [Design/sketches/state-diagram-lophocphan.png](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/Design/sketches/state-diagram-lophocphan.png)
- Biểu đồ trạng thái Đăng ký: [Design/sketches/state-diagram-dangky.png](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/Design/sketches/state-diagram-dangky.png)
- Biểu đồ hoạt động: [Design/sketches/activity-diagram-registration.png](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/Design/sketches/activity-diagram-registration.png)
