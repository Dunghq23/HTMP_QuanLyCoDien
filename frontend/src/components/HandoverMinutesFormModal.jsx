import React from 'react';
import { Modal, Form, Input, InputNumber, Row, Col, Select } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';

const HandoverMinutesFormModal = ({ isVisible, onCancel, onSubmit, handoverType }) => {
    const [form] = Form.useForm();

    const handleOk = () => {
        form.validateFields()
            .then(values => {
                onSubmit(values);
                form.resetFields();
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    };

    return (
        <Modal
            title={`Biên bản bàn giao - ${handoverType}`}
            open={isVisible}
            onCancel={() => {
                form.resetFields();
                onCancel();
            }}
            onOk={handleOk}
            okText={<><PrinterOutlined /> In biên bản</>}
            cancelText="Hủy"
            width={800}
            okButtonProps={{
                style: { backgroundColor: '#ff4d4f', borderColor: '#ff4d4f', color: 'white' }
            }}
        >

            <Form
                form={form}
                layout="vertical"
                name="handoverForm"
                labelAlign="left"
            >
                <div style={{ marginBottom: 16, fontWeight: 'bold' }}>THÔNG TIN BÊN NHẬN</div>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="benB"
                            label="Bên B"
                            rules={[{ required: true, message: 'Vui lòng chọn bộ phận nhận' }]}
                        >
                            <Select
                                showSearch
                                placeholder="Chọn bộ phận nhận"
                                allowClear
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option?.children?.toLowerCase().includes(input.toLowerCase())
                                }
                            >
                                <Select.Option value="Bộ phận kỹ thuật">Bộ phận Kỹ thuật</Select.Option>
                                <Select.Option value="Nhóm Kỹ thuật Line">Nhóm Kỹ thuật Line</Select.Option>
                                <Select.Option value="Phòng QC">Phòng QC</Select.Option>
                                <Select.Option value="Sản Xuất">Phòng Sản xuất</Select.Option>
                                <Select.Option value="Phòng In">Phòng In</Select.Option>
                                <Select.Option value="Phòng Nghiền">Phòng Nghiền</Select.Option>
                                <Select.Option value="Bộ phận Kho">Bộ phận Kho</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item
                            name="receiver"
                            label="Người nhận"
                            rules={[{ required: true, message: 'Vui lòng nhập tên người nhận' }]}
                        >
                            <Input placeholder="Nhập họ tên người nhận" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="employeeCode"
                            label="Mã nhân viên"
                            rules={[{ required: true, message: 'Vui lòng nhập mã nhân viên' }]}
                        >
                            <Input placeholder="VD: NV00123" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="position"
                            label="Chức vụ"
                            rules={[{ required: true, message: 'Vui lòng nhập chức vụ' }]}
                        >
                            <Input placeholder="VD: Kỹ sư thiết kế" />
                        </Form.Item>
                    </Col>
                </Row>

                <div style={{ margin: '24px 0 16px', fontWeight: 'bold' }}>NỘI DUNG BÀN GIAO</div>
                {handoverType === 'TAYGA' && (
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                name="cutLoai1"
                                label="Cút loại 1"
                                rules={[{ required: true, message: 'Vui lòng nhập số lượng cút loại 1' }]}
                            >
                                <InputNumber min={0} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="cutLoai2"
                                label="Cút loại 2"
                                rules={[{ required: true, message: 'Vui lòng nhập số lượng cút loại 2' }]}
                            >
                                <InputNumber min={0} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="numLoai1"
                                label="Núm loại 1"
                                rules={[{ required: true, message: 'Vui lòng nhập số lượng núm loại 1' }]}
                            >
                                <InputNumber min={0} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="numLoai2"
                                label="Núm loại 2"
                                rules={[{ required: true, message: 'Vui lòng nhập số lượng núm loại 2' }]}
                            >
                                <InputNumber min={0} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="kimGapGate"
                                label="Kìm gắp gate"
                                rules={[{ required: true, message: 'Vui lòng nhập số lượng kìm gắp gate' }]}
                            >
                                <InputNumber min={0} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="kimKepSanPham"
                                label="Kìm kẹp sản phẩm"
                                rules={[{ required: true, message: 'Vui lòng nhập số lượng kìm kẹp sản phẩm' }]}
                            >
                                <InputNumber min={0} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>
                )}


                {handoverType === 'BANCAT' && (
                    <Row gutter={16}>
                        <Col span={6}>
                            <Form.Item
                                name="thanKimLoai1"
                                label="Thân kìm loại 1"
                                rules={[{ required: true, message: 'Vui lòng nhập số lượng thân kìm loại 1' }]}
                            >
                                <InputNumber min={0} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                name="thanKimLoai2"
                                label="Thân kìm loại 2"
                                rules={[{ required: true, message: 'Vui lòng nhập số lượng thân kìm loại 2' }]}
                            >
                                <InputNumber min={0} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                name="luoiKimLoai1"
                                label="Lưỡi kìm loại 1"
                                rules={[{ required: true, message: 'Vui lòng nhập số lượng lưỡi kìm loại 1' }]}
                            >
                                <InputNumber min={0} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                name="luoiKimLoai2"
                                label="Lưỡi kìm loại 2"
                                rules={[{ required: true, message: 'Vui lòng nhập số lượng lưỡi kìm loại 2' }]}
                            >
                                <InputNumber min={0} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>
                )}

                {handoverType === 'JIG' && (
                    <Row gutter={16}>
                        <Col span={6}>
                            <Form.Item
                                name="numberOfJigs"
                                label="Số lượng JIG bàn giao"
                                rules={[{ required: true, message: 'Vui lòng nhập số lượng bàn giao' }]}
                            >
                                <InputNumber min={0} style={{ width: '100%' }} />
                            </Form.Item>

                        </Col>
                        <Col span={18}>
                            <Form.Item
                                name="note"
                                label="Ghi chú"
                            >
                                <TextArea min={0} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>
                )}
            </Form>
        </Modal>
    );
};

export default HandoverMinutesFormModal;
