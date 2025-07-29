import React, { useEffect } from 'react';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import AppRoutes from './routers';
import { ThemeProvider } from './contexts/ThemeContext';
import './App.css';
import { message } from 'antd'; // Import message component từ Ant Design

const App = () => {
    // Biến cờ để ngăn chặn việc kích hoạt đăng xuất nhiều lần
    // khi cả sự kiện storage và lỗi 401 đều xảy ra gần nhau.
    // Có thể cân nhắc đưa biến này vào một context hoặc state management nếu cần quản lý phức tạp hơn.
    let isLoggingOut = false;

    useEffect(() => {
        const handleStorageChange = (event) => {
            // Kiểm tra xem key 'accessToken' có bị thay đổi và hiện tại không còn giá trị (null/undefined)
            if (event.key === 'accessToken' && !localStorage.getItem('accessToken')) {
                // Ngăn chặn việc gọi đăng xuất nhiều lần
                if (isLoggingOut) {
                    return;
                }
                isLoggingOut = true;

                message.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');

                setTimeout(() => {
                    // authService.logout(); // GỌI HÀM ĐĂNG XUẤT TẠI ĐÂY
                    if (window.location.pathname !== '/login') {
                        window.location.href = '/login';
                    }
                    isLoggingOut = false; // Đặt lại cờ sau khi hoàn tất
                }, 3000); // 3000 milliseconds = 3 giây
            }
        };

        // Thêm trình lắng nghe sự kiện storage
        window.addEventListener('storage', handleStorageChange);

        // Cleanup function: Gỡ bỏ trình lắng nghe khi component unmount
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []); // Mảng dependency rỗng đảm bảo useEffect chỉ chạy một lần khi component mount

    return (
        <BrowserRouter>
            <ThemeProvider>
                <AppRoutes />
            </ThemeProvider>
        </BrowserRouter>
    );
};

export default App;
