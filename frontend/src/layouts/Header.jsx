import React from 'react';
import { useLocation } from 'react-router-dom';
import '~/styles/Layouts/Header.css';

const breadcrumbMap = {
  '/': 'Trang chủ',
  '/co-dien': 'Phòng cơ điện',
  '/co-dien/quan-ly-du-an': 'Quản lý dự án',
  '/co-dien/quan-ly-du-an/san-pham-moi': 'Sản phẩm mới',
  '/tay-ga-cat-gate': 'Tay gá, cắt gate',
  '/san-pham-moi': 'Sản phẩm mới',
  '/may-tu-dong': 'Máy tự động',
  '/phat-sinh': 'Phát sinh',
};

const Header = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);
  const breadcrumbs = pathnames.map((_, index) => {
    const url = '/' + pathnames.slice(0, index + 1).join('/');
    return breadcrumbMap[url] || url;
  });

  return (
    <header className="header">
      <div className="left">
        {breadcrumbs.length > 0 ? breadcrumbs.join(' / ') : 'Trang chủ'}
      </div>
      <div className="right">
        <span>Hạ Quang Dũng</span>
        <span className="role">admin</span>
      </div>
    </header>
  );
};

export default Header;
