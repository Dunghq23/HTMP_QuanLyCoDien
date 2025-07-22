import React, { useEffect, useState } from 'react';
import {
    Table,
    Button,
    Space,
    message,
    Modal,
    Form,
    Input,
    Popconfirm,
    Typography,
} from 'antd';
import {
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import customerService from '~/services/customerService';

const { Title } = Typography;

function CustomerManagerPage() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [form] = Form.useForm();

    const isAdmin = localStorage.getItem("role") === 'ROLE_ADMIN';
    const isManager = localStorage.getItem("role") === 'ROLE_MANAGER';

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const data = await customerService.getAllCustomer();
            setCustomers(data);
        } catch (error) {
            console.error(error);
            message.error('Lỗi khi tải danh sách khách hàng');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAdmin || isManager) fetchCustomers();
    }, []);

    const handleSave = async () => {
        try {
            const values = await form.validateFields();

            if (editingCustomer) {
                await customerService.updateCustomer(editingCustomer.id, values);
                message.success('Cập nhật khách hàng thành công');
            } else {
                await customerService.createCustomer(values);
                message.success('Thêm khách hàng thành công');
            }

            form.resetFields();
            setModalVisible(false);
            setEditingCustomer(null);
            fetchCustomers();
        } catch (err) {
            console.error(err);
            message.error('Lỗi khi lưu thông tin khách hàng');
        }
    };

    const handleEdit = (record) => {
        setEditingCustomer(record);
        form.setFieldsValue(record);
        setModalVisible(true);
    };

    const handleDelete = async (id) => {
        try {
            await customerService.deleteCustomer(id);
            message.success('Xóa khách hàng thành công');
            fetchCustomers();
        } catch (error) {
            console.error(error);
            message.error(error.message || 'Lỗi khi xóa khách hàng');
        }
    };

    const columns = [
        {
            title: 'STT',
            key: 'index',
            align: 'center',
            width: 60,
            render: (_, __, index) => index + 1,
        },
        {
            title: 'Tên khách hàng',
            dataIndex: 'name',
            key: 'name',
            align: 'center',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Hành động',
            key: 'action',
            align: 'center',
            width: 180,
            render: (_, record) => (
                <Space>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    >
                        Sửa
                    </Button>
                    {(isAdmin || isManager) && (
                        <Popconfirm
                            title="Xác nhận xóa khách hàng này?"
                            onConfirm={() => handleDelete(record.id)}
                            okText="Có"
                            cancelText="Không"
                        >
                            <Button icon={<DeleteOutlined />} danger>
                                Xóa
                            </Button>
                        </Popconfirm>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
            <div style={{ textAlign: 'right', marginBottom: 16 }}>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                        form.resetFields();
                        setEditingCustomer(null);
                        setModalVisible(true);
                    }}
                >
                    Thêm khách hàng
                </Button>
            </div>

            <Table
                rowKey="id"
                columns={columns}
                dataSource={customers}
                loading={loading}
                bordered
                pagination={{
                    pageSizeOptions: ['5', '10', '20', '50'],
                    showSizeChanger: true,
                    defaultPageSize: 10,
                    showTotal: (total) => `Tổng cộng ${total} khách hàng`,
                }}
                scroll={{ y: 370 }} // Chiều cao cố định, có thể chỉnh theo ý bạn
            />


            <Modal
                title={editingCustomer ? 'Cập nhật khách hàng' : 'Thêm khách hàng'}
                open={modalVisible}
                onCancel={() => {
                    setModalVisible(false);
                    setEditingCustomer(null);
                    form.resetFields();
                }}
                onOk={handleSave}
                okText="Lưu"
                cancelText="Hủy"
                centered
                width={400}
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{ name: '' }}
                >
                    <Form.Item
                        label="Tên khách hàng"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng' }]}
                    >
                        <Input placeholder="Nhập tên khách hàng" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default CustomerManagerPage;
