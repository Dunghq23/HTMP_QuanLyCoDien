// layouts/HeaderBar.jsx
import React from 'react';
import { Dropdown, Flex, Space, Switch, Typography } from 'antd';
import { useLocation } from 'react-router-dom';
import { breadcrumbMap } from './layoutConfig';
import { DownOutlined, LogoutOutlined, MoonOutlined, SunOutlined } from '@ant-design/icons';
import authService from '~/services/authService';

const { Text } = Typography;

const HeaderBar = ({ collapsed, backgroundColor, textColor, subTextColor, isDarkMode, toggleTheme }) => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter(Boolean);
    const breadcrumbItems = pathnames.map((_, idx) => {
        const url = '/' + pathnames.slice(0, idx + 1).join('/');
        return breadcrumbMap[url] || url;
    });

    const employeeName = localStorage.getItem('employeeName') || 'Chưa đăng nhập';
    const role = (localStorage.getItem('role') || '').replace('ROLE_', '');


    const items = [
        {
            label: (
                <div onClick={(e) => e.stopPropagation()}>
                    <Space>
                        <Text>Giao diện</Text>
                        <Switch
                            checkedChildren={<MoonOutlined />}
                            unCheckedChildren={<SunOutlined />}
                            checked={isDarkMode}
                            onChange={toggleTheme}
                        />
                    </Space>
                </div>
            ),
            key: '1',
        },
        {
            type: 'divider',
        },
        {
            label: (
                <Space>
                    <LogoutOutlined />
                    <Text>Đăng xuất</Text>
                </Space>
            ),
            key: '3',
            disabled: false,
            onClick: () => {
                authService.logout();
                window.location.href = '/login';
            },
        },
    ];

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: collapsed ? 80 : 200,
                right: 0,
                height: 64,
                padding: '0 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: backgroundColor,
                color: textColor,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                zIndex: 100,
            }}
        >
            <Text strong style={{ fontSize: 16 }}>{breadcrumbItems.join(' / ') || 'Trang chủ'}</Text>
            <div style={{ display: 'flex', gap: 12 }}>
                <Dropdown menu={{ items }} trigger={['click']}>
                    <a onClick={e => e.preventDefault()}>
                        <Flex align="center" gap="small">
                            <Flex vertical align="end" style={{ lineHeight: 1.2 }}>
                                <Text strong style={{ fontSize: 14 }}>{employeeName}</Text>
                                <Text type="secondary" style={{ fontSize: 11 }}>{role}</Text>
                            </Flex>
                            <DownOutlined style={{ fontSize: 10 }} />
                        </Flex>
                    </a>
                </Dropdown>
            </div>
        </div>
    );
};

export default HeaderBar;
