import React, { useState } from "react";
import { Table, Button, Space, message, Card } from "antd";

const ManagerShiftApproval = () => {
    const [requests, setRequests] = useState([
        {
            key: 1,
            name: "Hoàng Trạng Kiện",
            msnv: "HP1616",
            date: "2025-05-10",
            currentShift: "HCT2",
            requestedShift: "L",
            reason: "Bận việc gia đình",
            status: "pending",
        },
        {
            key: 2,
            name: "Nguyễn Văn Thắng",
            msnv: "HP1606",
            date: "2025-05-12",
            currentShift: "L",
            requestedShift: "HCT1",
            reason: "Muốn tăng ca",
            status: "pending",
        },
    ]);

    const handleAction = (key, status) => {
        setRequests((prev) =>
            prev.map((req) =>
                req.key === key ? { ...req, status } : req
            )
        );
        message.success(`Đơn đã được ${status === "approved" ? "duyệt" : "từ chối"}`);
    };

    const columns = [
        { title: "Họ và Tên", dataIndex: "name", key: "name" },
        { title: "MSNV", dataIndex: "msnv", key: "msnv" },
        { title: "Ngày", dataIndex: "date", key: "date" },
        { title: "Ca hiện tại", dataIndex: "currentShift", key: "currentShift", align: "center" },
        { title: "Ca yêu cầu", dataIndex: "requestedShift", key: "requestedShift", align: "center" },
        { title: "Lý do", dataIndex: "reason", key: "reason" },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status) => {
                if (status === "pending") return "Chờ duyệt";
                if (status === "approved") return "Đã duyệt";
                return "Từ chối";
            },
        },
        {
            title: "Hành động",
            key: "action",
            render: (_, record) => (
                <Space>
                    <Button
                        type="primary"
                        size="small"
                        disabled={record.status !== "pending"}
                        onClick={() => handleAction(record.key, "approved")}
                    >
                        Duyệt
                    </Button>
                    <Button
                        danger
                        size="small"
                        disabled={record.status !== "pending"}
                        onClick={() => handleAction(record.key, "rejected")}
                    >
                        Từ chối
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <Card title="Duyệt đơn đổi ca của nhân viên">
            <Table columns={columns} dataSource={requests} pagination={false} bordered />
        </Card>
    );
};

export default ManagerShiftApproval;
