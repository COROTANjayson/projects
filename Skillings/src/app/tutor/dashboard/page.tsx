"use client";
import { Row, Typography, Grid, Col } from "antd";
import React from "react";
import StarRatings from "react-star-ratings";
import SetupProfile from "@/components/tutor/dashboard/SetupProfile";
import { useAppSelector } from "@/redux/hooks";
import ProtectedComponent from "@/components/protected";

const { Text } = Typography;
const { useBreakpoint } = Grid;

const TeacherDashboard = () => {
    const screenSize = useBreakpoint();
    const user = useAppSelector((state) => state.auth.user);

    console.log("user", user);

    return (
        <div style={{ margin: "0px auto", width: "100%" }}>
            <Row>
                <Col
                    style={{ display: "flex", justifyContent: "space-between" }}
                >
                    <Text
                        style={{
                            fontSize: !screenSize.md ? "20px" : "25px",
                            fontWeight: 600,
                        }}
                    >
                        Welcome, World
                    </Text>
                </Col>
            </Row>
            <div
                style={{
                    display: "flex",
                    flexDirection: !screenSize.lg ? "column" : "row",
                    marginTop: "15px",
                    gap: "10px",
                }}
            >
                <div
                    style={{
                        border: "1px solid #ccc",
                        padding: "5px 0",
                        width: !screenSize.md ? "33.33%" : "100%",
                    }}
                >
                    <Row justify="center">
                        <Text
                            style={{
                                fontSize: !screenSize.md ? 16 : 18,
                                fontWeight: 500,
                            }}
                        >
                            Total revenue
                        </Text>
                    </Row>
                    <Row justify="center">
                        <Text
                            style={{
                                fontSize: !screenSize.md ? "20px" : "25px",
                                fontWeight: 600,
                            }}
                        >
                            RP 0.00
                        </Text>
                    </Row>
                    <Row justify="center">
                        <Text>RP 0.00 this month</Text>
                    </Row>
                </div>
                <div
                    style={{
                        border: "1px solid #ccc",
                        padding: "5px 0",
                        margin: !screenSize.lg ? "20px 0px" : "0px 20px",
                        width: !screenSize.md ? "33.33%" : "100%",
                    }}
                >
                    <Row justify="center">
                        <Text
                            style={{
                                fontSize: !screenSize.md ? 16 : 18,
                                fontWeight: 500,
                            }}
                        >
                            Total bookings
                        </Text>
                    </Row>
                    <Row justify="center">
                        <Text
                            style={{
                                fontSize: !screenSize.md ? "20px" : "25px",
                                fontWeight: 600,
                            }}
                        >
                            0
                        </Text>
                    </Row>
                    <Row justify="center">
                        <Text>
                            <Text style={{ fontWeight: "bolder" }}>0</Text> this
                            month
                        </Text>
                    </Row>
                </div>
                <div
                    style={{
                        border: "1px solid #ccc",
                        padding: "5px 0",
                        width: !screenSize.md ? "33.33%" : "100%",
                    }}
                >
                    <Row justify="center">
                        <Text
                            style={{
                                fontSize: !screenSize.md ? 16 : 18,
                                fontWeight: 500,
                            }}
                        >
                            Average ratings
                        </Text>
                    </Row>
                    <Row justify="center">
                        <Text
                            style={{
                                fontSize: !screenSize.md ? "20px" : "25px",
                                fontWeight: 600,
                            }}
                        >
                            0
                        </Text>
                    </Row>
                    <Row justify="center">
                        <StarRatings
                            rating={0}
                            starRatedColor={"#007BFF"}
                            starDimension="20px"
                            starSpacing="2px"
                        />
                    </Row>
                </div>
            </div>

            <Row>
                <Col span={24} style={{ marginTop: "20px" }}>
                    <SetupProfile />
                </Col>
            </Row>
        </div>
    );
};

export default ProtectedComponent(TeacherDashboard);
