// layouts/HeaderBar.jsx
import React from 'react';
import { Typography } from 'antd';
import { useLocation } from 'react-router-dom';
import { breadcrumbMap } from './layoutConfig';

const { Text } = Typography;

const HeaderBar = ({ collapsed, backgroundColor, textColor, subTextColor }) => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter(Boolean);
    const breadcrumbItems = pathnames.map((_, idx) => {
        const url = '/' + pathnames.slice(0, idx + 1).join('/');
        return breadcrumbMap[url] || url;
    });

    const employeeName = localStorage.getItem('employeeName') || 'Chưa đăng nhập';
    const role = (localStorage.getItem('role') || '').replace('ROLE_', '');

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
                <Text>{employeeName}</Text>
                <Text type="secondary" style={{ color: subTextColor }}>{role}</Text>
            </div>
        </div>
    );
};

export default HeaderBar;
