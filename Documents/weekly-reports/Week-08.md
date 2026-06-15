# Báo cáo tiến độ Tuần 8 (Phase 4: Lập trình Chức năng Lõi Backend)

*   **Thời gian:** 2026-06-15 $\rightarrow$ 2026-06-22
*   **Thành viên:** Nhóm 21 - Class N05
*   **Đề tài:** Hệ thống Quản lý Đăng ký Học theo Tín chỉ

---

## 1. Công việc đã thực hiện

| Tác vụ | Chi tiết thực hiện | Sản phẩm bàn giao (Deliverables) | Trạng thái |
| :--- | :--- | :--- | :--- |
| **Schema Cơ sở dữ liệu** | Soạn thảo kịch bản SQL thiết lập cấu trúc bảng chuẩn hóa 3NF, ràng buộc toàn vẹn khóa ngoại và chỉ mục (Index) hỗ trợ tối ưu hiệu năng. | [V1__init.sql](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/SRC/database/schema/V1__init.sql) | **Hoàn thành** |
| **Seeds Dữ liệu mẫu** | Tạo tệp SQL chèn dữ liệu mẫu cho cả 12 thực thể, phân vùng sinh viên, giảng viên và các lớp học phần có sẵn lịch biểu. | [sample_data.sql](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/SRC/database/seeds/sample_data.sql) | **Hoàn thành** |
| **Cấu hình Spring Boot** | Thiết lập cấu hình kết nối cơ sở dữ liệu MySQL, Hibernate DDL auto và thời gian chờ truy vấn trong tệp cấu hình chính. | [application.properties](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/SRC/backend/src/main/resources/application.properties) | **Hoàn thành** |
| **Hỗ trợ Test DB** | Bổ sung thư viện H2 database vào Maven POM để hỗ trợ môi trường chạy test cô lập (không phụ thuộc vào MySQL chạy ngoài). | [pom.xml](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/SRC/backend/pom.xml) | **Hoàn thành** |
| **API Tìm kiếm lớp** | Phát triển API tìm kiếm lớp học phần cho phép tìm kiếm mờ (mã lớp, tên môn học, giảng viên phụ trách). | Cập nhật Repository, Service và [LopHocPhanController.java](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/SRC/backend/src/main/java/com/nhom21/registration/controller/LopHocPhanController.java) | **Hoàn thành** |
| **Kiểm thử Concurrency** | Viết test kiểm thử tích hợp sử dụng đa luồng (multi-threading) gửi request đăng ký đồng thời vào lớp học phần giới hạn 2 chỗ để kiểm tra tính an toàn của Khóa bi quan. | [DangKyIntegrationTest.java](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/SRC/backend/src/test/java/com/nhom21/registration/service/DangKyIntegrationTest.java) | **Hoàn thành** |
| **Đồng bộ hóa & Staging** | Cập nhật lộ trình tổng, changelog dự án, ghi nhận tiến độ vào file `task.md` và stage thay đổi. | [CHANGELOG.md](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/CHANGELOG.md)<br>[.plan.md](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/.cursor/plans/đồ_án_đăng_ký_tín_chỉ_a39fa979.plan.md) | **Hoàn thành** |

---

## 2. Đánh giá chất lượng sản phẩm
*   Thiết kế cơ sở dữ liệu quan hệ đạt chuẩn 3NF đảm bảo không dư thừa dữ liệu (anomalies) và kiểm soát toàn vẹn bằng khóa ngoại cứng.
*   Cơ chế Khóa bi quan (`PESSIMISTIC_WRITE`) trên hàng dữ liệu của `LopHocPhan` được chứng minh hoạt động hoàn hảo thông qua bộ kiểm thử tích hợp đa luồng: Chỉ đúng số sinh viên bằng số slot trống đăng ký thành công, các sinh viên còn lại nhận lỗi đầy sĩ số và không có tình trạng ghi đè dữ liệu (lost update).
*   API tìm kiếm hỗ trợ chuyển đổi chữ hoa/chữ thường (case-insensitive) giúp sinh viên dễ dàng định dạng lớp cần đăng ký.

---

## 3. Khó khăn vướng mắc
*   Không có khó khăn vướng mắc phát sinh.

---

## 4. Kế hoạch Tuần 9 (Phase 4: Lập trình Giao diện và Tích hợp)
*   Bắt đầu xây dựng giao diện người dùng React (Vite + TS) cho Sinh viên đăng ký và Giáo vụ quản trị lớp học phần.
*   Tích hợp gọi APIs backend sử dụng thư viện Axios.
