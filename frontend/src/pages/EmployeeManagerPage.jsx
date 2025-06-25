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
        fetchEmployees();
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
            render: (_, __, index) => index + 1,
            // Giữ lại trên mọi kích thước màn hình
            responsive: ['xs', 'sm', 'md', 'lg', 'xl']
        },
        {
            title: 'Mã NV', // Rút gọn tiêu đề cho mobile
            dataIndex: 'code',
            key: 'code',
            sorter: (a, b) => a.code.localeCompare(b.code),
            // Luôn hiển thị mã nhân viên
            responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
            ellipsis: true, // Thêm dấu ba chấm nếu quá dài
        },
        {
            title: 'Tên nhân viên',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            // Ẩn trên màn hình nhỏ nhất nếu cần thiết, hoặc điều chỉnh responsive
            responsive: ['xs', 'md', 'lg', 'xl'], // Hiển thị từ sm trở lên
            ellipsis: true,
        },
        {
            title: 'Chức vụ',
            dataIndex: 'position',
            key: 'position',
            // Ẩn trên màn hình nhỏ nhất
            responsive: ['md', 'lg', 'xl'], // Hiển thị từ md trở lên
            ellipsis: true,
        },
        {
            title: 'SĐT', // Rút gọn tiêu đề cho mobile
            dataIndex: 'phone',
            key: 'phone',
            // Ẩn trên màn hình nhỏ nhất, chỉ hiện từ sm trở lên
            responsive: ['sm', 'md', 'lg', 'xl'],
            ellipsis: true,
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            key: 'role',
            // Chỉ hiển thị trên màn hình lớn hơn
            responsive: ['lg', 'xl'], // Hiển thị từ lg trở lên
            render: (role) => role.replace('ROLE_', ''), // Hiển thị vai trò đẹp hơn
            ellipsis: true,
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button type="link" onClick={() => handleEdit(record)} size="small"> {/* Dùng size="small" cho nút */}
                        Sửa
                    </Button>
                </Space>
            ),
            // Luôn hiển thị nút hành động
            responsive: ['xs', 'sm', 'md', 'lg', 'xl']
        },
    ];

    return (
        <div
            style={{
                maxWidth: 1200,
                margin: '0 auto',
            }}
        >
            <Button
                type="primary"
                style={{ marginBottom: 16 }}
                onClick={handleAdd}
            >
                Thêm nhân viên
            </Button>

            <Table
                rowKey="id"
                columns={columns}
                dataSource={employees}
                loading={loading}
                bordered
                scroll={{ x: 'max-content' }} // ✅ Rất quan trọng để bảng có thể cuộn ngang trên mobile
                pagination={{ pageSize: 10 }} // Thêm phân trang mặc định
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
                // Ant Design Modal đã có responsive mặc định tốt,
                // nhưng nếu muốn kiểm soát thêm, bạn có thể dùng `width` linh hoạt.
                // Đối với mobile, width="calc(100% - 32px)" sẽ tạo khoảng cách 16px mỗi bên.
                // Trên desktop, maxWidth sẽ giới hạn chiều rộng.
                width={window.innerWidth < 768 ? 'calc(100% - 32px)' : 520} // Thay đổi width dựa trên kích thước màn hình
                style={{ top: 20 }} // Đảm bảo modal không quá sát đỉnh màn hình
                maskClosable={false} // Không cho phép đóng modal khi click ra ngoài
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