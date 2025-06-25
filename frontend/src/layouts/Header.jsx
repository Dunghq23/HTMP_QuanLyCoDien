// import React from 'react';
// import { useLocation } from 'react-router-dom';
// import '~/styles/Layouts/Header.css';

// const breadcrumbMap = {
//   '/': 'Trang chủ',
//   '/quan-ly-nhan-vien': 'Quản lý nhân viên',
//   '/co-dien': 'Phòng cơ điện',
//   '/co-dien/quan-ly-du-an': 'Quản lý dự án',
//   '/co-dien/quan-ly-du-an/san-pham-moi': 'Sản phẩm mới',
//   '/co-dien/quan-ly-cong-viec-hang-ngay': 'Quản lý công việc hàng ngày',
//   '/tay-ga-cat-gate': 'Tay gá, cắt gate',
//   '/san-pham-moi': 'Sản phẩm mới',
//   '/may-tu-dong': 'Máy tự động',
//   '/phat-sinh': 'Phát sinh',
// };


// const Header = () => {
//   const location = useLocation();
//   const pathnames = location.pathname.split('/').filter((x) => x);
//   const breadcrumbs = pathnames.map((_, index) => {
//     const url = '/' + pathnames.slice(0, index + 1).join('/');
//     return breadcrumbMap[url] || url;
//   });

//   return (
//     <header className="header">
//       <div className="left">
//         {breadcrumbs.length > 0 ? breadcrumbs.join(' / ') : 'Trang chủ'}
//       </div>
//       <div className="right">
//         <span>{localStorage.getItem("employeeName") || "Chưa đăng nhập"}</span>
//         <span className="role">{localStorage.getItem("role").replace("ROLE_", "")}</span>
//       </div>
//     </header>
//   );
// };

// export default Header;

// src/components/layouts/Header.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Typography } from 'antd'; // Import Button và Typography từ Ant Design
import { MenuOutlined } from '@ant-design/icons'; // Import icon hamburger
import '~/styles/Layouts/Header.css';

const { Text } = Typography; // Sử dụng Text để kiểm soát font size dễ hơn

const breadcrumbMap = {
    '/': 'Trang chủ',
    '/quan-ly-nhan-vien': 'Quản lý nhân viên',
    '/co-dien': 'Phòng cơ điện',
    '/co-dien/quan-ly-du-an': 'Quản lý dự án',
    '/co-dien/quan-ly-du-an/san-pham-moi': 'Sản phẩm mới',
    '/co-dien/quan-ly-cong-viec-hang-ngay': 'Quản lý công việc hàng ngày',
    '/tay-ga-cat-gate': 'Tay gá, cắt gate',
    '/san-pham-moi': 'Sản phẩm mới',
    '/may-tu-dong': 'Máy tự động',
    '/phat-sinh': 'Phát sinh',
};


// Nhận props onMenuClick và isMobile từ DefaultLayout
const Header = ({ onMenuClick, isMobile }) => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);
    const breadcrumbs = pathnames.map((_, index) => {
        const url = '/' + pathnames.slice(0, index + 1).join('/');
        return breadcrumbMap[url] || url;
    });

    return (
        <header className="header">
            {isMobile && ( // Chỉ hiển thị nút menu trên thiết bị di động
                <Button
                    type="text"
                    icon={<MenuOutlined style={{ fontSize: '20px' }} />} // Tăng kích thước icon
                    onClick={onMenuClick}
                    className="menu-toggle-button"
                />
            )}
            <div className="left">
                {/* Sử dụng Typography.Text để điều chỉnh font size trên mobile */}
                <Text className="header-breadcrumb">
                    {breadcrumbs.length > 0 ? breadcrumbs.join(' / ') : 'Trang chủ'}
                </Text>
            </div>
            <div className="right">
                <Text className="header-username">{localStorage.getItem("employeeName") || "Chưa đăng nhập"}</Text>
                <Text className="role">{localStorage.getItem("role").replace("ROLE_", "")}</Text>
            </div>
        </header>
    );
};

export default Header;
