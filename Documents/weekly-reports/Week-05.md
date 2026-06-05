# Báo cáo Tiến trình & Biên bản Họp tuần 5

- **Học kỳ**: 2025-2026
- **Môn học**: Phân tích & Thiết kế Phần mềm
- **Nhóm**: 21 (Lớp N05)
- **Thời gian họp**: 2026-06-05 (17:30 - 19:00)
- **Thành viên tham dự**: Đầy đủ (Thành viên A, Thành viên B, Thành viên C)

---

## 1. Công việc đã thực hiện trong tuần 5

| Công việc | Người thực hiện | Trạng thái | Sản phẩm đạt được |
| :--- | :---: | :---: | :--- |
| **Thiết kế State Machine Diagram cho LopHocPhan** | Thành viên A | Hoàn thành | Sơ đồ Mermaid & [state-diagram-lophocphan.png](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/Design/sketches/state-diagram-lophocphan.png) |
| **Thiết kế Activity Diagram quy trình đăng ký** | Thành viên B | Hoàn thành | Sơ đồ Mermaid & [activity-diagram-registration.png](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/Design/sketches/activity-diagram-registration.png) |
| **Viết JUnit 5 Unit Test và chạy thử nghiệm** | Thành viên C | Hoàn thành | Viết test class kiểm tra việc chuyển trạng thái và sĩ số của lớp học phần |

---

## 2. Kết quả đạt được (Deliverables)
- Tài liệu Thiết kế Trạng thái & Hành vi: [05-State-Activity-Diagram.md](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/Design/05-State-Activity-Diagram.md).
- Ảnh sơ đồ trạng thái lớp học phần: [state-diagram-lophocphan.png](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/Design/sketches/state-diagram-lophocphan.png).
- Ảnh sơ đồ hoạt động đăng ký môn: [activity-diagram-registration.png](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/Design/sketches/activity-diagram-registration.png).
- Mã nguồn Unit Test Java: [DangKyStateTransitionTest.java](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/SRC/backend/src/test/java/com/nhom21/registration/service/DangKyStateTransitionTest.java).

---

## 3. Khó khăn & Giải quyết
- **Khó khăn**: Đảm bảo các luồng kiểm thử sĩ số không bị lỗi NullPointer do chưa khởi tạo đủ thông tin liên kết của thực thể JPA trong môi trường Unit Test thuần.
- **Giải quyết**: Sử dụng thư viện Mockito để giả lập hoặc tạo thủ công các đối tượng Builder của Lombok để dựng nhanh dữ liệu giả lập cho Unit Test chạy độc lập, nhanh chóng.

---

## 4. Kế hoạch tuần 6
- **Mục tiêu**: Thiết kế Kiến trúc Hệ thống (SDD) & Package Diagram.
- **Phân công nhiệm vụ**:
  - *Thành viên A*: Phân chia và tổ chức lại các gói (package) phân tầng, vẽ Package Diagram.
  - *Thành viên B*: Thiết kế tài liệu Kiến trúc SDD và vẽ Deployment Diagram.
  - *Thành viên C*: Thực hiện rà soát các Interface Service/Repository phục vụ Dependency Inversion.
