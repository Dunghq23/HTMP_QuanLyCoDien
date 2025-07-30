import React, { useEffect, useState, useCallback, useContext } from 'react';
import {
    Table, Typography, message, Space, Button, DatePicker,
    Form, Modal, TimePicker, Input, Row, Col,
    Popconfirm, Select, Upload,
    Image
} from 'antd';
import dayjs from 'dayjs';
import { DeleteOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import { Gantt, ViewMode } from 'gantt-task-react';
import dailyWorkReportService from '~/services/dailyWorkReportService';
import CustomTooltip from '~/components/CustomTooltip';
import { getAllEmployees } from '~/services/employeeService';

// Import CSS cho Gantt, nếu chưa có
import "gantt-task-react/dist/index.css";
import { useTheme } from '~/contexts/ThemeContext';
import WorkReportFormModal from '~/components/WorkReportFormModal';

const { Title } = Typography;


const ElectricalDailyTasksPage = () => {
    const { isDarkMode } = useTheme();

    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null); // null = thêm mới, object = đang sửa

    const [employees, setEmployees] = useState([]);

    const role = localStorage.getItem('role');
    const employeeId = localStorage.getItem('employeeId'); // Lấy employeeId của người dùng hiện tại (nếu có)

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const data = await getAllEmployees();
            setEmployees(data);
        } catch (error) {
            console.error(error);
            message.error('Lỗi khi tải danh sách nhân viên');
        } finally {
            setLoading(false);
        }
    };

    const fetchReports = useCallback(async () => {
        if (!selectedDate) {
            setReports([]);
            return;
        }
        setLoading(true);
        try {
            const date = selectedDate.format('YYYY-MM-DD');
            let res = null;
            if (role === 'ROLE_ADMIN') {
                res = await dailyWorkReportService.getByDate(date);
            } else if (role === 'ROLE_EMPLOYEE') {
                // Đảm bảo employeeId có tồn tại khi fetch báo cáo cho ROLE_EMPLOYEE
                if (employeeId) {
                    res = await dailyWorkReportService.getByEmployeeAndDate(employeeId, date);
                } else {
                    message.warning('Không tìm thấy Employee ID cho vai trò nhân viên.');
                    setReports([]);
                    setLoading(false);
                    return;
                }
            } else if (role === 'ROLE_MANAGER') {
                // Manager cũng cần lấy tất cả báo cáo theo ngày để nhóm theo nhân viên
                res = await dailyWorkReportService.getByDate(date);
            }
            setReports(res?.data || []);
        } catch (error) {
            console.error(error);
            message.error('Lỗi khi tải dữ liệu báo cáo công việc');
        } finally {
            setLoading(false);
        }
    }, [selectedDate, role, employeeId]); // Thêm role và employeeId vào dependency array

    useEffect(() => {
        if (role === 'ROLE_ADMIN') {
            fetchEmployees();
        }
    }, []);

    useEffect(() => {
        fetchReports();
    }, [fetchReports]);

    const mapToTask = (report, index) => {
        const start = dayjs(`${report.reportDate} ${report.startTime}`).toDate();
        let end = dayjs(`${report.reportDate} ${report.endTime}`).toDate();
        // Xử lý trường hợp endTime là '00:00:00' để kéo dài đến đầu ngày hôm sau
        if (report.endTime === '00:00:00') {
            end = dayjs(report.reportDate).add(1, 'day').startOf('day').toDate();
        }
        return {
            id: `${report.id}`,
            name: report.taskDescription || `Công việc ${index + 1}`,
            start,
            end,
            type: 'task',
            progress: 100, // Hoàn thành 100%
            project: report.employeeName, // Sử dụng project để nhóm theo nhân viên
            isDisabled: true, // Không cho phép chỉnh sửa trên Gantt Chart
            filePath: report.filePath,
        };
    };

    const groupedData = Object.values(
        reports.reduce((acc, report) => {
            const key = report.employeeId;
            if (!acc[key]) {
                acc[key] = {
                    employeeId: report.employeeId,
                    employeeName: report.employeeName,
                    employeeCode: report.employeeCode,
                    tasks: [],
                };
            }
            acc[key].tasks.push(report);
            return acc;
        }, {})
    ).map((group) => {
        const sorted = group.tasks
            .filter(r => r.startTime && r.endTime)
            .sort((a, b) => a.startTime.localeCompare(b.startTime));
        return {
            ...group,
            startTime: sorted[0]?.startTime || '',
            endTime: sorted[sorted.length - 1]?.endTime || '',
        };
    });



    const columns = [
        { title: 'Tên nhân viên', dataIndex: 'employeeName' },
        { title: 'Mã nhân viên', dataIndex: 'employeeCode', align: 'center' },
        { title: 'Thời gian bắt đầu', dataIndex: 'startTime', align: 'center' },
        { title: 'Thời gian kết thúc', dataIndex: 'endTime', align: 'center' },
    ];

    const columnsAdmin = [
        {
            title: 'Tên nhân viên',
            dataIndex: 'employeeName',
            filters: Array.from(new Set(reports.map(r => r.employeeName))) // tạo filter duy nhất từ danh sách
                .map(name => ({ text: name, value: name })),
            onFilter: (value, record) => record.employeeName === value,
            sorter: (a, b) => a.employeeName.localeCompare(b.employeeName),
            sortDirections: ['ascend', 'descend'],
            render: (text) => ({
                children: text,
            }),
        },
        {
            title: 'Mã nhân viên',
            dataIndex: 'employeeCode',
            align: 'center',
            render: (text, row) => ({
                children: text,
            }),
        },
        { title: 'Nội dung công việc', dataIndex: 'taskDescription', align: 'center' },
        { title: 'Thời gian bắt đầu', dataIndex: 'startTime', align: 'center' },
        { title: 'Thời gian kết thúc', dataIndex: 'endTime', align: 'center' },
        {
            title: 'Hình ảnh', dataIndex: 'filePath', align: 'center',
            render: (text, record) => {
                if (!text) return '-';
                return (

                    <Image.PreviewGroup
                        preview={{
                            onChange: (current, prev) => console.log(`current index: ${current}, prev index: ${prev}`),
                        }}
                    >
                        <Image width={100} src={`${process.env.REACT_APP_UPLOAD_URL}/${record.filePath}`} />
                    </Image.PreviewGroup>
                );
            }
        },
        {
            title: 'Hành động',
            dataIndex: 'action',
            align: 'center',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    >
                        Sửa
                    </Button>

                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa báo cáo này?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                    >
                        <Button type="link" danger icon={<DeleteOutlined />}>
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];


    const handleEdit = (record) => {
        setEditingRecord(record);
        setIsModalVisible(true);
        form.setFieldsValue({
            employeeId: record.employeeId, // Thêm dòng này để đặt employeeId cho form khi chỉnh sửa
            reportDate: dayjs(record.reportDate), // 👈 THÊM DÒNG NÀY
            startTime: dayjs(record.startTime, "HH:mm:ss"),
            endTime: dayjs(record.endTime, "HH:mm:ss"),
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
            const responseMessage = await dailyWorkReportService.delete(id);
            message.success(responseMessage);
            fetchReports();
        } catch (err) {
            message.error("Xóa thất bại: " + (err?.response?.data?.message || err.message || "Lỗi không xác định"));
        }
    };

    return (
        <div>
            <Space style>
                <DatePicker
                    value={selectedDate}
                    format="DD/MM/YYYY"
                    allowClear
                    onChange={(date) => {
                        setSelectedDate(date);
                        setSelectedEmployeeId(null); // reset Gantt khi đổi ngày
                    }}
                    placeholder="Chọn ngày"
                />
                <Button onClick={() => {
                    setSelectedDate(dayjs());
                    setSelectedEmployeeId(null);
                }}>Hôm nay</Button>
                {(role === 'ROLE_EMPLOYEE' || role === 'ROLE_ADMIN') && (
                    <Button type="primary" onClick={() => {
                        setEditingRecord(null); // Đảm bảo đang ở chế độ thêm mới
                        form.resetFields(); // Reset form khi mở modal thêm mới
                        if (role === 'ROLE_EMPLOYEE') {
                            form.setFieldsValue({ employeeId: employeeId }); // Tự động điền employeeId cho ROLE_EMPLOYEE
                        }
                        setIsModalVisible(true);
                    }}>
                        Thêm công việc
                    </Button>
                )}
            </Space>

            {role === 'ROLE_MANAGER' && (
                <Table
                    rowKey="employeeId"
                    columns={columns}
                    dataSource={groupedData}
                    loading={loading}
                    bordered
                    onRow={(record) => ({
                        onClick: () => {
                            setSelectedEmployeeId(prev =>
                                prev === record.employeeId ? null : record.employeeId
                            );
                        },
                    })}
                    rowClassName={(record) =>
                        record.employeeId === selectedEmployeeId ? 'selected-row' : ''
                    }
                    scroll={{ y: 'calc(100vh - 300px)' }}
                />
            )}

            {role === 'ROLE_ADMIN' && (
                <Table
                    style={{ marginTop: 16 }}
                    dataSource={reports}
                    columns={columnsAdmin}
                    loading={loading} // Thêm loading cho table admin
                    rowKey="id" // Đảm bảo có rowKey
                    pagination={{
                        showSizeChanger: true,  // cho phép chọn số dòng/trang
                        pageSizeOptions: ['5', '10', '20', '50'], // các lựa chọn
                        showQuickJumper: true,  // cho phép nhập số trang
                        showTotal: (total, range) =>
                            `${range[0]} - ${range[1]} trong ${total} công việc`,
                    }}
                />
            )}

            {/* Hiển thị Gantt cho ROLE_MANAGER khi đã chọn nhân viên */}
            {role === 'ROLE_MANAGER' && selectedEmployeeId && (
                <div style={{ minHeight: 400, marginTop: 16 }}>
                    <Title level={5}>Gantt công việc: {
                        groupedData.find(e => e.employeeId === selectedEmployeeId)?.employeeName
                    }</Title>
                    <Gantt
                        theme={isDarkMode ? "dark" : "default"}
                        tasks={reports
                            .filter(r => r.employeeId === selectedEmployeeId && r.startTime && r.endTime)
                            .map(mapToTask)}
                        viewMode={ViewMode.Hour}
                        listCellWidth=""
                        columnWidth={65}
                        barBackgroundColor="blue"
                        rowHeight={40}
                        fontSize={12}
                        TooltipContent={CustomTooltip}
                    />
                </div>
            )}

            {/* Hiển thị Gantt cho ROLE_EMPLOYEE */}
            {role === 'ROLE_EMPLOYEE' && reports.filter(r => r.startTime && r.endTime).length > 0 && (
                <div style={{ minHeight: 400, marginTop: 16 }}>
                    <Title level={5}>Gantt công việc của bạn</Title>
                    <Gantt
                        theme={isDarkMode ? "dark" : "default"}
                        tasks={reports
                            .filter(r => r.startTime && r.endTime)
                            .map(mapToTask)}
                        viewMode={ViewMode.Hour}
                        listCellWidth=""
                        columnWidth={65}
                        barBackgroundColor="blue"
                        rowHeight={40}
                        fontSize={12}
                        TooltipContent={CustomTooltip}
                    />
                </div>
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
                                    employeeId: role === 'ROLE_ADMIN' ? values.employeeId : employeeId,
                                    reportDate: values.reportDate.format("YYYY-MM-DD"), 
                                    startTime: values.startTime.format("HH:mm:ss"),
                                    endTime: values.endTime.format("HH:mm:ss"),
                                    taskDescription: values.taskDescription,
                                    file,
                                    ...(editingRecord && !file && existingFilePath ? { filePath: existingFilePath } : {})
                                };

                                if (editingRecord) {
                                    const messageResponse = await dailyWorkReportService.update(editingRecord.id, payload);
                                    message.success(messageResponse);
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
                        .catch((validationError) => {
                            console.log("Validation failed:", validationError);
                            message.warning("Vui lòng nhập đầy đủ thông tin trước khi lưu.");
                        });
                }}

                form={form}
                editingRecord={editingRecord}
                selectedDate={selectedDate}
                employees={employees}
                role={role}
                employeeId={employeeId}
            />

        </div>
    );
};

export default ElectricalDailyTasksPage;