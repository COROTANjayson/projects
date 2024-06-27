"use client";
import { loginUser } from "@/redux/features/auth.slice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Button, Card, Col, Input, Row, message } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";

type LoginRespType = {
    payload: {
        success: boolean;
        message: string;
        datas: { role: string };
    };
};

const Login = () => {
    const history = useRouter();
    const loading = useAppSelector((state) => state.auth.loading);
    const dispatch = useAppDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        if (!email || password.length < 8) return;

        const loginResp = (await dispatch(
            loginUser({ email, password })
        )) as LoginRespType;

        if (loginResp.payload?.success) {
            // if (loginResp.payload.datas.role === "teacher") {
            history.push("tutor/dashboard");
            // }
        } else {
            const msg = loginResp.payload?.message.includes(
                "invalid-credential"
            )
                ? "Incorrect email or password"
                : "Login Failed";
            message.error(msg, 5);
        }
    };
    return (
        <Row
            style={{
                height: "100vh",
                width: "100%",
                alignContent: "center",
                justifyContent: "center",
                marginTop: "-100px",
            }}
        >
            <Col>
                <Card style={{ width: 450, padding: "20px 30px" }}>
                    <Row justify="center" style={{ marginBottom: "30px" }}>
                        <h2>Login</h2>
                    </Row>
                    <Row>
                        <Input
                            size="large"
                            name="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{
                                borderRadius: "40px",
                                padding: "10px 0px",
                                textIndent: "15px",
                            }}
                            onPressEnter={handleLogin}
                        />
                    </Row>
                    <Row style={{ margin: "10px 0px" }}>
                        <Input
                            size="large"
                            name="password"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                borderRadius: "40px",
                                padding: "10px 0px",
                                textIndent: "15px",
                            }}
                            onPressEnter={handleLogin}
                        />
                    </Row>
                    <Row>
                        <Button
                            type="primary"
                            onClick={handleLogin}
                            style={{
                                width: "100%",
                                borderRadius: "40px",
                                padding: "20px 0px",
                                marginTop: "20px",
                            }}
                            loading={loading}
                            disabled={!email || password.length < 8}
                        >
                            Login
                        </Button>
                    </Row>
                    <Row>
                        <Button
                            onClick={() => history.push("/register")}
                            style={{
                                width: "100%",
                                borderRadius: "40px",
                                padding: "20px 0px",
                                marginTop: "20px",
                            }}
                        >
                            Register
                        </Button>
                    </Row>
                </Card>
            </Col>
        </Row>
    );
};

export default Login;
