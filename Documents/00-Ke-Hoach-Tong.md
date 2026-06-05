# Kế hoạch Tổng thể Đồ án Đăng ký Tín chỉ - Nhóm 21 (Lớp N05)

Tài liệu này xác định lộ trình triển khai chi tiết kéo dài 10 tuần, được tổ chức thành 5 Phase lớn nhằm xây dựng thành công hệ thống đăng ký tín chỉ.

---

## 📅 Lộ trình các Phase và Tuần thực hiện

### 📂 Phase 1: Phân tích & Đặc tả Yêu cầu (Tuần 1 & Tuần 2)
*Giai đoạn xác định phạm vi hệ thống, các luồng nghiệp vụ và đặc tả kịch bản Use Case chi tiết.*
- **Tuần 1 (Phân tích Yêu cầu)**:
  - Thiết lập nhóm, phân chia công việc.
  - Phân tích đề tài, vẽ Context Diagram xác định ranh giới hệ thống.
  - Liệt kê các tác nhân (Actors) và danh sách yêu cầu chức năng (FR) & phi chức năng (NFR).
  - Soạn thảo tài liệu SRS ban đầu.
- **Tuần 2 (Mô hình hóa Use Case)**:
  - Vẽ Use Case Diagram tổng thể (sử dụng quan hệ `<<include>>`, `<<extend>>`).
  - Lập đặc tả kịch bản (Scenario) chi tiết cho 3 Use Case cốt lõi: Đăng ký học phần, Mở lớp học phần, Nhập điểm học phần.
  - Cập nhật và tinh chỉnh tài liệu SRS.

### 📂 Phase 2: Thiết kế Đối tượng & Hành vi (Tuần 3 - Tuần 5)
*Giai đoạn chuyển đổi từ phân tích yêu cầu sang thiết kế cấu trúc tĩnh và động.*
- **Tuần 3 (Thiết kế Lớp & Cấu trúc Code)**:
  - Trích xuất danh từ từ kịch bản để xác định các lớp nghiệp vụ.
  - Thiết kế Class Diagram đầy đủ các thuộc tính, phương thức và mối quan hệ (Association, Aggregation, Inheritance...).
  - Khởi tạo khung dự án Java Spring Boot.
- **Tuần 4 (Thiết kế Tương tác & Giao diện)**:
  - Vẽ Sequence Diagram mô tả trình tự tương tác giữa các đối tượng của chức năng Đăng ký môn học.
  - Thiết kế UI Mockup mô phỏng các màn hình chính (Dashboard, Trang Đăng ký, Quản lý lớp).
- **Tuần 5 (Thiết kế Trạng thái & Hành vi phức tạp)**:
  - Vẽ State Machine Diagram cho lớp học phần (Trạng thái mở đăng ký, bị hủy, đã mở học...).
  - Vẽ Activity Diagram cho quy trình đăng ký môn học và xét duyệt điều kiện.

### 📂 Phase 3: Thiết kế Kiến trúc & Mẫu thiết kế (Tuần 6 & Tuần 7)
*Áp dụng các chuẩn thiết kế phần mềm sạch (SOLID) và các mẫu thiết kế kinh điển.*
- **Tuần 6 (Thiết kế Kiến trúc Hệ thống)**:
  - Vẽ Package Diagram phân tách 4 tầng: Controller → Service → Repository → Entity.
  - Thiết kế các Interface phục vụ Dependency Inversion.
- **Tuần 7 (Áp dụng Design Patterns)**:
  - Tích hợp Singleton Pattern cho kết nối Database/Config.
  - Tích hợp Factory Pattern để tạo các lớp học phần và các nhóm người dùng khác nhau.
  - Tích hợp Observer/Strategy Pattern cho tính năng thông báo và tính học phí (nếu có).

### 📂 Phase 4: Phát triển Ứng dụng (Tuần 8 & Tuần 9)
*Hiện thực hóa toàn bộ thiết kế thành mã nguồn hoàn chỉnh.*
- **Tuần 8 (Lập trình Chức năng Lõi)**:
  - Xây dựng DB schema, khởi tạo dữ liệu mẫu.
  - Viết code xử lý nghiệp vụ Đăng ký học phần (xử lý tranh chấp số lượng/slot bằng khóa bi quan `PESSIMISTIC_WRITE`).
  - Viết Unit Tests kiểm tra tính đồng thời.
- **Tuần 9 (Lập trình Giao diện & Tích hợp)**:
  - Code Frontend React kết nối API qua Axios.
  - Tích hợp các tính năng trong nhóm, kiểm thử liên thông (End-to-End).

### 📂 Phase 5: Kiểm thử & Báo cáo Tổng kết (Tuần 10)
- **Tuần 10 (Kiểm thử & Hoàn thiện)**:
  - Viết Test Cases và chạy kiểm thử với Mockito/JUnit.
  - Đo lường và đảm bảo Test Coverage cho Service >= 60%.
  - Hoàn thiện báo cáo đồ án học thuật và slide thuyết trình.

---

## 👥 Phân công Vai trò trong Nhóm 21

| Thành viên | Vai trò chính | Nhiệm vụ chính |
| :--- | :--- | :--- |
| **Thành viên A (Trưởng nhóm)** | Thiết kế Kiến trúc & Backend | Viết API lõi (Spring Boot), thiết kế CSDL, quản lý Repo Git |
| **Thành viên B (Thư ký)** | Thiết kế UI/UX & Frontend | Xây dựng giao diện React, mockup giao diện, tích hợp API Axios |
| **Thành viên C** | Lập tài liệu & Kiểm thử | Viết SRS/SDD, viết Test Cases, kiểm thử chất lượng, viết báo cáo tuần |
