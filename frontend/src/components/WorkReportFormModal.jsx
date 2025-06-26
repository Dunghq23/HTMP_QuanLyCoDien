import React from 'react';
import { Modal, Form, DatePicker, Row, Col, TimePicker, Input, Upload, Select, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

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
    employeeId,
}) => {
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
            <Form layout="vertical" form={form}>
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
                            disabled={role === 'ROLE_EMPLOYEE'}
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
                    normalize={(value) => Array.isArray(value) ? value : value?.fileList}
                >

                    <Upload
                        beforeUpload={() => false}
                        maxCount={1}
                        listType="picture"
                        accept=".png,.jpg,.jpeg"
                    >
                        <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                    </Upload>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default WorkReportFormModal;
