import React, { useEffect, useState } from "react";
import { Steps, Tabs, message, Button, Space, Modal, Input, DatePicker, Row, Col, Switch, Popconfirm } from "antd";
import processService from "~/services/processService";
import { ArrowDownOutlined, ArrowRightOutlined, DeleteOutlined, DeleteTwoTone, EditOutlined, EditTwoTone, FileSyncOutlined, SolutionOutlined } from "@ant-design/icons";
import HandoverMinutesFormModal from "./HandoverMinutesFormModal";
import ProcessSteps from "./ProcessSteps";
import productService from "~/services/productService";

const ProcessTabs = ({ productId }) => {
    const [processList, setProcessList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isVertical, setIsVertical] = useState(false);

    const [isModalStageOpen, setIsModalStageOpen] = useState(false);
    const [isModalProcessOpen, setIsModalProcessOpen] = useState(false);
    const [selectedStage, setSelectedStage] = useState(null);
    const [selectedProcess, setSelectedProcess] = useState(null);
    const [description, setDescription] = useState("");
    const [completionDate, setCompletionDate] = useState(null);
    const [confirming, setConfirming] = useState(false);

    const [isHandoverModalOpen, setIsHandoverModalOpen] = useState(false);
    const [selectedHandoverType, setSelectedHandoverType] = useState('');

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

    const openUpdateModalProcess = (process) => {
        setSelectedProcess(process);
        setIsModalProcessOpen(true);
    };

    const openUpdateModalStage = (stage) => {
        setSelectedStage(stage);
        setDescription(stage.description || "");
        setCompletionDate(stage.completionDate ? stage.completionDate : null);
        setIsModalStageOpen(true);
    };


    const handleModalStageOk = async () => {
        if (completionDate) {
            Modal.confirm({
                title: 'Xác nhận cập nhật',
                content: 'Bạn đã chọn ngày hoàn thành. Sau khi xác nhận sẽ không thể chỉnh sửa. Tiếp tục?',
                onOk: async () => {
                    try {
                        await processService.updateStage({
                            id: selectedStage.id,
                            completionDate,
                            description,
                        });
                        message.success("Cập nhật công đoạn thành công");
                        setIsModalStageOpen(false);
                        fetchData();
                    } catch (error) {
                        message.error(error.message || "Lỗi khi cập nhật");
                    }
                }
            });
        } else {
            // Trường hợp không chọn ngày vẫn được cập nhật
            try {
                await processService.updateStage({
                    id: selectedStage.id,
                    completionDate,
                    description,
                });
                message.success("Cập nhật công đoạn thành công");
                setIsModalStageOpen(false);
                fetchData();
            } catch (error) {
                message.error(error.message || "Lỗi khi cập nhật");
            }
        }
    };

    const handleSubmitHandover = async (formValues) => {
        console.log(formValues);

        try {
            const fullData = {
                ...formValues,
                handoverType: selectedHandoverType,      // lấy từ props hoặc state
                productId: productId,         // gán thủ công hoặc từ context/router
                employeeId: localStorage.getItem("employeeId"),
                jigDetailName: selectedProcess?.jigDetail?.name || selectedProcess?.type || "Không xác định",

            };

            const url = await productService.submitHandover(fullData);

            // Cách 1: Mở file PDF trong tab mới
            window.open(url);

            // Cách 2: Tải file về
            // const link = document.createElement("a");
            // link.href = url;
            // link.setAttribute("download", "handover.pdf");
            // document.body.appendChild(link);
            // link.click();
            // link.remove();

            setIsHandoverModalOpen(false);
        } catch (error) {
            console.error(error.message);
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
                    <Row style={{ marginBottom: 8 }}>
                        <Col span={24}>
                            <h2>Công đoạn: {process.name}</h2>
                        </Col>
                        <Col span={6}>
                            <p>Nhân viên phụ trách: <strong>{process.employeeName}</strong></p>
                        </Col>
                        <Col span={6}>
                            <p>Chi phí: <strong style={{ color: "green" }}>{process.cost} VNĐ</strong></p>
                        </Col>
                        <Col span={6}>
                            {process.type === "JIG" && (
                                <p>Mã ERP quản lý: <strong style={{ color: "purple" }}>{process.jigDetail?.erpCode || "Không có"}</strong></p>
                            )}
                        </Col>
                        <Col span={6}>
                            <Space style={{ marginBottom: 8 }}>
                                <Switch
                                    checked={isVertical}
                                    onChange={(checked) => setIsVertical(checked)}
                                    checkedChildren={<ArrowDownOutlined />}
                                    unCheckedChildren={<ArrowRightOutlined />}
                                />
                                <Button onClick={() => openUpdateModalProcess(process)}>
                                    <EditTwoTone />
                                </Button>
                                {(localStorage.getItem("role") === 'ROLE_ADMIN' || localStorage.getItem("role") === 'ROLE_MANAGER') && (
                                    <Popconfirm
                                        title="Bạn có chắc chắn muốn xóa?"
                                        description="Hành động này không thể hoàn tác."
                                        okText="Xóa"
                                        cancelText="Hủy"
                                        onConfirm={() => {
                                            processService.deleteProcess(process.id)
                                                .then(() => {
                                                    message.success("Xóa công đoạn thành công");
                                                    fetchData();
                                                })
                                                .catch((error) => {
                                                    message.error(error.message || "Lỗi khi xóa công đoạn");
                                                });
                                        }}
                                    >
                                        <Button icon={<DeleteTwoTone twoToneColor="#ff4d4f" />} />
                                    </Popconfirm>
                                )}
                            </Space>
                        </Col>
                    </Row>

                    <Steps
                        size="small"
                        direction={isVertical ? "vertical" : "horizontal"}
                        current={currentStep}
                        items={stages.map((stage) => ({
                            title: stage.name,
                            description: (
                                <>
                                    {!stage.completionDate ? (
                                        <Space direction="vertical">
                                            {stage === stages[current] && (
                                                <Space>
                                                    {stage.name.toLowerCase() === "bàn giao" && (
                                                        <Button
                                                            type="dashed"
                                                            size="small"
                                                            danger
                                                            onClick={() => {
                                                                setSelectedHandoverType(process.type);
                                                                setIsHandoverModalOpen(true);
                                                                setSelectedProcess(process);
                                                            }}
                                                        >
                                                            <SolutionOutlined />
                                                        </Button>
                                                    )}
                                                    <Button
                                                        type="dashed"
                                                        size="small"
                                                        onClick={() => openUpdateModalStage(stage)}
                                                    >
                                                        <FileSyncOutlined />
                                                    </Button>
                                                </Space>
                                            )}
                                            <span style={{ color: "#999" }}>
                                                {(stage.description !== null || stage.description === "") ? stage.description : "Chưa hoàn thành"}
                                            </span>
                                        </Space>
                                    ) : (
                                        <>
                                            <strong style={{ color: "green" }}>{stage.completionDate}</strong>
                                            <br />
                                            {stage.description || ""}
                                        </>
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


            <Tabs defaultActiveKey="1" items={tabItems} />


            {/* Cập nhật công đoạn (Chi phí và nhân viên phụ trách) */}
            <Modal
                title={`Cập nhật công đoạn ${selectedProcess?.name || ""}`}
                open={isModalProcessOpen}
                onOk={() => {
                    processService.updateProcess({
                        id: selectedProcess.id,
                        cost: selectedProcess.cost,
                    })
                        .then(() => {
                            message.success("Cập nhật công đoạn thành công");
                            setIsModalProcessOpen(false);
                            fetchData(); // reload lại
                        })
                        .catch((error) => {
                            message.error(error.message || "Lỗi khi cập nhật công đoạn");
                        });

                }}
                onCancel={() => {
                    setIsModalProcessOpen(false);
                    setSelectedProcess(null);
                }}
            >
                <strong>Chi phí</strong>
                <Input
                    type="number"
                    value={selectedProcess?.cost ?? ""}
                    onChange={(e) =>
                        setSelectedProcess((prev) => ({
                            ...prev,
                            cost: Number(e.target.value),
                        }))
                    }
                    placeholder="Nhập chi phí"
                />
            </Modal>

            {/* Cập nhập công đoạn nhỏ */}
            <Modal
                title={`Cập nhật công đoạn: ${selectedStage?.name || ""}`}
                open={isModalStageOpen}
                onOk={handleModalStageOk}
                onCancel={() => {
                    setIsModalStageOpen(false);
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

            <HandoverMinutesFormModal
                handoverType={selectedHandoverType}
                isVisible={isHandoverModalOpen}
                onSubmit={handleSubmitHandover}
                onCancel={() => setIsHandoverModalOpen(false)

                }
            />

        </>
    );
};

export default ProcessTabs;
