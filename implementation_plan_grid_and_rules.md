# Kế hoạch thiết kế lại giao diện dạng Grid và Ràng buộc theo Môn học

Kế hoạch này đề xuất thiết kế lại giao diện trang đăng ký học phần phía Frontend để chọn môn học từ danh sách, hiển thị các lớp học phần dưới dạng ô vuông (Card Grid), đồng thời áp dụng quy tắc nghiệp vụ nghiêm ngặt: sinh viên chỉ được chọn/đăng ký duy nhất 1 lớp học phần cho mỗi môn học. Nếu muốn chọn/đăng ký lớp học phần khác của cùng môn học đó, sinh viên **bắt buộc phải thực hiện hủy lớp đã chọn/đăng ký hiện tại trước**.

---

## User Review Required

> [!IMPORTANT]
> **1. Ràng buộc "Phải hủy lớp cũ trước khi đăng ký lớp khác của cùng môn học"**
> * **Trong giỏ hàng tạm thời (Cart)**:
>   * Nếu giỏ hàng đã chứa 1 lớp học phần của môn X (ví dụ `LHP_OOP_01`), nút chọn của các lớp học phần khác thuộc môn X (ví dụ `LHP_OOP_02`) sẽ bị vô hiệu hóa (disabled), hiển thị nhãn: *"Môn học đã có trong giỏ"*.
>   * Sinh viên muốn chọn lớp khác phải nhấn nút xóa lớp hiện tại ra khỏi giỏ hàng trước.
> * **Đối với lớp đã đăng ký thành công (Registered)**:
>   * Nếu sinh viên đã đăng ký thành công lớp `LHP_OOP_01`, các lớp học phần khác của môn OOP như `LHP_OOP_02` sẽ bị khóa nút chọn hoàn toàn, hiển thị nhãn: *"Đã đăng ký lớp khác"*.
>   * Sinh viên không thể tự ý chọn thêm lớp khác của môn học đó vào giỏ hàng.
>   * Sinh viên bắt buộc phải nhấp vào nút **"Hủy học phần"** của lớp đã đăng ký thành công `LHP_OOP_01` trước. Sau khi hủy thành công, nút chọn của các lớp học phần khác mới được kích hoạt trở lại để sinh viên đăng ký.
> * **Backend Validation**:
>   * Khi thực hiện đăng ký, Backend sẽ kiểm tra chéo: nếu sinh viên đã có một đăng ký thành công ở lớp học phần khác của cùng môn học đó, Backend sẽ từ chối và trả về lỗi: *"Bạn đã đăng ký một lớp học phần khác của môn học này!"*.

---

## Proposed Changes

### 1. Backend Service & Tests

#### [MODIFY] [DangKyServiceImpl.java](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/SRC/backend/src/main/java/com/nhom21/registration/service/DangKyServiceImpl.java)
* Cập nhật phương thức `thucHienDangKy`:
  * Lấy danh sách đăng ký hiện tại của sinh viên (`layDanhSachDangKySinhVien`).
  * Kiểm tra xem môn học của lớp học phần mới định đăng ký (`lhp.getMonHoc().getId()`) đã có trong danh sách đăng ký thành công nào chưa.
  * Nếu trùng môn học và trùng chính lớp đó: Báo lỗi *"Bạn đã đăng ký thành công lớp học phần này từ trước!"*.
  * Nếu trùng môn học nhưng khác lớp: Báo lỗi *"Bạn đã đăng ký một lớp học phần khác của môn học này!"*.

#### [MODIFY] [DangKyIntegrationTest.java](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/SRC/backend/src/test/java/com/nhom21/registration/service/DangKyIntegrationTest.java)
* Thêm dữ liệu mẫu một lớp học phần thứ hai của cùng môn học OOP trong `setUp`.
* Thêm ca kiểm thử `testDuplicateSubjectRegistration` để xác minh nghiệp vụ ngăn chặn đăng ký nhiều lớp trong cùng một môn học hoạt động chính xác và ném lỗi phù hợp.

---

### 2. Frontend Layout & CSS

#### [MODIFY] [index.css](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/SRC/frontend/src/index.css)
* Thêm các lớp CSS cho giao diện mới:
  * `.subject-selector-grid`: Bố cục lưới hiển thị danh sách các môn học mở.
  * `.subject-selector-card`: Thẻ hiển thị môn học với các hiệu ứng hover, chuyển màu và trạng thái hoạt động `.active`.
  * `.class-card-grid`: Bố cục lưới thẻ lớp học phần dạng ô vuông.
  * `.class-section-card`: Thẻ chi tiết lớp học phần dạng ô vuông với viền bo tròn, bóng đổ, và thiết kế phân lớp thông tin.
  * Thêm style cho thanh hiển thị tiến độ sĩ số lớp `.class-capacity-bar` và `.class-capacity-fill`.

