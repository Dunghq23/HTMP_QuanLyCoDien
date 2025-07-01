import HomePage from '~/pages/HomePage';
import AboutPage from '~/pages/AboutPage';
import NotFound from '~/pages/NotFound';
import ElectricalPage from '~/pages/PhongCoDien/ElectricalPage';
import DefaultLayout from '~/layouts/DefaultLayout';
import ElectricalProjectManagementPage from '~/pages/PhongCoDien/ElectricalProjectManagementPage';
import ElectricalNewProductPage from '~/pages/PhongCoDien/ElectricalNewProductPage';
import EmployeeManagerPage from '~/pages/EmployeeManagerPage';
import ElectricalDailyTasksPage from '~/pages/PhongCoDien/ElectricalDailyTasksPage';
import LoginPage from '~/pages/LoginPage';
import PrivateRoute from '~/components/PrivateRoute';
import ElectricalOrderPage from '~/pages/PhongCoDien/ElectricalOrdersPage';
import CustomerManagerPage from '~/pages/CustomerManagerPage';

const routes = [
  {
    path: '/',
    element:
      <PrivateRoute>
        <DefaultLayout />
      </PrivateRoute>,
    children: [
      { path: '', element: <HomePage /> },
      { path: 'employees', element: <EmployeeManagerPage /> },
      { path: 'customers', element: <CustomerManagerPage /> },
      { path: 'electrical', element: <ElectricalPage /> },
      { path: 'electrical/projects', element: <ElectricalProjectManagementPage /> },
      { path: 'electrical/projects/new-product', element: <ElectricalNewProductPage /> },
      { path: 'electrical/tasks-daily', element: <ElectricalDailyTasksPage /> },
      { path: 'electrical/orders', element: <ElectricalOrderPage /> },
      { path: 'electrical/materials-equipment', element: <ElectricalOrderPage /> },
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
