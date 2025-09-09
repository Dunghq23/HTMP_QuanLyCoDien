import React from 'react';
import AdminView from './AdminView';
import ManagerView from './ManagerView';
import EmployeeView from './EmployeeView';

const ElectricalDailyTasksPage = () => {
    const role = localStorage.getItem('role');

    if (role === 'ADMIN') return <AdminView />;
    if (role === 'MANAGER' || role === 'HEAD') return <ManagerView />;
    if (role === 'EMPLOYEE') return <EmployeeView />;

    return <div>Bạn không có quyền truy cập</div>;
};

export default ElectricalDailyTasksPage;
