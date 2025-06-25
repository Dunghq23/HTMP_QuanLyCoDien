import React from "react";
import { Card } from "antd";

const CustomTooltip = ({ task }) => {
    return (
        <Card
            title={task.name}
            size="small"
            style={{ maxWidth: 400 }}
            headStyle={{ fontWeight: 'bold' }}
        >
            <p><strong>Nhân viên:</strong> {task.project}</p>
            <p><strong>Thời gian:</strong> {task.start.toLocaleString()} → {task.end.toLocaleString()}</p>

            {task.filePath && (
                <img
                    src={`${process.env.REACT_APP_UPLOAD_URL}/uploads/${task.filePath}`}
                    alt="Ảnh công việc"
                    style={{ marginTop: 8, maxHeight: 300, width: '100%', objectFit: 'contain', borderRadius: 4 }}
                />
            )}
        </Card>
    );
};

export default CustomTooltip;
