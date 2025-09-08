import React, { useState } from "react";
import { Modal, Form, Input, TimePicker, message } from "antd";
import shiftService from "~/services/shiftService";

const AddShiftModal = ({ open, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleOk = async (values) => {
    try {
      const shiftData = {
        shiftCode: values.shiftCode.trim(),
        description: values.description.trim(),
        startTime: values.startTime.format("HH:mm"),
        endTime: values.endTime.format("HH:mm"),
      };

      setLoading(true);
      await shiftService.addShift(shiftData);

      message.success("Thêm ca làm việc thành công!");
      form.resetFields(); // ✅ giờ sẽ chạy ngon
      onCancel();
      if (onSuccess) onSuccess();
    } catch (error) {
      message.error(error.message || "Lỗi khi thêm ca làm việc");
    } finally {
      setLoading(false);
    }
  };


  return (
    <Modal
      open={open}
      title="Thêm ca làm việc"
      onCancel={onCancel}
      confirmLoading={loading}
      okText="Lưu"
      onOk={() => form.submit()}
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical" onFinish={handleOk}>
        <Form.Item
          label="Mã ca"
          name="shiftCode"
          rules={[{ required: true, message: "Vui lòng nhập mã ca!" }]}
        >
          <Input placeholder="VD: HCGT, HCT2..." maxLength={10} />
        </Form.Item>

        <Form.Item
          label="Mô tả"
          name="description"
          rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
        >
          <Input placeholder="Ca hành chính, Ca tối..." maxLength={255} />
        </Form.Item>

        <Form.Item
          label="Giờ bắt đầu"
          name="startTime"
          rules={[{ required: true, message: "Vui lòng chọn giờ bắt đầu!" }]}
        >
          <TimePicker format="HH:mm" minuteStep={5} />
        </Form.Item>

        <Form.Item
          label="Giờ kết thúc"
          name="endTime"
          rules={[{ required: true, message: "Vui lòng chọn giờ kết thúc!" }]}
        >
          <TimePicker format="HH:mm" minuteStep={5} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddShiftModal;