import React, { useState, useEffect, useMemo } from "react";
import {
    Table,
    Typography,
    DatePicker,
    Select,
    Button,
    message,
} from "antd";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import "antd/dist/reset.css";
import employeeService from "~/services/employeeService";
import shiftService from "~/services/shiftService";
import workScheduleService from "~/services/workScheduleService";
import "./WorkSchedule.css";

const { Title } = Typography;
const weekdaysMap = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

const WorkSchedule = () => {
    const departmentId = localStorage.getItem("departmentId");

    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [employees, setEmployees] = useState([]);
    const [data, setData] = useState([]);
    const [shifts, setShifts] = useState([]);
    const [schedules, setSchedules] = useState([]); // ✅ thêm state
    const [globalDefaultShift, setGlobalDefaultShift] = useState(null);

    // Map nhanh từ shiftId -> shift
    const shiftById = useMemo(() => {
        const m = new Map();
        shifts.forEach(s => m.set(s.id, s));
        return m;
    }, [shifts]);

    useEffect(() => {
        const fetchData = async () => {
            if (!departmentId) return;

            try {
                const [emps, shiftsRes, schedulesRes] = await Promise.all([
                    employeeService.getEmployeesByDepartment(departmentId),
                    shiftService.getAllShifts(),
                    workScheduleService.getWorkScheduleByDepartment(
                        departmentId,
                        selectedDate.month() + 1,
                        selectedDate.year()
                    )
                ]);

                setEmployees(emps);
                setShifts(shiftsRes);
                setSchedules(schedulesRes); // ✅ lưu lại schedules

                setData(transformEmployeesToTableData(emps, selectedDate, schedulesRes, shiftsRes));
            } catch (err) {
                message.error(err.message || "Không tải được dữ liệu");
            }
        };

        fetchData();
    }, [departmentId, selectedDate]);

    const transformEmployeesToTableData = (employees, selectedDate, schedules = [], shifts = []) => {
        const daysInMonth = selectedDate.daysInMonth();
        const shiftMapByCode = new Map(shifts.map(s => [s.shiftCode, s.id]));

        const scheduleMap = new Map(schedules.map(s => [s.employeeId, s.days]));

        return employees.map((emp, index) => {
            const empSchedule = scheduleMap.get(emp.id) || {};
            const row = {
                key: emp.id,
                stt: index + 1,
                name: emp.name,
                employeeCode: emp.code || "",
                defaultShift: null,
            };

            for (let i = 1; i <= daysInMonth; i++) {
                const dateStr = selectedDate.date(i).format("YYYY-MM-DD");
                const shiftCode = empSchedule[dateStr];
                row[`day${i}`] = shiftCode ? shiftMapByCode.get(shiftCode) ?? null : null;
            }

            return row;
        });
    };

    const handleMonthChange = (date) => {
        if (!date) return;
        setSelectedDate(date);
        // ✅ dùng state employees, schedules, shifts
        setData(transformEmployeesToTableData(employees, date, schedules, shifts));
    };


    const handleShiftChange = (rowIndex, field, value) => {
        const newData = [...data];
        newData[rowIndex][field] = value; // value = shiftId
        setData(newData);
    };



    // Chỉ áp dụng mặc định T2..T6, T7/CN = null
    const handleDefaultShiftChange = (rowIndex, value) => {
        const newData = [...data];
        newData[rowIndex].defaultShift = value;

        const year = selectedDate.year();
        const month = selectedDate.month(); // month trong dayjs là 0-11
        const days = selectedDate.daysInMonth();

        const selectedShift = shiftById.get(value);

        for (let i = 1; i <= days; i++) {
            const date = dayjs(`${year}-${month + 1}-${i}`);

            if (selectedShift?.shiftCode === "HCT1") {
                // ✅ Làm tất cả, nghỉ Chủ nhật
                newData[rowIndex][`day${i}`] = (date.day() === 0) ? null : value;
            } else if (selectedShift?.shiftCode === "KO" || selectedShift?.shiftCode === "KD" || selectedShift?.shiftCode === "KO150" || selectedShift?.shiftCode === "KO200" || selectedShift?.shiftCode === "KD150" || selectedShift?.shiftCode === "KD200") {
                newData[rowIndex][`day${i}`] = value;
            } else {
                newData[rowIndex][`day${i}`] = (date.day() === 0 || date.day() === 6) ? null : value;
            }
        }

        setData(newData);
    };


    const handleGlobalDefaultShiftChange = (value) => {
        setGlobalDefaultShift(value);

        const year = selectedDate.year();
        const month = selectedDate.month(); // 0-11
        const days = selectedDate.daysInMonth();

        const selectedShift = shiftById.get(value); // ✅ Lấy ca làm từ shiftId

        const newData = data.map((row) => {
            const updatedRow = { ...row, defaultShift: value };

            if (selectedShift?.shiftCode === "HCT1") {
                // ✅ Làm tất cả, nghỉ Chủ nhật
                for (let i = 1; i <= days; i++) {
                    const date = dayjs(`${year}-${month + 1}-${i}`);
                    updatedRow[`day${i}`] = date.day() === 0 ? null : value;
                }
            } else if (
                selectedShift?.shiftCode === "KO" ||
                selectedShift?.shiftCode === "KD" ||
                selectedShift?.shiftCode === "KO150" ||
                selectedShift?.shiftCode === "KO200" ||
                selectedShift?.shiftCode === "KD150" ||
                selectedShift?.shiftCode === "KD200"
            ) {
                // ✅ Các ca kíp: tạm thời gán full tháng (có thể cải tiến 4-2)
                for (let i = 1; i <= days; i++) {
                    updatedRow[`day${i}`] = value;
                }
            } else {
                // ✅ Mặc định: nghỉ Thứ 7 và Chủ nhật
                for (let i = 1; i <= days; i++) {
                    const date = dayjs(`${year}-${month + 1}-${i}`);
                    updatedRow[`day${i}`] = (date.day() === 0 || date.day() === 6) ? null : value;
                }
            }

            return updatedRow;
        });

        setData(newData);
    };


    const handleSave = async () => {
        try {
            const year = selectedDate.year();
            const month = selectedDate.month();
            const daysInMonth = selectedDate.daysInMonth();

            const payload = data.map(row => {
                const daysObj = {};
                for (let i = 1; i <= daysInMonth; i++) {
                    const dateStr = dayjs(`${year}-${month + 1}-${i}`).format("YYYY-MM-DD");
                    daysObj[dateStr] = row[`day${i}`] || null;
                }
                return {
                    employeeId: row.key,
                    days: daysObj
                };
            });

            await workScheduleService.saveSchedulesOnce(payload);
            message.success("Đã lưu lịch làm việc!");
        } catch (error) {
            console.error("Lỗi khi lưu lịch:", error);
            const errorMsg =
                error?.response?.data?.message || // Lấy message từ BE
                error?.message || // Nếu không có thì lấy message của axios
                "Có lỗi xảy ra khi lưu lịch làm việc"; // fallback
            message.error(errorMsg);
        }
    };


    const daysInMonth = selectedDate.daysInMonth();
    const startDate = selectedDate.startOf("month");

    const dayColumns = Array.from({ length: daysInMonth }, (_, i) => {
        const date = startDate.add(i, "day");
        const weekday = date.day();

        return {
            title: (
                <div
                    className={
                        weekday === 0
                            ? "sunday-header"
                            : weekday === 6
                                ? "saturday-header"
                                : ""
                    }
                >
                    {String(i + 1).padStart(2, "0")}
                    <br />
                    <small>({weekdaysMap[weekday]})</small>
                </div>
            ),
            dataIndex: `day${i + 1}`,
            key: `day${i + 1}`,
            align: "center",
            width: 60,
            render: (value, record, rowIndex) => {
                // value = shiftId; Lấy shiftCode để gán class cho CSS cũ hoạt động
                const shiftCode = value ? (shiftById.get(value)?.shiftCode || "") : "";
                const cellClass =
                    shiftCode
                        ? `shift-cell ${shiftCode}`
                        : weekday === 0
                            ? "sunday"
                            : weekday === 6
                                ? "saturday"
                                : "";

                return (
                    <div className={cellClass}>
                        <Select
                            value={value}
                            onChange={(val) => handleShiftChange(rowIndex, `day${i + 1}`, val ?? null)}
                            variant={false}
                            allowClear
                        >
                            {shifts.map((s) => (
                                <Select.Option key={s.id} value={s.id}>
                                    {s.shiftCode}
                                </Select.Option>
                            ))}
                        </Select>
                    </div>
                );
            },
        };
    });

    const defaultColumn = {
        title: "Mặc định",
        dataIndex: "defaultShift",
        key: "defaultShift",
        align: "center",
        fixed: "left",
        width: 50,
        render: (value, record, rowIndex) => (
            <Select
                value={value}
                onChange={(val) => handleDefaultShiftChange(rowIndex, val)}
                variant={false}
            >
                {shifts.map((s) => (
                    <Select.Option key={s.id} value={s.id}>
                        {s.shiftCode}
                    </Select.Option>
                ))}
            </Select>
        ),
    };

    const columns = [
        { title: "STT", dataIndex: "stt", key: "stt", fixed: "left", width: 40, align: "center" },
        { title: "Họ và Tên", dataIndex: "name", key: "name", fixed: "left", width: 100 },
        { title: "MSNV", dataIndex: "employeeCode", key: "employeeCode", fixed: "left", width: 50, align: "center" },
        defaultColumn,
        ...dayColumns,
    ];

    return (
        <div className="work-schedule">
            <div className="header">
                <Title level={3} style={{ textAlign: "center", flex: 1 }}>
                    XẾP LỊCH LÀM VIỆC NHÂN VIÊN <br />
                    THÁNG {selectedDate.month() + 1} NĂM {selectedDate.year()}
                </Title>
            </div>

            <div
                style={{
                    marginBottom: 16,
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 16,
                }}
            >
                <DatePicker
                    picker="month"
                    value={selectedDate}
                    onChange={handleMonthChange}
                    format="MM-YYYY"
                />

                <Select
                    placeholder="Ca mặc định toàn bộ"
                    value={globalDefaultShift}
                    onChange={handleGlobalDefaultShiftChange}
                // KHÔNG set width inline để giữ CSS của bạn
                >
                    {shifts.map((s) => (
                        <Select.Option key={s.id} value={s.id}>
                            {s.shiftCode}
                        </Select.Option>
                    ))}
                </Select>

                <Button type="primary" onClick={handleSave}>
                    Lưu Lịch Làm Việc
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={data}
                bordered
                size="middle"
                scroll={{ x: columns.length * 100 }}
                pagination={false}
                rowKey="key"
                className="custom-table"
            />
        </div>
    );
};

export default WorkSchedule;