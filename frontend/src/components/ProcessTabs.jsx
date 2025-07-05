import React, { useEffect, useState } from "react";
import { Steps, Tabs, message, Button, Space, Modal, Input, DatePicker } from "antd";
import processService from "~/services/processService";
import dayjs from "dayjs";

const ProcessTabs = ({ productId }) => {
    const [processList, setProcessList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isVertical, setIsVertical] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStage, setSelectedStage] = useState(null);
    const [description, setDescription] = useState("");
    const [completionDate, setCompletionDate] = useState(null);
    const [confirming, setConfirming] = useState(false);

    const fetchData = async () => {
        try {
            const res = await processService.fetchProcessByProductId(productId);
            setProcessList(res || []);
        } catch (error) {
            message.error(error?.message || "Lỗi khi tải công đoạn");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (productId) {
            fetchData();
        }
    }, [productId]);

    const openUpdateModal = (stage) => {
        setSelectedStage(stage);
        setDescription(stage.description || "");
        setCompletionDate(stage.completionDate ? stage.completionDate : null);
        setIsModalOpen(true);
    };

    const actuallyUpdateStage = async () => {
        try {
            await processService.updateStage({
                id: selectedStage.id,
                completionDate: completionDate ? completionDate.toISOString() : null,
                description,
            });

            message.success("Cập nhật thành công");
            setIsModalOpen(false);
            setConfirming(false);
            fetchData();
        } catch (error) {
            message.error("Lỗi khi cập nhật");
        }
    };

    const handleModalOk = async () => {
        if (completionDate) {
            const confirmed = window.confirm(
                "Bạn đã chọn ngày hoàn thành. Sau khi xác nhận sẽ không thể chỉnh sửa. Tiếp tục?"
            );
            if (!confirmed) return;
        }

        try {
            await processService.updateStage({
                id: selectedStage.id,
                completionDate,
                description,
            });
            message.success("Cập nhật công đoạn thành công");
            setIsModalOpen(false);
            fetchData(); // reload lại
        } catch (error) {
            message.error(error.message || "Lỗi khi cập nhật");
        }
    };


    if (loading) return <>Đang tải...</>;
    if (!Array.isArray(processList)) return <h1>Không có dữ liệu</h1>;

    const tabItems = processList.map((process) => {
        const stages = process.processStageList || [];
        const current = stages.findIndex((s) => s.completionDate == null);
        const currentStep = current === -1 ? stages.length : current;

        let typeLabel = process.jigDetail?.name || process.type;
        if (typeLabel === "TAYGA") typeLabel = "Tay gá";
        else if (typeLabel === "BANCAT") typeLabel = "Bàn cắt";

        return {
            key: process.id.toString(),
            label: `${typeLabel}`,
            children: (
                <>
                    <h3>Công đoạn: {process.name}</h3>
                    <p>Nhân viên phụ trách: <strong>{process.employeeName}</strong></p>
                    <p>Chi phí: <strong style={{ color: "green" }}>{process.cost} VNĐ</strong></p>
                    {process.type === "JIG" && (
                        <p>Mã ERP quản lý: <strong style={{ color: "purple" }}>{process.jigDetail?.erpCode || "Không có"}</strong></p>
                    )}

                    <Steps
                        size="small"
                        direction={isVertical ? "vertical" : "horizontal"}
                        current={currentStep}
                        items={stages.map((stage) => ({
                            title: stage.name,
                            description: (
                                <>
                                    {stage.completionDate ? (
                                        <>
                                            <strong style={{ color: "green" }}>{stage.completionDate}</strong>
                                            <br />
                                            {stage.description || ""}
                                        </>
                                    ) : (
                                        <Space direction="vertical">
                                            <Button
                                                type="dashed"
                                                size="small"
                                                onClick={() => openUpdateModal(stage)}
                                            >
                                                Cập nhật
                                            </Button>
                                            <span style={{ color: "#999" }}>{(stage.description !== null || stage.description === "") ? stage.description : "Chưa hoàn thành"}</span>
                                        </Space>
                                    )}
                                </>
                            ),
                        }))}
                    />
                </>
            ),
        };
    });

    return (
        <>
            <div style={{ marginBottom: 8 }}>
                <Button onClick={() => setIsVertical((prev) => !prev)}>
                    Chuyển chế độ: {isVertical ? "Ngang" : "Dọc"}
                </Button>
            </div>

            <Tabs defaultActiveKey="1" items={tabItems} />

            <Modal
                title={`Cập nhật công đoạn: ${selectedStage?.name || ""}`}
                open={isModalOpen}
                onOk={handleModalOk}
                onCancel={() => {
                    setIsModalOpen(false);
                    setConfirming(false);
                }}
            >
                <p style={{ marginTop: 12 }}>Ngày hoàn thành:</p>
                <DatePicker
                    style={{ width: "100%" }}
                    value={completionDate}
                    onChange={(date) => setCompletionDate(date)}
                    allowClear
                    placeholder="Chưa chọn"
                />

                <p>Mô tả cập nhật:</p>
                <Input.TextArea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />


            </Modal>
        </>
    );
};

export default ProcessTabs;
