// src/components/layouts/Sidebar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu } from 'antd';
import {
  HomeOutlined,
  ToolOutlined,
} from '@ant-design/icons';

const { SubMenu } = Menu;

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear(); // Xóa token và thông tin đăng nhập
    navigate('/login'); // Chuyển hướng về trang login
  };
  return (
    <div style={{ width: 250, height: '100vh', background: '#fff', borderRight: '1px solid #f0f0f0' }}>
      <div style={{ textAlign: 'center', padding: '16px 0' }}>
        <img
          src="https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/480792032_648502271029140_972747559127348722_n.jpg?stp=dst-jpg_s2048x2048_tt6&_nc_cat=105&ccb=1-7&_nc_sid=127cfc&_nc_ohc=3Ql29jVQaHQQ7kNvwGiApP4&_nc_oc=AdnxyOBbVyjuoT_VL1m2lpBLHERNIr9Rcihjs-0IUOeiZQTZBgOgH_UKLteBU-m2-t8&_nc_zt=23&_nc_ht=scontent.fhan19-1.fna&_nc_gid=Xw0CStkqSfFvMDzstWqYrQ&oh=00_AfPsN67gkLBHJV-ZS5zTSFEGMQ1rNNCQrtUs0WQU7RNw5w&oe=6856E983"
          alt="Logo"
          style={{ width: '80%', maxHeight: 80, objectFit: 'contain' }}
        />
      </div>

      <Menu
        mode="inline"
        defaultSelectedKeys={['/']}
        // defaultOpenKeys={['system', 'device']}
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

        <Menu.Item key="/logout" danger onClick={handleLogout}>
          Đăng xuất
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default Sidebar;
