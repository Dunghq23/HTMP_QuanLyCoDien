// src/components/layouts/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import {
  HomeOutlined,
  ToolOutlined,
} from '@ant-design/icons';
import authService from '~/services/authService';

const { SubMenu } = Menu;

const Sidebar = () => {
  return (
    <div style={{ width: 250, height: '100vh', background: '#fff', borderRight: '1px solid #f0f0f0' }}>
      <div style={{ textAlign: 'center', padding: '16px 0' }}>
        <img
          src="/image/logo.jpg"
          alt="Logo"
          style={{ width: '80%', maxHeight: 80, objectFit: 'contain' }}
        />
      </div>

      <Menu
        mode="inline"
        defaultSelectedKeys={['/']}
        style={{ height: '100%', borderRight: 0 }}
      >
        <Menu.Item key="/" icon={<HomeOutlined />}>
          <Link to="/">Trang chủ</Link>
        </Menu.Item>

        <Menu.Item key="/employees">
          <Link to="/quan-ly-nhan-vien">Quản lý nhân viên</Link>
        </Menu.Item>

        <SubMenu key="co-dien" icon={<ToolOutlined />} title="Phòng Cơ Điện">
          <Menu.Item key="/projects">
            <Link to="/co-dien/quan-ly-du-an">Quản lý dự án</Link>
          </Menu.Item>
          <Menu.Item key="/tasks">
            <Link to="/co-dien/quan-ly-cong-viec-hang-ngay">Quản lý công việc hàng ngày</Link>
          </Menu.Item>
          <Menu.Item key="/devices">
            <Link to="/co-dien/quan-ly-thiet-bi">Quản lý thiết bị</Link>
          </Menu.Item>
          <Menu.Item key="/device-groups">
            <Link to="/co-dien/quan-ly-nhom-thiet-bi">Quản lý nhóm thiết bị</Link>
          </Menu.Item>

        </SubMenu>

        <Menu.Item key="/logout" danger onClick={() => {
          authService.logout();
        }
        }>
          Đăng xuất
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default Sidebar;
