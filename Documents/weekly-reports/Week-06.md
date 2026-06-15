# Báo cáo tiến độ Tuần 6 (Phase 3: Thiết kế Kiến trúc & Triển khai)

*   **Thời gian:** 2026-06-01 $\rightarrow$ 2026-06-08
*   **Thành viên:** Nhóm 21 - Class N05
*   **Đề tài:** Hệ thống Quản lý Đăng ký Học theo Tín chỉ

---

## 1. Công việc đã thực hiện

| Tác vụ | Chi tiết thực hiện | Sản phẩm bàn giao (Deliverables) | Trạng thái |
| :--- | :--- | :--- | :--- |
| **Tài liệu SDD** | Soạn thảo tài liệu đặc tả thiết kế kiến trúc phần mềm, cơ chế Dependency Injection và định dạng API RESTful. | [Design/07-SDD.md](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/Design/07-SDD.md) | **Hoàn thành** |
| **Sơ đồ Kiến trúc** | Vẽ biểu đồ Phân gói (Package Diagram) và biểu đồ Triển khai vật lý (Deployment Diagram) thể hiện phân rã module và cách thức cấu hình mạng/giao thức. | [sketches/package-diagram.png](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/Design/sketches/package-diagram.png)<br>[sketches/deployment-diagram.png](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/Design/sketches/deployment-diagram.png) | **Hoàn thành** |
| **Cải tiến Controller** | Loại bỏ toàn bộ các khối xử lý try-catch lặp lại trong Controller để bàn giao trách nhiệm xử lý ngoại lệ cho cơ chế tập trung. | [DangKyController.java](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/SRC/backend/src/main/java/com/nhom21/registration/controller/DangKyController.java) | **Hoàn thành** |
| **Xử lý lỗi tập trung** | Cài đặt AOP Controller Advice để ánh xạ trực tiếp các business exception (IllegalArgument, IllegalState) thành HTTP status tương ứng (404, 409). | [GlobalExceptionHandler.java](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/SRC/backend/src/main/java/com/nhom21/registration/exception/GlobalExceptionHandler.java) | **Hoàn thành** |
| **CRUD Lớp học phần** | Thiết lập các interface/implementation cho Lớp học phần và viết REST Controller CRUD lớp học phần phục vụ cho Giáo vụ. | [ILopHocPhanService.java](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/SRC/backend/src/main/java/com/nhom21/registration/service/ILopHocPhanService.java)<br>[LopHocPhanServiceImpl.java](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/SRC/backend/src/main/java/com/nhom21/registration/service/LopHocPhanServiceImpl.java)<br>[LopHocPhanController.java](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/SRC/backend/src/main/java/com/nhom21/registration/controller/LopHocPhanController.java) | **Hoàn thành** |
| **Đồng bộ hóa & Staging** | Cập nhật file lộ trình tổng, changelog dự án, ghi nhận tiến độ vào file `task.md` và stage tất cả các files. | [CHANGELOG.md](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/CHANGELOG.md)<br>[.plan.md](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/.cursor/plans/đồ_án_đăng_ký_tín_chỉ_a39fa979.plan.md) | **Hoàn thành** |

---

## 2. Đánh giá chất lượng sản phẩm
*   Kiến trúc Spring Boot đạt chuẩn SOLID, đặc biệt tuân thủ tuyệt đối **Dependency Inversion Principle (DIP)** (các Controller chỉ giao tiếp thông qua Service Interface, các Service giao tiếp qua Repository Interface).
*   Tính sạch sẽ của code tăng lên rõ rệt khi loại bỏ hoàn toàn các khối xử lý try-catch thủ công trong lớp Controller.
*   Biểu đồ được xây dựng bằng công cụ vẽ chuẩn và biểu diễn rõ ràng các liên kết mạng vật lý cũng như ranh giới của các phân gói mã nguồn.

---

## 3. Khó khăn vướng mắc
*   Không có khó khăn phát sinh trong tuần này. Các thành phần kết nối trơn tru, logic phân lớp hoạt động ổn định.

---

## 4. Kế hoạch Tuần 7 (Phase 3: Áp dụng Design Patterns)
*   Nhận diện các vấn đề thiết kế cần giải quyết bằng mẫu thiết kế.
*   Triển khai mẫu thiết kế **Singleton** cho cấu hình hệ thống toàn cục.
*   Triển khai mẫu thiết kế **Factory** để sinh tự động các loại tài khoản người dùng hoặc định dạng lớp học phần.
*   Triển khai mẫu thiết kế **Observer** (nhận thông báo đăng ký thành công hoặc lớp học bị hủy) hoặc **Strategy** (tính toán học phí dựa trên đối tượng sinh viên).
