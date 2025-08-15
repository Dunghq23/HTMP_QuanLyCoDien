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
} from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import departmentService from '~/services/departmentService';

function DepartmentManagerPage() {
    const [rootDepartments, setRootDepartments] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingDepartment, setEditingDepartment] = useState(null);
    const [form] = Form.useForm();

    const fetchDepartments = async () => {
        setLoading(true);
        try {
            const data = await departmentService.getRootDepartments();
            setRootDepartments(data);

            // Flatten data để gộp ô
            const flattened = [];
            let index = 1;
            data.forEach(dep => {
                const subCount = dep.subDepartments?.length || 0;

                if (subCount > 0) {
                    dep.subDepartments.forEach((sub, idx) => {
                        flattened.push({
                            key: `${dep.id}-${sub.id}`,
                            stt: idx === 0 ? index : '', // STT chỉ hiện ở hàng đầu tiên
                            parentId: dep.id,
                            parentCode: dep.code,
                            parentName: dep.name,
                            parentEmployeeCount: dep.employeeCount,
                            parentRowSpan: idx === 0 ? subCount : 0,
                            subId: sub.id,
                            subName: sub.name,
                            subCode: sub.code,
                            subEmployeeCount: sub.employeeCount,
                        });
                    });
                } else {
                    flattened.push({
                        key: `${dep.id}`,
                        stt: index,
                        parentId: dep.id,
                        parentCode: dep.code,
                        parentName: dep.name,
                        parentEmployeeCount: dep.employeeCount,
                        parentRowSpan: 1,
                        subId: null,
                        subName: '',
                        subEmployeeCount: 0,
                    });
                }
                index++;
            });
            setTableData(flattened);
        } catch (error) {
            console.error(error);
            message.error('Lỗi khi tải danh sách phòng ban');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (
            localStorage.getItem("role") === 'ROLE_ADMIN' ||
            localStorage.getItem("role") === 'ROLE_MANAGER'
        ) {
            fetchDepartments();
        }
    }, []);

    // === Handle CRUD ===
    const handleSave = async () => {
        try {
            const values = await form.validateFields();

            if (editingDepartment) {
                await departmentService.updateDepartment(editingDepartment.id, values);
                message.success('Cập nhật phòng ban thành công');
            } else {
                await departmentService.createDepartment(values);
                message.success('Thêm phòng ban thành công');
            }

            setModalVisible(false);
            setEditingDepartment(null);
            form.resetFields();
            fetchDepartments();
        } catch (err) {
            console.error(err);
            message.error('Lưu phòng ban thất bại');
        }
    };

    const handleEdit = (record) => {
        console.log(record);

        // Nếu click vào nhóm thì record.subId != null, ngược lại là phòng
        setEditingDepartment({
            id: record.subId || record.parentId,
            code: record.subCode || record.parentCode,
            name: record.subName || record.parentName,
            parentDepartmentId: record.subId ? record.parentId : null,
        });
        form.setFieldsValue({
            code: record.subCode || record.parentCode,
            name: record.subName || record.parentName,
            parentDepartmentId: record.subId ? record.parentId : null,
        });
        setModalVisible(true);
    };

    const handleAdd = () => {
        setEditingDepartment(null);
        form.resetFields();
        setModalVisible(true);
    };

    const handleDelete = async (record) => {
        const idToDelete = record.subId || record.parentId;
        Modal.confirm({
            title: 'Xác nhận xóa phòng ban',
            content: 'Bạn có chắc muốn xóa phòng ban / nhóm này?',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            async onOk() {
                try {
                    await departmentService.deleteDepartment(idToDelete);
                    message.success('Xóa phòng ban thành công');
                    fetchDepartments();
                } catch (error) {
                    console.error(error);
                    message.error('Xóa phòng ban thất bại');
                }
            },
        });
    };

    // === Columns gộp ô ===
    const columns = [
        {
            title: 'STT',
            dataIndex: 'stt',
            align: 'center',
            width: '5%',
            render: (text, row) => ({
                children: text,
                props: { rowSpan: row.parentRowSpan },
            }),
        },
        {
            title: 'Mã phòng ban',
            dataIndex: 'parentCode',
            align: 'center',
            width: '5%',
            render: (text, row) => ({
                children: text,
                props: { rowSpan: row.parentRowSpan },
            }),
        },
        {
            title: 'Phòng ban',
            dataIndex: 'parentName',
            align: 'center',
            width: '20%',
            render: (text, row) => ({
                children: text,
                props: { rowSpan: row.parentRowSpan },
            }),
        },
        {
            title: 'Tổng số nhân viên',
            dataIndex: 'parentEmployeeCount',
            align: 'center',
            width: '10%',
            render: (text, row) => ({
                children: text,
                props: { rowSpan: row.parentRowSpan },
            }),
        },
        {
            title: 'Nhóm / Bộ phận',
            dataIndex: 'subName',
            align: 'center',
            width: '25%',
            render: (text) => text || <i>—</i>,
        },
        {
            title: 'Mã nhóm',
            dataIndex: 'subCode',
            align: 'center',
            width: '25%',
            render: (text) => text || <i>—</i>,
        },
        {
            title: 'Số nhân viên nhóm',
            dataIndex: 'subEmployeeCount',
            align: 'center',
            width: '10%',
        },
        {
            title: 'Hành động',
            key: 'action',
            align: 'center',
            width: '20%',
            render: (_, record) => (
                <Space>
                    <Button
                        icon={<EditOutlined />}
                        type="link"
                        onClick={() => handleEdit(record)}
                    >
                        Sửa
                    </Button>
                    <Button
                        icon={<DeleteOutlined />}
                        type="link"
                        danger
                        onClick={() => handleDelete(record)}
                    >
                        Xóa
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Button
                type="primary"
                style={{ marginBottom: 16 }}
                onClick={handleAdd}
            >
                Thêm phòng ban
            </Button>

            <Table
                bordered
                loading={loading}
                columns={columns}
                dataSource={tableData}
                pagination={false}
            />

            <Modal
                title={editingDepartment ? 'Sửa phòng ban' : 'Thêm phòng ban'}
                open={modalVisible}
                onCancel={() => {
                    setModalVisible(false);
                    setEditingDepartment(null);
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
                        label="Tên phòng ban"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên phòng ban' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Mã phòng ban"
                        name="code"
                        rules={[{ required: true, message: 'Vui lòng nhập mã phòng ban' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item label="Phòng ban" name="parentDepartmentId">
                        <Select allowClear placeholder="Chọn phòng ban">
                            {rootDepartments.map(dep => (
                                <Select.Option key={dep.id} value={dep.id}>
                                    {dep.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default DepartmentManagerPage;
