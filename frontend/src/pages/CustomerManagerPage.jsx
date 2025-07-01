import React, { useEffect, useState } from 'react';
import {
    Table,
    Button,
    Space,
    message,
    Modal,
    Form,
    Input,
} from 'antd';
import customerService from '~/services/customerService';
import { EditOutlined } from '@ant-design/icons';

function CustomerManagerPage() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [form] = Form.useForm();

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
        if (localStorage.getItem("role") === 'ROLE_ADMIN' || localStorage.getItem("role") === 'ROLE_MANAGER') {
            fetchCustomers();
        }
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

            setModalVisible(false);
            setEditingCustomer(null);
            form.resetFields();
            fetchCustomers();
        } catch (err) {
            console.error(err);
            message.error(err);
        }
    };

    const handleEdit = (record) => {
        setEditingCustomer(record);
        setModalVisible(true);
        form.setFieldsValue(record);
    };

    const handleAdd = () => {
        setEditingCustomer(null);
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
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
            width: '40%',
            align: 'center',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Hành động',
            key: 'action',
            align: 'center',
            render: (_, record) => (
                <Space>
                    <Button onClick={() => handleEdit(record)}>
                        <EditOutlined /> Sửa
                    </Button>
                </Space>
            ),
            width: '15%',
        },
    ];

    return (
        <div>
            <Space style={{ marginBottom: 16 }}>
                <Button
                    type="primary"
                    onClick={handleAdd}
                >
                    Thêm khách hàng
                </Button>
            </Space>

            <Table
                width="100%"
                rowKey="id"
                columns={columns}
                dataSource={customers}
                loading={loading}
                bordered
                scroll={{ x: 'max-content' }}
            />

            <Modal
                title={editingCustomer ? 'Sửa khách hàng' : 'Thêm khách hàng'}
                open={modalVisible}
                onCancel={() => {
                    setModalVisible(false);
                    setEditingCustomer(null);
                    form.resetFields();
                }}
                onOk={handleSave}
                okText="Lưu"
                cancelText="Hủy"
                width="100%"
                style={{ top: 20, maxWidth: 480, margin: '0 auto' }}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Tên khách hàng"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default CustomerManagerPage;