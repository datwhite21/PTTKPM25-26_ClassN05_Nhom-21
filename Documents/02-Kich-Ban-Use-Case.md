# Tài liệu Kịch bản Đặc tả Use Case Chi tiết - Đăng ký Tín chỉ

Tài liệu này đặc tả chi tiết 3 Use Case cốt lõi của hệ thống dưới dạng bảng mẫu chuẩn công nghệ phần mềm. Mỗi kịch bản được mô tả chi tiết từ tiền điều kiện, hậu điều kiện, luồng chính (phân tách giữa hành động của tác nhân và phản hồi của hệ thống), luồng thay thế và luồng ngoại lệ.

---

## 1. Kịch bản Use Case UC-01: Đăng ký học phần

| Thành phần | Đặc tả chi tiết |
| :--- | :--- |
| **Mã số Use Case** | **UC-01** |
| **Tên Use Case** | **Đăng ký học phần** |
| **Tác nhân** | Sinh viên (Chính), Hệ thống Xác thực (Phụ) |
| **Mô tả ngắn** | Cho phép Sinh viên chọn và đăng ký vào các lớp học phần đang mở trong học kỳ hiện tại nếu thỏa mãn các điều kiện ràng buộc. |
| **Tiền điều kiện** | Sinh viên đã đăng nhập thành công vào hệ thống. Đợt đăng ký tín chỉ của học kỳ đang mở ở trạng thái hoạt động. |
| **Hậu điều kiện** | Ghi nhận đăng ký thành công của Sinh viên vào CSDL. Sĩ số lớp học phần tăng lên 1. Lịch học cá nhân của Sinh viên được cập nhật. |

### Luồng sự kiện chính (Basic Flow):

| Bước | Hành động của Tác nhân (Sinh viên) | Phản hồi của Hệ thống |
| :---: | :--- | :--- |
| **1** | Sinh viên nhấn chọn chức năng "Đăng ký học phần" trên thanh điều hướng. | Hệ thống hiển thị giao diện Đăng ký học phần bao gồm: Lịch học tạm thời (Thời khóa biểu dạng lưới), Ô tìm kiếm môn học và Giỏ đăng ký môn học tạm thời. |
| **2** | Sinh viên nhập mã môn học hoặc tên môn học cần đăng ký vào ô tìm kiếm và nhấn nút "Tìm kiếm". | Hệ thống lọc và hiển thị danh sách các lớp học phần đang mở của môn học đó bao gồm các cột thông tin: Mã lớp HP, Tên lớp HP, Giảng viên, Lịch học (Thứ, Tiết), Sĩ số (Hiện tại/Tối đa), Phòng học, và Nút chọn. |
| **3** | Sinh viên nhấn nút "Chọn" trên dòng lớp học phần mong muốn để đăng ký. | Hệ thống tiếp nhận yêu cầu và tiến hành kiểm tra các quy tắc nghiệp vụ tự động: <br>a. Kiểm tra điều kiện môn tiên quyết.<br>b. Kiểm tra trùng lịch học với các lớp đã đăng ký.<br>c. Kiểm tra giới hạn tối đa tín chỉ trong học kỳ.<br>d. Kiểm tra sĩ số lớp học phần. |
| **4** | | Hệ thống xác định các điều kiện kiểm tra đều hợp lệ, thêm lớp học phần vào "Giỏ đăng ký tạm thời" và hiển thị lớp đó trên lưới lịch học tuần dưới dạng xem trước (màu vàng nhạt). |
| **5** | Sinh viên kiểm tra lại danh sách môn học trong giỏ tạm và nhấn nút "Xác nhận đăng ký". | Hệ thống bắt đầu thực hiện transaction an toàn:<br>a. Khóa dòng dữ liệu lớp học phần để đảm bảo tính đồng thời.<br>b. Tăng sĩ số hiện tại của lớp thêm 1 đơn vị.<br>c. Tạo bản ghi đăng ký mới với trạng thái "Thành công". |
| **6** | | Hệ thống ghi nhận dữ liệu xuống MySQL thành công, hiển thị thông báo "Đăng ký học phần thành công!" bằng Tiếng Việt và chuyển trạng thái lớp trên lịch học tuần sang màu xanh lá cây chính thức. |

### Luồng thay thế (Alternative Flows):

- **Luồng thay thế A1: Chọn đăng ký từ danh sách môn học đề xuất gợi ý**
  - Tại bước 2: Sinh viên không dùng ô tìm kiếm mà nhấn vào danh sách "Môn học đề xuất theo chương trình đào tạo".
  - Hệ thống tự động liệt kê các lớp học phần của các môn học được đề xuất cho học kỳ hiện tại.
  - Các bước tiếp theo từ 3 đến 6 diễn ra tương tự luồng chính.

### Luồng ngoại lệ (Exception Flows):

