# Báo cáo Tiến trình & Biên bản Họp tuần 3

- **Học kỳ**: 2025-2026
- **Môn học**: Phân tích & Thiết kế Phần mềm
- **Nhóm**: 21 (Lớp N05)
- **Thời gian họp**: 2026-06-05 (13:00 - 15:30)
- **Thành viên tham dự**: Đầy đủ (Thành viên A, Thành viên B, Thành viên C)

---

## 1. Công việc đã thực hiện trong tuần 3

| Công việc | Người thực hiện | Trạng thái | Sản phẩm đạt được |
| :--- | :---: | :---: | :--- |
| **Trích xuất danh từ và mô tả các lớp** | Thành viên B | Hoàn thành | Các lớp thực thể, thuộc tính và phương thức trong thiết kế lớp |
| **Vẽ biểu đồ lớp Class Diagram** | Thành viên C | Hoàn thành | File [class-diagram.drawio](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/Design/class-diagram.drawio) và ảnh [class-diagram.png](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/Design/sketches/class-diagram.png) |
| **Khởi tạo project Maven Spring Boot & pom.xml** | Thành viên A | Hoàn thành | File [pom.xml](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/SRC/backend/pom.xml) cấu hình các dependencies |
| **Scaffold mã nguồn Java Entities, Repositories, Services** | Thành viên A | Hoàn thành | Các file Java Entity, Repository và Service trong cấu trúc package |

---

## 2. Kết quả đạt được (Deliverables)
- Tài liệu thiết kế lớp hoàn chỉnh: [03-Class-Diagram.md](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/Design/03-Class-Diagram.md).
- Biểu đồ lớp XML để sửa đổi: [class-diagram.drawio](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/Design/class-diagram.drawio).
- Ảnh xuất bản biểu đồ lớp bằng Tiếng Việt: [class-diagram.png](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/Design/sketches/class-diagram.png).
- Cấu trúc thư mục mã nguồn Java Backend: [pom.xml](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/SRC/backend/pom.xml) và các lớp Java Entity / Repository / Service lõi.

---

## 3. Khó khăn & Giải quyết
- **Khó khăn**: Xác định cách lưu trữ mối quan hệ tự liên kết (self-referencing) của các môn học tiên quyết (một môn học cần nhiều môn tiên quyết và có thể là môn tiên quyết của nhiều môn khác).
- **Giải quyết**: Sử dụng mối quan hệ `@ManyToMany` tự tham chiếu trong lớp `MonHoc` với bảng trung gian `mon_tien_quyet`.

---

## 4. Kế hoạch tuần 4
- **Mục tiêu**: Thiết kế Tương tác - Sequence & UI Mockup.
- **Phân công nhiệm vụ**:
  - *Thành viên A*: Vẽ Sequence Diagram cho Use Case Đăng ký học phần (UC-01) bằng Mermaid.
  - *Thành viên B*: Phác thảo UI Mockup màn hình Đăng ký học phần và Dashboard của Sinh viên.
  - *Thành viên C*: Vẽ Sequence Diagram cho Use Case Mở lớp học phần (UC-02) và phác thảo màn hình Giáo vụ.
