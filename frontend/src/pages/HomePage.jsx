import React from 'react';
import '~/styles/HomePage.css'; // Gợi ý: Tách style ra file riêng
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* <header className="header">
        <div className="logo">
          <img
            src="https://bizweb.dktcdn.net/100/345/093/themes/704898/assets/logo.png?1749724495074"
            alt="HTMP Logo"
          />
          <h1>Quản lý HTMP</h1>
        </div>
        <div className="user">
          <span>👤 Hạ Quang Dũng</span>
          <span>🔓</span>
        </div>
      </header> */}

      <section className="grid">
        <div className="card">
          <span className="icon">📞</span>
          <span className="label">Calling System</span>
        </div>
        <div className="card">
          <span className="icon">🚚</span>
          <span className="label">Quản lý Shipping</span>
        </div>
        <div className="card">
          <span className="icon">🗓️</span>
          <span className="label">Kế hoạch chạy máy đúc</span>
        </div>
        <div className="card">
          <span className="icon">🌐</span>
          <span className="label">Quản lý Mã hàng</span>
        </div>
        <div className="card">
          <span className="icon">⭐</span>
          <span className="label">Chấm điểm 5S</span>
        </div>
        <div className="card">
          <span className="icon">❗</span>
          <span className="label">Phạt thẻ 5S</span>
        </div>
        <div className="card">
          <span className="icon">🏠</span>
          <span className="label">Quản lý vật tư</span>
        </div>
        <div className="card" onClick={() => navigate('/co-dien')}>
          <span className="icon">⚡</span>
          <span className="label">Sửa chữa thiết bị (CĐ)</span>
        </div>
        <div className="card">
          <span className="icon">⚙️</span>
          <span className="label">Quản lý công việc (IT)</span>
        </div>
      </section>
    </>
  );
};

export default HomePage;
