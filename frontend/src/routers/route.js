import HomePage from '~/pages/HomePage';
import AboutPage from '~/pages/AboutPage';
import NotFound from '~/pages/NotFound';
import ElectricalPage from '~/pages/Electrical/ElectricalPage';
import DefaultLayout from '~/layouts/DefaultLayout';
import ElectricalProjectManagementPage from '~/pages/Electrical/ElectricalProjectManagementPage';
import ElectricalNewProductPage from '~/pages/Electrical/ElectricalProjectManagementPage/NewModel/ElectricalNewProductPage';
import EmployeeManagerPage from '~/pages/HR/Employee';
import ElectricalDailyTasksPage from '~/pages/Electrical/ElectricalDailyTasksPage';
import LoginPage from '~/pages/LoginPage';
import PrivateRoute from '~/components/PrivateRoute';
import ElectricalOrderPage from '~/pages/Electrical/ElectricalOrdersPage';
import CustomerManagerPage from '~/pages/Sale/Customer';
import DepartmentManagerPage from '~/pages/HR/Department';
import EmployeeSchedule from '~/pages/HR/EmployeeSchedule/EmployeeSchedule';
import WorkSchedule from '~/pages/HR/EmployeeSchedule/WorkSchedule';
import EmployeeShiftChange from '~/pages/HR/EmployeeSchedule/EmployeeShiftChange';
import ManagerShiftApproval from '~/pages/HR/EmployeeSchedule/ManagerShiftApproval';
import PositionManagerPage from '~/pages/HR/Position';
import Test from '~/pages/Test';

const routes = [
    {
        path: '/',
        element:
            <PrivateRoute>
                <DefaultLayout />
            </PrivateRoute>,
        children: [
            // { path: 'test', element: <Test /> },
            { path: '', element: <HomePage /> },
            // Phòng HCNS
            { path: 'HR/positions', element: <PositionManagerPage /> },
            { path: 'HR/schedules', element: <EmployeeSchedule /> },
            { path: 'HR/schedules/work-schedule', element: <WorkSchedule /> },
            { path: 'HR/3', element: <EmployeeShiftChange /> },
            { path: 'HR/4', element: <ManagerShiftApproval /> },
            { path: 'HR/employees', element: <EmployeeManagerPage /> },
            { path: 'HR/departments', element: <DepartmentManagerPage /> },

            // Phòng Sale
            { path: 'customers', element: <CustomerManagerPage /> },

            // Phòng Cơ điện
            { path: 'electrical', element: <ElectricalPage /> },
            { path: 'electrical/projects', element: <ElectricalProjectManagementPage /> },
            { path: 'electrical/projects/new-product', element: <ElectricalNewProductPage /> },
            { path: 'electrical/tasks-daily', element: <ElectricalDailyTasksPage /> },
            { path: 'electrical/orders', element: <ElectricalOrderPage /> },
            // { path: 'electrical/materials-equipment', element: <ElectricalOrderPage /> },
            { path: 'about', element: <AboutPage /> },
        ],
    },
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '*',
        element: <NotFound />,
    },
];

export default routes;
