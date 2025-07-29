import React from "react";
import { Row, Col } from "antd";

const Superset_HOST = process.env.REACT_APP_SUPERSET_HOST;

const chartData = [
  {
    title: "Biểu đồ thống kê tình trạng dự án",
    key: "nkGZylRA58B",
    span: 8,
    height: "300px",
  },
  {
    title: "Biểu đồ thống kê loại dự án",
    key: "g8pYADk94MQ",
    span: 8,
    height: "300px",
  },
  {
    title: "Biểu đồ thống kê bên thực hiện dự án",
    key: "lVx090jeJ4Y",
    span: 8,
    height: "300px",
  },
  {
    title: "Biểu đồ thống kê công việc nhân viên tuần trước",
    key: "dlzgAQEAVrZ",
    span: 24,
    height: "400",
  },
];

const ChartCard = ({ title, chartKey, height}) => {
  const src = `${Superset_HOST}/superset/explore/p/${chartKey}/?standalone=1&height=400`;
  return (
    <div className="rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <iframe
        title={title}
        width="100%"
        height={height || "400px"}
        seamless
        frameBorder="0"
        scrolling="no"
        src={src}
      />
    </div>
  );
};

const HomePage = () => {
  return (
    <div className="flex justify-center p-4">
      <div className="w-full max-w-screen-xl">
        <Row gutter={16}>
          {chartData.map(({ title, key, span, height }) => (
            <Col key={key} span={span} className="mb-4">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h2>
              <ChartCard title={title} chartKey={key} height={height} />
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default HomePage;
