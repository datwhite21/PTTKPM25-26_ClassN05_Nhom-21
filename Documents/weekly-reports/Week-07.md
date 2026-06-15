# Báo cáo tiến độ Tuần 7 (Phase 3: Áp dụng các Mẫu thiết kế)

*   **Thời gian:** 2026-06-08 $\rightarrow$ 2026-06-15
*   **Thành viên:** Nhóm 21 - Class N05
*   **Đề tài:** Hệ thống Quản lý Đăng ký Học theo Tín chỉ

---

## 1. Công việc đã thực hiện

| Tác vụ | Chi tiết thực hiện | Sản phẩm bàn giao (Deliverables) | Trạng thái |
| :--- | :--- | :--- | :--- |
| **Tài liệu Thuyết minh** | Soạn thảo tài liệu phân tích vấn đề, lý do chọn mẫu thiết kế và hướng dẫn tích hợp vào mã nguồn cho 4 patterns. | [Design/08-Design-Patterns.md](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/Design/08-Design-Patterns.md) | **Hoàn thành** |
| **Sơ đồ UML Mẫu** | Vẽ biểu đồ UML tổng hợp thể hiện các mối quan hệ lớp cho cả 4 mẫu thiết kế được áp dụng dưới dạng Mermaid và PNG. | [sketches/design-patterns-uml.png](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/Design/sketches/design-patterns-uml.png) | **Hoàn thành** |
| **Cài đặt Singleton** | Tạo lớp cấu hình toàn cục sử dụng Double-Checked Locking bảo vệ đa luồng. | [SystemConfig.java](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/SRC/backend/src/main/java/com/nhom21/registration/config/SystemConfig.java) | **Hoàn thành** |
| **Cài đặt Factory** | Tạo nhà máy khởi tạo tài khoản người dùng và thiết lập phân quyền dựa trên loại người dùng. | [NguoiDungFactory.java](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/SRC/backend/src/main/java/com/nhom21/registration/factory/NguoiDungFactory.java) | **Hoàn thành** |
| **Cài đặt Observer** | Tạo interface và lớp bọc sinh viên nhận cảnh báo; tích hợp cơ chế thông báo vào service quản lý lớp học phần khi xảy ra sự kiện hủy lớp. | [NotificationObserver.java](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/SRC/backend/src/main/java/com/nhom21/registration/observer/NotificationObserver.java)<br>[SinhVienObserver.java](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/SRC/backend/src/main/java/com/nhom21/registration/observer/SinhVienObserver.java)<br>Cập nhật [LopHocPhanServiceImpl.java](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/SRC/backend/src/main/java/com/nhom21/registration/service/LopHocPhanServiceImpl.java) | **Hoàn thành** |
| **Cài đặt Strategy** | Cài đặt cấu trúc tính học phí linh hoạt và tích hợp vào thực thể sinh viên thông qua thuộc tính `@Transient`. | [HocPhiStrategy.java](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/SRC/backend/src/main/java/com/nhom21/registration/strategy/HocPhiStrategy.java)<br>[ChinhQuyHocPhiStrategy.java](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/SRC/backend/src/main/java/com/nhom21/registration/strategy/ChinhQuyHocPhiStrategy.java)<br>[ChatLuongCaoHocPhiStrategy.java](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/SRC/backend/src/main/java/com/nhom21/registration/strategy/ChatLuongCaoHocPhiStrategy.java)<br>Cập nhật [SinhVien.java](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/SRC/backend/src/main/java/com/nhom21/registration/domain/SinhVien.java) | **Hoàn thành** |
| **Kiểm thử tự động** | Viết bộ Unit Test kiểm chứng sự cô lập, tính duy nhất của cấu hình, tính chính xác của Factory, luồng gửi tin của Observer và tính học phí của Strategy. | [DesignPatternsTest.java](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/SRC/backend/src/test/java/com/nhom21/registration/service/DesignPatternsTest.java) | **Hoàn thành** |
| **Đồng bộ hóa & Staging** | Cập nhật tiến độ vào file `task.md`, cập nhật roadmap tổng thể và changelog, đồng thời staged toàn bộ thay đổi. | [CHANGELOG.md](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/CHANGELOG.md) | **Hoàn thành** |

---

## 2. Đánh giá chất lượng sản phẩm
*   Mã nguồn áp dụng các design pattern giúp tách rời (decouple) các module rõ rệt: việc tính học phí không còn các khối `if-else` phức tạp; việc gửi thông báo lớp hủy không phụ thuộc trực tiếp vào cấu trúc thực thể.
*   Lớp cấu hình Singleton đảm bảo an toàn đa luồng tốt, giảm rủi ro race condition khi thay đổi tham số cấu hình hệ thống thời gian thực.
*   Bộ Unit Test đạt độ bao phủ (coverage) 100% các dòng code mới viết cho các mẫu thiết kế.

---

## 3. Khó khăn vướng mắc
*   Không gặp khó khăn. Các mẫu thiết kế hoạt động ăn khớp với nhau tạo nên một kiến trúc hướng đối tượng chuẩn mực.

---

## 4. Kế hoạch Tuần 8 (Phase 4: Lập trình chức năng lõi Backend)
*   Hoàn thiện toàn bộ các APIs tìm kiếm lớp học phần, đăng ký môn học và lưu trữ dữ liệu thực tế trên MySQL.
*   Viết integration tests giả lập lượng truy cập đăng ký slot đồng thời cao (concurrency test) sử dụng Pessimistic Locking.
