import React, { useState, useEffect } from 'react';
import { Tabs, DatePicker, Space, Card, Row, Col, Table, message, Tag, Steps } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import productService from '~/services/productService';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList,
    Legend
} from 'recharts';
import isoWeek from 'dayjs/plugin/isoWeek';
import useColumnSearch from '~/hook/useColumnSearch';
import ModernCard from '~/components/ModernCard';
import { AntDesignOutlined, ApiOutlined, FileDoneOutlined, ScissorOutlined, ShoppingCartOutlined } from '@ant-design/icons';
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
    const [productQuantityStageBeingDone, setProductQuantityStageBeingDone] = useState([]);
    const [productTestSummaryByEmployee, setProductTestSummaryByEmployee] = useState([]);
    const [summary, setSummary] = useState({ tayGa: [], banCat: [], jig: [] });

    const { getColumnSearchProps } = useColumnSearch();

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                setLoading(true);

                let params = {};
                let startDate, endDate;

                if (activeMode === 'day' && selectedDate) {
                    params.date = selectedDate.format('YYYY-MM-DD');

                    startDate = params.date;
                    endDate = params.date;
                }
                else if (activeMode === 'week' && selectedWeek) {
                    params.week = selectedWeek.isoWeek();
                    params.year = selectedWeek.year();

                    startDate = selectedWeek.startOf('isoWeek').format('YYYY-MM-DD');
                    endDate = selectedWeek.endOf('isoWeek').format('YYYY-MM-DD');
                }
                else if (activeMode === 'month' && selectedMonth) {
                    params.month = selectedMonth.month() + 1;
                    params.year = selectedMonth.year();

                    startDate = selectedMonth.startOf('month').format('YYYY-MM-DD');
                    endDate = selectedMonth.endOf('month').format('YYYY-MM-DD');
                }

                const res = await productService.getProductSummary(params);
                setSummary(res || { tayGa: [], banCat: [], jig: [] });

                // Chỉ gọi khi mode là tuần hoặc tháng
                if (activeMode === 'week' || activeMode === 'month') {
                    const data = await productService.getProductTestSummaryByEmployee(startDate, endDate);
                    setProductTestSummaryByEmployee(data || []);
                } else {
                    setProductTestSummaryByEmployee([]); // clear dữ liệu khi không cần
                }
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
        const fetchQuantityByStagesBeingDone = async () => {
            try {
                setLoading(true);
                const data = await productService.getQuantityProductByStagesIsBeingDone();
                setProductQuantityStageBeingDone(data || []);
            } catch (err) {
                message.error('Lỗi khi tải số lượng sản phẩm theo giai đoạn');
            } finally {
                setLoading(false);
            }
        }
        fetchStatuses();
        fetchQuantityByStagesBeingDone()
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
        {
            title: 'Nhân viên phụ trách', dataIndex: 'employee', key: 'employee',
            ...getColumnSearchProps('employee')
        },
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
    const data = [
        { employee: 'Nguyễn Chí Công', 'Tay gá': 4, 'Bàn cắt': 2, JIG: 1 },
        { employee: 'Cao Việt Tú', 'Tay gá': 1, 'Bàn cắt': 3, JIG: 2 },
        { employee: 'Nguyễn Minh Hiếu', 'Tay gá': 2, 'Bàn cắt': 1, JIG: 4 },
        { employee: 'Nguyễn Văn Thắng', 'Tay gá': 3, 'Bàn cắt': 0, JIG: 2 },
        { employee: 'Phạm Tiến Đạt', 'Tay gá': 2, 'Bàn cắt': 1, JIG: 3 },
    ];

    const stepStages = [
        { key: 'Đang thiết kế', data: productQuantityStageBeingDone.designing, icon: <AntDesignOutlined />, status: 'process' },
        { key: 'Đang mua hàng', data: productQuantityStageBeingDone.purchasing, icon: <ShoppingCartOutlined />, status: 'wait' },
        { key: 'Đang gia công', data: productQuantityStageBeingDone.processing, icon: <ScissorOutlined />, status: 'wait' },
        { key: 'Đang lắp ráp', data: productQuantityStageBeingDone.assembling, icon: <ApiOutlined />, status: 'wait' },
        { key: 'Đang bàn giao', data: productQuantityStageBeingDone.delivering, icon: <FileDoneOutlined />, status: 'wait' },
    ];

    const stepsItems = stepStages.map(stage => ({
        title: stage.key,
        status: 'finish',
        icon: stage.icon,
        description: (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 80,
                }}
            >
                <h1
                    style={{
                        fontSize: 30,
                        fontWeight: 'bold',
                        margin: 0,
                        color: '#95827eff',
                    }}
                >
                    {stage.data || 0}
                </h1>
            </div>
        )
    }));


    return (
        <div>
            <Row gutter={16} >
                <Col xs={12} md={12}>
                    <ModernCard title="TỔNG HOÀN THÀNH">
                        <div
                            style={{
                                textAlign: 'center',
                                fontSize: 36,
                                fontWeight: 'bold',
                                color: '#41ff16ff',
                            }}
                        >
                            {productQuantityStageBeingDone.completed}
                        </div>
                    </ModernCard>
                </Col>

                <Col xs={12} md={12}>
                    <ModernCard title="TỔNG TRIỂN KHAI">
                        <div
                            style={{
                                textAlign: 'center',
                                fontSize: 36,
                                fontWeight: 'bold',
                                color: '#ff2216ff',
                            }}
                        >
                            {productQuantityStageBeingDone.isBeing}
                        </div>
                    </ModernCard>
                </Col>
            </Row>

            <Row gutter={16} style={{ marginTop: 16 }}>
                <Col span={24}>
                    <ModernCard title="SẢN PHẨM ĐANG TRIỂN KHAI">
                        <Steps items={stepsItems} />
                    </ModernCard>
                </Col>
            </Row>

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
                        <ReportCard title="Tay gá" color="#3C7363" data={summary.tayGa} />
                    </Col>
                    <Col xs={24} md={8}>
                        <ReportCard title="Bàn cắt" color="#033859" data={summary.banCat} />
                    </Col>
                    <Col xs={24} md={8}>
                        <ReportCard title="Jig" color="#A02C2D" data={summary.jig} />
                    </Col>

                    {activeMode !== 'day' && (
                        <Col xs={24} md={12}>
                            <Card
                                title={<h2 style={{ marginBottom: 0 }}>Thống kê sản phẩm hoàn thành theo nhân viên</h2>}
                                style={{
                                    borderTop: `4px solid red`,
                                    borderRadius: 12,
                                }}
                                hoverable
                                styles={{
                                    body: { padding: '12px 12px 16px 12px' },
                                }}
                            >
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={productTestSummaryByEmployee}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="employeeName" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="tayga" stackId="a" fill="#1677ff" >
                                            <LabelList dataKey="tayga" position="center" />
                                        </Bar>
                                        <Bar dataKey="bancat" stackId="a" fill="#52c41a" >
                                            <LabelList dataKey="bancat" position="center" />
                                        </Bar>
                                        <Bar dataKey="jig" stackId="a" fill="#fa8c16" >
                                            <LabelList dataKey="jig" position="center" />
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                        </Col>
                    )}

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
                            showTotal: (total, range) => `Hiển thị ${range[0]}-${range[1]} trên tổng ${total} sản phẩm`
                        }}
                    />
                </div>
            </Space>
        </div >
    );
}

export default TabReport;
