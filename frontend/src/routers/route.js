import HomePage from '~/pages/HomePage';
import AboutPage from '~/pages/AboutPage';
import NotFound from '~/pages/NotFound';
import CoDienPage from '~/pages/PhongCoDien/CoDienPage';
import DefaultLayout from '~/layouts/DefaultLayout';
import CoDienQuanLyDuAnPage from '~/pages/PhongCoDien/CoDienQuanLyDuAnPage';
import CoDienSanPhamMoiPage from '~/pages/PhongCoDien/CoDienSanPhamMoiPage';
import EmployeeManagerPage from '~/pages/EmployeeManagerPage';
import CoDienQuanLyCongViecHangNgayPage from '~/pages/PhongCoDien/CoDienQuanLyCongViecHangNgayPage';
import LoginPage from '~/pages/LoginPage';
import PrivateRoute from '~/components/PrivateRoute';

const routes = [
  {
    path: '/',
    element:
      <PrivateRoute>
        <DefaultLayout />
      </PrivateRoute>,
    children: [
      { path: '', element: <HomePage /> },

      { path: 'quan-ly-nhan-vien', element: <EmployeeManagerPage /> },

      { path: 'co-dien', element: <CoDienPage /> },
      { path: 'co-dien/quan-ly-du-an', element: <CoDienQuanLyDuAnPage /> },
      { path: 'co-dien/quan-ly-du-an/san-pham-moi', element: <CoDienSanPhamMoiPage /> },
      { path: 'co-dien/quan-ly-cong-viec-hang-ngay', element: <CoDienQuanLyCongViecHangNgayPage /> },

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
