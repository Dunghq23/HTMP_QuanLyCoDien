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
    TeamOutlined,
    FieldTimeOutlined,
} from '@ant-design/icons';

export const breadcrumbMap = {
    '/': 'Trang chủ',
    '/HR': 'Phòng HCNS',
    '/HR/employees': 'Quản lý nhân viên',
    '/HR/departments': 'Quản lý phòng ban',
    '/HR/positions': 'Quản lý chức vụ',
    '/HR/schedules': 'Quản lý lịch làm việc nhân viên',
    '/HR/schedules/work-schedule': 'Xếp lịch nhân viên',
    '/customers': 'Quản lý khách hàng',
    '/electrical': 'Phòng cơ điện',
    '/electrical/projects': 'Quản lý dự án',
    '/electrical/tasks-daily': 'Công việc hàng ngày',
    '/electrical/materials-equipment': 'Vật tư & Thiết bị',
    '/electrical/orders': 'Đơn đặt hàng',
    '/electrical/projects/new-product': 'Sản phẩm mới',
    '/other': 'Tài liệu khác',
    '/logout': 'Đăng xuất',
};

export const getMenuItems = (navigate) => {
    const role = localStorage.getItem('role');
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();

    // ====== Children của HR ======
    const hrChildren = [];
    if (role !== 'EMPLOYEE') {
        hrChildren.push({
            key: '/HR/employees',
            icon: <UserOutlined />,
            label: 'Quản lý nhân viên',
            onClick: () => navigate('/HR/employees'),
        });
    }
    if (role === 'ADMIN' || role === 'MANAGER') {
        hrChildren.push(
            {
                key: '/HR/departments',
                icon: <TeamOutlined />,
                label: 'Quản lý phòng ban',
                onClick: () => navigate('/HR/departments'),
            },
            {
                key: '/HR/positions',
                icon: <TeamOutlined />,
                label: 'Quản lý chức vụ',
                onClick: () => navigate('/HR/positions'),
            },
            {
                key: '/HR/schedules',
                icon: <FieldTimeOutlined />,
                label: 'Quản lý lịch làm việc',
                onClick: () => navigate('/HR/schedules'),
            },
            {
                key: '/HR/schedules/work-schedule',
                icon: <FieldTimeOutlined />,
                label: 'Xếp lịch nhân viên',
                onClick: () => navigate(`/HR/schedules/work-schedule?month=${month}&year=${year}`),
            }
        );
    }

    // ====== Children của Electrical ======
    const electricalChildren = [
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
    ];

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
            label: 'Phòng HCNS',
            children: hrChildren,
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
            children: electricalChildren,
        },
        {
            key: '/other',
            icon: <FileOutlined />,
            label: 'Tài liệu khác',
        },
    ];
};
