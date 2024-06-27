"use client";
import React from "react";
import { Typography, Collapse, Row, Col, Dropdown, Space, Menu, Button, Empty, Badge, MenuProps } from "antd"
import { PlusCircleOutlined, DownOutlined } from "@ant-design/icons"
import ProtectedComponent from "@/components/protected";
import { useAppSelector } from "@/redux/hooks";

import Link from "next/link"
import ActivityList from "@/components/activity/ActivityList";

const { Text } = Typography
const { Panel } = Collapse

const TutorActivity = () => {
    const user = useAppSelector((state) => state.auth.user);

    console.log("user", user);
    let courses = [
        {
            id: '2na0a00fgee',
            courseName: 'Physics',
            courseId: 'fjsd89SAA0ds22KKm'
        },
        {
            id: 'ssdafdsfs',
            courseName: 'Mathematics',
            courseId: 'fjssdaSAA0dsdds22KKm'
        }
    ]
    let activities: string | any[] = [
        {
            id: '2na0a00fgevxe',
            courseName: 'Physics',
            courseId: 'fjsd89SAA0ds22KKm',
            topic: 'Earth science',
            type: 'Lesson'
        },
        {
            id: '2na0a00ddsee',
            courseName: 'Physics',
            courseId: 'fjsd89SAA0ds22KKm',
            title: 'Earth science',
            type: 'Assignment'
        }
    ]
    


    return (
        // <div style={{ width: isMobile ? "100%" : 936 }} className="activity-page">
        <div style={{ width: 936 }} className="activity-page">
            <div style={{ padding: "15px 8px" }}>
                <Text style={{ fontSize: "36px", fontWeight: 600 }}>Activity</Text>
            </div>
            <Collapse expandIconPosition="end">
                {courses.map((course) => {
                    const items: MenuProps['items'] = [
                        {
                            label: <Link href={`/tutor/activity/lesson/${course.courseId}`}>Lesson</Link>,
                            key: '0',
                        },
                        {
                            label: <Link href={`/tutor/activity/assignment/${course.courseId}`}>Assignment</Link>,
                            key: '1',
                        },
                        // {
                        //     label: <Link href={`/tutor/${user.uid}/activity/quiz/${course.courseId}`}>Quiz</Link>,
                        //     key: '3',
                        // },
                    ];
                    return (
                        <Panel header={<Text style={{ fontSize: "20px", fontWeight: 600 }}>{course.courseName || ""}</Text>} key={course.id}>
                            <div style={{ padding: "10px 0px", marginBottom: "30px" }}>
                                <Row justify="space-between">
                                    <Dropdown menu={{ items }} trigger={['click']}>
                                        <a onClick={(e) => e.preventDefault()}>
                                            <Space>
                                                <PlusCircleOutlined />
                                                Create
                                                <DownOutlined />
                                            </Space>
                                        </a>
                                    </Dropdown>
                                    {/* <Dropdown
                                        dropdownRender={(menu) => (
                                            <div >
                                                <Menu>
                                                    <Menu.Item>
                                                        <Link href={`/tutor/${user.uid}/activity/lesson/${course.courseId}`}>Lesson</Link>
                                                    </Menu.Item>
                                                    <Menu.Item>
                                                        <Link href={`/tutor/${user.uid}/activity/assignment/${course.courseId}`}>Assignment</Link>
                                                    </Menu.Item>
                                                    <Menu.Item>
                                                        <Link href={`/tutor/${user.uid}/activity/quiz/${course.courseId}`}>Quiz</Link>
                                                    </Menu.Item>
                                                </Menu>
                                            </div>
                                        )}
                                        trigger={["click"]}
                                    >
                                        <Button onClick={(e) => e.preventDefault()}>
                                            <Space>
                                                <PlusCircleOutlined />
                                                Create
                                                <DownOutlined />
                                            </Space>
                                        </Button>
                                    </Dropdown> */}
                                    <Col>
                                        <Badge count={0} overflowCount={99}>
                                            <Button onClick={(e) => e.preventDefault()}>
                                                <Link href={`/tutor/activity/submission?courseId=${course.courseId}`}>Submission</Link>
                                            </Button>
                                        </Badge>
                                    </Col>
                                </Row>
                            </div>
                            {activities.length <= 0 ? (
                                <div style={{ padding: "45px 0px", margin: "15px 0px", backgroundColor: "#F5F7FA" }}>
                                    <Empty description="You have no activity yet, create one." />
                                </div>
                            ) : (
                                <ActivityList activities={activities} course={course} />


                            )}
                        </Panel>

                    )
                }

                )}
            </Collapse>
        </div>
    );
};

export default ProtectedComponent(TutorActivity);
