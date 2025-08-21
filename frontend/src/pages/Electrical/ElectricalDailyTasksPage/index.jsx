import React from 'react';
import AdminView from './AdminView';
import ManagerView from './ManagerView';
import EmployeeView from './EmployeeView';

const ElectricalDailyTasksPage = () => {
    const role = localStorage.getItem('role');

    if (role === 'ROLE_ADMIN') return <AdminView />;
    if (role === 'ROLE_MANAGER') return <ManagerView />;
    if (role === 'ROLE_EMPLOYEE') return <EmployeeView />;

    return <div>Bạn không có quyền truy cập</div>;
};

export default ElectricalDailyTasksPage;
