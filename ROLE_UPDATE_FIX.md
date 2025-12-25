# Sửa lỗi thay đổi vai trò người dùng chỉ thay đổi ở giao diện

## Vấn đề
Khi admin thay đổi vai trò người dùng trong hệ thống, thay đổi này chỉ được hiển thị ở giao diện mà không được lưu vào database. Khi load lại trang, vai trò trở về trạng thái ban đầu.

## Nguyên nhân
1. **API endpoint `/api/user/[userId]` không xử lý trường `role`** - khi admin thay đổi vai trò, API chỉ cập nhật các trường khác nhưng bỏ qua `role`
2. **Thiếu cơ chế cập nhật real-time** - không có cơ chế để cập nhật vai trò ngay lập tức khi có thay đổi
3. **State local không đồng bộ với database** - vai trò chỉ được cập nhật khi `fetchUserData()` được gọi

## Giải pháp đã áp dụng

### 1. Cập nhật API endpoint
- **File**: `pages/api/user/[userId].js`
- **Thay đổi**: Thêm trường `role` vào method PUT để có thể cập nhật vai trò người dùng
- **Code**:
```javascript
const { name, phone, email, image, gender, dateOfBirth, role } = req.body;

// Tạo object cập nhật với các trường có sẵn
const updateFields = {};
if (name !== undefined) updateFields.name = name;
if (phone !== undefined) updateFields.phone = phone;
if (email !== undefined) updateFields.email = email;
if (image !== undefined) updateFields.image = image;
if (gender !== undefined) updateFields.gender = gender;
if (dateOfBirth !== undefined) updateFields.dateOfBirth = dateOfBirth;
if (role !== undefined) updateFields.role = role;
```

### 2. Cập nhật trang tài khoản
- **File**: `pages/tai-khoan/index.js`
- **Thay đổi**: 
  - Thêm function `updateUserRole()` để cập nhật vai trò
  - Thêm function `checkAndUpdateRole()` để kiểm tra vai trò từ database
  - Thêm useEffect để kiểm tra vai trò định kỳ và khi chuyển tab
- **Code**:
```javascript
// Function để cập nhật vai trò người dùng
const updateUserRole = async (newRole) => {
  if (!session || !session.user.id) return;
  try {
    const res = await axios.put(`/api/user/${session.user.id}`, { role: newRole });
    setUserRole(newRole);
    toast.success("Cập nhật vai trò thành công!");
    return res.data;
  } catch (error) {
    console.error("Error updating user role:", error);
    toast.error("Có lỗi khi cập nhật vai trò!");
    return null;
  }
};

// Kiểm tra vai trò định kỳ mỗi 30 giây
useEffect(() => {
  if (session && session.user) {
    const interval = setInterval(checkAndUpdateRole, 30000);
    return () => clearInterval(interval);
  }
}, [session, userRole]);
```

### 3. Cập nhật component AllUsersList
- **File**: `components/users/AllUsersList.jsx`
- **Thay đổi**:
  - Nhận props `onRoleUpdate` và `currentUserId` từ parent
  - Thêm state `currentUserRole` để theo dõi vai trò hiện tại
  - Thêm function `refreshCurrentUserRole()` để cập nhật vai trò real-time
  - Thêm interval để kiểm tra vai trò định kỳ mỗi 15 giây
  - Hiển thị thông báo khi có thay đổi vai trò
- **Code**:
```javascript
// Function để refresh vai trò ngay lập tức
const refreshCurrentUserRole = useCallback(async () => {
  if (!currentUserId) return;
  
  try {
    const response = await axios.get(`/api/user/${currentUserId}`);
    const currentUser = response.data;
    
    if (currentUser.role !== currentUserRole) {
      const oldRole = currentUserRole;
      setCurrentUserRole(currentUser.role);
      
      // Hiển thị thông báo thay đổi vai trò
      setRoleChangeNotification({
        oldRole,
        newRole: currentUser.role,
        timestamp: new Date()
      });
      
      if (onRoleUpdate) {
        onRoleUpdate(currentUser.role);
      }
    }
  } catch (error) {
    console.error('Error refreshing current user role:', error);
  }
}, [currentUserId, currentUserRole, onRoleUpdate]);

// Kiểm tra vai trò định kỳ mỗi 15 giây
useEffect(() => {
  if (isAdmin && currentUserId) {
    const interval = setInterval(refreshCurrentUserRole, 15000);
    return () => clearInterval(interval);
  }
}, [isAdmin, currentUserId, refreshCurrentUserRole]);
```

### 4. Cập nhật API check-admin
- **File**: `pages/api/user/check-admin.js`
- **Thay đổi**: Trả về `currentUserId` để component có thể theo dõi vai trò của người dùng hiện tại
- **Code**:
```javascript
return res.status(200).json({ 
  isAdmin,
  role: user.role,
  currentUserId: session.user.id
});
```

## Cách hoạt động

### Khi admin thay đổi vai trò người dùng:
1. Admin chọn người dùng và thay đổi vai trò trong component `AllUsersList`
2. Component gọi API `PUT /api/user/[userId]` với trường `role` mới
3. API cập nhật database với vai trò mới
4. Component cập nhật state local và hiển thị thông báo thành công

### Khi có thay đổi vai trò từ admin khác:
1. Component `AllUsersList` kiểm tra vai trò định kỳ mỗi 15 giây
2. Nếu phát hiện thay đổi, component cập nhật state và gọi `onRoleUpdate()`
3. Parent component (`tai-khoan/index.js`) nhận được callback và cập nhật `userRole`
4. UI được cập nhật ngay lập tức để phản ánh vai trò mới

### Khi load lại trang:
1. Component `fetchUserData()` được gọi để lấy thông tin từ database
2. Vai trò được cập nhật từ database thay vì từ state local
3. UI hiển thị vai trò chính xác từ database

## Lợi ích

1. **Đồng bộ real-time**: Vai trò được cập nhật ngay lập tức khi có thay đổi
2. **Lưu trữ database**: Thay đổi vai trò được lưu vào database và không bị mất khi load lại trang
3. **Thông báo rõ ràng**: Người dùng được thông báo khi vai trò thay đổi
4. **Kiểm tra định kỳ**: Hệ thống tự động kiểm tra và cập nhật vai trò
5. **Xử lý lỗi**: Có cơ chế xử lý lỗi và hiển thị thông báo phù hợp

## Kiểm tra

Để kiểm tra xem sửa lỗi có hoạt động không:

1. **Đăng nhập với tài khoản admin**
2. **Vào trang "Tất cả người dùng"**
3. **Thay đổi vai trò của một người dùng**
4. **Kiểm tra xem thay đổi có được lưu vào database không**
5. **Load lại trang và kiểm tra xem vai trò có được giữ nguyên không**
6. **Đăng nhập với tài khoản khác và thay đổi vai trò của tài khoản admin**
7. **Kiểm tra xem admin có nhận được thông báo thay đổi vai trò không**

## Lưu ý

- Interval kiểm tra vai trò được set là 15 giây để tránh quá tải server
- Thông báo thay đổi vai trò tự động ẩn sau 5 giây
- Có cơ chế cleanup để tránh memory leak khi component unmount
- Sử dụng `useCallback` để tối ưu performance và tránh re-render không cần thiết
