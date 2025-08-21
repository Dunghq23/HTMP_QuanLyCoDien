import React, { useEffect, useState, useCallback } from 'react';
import { Table, Space, Button, DatePicker, Form, Popconfirm, message, Select, Image, Progress } from 'antd';
import dayjs from 'dayjs';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Gantt, ViewMode } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";

import dailyWorkReportService from '~/services/dailyWorkReportService';
import { getAllEmployees } from '~/services/employeeService';
import WorkReportFormModal from './WorkReportFormModal';
import CustomTooltip from './CustomTooltip';
import { mapToGanttTask } from './gantt';

const AdminView = () => {
    const [reports, setReports] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [employeeIdEditing, setEmployeeIdEditing] = useState(null);
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);   // quản lý row mở
    const [form] = Form.useForm();
    const [rowViewModes, setRowViewModes] = useState({});

    /** API */
    const fetchEmployees = async () => {
        try {
            const data = await getAllEmployees();
            setEmployees(data);
        } catch (err) {
            message.error('Lỗi khi tải danh sách nhân viên');
        }
    };

    const fetchReports = async (dateParam) => {
        setLoading(true);
        try {
            const date = dateParam || selectedDate.format("YYYY-MM-DD");
            const res = await dailyWorkReportService.getByDate(date);
            setReports(res?.data || []);
        } catch (err) {
            message.error("Lỗi khi tải dữ liệu báo cáo công việc");
        } finally {
            setLoading(false);
        }
    };

    // useEffect chỉ chạy khi selectedDate đổi
    useEffect(() => {
        fetchReports(selectedDate.format("YYYY-MM-DD"));
    }, [selectedDate]);

    useEffect(() => fetchEmployees(), []);

    const handleRowViewModeChange = (employeeId, mode) => {
        setRowViewModes(prev => ({ ...prev, [employeeId]: mode }));
    };

    /** Thêm mới */
    const handleAdd = () => {
        setEditingRecord(null);
        setEmployeeIdEditing(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    /** Sửa */
    const handleEdit = (record) => {
        setEditingRecord(record);
        setIsModalVisible(true);
        form.setFieldsValue({
            employeeId: record.employeeId,
            reportDate: record.reportDate ? dayjs(record.reportDate, "YYYY-MM-DD") : null,
            startTime: record.startTime ? dayjs(record.startTime, "HH:mm:ss") : null,
            endTime: record.endTime ? dayjs(record.endTime, "HH:mm:ss") : null,
            taskDescription: record.taskDescription,
            upload: record.filePath
                ? [{
                    uid: "-1",
                    name: record.filePath.split("/").pop(),
                    status: "done",
                    url: `${process.env.REACT_APP_UPLOAD_URL}/${record.filePath}`,
                }]
                : [],
        });
    };

    const handleDelete = async (id) => {
        try {
            const msg = await dailyWorkReportService.delete(id);
            message.success(msg);
            fetchReports();
        } catch (err) {
            message.error("Xóa thất bại: " + (err?.response?.data?.message || err.message));
        }
    };

    return (
        <div>
            <Space style={{ marginBottom: 16 }}>
                <DatePicker
                    value={selectedDate}
                    format="DD/MM/YYYY"
                    onChange={(date) => setSelectedDate(date || dayjs())}
                />
                <Button onClick={() => setSelectedDate(dayjs())}>Hôm nay</Button>
                <Button type="primary" onClick={handleAdd}>Thêm công việc</Button>
            </Space>

            <Table
                rowKey="employeeId"
                columns={[
                    { title: 'Tên nhân viên', dataIndex: 'employeeName' },
                    { title: 'Mã nhân viên', dataIndex: 'employeeCode', align: 'center' },
                    { title: 'Nhóm', dataIndex: 'departmentName', align: 'center' },
                    { title: 'Thời gian bắt đầu', dataIndex: 'startTime', align: 'center' },
                    { title: 'Thời gian kết thúc', dataIndex: 'endTime', align: 'center' },
                    {
                        title: 'Hiệu suất công việc',
                        dataIndex: 'workEfficiency',
                        align: 'center',
                        render: (value) => <Progress percent={parseInt(value, 10)} />
                    }

                ]}
                dataSource={reports}
                loading={loading}
                bordered
                expandable={{
                    expandedRowKeys,
                    onExpand: (expanded, record) => {
                        if (expanded) {
                            setExpandedRowKeys([record.employeeId]);   // chỉ mở 1
                            setEmployeeIdEditing(record.employeeId);
                        } else {
                            setExpandedRowKeys([]);
                            setEmployeeIdEditing(null);
                        }
                    },
                    expandedRowRender: (record) => {
                        const mode = rowViewModes[record.employeeId] || "table";
                        const childReports = record.reports || [];
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
                                    <Table
                                        rowKey="id"
                                        columns={[
                                            { title: 'STT', dataIndex: 'index', render: (_, __, idx) => idx + 1, width: 60, align: 'center' },
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
                                            {
                                                title: 'Hành động',
                                                dataIndex: 'action',
                                                align: 'center',
                                                render: (_, rec) => (
                                                    <Space size="middle">
                                                        <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(rec)}>Sửa</Button>
                                                        <Popconfirm
                                                            title="Bạn có chắc chắn muốn xóa báo cáo này?"
                                                            onConfirm={() => handleDelete(rec.id)}
                                                            okText="Xóa"
                                                            cancelText="Hủy"
                                                        >
                                                            <Button type="link" danger icon={<DeleteOutlined />}>Xóa</Button>
                                                        </Popconfirm>
                                                    </Space>
                                                )
                                            }
                                        ]}
                                        dataSource={childReports}
                                        pagination={false}
                                        size="small"
                                    />
                                ) : (
                                    <Gantt
                                        tasks={childReports.filter(r => r.startTime && r.endTime).map(mapToGanttTask)}
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
                    }
                }}
                scroll={{ y: 'calc(100vh - 250px)' }}
            />

            <WorkReportFormModal
                visible={isModalVisible}
                submitting={submitting}
                onCancel={() => {
                    setIsModalVisible(false);
                    setEditingRecord(null);
                    form.resetFields();
                }}
                onSubmit={() => {
                    form.validateFields()
                        .then(async (values) => {
                            setSubmitting(true);
                            try {
                                const fileList = values.upload || [];
                                const firstFile = fileList[0];
                                const file = firstFile?.originFileObj || null;

                                let existingFilePath = null;
                                if (!file && firstFile?.url) {
                                    const urlParts = firstFile.url.split('/');
                                    existingFilePath = urlParts[urlParts.length - 1];
                                }

                                const payload = {
                                    employeeId: employeeIdEditing || values.employeeId,
                                    reportDate: values.reportDate.format("YYYY-MM-DD"),
                                    startTime: values.startTime.format("HH:mm:ss"),
                                    endTime: values.endTime.format("HH:mm:ss"),
                                    taskDescription: values.taskDescription,
                                    file,
                                    ...(editingRecord && !file && existingFilePath ? { filePath: existingFilePath } : {})
                                };

                                if (editingRecord) {
                                    const msg = await dailyWorkReportService.update(editingRecord.id, payload);
                                    message.success(msg);
                                } else {
                                    if (!payload.employeeId) {
                                        message.error("Vui lòng chọn nhân viên cho công việc mới.");
                                        return;
                                    }
                                    const msg = await dailyWorkReportService.create(payload);
                                    message.success(msg);
                                }

                                setIsModalVisible(false);
                                form.resetFields();
                                setEditingRecord(null);
                                fetchReports();
                            } catch (err) {
                                const errorMessage =
                                    err?.response?.data?.message ||
                                    err?.response?.data ||
                                    err.message ||
                                    "Lỗi khi lưu công việc";
                                message.error(errorMessage);
                            } finally {
                                setSubmitting(false);
                            }
                        })
                        .catch(() => {
                            message.warning("Vui lòng nhập đầy đủ thông tin trước khi lưu.");
                        });
                }}
                form={form}
                editingRecord={editingRecord}
                selectedDate={selectedDate}
                employees={employees}
            />
        </div>
    );
};

export default AdminView;
