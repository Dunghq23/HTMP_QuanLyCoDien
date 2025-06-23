import React, { useEffect, useState } from 'react';
import {
    Table,
    Typography,
    message,
    Space,
    Button,
} from 'antd';
import dayjs from 'dayjs';
import dailyWorkReportService from '~/services/dailyWorkReportService';

const { Title } = Typography;

const CoDienQuanLyCongViecHangNgayPage = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchReports = async () => {
        setLoading(true);
        try {
            const res = await dailyWorkReportService.getAll();
            console.log(res);

            setReports(res.data || []);
        } catch (error) {
            console.error(error);
            message.error('Lỗi khi tải dữ liệu báo cáo công việc');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const columns = [
        {
            title: 'STT',
            render: (_, __, index) => index + 1,
            width: 60,
        },
        {
            title: 'Ngày',
            dataIndex: 'reportDate',
            render: (text) => dayjs(text).format('DD/MM/YYYY'),
        },
        {
            title: 'Mã nhân viên',
            dataIndex: 'employeeCode',
            filters: [...new Set(reports.map(r => r.employeeCode))].map(code => ({
                text: code,
                value: code
            })),
            onFilter: (value, record) => record.employeeCode === value,
        },
        {
            title: 'Tên nhân viên',
            dataIndex: 'employeeName',
            filters: [...new Set(reports.map(r => r.employeeName))].map(name => ({
                text: name,
                value: name
            })),
            onFilter: (value, record) => record.employeeName === value,
        },
        {
            title: 'Nội dung công việc',
            dataIndex: 'taskDescription',
        },
        {
            title: 'Thời gian bắt đầu',
            dataIndex: 'startTime',
        },
        {
            title: 'Thời gian kết thúc',
            dataIndex: 'endTime',
        },
        {
            title: 'Tệp đính kèm',
            dataIndex: 'filePath',
            render: (text) =>
                text ? (
                    <a href={text} target="_blank" rel="noopener noreferrer">
                        Xem file({text})
                    </a>
                ) : (
                    '—'
                ),
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button type="link">Sửa</Button>
                    <Button type="link" danger>
                        Xóa
                    </Button>
                </Space>
            ),
        },
    ];


    return (
        <div>
            <Title level={3}>Công việc hàng ngày</Title>
            <Table
                rowKey="id"
                columns={columns}
                dataSource={reports}
                loading={loading}
                bordered
                scroll={{ y: 'calc(100vh - 300px)' }} // 👈 Thêm dòng này để bật scroll dọc
            />

        </div>
    );
};

export default CoDienQuanLyCongViecHangNgayPage;
