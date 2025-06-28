import React, { useContext, useState } from 'react';
import {
  Table,
  Modal,
  Button,
  Form,
  DatePicker,
  InputNumber,
  Row,
  Col,
  message,
} from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { Gantt, ViewMode } from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';
import { useTheme } from '~/contexts/ThemeContext';



function ElectricalNewProductPage() {
  const { isDarkMode } = useTheme();

  const [form] = Form.useForm();
  const [data, setData] = useState([
    {
      key: 1,
      thang: 'Tháng 6',
      ngay: '16/06/2025',
      nhanSP: 0,
      thietKe: 0,
      coPhoiVatTu: 0,
      giaCong: 0,
      lapRap: 0,
      thuNghiem: 0,
      banGiao: 0,
      chuaThietKe: 0,
      chuaPhoiVat: 4,
      chuaGiaCong: 32,
      chuaLapRap: 0,
      chuaTest: 0,
      chuaBanGiao: 0,
      ton: 36,
    },
    {
      key: 2,
      thang: 'Tháng 6',
      ngay: '17/06/2025',
      nhanSP: 2,
      thietKe: 0,
      coPhoiVatTu: 0,
      giaCong: 0,
      lapRap: 0,
      thuNghiem: 0,
      banGiao: 0,
      chuaThietKe: 2,
      chuaPhoiVat: 4,
      chuaGiaCong: 32,
      chuaLapRap: 0,
      chuaTest: 0,
      chuaBanGiao: 0,
      ton: 38,
    },
  ]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleAdd = (values) => {
    const formatted = {
      ...values,
      key: data.length + 1,
      thang: 'Tháng ' + (dayjs(values.ngay).month() + 1),
      ngay: values.ngay.format('DD/MM/YYYY'),
    };
    setData([...data, formatted]);
    message.success('Đã thêm dữ liệu');
    setIsModalVisible(false);
    form.resetFields();
  };

  const columns = [
    { title: 'Tháng', dataIndex: 'thang', key: 'thang' },
    { title: 'Ngày', dataIndex: 'ngay', key: 'ngay' },
    { title: 'Nhận SP', dataIndex: 'nhanSP', key: 'nhanSP' },
    { title: 'Thiết kế', dataIndex: 'thietKe', key: 'thietKe' },
    { title: 'Đã có phôi và vật tư', dataIndex: 'coPhoiVatTu', key: 'coPhoiVatTu' },
    { title: 'Gia công', dataIndex: 'giaCong', key: 'giaCong' },
    { title: 'Lắp ráp (Cơ khí & Điện)', dataIndex: 'lapRap', key: 'lapRap' },
    { title: 'Thử nghiệm', dataIndex: 'thuNghiem', key: 'thuNghiem' },
    { title: 'Bàn giao', dataIndex: 'banGiao', key: 'banGiao' },
    { title: 'Chưa thiết kế', dataIndex: 'chuaThietKe', key: 'chuaThietKe' },
    { title: 'Chưa có phôi và vật', dataIndex: 'chuaPhoiVat', key: 'chuaPhoiVat' },
    { title: 'Chưa gia công', dataIndex: 'chuaGiaCong', key: 'chuaGiaCong' },
    { title: 'Chưa lắp ráp', dataIndex: 'chuaLapRap', key: 'chuaLapRap' },
    { title: 'Chưa Test', dataIndex: 'chuaTest', key: 'chuaTest' },
    { title: 'Chưa bàn giao', dataIndex: 'chuaBanGiao', key: 'chuaBanGiao' },
    { title: 'TỒN', dataIndex: 'ton', key: 'ton', className: 'orange-column' },
  ];

  const convertToGanttTasks = (data) => {
    return data.map((item, index) => ({
      id: `${item.key}`,
      name: `Ngày ${item.ngay}`,
      start: dayjs(item.ngay, 'DD/MM/YYYY').toDate(),
      end: dayjs(item.ngay, 'DD/MM/YYYY').add(1, 'day').toDate(),
      type: 'task',
      progress: Math.min(item.thietKe * 10, 100),
      isDisabled: false,
      dependencies: index > 0 ? [`${data[index - 1].key}`] : [],
    }));
  };

  return (
    <div >
      <h1>Sản phẩm mới</h1>
      <Button type="primary" onClick={() => setIsModalVisible(true)}>
        Thêm mới
      </Button>

      <Table
        dataSource={data}
        columns={columns}
        bordered
        scroll={{ x: 'max-content' }}
        style={{ marginTop: 24, minWidth: 1200 }}
      />

      <Modal
        title="Thêm dữ liệu sản phẩm mới"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        okText="Lưu"
        cancelText="Huỷ"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAdd}
          initialValues={{ ngay: dayjs() }}
        >
          <Row gutter={16}>
            {[
              ['ngay', 'Ngày'],
              ['nhanSP', 'Nhận SP'],
              ['thietKe', 'Thiết kế'],
              ['coPhoiVatTu', 'Đã có phôi và vật tư'],
              ['giaCong', 'Gia công'],
              ['lapRap', 'Lắp ráp (Cơ khí & Điện)'],
              ['thuNghiem', 'Thử nghiệm'],
              ['banGiao', 'Bàn giao'],
            ].map(([name, label]) => (
              <Col span={12} key={name}>
                <Form.Item
                  name={name}
                  label={label}
                  rules={[{ required: true }]}
                >
                  {name === 'ngay' ? (
                    <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
                  ) : (
                    <InputNumber min={0} style={{ width: '100%' }} />
                  )}
                </Form.Item>
              </Col>
            ))}
          </Row>
        </Form>
      </Modal>

      <h2 style={{ marginTop: 48 }}>Biểu đồ Gantt</h2>
      <div style={{ border: '1px solid #ccc', padding: 16 }}>
        <Gantt
          theme={isDarkMode ? "dark" : "default"} 
          tasks={convertToGanttTasks(data)}
          viewMode={ViewMode.Day}
          listCellWidth="155px"
          columnWidth={70}
        />
      </div>
    </div>
  );
}

export default ElectricalNewProductPage;
