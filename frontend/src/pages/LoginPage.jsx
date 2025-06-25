import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography, Alert, Card } from "antd";
import authService from "~/services/authService";

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
            const response = await authService.login(values.code, values.password);
            navigate("/", { replace: true });
        } catch (err) {
            console.error("Login error", err);
            setError(err.message);
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
                padding: "0 16px", // để tránh bị sát viền ở mobile
            }}
        >
            <Card
                style={{
                    width: "100%",
                    maxWidth: 480, // dùng maxWidth thay cho fixed width
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                }}
                cover={
                    <img
                        src="/image/banner_bread_page.webp"
                        alt="HTMP"
                        style={{
                            width: "100%",
                            height: "auto",
                            objectFit: "cover",
                            display: "block",
                        }}
                    />
                }
                bodyStyle={{
                    padding: 24,
                }}
            >
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                    <Title level={4} style={{ marginBottom: 4 }}>
                        Hệ thống quản lý phòng Cơ điện
                    </Title>
                    <Text type="secondary">
                        Đăng nhập dành cho nhân viên quản lý và nhân viên phòng cơ điện
                    </Text>
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
