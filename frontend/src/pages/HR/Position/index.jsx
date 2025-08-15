import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, message, Modal, Popconfirm, Row, Space, Table, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import positionService from '~/services/positionService';

const { Title } = Typography;

function PositionManagerPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [form] = Form.useForm();
    const [positions, setPositions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // Lấy danh sách chức vụ
    const fetchData = async () => {
        try {
            setLoading(true);
            const dataPositions = await positionService.getAllPositions();
            setPositions(dataPositions);
        } catch (error) {
            console.error(error);
            message.error('Lỗi khi tải danh sách chức vụ');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAdd = () => {
        setEditingRecord(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (record) => {
        setEditingRecord(record);
        form.setFieldsValue(record);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            setLoading(true);
            await positionService.deletePosition(id);
            message.success("Xóa thành công!");
            fetchData();
        } catch (error) {
            console.error(error);
            message.error("Xóa thất bại!");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            setSaving(true);

            if (editingRecord) {
                await positionService.updatePosition(editingRecord.id, values);
                message.success("Cập nhật thành công!");
            } else {
                await positionService.createPosition(values);
                message.success("Thêm mới thành công!");
            }
            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            message.error(error.message);
        } finally {
            setSaving(false);
        }
    };

    const columns = [
        {
            title: "STT",
            render: (_, __, index) => index + 1,
            align: 'center',
            width: 80,
        },
        {
            title: "Mã chức vụ",
            dataIndex: "code",
            align: 'center',
            width: 150,
        },
        {
            title: "Tên chức vụ",
            dataIndex: "name",
        },
        {
            title: "Cấp bậc",
            dataIndex: "level",
            align: 'center',
            width: 120,
        },
        {
            title: "Hành động",
            align: 'center',
            width: 200,
            render: (_, record) => (
                <Space>
                    <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Xóa chức vụ này?"
                        description="Bạn có chắc muốn xóa?"
                        okText="Xóa"
                        cancelText="Hủy"
                        okType="danger"
                        onConfirm={() => handleDelete(record.id)}
                    >
                        <Button type="link" danger icon={<DeleteOutlined />}>
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <div className='position-page'>
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                        <Title level={4} style={{ margin: 0 }}>Quản lý chức vụ</Title>
                        <Button
                            type='primary'
                            icon={<PlusOutlined />}
                            style={{ borderRadius: 6 }}
                            onClick={handleAdd}
                        >
                            Thêm chức vụ
                        </Button>
                    </Row>
                    <Table
                        rowKey="id"
                        columns={columns}
                        dataSource={positions}
                        pagination={false}
                        bordered
                        loading={loading}
                    />
                </Col>
            </Row>

            {/* Modal thêm / sửa */}
            <Modal
                title={editingRecord ? "Chỉnh sửa chức vụ" : "Thêm chức vụ"}
                open={isModalOpen}
                onOk={handleSave}
                onCancel={() => setIsModalOpen(false)}
                okText="Lưu"
                cancelText="Hủy"
                confirmLoading={saving}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Mã chức vụ"
                        name="code"
                        rules={[{ required: true, message: 'Vui lòng nhập mã chức vụ!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Tên chức vụ"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên chức vụ!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Cấp bậc"
                        name="level"
                        rules={[{ required: true, message: 'Vui lòng nhập cấp bậc!' }]}
                    >
                        <Input type="number" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default PositionManagerPage;
