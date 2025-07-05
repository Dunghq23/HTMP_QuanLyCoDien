import {
    Modal, Form, Input, DatePicker, Upload, Button, message,
    Select
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import orderService from "~/services/orderService";
import dayjs from "dayjs";
import customerService from "~/services/customerService";
import modelService from "~/services/modelService";

const CreateNewModelModal = ({ open, onCancel, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [customers, setCustomers] = useState([]);

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const data = await customerService.getAllCustomer();
            setCustomers(data);
        } catch (error) {
            console.error(error);
            message.error('Lỗi khi tải danh sách khách hàng');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, [])


    const handleOk = async () => {
        setLoading(true);
        try {
            const values = await form.validateFields();
            const formData = new FormData();
            formData.append("customerId", values.customerId);
            formData.append("file", values.excelFile[0].originFileObj);

            await modelService.createOrder(formData);
            message.success("Thêm mới New Model thành công");
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
            title="Tạo đơn hàng mới"
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
                    name="customerId"
                    label="Khách hàng"
                    rules={[{ required: true, message: "Vui lòng chọn khách hàng" }]}
                >
                    <Select
                        showSearch
                        placeholder="Chọn khách hàng"
                        options={customers.map((item) => ({
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
                    name="excelFile"
                    label="Tải lên file Excel"
                    valuePropName="fileList"
                    getValueFromEvent={e => Array.isArray(e) ? e : e?.fileList}
                    rules={[{ required: true, message: "Vui lòng chọn file Excel" }]}
                >
                    <Upload beforeUpload={() => false} accept=".xlsx,.xls" maxCount={1}>
                        <Button icon={<UploadOutlined />}>Chọn file Excel</Button>
                    </Upload>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateNewModelModal;
