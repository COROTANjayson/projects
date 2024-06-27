"use client";
import React, { useState } from "react"
import { Typography, Form, Input, Button, Upload, DatePicker, TimePicker, notification } from "antd"
import { ArrowLeftOutlined, RightOutlined, UploadOutlined } from "@ant-design/icons"
import dynamic from "next/dynamic"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
// import { RootState } from "@/data/utils/rootState"
// import { editLesson, getActivityData, removeFile } from "@/app/redux/activity/activity.actions"
// import { t, Trans } from "@lingui/macro"
// import { GetCoursesRealtime } from "@/app/redux/course/createcourse.actions"
// import { getBookingsByTutor } from "@/app/redux/booking/booking.actions"

import Link from "next/link"
import { RootState } from "@/redux/store"
import { usePathname, useRouter } from "next/navigation"
import ProtectedComponent from "@/components/protected"
import 'react-quill/dist/quill.snow.css';
import moment from "moment";
interface optionsProps {
    options: any[]
    filteredOptions: any[]
}

interface valueProps {
    title: string
    instructions: string
    loading: boolean
    topic: string
    topicSuggestion: any[]
    members: any[]
    memberType: string
    course: string
    files: any[]
    publishDate: any
    publishTime: any
}

const { Text } = Typography
const { TextArea } = Input

