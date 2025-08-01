import {
    HomeOutlined,
    UserOutlined,
    ToolOutlined,
    FileOutlined,
    ShoppingCartOutlined,
    ProjectOutlined,
    OrderedListOutlined,
    WalletOutlined,
    UsergroupAddOutlined,
} from '@ant-design/icons';

export const breadcrumbMap = {
    '/': 'Trang chủ',
    '/employees': 'Quản lý nhân viên',
    '/customers': 'Quản lý khách hàng',
    '/electrical': 'Phòng cơ điện',
    '/electrical/projects': 'Quản lý dự án',
    '/electrical/tasks-daily': 'Công việc hàng ngày',
    '/electrical/materials-equipment': 'Vật tư & Thiết bị',
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
        {
            key: '/HR',
            icon: <UserOutlined />,
            label: "Phòng HCNS",
            children: [

                ...(role !== 'ROLE_EMPLOYEE'
                    ? [{
                        key: '/employees',
                        icon: <UserOutlined />,
                        label: 'Quản lý nhân viên',
                        onClick: () => navigate('/employees'),
                    }]
                    : []),

            ]
        },

        {
            key: '/customers',
            icon: <UsergroupAddOutlined />,
            label: 'Quản lý khách hàng',
            onClick: () => navigate('/customers'),
        },

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
                    key: '/electrical/materials-equipment',
                    label: 'Vật tư & Thiết bị',
                    icon: <WalletOutlined />,
                    onClick: () => navigate('/electrical/materials-equipment'),
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
    ];
};
