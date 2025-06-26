import React, { useEffect, useState } from 'react';
import {
    Table,
    Button,
    Space,
    Typography,
    message,
    Modal,
    Form,
    Input,
    Select,
} from 'antd';
import {
    getAllEmployees,
    createEmployee,
    updateEmployee,
} from '~/services/employeeService';

const { Title } = Typography;

function EmployeeManagerPage() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [form] = Form.useForm();

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const data = await getAllEmployees();
            setEmployees(data);
        } catch (error) {
            console.error(error);
            message.error('Lỗi khi tải danh sách nhân viên');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (localStorage.getItem("role") === 'ROLE_ADMIN' || localStorage.getItem("role") === 'ROLE_MANAGER') {
            fetchEmployees();
        }
    }, []);

    const handleSave = async () => {
        try {
            const values = await form.validateFields();

            if (editingEmployee) {
                await updateEmployee(editingEmployee.id, values);
                message.success('Cập nhật nhân viên thành công');
            } else {
                await createEmployee(values);
                message.success('Thêm nhân viên thành công');
            }

            setModalVisible(false);
            setEditingEmployee(null);
            form.resetFields();
            fetchEmployees();
        } catch (err) {
            console.error(err);
            message.error('Lỗi khi lưu nhân viên');
        }
    };

    const handleEdit = (record) => {
        setEditingEmployee(record);
        setModalVisible(true);
        form.setFieldsValue(record);
    };

    const handleAdd = () => {
        setEditingEmployee(null);
        form.resetFields();
        setModalVisible(true);
    };

    const columns = [
        {
            title: 'STT',
            key: 'index',
            align: 'center',
            width: '5%',
            render: (_, __, index) => index + 1,
        },
        {
            title: 'Mã nhân viên',
            dataIndex: 'code',
            key: 'code',
            width: '20%',
            align: 'center',
            sorter: (a, b) => a.code.localeCompare(b.code),
        },
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
            width: '40%',
            align: 'center',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Chức vụ',
            dataIndex: 'position',
            align: 'center',
            key: 'position',
            width: '20%',

        },
        {
            title: 'Hành động',
            key: 'action',
            align: 'center',
            render: (_, record) => (
                <Space>
                    <Button type="link" onClick={() => handleEdit(record)}>
                        Sửa
                    </Button>
                </Space>
            ),
            width: '15%',
        },
    ];

    return (
        <div>
            <Button
                type="primary"
                style={{ marginBottom: 16 }}
                onClick={handleAdd}
            >
                Thêm nhân viên
            </Button>

            <Table
                width="100%"
                rowKey="id"
                columns={columns}
                dataSource={employees}
                loading={loading}
                bordered
                scroll={{ x: 'max-content' }} // ✅ Cho phép kéo ngang trên mobile
            />

            <Modal
                title={editingEmployee ? 'Sửa nhân viên' : 'Thêm nhân viên'}
                open={modalVisible}
                onCancel={() => {
                    setModalVisible(false);
                    setEditingEmployee(null);
                    form.resetFields();
                }}
                onOk={handleSave}
                okText="Lưu"
                cancelText="Hủy"
                width="100%" // ✅ Tối đa chiều rộng
                style={{ top: 20, maxWidth: 480, margin: '0 auto' }} // ✅ Responsive modal
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Mã nhân viên"
                        name="code"
                        rules={[{ required: true, message: 'Vui lòng nhập mã' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Tên"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Chức vụ"
                        name="position"
                        rules={[{ required: true, message: 'Vui lòng nhập chức vụ' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Số điện thoại"
                        name="phone"
                        rules={[
                            { required: true, message: 'Vui lòng nhập số điện thoại' },
                            { pattern: /^\d{9,11}$/, message: 'Số điện thoại không hợp lệ' },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Vai trò"
                        name="role"
                        rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
                    >
                        <Select placeholder="Chọn vai trò">
                            <Select.Option value="ROLE_ADMIN">Quản trị viên</Select.Option>
                            <Select.Option value="ROLE_MANAGER">Quản lý</Select.Option>
                            <Select.Option value="ROLE_EMPLOYEE">Nhân viên</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default EmployeeManagerPage;