const TutorCreateAssignment = () => {
    const pathname = usePathname();
    const parts = pathname.split("/");
    const activityId = parts[parts.length - 1];
    const router = useRouter()
    const user = useSelector((state: RootState) => state.auth.user, shallowEqual)

    const dispatch = useDispatch()
    // const [activity, setActivity] = React.useState(null)
    const [btnLoading, setBtnLoading] = useState(false)
    const [form] = Form.useForm()
    // const [currentCourse, setCurrentCourse] = useState(null)
    const createAssRef = React.useRef()

    const [formValues, setFormValues] = React.useState<valueProps>({
        title: "",
        instructions: "",
        loading: false,
        topic: "",
        topicSuggestion: [],
        members: [],
        memberType: "all",
        course: "",
        files: [],
        publishDate: moment().startOf("day"),
        publishTime: 0
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [members, setMemberType] = React.useState("all")
    const [options, setOptions] = React.useState<optionsProps>({
        options: [],
        filteredOptions: []
    })

    // React.useEffect(() => {
    //     // eslint-disable-next-line no-console
    //     console.log("query", query)
    //     // eslint-disable-next-line no-console
    //     console.log("user", user)
    //     // eslint-disable-next-line no-console
    //     console.log("courseData", courseData)
    //     // eslint-disable-next-line no-console
    //     console.log("tutorId", query.tutorId)
    //     // console.log('userId', user.uid);
    //     // eslint-disable-next-line no-console
    //     console.log("courseId", query.courseId)

    //     // GetSpecificCourse(query.tutorId, query.courseId, (callback: any) => {
    //     //     console.log('callback', callback);
    //     // })

    //     const payload = {
    //         uid: user.uid,
    //         courses: user.courses
    //     }

    //     GetCoursesRealtime(payload, (callback: any) => {
    //         if (callback.length > 0) {
    //             // eslint-disable-next-line no-console
    //             console.log("callback", callback)
    //             // setCourses(callback)
    //             const findCurrentCourse = callback.find((course) => course.courseId == query.courseId)
    //             // eslint-disable-next-line no-console
    //             console.log("find current course", findCurrentCourse)
    //             // setCurrentCourse(findCurrentCourse);
    //             setCurrentCourse(callback.find((course) => course.courseId == query.courseId))
    //         }
    //     })
    //     // eslint-disable-next-line no-console
    //     console.log("current course", currentCourse)
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [user.uid, user.courses])

    // const handleUploadFile = (event) => {
    //     if (event.file.status === "uploading") {
    //         setBtnLoading(true)
    //     } else {
    //         // console.log(event.file.status = "ok")
    //         setBtnLoading(false)
    //     }
    // }

    const dummyRequest = ({ onSuccess }: any) => {
        setTimeout(() => {
            // onSuccess("done");
            onSuccess("ok")
        }, 0)
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // const selectMembers = (value) => {
    //     // eslint-disable-next-line no-console
    //     console.log("select members")
    //     // setValues({
    //     //     ...values,
    //     //     members: value
    //     // })
    // }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // const selectMemberType = (value) => {
    //     // eslint-disable-next-line no-console
    //     console.log("select member type", value)
    //     if (value === "all") {
    //         setFormValues({
    //             ...formValues,
    //             members: [],
    //             memberType: value
    //         })
    //         setOptions({
    //             ...options,
    //             filteredOptions: options.options
    //         })
    //     } else if (value === "except") {
    //         setFormValues({
    //             ...formValues,
    //             members: options.options,
    //             memberType: value
    //         })
    //     } else {
    //         setOptions({
    //             ...options,
    //             filteredOptions: options.options
    //         })
    //         setFormValues({
    //             ...formValues,
    //             members: [],
    //             memberType: value
    //         })
    //     }
    //     setMemberType(value)
    // }

    // const getMembers = async () => {
    //     dispatch(
    //         getBookingsByTutor(user.uid, (callback: any) => {
    //             const tempoBookings: any[] = []
    //             callback.forEach((item: any) => {
    //                 item.scheduledTime.bookedStudents.forEach((students: any) => {
    //                     if (!tempoBookings.some((user) => user.value === students.bookedByEmail)) {
    //                         const bookingObject = {
    //                             orderId: students.orderId,
    //                             value: students.bookedByEmail,
    //                             label: students.bookedByEmail,
    //                             studentName: students.fullName,
    //                             id: students.bookedBy
    //                         }
    //                         tempoBookings.push(bookingObject)
    //                     }
    //                 })
    //             })
    //             setOptions({
    //                 options: tempoBookings,
    //                 filteredOptions: tempoBookings
    //             })
    //         })
    //     )
    // }

    // React.useEffect(() => {
    //     getMembers()

    //     if (options) {
    //         // eslint-disable-next-line no-console
    //         console.log("options", options)
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [options])

    // const onSubmit = () => {
    //     form.validateFields()
    //         .then((values) => {
    //             const payload = {
    //                 // tutorId: user.id,
    //                 tutorId: query.tutorId,
    //                 courseId: query.courseId,
    //                 title: values.title,
    //                 type: "Assignment",
    //                 topic: values.topic,
    //                 members: [],
    //                 // memberType: values.memberType,
    //                 instructions: values.instructions,
    //                 files: values.files == undefined ? [] : values.files.fileList,
    //                 dueDate: typeof values.dueDate !== "number" ? values.dueDate.unix() : values.dueDate,
    //                 dueTime: typeof values.dueTime !== "number" ? values.dueTime.unix() : values.dueTime,
    //                 points: values.points
    //             }
    //             setBtnLoading(true)
    //             dispatch(
    //                 createAssignment(payload, (callback: any) => {
    //                     // Get this url from response in real world.
    //                     if (callback === "success") {
    //                         notification.success({
    //                             description: t`Assignment Created Successfully`,
    //                             message: "Success",
    //                             duration: 2
    //                         })
    //                         form.resetFields()
    //                         router.push(`/tutor/${user.id}/activity`)
    //                         setBtnLoading(false)
    //                     } else {
    //                         notification.error({
    //                             description: callback,
    //                             message: "Error",
    //                             duration: 2
    //                         })
    //                         setBtnLoading(false)
    //                     }
    //                 })
    //             )
    //         })

    //         // eslint-disable-next-line
    //         .catch((info) => {
    //             // console.log("Validate Failed:", info)
    //         })
    // }


    let activity = {
        id: '2na0a00fgevxe',
        courseName: 'Physics',
        courseId: 'fjsd89SAA0ds22KKm',
        topic: 'Earth science',
        type: 'Lesson',
        files: [],
        instructions: 'this is test',
        points: 40,
        title: 'Hello'
    }
    let currentCourse = {
        courseName: 'Physics'
    }
    return (
        <div className="quizContainer">
            <div style={{ padding: "15px 0px" }}>
                <div className="header">
                    <button onClick={() => router.back()} type="button" className="arrowBack">
                        <ArrowLeftOutlined style={{ fontSize: "20px" }} />
                    </button>

                    <Text style={{ fontSize: "36px", fontWeight: 600 }}>Create Assignment</Text>
                </div>
                <div className="breadcrumb">
                    <div className="breadcrumbLink">{currentCourse ? currentCourse.courseName : ""}</div>
                    <RightOutlined />
                    <div className="breadcrumbLink">Activity</div>
                    <RightOutlined />
                    <div className="breadcrumbLink">Assignment</div>
                    <RightOutlined />
                    <div className="breadcrumbLink">Create</div>
                </div>

                <div className="main">
                    <div className="quizForm">
                        <Form layout="vertical" form={form}
                        // onFinish={onSubmit}
                        >
                            <div className="quizInfo">
                                <Form.Item
                                    name="title"
                                    label="Assignment title"
                                    className="quizFormLabel"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please input assignment title."
                                        }
                                    ]}
                                >
                                    <Input placeholder="Enter assignment title" className="quizFormInput" />
                                </Form.Item>
                                <Form.Item
                                    name="topic"
                                    label="Topic"
                                    className="quizFormLabel"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please input assignment topic."
                                        }
                                    ]}
                                >
                                    <Input placeholder="Enter assignment topic" className="quizFormInput" />
                                </Form.Item>
                                {/* <Form.Item>
                                <CreateActivityMembers selectMemberType={selectMemberType} selectMembers={selectMembers} members={'members'} options={'options'} />
                            </Form.Item> */}
                                <div className="quizDue">
                                    <Form.Item name="dueDate" className="quizFormLabel" label={'Due to'} style={{ position: "relative", width: "100%" }}>
                                        {/* <Row gutter={[6, 0]}> */}
                                        {/* <Col span={12}> */}
                                        {/* eslint-disable-next-line react/jsx-no-bind */}
                                        <DatePicker className="quizFormInput" style={{ width: "100%" }} />
                                        {/* </Col> */}
                                        {/* <Col span={12}> */}
                                        {/* eslint-disable-next-line react/jsx-no-bind */}
                                        {/* <TimePicker className="quizFormInput" use12Hours format="h:mm a" defaultValue={moment().startOf("day")} style={{ width: "100%" }} /> */}
                                        {/* </Col> */}
                                        {/* </Row> */}
                                    </Form.Item>
                                    <Form.Item name="dueTime" label=" " className="quizFormLabel">
                                        <TimePicker className="quizFormInput" use12Hours format="h:mm a" style={{ width: "100%" }} />
                                    </Form.Item>
                                </div>
                            </div>
                            <div className="quizInfo">
                                <Form.Item label="Instruction" name="instructions" className="quizFormLabel">
                                    <TextArea rows={2} placeholder="Type your instruction" className="quizFormInput" />
                                </Form.Item>
                                <Form.Item name="files" label="Attachments" className="quizFormLabel">
                                    {/* <Input type="file" multiple className="quizFormInput" /> */}
                                    <Upload ref={createAssRef} multiple={true} name="file"
                                        // onChange={handleUploadFile}
                                        customRequest={dummyRequest}>
                                        <Button style={{ border: "1px solid black" }} icon={<UploadOutlined />}>
                                            Attach files
                                        </Button>
                                    </Upload>
                                </Form.Item>

                                <Form.Item
                                    style={{ width: "96px" }}
                                    name="points"
                                    label="Points"
                                    className="quizFormLabel"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please input points."
                                        }
                                    ]}
                                >
                                    <Input placeholder="0" className="quizFormInput" />
                                </Form.Item>
                            </div>
                            <Form.Item>
                                <div className="quizFormButtons">
                                    <Button onClick={() => router.back()} htmlType="button" loading={btnLoading} danger className="cancel">
                                        Cancel
                                    </Button>
                                    <Button htmlType="submit" loading={btnLoading} type="primary" className="save">
                                        Save
                                    </Button>
                                </div>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProtectedComponent(TutorCreateAssignment);
