// import React from 'react';
// import { Outlet } from 'react-router-dom';
// import Sidebar from './Sidebar';
// import Header from './Header';
// import '~/styles/Layouts/DefaultLayout.css';

// const DefaultLayout = () => {
//   return (
//     <div className="layout">
//       <div className="sidebar"><Sidebar /></div>
//       <div className="main">
//         <div className="header"><Header /></div>
//         <div className="content"><Outlet /></div>
//       </div>
//     </div>

//   );
// };

// export default DefaultLayout;


import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import '~/styles/Layouts/DefaultLayout.css';

const DefaultLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const currentIsMobile = window.innerWidth < 768;
      setIsMobile(currentIsMobile);

      // Logic để xử lý trạng thái sidebar khi thay đổi kích thước màn hình
      if (!currentIsMobile) {
        // Nếu là desktop, luôn hiển thị sidebar
        setIsSidebarOpen(true);
      } else {
        // Nếu là mobile, ẩn sidebar theo mặc định
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    // Thiết lập trạng thái ban đầu khi component mount
    setIsSidebarOpen(window.innerWidth >= 768); // Mở nếu là desktop, đóng nếu là mobile

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Dependency rỗng để chỉ chạy một lần khi mount

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    // Thêm class 'sidebar-open-mobile' vào div.layout để kích hoạt lớp phủ (overlay)
    <div className={`layout ${isSidebarOpen && isMobile ? 'sidebar-open-mobile' : ''}`}>
      {/* Sidebar chỉ được render nếu isSidebarOpen (đã bật trên mobile) HOẶC không phải mobile (luôn hiện trên desktop) */}
      {/* VÀ QUAN TRỌNG NHẤT: Thêm class 'sidebar-open' vào div.sidebar để kích hoạt hiệu ứng CSS trượt */}
      {(isSidebarOpen || !isMobile) && (
        <div className={`sidebar ${isSidebarOpen && isMobile ? 'sidebar-open' : ''}`}>
          <Sidebar isMobile={isMobile} onClose={toggleSidebar} />
        </div>
      )}
      <div className={`main ${isSidebarOpen && isMobile ? 'main-expanded' : ''}`}>
        {/* Truyền onMenuClick (hàm bật/tắt sidebar) và isMobile (trạng thái mobile) xuống Header */}
        <Header onMenuClick={toggleSidebar} isMobile={isMobile} />
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DefaultLayout;