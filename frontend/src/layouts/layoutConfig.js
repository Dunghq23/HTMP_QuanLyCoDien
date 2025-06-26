import {
    HomeOutlined,
    UserOutlined,
    ToolOutlined,
    FileOutlined,
    LogoutOutlined,
} from '@ant-design/icons';
import authService from '~/services/authService';

export const breadcrumbMap = {
    '/': 'Trang chủ',
    '/quan-ly-nhan-vien': 'Quản lý nhân viên',
    '/co-dien': 'Phòng cơ điện',
    '/co-dien/quan-ly-du-an': 'Quản lý dự án',
    '/co-dien/quan-ly-cong-viec-hang-ngay': 'Công việc hàng ngày',
    '/co-dien/quan-ly-thiet-bi': 'Thiết bị',
    '/co-dien/quan-ly-nhom-thiet-bi': 'Nhóm thiết bị',
};

export const getMenuItems = (navigate) => {
    const role = localStorage.getItem('role');

    return [
        {
            key: '/',
            icon: <HomeOutlined />,
            label: 'Trang chủ',
            onClick: () => navigate('/'),
        },
        ...(role !== 'ROLE_EMPLOYEE'
            ? [{
                key: '/quan-ly-nhan-vien',
                icon: <UserOutlined />,
                label: 'Quản lý nhân viên',
                onClick: () => navigate('/quan-ly-nhan-vien'),
            }]
            : []),
        {
            key: '/co-dien',
            icon: <ToolOutlined />,
            label: 'Phòng Cơ điện',
            children: [
                {
                    key: '/co-dien/quan-ly-du-an',
                    label: 'Quản lý dự án',
                    onClick: () => navigate('/co-dien/quan-ly-du-an'),
                },
                {
                    key: '/co-dien/quan-ly-cong-viec-hang-ngay',
                    label: 'Công việc hàng ngày',
                    onClick: () => navigate('/co-dien/quan-ly-cong-viec-hang-ngay'),
                },
                {
                    key: '/co-dien/quan-ly-thiet-bi',
                    label: 'Thiết bị',
                    onClick: () => navigate('/co-dien/quan-ly-thiet-bi'),
                },
                {
                    key: '/co-dien/quan-ly-don-dat-hang',
                    label: 'Đơn đặt hàng',
                    onClick: () => navigate('/co-dien/quan-ly-nhom-thiet-bi'),
                },
            ],
        },
        {
            key: '/other',
            icon: <FileOutlined />,
            label: 'Tài liệu khác',
        },
        {
            key: '/logout',
            icon: <LogoutOutlined />,
            label: 'Đăng xuất',
            onClick: () => {
                authService.logout();
                window.location.href = '/login';
            },
        },
    ];
};
