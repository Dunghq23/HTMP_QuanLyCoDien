// layouts/SidebarMenu.jsx
import React from 'react';
import { Menu, Switch, Typography } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { getMenuItems } from './layoutConfig';

const { Text } = Typography;

const SidebarMenu = ({ collapsed, isDarkMode }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const theme = isDarkMode ? 'dark' : 'light';
    const textColor = isDarkMode ? '#fff' : '#000';

    return (
        <div>
            <div style={{ padding: 16, textAlign: 'center' }}>
                <img
                    src="/image/logo.webp"
                    alt="Logo"
                    style={{ width: collapsed ? '40%' : 'auto', maxHeight: 80 }}
                />
                {!collapsed && (
                    <Text strong style={{ color: textColor, fontSize: 20, marginTop: 8, display: 'block' }}>
                        PHÒNG CƠ ĐIỆN
                    </Text>
                )}
            </div>

            <Menu
                mode="inline"
                theme={theme}
                selectedKeys={[location.pathname]}
                items={getMenuItems(navigate)}
            />
        </div>
    );
};

export default SidebarMenu;
