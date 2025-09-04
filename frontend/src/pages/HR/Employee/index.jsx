import React, { useEffect, useState } from 'react';
import {
    Table,
    Button,
    Space,
    message,
    Modal,
    Form,
    Input,
    Select,
    Row,
    Col,
} from 'antd';
import {
    getAllEmployees,
    createEmployee,
    updateEmployee,
} from '~/services/employeeService';
import departmentService from '~/services/departmentService';
import positionService from '~/services/positionService';

function EmployeeManagerPage() {
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [positions, setPositions] = useState([]);
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

    const fetchDepartments = async () => {
        try {
            const data = await departmentService.getRootDepartments();
            setDepartments(data || []);
        } catch (error) {
            console.error(error);
            message.error('Lỗi khi tải danh sách phòng ban');
        }
    };

    const fetchPositions = async () => {
        try {
            const data = await positionService.getAllPositions();
            setPositions(data || []);
        } catch (error) {
            console.error(error);
            message.error('Lỗi khi tải danh sách chức vụ');
        }
    };

    useEffect(() => {
        if (localStorage.getItem("role") === 'ADMIN' || localStorage.getItem("role") === 'MANAGER') {
            fetchEmployees();
            fetchDepartments();
            fetchPositions();
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
            message.error('Lưu nhân viên thất bại');
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
            width: '25%',
            align: 'center',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Chức vụ',
            dataIndex: 'positionName',
            align: 'center',
            key: 'position',
            width: '20%',
        },
        {
            title: 'Phòng ban',
            dataIndex: 'departmentName',
            align: 'center',
            key: 'departmentName',
            width: '20%',
            filters: Array.from(new Set(departments.map(r => r.name))) // tạo filter duy nhất từ danh sách
                .map(name => ({ text: name, value: name })),
            onFilter: (value, record) => record.departmentName === value,
            render: (text, record) => {
                return record.departmentName || 'Chưa có phòng ban';
            }
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            align: 'center',
            key: 'phone',
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

    // ✅ Render option phòng ban và nhóm
    const renderDepartmentOptions = () => {
        return departments.map(dep => [
            <Select.Option key={`dep-${dep.id}`} value={dep.id}>
                Phòng {dep.name}
            </Select.Option>,
            ...(dep.subDepartments || []).map(sub => (
                <Select.Option key={`sub-${sub.id}`} value={sub.id}>
                    └─ Nhóm {sub.name}
                </Select.Option>
            ))
        ]);
    };

    const renderPositionOptions = () => {
        return positions.map(pos => [
            <Select.Option key={`opt-${pos.id}`} value={pos.id}>
                {pos.name}
            </Select.Option>
        ])
    }

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
                scroll={{ x: 'max-content' }}
                pagination={{
                    showSizeChanger: true,
                    pageSizeOptions: ['5', '10', '20', '50'],
                    defaultPageSize: 10,
                    showTotal: (total, range) => `Hiển thị ${range[0]}-${range[1]} trên tổng ${total} nhân viên`
                }}
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
                width="100%"
                style={{ maxWidth: 640 }}
            >
                <Form form={form} layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Mã nhân viên"
                                name="code"
                                rules={[{ required: true, message: 'Vui lòng nhập mã' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Tên"
                                name="name"
                                rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>


                        <Col span={12}>
                            <Form.Item
                                label="Số điện thoại"
                                name="phone"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập số điện thoại' },
                                    { pattern: /(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/, message: 'Số điện thoại không hợp lệ' },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Vai trò"
                                name="role"
                                rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
                            >
                                <Select placeholder="Chọn vai trò">
                                    <Select.Option value="ADMIN">Quản trị viên</Select.Option>
                                    <Select.Option value="MANAGER">Quản lý</Select.Option>
                                    <Select.Option value="EMPLOYEE">Nhân viên</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Phòng ban / Nhóm"
                                name="departmentId"
                                rules={[{ required: true, message: 'Vui lòng chọn phòng ban hoặc nhóm' }]}
                            >
                                <Select placeholder="Chọn phòng ban hoặc nhóm">
                                    {renderDepartmentOptions()}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Chức vụ"
                                name="positionId"
                                rules={[{ required: true, message: 'Vui lòng chọn chức vụ' }]}
                            >
                                <Select placeholder="Chọn chức vụ">
                                    {renderPositionOptions()}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>

            </Modal>
        </div>
    );
}

export default EmployeeManagerPage;
