import React from 'react';
import { Modal, Form, DatePicker, Row, Col, TimePicker, Input, Upload, Select, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const WorkReportFormModal = ({
    visible,
    submitting,
    onCancel,
    onSubmit,
    form,
    editingRecord,
    selectedDate,
    employees,
    role,
}) => {

    const allowedTypes = ['image/png', 'image/jpeg', 'application/pdf'];

    const handleBeforeUpload = (file) => {
        const isAllowedType = allowedTypes.includes(file.type);
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isAllowedType) {
            message.error('Chỉ cho phép định dạng PDF, PNG, hoặc JPG!');
        }

        if (!isLt2M) {
            message.error('Dung lượng file không được vượt quá 2MB!');
        }

        return isAllowedType || Upload.LIST_IGNORE; // Ngăn AntD hiển thị file nếu sai định dạng
    };

    return (
        <Modal
            title={editingRecord ? "Cập nhật công việc" : "Thêm công việc"}
            confirmLoading={submitting}
            open={visible}
            onOk={onSubmit}
            onCancel={onCancel}
            okText="Lưu"
            cancelText="Hủy"
        >
            <Form layout="vertical" form={form} initialValues={{ reportDate: selectedDate }}>

                {/* Chỉ hiển thị Select khi thêm mới */}
                {!editingRecord && (role === 'ADMIN' || role !== 'EMPLOYEE') && (
                    <Form.Item
                        label="Nhân viên"
                        name="employeeId"
                        rules={[{ required: true, message: 'Vui lòng chọn nhân viên!' }]}
                    >
                        <Select
                            showSearch
                            placeholder="Chọn nhân viên"
                            optionFilterProp="label"
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={employees.map(emp => ({
                                label: `${emp.name} (${emp.code})`,
                                value: emp.id,
                            }))}
                        />
                    </Form.Item>
                )}

                <Form.Item
                    label="Ngày làm việc"
                    name="reportDate"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày làm việc!' }]}
                >
                    <DatePicker
                        format="DD/MM/YYYY"
                        style={{ width: '100%' }}
                        disabled={!editingRecord} // Thêm mới thì disable, sửa thì cho chọn
                    />
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
                            dependencies={['startTime']}
                            rules={[
                                { required: true, message: 'Chọn giờ kết thúc' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        const start = getFieldValue('startTime');
                                        if (!start || !value) return Promise.resolve();
                                        if (value.isAfter(start)) return Promise.resolve();
                                        return Promise.reject(new Error('Giờ kết thúc phải sau giờ bắt đầu'));
                                    },
                                }),
                            ]}
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
                    normalize={(value) => Array.isArray(value) ? value : value?.fileList}
                >
                    <Upload
                        beforeUpload={handleBeforeUpload}
                        maxCount={1}
                        listType="picture"
                        accept=".png,.jpg,.jpeg,.pdf"
                        customRequest={({ onSuccess }) => {
                            // Ngăn Upload tự gửi file lên server
                            setTimeout(() => {
                                onSuccess("ok");
                            }, 0);
                        }}
                    >
                        <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                    </Upload>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default WorkReportFormModal;
