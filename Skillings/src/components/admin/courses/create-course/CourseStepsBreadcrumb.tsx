"use client";

import styles from "@/app/admin/courses/create-course/styles.module.css";
import { CheckOutlined, RightOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";

const CourseStepsBreadcrumb = ({ courseSteps }: { courseSteps: number }) => {
    return (
        <Row gutter={10}>
            <Col
                style={
                    courseSteps
                        ? { color: "#3b82f6", fontWeight: 600 }
                        : { fontWeight: 600 }
                }
            >
                <span
                    className={
                        courseSteps === 1
                            ? styles.numberStepsStyleActive
                            : courseSteps > 1
                            ? styles.numberStepsStyleDone
                            : styles.numberStepsStyle
                    }
                >
                    {courseSteps > 1 ? (
                        <CheckOutlined
                            style={{
                                color: courseSteps === 1 ? "#3b82f6" : "#fff",
                            }}
                        />
                    ) : (
                        "1"
                    )}
                </span>
                Course Information & Details
            </Col>
            <Col>
                <RightOutlined />
            </Col>
            <Col
                style={
                    courseSteps > 1
                        ? { color: "#3b82f6", fontWeight: 600 }
                        : { fontWeight: 600 }
                }
            >
                <span
                    className={
                        courseSteps === 2
                            ? styles.numberStepsStyleActive
                            : courseSteps > 2
                            ? styles.numberStepsStyleDone
                            : styles.numberStepsStyle
                    }
                >
                    {courseSteps > 2 ? (
                        <CheckOutlined
                            style={{
                                color: courseSteps === 2 ? "#3b82f6" : "#fff",
                            }}
                        />
                    ) : (
                        "2"
                    )}
                </span>
                Add Course Materials
            </Col>
            <Col>
                <RightOutlined />
            </Col>
            <Col
                style={
                    courseSteps > 2
                        ? { color: "#3b82f6", fontWeight: 600 }
                        : { fontWeight: 600 }
                }
            >
                <span
                    className={
                        courseSteps === 3
                            ? styles.numberStepsStyleActive
                            : courseSteps > 3
                            ? styles.numberStepsStyleDone
                            : styles.numberStepsStyle
                    }
                >
                    {courseSteps > 3 ? (
                        <CheckOutlined
                            style={{
                                color: courseSteps === 3 ? "#3b82f6" : "#fff",
                            }}
                        />
                    ) : (
                        "3"
                    )}
                </span>
                Pricing and Publish
            </Col>
        </Row>
    );
};

export default CourseStepsBreadcrumb;
