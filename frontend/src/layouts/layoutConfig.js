import {
    HomeOutlined,
    UserOutlined,
    ToolOutlined,
    FileOutlined,
    LogoutOutlined,
    ShoppingCartOutlined,
    ProjectOutlined,
    OrderedListOutlined,
    WalletOutlined,
} from '@ant-design/icons';
import authService from '~/services/authService';

export const breadcrumbMap = {
    '/': 'Trang chủ',
    '/employees': 'Quản lý nhân viên',
    '/electrical': 'Phòng cơ điện',
    '/electrical/projects': 'Quản lý dự án',
    '/electrical/tasks-daily': 'Công việc hàng ngày',
    '/electrical/devices': 'Thiết bị',
    '/electrical/device-groups': 'Nhóm thiết bị',
    '/other': 'Tài liệu khác',
    '/logout': 'Đăng xuất',
    '/electrical/projects/new-product': 'Sản phẩm mới',
    '/electrical/orders': 'Đơn đặt hàng',
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
                key: '/employees',
                icon: <UserOutlined />,
                label: 'Quản lý nhân viên',
                onClick: () => navigate('/employees'),
            }]
            : []),
        {
            key: '/electrical',
            icon: <ToolOutlined />,
            label: 'Phòng Cơ điện',
            children: [
                {
                    key: '/electrical/projects',
                    label: 'Quản lý dự án',
                    icon: <ProjectOutlined />,
                    onClick: () => navigate('/electrical/projects'),
                },
                {
                    key: '/electrical/tasks-daily',
                    label: 'Công việc hàng ngày',
                    icon: <OrderedListOutlined />,
                    onClick: () => navigate('/electrical/tasks-daily'),
                },
                {
                    key: '/electrical/devices',
                    label: 'Thiết bị',
                    icon: <WalletOutlined />,
                    onClick: () => navigate('/electrical/devices'),
                },
                {
                    key: '/electrical/orders',
                    label: 'Đơn đặt hàng',
                    icon: <ShoppingCartOutlined />,
                    onClick: () => navigate('/electrical/orders'),
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
