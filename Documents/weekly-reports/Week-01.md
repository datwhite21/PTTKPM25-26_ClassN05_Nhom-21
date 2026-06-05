# Báo cáo Tiến trình & Biên bản Họp tuần 1

- **Học kỳ**: 2025-2026
- **Môn học**: Phân tích & Thiết kế Phần mềm
- **Nhóm**: 21 (Lớp N05)
- **Thời gian họp**: 2026-05-29 (9:00 - 11:30)
- **Thành viên tham dự**: Đầy đủ (Thành viên A, Thành viên B, Thành viên C)

---

## 1. Công việc đã thực hiện trong tuần 1

| Công việc | Người thực hiện | Trạng thái | Sản phẩm đạt được |
| :--- | :---: | :---: | :--- |
| **Thành lập nhóm & Phân chia vai trò** | Cả nhóm | Hoàn thành | Thành viên A: Trưởng nhóm/Backend<br>Thành viên B: Thư ký/Frontend<br>Thành viên C: Lập tài liệu/Tester |
| **Xác định phạm vi & vẽ Context Diagram** | Thành viên A | Hoàn thành | Sơ đồ ngữ cảnh Mermaid trong SRS |
| **Xây dựng danh sách Actor & 16 FR, 5 NFR** | Thành viên C | Hoàn thành | Định nghĩa Actor, yêu cầu FR/NFR trong SRS |
| **Lập tài liệu SRS ban đầu & Ma trận UC** | Thành viên B, C | Hoàn thành | File [01-SRS.md](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/Documents/01-SRS.md) ban đầu |

---

## 2. Kết quả đạt được (Deliverables)
- Khởi tạo thành công cấu trúc thư mục của repository.
- Tài liệu kế hoạch tổng thể: [00-Ke-Hoach-Tong.md](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/Documents/00-Ke-Hoach-Tong.md).
- Tài liệu Đặc tả yêu cầu phiên bản 1.0 (Markdown): [01-SRS.md](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/Documents/01-SRS.md).
- Tài liệu Đặc tả yêu cầu (Word): [SRS.docx](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/Documents/SRS.docx).
- Bảng Excel ma trận Actor - Use Case: [ma_tran_actor_use_case.xlsx](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/Documents/ma_tran_actor_use_case.xlsx).

---

## 3. Khó khăn & Giải quyết
- **Khó khăn**: Cần phân biệt rõ ranh giới hệ thống tự phát triển và các hệ thống trường học dùng sẵn (như Hệ thống xác thực CAS).
- **Giải quyết**: Thống nhất coi Hệ thống xác thực là một Actor phụ bên ngoài tương tác để kiểm tra thông tin tài khoản qua API trung gian.

---

## 4. Kế hoạch tuần 2
- **Mục tiêu**: Mô hình hóa Use Case và viết kịch bản chi tiết.
- **Phân công nhiệm vụ**:
  - *Thành viên A*: Vẽ biểu đồ Use Case tổng thể bằng Mermaid biểu diễn include/extend.
  - *Thành viên B*: Viết kịch bản đặc tả chi tiết cho UC-01 (Đăng ký học phần).
  - *Thành viên C*: Viết kịch bản chi tiết cho UC-02 (Mở lớp học phần) và UC-03 (Nhập điểm).
