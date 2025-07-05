import {
    Modal, Form, Input, message,
    Select
} from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { getAllEmployees } from "~/services/employeeService";
import processService from "~/services/processService";

const CreateNewProcessModal = ({ open, onCancel, onSuccess, productId }) => {
    const [form] = Form.useForm();
    const selectedType = Form.useWatch("type", form); // 👈 theo dõi giá trị "type"
    const [loading, setLoading] = useState(false);
    const [employees, setEmployees] = useState([]);

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

    useEffect(() => {
        fetchEmployees();
    }, [])


    const handleOk = async () => {
        setLoading(true);
        try {
            const values = await form.validateFields();
            console.log(values);

            const formData = new FormData();
            // 👇 Duyệt từng key-value trong form và append
            Object.entries(values).forEach(([key, value]) => {
                formData.append(key, value);
            });
            console.log(productId);

            // 👇 Thêm productId nếu có
            if (productId) {
                formData.append("productId", productId);
            }
            await processService.createProcess(formData);
            message.success("Thêm mới công đoạn thành công");
            onSuccess();
            form.resetFields();
        } catch (error) {
            if (error?.errorFields) {
                message.error(error.errorFields.map(f => f.errors[0]).join(", "));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Thêm Process"
            open={open}
            onOk={handleOk}
            onCancel={() => {
                onCancel();
                form.resetFields();
            }}
            okText="Lưu"
            cancelText="Hủy"
            confirmLoading={loading}
        >
            <Form layout="vertical" form={form} initialValues={{ orderDate: dayjs() }}>
                <Form.Item
                    name="employeeId"
                    label="Nhân viên phụ trách"
                    rules={[{ required: true, message: "Vui lòng chọn nhân viên" }]}
                >
                    <Select
                        showSearch
                        placeholder="Chọn nhân viên"
                        options={employees.map((item) => ({
                            label: `${item.name}`,
                            value: item.id,
                        }))}
                        optionFilterProp="label"
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                    >

                    </Select>
                </Form.Item>

                <Form.Item
                    name="type"
                    label="Loại"
                    rules={[{ required: true, message: "Vui lòng chọn loại" }]}
                >
                    <Select placeholder="Chọn loại">
                        <Select.Option value="TAYGA">Tay gá</Select.Option>
                        <Select.Option value="BANCAT">Bàn cắt</Select.Option>
                        <Select.Option value="JIG">JIG</Select.Option>
                    </Select>
                </Form.Item>

                {/* 👇 Hiển thị thêm nếu chọn JIG */}
                {selectedType === "JIG" && (
                    <Form.Item
                        name="jigName"
                        label="Tên JIG"
                        rules={[{ required: true, message: "Vui lòng nhập tên JIG" }]}
                    >
                        <Input placeholder="Nhập tên JIG" />
                    </Form.Item>
                )}

                {selectedType === "JIG" && (
                    <Form.Item
                        name="erpCode"
                        label="Mã ERP quản lý"
                    >
                        <Input placeholder="Nhập mã ERP" />
                    </Form.Item>
                )}

                <Form.Item
                    name="name"
                    label="Tên công đoạn"
                    rules={[{ required: true, message: "Vui lòng nhập tên công đoạn" }]}
                >
                    <Input />
                </Form.Item>

            </Form>
        </Modal>
    );
};

export default CreateNewProcessModal;
