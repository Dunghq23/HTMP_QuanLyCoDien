import React, { useState } from "react";
import { Typography, Tabs } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import "./EmployeeSchedule.css";

import WorkScheduleTab from "./WorkScheduleTab";
import ShiftConfigTab from "./ShiftConfigTab";

const { Title } = Typography;
const { TabPane } = Tabs;

const EmployeeSchedule = () => {
  const [selectedMonth, setSelectedMonth] = useState(dayjs());

  return (
    <div className="employee-schedule">
      <Title level={3} className="schedule-title">
        Lịch làm việc nhân viên - {selectedMonth.format("MM/YYYY")}
      </Title>

      <Tabs
        defaultActiveKey="1"
        items={[
          {
            key: "1",
            label: "Xem lịch làm việc",
            children: (
              <WorkScheduleTab
                selectedMonth={selectedMonth}
                onChangeMonth={setSelectedMonth}
              />
            ),
          },
          {
            key: "2",
            label: "Cấu hình giờ làm",
            children: <ShiftConfigTab />,
          },
        ]}
      />

    </div>
  );
};

export default EmployeeSchedule;
