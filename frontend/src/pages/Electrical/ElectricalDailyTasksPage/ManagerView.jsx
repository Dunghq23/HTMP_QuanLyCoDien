import React, { useState, useEffect, useCallback } from 'react';
import { Table, Space, Button, DatePicker, Form, message, Select, Image, Progress } from 'antd';
import dayjs from 'dayjs';
import dailyWorkReportService from '~/services/dailyWorkReportService';
import TaskTable from './TaskTable';
import { Gantt, ViewMode } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";
import CustomTooltip from './CustomTooltip';
import { useMemo } from 'react';
import { mapToGanttTask } from './gantt';

const ManagerView = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(dayjs());

    const [rowViewModes, setRowViewModes] = useState({}); // { employeeId: "table" | "gantt" }



    /** API fetch */
    const fetchReports = useCallback(async () => {
        setLoading(true);
        try {
            const date = selectedDate.format('YYYY-MM-DD');
            const res = await dailyWorkReportService.getByDate(date);
            setReports(res?.data || []);
        } catch (err) {
            message.error('Lỗi khi tải dữ liệu báo cáo công việc');
        } finally {
            setLoading(false);
        }
    }, [selectedDate]);

    useEffect(() => {
        fetchReports();
    }, [fetchReports]);


    const handleRowViewModeChange = (empId, mode) => {
        setRowViewModes(prev => ({ ...prev, [empId]: mode }));
    };

    const departmentFilters = useMemo(() => {
        if (!reports || reports.length === 0) return [];
        return Array.from(new Set(reports.map(r => r.departmentName)))
            .map(name => ({ text: name, value: name }));
    }, [reports]);

    const columns = [
        { title: 'Tên nhân viên', dataIndex: 'employeeName' },
        { title: 'Mã nhân viên', dataIndex: 'employeeCode', align: 'center' },
        {
            title: 'Nhóm', dataIndex: 'departmentName', align: 'center',
            filters: departmentFilters, 
            onFilter: (value, record) => record.departmentName === value,
        },
        { title: 'Thời gian bắt đầu', dataIndex: 'startTime', align: 'center' },
        { title: 'Thời gian kết thúc', dataIndex: 'endTime', align: 'center' },
        {
            title: 'Hiệu suất công việc',
            dataIndex: 'workEfficiency',
            align: 'center',
            render: (value) => <Progress percent={parseInt(value, 10)} />
        }
    ];

    return (
        <div>
            <Space style={{ marginBottom: 16 }}>
                <DatePicker value={selectedDate} onChange={setSelectedDate} />
                <Button onClick={() => setSelectedDate(dayjs())}>Hôm nay</Button>
            </Space>

            {/* Table expandable theo nhân viên */}
            <Table
                rowKey="employeeId"
                columns={columns}
                dataSource={reports}
                loading={loading}
                bordered
                expandable={{
                    expandedRowRender: (record) => {
                        const mode = rowViewModes[record.employeeId] || "table";
                        return (
                            <div>
                                <Space style={{ marginBottom: 8 }}>
                                    <Select
                                        value={mode}
                                        onChange={(val) => handleRowViewModeChange(record.employeeId, val)}
                                        options={[
                                            { value: "table", label: "Dạng bảng" },
                                            { value: "gantt", label: "Dạng Gantt" },
                                        ]}
                                        size="small"
                                    />
                                </Space>

                                {mode === "table" ? (
                                    <TaskTable
                                        dataSource={record.reports}
                                        columns={[
                                            {
                                                title: 'STT',
                                                dataIndex: 'index',
                                                align: 'center',
                                                width: 60,
                                                render: (text, r, index) => index + 1,
                                            },
                                            { title: 'Nội dung công việc', dataIndex: 'taskDescription' },
                                            { title: 'Thời gian bắt đầu', dataIndex: 'startTime', align: 'center' },
                                            { title: 'Thời gian kết thúc', dataIndex: 'endTime', align: 'center' },
                                            {
                                                title: 'Hình ảnh',
                                                dataIndex: 'filePath',
                                                align: 'center',
                                                render: (_, r) => r.filePath
                                                    ? <Image width={80} src={`${process.env.REACT_APP_UPLOAD_URL}/${r.filePath}`} />
                                                    : '-'
                                            },
                                        ]}
                                        isAdmin={false}
                                    />
                                ) : (
                                    <Gantt
                                        tasks={record.reports.filter(r => r.startTime && r.endTime).map(mapToGanttTask)}
                                        viewMode={ViewMode.Hour}
                                        listCellWidth=""
                                        columnWidth={65}
                                        rowHeight={40}
                                        fontSize={12}
                                        TooltipContent={CustomTooltip}
                                    />
                                )}
                            </div>
                        );
                    },
                }}
            />
        </div>
    );
};

export default ManagerView;