# Báo cáo Tiến trình & Biên bản Họp tuần 2

- **Học kỳ**: 2025-2026
- **Môn học**: Phân tích & Thiết kế Phần mềm
- **Nhóm**: 21 (Lớp N05)
- **Thời gian họp**: 2026-06-05 (10:00 - 12:00)
- **Thành viên tham dự**: Đầy đủ (Thành viên A, Thành viên B, Thành viên C)

---

## 1. Công việc đã thực hiện trong tuần 2

| Công việc | Người thực hiện | Trạng thái | Sản phẩm đạt được |
| :--- | :---: | :---: | :--- |
| **Vẽ biểu đồ Use Case tổng thể** | Thành viên A | Hoàn thành | Biểu đồ Mermaid hoàn chỉnh trong mục 6 của SRS |
| **Xây dựng kịch bản chi tiết UC-01 (Đăng ký học phần)** | Thành viên B | Hoàn thành | Bảng kịch bản UC-01 trong mục 7.1 của SRS |
| **Xây dựng kịch bản chi tiết UC-02 (Mở lớp học phần)** | Thành viên C | Hoàn thành | Bảng kịch bản UC-02 trong mục 7.2 của SRS |
| **Xây dựng kịch bản chi tiết UC-03 (Nhập điểm học phần)** | Thành viên C | Hoàn thành | Bảng kịch bản UC-03 trong mục 7.3 của SRS |
| **Tổng hợp và cập nhật tài liệu SRS** | Thành viên B, C | Hoàn thành | Hoàn thiện tài liệu [01-SRS.md](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/Documents/01-SRS.md) |

---

## 2. Kết quả đạt được (Deliverables)
- File biểu đồ Use Case tổng thể dạng Draw.io: [use-case-diagram.drawio](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/Design/use-case-diagram.drawio).
- Ảnh xuất bản biểu đồ Use Case chất lượng cao (Tiếng Việt): [use-case-diagram.png](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/Design/sketches/use-case-diagram.png).
- Tài liệu kịch bản chi tiết 3 Use Case (Word): [Kich_Ban_Use_Case.docx](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/Documents/Kich_Ban_Use_Case.docx).
- Tài liệu kịch bản chi tiết 3 Use Case (Markdown): [02-Kich-Ban-Use-Case.md](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/Documents/02-Kich-Ban-Use-Case.md).
- Cập nhật và hoàn thiện tài liệu SRS Phase 1: [01-SRS.md](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/Documents/01-SRS.md).

---

## 3. Khó khăn & Giải quyết
- **Khó khăn**: Xác định các luồng ngoại lệ (Exception Flow) cho Use Case Đăng ký học phần khi xảy ra tranh chấp ở giây cuối cùng (hết chỗ).
- **Giải quyết**: Thống nhất giải pháp nghiệp vụ là khi lớp đã đầy, hệ thống lập tức thông báo lỗi và hoàn tác giao dịch (rollback transaction), chuẩn bị cơ sở cho việc dùng Pessimistic Write Lock ở tầng Backend sau này.

---

## 4. Kế hoạch tuần 3
- **Mục tiêu**: Thiết kế Lớp và Tạo cơ sở Code (Phase 2 - Tuần 3).
- **Phân công nhiệm vụ**:
  - *Thành viên A*: Thực hiện trích xuất danh từ từ kịch bản để nhận diện các lớp Entity, khởi tạo khung project Spring Boot trên Git.
  - *Thành viên B*: Xác định thuộc tính, phương thức của các lớp nghiệp vụ.
  - *Thành viên C*: Vẽ Class Diagram hoàn thiện bằng công cụ UML.
