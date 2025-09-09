import React, { useState, useEffect } from 'react';
import { Space, Button, DatePicker, Form, message } from 'antd';
import dayjs from 'dayjs';
import { Gantt, ViewMode } from 'gantt-task-react';
import dailyWorkReportService from '~/services/dailyWorkReportService';
import WorkReportFormModal from './WorkReportFormModal';
import CustomTooltip from './CustomTooltip';
import "gantt-task-react/dist/index.css";
import { mapToGanttTask } from './gantt';

const EmployeeView = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);

    const employeeId = localStorage.getItem('employeeId');

    const fetchReports = async () => {
        if (!employeeId) return;
        setLoading(true);
        try {
            const date = selectedDate ? selectedDate.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD');
            const res = await dailyWorkReportService.getByEmployeeAndDate(employeeId, date);

            const employeeData = res?.data?.[0];
            setReports(employeeData?.reports || []);
        } catch (err) {
            message.error('Lỗi khi tải dữ liệu báo cáo công việc');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, [selectedDate, employeeId]);

    const handleSubmit = async (values) => {
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
                employeeId,
                reportDate: values.reportDate ? values.reportDate.format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD"),
                startTime: values.startTime ? values.startTime.format("HH:mm:ss") : "00:00:00",
                endTime: values.endTime ? values.endTime.format("HH:mm:ss") : "00:00:00",
                taskDescription: values.taskDescription,
                file,
                ...(editingRecord && !file && existingFilePath ? { filePath: existingFilePath } : {})
            };

            if (editingRecord) {
                const msg = await dailyWorkReportService.update(editingRecord.id, payload);
                message.success(msg);
            } else {
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
    };

    return (
        <div>
            <Space style={{ marginBottom: 16 }}>
                <DatePicker
                    value={selectedDate}
                    onChange={(date) => setSelectedDate(date || dayjs())}
                />
                <Button onClick={() => setSelectedDate(dayjs())}>Hôm nay</Button>
                <Button
                    type="primary"
                    onClick={() => { setEditingRecord(null); form.resetFields(); setIsModalVisible(true); }}
                >
                    Thêm công việc
                </Button>
            </Space>

            {reports.filter(r => r.startTime && r.endTime).length > 0 && (
                <Gantt
                    tasks={reports.filter(r => r.startTime && r.endTime).map(mapToGanttTask)}
                    viewMode={ViewMode.Hour}
                    listCellWidth=""
                    columnWidth={65}
                    rowHeight={40}
                    fontSize={12}
                    TooltipContent={CustomTooltip}
                />
            )}

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
                        .then((values) => handleSubmit(values))
                        .catch(() => {
                            message.warning("Vui lòng nhập đầy đủ thông tin trước khi lưu.");
                        });
                }}
                form={form}
                editingRecord={editingRecord}
                selectedDate={selectedDate}
                employeeId={employeeId}
            />
            
        </div>
    );
};

export default EmployeeView;