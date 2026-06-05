# Báo cáo Tiến trình & Biên bản Họp tuần 4

- **Học kỳ**: 2025-2026
- **Môn học**: Phân tích & Thiết kế Phần mềm
- **Nhóm**: 21 (Lớp N05)
- **Thời gian họp**: 2026-06-05 (15:45 - 17:15)
- **Thành viên tham dự**: Đầy đủ (Thành viên A, Thành viên B, Thành viên C)

---

## 1. Công việc đã thực hiện trong tuần 4

| Công việc | Người thực hiện | Trạng thái | Sản phẩm đạt được |
| :--- | :---: | :---: | :--- |
| **Vẽ Sequence Diagram nghiệp vụ Đăng ký học phần (UC-01)** | Thành viên A | Hoàn thành | Sơ đồ Mermaid & [sequence-diagram-registration.png](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/Design/sketches/sequence-diagram-registration.png) |
| **Vẽ Sequence Diagram nghiệp vụ Mở lớp học phần (UC-02)** | Thành viên C | Hoàn thành | Sơ đồ Mermaid trong file 04-Sequence-Diagram.md |
| **Thiết kế UI Mockup 4 màn hình chính** | Thành viên B | Hoàn thành | File layout chi tiết [06-UI-Mockup.md](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/Design/06-UI-Mockup.md) |
| **Kiểm tra đồng bộ Class Diagram và Sequence Diagram** | Cả nhóm | Hoàn thành | Bổ sung đầy đủ các phương thức `kiemTraTrungLich`, `kiemTraDieuKienTienQuyet` vào class Service |

---

## 2. Kết quả đạt được (Deliverables)
- Tài liệu Thiết kế Tương tác: [04-Sequence-Diagram.md](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/Design/04-Sequence-Diagram.md).
- Ảnh sơ đồ trình tự đăng ký tín chỉ: [sequence-diagram-registration.png](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/Design/sketches/sequence-diagram-registration.png).
- Tài liệu Thiết kế Giao diện: [06-UI-Mockup.md](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/Design/06-UI-Mockup.md).

---

## 3. Khó khăn & Giải quyết
- **Khó khăn**: Đảm bảo các tên phương thức gọi chéo giữa các lifeline trong Sequence Diagram khớp 100% với định nghĩa thuộc tính/hàm trong Class Diagram đã lập ở Tuần 3.
- **Giải quyết**: Rà soát kỹ và đổi tên các hàm `checkOverlap` thành `kiemTraTrungLich`, `checkPrereq` thành `kiemTraDieuKienTienQuyet` ở cả hai sơ đồ để đảm bảo tính nhất quán.

---

## 4. Kế hoạch tuần 5
- **Mục tiêu**: Thiết kế Trạng thái & Hành vi phức tạp, và lập trình logic kiểm thử chuyển đổi trạng thái.
- **Phân công nhiệm vụ**:
  - *Thành viên A*: Vẽ State Machine Diagram cho vòng đời của đối tượng `LopHocPhan`.
  - *Thành viên B*: Vẽ Activity Diagram mô tả chi tiết quy trình xử lý đơn đăng ký học phần.
  - *Thành viên C*: Viết mã nguồn JUnit test `DangKyStateTransitionTest.java` và chạy kiểm thử `mvn test`.
