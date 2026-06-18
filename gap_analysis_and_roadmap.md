# Phân Tích Hiện Trạng & Lộ Trình Phát Triển (Gap Analysis & Roadmap)

Tài liệu này đối chiếu danh sách tính năng theo yêu cầu của đồ án với mã nguồn hiện tại, được chia làm 2 nhóm nhiệm vụ chính:
1. **Nhóm 1: Các tính năng đã phát triển rồi nhưng còn thiếu (Dở dang)**
2. **Nhóm 2: Các tính năng chưa phát triển tí nào (Hoàn toàn chưa có)**

---

## NHÓM 1: CÁC TÍNH NĂNG ĐÃ PHÁT TRIỂN RỒI NHƯNG CÒN THIẾU (DỞ DANG)

Các tính năng này đã có nền tảng cơ sở dữ liệu hoặc logic cơ bản ở Backend nhưng giao diện (UI) hoặc một số tiện ích đi kèm chưa được hoàn thiện đầy đủ.

### 1. Tra cứu chương trình đào tạo (Phân hệ Sinh viên)
*   **Trạng thái**: ⚠️ Đã có CSDL về môn tiên quyết (`mon_tien_quyet`) và logic kiểm tra điều kiện tiên quyết ở Backend.
*   **Phần còn thiếu**: Chưa có trang giao diện (UI) riêng hiển thị toàn bộ Khung chương trình đào tạo (các môn học bắt buộc, tự chọn, môn tiên quyết) để sinh viên theo dõi tiến độ học tập (môn nào đã học đạt, môn nào chưa học).

### 2. Quản lý thời khóa biểu (Phân hệ Sinh viên)
*   **Trạng thái**: ⚠️ Đã có giao diện thời khóa biểu tuần trực quan hiển thị trên trang Dashboard Sinh viên (`StudentDashboard.tsx`) kèm theo chi tiết phòng học.
*   **Phần còn thiếu**: Chưa có tính năng/nút bấm hỗ trợ xuất lịch học ra định dạng tập tin `.ics` để đồng bộ vào Google Calendar hoặc Apple Calendar.

### 3. Tra cứu kết quả học tập (Phân hệ Sinh viên)
*   **Trạng thái**: ⚠️ CSDL đã có bảng `ket_qua_hoc_tap` dùng để lưu điểm trung bình môn học và trạng thái Đạt/Trượt.
*   **Phần còn thiếu**: 
    *   Chưa có màn hình giao diện xem bảng điểm chi tiết cho sinh viên.
    *   Thiếu cột lưu điểm thành phần (chuyên cần, giữa kỳ, cuối kỳ) trong CSDL.
    *   Chưa có logic tính điểm trung bình tích lũy (GPA) hệ 4 và hệ 10.

### 4. Quản lý danh mục (Phân hệ Admin)
*   **Trạng thái**: ⚠️ Giao diện quản trị viên (`AdminCourseSections.tsx`) đã quản lý được việc Thêm/Sửa/Xóa lớp học phần (`LopHocPhan`) liên kết với môn học, giảng viên và đợt đăng ký.
*   **Phần còn thiếu**: Chưa có giao diện để quản lý trực tiếp danh mục Môn học (`MonHoc`), Giảng viên (`GiangVien`), và quản lý danh sách Phòng học (hiện tại phòng học đang là chuỗi nhập tự do trong lịch học chứ chưa quản lý theo danh mục phòng).

### 5. Thiết lập đợt đăng ký (Phân hệ Admin)
*   **Trạng thái**: ⚠️ Có bảng `dot_dang_ky` đóng/mở đợt đăng ký, cho phép đặt sĩ số tối đa cho từng lớp học phần.
*   **Phần còn thiếu**: 
    *   Chưa hỗ trợ thiết lập đợt đăng ký giới hạn theo từng Khóa học hoặc Ngành học cụ thể.
    *   Chưa hỗ trợ quy định và kiểm tra sĩ số tối thiểu của lớp học phần.

### 6. Xếp thời khóa biểu (Phân hệ Admin)
*   **Trạng thái**: ⚠️ Khi tạo/sửa lớp học phần, admin có thể phân công giảng viên phụ trách và gán đợt đăng ký tương ứng.
*   **Phần còn thiếu**: Chưa có trình xếp lịch học chi tiết (chọn Thứ, Tiết bắt đầu, Tiết kết thúc, Phòng học) trực tiếp trên form giao diện của Admin (hiện tại lịch học đang được chèn tĩnh thông qua database seed).

---

## NHÓM 2: CÁC TÍNH NĂNG CHƯA PHÁT TRIỂN TÝ NÀO (HOÀN TOÀN CHƯA CÓ)

Các tính năng này hoàn toàn chưa có cấu trúc bảng trong CSDL và chưa có logic xử lý ở cả Frontend lẫn Backend.

### 1. Hàng đợi (Waitlist) tự động
*   **Phần chưa phát triển**: 
    *   Chưa có bảng `waitlist` trong CSDL.
    *   Thiếu logic ở Backend: Khi lớp đầy sĩ số, đưa sinh viên đăng ký tiếp theo vào hàng chờ; khi có sinh viên khác hủy lớp, tự động đẩy sinh viên đứng đầu hàng chờ lên thành đăng ký chính thức.
    *   Chưa có giao diện hiển thị danh sách hàng chờ và số thứ tự chờ của sinh viên.

### 2. Thanh toán học phí trực tuyến (Giả lập)
*   **Phần chưa phát triển**: 
    *   Chưa có bảng theo dõi công nợ tín chỉ và hóa đơn học phí trong CSDL.
    *   Chưa có giao diện tra cứu công nợ, in hóa đơn học phí cho sinh viên.
    *   Chưa tích hợp cổng thanh toán trực tuyến giả lập (Mock Payment Gateway hiển thị QR Code và bấm xác nhận để cập nhật trạng thái đã nộp học phí).

### 3. Cảnh báo trùng lịch thi tự động
*   **Phần chưa phát triển**: 
    *   Chưa có bảng quản lý lịch thi (`lich_thi`) trong CSDL.
    *   Chưa có logic kiểm tra trùng lịch thi khi sinh viên đăng ký lớp học phần tương tự như kiểm tra trùng lịch học.

### 4. Báo cáo & Thống kê (Phân hệ Admin)
*   **Phần chưa phát triển**: 
    *   Chưa hỗ trợ xuất danh sách lớp ra định dạng file Excel (CSV) / PDF.
    *   Chưa có màn hình thống kê tự động các lớp quá ít người (để hủy lớp) hoặc quá đông người (để mở thêm lớp mới).
