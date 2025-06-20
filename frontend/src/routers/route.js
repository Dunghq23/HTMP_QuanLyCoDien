import HomePage from '~/pages/HomePage';
import AboutPage from '~/pages/AboutPage';
import NotFound from '~/pages/NotFound';
import CoDienPage from '~/pages/PhongCoDien/CoDienPage';
import DefaultLayout from '~/layouts/DefaultLayout';
import CoDienQuanLyDuAnPage from '~/pages/PhongCoDien/CoDienQuanLyDuAnPage';
import CoDienSanPhamMoiPage from '~/pages/PhongCoDien/CoDienSanPhamMoiPage';
import EmployeeManagerPage from '~/pages/EmployeeManagerPage';

const routes = [
  {
    path: '/',
    element: <DefaultLayout />,
    children: [
      { path: '', element: <HomePage /> },


      { path: 'quan-ly-nhan-vien', element: <EmployeeManagerPage /> },
      

      { path: 'co-dien', element: <CoDienPage /> },
      { path: 'co-dien/quan-ly-du-an', element: <CoDienQuanLyDuAnPage /> },
      { path: 'co-dien/quan-ly-du-an/san-pham-moi', element: <CoDienSanPhamMoiPage /> },

      { path: 'about', element: <AboutPage /> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export default routes;
