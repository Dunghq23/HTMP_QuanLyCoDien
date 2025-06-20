import React, { useState } from 'react';
import { Table, DatePicker, Input, Select, Tag, Space, Button, Tooltip, Typography } from 'antd';
import { EyeOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { PhuTro, Loi } from '~/data/options'; // nếu đã có file data

const { RangePicker } = DatePicker;
const { Option, OptGroup } = Select;
const { Title } = Typography;

const CoDienPage = () => {
  const [dateRange, setDateRange] = useState([dayjs(), dayjs()]);

  const [data] = useState([
    {
      key: '1',
      stt: 1,
      ngay: '16-06-2025',
      maTB: 'IM-14',
      phuTro: 'Sensor',
      loaiLoi: 'D2',
      maLoi: 'Lỗi sensor nhiệt',
      batDau: '20:00',
      ketThuc: '1:10',
      xuLy: 310,
      tinhTrang: 'OK',
      dungMay: true,
    },
    // Thêm dữ liệu tại đây
  ]);

  const columns = [
    { title: 'STT', dataIndex: 'stt', key: 'stt', width: 60 },
    { title: 'Ngày', dataIndex: 'ngay', key: 'ngay' },
    { title: 'Mã TB', dataIndex: 'maTB', key: 'maTB' },
    { title: 'Phụ trợ', dataIndex: 'phuTro', key: 'phuTro' },
    { title: 'Loại lỗi', dataIndex: 'loaiLoi', key: 'loaiLoi' },
    { title: 'Mã lỗi', dataIndex: 'maLoi', key: 'maLoi' },
    { title: 'Tg bắt đầu', dataIndex: 'batDau', key: 'batDau' },
    { title: 'Tg kết thúc', dataIndex: 'ketThuc', key: 'ketThuc' },
    {
      title: 'Tg xử lý',
      dataIndex: 'xuLy',
      key: 'xuLy',
      render: (val) => `${val} phút`,
    },
    {
      title: 'Tình trạng',
      dataIndex: 'tinhTrang',
      key: 'tinhTrang',
      render: (val) => (val === 'OK' ? <Tag color="green">OK</Tag> : <Tag color="red">LỖI</Tag>),
    },
    {
      title: 'Dừng máy',
      dataIndex: 'dungMay',
      key: 'dungMay',
      render: (val) => (val ? <Tag color="red">✓</Tag> : <Tag color="default">✗</Tag>),
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: () => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button icon={<EyeOutlined />} />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button icon={<EditOutlined />} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: '#fff', borderRadius: 8 }}>
      <Title level={3} style={{ color: '#531dab', marginBottom: 20 }}>
        🛠️ SỬA CHỮA MÁY, THIẾT BỊ
      </Title>

      <Space style={{ marginBottom: 16 }} wrap>
        <RangePicker format="DD/MM/YYYY" value={dateRange} onChange={setDateRange} />
        <Input placeholder="Nhập mã thiết bị" style={{ width: 180 }} prefix={<SearchOutlined />} />

        <Select placeholder="Chọn phụ trợ" style={{ width: 180 }}>
          {PhuTro.map((item) => (
            <Option key={item} value={item}>
              {item}
            </Option>
          ))}
        </Select>

        <Select placeholder="Chọn mã lỗi" style={{ width: 220 }} allowClear>
          {Loi.map((group) => (
            <OptGroup key={group.pl_loi} label={group.pl_loi}>
              {group.ct_loi.map((loi) => (
                <Option key={loi} value={loi}>
                  {loi}
                </Option>
              ))}
            </OptGroup>
          ))}
        </Select>

        <Select defaultValue="all" style={{ width: 120 }}>
          <Option value="all">Tất cả</Option>
          <Option value="true">Dừng</Option>
          <Option value="false">Không dừng</Option>
        </Select>

        <Button type="primary" icon={<PlusOutlined />}>
          Thêm mới
        </Button>
      </Space>

      <Table bordered columns={columns} dataSource={data} scroll={{ x: 'max-content' }} pagination={{ pageSize: 10 }} />
    </div>
  );
};

export default CoDienPage;
