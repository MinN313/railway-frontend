// config.js
// ⚠️ QUAN TRỌNG: Thay URL backend Railway vào đây sau khi deploy backend
const API_URL = 'https://railway-backend-production-a8b3.up.railway.app';  // <-- THAY URL BACKEND VÀO ĐÂY

const REFRESH_INTERVAL = 5000;

const LANG = {
    vi: {
        dashboard: 'Dashboard', slots: 'Quản lý Slots', admin: 'Admin', settings: 'Cài đặt',
        logout: 'Đăng xuất', login: 'Đăng nhập', register: 'Đăng ký', email: 'Email',
        password: 'Mật khẩu', name: 'Tên', save: 'Lưu', cancel: 'Hủy', delete: 'Xóa',
        edit: 'Sửa', add: 'Thêm', totalSlots: 'Tổng Slots', cameras: 'Camera',
        controls: 'Điều khiển', charts: 'Biểu đồ', value: 'Giá trị số', status: 'Trạng thái',
        control: 'Điều khiển', camera: 'Camera', chart: 'Biểu đồ', on: 'BẬT', off: 'TẮT',
        connected: 'Đã kết nối', disconnected: 'Mất kết nối', forgotPassword: 'Quên mật khẩu?',
        noAccount: 'Chưa có tài khoản?', hasAccount: 'Đã có tài khoản?', profile: 'Hồ sơ',
        changePassword: 'Đổi mật khẩu', theme: 'Giao diện', language: 'Ngôn ngữ',
        dark: 'Tối', light: 'Sáng', oldPassword: 'Mật khẩu cũ', newPassword: 'Mật khẩu mới',
        confirmPassword: 'Xác nhận', noDevice: 'Chưa có thiết bị', addDevice: 'Thêm thiết bị',
        justNow: 'Vừa xong', minutesAgo: 'phút trước', hoursAgo: 'giờ trước'
    },
    en: {
        dashboard: 'Dashboard', slots: 'Manage Slots', admin: 'Admin', settings: 'Settings',
        logout: 'Logout', login: 'Login', register: 'Register', email: 'Email',
        password: 'Password', name: 'Name', save: 'Save', cancel: 'Cancel', delete: 'Delete',
        edit: 'Edit', add: 'Add', totalSlots: 'Total Slots', cameras: 'Cameras',
        controls: 'Controls', charts: 'Charts', value: 'Value', status: 'Status',
        control: 'Control', camera: 'Camera', chart: 'Chart', on: 'ON', off: 'OFF',
        connected: 'Connected', disconnected: 'Disconnected', forgotPassword: 'Forgot password?',
        noAccount: "Don't have account?", hasAccount: 'Have account?', profile: 'Profile',
        changePassword: 'Change Password', theme: 'Theme', language: 'Language',
        dark: 'Dark', light: 'Light', oldPassword: 'Old Password', newPassword: 'New Password',
        confirmPassword: 'Confirm', noDevice: 'No device', addDevice: 'Add device',
        justNow: 'Just now', minutesAgo: 'min ago', hoursAgo: 'hours ago'
    }
};
function t(key) { return LANG[localStorage.getItem('language') || 'vi'][key] || key; }
function updateTexts() { document.querySelectorAll('[data-lang]').forEach(el => el.textContent = t(el.dataset.lang)); }
