import {
    FileExcelOutlined,
    FilePdfOutlined,
    PlusOutlined,
    SearchOutlined
} from "@ant-design/icons";
import {
    Button, Space, Row, Col, Table, Tag, message, Spin, Input
} from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import orderService from "~/services/orderService";
import CreateOrderModal from "~/components/CreateOrderModal";
import ReceiveOrderModal from "~/components/ReceiveOrderModal";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const { Search } = Input;

const useOrderData = () => {
    const [orders, setOrders] = useState([]);
    const fetchOrders = async () => {
        try {
            const result = await orderService.getOrders();
            setOrders(result);
        } catch (error) {
            console.error("Lỗi khi lấy đơn hàng:", error.message);
        }
    };
    useEffect(() => { fetchOrders(); }, []);
    return { orders, setOrders, fetchOrders };
};

const useExpandable = () => {
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);
    const [expandedData, setExpandedData] = useState({});
    const [loadingExpandedRow, setLoadingExpandedRow] = useState({});
    const [orderId, setOrderId] = useState(null);

    const loadOrderItems = async (id) => {
        setLoadingExpandedRow(prev => ({ ...prev, [id]: true }));
        try {
            const items = await orderService.getOrderItemByOrderId(id);
            setExpandedData(prev => ({ ...prev, [id]: items }));
        } catch {
            message.error("Không thể tải danh sách vật tư");
        } finally {
            setLoadingExpandedRow(prev => ({ ...prev, [id]: false }));
        }
    };

    return {
        expandedRowKeys, setExpandedRowKeys,
        expandedData, loadingExpandedRow,
        loadOrderItems, setOrderId, orderId
    };
};

const orderColumns = [
    { title: "Số chứng từ", dataIndex: "documentNumber", width: '15%' },
    { title: "Người đặt hàng", dataIndex: "employeeName", width: '25%' },
    { title: "Ngày đặt hàng", dataIndex: "orderDate", width: '15%', render: text => dayjs(text).format("DD/MM/YYYY") },
    { title: "Ghi chú", dataIndex: "note", width: '35%' },
    { title: "Trạng thái", dataIndex: "status", width: '10%', render: status => <Tag color="blue">{status}</Tag> },
];

const itemColumns = (handleToggleReceive) => [
    { title: "Mã vật tư", dataIndex: "materialCode" },
    { title: "Tên vật tư", dataIndex: "materialName" },
    { title: "Số lượng đặt", dataIndex: "quantityOrdered" },
    { title: "Đã nhận", dataIndex: "quantityReceived" },
    { title: "Đơn vị", dataIndex: "unit" },
    { title: "Mục đích", dataIndex: "purpose" },
    { title: "Ghi chú", dataIndex: "note" },
    {
        title: "Ngày nhận", dataIndex: "receivedDate",
        render: (text, record) => {
            const isReceived = !!record.receivedDate;
            return (
                <Tag
                    color={isReceived ? "green" : "red"}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleToggleReceive(record)}
                >
                    {isReceived ? record.receivedDate : "Chưa nhận"}
                </Tag>
            );
        },
    },
];

const ElectricalOrderPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
    const [selectedOrderItem, setSelectedOrderItem] = useState(null);

    const { orders, setOrders, fetchOrders } = useOrderData();
    const {
        expandedRowKeys, setExpandedRowKeys,
        expandedData, loadingExpandedRow,
        loadOrderItems, setOrderId, orderId
    } = useExpandable();

    const handleDownloadTemplate = async () => {
        try {
            await orderService.downloadTemplate();
            message.success("Tải file mẫu thành công");
        } catch (error) {
            message.error(error.message);
        }
    };

    const handleSearch = async (materialCode) => {
        if (materialCode !== "") {
            const orders = await orderService.getOrdersByMaterialCode(materialCode);
            setOrders(orders);
        }
    };

    const handleToggleReceive = (record) => {
        setSelectedOrderItem(record);
        setIsReceiveModalOpen(true);
    };

    const handleDownloadPDF = async () => {
        try {
            const response = await axios.get("http://10.0.5.46:8080/api/exportpdf", {
                responseType: "blob",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                }
            });


            // Tạo URL từ blob
            const blob = new Blob([response.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);

            // Tạo thẻ <a> để tải
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "bien_ban_ban_giao.pdf"); // Tên file muốn lưu
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Lỗi khi tải PDF:", error);
        }
    };

    return (
        <>
            <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                <Col>
                    <Space>
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>Tạo đơn hàng</Button>
                        <Button icon={<FileExcelOutlined />} style={{ backgroundColor: "#52c41a", color: "#fff" }} onClick={handleDownloadTemplate}>Tải mẫu đơn hàng</Button>
                        <Button icon={<FilePdfOutlined />} style={{ backgroundColor: "#D12626", color: "#fff" }} onClick={handleDownloadPDF}>Tải biên bản PDF</Button>
                    </Space>
                </Col>
                <Col>
                    <Search
                        placeholder="Tìm kiếm..."
                        allowClear
                        enterButton={<SearchOutlined />}
                        onSearch={handleSearch}
                        style={{ width: 300 }}
                        onChange={(e) => e.target.value === "" && fetchOrders()}
                    />
                </Col>
            </Row>

            <Table
                dataSource={orders}
                rowKey="id"
                columns={orderColumns}
                expandable={{
                    expandedRowKeys,
                    onExpand: async (expanded, record) => {
                        setExpandedRowKeys([]);
                        if (expanded) {
                            setOrderId(record.id);
                            await loadOrderItems(record.id);
                            setExpandedRowKeys([record.id]);
                        }
                    },
                    expandedRowRender: (record) =>
                        loadingExpandedRow[record.id] ? (
                            <Spin />
                        ) : (
                            <AnimatePresence>
                                <motion.div
                                    key={record.id}
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.5, ease: "easeInOut" }}
                                    style={{ overflow: "hidden" }}
                                >
                                    <Table
                                        dataSource={expandedData[record.id] || []}
                                        columns={itemColumns(handleToggleReceive)}
                                        pagination={false}
                                        rowKey="id"
                                        size="small"
                                    />
                                </motion.div>
                            </AnimatePresence>
                        ),
                    rowExpandable: () => true,
                }}
            />

            <CreateOrderModal
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onSuccess={() => {
                    setIsModalOpen(false);
                    fetchOrders();
                }}
            />

            <ReceiveOrderModal
                open={isReceiveModalOpen}
                orderItem={selectedOrderItem}
                onCancel={() => setIsReceiveModalOpen(false)}
                onSuccess={() => {
                    setIsReceiveModalOpen(false);
                    fetchOrders();
                    loadOrderItems(orderId);
                }}
            />
        </>
    );
};

export default ElectricalOrderPage;
