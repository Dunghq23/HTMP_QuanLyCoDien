import React, { useEffect, useState } from "react";
import { Table, Row, Button, Space, message, Badge } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

import shiftService from "~/services/shiftService";
import shiftBreakService from "~/services/shiftBreakService";
import AddShiftModal from "./AddShiftModal";
import AddShiftBreakModal from "./AddShiftBreakModal";

const ShiftConfigTab = () => {
    const [modalShiftVisible, setModalShiftVisible] = useState(false);
    const [modalShiftBreakVisible, setModalShiftBreakVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [shifts, setShifts] = useState([]);
    const [selectedShift, setSelectedShift] = useState(null);

    const [expandedRowKeys, setExpandedRowKeys] = useState([]);
    const [shiftBreaksByShift, setShiftBreaksByShift] = useState({});
    const [expandLoadingKey, setExpandLoadingKey] = useState(null);

    const [selectedBreak, setSelectedBreak] = useState(null);

    const navigate = useNavigate();

    // ================= LOAD CA =================
    const fetchShifts = async () => {
        try {
            const response = await shiftService.getAllShifts();
            setShifts(response || []);
        } catch (error) {
            message.error(error.message || "Lỗi khi tải danh sách ca làm việc");
        }
    };

    useEffect(() => {
        fetchShifts();
    }, []);

    // ================= LOAD GIỜ NGHỈ =================
    const loadShiftBreaks = async (shiftId) => {
        if (!shiftId) return;
        try {
            setExpandLoadingKey(shiftId);
            const data = await shiftBreakService.getShiftBreaksByShiftId(shiftId);
            setShiftBreaksByShift((prev) => ({ ...prev, [shiftId]: data || [] }));
        } catch (error) {
            message.error(error.message || "Lỗi khi tải giờ nghỉ của ca");
        } finally {
            setExpandLoadingKey(null);
        }
    };

    // ================= CỘT GIỜ NGHỈ =================
    const expandColumns = [
        { title: "Loại nghỉ", dataIndex: "breakType", key: "breakType", width: 140 },
        { title: "Bắt đầu", dataIndex: "startTime", key: "startTime", width: 140 },
        { title: "Kết thúc", dataIndex: "endTime", key: "endTime", width: 140 },
        { title: "Tổng (phút)", dataIndex: "duration", key: "duration", width: 160 },
        {
            title: "Tính lương",
            dataIndex: "isPaid",
            key: "isPaid",
            width: 140,
            render: (v) => (
                <Badge status={v ? "success" : "default"} text={v ? "Có" : "Không"} />
            ),
        },
        {
            title: "Hành động",
            key: "operation",
            render: (record) => (
                <Space size="small">
                    <Button
                        size="small"
                        onClick={() => {
                            setSelectedShift({ id: record.shiftId });
                            setSelectedBreak(record);
                            setModalShiftBreakVisible(true);
                        }}
                    >
                        Sửa
                    </Button>
                    <Button
                        size="small"
                        danger
                        onClick={async () => {
                            try {
                                await shiftBreakService.deleteShiftBreak(record.id);
                                message.success("Xóa giờ nghỉ thành công!");
                                if (record.shiftId) {
                                    await loadShiftBreaks(record.shiftId);
                                }
                            } catch (error) {
                                message.error(error.message || "Lỗi khi xóa giờ nghỉ");
                            }
                        }}
                    >
                        Xóa
                    </Button>
                </Space>
            ),
        }

    ];

    // ================= RENDER GIỜ NGHỈ =================
    const expandedRowRender = (parent) => {
        const shiftId = parent.id;
        const data = shiftBreaksByShift[shiftId] || [];
        return (
            <Table
                columns={expandColumns}
                dataSource={data}
                rowKey={(r, idx) => r.id ?? `${shiftId}-${idx}`}
                pagination={false}
                size="small"
                loading={expandLoadingKey === shiftId}
            />
        );
    };

    // ================= CỘT CA =================
    const shiftColumns = [
        {
            title: "Mã ca",
            dataIndex: "shiftCode",
            key: "shiftCode",
            width: 100,
            align: "center",
            render: (text) => <span className={`shift-code ${text}`}>{text}</span>,
        },
        { title: "Mô tả", dataIndex: "description", key: "description", width: 200 },
        {
            title: "Giờ bắt đầu",
            dataIndex: "startTime",
            key: "startTime",
            width: 110,
            align: "center",
            render: (text) => <span>{dayjs(text, "HH:mm").format("HH:mm")}</span>,
        },
        {
            title: "Giờ kết thúc",
            dataIndex: "endTime",
            key: "endTime",
            width: 110,
            align: "center",
            render: (text) => <span>{dayjs(text, "HH:mm").format("HH:mm")}</span>,
        },
        {
            title: "Hành động",
            key: "action",
            align: "center",
            width: 140,
            render: (record) => (
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                        setSelectedShift(record);
                        setModalShiftBreakVisible(true);
                    }}
                >
                    Thêm giờ nghỉ
                </Button>
            ),
        },
    ];

    // ================= ADD CA =================
    const handleAddShift = async (shiftData) => {
        setLoading(true);
        try {
            await shiftService.addShift(shiftData);
            message.success("Thêm ca làm việc thành công!");
            fetchShifts();
            setModalShiftVisible(false);
        } catch (error) {
            message.error(error.message || "Lỗi khi thêm ca");
        } finally {
            setLoading(false);
        }
    };

    // ================= EXPAND =================
    const handleExpand = async (expanded, record) => {
        const key = record.id;
        if (!key) return;
        if (expanded) {
            await loadShiftBreaks(key);
            setExpandedRowKeys([key]);
        } else {
            setExpandedRowKeys([]);
        }
    };

    return (
        <>
            <Row gutter={[8, 8]} style={{ marginBottom: 12 }}>
                <Space>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setModalShiftVisible(true)}
                    >
                        Thêm ca làm việc
                    </Button>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => navigate("/HR/schedules/work-schedule")}
                    >
                        Xếp lịch nhân viên
                    </Button>
                </Space>
            </Row>

            <Table
                columns={shiftColumns}
                dataSource={shifts}
                bordered
                size="small"
                pagination={false}
                rowKey={(r) => r.id ?? r.shiftCode}
                expandable={{
                    expandedRowRender,
                    expandedRowKeys,
                    onExpand: handleExpand,
                }}
            />

            {/* Modal thêm ca */}
            <AddShiftModal
                open={modalShiftVisible}
                onCancel={() => setModalShiftVisible(false)}
                onOk={handleAddShift}
                confirmLoading={loading}
                onSuccess={fetchShifts}
            />

            {/* Modal thêm/sửa giờ nghỉ */}
            <AddShiftBreakModal
                open={modalShiftBreakVisible}
                onCancel={() => {
                    setModalShiftBreakVisible(false);
                    setSelectedBreak(null); // reset khi đóng
                    setSelectedShift(null);
                }}
                shift={selectedShift}
                breakData={selectedBreak}   // ✅ truyền dữ liệu giờ nghỉ cũ
                onSuccess={async () => {
                    if (selectedShift?.id) {
                        await loadShiftBreaks(selectedShift.id);
                    }
                    setSelectedBreak(null);
                }}
            />

        </>
    );
};

export default ShiftConfigTab;
