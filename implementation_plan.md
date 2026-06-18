# Kế hoạch thiết kế lại giao diện Đăng ký học phần (Phase 4 - Tuần 9)

Kế hoạch này đề xuất thiết kế lại giao diện trang đăng ký học phần phía Frontend để nhóm các lớp học phần theo môn học (dạng danh sách mở rộng/thu gọn Accordion), hiển thị rõ ràng các lớp học phần của cùng một môn (ví dụ OOP có lớp N01, N02) với lịch học khác nhau để sinh viên so sánh tránh trùng lịch, đồng thời hỗ trợ dữ liệu môn học có 1 hoặc 2 buổi/tuần dựa trên số tín chỉ.

---

## User Review Required

> [!IMPORTANT]
> **1. Thay đổi cấu trúc hiển thị danh sách lớp**
> * Thay vì hiển thị một danh sách phẳng gồm toàn bộ các lớp học phần, giao diện mới hiển thị danh sách các **Môn học (Subject)**.
> * Khi sinh viên nhấp vào một môn học, danh sách các **Lớp học phần (Class Section)** trực thuộc môn đó sẽ được hiển thị mở rộng (collapsible list). Điều này giúp sinh viên dễ dàng chọn giữa các lớp lý thuyết/thực hành khác nhau của cùng một môn.
> 
> **2. Xử lý hiển thị và kiểm tra Trùng lịch học (Schedule Conflict)**
> * Khi mở rộng danh sách lớp của một môn học, hệ thống sẽ thực hiện kiểm tra trùng lịch cho từng lớp học phần (N01, N02...) đối với các môn đã đăng ký thành công hoặc các môn đang nằm trong giỏ chọn tạm thời.
> * Nếu một lớp (ví dụ lớp N01) bị trùng lịch, giao diện sẽ hiển thị rõ nhãn **"Trùng lịch"** kèm thông tin môn học đang bị xung đột lịch, và thay thế nút "Chọn lớp" bằng nút cảnh báo bị vô hiệu hóa (disabled).
> * Cơ chế này giúp sinh viên thấy ngay lý do lớp đó không thể chọn, và định hướng sinh viên xem xét chọn các lớp học phần khác (ví dụ lớp N02 hoặc N03) của chính môn học đó có lịch học không bị trùng.
> 
> **3. Dữ liệu môn học 2 buổi/tuần (Xét theo tín chỉ)**
> * Chúng tôi sẽ bổ sung dữ liệu lịch học buổi thứ hai cho lớp **Phân tích và thiết kế phần mềm (LHP_PTTK_01)** (môn học 4 tín chỉ) vào CSDL thực tế và tệp hạt giống (seed data).
> * Hệ thống kiểm tra trùng lịch ở cả Frontend và Backend đã được xây dựng tổng quát và sẽ tự động kiểm tra xung đột lịch học của cả 2 buổi học này.

---

## Proposed Changes

### 1. Database (MySQL Seed)

#### [MODIFY] [sample_data.sql](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/SRC/database/seeds/sample_data.sql)
* Bổ sung buổi học thứ 2 cho lớp học phần 4 tín chỉ `LHP_PTTK_01` (lop_hoc_phan_id = 3) học vào Thứ 6, tiết 1-2 tại phòng `B2-203` (buổi thứ 1 là Thứ 4, tiết 1-4).
* Chạy trực tiếp lệnh SQL chèn buổi học này vào cơ sở dữ liệu `registration_db` hiện tại để có hiệu lực ngay lập tức.

---

### 2. Frontend Components (React)

#### [MODIFY] [CourseRegistration.tsx](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/SRC/frontend/src/pages/CourseRegistration.tsx)
* Thêm trạng thái quản lý các môn học đang được mở rộng:
  ```typescript
  const [expandedSubjects, setExpandedSubjects] = useState<Record<number, boolean>>({});
  ```
* Định nghĩa hàm phụ để đảo ngược trạng thái mở rộng của môn học:
  ```typescript
  const toggleSubject = (subjectId: number) => {
    setExpandedSubjects(prev => ({ ...prev, [subjectId]: !prev[subjectId] }));
  };
  ```
* Cải tiến hàm kiểm tra trùng lịch `checkScheduleConflict` hoặc bổ sung hàm tìm chi tiết lớp bị trùng:
  * Trả về thông tin lớp học phần bị trùng lịch biểu để hiển thị trực tiếp lên giao diện (ví dụ: `Trùng lịch với lớp LHP_OOP_01`).
* Thiết kế lại cấu trúc bảng hiển thị:
  * Nhóm danh sách `classes` nhận từ API theo `monHoc.id`.
  * Hiển thị danh sách các môn học dạng Header Card. Trên mỗi môn học, hiển thị tên môn, mã môn, số tín chỉ, và số lớp học phần đang mở.
  * Khi mở rộng môn học, hiển thị bảng danh sách các lớp học phần tương ứng (Mã lớp, Giảng viên, Sĩ số, Lịch học, Trạng thái/Hành động).
  * Hiển thị lịch học rõ ràng dạng nhiều buổi học nếu có (ví dụ: `Thứ 4 (1-4) [B2-203], Thứ 6 (1-2) [B2-203]`).
  * Đối với các lớp bị trùng lịch, hiển thị cảnh báo đỏ và thông báo chi tiết xung đột lịch với lớp nào để sinh viên dễ dàng chuyển hướng sang các lớp khác của cùng một môn.

---

## Verification Plan

### Automated Tests
* Chạy lại bộ unit test để đảm bảo không vi phạm các logic đăng ký:
  ```powershell
  $env:JAVA_HOME = "C:\Users\ADMIN\.antigravity-ide\extensions\redhat.java-1.54.0-win32-x64\jre\21.0.10-win32-x86_64"; & C:\Users\ADMIN\Documents\DACS\backend\maven\apache-maven-3.9.6\bin\mvn.cmd test -f SRC/backend/pom.xml
  ```

### Manual Verification
1. **Chèn thêm dữ liệu buổi thứ hai**:
   * Chạy lệnh chèn lịch học bổ sung cho lớp học phần ID = 3.
2. **Kiểm nghiệm Giao diện mới**:
   * Truy cập giao diện đăng ký học phần.
   * Xác nhận danh sách hiển thị theo môn học dạng Accordion.
   * Click vào môn **Lập trình hướng đối tượng** để mở rộng và chọn giữa `LHP_OOP_01` và `LHP_OOP_02`.
   * Click vào môn **Phân tích và thiết kế phần mềm** để kiểm tra hiển thị lịch học 2 buổi/tuần.
   * Thử nghiệm tính năng kiểm tra trùng lịch (ví dụ chọn lớp trùng lịch với lịch hiện tại) để đảm bảo cảnh báo hoạt động chính xác.
