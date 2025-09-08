import React, { useEffect, useState } from "react";
import { Table, Row, Col, Card, DatePicker, message, Button } from "antd";
import DepartmentTree from "~/components/DepartmentTree";
import workScheduleService from "~/services/workScheduleService";
import dayjs from "dayjs";

const weekdaysMap = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
const shiftCodeList = ["HCT1", "HCT2", "HCT3", "C1", "C2", "C3", "KO", "KD", "HC150", "HC200", "KO150", "KD150", "KO200", "KD200", "XL", "HCL", "XL1", "PL"];

const WorkScheduleTab = ({ selectedMonth, onChangeMonth }) => {
    const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [employeeSchedules, setEmployeeSchedules] = useState([]);

    useEffect(() => {
        if (!selectedDepartmentId) return;
        const fetchWorkSchedule = async () => {
            try {
                setLoading(true);
                const data = await workScheduleService.getWorkScheduleByDepartment(
                    selectedDepartmentId,
                    selectedMonth.month() + 1,
                    selectedMonth.year()
                );
                setEmployeeSchedules(data || []);
            } catch (error) {
                message.error(error.message || "Lỗi khi tải lịch làm việc");
            } finally {
                setLoading(false);
            }
        };
        fetchWorkSchedule();
    }, [selectedDepartmentId, selectedMonth]);

    // Mảng ngày trong tháng
    const year = selectedMonth.year();
    const month = selectedMonth.month() + 1;
    const startDate = dayjs(`${year}-${String(month).padStart(2, "0")}-01`);
    const daysInMonth = startDate.daysInMonth();

    const daysArray = Array.from({ length: daysInMonth }, (_, i) => {
        const date = startDate.add(i, "day");
        return { day: String(i + 1).padStart(2, "0"), weekday: date.day() };
    });

    // Cột ngày
    const dayColumnsUI = daysArray.map((d, idx) => ({
        title: (
            <div style={{ color: d.weekday === 0 ? "red" : d.weekday === 6 ? "orange" : "inherit" }}>
                {d.day}
                <br />
                <small>({weekdaysMap[d.weekday]})</small>
            </div>
        ),
        dataIndex: `day${idx + 1}`,
        key: `day${idx + 1}`,
        align: "center",
        width: 50,
        render: (text) => (
            <div
                className={
                    shiftCodeList.includes(text)
                        ? `shift-cell ${text}`
                        : d.weekday === 0
                            ? "sunday"
                            : d.weekday === 6
                                ? "saturday"
                                : ""
                }
            >
                {text}
            </div>
        ),
    }));

    const employeeColumns = [
        { title: "STT", key: "stt", fixed: "left", width: 40, align: "center", render: (_, __, index) => index + 1 },
        { title: "Họ và Tên", dataIndex: "name", key: "name", fixed: "left", width: 150 },
        { title: "MSNV", dataIndex: "msnv", key: "msnv", fixed: "left", width: 60, align: "center" },
        ...dayColumnsUI,
    ];

    const employeeData = employeeSchedules.map((emp) => {
        const dayColumns = {};
        for (let i = 1; i <= daysInMonth; i++) {
            const dayStr = String(i).padStart(2, "0");
            const dateKey = `${year}-${String(month).padStart(2, "0")}-${dayStr}`;
            dayColumns[`day${i}`] = emp.days?.[dateKey] || "";
        }
        return {
            key: emp.employeeId,
            name: emp.employeeName,
            msnv: emp.employeeCode,
            ...dayColumns,
        };
    });

    return (
        <>
            <Row gutter={[8, 8]} style={{ marginBottom: 12 }}>
                <Col>
                    <DatePicker
                        picker="month"
                        value={selectedMonth}
                        onChange={(value) => value && onChangeMonth(value)}
                        format="MM/YYYY"
                        allowClear={false}
                    />
                </Col>
                <Col>
                    <Button
                        type="primary"
                        disabled={!selectedDepartmentId}
                        onClick={async () => {
                            try {
                                await workScheduleService.exportWorkSchedule(
                                    selectedDepartmentId,
                                    selectedMonth.year(),
                                    selectedMonth.month() + 1
                                );
                                message.success("Xuất Excel thành công!");
                            } catch (err) {
                                message.error(err.message);
                            }
                        }}
                    >
                        Xuất Excel
                    </Button>
                </Col>
            </Row>
            <Row gutter={[16, 16]}>
                <Col xs={24} md={4}>
                    <Card title="Chọn phòng ban">
                        <DepartmentTree onSelectDepartment={setSelectedDepartmentId} />
                    </Card>
                </Col>
                <Col xs={24} md={20}>
                    <Table
                        columns={employeeColumns}
                        dataSource={employeeData}
                        bordered
                        size="small"
                        scroll={{ x: "max-content" }}
                        pagination={false}
                        className="custom-table"
                        loading={loading}
                    />
                </Col>
            </Row>
        </>
    );
};

export default WorkScheduleTab;
