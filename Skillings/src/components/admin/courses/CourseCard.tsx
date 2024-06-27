import { useState } from "react";
import StarRatings from "react-star-ratings";
import {
    CalendarOutlined,
    FormOutlined,
    MenuOutlined,
    ReadOutlined,
} from "@ant-design/icons";
import { Button, Col, Image, Row, Typography } from "antd";
// @ts-ignore
import Heart from "react-heart";
import { CourseTypes } from "@/domain/entities/Course";

const { Title, Paragraph } = Typography;
const CourseCard = ({ course }: { course: CourseTypes }) => {
    const [isHeart, setIsHeart] = useState(false);
    return (
        <div
            style={{
                width: 280,
                border: "1px solid #ccc",
                borderRadius: 10,
            }}
        >
            <div style={{ padding: 15 }}>
                <Image
                    // @ts-ignore
                    src={course.coverPhoto}
                    alt="course"
                    width={"100%"}
                    height={150}
                    style={{ borderRadius: 10 }}
                />
                <Row style={{ margin: "10px 0px" }}>
                    <Col span={22}>
                        <Title level={5} style={{ margin: 0, fontWeight: 700 }}>
                            {course.title}
                        </Title>{" "}
                    </Col>
                    <Col span={2} style={{ marginTop: "3px" }}>
                        <Heart
                            isActive={isHeart}
                            onClick={() => setIsHeart(!isHeart)}
                            styles={{
                                width: "20px",
                                height: "20px",
                            }}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Paragraph>{course.description}</Paragraph>
                    </Col>
                </Row>
                <Row gutter={10}>
                    <Col>
                        <small
                            style={{
                                padding: "6px 11px",
                                backgroundColor: "#f5f5f5",
                                color: "#737373",
                                borderRadius: 8,
                            }}
                        >
                            {course.category}
                        </small>
                    </Col>
                    <Col>
                        <small
                            style={{
                                padding: "6px 11px",
                                backgroundColor: "#f5f5f5",
                                color: "#737373",
                                borderRadius: 8,
                            }}
                        >
                            {course.subCategory}
                        </small>
                    </Col>
                </Row>
                <Row justify="space-between" style={{ margin: "15px 0px" }}>
                    <Col style={{ fontWeight: 600 }}>Overall Ratings</Col>
                    <Col>
                        <StarRatings
                            rating={course.overallRatings || 5}
                            starRatedColor="#f97316"
                            numberOfStars={5}
                            starDimension="20px"
                            starSpacing="1px"
                        />
                    </Col>
                </Row>
                <div
                    style={{
                        borderBottom: "1px solid #ccc",
                        margin: "5px 0px 10px 0px",
                    }}
                />
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        paddingTop: "10px",
                    }}
                >
                    <Button
                        style={{ borderRadius: "100%" }}
                        icon={<ReadOutlined />}
                        size="large"
                    />
                    <Button
                        style={{ borderRadius: "100%" }}
                        icon={<CalendarOutlined />}
                        size="large"
                    />
                    <Button
                        style={{ borderRadius: "100%" }}
                        icon={<FormOutlined />}
                        size="large"
                    />
                    <Button
                        style={{ borderRadius: "100%" }}
                        icon={<MenuOutlined />}
                        size="large"
                    />
                </div>
            </div>
        </div>
    );
};

export default CourseCard;
