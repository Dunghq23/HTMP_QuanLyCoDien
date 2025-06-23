import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import '~/styles/Layouts/DefaultLayout.css';

const DefaultLayout = () => {
  return (
    <div className="layout">
      <div className="sidebar"><Sidebar /></div>
      <div className="main">
        <div className="header"><Header /></div>
        <div className="content"><Outlet /></div>
      </div>
    </div>

  );
};

export default DefaultLayout;