- **Luồng ngoại lệ E1: Sinh viên chưa hoàn thành môn học tiên quyết**
  - Tại bước 3: Hệ thống kiểm tra CSDL và phát hiện Sinh viên chưa đạt điểm môn tiên quyết của môn này.
  - Hệ thống từ chối thêm vào giỏ tạm, hiển thị cảnh báo đỏ: "Lỗi: Môn học này yêu cầu bạn phải hoàn thành môn tiên quyết [Tên môn tiên quyết] trước!".
  - Kết thúc Use Case.
- **Luồng ngoại lệ E2: Trùng lịch học với lớp đã đăng ký thành công**
  - Tại bước 3: Hệ thống phát hiện lịch học của lớp mới bị trùng Thứ và khoảng Tiết học với lớp học phần đã đăng ký trước đó.
  - Hệ thống từ chối, hiển thị thông báo lỗi: "Lỗi: Trùng lịch học với lớp [Mã lớp HP] đã đăng ký (Thứ X, Tiết Y-Z)".
  - Kết thúc Use Case.
- **Luồng ngoại lệ E3: Lớp học phần đã hết chỗ (Sĩ số hiện tại = Sĩ số tối đa)**
  - Tại bước 5: Trong quá trình xử lý transaction, hệ thống phát hiện sĩ số đã đầy do có sinh viên khác vừa xác nhận trước.
  - Hệ thống tự động rollback (hoàn tác), từ chối lưu bản ghi và hiển thị thông báo: "Lỗi: Lớp học phần đã hết chỗ trống. Vui lòng chọn lớp học phần khác!".
  - Kết thúc Use Case.

---

## 2. Kịch bản Use Case UC-02: Mở lớp học phần

| Thành phần | Đặc tả chi tiết |
| :--- | :--- |
| **Mã số Use Case** | **UC-02** |
| **Tên Use Case** | **Mở lớp học phần** |
| **Tác nhân** | Giáo vụ (Chính) |
| **Mô tả ngắn** | Cho phép Giáo vụ thiết lập thông tin và mở một lớp học phần mới cho học kỳ, phục vụ cho đợt đăng ký môn học của sinh viên. |
| **Tiền điều kiện** | Giáo vụ đã đăng nhập thành công vào hệ thống. Danh mục môn học và danh sách giảng viên đã được nhập đầy đủ trên hệ thống. |
| **Hậu điều kiện** | Lớp học phần mới được tạo lập trong CSDL ở trạng thái hoạt động, sẵn sàng cho sinh viên tìm kiếm và đăng ký. |

### Luồng sự kiện chính (Basic Flow):

| Bước | Hành động của Tác nhân (Giáo vụ) | Phản hồi của Hệ thống |
| :---: | :--- | :--- |
| **1** | Giáo vụ truy cập vào giao diện quản lý lớp học phần và nhấn nút "Thêm lớp học phần mới". | Hệ thống hiển thị biểu mẫu (form) nhập thông tin lớp học phần bao gồm: Chọn Môn học (Dropdown), Chọn Giảng viên (Dropdown), Nhập Sĩ số tối đa (Input số), Chọn đợt đăng ký, Thiết lập Lịch học (Thứ, Tiết bắt đầu, Tiết kết thúc, Phòng học). |
| **2** | Giáo vụ lựa chọn môn học, giảng viên phụ trách và nhập sĩ số tối đa của lớp học. | Hệ thống ghi nhận thông tin đã chọn. |
| **3** | Giáo vụ nhập chi tiết lịch học của lớp học phần (Ví dụ: Thứ 2, Tiết 1-3, Phòng A201) và nhấn nút "Lưu". | Hệ thống thực hiện các bước kiểm tra nghiệp vụ chéo:<br>a. Kiểm tra Giảng viên được phân công có bị trùng lịch dạy lớp khác không.<br>b. Kiểm tra Phòng học được chọn có bị trùng lịch sử dụng vào thời gian đó không. |
| **4** | | Hệ thống xác định không có bất kỳ sự trùng lặp nào, tiến hành tạo bản ghi lớp học phần mới trong CSDL với sĩ số hiện tại = 0 và trạng thái hoạt động. |
| **5** | | Hệ thống hiển thị thông báo thành công: "Mở lớp học phần [Mã lớp HP] thành công!". |

### Luồng ngoại lệ (Exception Flows):

- **Luồng ngoại lệ E1: Giảng viên được phân công bị trùng lịch dạy**
  - Tại bước 3: Hệ thống phát hiện giảng viên được chọn đã có lịch giảng dạy một lớp học phần khác vào cùng Thứ và Tiết học đó.
  - Hệ thống hiển thị thông báo lỗi: "Lỗi: Giảng viên [Tên giảng viên] đã bận dạy lớp [Mã lớp] vào thời gian này. Vui lòng chọn lịch học khác hoặc phân công giảng viên khác!".
  - Lớp học phần không được tạo. Kết thúc Use Case.
