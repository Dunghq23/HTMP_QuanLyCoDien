// DefaultLayout.jsx
import React, { useState } from 'react';
import { Layout, Typography, ConfigProvider } from 'antd';
import { Outlet, useLocation } from 'react-router-dom';
import { useTheme } from '~/contexts/ThemeContext';
import SidebarMenu from './SidebarMenu';
import HeaderBar from './HeaderBar';
import { useDynamicTitle } from '~/hook/useDynamicTitle';

const { Content, Footer } = Layout;

const DefaultLayout = () => {
  useDynamicTitle();
  const [collapsed, setCollapsed] = useState(true);
  const location = useLocation();
  const { isDarkMode, toggleTheme, themeAlgorithm } = useTheme();

  const theme = isDarkMode ? 'dark' : 'light';
  const backgroundColor = isDarkMode ? '#001529' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#000';
  const subTextColor = isDarkMode ? '#ccc' : '#666';
  const contentBg = isDarkMode ? '#141414' : '#fff';

  // Kích thước sidebar
  const siderWidth = 250;
  const siderCollapsedWidth = 80;

  return (
    <ConfigProvider theme={{ algorithm: themeAlgorithm }}>
      <Layout style={{ minHeight: '100vh', background: backgroundColor }}>
        
        {/* Sidebar */}
        <Layout.Sider
          width={siderWidth}
          collapsedWidth={siderCollapsedWidth}
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
          <SidebarMenu collapsed={collapsed} isDarkMode={isDarkMode} />
        </Layout.Sider>

        {/* Phần nội dung luôn chiếm phần còn lại */}
        <Layout
          style={{
            marginLeft: collapsed ? siderCollapsedWidth : siderWidth,
            transition: 'margin-left 0.3s',
          }}
        >
          {/* Header */}
          <HeaderBar
            collapsed={collapsed}
            backgroundColor={backgroundColor}
            textColor={textColor}
            subTextColor={subTextColor}
            isDarkMode={isDarkMode}
            toggleTheme={toggleTheme}
            style={{
              left: collapsed ? siderCollapsedWidth : siderWidth,
              width: `calc(100% - ${collapsed ? siderCollapsedWidth : siderWidth}px)`,
              height: 64,
            }}
          />

          {/* Content */}
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
