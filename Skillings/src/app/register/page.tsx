"use client";
import { register } from "@/redux/features/auth.slice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Button, Card, Col, Input, Row, message } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { shallowEqual } from "react-redux";

const Register = () => {
    const dispatch = useAppDispatch();
    const loading = useAppSelector((state) => state.auth.loading, shallowEqual);
    const history = useRouter();
    const [datas, setDatas] = useState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
    });

    const handleRegister = async () => {
        const resp = (await dispatch(register(datas))) as {
            payload: { success: boolean; message: string };
        };

        if (resp && resp.payload.success) {
            message.success("Registered Successfully", 4);
            history.replace("/tutor");
        } else {
            message.error(resp?.payload?.message, 6);
        }
    };

    return (
        <Row
            style={{
                height: "100vh",
                width: "100%",
                alignContent: "center",
                justifyContent: "center",
                marginTop: "-50px",
            }}
        >
            <Col>
                <Card style={{ width: 450, padding: "20px 30px" }}>
                    <Row justify="center" style={{ marginBottom: "30px" }}>
                        <h2>Register</h2>
                    </Row>
                    <Row>
                        <Input
                            size="large"
                            name="email"
                            placeholder="Email"
                            value={datas.email}
                            onChange={(e) =>
                                setDatas({ ...datas, email: e.target.value })
                            }
                            style={{
                                borderRadius: "40px",
                                padding: "10px 15px",
                                marginBottom: "10px",
                            }}
                            onPressEnter={handleRegister}
                        />
                    </Row>
                    <Row>
                        <Input
                            size="large"
                            name="firstName"
                            placeholder="First name"
                            value={datas.firstName}
                            onChange={(e) =>
                                setDatas({
                                    ...datas,
                                    firstName: e.target.value,
                                })
                            }
                            style={{
                                borderRadius: "40px",
                                padding: "10px 15px",
                                marginBottom: "10px",
                            }}
                            onPressEnter={handleRegister}
                        />
                    </Row>
                    <Row>
                        <Input
                            size="large"
                            name="lastname"
                            placeholder="Last name"
                            value={datas.lastName}
                            onChange={(e) =>
                                setDatas({ ...datas, lastName: e.target.value })
                            }
                            style={{
                                borderRadius: "40px",
                                padding: "10px 15px",
                                marginBottom: "10px",
                            }}
                            onPressEnter={handleRegister}
                        />
                    </Row>
                    <Row>
                        <Input.Password
                            size="large"
                            name="password"
                            placeholder="Password"
                            value={datas.password}
                            onChange={(e) =>
                                setDatas({ ...datas, password: e.target.value })
                            }
                            style={{
                                borderRadius: "40px",
                                padding: "10px 15px",
                                marginBottom: "10px",
                            }}
                            onPressEnter={handleRegister}
                        />
                    </Row>
                    <Row>
                        <Button
                            type="primary"
                            onClick={handleRegister}
                            style={{
                                width: "100%",
                                borderRadius: "40px",
                                padding: "20px 0px",
                                marginTop: "20px",
                            }}
                            loading={loading}
                        >
                            Register
                        </Button>
                    </Row>
                    <Row>
                        <Button
                            onClick={() => history.push("/login")}
                            style={{
                                width: "100%",
                                borderRadius: "40px",
                                padding: "20px 0px",
                                marginTop: "20px",
                            }}
                        >
                            Login
                        </Button>
                    </Row>
                </Card>
            </Col>
        </Row>
    );
};

export default Register;
