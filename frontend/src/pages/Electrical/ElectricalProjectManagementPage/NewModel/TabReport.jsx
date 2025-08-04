import React, { useState, useEffect } from 'react';
import { Tabs, DatePicker, Space, Card, Row, Col, Table, message, Tag } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import productService from '~/services/productService';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList
} from 'recharts';
import isoWeek from 'dayjs/plugin/isoWeek';
dayjs.extend(isoWeek);

function ReportCard({ title, color, data }) {
    return (
        <Card
            title={<h2 style={{ marginBottom: 0 }}>{title}</h2>}
            style={{ borderTop: `4px solid ${color}`, borderRadius: 12 }}
            hoverable
            bodyStyle={{ padding: '12px 12px 16px 12px' }}
        >
            <div style={{ width: '100%', height: 240 }}>
                <ResponsiveContainer>
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" allowDecimals={false} />
                        <YAxis type="category" dataKey="name" width={120} />
                        <Tooltip />
                        <Bar dataKey="value" fill={color} barSize={20}>
                            <LabelList dataKey="value" position="right" style={{ fill: '#000', fontWeight: 'bold' }} />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}

function TabReport() {
    const [activeMode, setActiveMode] = useState('day');
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [selectedWeek, setSelectedWeek] = useState(dayjs());
    const [selectedMonth, setSelectedMonth] = useState(dayjs());

    const [loading, setLoading] = useState(false);
    const [productData, setProductData] = useState([]);
    const [summary, setSummary] = useState({ tayGa: [], banCat: [], jig: [] });
    useEffect(() => {
        const fetchSummary = async () => {
            try {
                setLoading(true);

                let params = {};
                if (activeMode === 'day' && selectedDate) {
                    params.date = selectedDate.format('YYYY-MM-DD');
                } else if (activeMode === 'week' && selectedWeek) {
                    params.week = selectedWeek.isoWeek(); // ISO tuần
                    params.year = selectedWeek.year(); // Gửi kèm năm
                } else if (activeMode === 'month' && selectedMonth) {
                    params.month = selectedMonth.month() + 1;
                    params.year = selectedMonth.year();
                }

                const res = await productService.getProductSummary(params);
                setSummary(res || { tayGa: [], banCat: [], jig: [] });
            } catch (err) {
                message.error('Lỗi khi tải báo cáo tổng hợp');
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, [activeMode, selectedDate, selectedWeek, selectedMonth]);


    useEffect(() => {
        const fetchStatuses = async () => {
            try {
                setLoading(true);
                const res = await productService.getProductStatuses();
                setProductData(res || []);
            } catch (err) {
                message.error('Lỗi khi tải danh sách tình trạng sản phẩm');
            } finally {
                setLoading(false);
            }
        };
        fetchStatuses();
    }, []);

    const typeColors = {
        TAYGA: 'geekblue',
        BANCAT: 'green',
        JIG: 'volcano',
    };

    const statusColors = {
        'Đang thiết kế': 'blue',
        'Đang mua hàng': 'purple',
        'Đang gia công': 'orange',
        'Đang lắp ráp': 'gold',
        'Đang bàn giao': 'green',
        'Đang thử nghiệm': 'red',
    };

    const columns = [
        { title: 'STT', dataIndex: 'index', key: 'index', width: 70, render: (_, __, i) => i + 1 },
        { title: 'Mã sản phẩm', dataIndex: 'code', key: 'code' },
        { title: 'Mã khuôn', dataIndex: 'moldCode', key: 'moldCode' },
        { title: 'Tên sản phẩm', dataIndex: 'name', key: 'name' },
        { title: 'Nhân viên phụ trách', dataIndex: 'employee', key: 'employee' },
        {
            title: 'Loại',
            dataIndex: 'type',
            key: 'type',
            filters: [
                { text: 'Tay gá', value: 'TAYGA' },
                { text: 'Bàn cắt', value: 'BANCAT' },
                { text: 'Jig', value: 'JIG' },
            ],
            onFilter: (value, record) => record.type === value,
            render: (type) => {
                const color = typeColors[type] || 'default';
                const label = type === 'TAYGA' ? 'Tay gá' : type === 'BANCAT' ? 'Bàn cắt' : 'Jig';
                return <Tag color={color}>{label}</Tag>;
            },
        },
        {
            title: 'Trạng thái hiện tại',
            dataIndex: 'currentStatus',
            key: 'currentStatus',
            filters: Object.keys(statusColors).map((key) => ({ text: key, value: key })),
            onFilter: (value, record) => record.currentStatus === value,
            render: (status) => {
                const color = statusColors[status] || 'default';
                return <Tag color={color}>{status}</Tag>;
            },
        },
    ];

    return (
        <div>
            <Tabs
                activeKey={activeMode}
                onChange={setActiveMode}
                items={[
                    { key: 'day', label: 'Theo ngày' },
                    { key: 'week', label: 'Theo tuần' },
                    { key: 'month', label: 'Theo tháng' },
                ]}
            />

            <Space direction="vertical" style={{ width: '100%' }}>
                {activeMode === 'day' && (
                    <>
                        <DatePicker value={selectedDate} onChange={setSelectedDate} style={{ width: 200 }} />
                        <h4>Báo cáo ngày {selectedDate?.format('DD/MM/YYYY')}</h4>
                    </>
                )}
                {activeMode === 'week' && (
                    <>
                        <DatePicker picker="week" value={selectedWeek} onChange={setSelectedWeek} style={{ width: 200 }} />
                        <h4>Báo cáo tuần {selectedWeek?.week()}</h4>
                    </>
                )}
                {activeMode === 'month' && (
                    <>
                        <DatePicker picker="month" value={selectedMonth} onChange={setSelectedMonth} style={{ width: 200 }} />
                        <h4>Báo cáo tháng {selectedMonth?.format('MM/YYYY')}</h4>
                    </>
                )}

                <Row gutter={[16, 16]}>
                    <Col xs={24} md={8}>
                        <ReportCard title="Tay gá" color="#1677ff" data={summary.tayGa} />
                    </Col>
                    <Col xs={24} md={8}>
                        <ReportCard title="Bàn cắt" color="#52c41a" data={summary.banCat} />
                    </Col>
                    <Col xs={24} md={8}>
                        <ReportCard title="Jig" color="#fa8c16" data={summary.jig} />
                    </Col>
                </Row>

                <div style={{ marginTop: 24, width: '100%' }}>
                    <h4>Danh sách sản phẩm</h4>
                    <Table
                        dataSource={productData}
                        columns={columns}
                        rowKey={(record, index) => `${record.code}-${index}`}
                        loading={loading}
                        pagination={{
                            showSizeChanger: true,
                            pageSizeOptions: ['5', '10', '20', '50'],
                            defaultPageSize: 10,
                            showTotal: (total, range) => `Hiển thị ${range[0]}-${range[1]} trên tổng ${total} bản ghi`
                        }}
                    />
                </div>
            </Space>
        </div>
    );
}

export default TabReport;
