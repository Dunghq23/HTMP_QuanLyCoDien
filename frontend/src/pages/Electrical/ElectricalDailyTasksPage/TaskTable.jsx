import React from 'react';
import { Table, Space, Button, Popconfirm, Image } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const TaskTable = ({ dataSource, columns, isAdmin, onEdit, onDelete }) => {
    const actionColumn = isAdmin ? [{
        title: 'Hành động',
        dataIndex: 'action',
        align: 'center',
        render: (_, record) => (
            <Space size="middle">
                <Button type="link" icon={<EditOutlined />} onClick={() => onEdit(record)}>Sửa</Button>
                <Popconfirm
                    title="Bạn có chắc chắn muốn xóa báo cáo này?"
                    onConfirm={() => onDelete(record.id)}
                    okText="Xóa"
                    cancelText="Hủy"
                >
                    <Button type="link" danger icon={<DeleteOutlined />}>Xóa</Button>
                </Popconfirm>
            </Space>
        ),
    }] : [];

    return (
        <Table
            rowKey="id"
            columns={[...columns, ...actionColumn]}
            dataSource={dataSource}
            pagination={false}
            size="small"
            bordered
        />
    );
};

export default TaskTable;
