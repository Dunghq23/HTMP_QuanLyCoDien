// // DefaultLayout.jsx
// import React, { useState } from 'react';
// import {
//   Layout, Menu, Switch, Typography, ConfigProvider,
// } from 'antd';
// import {
//   HomeOutlined, UserOutlined, ToolOutlined,
//   FileOutlined, LogoutOutlined,
// } from '@ant-design/icons';
// import { Outlet, useLocation, useNavigate } from 'react-router-dom';
// import { useTheme } from '~/contexts/ThemeContext';
// import authService from '~/services/authService';
// import { breadcrumbMap, getMenuItems } from './layoutConfig';
// import SidebarMenu from './SidebarMenu';
// import HeaderBar from './HeaderBar';


// const { Header, Content, Footer, Sider } = Layout;
// const { Text } = Typography;

// const DefaultLayout = () => {
//   const [collapsed, setCollapsed] = useState(false);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { isDarkMode, toggleTheme, themeAlgorithm } = useTheme();

//   const pathnames = location.pathname.split('/').filter(Boolean);
//   const breadcrumbItems = pathnames.map((_, idx) => {
//     const url = '/' + pathnames.slice(0, idx + 1).join('/');
//     return breadcrumbMap[url] || url;
//   });

//   const theme = isDarkMode ? 'dark' : 'light';
//   const backgroundColor = isDarkMode ? '#001529' : '#fff';
//   const textColor = isDarkMode ? '#fff' : '#000';
//   const subTextColor = isDarkMode ? '#ccc' : '#666';
//   const contentBg = isDarkMode ? '#141414' : '#fff';

//   const employeeName = localStorage.getItem('employeeName') || 'Chưa đăng nhập';
//   const role = (localStorage.getItem('role') || '').replace('ROLE_', '');

//   return (
//     <ConfigProvider theme={{ algorithm: themeAlgorithm }}>
//       <Layout style={{ minHeight: '100vh', background: backgroundColor }}>
//         <Sider
//           width={200}
//           collapsible
//           collapsed={collapsed}
//           onCollapse={setCollapsed}
//           theme={theme}
//           style={{ position: 'fixed', height: '100vh', zIndex: 1000 }}
//         >
//           <div style={{ padding: 16, textAlign: 'center' }}>
//             <img
//               src="/image/logo.webp"
//               alt="Logo"
//               style={{ width: collapsed ? '40%' : '60%', maxHeight: 80 }}
//             />
//             {!collapsed && (
//               <Text strong style={{ color: textColor, fontSize: 20, marginTop: 8, display: 'block' }}>
//                 PHÒNG CƠ ĐIỆN
//               </Text>
//             )}
//           </div>

//           <Menu
//             mode="inline"
//             theme={theme}
//             selectedKeys={[location.pathname]}
//             items={getMenuItems(navigate)}
//           />

//           <div style={{ padding: 16, textAlign: 'center' }}>
//             <Switch checked={isDarkMode} onChange={toggleTheme} />
//             <Text style={{ marginLeft: 8, color: subTextColor }}>Dark Mode</Text>
//           </div>
//         </Sider>

//         <Layout style={{ marginLeft: collapsed ? 80 : 200 }}>
//           <Header
//             style={{
//               position: 'fixed',
//               top: 0,
//               left: collapsed ? 80 : 200,
//               right: 0,
//               height: 64,
//               padding: '0 24px',
//               display: 'flex',
//               justifyContent: 'space-between',
//               alignItems: 'center',
//               background: backgroundColor,
//               color: textColor,
//               boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
//               zIndex: 100,
//             }}
//           >
//             <Text strong style={{ fontSize: 16 }}>{breadcrumbItems.join(' / ') || 'Trang chủ'}</Text>
//             <div style={{ display: 'flex', gap: 12 }}>
//               <Text>{employeeName}</Text>
//               <Text type="secondary" style={{ color: subTextColor }}>{role}</Text>
//             </div>
//           </Header>

//           <Content style={{ marginTop: 64, padding: 24 }}>
//             <div
//               style={{
//                 minHeight: 'calc(100vh - 180px)',
//                 background: contentBg,
//                 color: textColor,
//                 borderRadius: 8,
//                 padding: 24,
//               }}
//             >
//               <Outlet />
//             </div>
//           </Content>

//           <Footer style={{ textAlign: 'center', color: subTextColor }}>
//             © {new Date().getFullYear()} H.Q. Dung Solutions — All rights reserved.
//           </Footer>
//         </Layout>
//       </Layout>
//     </ConfigProvider>
//   );
// };

// export default DefaultLayout;


// DefaultLayout.jsx
import React, { useState } from 'react';
import { Layout, Typography, ConfigProvider } from 'antd';
import { Outlet, useLocation } from 'react-router-dom';
import { useTheme } from '~/contexts/ThemeContext';
import SidebarMenu from './SidebarMenu';
import HeaderBar from './HeaderBar';

const { Content, Footer } = Layout;
const { Text } = Typography;

const DefaultLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { isDarkMode, toggleTheme, themeAlgorithm } = useTheme();

  const theme = isDarkMode ? 'dark' : 'light';
  const backgroundColor = isDarkMode ? '#001529' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#000';
  const subTextColor = isDarkMode ? '#ccc' : '#666';
  const contentBg = isDarkMode ? '#141414' : '#fff';

  return (
    <ConfigProvider theme={{ algorithm: themeAlgorithm }}>
      <Layout style={{ minHeight: '100vh', background: backgroundColor }}>
        {/* Sidebar đã tách riêng */}
        <Layout.Sider
          width={200}
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          theme={theme}
          style={{
            position: 'fixed',
            top: 0,
            bottom: 0,
            height: '100vh',
            zIndex: 1000,
          }}
        >
          <SidebarMenu
            collapsed={collapsed}
            isDarkMode={isDarkMode}

          />
        </Layout.Sider>

        <Layout style={{ marginLeft: collapsed ? 80 : 200 }}>
          {/* Header đã tách riêng */}
          <HeaderBar
            collapsed={collapsed}
            backgroundColor={backgroundColor}
            textColor={textColor}
            subTextColor={subTextColor}
            isDarkMode={isDarkMode}
            toggleTheme={toggleTheme}

          />

          <Content style={{ marginTop: 64, padding: 24 }}>
            <div
              style={{
                minHeight: 'calc(100vh - 180px)',
                background: contentBg,
                color: textColor,
                borderRadius: 8,
                padding: 24,
              }}
            >
              <Outlet />
            </div>
          </Content>

          <Footer style={{ textAlign: 'center', color: subTextColor }}>
            © {new Date().getFullYear()} H.Q. Dung Solutions — All rights reserved.
          </Footer>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default DefaultLayout;
