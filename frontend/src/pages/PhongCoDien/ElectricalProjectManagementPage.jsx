import React, { useContext, useEffect, useState } from 'react';
import { Table, Input, Select, DatePicker, Progress, Tag, Row, Col, Typography, Button, Modal, Form, message, Space, Card } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { Gantt, ViewMode } from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';
import { useTheme } from '~/contexts/ThemeContext';
import projectService from '~/services/projectService';
import customerService from '~/services/customerService';
import CustomCard from '~/components/CustomCard';
import { Navigate, useNavigate } from 'react-router-dom';

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
  const [project, setProject] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();

  const fetchCustomers = async () => {
    try {
      const result = await customerService.getAllCustomer();
      setCustomers(result);
      console.log(result);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách dự án:", err);
    }
  }
  const fetchProjects = async () => {
    try {
      const result = await projectService.getAllProject();
      setProject(result);
      console.log(result);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách dự án:", err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const columns = [
    {
      title: "Mã dự án",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Tên dự án",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Khách hàng",
      dataIndex: ["customer", "name"],
      key: "customer",
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <Tag color={type === "TAY_GA" ? "blue" : "green"}>
          {type === "TAY_GA" ? "Tay gá" : "Sản phẩm mới"}
        </Tag>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      key: "endDate",
      render: (date) => (date ? dayjs(date).format("DD/MM/YYYY") : "-"),
    },
  ];

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
      external: 'https://apps.htmp.vn/co-dien',
    },
    {
      icon: '🆕',
      label: 'Sản phẩm mới',
      onClick: () => navigate('/electrical/projects/new-product'),
    },
    {
      icon: '⚙️',
      label: 'Quản lý công việc (IT)',
      external: 'https://apps.htmp.vn/it',
    },
  ];
  return (
    // <div style={{}}>
    //   {/* <Title level={3}>QUẢN LÝ DỰ ÁN TỔNG THỂ</Title>
    //   <div style={{ marginBottom: 16 }}>
    //     <Row gutter={16}>
    //       <Col span={12}>
    //         <strong>Công ty:</strong> HTMP Việt Nam (Phòng cơ điện)
    //       </Col>
    //       <Col span={12}>
    //         <strong>Trưởng phòng:</strong> Vũ Hữu Cảnh
    //       </Col>
    //     </Row>
    //     <Row gutter={16}>
    //       <Col span={12}>
    //         <strong>Năm hiển thị:</strong> 2025
    //       </Col>
    //       <Col span={12}>
    //         <strong>Tuần hiện tại:</strong> 1
    //       </Col>
    //     </Row>
    //   </div>

    //   <Table
    //     columns={[
    //       {
    //         title: 'STT',
    //         dataIndex: 'maDuAn',
    //         key: 'maDuAn',
    //         width: '8%',
    //         fixed: 'left',
    //       },
    //       {
    //         title: 'Tên Dự Án',
    //         dataIndex: 'tenDuAn',
    //         key: 'tenDuAn',
    //         width: '18%',
    //         fixed: 'left',
    //       },
    //       {
    //         title: 'Bên thực hiện',
    //         dataIndex: 'benThucHien',
    //         key: 'benThucHien',
    //         width: '12%',
    //         render: (value) => <Tag color={value === 'Nội bộ' ? 'red' : 'blue'}>{value}</Tag>,
    //         onFilter: (value, record) => record.benThucHien.includes(value),
    //         filters: [
    //           { text: 'Nội bộ', value: 'Nội bộ' },
    //           { text: 'Đối tác', value: 'Đối tác' },
    //         ],
    //       },
    //       {
    //         title: 'Phụ trách',
    //         dataIndex: 'phuTrach',
    //         key: 'phuTrach',
    //         width: '12%',
    //         render: (names) => names?.join(', '),
    //         filters: data.flatMap((item) => item.phuTrach.map((name) => ({ text: name, value: name }))),
    //         onFilter: (value, record) => record.phuTrach.includes(value),
    //         filterSearch: true,
    //       },
    //       {
    //         title: 'Nội dung xử lý',
    //         dataIndex: 'xuLy',
    //         key: 'xuLy',
    //         width: '20%',
    //         render: (text) => <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{text}</pre>,
    //       },
    //       {
    //         title: 'Start',
    //         dataIndex: 'start',
    //         key: 'start',
    //         width: '10%',
    //       },
    //       {
    //         title: 'End',
    //         dataIndex: 'end',
    //         key: 'end',
    //         width: '10%',
    //       },
    //       {
    //         title: 'Status',
    //         dataIndex: 'status',
    //         key: 'status',
    //         width: '10%',
    //         render: (status) => <Tag color={statusColor[status]}>{status}</Tag>,
    //       },
    //       {
    //         title: 'Progress',
    //         dataIndex: 'progress',
    //         key: 'progress',
    //         width: '10%',
    //         render: (value) => <Progress percent={value} size="small" status="active" />,
    //       },
    //     ]}
    //     dataSource={data}
    //     bordered
    //     pagination={false}
    //     scroll={{ x: '100%' }}
    //     sticky
    //     style={{ width: '100%' }}
    //   />

    //   <div style={{ marginTop: 48 }}>
    //     <Title level={4}>Biểu đồ Gantt</Title>
    //     <Gantt
    //       theme={isDarkMode ? "dark" : "default"}
    //       tasks={convertToGanttTasks(data)}
    //       viewMode={ViewMode.Week}
    //       listCellWidth="200px"
    //       columnWidth={80}
    //     />
    //   </div> */}
    // </div>
    <>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', padding: '16px', }} >
        {cards.map((card, index) => (
          <CustomCard
            key={index}
            icon={card.icon}
            label={card.label}
            external={card.external}
            onClick={card.onClick} />
        ))}
      </section>

      <Button
        type='primary'
        style={{ marginBottom: 16 }}
        onClick={() => {
          setModalVisible(true)
          fetchCustomers();
        }}
      >Thêm dự án</Button>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={project}
        pagination={{ pageSize: 5 }}
      />


      <Modal
        title="Thêm dự án mới"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        okText="Lưu"
        cancelTextText="Hủy"
        onOk={async () => {
          try {
            const values = await form.validateFields();
            console.log(values);

            const responseMessage = await projectService.createProject(values);
            message.success(responseMessage);

            setModalVisible(false);
            form.resetFields();
            fetchProjects();
          } catch (err) {
            console.error(err);
            message.error(err);
          }

        }}
      >
        <Form form={form} layout='vertical'>
          <Form.Item
            label="Mã dự án"
            name="code"
            rules={[{ required: true, message: 'Vui lòng nhập mã dự án' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Tên dự án"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên dự án" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Khách hàng"
            name="customerId"
            rules={[{ required: true, message: "Vui lòng nhập tên dự án" }]}
          >
            <Select placeholder="Chọn khách hàng">
              {customers.map((item) => (<Option key={item.id} value={item.id}>
                {item.name}
              </Option>))}
            </Select>
          </Form.Item>

          <Form.Item label="Loại dự án" name="type" rules={[{ required: true }]}>
            <Select placeholder="Chọn loại">
              <Option value="TAY_GA">Tay gá</Option>
              <Option value="SAN_PHAM_MOI">Sản phẩm mới</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Số lượng" name="quantity" rules={[{ required: true }]}>
            <Input type="number" min={1} />
          </Form.Item>

          <Form.Item label="Ngày bắt đầu" name="startDate" rules={[{ required: true }]}>
            <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
          </Form.Item>


          {/* 
            {
              "code": "TG-AMA-06",
              "name": "Tay gá AMA tháng 6",
              "customerId": 1,
              "type": "TAY_GA",
              "quantity": 10,
              "startDate": "2025-06-10"
            }
          */}

        </Form>
      </Modal>
    </>
  );
};

export default ElectricalProjectManagementPage;