#### [MODIFY] [CourseRegistration.tsx](file:///c:/Users/ADMIN/Documents/PTTKPM/PTTKPM25-26_ClassN05_Nhom-21/SRC/frontend/src/pages/CourseRegistration.tsx)
* Thêm trạng thái `activeSubjectId` để quản lý môn học đang được chọn xem chi tiết:
  ```typescript
  const [activeSubjectId, setActiveSubjectId] = useState<number | null>(null);
  ```
* Cập nhật hàm tải dữ liệu `loadData` để tự động chọn môn học đầu tiên làm mặc định khi tải xong danh sách lớp nếu chưa có môn nào được chọn.
* Nâng cấp hàm `addToCart`:
  * Duyệt trong giỏ hàng hiện tại, nếu phát hiện lớp học phần có `monHoc.id` trùng với môn học của lớp chuẩn bị thêm thì chặn lại và hiển thị cảnh báo: *"Môn học này đã có lớp học phần khác trong giỏ hàng. Vui lòng bỏ chọn lớp cũ trước."*
* Cập nhật phần kết xuất (Render):
  * Kết xuất Khung chứa tên các môn học dạng ô vuông/thẻ chọn ở trên cùng.
  * Khi click vào một môn học, cập nhật `activeSubjectId`.
  * Kết xuất phần chi tiết bên dưới dạng ô vuông/thẻ (`class-section-card`) chứa thông tin chi tiết từng lớp học phần (Mã lớp, Giảng viên, Lịch học, Sĩ số, Nút thao tác).
  * Xử lý trạng thái nút bấm và hiển thị trên thẻ lớp học phần:
    * **Đã đăng ký lớp này**: Hiển thị badge Đã Đăng Ký và một nút bấm rõ ràng **"Hủy học phần"** (để sinh viên thực hiện hủy trực tiếp).
    * **Đã đăng ký lớp khác của môn**: Hiển thị nút Vô hiệu hóa và hiển thị: *"Đã đăng ký lớp khác"* (Muốn đổi lớp phải hủy lớp đã đăng ký trước).
    * **Đang chọn (trong giỏ)**: Hiển thị nút "Bỏ chọn" (để xóa ra khỏi giỏ).
    * **Đã chọn lớp khác của môn này trong giỏ**: Hiển thị nút Vô hiệu hóa: *"Đã chọn lớp khác"* (Muốn đổi lớp phải bỏ chọn lớp cũ trong giỏ trước).
    * **Trùng lịch học môn khác**: Hiển thị nút Vô hiệu hóa "Trùng lịch" kèm tên môn xung đột lịch ở dưới nút.
    * **Đầy lớp**: Hiển thị nút Vô hiệu hóa "Đầy lớp".
    * **Sẵn sàng chọn**: Nút "Chọn lớp" màu sắc nổi bật.

---

## Verification Plan

### Automated Tests
* Chạy bộ test tích hợp của Backend bao gồm cả kiểm thử trùng môn học mới thêm:
  ```powershell
  $env:JAVA_HOME = "C:\Users\ADMIN\.antigravity-ide\extensions\redhat.java-1.54.0-win32-x64\jre\21.0.10-win32-x86_64"; & C:\Users\ADMIN\Documents\DACS\backend\maven\apache-maven-3.9.6\bin\mvn.cmd test -f SRC/backend/pom.xml
  ```

### Manual Verification
1. **Kiểm tra giao diện mới**:
   * Truy cập trang đăng ký học phần trên trình duyệt.
   * Xác nhận sự xuất hiện của Khung danh sách môn học mở ở phía trên và Lưới lớp học phần dạng ô vuông (Card Grid) ở phía dưới.
2. **Kiểm tra nghiệp vụ Đăng ký theo môn học**:
   * Thử chọn lớp `LHP_OOP_01` vào giỏ hàng.
   * Xác nhận lớp `LHP_OOP_02` của môn OOP bị vô hiệu hóa với nhãn *"Đã chọn lớp khác"*.
   * Xóa `LHP_OOP_01` khỏi giỏ hàng. Thử chọn `LHP_OOP_02` và bấm xác nhận đăng ký thành công.
   * Sau khi đăng ký thành công `LHP_OOP_02`, xác nhận rằng:
     * Trên thẻ `LHP_OOP_02` hiển thị badge "Đã Đăng Ký" kèm nút "Hủy học phần".
     * Trên thẻ `LHP_OOP_01` bị khóa nút chọn và hiển thị trạng thái "Đã đăng ký lớp khác".
     * Sinh viên không thể chọn lớp `LHP_OOP_01` trừ khi bấm "Hủy học phần" của lớp `LHP_OOP_02` trước.
