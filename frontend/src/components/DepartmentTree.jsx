import React, { useEffect, useState } from "react";
import { Tree, Spin, message } from "antd";
import { PlusSquareOutlined, MinusSquareOutlined } from "@ant-design/icons";
import departmentService from "~/services/departmentService";

export default function DepartmentTree({ onSelectDepartment }) {
    const [loading, setLoading] = useState(false);
    const [treeData, setTreeData] = useState([]);

    const fetchDepartments = async () => {
        setLoading(true);
        try {
            const res = await departmentService.getRootDepartments();
            const data = Array.isArray(res) ? res : res.data;

            const mapToTree = (list) =>
                list.map((dep) => ({
                    title: `${dep.name} (${dep.employeeCount})`,
                    key: dep.id.toString(),
                    children:
                        dep.subDepartments?.length > 0
                            ? dep.subDepartments.map((sub) => ({
                                title: `${sub.name} (${sub.employeeCount})`,
                                key: sub.id.toString(),
                                isLeaf: true,
                            }))
                            : [],
                }));

            setTreeData(mapToTree(data));
        } catch (err) {
            console.error(err);
            message.error("Lỗi khi tải danh sách phòng ban");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    return (
        <Spin spinning={loading}>
            <Tree
                showLine={{ showLeafIcon: false }}
                switcherIcon={(props) =>
                    props.expanded ? (
                        <MinusSquareOutlined style={{ color: "#1890ff" }} />
                    ) : (
                        <PlusSquareOutlined style={{ color: "#1890ff" }} />
                    )
                }
                treeData={treeData}
                onSelect={(selectedKeys, info) => {
                    if (onSelectDepartment) {
                        onSelectDepartment(selectedKeys[0], info);
                    }
                }}
            />
        </Spin>
    );
}