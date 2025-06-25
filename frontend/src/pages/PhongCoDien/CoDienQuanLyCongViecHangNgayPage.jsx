import React, { useEffect, useState, useCallback } from 'react';
import {
    Table, Typography, message, Space, Button, DatePicker,
    Form, Modal, TimePicker, Input, Row, Col,
    Popconfirm, Select, Upload
} from 'antd';
import dayjs from 'dayjs';
import { DeleteOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import { Gantt, ViewMode } from 'gantt-task-react';
import dailyWorkReportService from '~/services/dailyWorkReportService';
import CustomTooltip from '~/components/CustomTooltip';
import { getAllEmployees } from '~/services/employeeService';

// Import CSS cho Gantt, nếu chưa có
import "gantt-task-react/dist/index.css";

const { Title } = Typography;

const CoDienQuanLyCongViecHangNgayPage = () => {
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
        fetchEmployees();
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
            filters: Array.from(new Set(reports.map(item => item.employeeName)))
                .map(name => ({ text: name, value: name })),
            onFilter: (value, record) => record.employeeName === value,
        },
        { title: 'Mã nhân viên', dataIndex: 'employeeCode', align: 'center' },
        { title: 'Nội dung công việc', dataIndex: 'taskDescription', align: 'center' },
        { title: 'Thời gian bắt đầu', dataIndex: 'startTime', align: 'center' },
        { title: 'Thời gian kết thúc', dataIndex: 'endTime', align: 'center' },
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
            startTime: dayjs(record.startTime, "HH:mm:ss"),
            endTime: dayjs(record.endTime, "HH:mm:ss"),
            taskDescription: record.taskDescription,
            upload: record.filePath
                ? [{
                    uid: "-1",
                    name: record.filePath.split("/").pop(),
                    status: "done",
                    url: record.filePath,
                }]
                : [],
        });
    };

    const handleDelete = async (id) => {
        try {
            await dailyWorkReportService.delete(id);
            message.success("Xóa thành công");
            fetchReports();
        } catch (err) {
            message.error("Xóa thất bại: " + (err?.response?.data?.message || err.message || "Lỗi không xác định"));
        }
    };

    return (
        <div>
            <Space style={{ marginBottom: 16 }}>
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
                    dataSource={reports}
                    columns={columnsAdmin}
                    loading={loading} // Thêm loading cho table admin
                    rowKey="id" // Đảm bảo có rowKey
                />
            )}

            {/* Hiển thị Gantt cho ROLE_MANAGER khi đã chọn nhân viên */}
            {role === 'ROLE_MANAGER' && selectedEmployeeId && (
                <div style={{ minHeight: 400, marginTop: 16 }}>
                    <Title level={5}>Gantt công việc: {
                        groupedData.find(e => e.employeeId === selectedEmployeeId)?.employeeName
                    }</Title>
                    <Gantt
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


            <Modal
                title={editingRecord ? "Cập nhật công việc" : "Thêm công việc"}
                confirmLoading={submitting}
                open={isModalVisible}
                onOk={() => {
                    form.validateFields().then(async (values) => {
                        setSubmitting(true);
                        try {
                            const fileList = values.upload;
                            // Kiểm tra nếu là file mới được chọn, không phải file từ URL cũ
                            const file = fileList?.length > 0 && fileList[0].originFileObj ? fileList[0].originFileObj : null;
                            const existingFilePath = fileList?.length > 0 && fileList[0].url ? fileList[0].url : null;

                            const payload = {
                                employeeId: role === 'ROLE_ADMIN' ? values.employeeId : employeeId, // Lấy employeeId từ form nếu là admin, ngược lại lấy từ localStorage
                                reportDate: selectedDate.format("YYYY-MM-DD"),
                                startTime: values.startTime.format("HH:mm:ss"),
                                endTime: values.endTime.format("HH:mm:ss"),
                                taskDescription: values.taskDescription,
                                file,
                                // Nếu là cập nhật và không có file mới được chọn, truyền lại đường dẫn file cũ
                                ...(editingRecord && !file && existingFilePath ? { filePath: existingFilePath } : {})
                            };

                            if (editingRecord) {
                                // SỬA
                                await dailyWorkReportService.update(editingRecord.id, payload);
                                message.success("Cập nhật công việc thành công");
                            } else {
                                // THÊM MỚI
                                // Đảm bảo employeeId được gửi đi khi thêm mới
                                if (!payload.employeeId) {
                                    message.error("Vui lòng chọn nhân viên cho công việc mới.");
                                    setSubmitting(false);
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
                    });
                }}
                onCancel={() => {
                    setIsModalVisible(false);
                    setEditingRecord(null);
                    form.resetFields();
                }}
                okText="Lưu"
                cancelText="Hủy"
            >
                <Form layout="vertical" form={form}>
                    {/* Trường chọn nhân viên chỉ hiển thị cho ROLE_ADMIN hoặc khi chỉnh sửa một bản ghi của người khác */}
                    {(role === 'ROLE_ADMIN' || (editingRecord && role !== 'ROLE_EMPLOYEE')) && (
                        <Form.Item
                            label="Nhân viên"
                            name="employeeId"
                            rules={[{ required: true, message: 'Vui lòng chọn nhân viên!' }]}
                        >
                            <Select
                                showSearch
                                placeholder="Chọn nhân viên"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option?.children?.toLowerCase().includes(input.toLowerCase())
                                }
                                disabled={role === 'ROLE_EMPLOYEE'} // Không cho phép employee chọn người khác
                            >
                                {employees.map((emp) => (
                                    <Select.Option key={emp.id} value={emp.id}>
                                        {emp.name} ({emp.code})
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    )}


                    <Form.Item label="Ngày làm việc">
                        <DatePicker value={selectedDate} disabled format="DD/MM/YYYY" style={{ width: '100%' }} />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Giờ bắt đầu"
                                name="startTime"
                                rules={[{ required: true, message: 'Chọn giờ bắt đầu' }]}
                            >
                                <TimePicker format="HH:mm" placeholder="Giờ bắt đầu" style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Giờ kết thúc"
                                name="endTime"
                                rules={[{ required: true, message: 'Chọn giờ kết thúc' }]}
                            >
                                <TimePicker format="HH:mm" placeholder="Giờ kết thúc" style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="taskDescription"
                        label="Mô tả công việc"
                        rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
                    >
                        <Input.TextArea rows={3} />
                    </Form.Item>

                    <Form.Item
                        name="upload"
                        label="Tải lên ảnh (tùy chọn)"
                        valuePropName="fileList"
                        // normalize: Chuyển đổi dữ liệu trước khi lưu vào form
                        normalize={(value) => {
                            if (Array.isArray(value)) {
                                return value;
                            }
                            // Khi chọn file mới, e.fileList là một mảng
                            // Khi clear hoặc xóa file, e.fileList có thể là mảng rỗng
                            return value && value.fileList;
                        }}
                    >
                        <Upload
                            beforeUpload={() => false} // Ngăn Ant Design tự động upload
                            maxCount={1}
                            listType="picture"
                            accept=".png,.jpg,.jpeg"
                        >
                            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CoDienQuanLyCongViecHangNgayPage;