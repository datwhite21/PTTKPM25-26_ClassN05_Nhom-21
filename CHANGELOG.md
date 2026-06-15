# Nhật ký thay đổi (Changelog)

Tất cả các thay đổi đáng chú ý đối với dự án này sẽ được ghi nhận trong file này. 
Định dạng dựa trên [Keep a Changelog](https://keepachangelog.com/vi/1.0.0/).

## [Chưa phát hành (Unreleased)]

---

## [Phase 4 - Tuần 8] - 2026-06-15

### Thêm mới (Added)
- Kịch bản SQL khởi tạo cơ sở dữ liệu quan hệ [V1__init.sql](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/SRC/database/schema/V1__init.sql) định dạng 3NF.
- Dữ liệu thử nghiệm mẫu [sample_data.sql](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/SRC/database/seeds/sample_data.sql) chứa 5-10 bản ghi cho từng thực thể.
- File cấu hình [application.properties](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/SRC/backend/src/main/resources/application.properties) kết nối MySQL và cấu hình JPA Hibernate.
- Dependency H2 database trong `pom.xml` phục vụ môi trường kiểm thử tích hợp cô lập.
- Bộ kiểm thử tích hợp đồng thời [DangKyIntegrationTest.java](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/SRC/backend/src/test/java/com/nhom21/registration/service/DangKyIntegrationTest.java) sử dụng đa luồng (multi-threading) kiểm chứng Khóa bi quan.
- Báo cáo tuần 8 ([Week-08.md](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/Documents/weekly-reports/Week-08.md)).

### Thay đổi (Changed)
- Thêm query JPQL tìm kiếm lớp học phần theo mã lớp, môn học, giảng viên trong [LopHocPhanRepository.java](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/SRC/backend/src/main/java/com/nhom21/registration/repository/LopHocPhanRepository.java).
- Phương thức nghiệp vụ `timKiemLopHocPhan` trong [ILopHocPhanService.java](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/SRC/backend/src/main/java/com/nhom21/registration/service/ILopHocPhanService.java) và [LopHocPhanServiceImpl.java](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/SRC/backend/src/main/java/com/nhom21/registration/service/LopHocPhanServiceImpl.java).
- REST Endpoint `GET /api/course-sections/search` trong [LopHocPhanController.java](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/SRC/backend/src/main/java/com/nhom21/registration/controller/LopHocPhanController.java).

---

## [Phase 3 - Tuần 7] - 2026-06-12

### Thêm mới (Added)
- Tài liệu Thuyết minh Thiết kế Mẫu [08-Design-Patterns.md](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/Design/08-Design-Patterns.md) và sơ đồ [design-patterns-uml.png](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/Design/sketches/design-patterns-uml.png).
- Cài đặt mẫu thiết kế Singleton: [SystemConfig.java](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/SRC/backend/src/main/java/com/nhom21/registration/config/SystemConfig.java).
- Cài đặt mẫu thiết kế Factory: [NguoiDungFactory.java](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/SRC/backend/src/main/java/com/nhom21/registration/factory/NguoiDungFactory.java).
- Cài đặt mẫu thiết kế Observer: [NotificationObserver.java](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/SRC/backend/src/main/java/com/nhom21/registration/observer/NotificationObserver.java), [SinhVienObserver.java](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/SRC/backend/src/main/java/com/nhom21/registration/observer/SinhVienObserver.java) và tích hợp vào [LopHocPhanServiceImpl.java](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/SRC/backend/src/main/java/com/nhom21/registration/service/LopHocPhanServiceImpl.java).
- Cài đặt mẫu thiết kế Strategy: [HocPhiStrategy.java](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/SRC/backend/src/main/java/com/nhom21/registration/strategy/HocPhiStrategy.java), [ChinhQuyHocPhiStrategy.java](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/SRC/backend/src/main/java/com/nhom21/registration/strategy/ChinhQuyHocPhiStrategy.java), [ChatLuongCaoHocPhiStrategy.java](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/SRC/backend/src/main/java/com/nhom21/registration/strategy/ChatLuongCaoHocPhiStrategy.java).
- Bộ Unit Test mẫu thiết kế [DesignPatternsTest.java](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/SRC/backend/src/test/java/com/nhom21/registration/service/DesignPatternsTest.java).
- Báo cáo tuần 7 ([Week-07.md](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/Documents/weekly-reports/Week-07.md)).

### Thay đổi (Changed)
- Cập nhật thực thể [SinhVien.java](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/SRC/backend/src/main/java/com/nhom21/registration/domain/SinhVien.java) tích hợp cơ chế tính học phí theo Strategy.

---

## [Phase 3 - Tuần 6] - 2026-06-08

### Thêm mới (Added)
- Tài liệu Thiết kế Kiến trúc và Triển khai (SDD) [07-SDD.md](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/Design/07-SDD.md) bằng Tiếng Việt.
- Sơ đồ Biểu đồ Phân gói (Package Diagram) dạng Mermaid và ảnh PNG [package-diagram.png](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/Design/sketches/package-diagram.png).
- Sơ đồ Biểu đồ Triển khai (Deployment Diagram) dạng Mermaid và ảnh PNG [deployment-diagram.png](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/Design/sketches/deployment-diagram.png).
- Cài đặt bộ xử lý lỗi tập trung [GlobalExceptionHandler.java](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/SRC/backend/src/main/java/com/nhom21/registration/exception/GlobalExceptionHandler.java) để map các Exception của Service thành mã HTTP RESTful chuẩn (404, 409).
- Định nghĩa interface [ILopHocPhanService.java](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/SRC/backend/src/main/java/com/nhom21/registration/service/ILopHocPhanService.java) và lớp cài đặt [LopHocPhanServiceImpl.java](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/SRC/backend/src/main/java/com/nhom21/registration/service/LopHocPhanServiceImpl.java).
- Lớp REST Controller quản lý Lớp học phần [LopHocPhanController.java](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/SRC/backend/src/main/java/com/nhom21/registration/controller/LopHocPhanController.java) phục vụ Giáo vụ.
- Báo cáo tuần 6 ([Week-06.md](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/Documents/weekly-reports/Week-06.md)).

### Thay đổi (Changed)
- Loại bỏ các khối try-catch thủ công lặp lại trong [DangKyController.java](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/SRC/backend/src/main/java/com/nhom21/registration/controller/DangKyController.java), bàn giao xử lý lỗi cho `GlobalExceptionHandler`.
- Thêm phương thức truy vấn `findByMaLopHP` trong [LopHocPhanRepository.java](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/SRC/backend/src/main/java/com/nhom21/registration/repository/LopHocPhanRepository.java) để phục vụ kiểm tra trùng lặp mã khi tạo lớp.

---

## [Phase 2 - Tuần 5] - 2026-06-05

### Thêm mới (Added)
- Biểu đồ trạng thái Lớp học phần (`state-diagram-lophocphan.png`) và biểu đồ trạng thái Phiếu đăng ký (`state-diagram-dangky.png`) mô tả vòng đời các đối tượng cốt lõi.
- Biểu đồ Hoạt động (Activity Diagram) thể hiện quy trình nghiệp vụ Đăng ký học phần kiểm tra điều kiện song song.
- Viết các Unit Test kiểm thử chuyển đổi trạng thái [DangKyStateTransitionTest.java](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/SRC/backend/src/test/java/com/nhom21/registration/service/DangKyStateTransitionTest.java).
- Báo cáo tuần 5 ([Week-05.md](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/Documents/weekly-reports/Week-05.md)).

### Thay đổi (Changed)
- Cập nhật logic chuyển đổi trạng thái `chuyenTrangThai()` trong [LopHocPhan.java](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/SRC/backend/src/main/java/com/nhom21/registration/domain/LopHocPhan.java) và [DangKy.java](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/SRC/backend/src/main/java/com/nhom21/registration/domain/DangKy.java).

---

## [Phase 2 - Tuần 4] - 2026-06-01

### Thêm mới (Added)
- Biểu đồ tuần tự (Sequence Diagram) cho nghiệp vụ Đăng ký môn học và Mở lớp học phần.
- Thiết kế mô hình giao diện (UI Mockup) cho 4 màn hình: Đăng nhập, Dashboard Sinh viên, Đăng ký học phần, Quản lý lớp học phần.
- Báo cáo tuần 4 ([Week-04.md](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/Documents/weekly-reports/Week-04.md)).

---

## [Phase 2 - Tuần 3] - 2026-05-25

### Thêm mới (Added)
- Thiết kế Biểu đồ Lớp (Class Diagram) tổng thể cho hệ thống Đăng ký tín chỉ.
- Khởi tạo khung dự án Spring Boot (JPA Entities, Repositories, Service Interfaces và base implementation cho nghiệp vụ đăng ký).
- Báo cáo tuần 3 ([Week-03.md](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/Documents/weekly-reports/Week-03.md)).

---

## [Phase 1 - Tuần 2] - 2026-06-05

### Thêm mới (Added)
- Bản vẽ Biểu đồ Use Case tổng thể dạng Mermaid thể hiện liên kết `<<include>>` và `<<extend>>` giữa các chức năng đăng ký môn học.
- Kịch bản đặc tả chi tiết của 3 Use Case cốt lõi:
  - **UC-01 (Đăng ký học phần)**: Tác nhân Sinh viên, mô tả đầy đủ luồng nghiệp vụ chính, 2 luồng thay thế và 3 luồng ngoại lệ.
  - **UC-02 (Mở lớp học phần)**: Tác nhân Giáo vụ, đặc tả luồng thiết lập lớp học mới.
  - **UC-03 (Nhập điểm học phần)**: Tác nhân Giảng viên, đặc tả luồng cập nhật điểm số cho lớp học phần phụ trách.
- Báo cáo tiến trình và biên bản họp tuần 2 ([Week-02.md](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/Documents/weekly-reports/Week-02.md)).

---

## [Phase 1 - Tuần 1] - 2026-05-29

### Thêm mới (Added)
- Cấu trúc khung dự án gồm các thư mục `Documents/`, `Design/` và `SRC/`.
- File giới thiệu dự án [README.md](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/README.md).
- Kế hoạch tổng thể 10 tuần phân thành 5 Phase ([00-Ke-Hoach-Tong.md](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/Documents/00-Ke-Hoach-Tong.md)).
- Khung tài liệu SRS ban đầu ([01-SRS.md](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/Documents/01-SRS.md)):
  - Sơ đồ ngữ cảnh Context Diagram bằng Mermaid.
  - Định nghĩa các Actor chính (Sinh viên, Giảng viên, Giáo vụ) và Actor phụ (Cổng thanh toán, Hệ thống xác thực).
  - Danh sách 16 yêu cầu chức năng (FR) dạng chuẩn và 5 yêu cầu phi chức năng (NFR).
  - Ma trận liên kết Actor - Use Case.
- Báo cáo tiến trình và biên bản họp tuần 1 ([Week-01.md](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/Documents/weekly-reports/Week-01.md)).
