"use client";

import CourseCard from "@/components/admin/courses/CourseCard";
import ProtectedComponent from "@/components/protected";
import { getCourses } from "@/redux/features/course.slice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { FileAddOutlined, FileOutlined } from "@ant-design/icons";
import { Button, Col, Flex, Row, Typography } from "antd";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const { Title } = Typography;
const AdminCourses = () => {
    const router = useRouter();
    const courseList = useAppSelector((state) => state.courses.courseList);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getCourses());

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    console.log("courseList", courseList);
    return (
        <>
            <Row>
                <Col>
                    <Title
                        level={2}
                        style={{
                            fontWeight: 700,
                            color: "#3b82f6",
                        }}
                    >
                        Courses
                    </Title>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col>
                    <Button
                        icon={<FileAddOutlined />}
                        type="primary"
                        size="large"
                        style={{ borderRadius: 10 }}
                        onClick={() =>
                            router.push("/admin/courses/create-course")
                        }
                    >
                        Create course
                    </Button>
                </Col>
                <Col>
                    <Button
                        icon={<FileOutlined />}
                        type="text"
                        size="large"
                        style={{ borderRadius: 10, backgroundColor: "#E8E8E8" }}
                    >
                        Drafts
                    </Button>
                </Col>
            </Row>
            <br />
            <Flex gap={20}>
                {courseList.map((course) => (
                    <CourseCard key={course.id} course={course} />
                ))}
            </Flex>
        </>
    );
};

export default ProtectedComponent(AdminCourses);
