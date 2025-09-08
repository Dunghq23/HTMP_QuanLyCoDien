import React, { useState, useEffect } from "react";
import { Card, Table, Button, Modal, Form, DatePicker, Select, Input, message, Tag } from "antd";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import "dayjs/locale/vi";
import shiftService from "~/services/shiftService";
import workScheduleService from "~/services/workScheduleService";

dayjs.extend(isoWeek);
dayjs.locale("vi");

const { TextArea } = Input;
const weekdays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

const EmployeeWorkSchedule = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [shiftRequests, setShiftRequests] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [shifts, setShifts] = useState([]);
  const [schedule, setSchedule] = useState([]);

  // Lấy danh sách ca làm việc
  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const res = await shiftService.getAllShifts();
        setShifts(res);
      } catch (error) {
        message.error("Lấy danh sách ca làm việc thất bại");
      }
    };
    fetchShifts();
  }, []);

  // Lấy lịch làm việc thực từ API
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const employeeId = localStorage.getItem("employeeId"); // hoặc từ props/context
        const month = selectedDate.month() + 1;
        const year = selectedDate.year();

        const res = await workScheduleService.getWorkScheduleByEmployee(employeeId, month, year);
        // res.days = { "2025-08-01": "HCT1", "2025-08-02": "C2", ... }

        const start = selectedDate.startOf("month");
        const end = selectedDate.endOf("month");

        const calendar = [];
        let current = start.startOf("week");

        while (current.isBefore(end) || current.isSame(end, "day")) {
          const week = [];
          for (let i = 0; i < 7; i++) {
            const date = current.add(i, "day");
            const dateStr = date.format("YYYY-MM-DD");
            week.push({
              date,
              shift: res.days ? res.days[dateStr] || null : null,
            });
          }
          calendar.push(week);
          current = current.add(7, "day");
        }

        setSchedule(calendar);
      } catch (error) {
        message.error("Lấy lịch làm việc thất bại: " + error.message);
      }
    };

    fetchSchedule();
  }, [selectedDate]);

  const tableColumns = weekdays.map((day, i) => ({
    title: day,
    dataIndex: day,
    key: day,
    align: "center",
    render: (item) =>
      item?.shift ? (
        <div>
          <div>{item.shift}</div>
          <small>{item.date.format("DD/MM")}</small>
        </div>
      ) : null,
  }));

  const dataSource = schedule.map((week, index) => {
    const row = { key: index };
    weekdays.forEach((_, i) => {
      row[weekdays[i]] = week[i];
    });
    return row;
  });

  const handleSubmit = (values) => {
    const date = values.date;
    const newRequest = {
      key: shiftRequests.length + 1,
      date: date.format("YYYY-MM-DD"),
      currentShift: schedule
        .flat()
        .find((d) => d.date.isSame(date, "day"))?.shift,
      requestedShift: values.requestedShift,
      reason: values.reason,
      status: "pending",
    };
    setShiftRequests([...shiftRequests, newRequest]);
    message.success("Đã gửi đơn đổi ca!");
    form.resetFields();
    setModalVisible(false);
  };

  const requestColumns = [
    { title: "Ngày", dataIndex: "date", key: "date" },
    { title: "Ca hiện tại", dataIndex: "currentShift", key: "currentShift", align: "center" },
    { title: "Ca yêu cầu", dataIndex: "requestedShift", key: "requestedShift", align: "center" },
    { title: "Lý do", dataIndex: "reason", key: "reason" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        if (status === "pending") return <Tag color="blue">Chờ duyệt</Tag>;
        if (status === "approved") return <Tag color="green">Đã duyệt</Tag>;
        return <Tag color="red">Từ chối</Tag>;
      },
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Card
        title={`Lịch làm việc tháng ${selectedDate.month() + 1}/${selectedDate.year()}`}
        extra={
          <Button type="primary" onClick={() => setModalVisible(true)}>
            Yêu cầu đổi ca
          </Button>
        }
      >
        <DatePicker
          picker="month"
          value={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          format="MM-YYYY"
          style={{ marginBottom: 16 }}
        />
        <Table
          columns={tableColumns}
          dataSource={dataSource}
          bordered
          size="small"
          pagination={false}
        />
      </Card>

      <Card title="Lịch sử yêu cầu đổi ca" style={{ marginTop: 20 }}>
        <Table
          columns={requestColumns}
          dataSource={shiftRequests}
          bordered
          size="small"
          pagination={false}
        />
      </Card>

      <Modal
        title="Đơn xin đổi ca làm việc"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        destroyOnHidden
      >
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          <Form.Item
            name="date"
            label="Chọn ngày muốn đổi ca"
            rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
          >
            <DatePicker format="DD-MM-YYYY" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="requestedShift"
            label="Ca muốn đổi sang"
            rules={[{ required: true, message: "Vui lòng chọn ca muốn đổi" }]}
          >
            <Select placeholder="Chọn ca mới">
              {shifts.map((s) => (
                <Select.Option key={s.id} value={s.shiftCode}>
                  {s.shiftCode}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="reason" label="Lý do đổi ca" rules={[{ required: true }]}>
            <TextArea rows={3} placeholder="Nhập lý do..." />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Gửi đơn đổi ca
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EmployeeWorkSchedule;
