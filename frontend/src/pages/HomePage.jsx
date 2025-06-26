import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '~/styles/HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  const cards = [
    {
      icon: '📞',
      label: 'Quản lý dự án team Automation',
      external: 'https://docs.google.com/spreadsheets/d/1Wdfl4iS_IEhuNhebVwJhu0rRV1JSvc6Yg2YTaqtajZY/edit?gid=1400358007',
    },
    {
      icon: '🚚',
      label: 'Quản lý dự án tổng thể',
      external: 'https://docs.google.com/spreadsheets/d/1EeSWTTU5Bb7cQiUS6MbUpmZ_ZFZ0__rnj7csp4lTLuo/edit?gid=616241582#gid=616241582',
    },
    {
      icon: '⚡',
      label: 'Sửa chữa thiết bị (CĐ)',
      onClick: () => navigate('/co-dien'),
    },
    {
      icon: '⚙️',
      label: 'Quản lý công việc (IT)',
      external: 'https://apps.htmp.vn/it',
    },
  ];

  return (
    <section className="grid">
      {cards.map((card, index) => {
        const content = (
          <>
            <span className="icon">{card.icon}</span>
            <span className="label">{card.label}</span>
          </>
        );

        return card.external ? (
          <a
            key={index}
            href={card.external}
            className="card"
            target="_blank"
            rel="noopener noreferrer"
          >
            {content}
          </a>
        ) : card.onClick ? (
          <div key={index} className="card" onClick={card.onClick}>
            {content}
          </div>
        ) : (
          <div key={index} className="card">
            {content}
          </div>
        );
      })}
    </section>
  );
};

export default HomePage;
