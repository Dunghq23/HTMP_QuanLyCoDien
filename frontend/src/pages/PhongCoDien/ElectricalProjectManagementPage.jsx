import React, { useContext, useState } from 'react';
import { Table, Input, Select, DatePicker, Progress, Tag, Row, Col, Typography } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { Gantt, ViewMode } from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';
import { useTheme } from '~/contexts/ThemeContext';

const { Option } = Select;
const { Title } = Typography;

const initialData = [
  {
    key: '1',
    maDuAn: 'DA1',
    tenDuAn: 'Vệ sinh thùng vỏ tự động',
    benThucHien: 'Nội bộ',
    phuTrach: ['Mr Cảnh', 'Mr Thắng'],
    xuLy: 'Cơ cấu chổi quay để vệ sinh thùng',
    start: '05/03/2025',
    end: '08/05/2025',
    status: 'Done',
    progress: 9,
  },
  {
    key: '2',
    maDuAn: 'DA2',
    tenDuAn: 'Hệ thống cấp và chuyển thùng khay tự động',
    benThucHien: 'Nội bộ',
    phuTrach: ['Mr Thắng'],
    xuLy: '- Đang lắp ráp cơ khí V1\n- Thay đổi cơ cấu do test trượt NG',
    start: '12/06/2025',
    end: '19/09/2025',
    status: 'Ongoing',
    progress: 12.4,
  },
];

const statusColor = {
  Done: 'green',
  Ongoing: 'blue',
  Pending: 'orange',
};

const convertToGanttTasks = (data) => {

  const today = new Date();

  const taskData = data.map((item) => ({
    id: item.key,
    name: item.tenDuAn,
    start: dayjs(item.start, 'DD/MM/YYYY').toDate(),
    end: dayjs(item.end, 'DD/MM/YYYY').toDate(),
    type: 'task',
    progress: item.progress,
    isDisabled: false,
  }));

  return taskData;
};

const ElectricalProjectManagementPage = () => {
  const { isDarkMode } = useTheme();

  const [data, setData] = useState(initialData);

  return (
    <div style={{}}>
      <Title level={3}>QUẢN LÝ DỰ ÁN TỔNG THỂ</Title>
      <div style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={12}>
            <strong>Công ty:</strong> HTMP Việt Nam (Phòng cơ điện)
          </Col>
          <Col span={12}>
            <strong>Trưởng phòng:</strong> Vũ Hữu Cảnh
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <strong>Năm hiển thị:</strong> 2025
          </Col>
          <Col span={12}>
            <strong>Tuần hiện tại:</strong> 1
          </Col>
        </Row>
      </div>

      <Table
        columns={[
          {
            title: 'STT',
            dataIndex: 'maDuAn',
            key: 'maDuAn',
            width: '8%',
            fixed: 'left',
          },
          {
            title: 'Tên Dự Án',
            dataIndex: 'tenDuAn',
            key: 'tenDuAn',
            width: '18%',
            fixed: 'left',
          },
          {
            title: 'Bên thực hiện',
            dataIndex: 'benThucHien',
            key: 'benThucHien',
            width: '12%',
            render: (value) => <Tag color={value === 'Nội bộ' ? 'red' : 'blue'}>{value}</Tag>,
            onFilter: (value, record) => record.benThucHien.includes(value),
            filters: [
              { text: 'Nội bộ', value: 'Nội bộ' },
              { text: 'Đối tác', value: 'Đối tác' },
            ],
          },
          {
            title: 'Phụ trách',
            dataIndex: 'phuTrach',
            key: 'phuTrach',
            width: '12%',
            render: (names) => names?.join(', '),
            filters: data.flatMap((item) => item.phuTrach.map((name) => ({ text: name, value: name }))),
            onFilter: (value, record) => record.phuTrach.includes(value),
            filterSearch: true,
          },
          {
            title: 'Nội dung xử lý',
            dataIndex: 'xuLy',
            key: 'xuLy',
            width: '20%',
            render: (text) => <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{text}</pre>,
          },
          {
            title: 'Start',
            dataIndex: 'start',
            key: 'start',
            width: '10%',
          },
          {
            title: 'End',
            dataIndex: 'end',
            key: 'end',
            width: '10%',
          },
          {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: '10%',
            render: (status) => <Tag color={statusColor[status]}>{status}</Tag>,
          },
          {
            title: 'Progress',
            dataIndex: 'progress',
            key: 'progress',
            width: '10%',
            render: (value) => <Progress percent={value} size="small" status="active" />,
          },
        ]}
        dataSource={data}
        bordered
        pagination={false}
        scroll={{ x: '100%' }}
        sticky
        style={{ width: '100%' }}
      />

      <div style={{ marginTop: 48 }}>
        <Title level={4}>Biểu đồ Gantt</Title>
        <Gantt
          theme={isDarkMode ? "dark" : "default"}
          tasks={convertToGanttTasks(data)}
          viewMode={ViewMode.Week}
          listCellWidth="200px"
          columnWidth={80}
        />
      </div>
    </div>
  );
};

export default ElectricalProjectManagementPage;