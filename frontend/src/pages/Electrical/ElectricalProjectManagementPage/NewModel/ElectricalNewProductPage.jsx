import React, { useState } from 'react';
import { Tabs } from 'antd';
import TabData from './TabData';
import TabReport from './TabReport';

function ElectricalNewProductPage() {
  const [activeKey, setActiveKey] = useState('data');

  return (
    <Tabs
      activeKey={activeKey}
      onChange={(key) => setActiveKey(key)}
      destroyOnHidden   // <--- Quan trọng: unmount tab khi không active
      items={[
        { key: 'data', label: 'Dữ liệu', children: <TabData /> },
        { key: 'report', label: 'Báo cáo', children: <TabReport /> },
      ]}
    />
  );
}

export default ElectricalNewProductPage;
