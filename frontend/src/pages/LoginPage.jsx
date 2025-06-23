import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography, Alert, Card, Space } from "antd";
import axiosClient from "~/utils/axiosClient";

const { Title, Text } = Typography;

export default function LoginPage() {
    const navigate = useNavigate();
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            navigate("/");
        }
    }, [navigate]);

    const handleSubmit = async (values) => {
        setError("");
        try {
            const response = await axiosClient.post("/auth/login", {
                code: values.code,
                password: values.password,
            });

            const token = response.data.token;
            localStorage.setItem("accessToken", token);
            navigate("/", { replace: true });
        } catch (err) {
            console.error("Login error", err);
            setError("Mã nhân viên hoặc mật khẩu không đúng!");
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(to right, #f0f2f5, #d6e4ff)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Card
                style={{ width: 600 }}
                cover={
                    <img
                        src="/image/banner_bread_page.webp"
                        alt="HTMP"
                        style={{ width: "100%", height: "auto", objectFit: "cover" }}
                    />
                }
            >
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                    <Title level={4} style={{ marginBottom: 4 }}>
                        Hệ thống quản lý phòng Cơ điện
                    </Title>
                    <Text type="secondary">Đăng nhập dành cho nhân viên quản lý và nhân viên phòng cơ điện</Text>
                </div>

                {error && (
                    <Alert
                        message={error}
                        type="error"
                        showIcon
                        style={{ marginBottom: 16 }}
                    />
                )}

                <Form layout="vertical" onFinish={handleSubmit}>
                    <Form.Item
                        label="Mã nhân viên"
                        name="code"
                        rules={[{ required: true, message: "Vui lòng nhập mã nhân viên!" }]}
                    >
                        <Input placeholder="VD: NV001" />
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu"
                        name="password"
                        rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
                    >
                        <Input.Password placeholder="••••••••" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block size="large">
                            Đăng nhập
                        </Button>
                    </Form.Item>
                </Form>
            </Card>

        </div>
    );
}