- **Luồng ngoại lệ E2: Phòng học bị trùng lịch sử dụng**
  - Tại bước 3: Hệ thống phát hiện phòng học được chọn đã được phân bổ cho một lớp học phần khác học cùng thời điểm.
  - Hệ thống hiển thị thông báo lỗi: "Lỗi: Phòng học [Tên phòng] đã được đăng ký sử dụng bởi lớp [Mã lớp]. Vui lòng chọn phòng học khác!".
  - Lớp học phần không được tạo. Kết thúc Use Case.

---

## 3. Kịch bản Use Case UC-03: Nhập điểm học phần

| Thành phần | Đặc tả chi tiết |
| :--- | :--- |
| **Mã số Use Case** | **UC-03** |
| **Tên Use Case** | **Nhập điểm học phần** |
| **Tác nhân** | Giảng viên (Chính) |
| **Mô tả ngắn** | Cho phép Giảng viên nhập và lưu điểm số các cột điểm thành phần của tất cả sinh viên thuộc lớp học phần do mình phụ trách. |
| **Tiền điều kiện** | Giảng viên đăng nhập thành công. Học kỳ đã kết thúc, Giáo vụ đã mở đợt nhập điểm trên hệ thống. |
| **Hậu điều kiện** | Điểm số của sinh viên được cập nhật vào CSDL. Điểm tổng kết và trạng thái Đạt/Không đạt được tự động tính toán và lưu trữ. |

### Luồng sự kiện chính (Basic Flow):

| Bước | Hành động của Tác nhân (Giảng viên) | Phản hồi của Hệ thống |
| :---: | :--- | :--- |
| **1** | Giảng viên chọn chức năng "Lớp học phần phụ trách" trên bảng điều khiển giảng dạy. | Hệ thống hiển thị danh sách các lớp học phần mà Giảng viên được phân công phụ trách giảng dạy trong học kỳ hiện tại. |
| **2** | Giảng viên chọn lớp học phần cụ thể cần nhập điểm và nhấn nút "Nhập điểm". | Hệ thống hiển thị danh sách toàn bộ sinh viên trong lớp học phần dưới dạng bảng lưới bao gồm các cột: STT, Mã số sinh viên, Họ và tên, Điểm chuyên cần (10%), Điểm kiểm tra (30%), Điểm thi (60%), và Điểm tổng kết (Read-only). |
| **3** | Giảng viên thực hiện nhập điểm số hệ 10 cho từng sinh viên (nhập trực tiếp vào các ô input). | Hệ thống tạm lưu giá trị nhập vào trên giao diện. |
| **4** | Giảng viên sau khi nhập xong bảng điểm nhấn nút "Tính điểm tổng kết & Lưu". | Hệ thống tiến hành xác thực dữ liệu điểm nhập vào (phải là số thực từ 0 đến 10) và tự động tính toán Điểm tổng kết theo công thức trọng số. |
| **5** | | Hệ thống ghi nhận toàn bộ bảng điểm của lớp xuống CSDL MySQL, đồng thời cập nhật trạng thái Đạt (nếu điểm tổng kết >= 4.0) hoặc Không Đạt (nếu < 4.0). |
| **6** | | Hệ thống thông báo thành công: "Lưu bảng điểm lớp học phần thành công!". |

### Luồng ngoại lệ (Exception Flows):

- **Luồng ngoại lệ E1: Điểm số nhập vào không đúng định dạng hoặc vượt quá khoảng cho phép**
  - Tại bước 4: Hệ thống phát hiện có ô nhập điểm chứa ký tự chữ, hoặc điểm số nhỏ hơn 0, hoặc điểm số lớn hơn 10.
  - Hệ thống tự động khoanh đỏ các ô nhập sai, từ chối lưu và hiển thị cảnh báo: "Lỗi: Điểm số nhập vào phải là số thực nằm trong khoảng từ 0.0 đến 10.0!".
  - Bảng điểm không được cập nhật xuống database. Kết thúc Use Case.
- **Luồng ngoại lệ E2: Hết thời hạn nhập điểm học phần**
  - Tại bước 2: Hệ thống nhận thấy thời gian cấu hình cho đợt nhập điểm của lớp học phần này đã kết thúc (Giáo vụ đã khóa quyền nhập điểm).
  - Hệ thống tự động chuyển tất cả các ô nhập điểm thành trạng thái chỉ đọc (Read-only), vô hiệu hóa nút "Lưu" và hiển thị thông báo: "Cảnh báo: Đợt nhập điểm của lớp học phần này đã đóng. Bạn chỉ có quyền xem bảng điểm!".
  - Kết thúc Use Case.
