import React from 'react';
import { Steps, Button, Typography, Space } from 'antd';

const { Step } = Steps;
const { Text } = Typography;

const ProcessSteps = ({
    stages = [],
    process,
    isVertical = true,
    onOpenHandoverModal,
    onUpdateStage
}) => {
    // Giai đoạn hiện tại là bước đầu tiên chưa hoàn thành
    const currentStep = stages.findIndex(stage => !stage.completionDate);

    // Nếu tất cả đã hoàn thành thì currentStep = stages.length
    const effectiveStep = currentStep === -1 ? stages.length : currentStep;

    const renderActionsForStage = (stage, isCurrent) => {
        if (!isCurrent) return null;

        return (
            <Space>
                {stage.name.toLowerCase() === 'bàn giao' && (
                    <Button
                        type="primary"
                        size="small"
                        danger
                        onClick={() => onOpenHandoverModal(process.type)}
                    >
                        Bàn giao
                    </Button>
                )}
                <Button
                    type="dashed"
                    size="small"
                    onClick={() => onUpdateStage(stage)}
                >
                    Cập nhật
                </Button>
            </Space>
        );
    };

    return (
        <Steps
            direction={isVertical ? 'vertical' : 'horizontal'}
            size="small"
            current={effectiveStep}
        >
            {stages.map((stage, index) => {
                const isCurrent = index === currentStep;
                return (
                    <Step
                        key={index}
                        title={stage.name}
                        description={
                            <Space direction="vertical" size={4}>
                                {stage.completionDate ? (
                                    <>
                                        <Text type="success">
                                            ✅ {stage.completionDate}
                                        </Text>
                                        {stage.description && (
                                            <Text>{stage.description}</Text>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <Text type="warning">⏳ Đang thực hiện</Text>
                                        {renderActionsForStage(stage, isCurrent)}
                                        <Text type="secondary">
                                            {stage.description || "Chưa có mô tả"}
                                        </Text>
                                    </>
                                )}
                            </Space>
                        }
                    />
                );
            })}
        </Steps>
    );
};

export default ProcessSteps;
