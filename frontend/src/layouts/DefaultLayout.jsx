// DefaultLayout.jsx
import React, { useState } from 'react';
import { Layout, Typography, ConfigProvider } from 'antd';
import { Outlet, useLocation } from 'react-router-dom';
import { useTheme } from '~/contexts/ThemeContext';
import SidebarMenu from './SidebarMenu';
import HeaderBar from './HeaderBar';
import { useDynamicTitle } from '~/hook/useDynamicTitle';

const { Content, Footer } = Layout;
const { Text } = Typography;

const DefaultLayout = () => {
  // Hook
  useDynamicTitle();

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
