"use client";
import React, { useState } from "react"
import { Typography, Form, Input, Button, Upload, DatePicker, TimePicker, notification } from "antd"
import { ArrowLeftOutlined, RightOutlined, UploadOutlined } from "@ant-design/icons"
// import Router from "next/router"
import dynamic from "next/dynamic"
// import { useRouter } from "next/router"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
// import { RootState } from "@/data/utils/rootState"
// import { editLesson, getActivityData, removeFile } from "@/app/redux/activity/activity.actions"
// import { t, Trans } from "@lingui/macro"

import Link from "next/link"
import { RootState } from "@/redux/store"
import { usePathname, useRouter } from "next/navigation"
import ProtectedComponent from "@/components/protected"
import ReactQuill from "react-quill";
const QuillNoSSRWrapper = dynamic(
    async () => {
        const { default: RQ } = await import('react-quill');
        // eslint-disable-next-line react/display-name
        return ({ ...props }) => <RQ {...props} />;
    },
    {
        ssr: false,
    }
) as typeof ReactQuill;

const { Text } = Typography
const { TextArea } = Input

const TutorEditAssignment = () => {
    const pathname = usePathname();
    const parts = pathname.split("/");
    const activityId = parts[parts.length - 1];
    const router = useRouter()
    const user = useSelector((state: RootState) => state.auth.user, shallowEqual)

    const dispatch = useDispatch()


    // const [activity, setActivity] = React.useState(null)
    // const [released, setReleased] = React.useState("")
    const editShowAssRef = React.useRef<any>()
    const [attachedFiles, setAttachedFiles] = React.useState([])
    // const router = useRouter()
    // const dispatch = useDispatch()
    const [btnLoading, setBtnLoading] = useState(false)
    const [form] = Form.useForm()
    // const { query }: any = router
    const [currentCourse, setCurrentCourse] = useState(null)
    // const [activity, setActivity] = React.useState(null)
    const editAssRef = React.useRef()
    // const [formValues, setFormValues] = React.useState<valueProps>({
    //     title: "",
    //     instructions: "",
    //     loading: false,
    //     topic: "",
    //     topicSuggestion: [],
    //     // members: [],
    //     // memberType: "all",
    //     course: "",
    //     files: [],
    //     publishDate: moment().startOf("day"),
    //     publishTime: 0
    // })

    // React.useEffect(() => {
    //     // eslint-disable-next-line no-console
    //     console.log("query", query)
    //     // eslint-disable-next-line no-console
    //     console.log("user", user)
    //     // eslint-disable-next-line no-console
    //     console.log("courseData", courseData)

    //     // GetSpecificCourse(query.tutorId, query.courseId, (callback: any) => {
    //     //     console.log('callback', callback);
    //     // })

    //     const payload = {
    //         uid: user.uid,
    //         courses: user.courses
    //     }

    //     dispatch(
    //         getActivityData(query.activityId, (callback: any) => {
    //             // eslint-disable-next-line no-console
    //             console.log("callback", callback)
    //             setActivity(callback)
    //         })
    //     )

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

    // React.useEffect(() => {
    //     if (activity) {
    //         const convertedFiles: any[] = []
    //         if (activity.files) {
    //             activity.files.map((item) => {
    //                 const hostName = new URL(item).hostname
    //                 let name

    //                 if (hostName === "skillings-bucket-sea.s3.ap-southeast-1.amazonaws.com") {
    //                     const splitStr = item.split("activities%2F")
    //                     const newSplitStr = splitStr[0]
    //                     name = newSplitStr.split("/")
    //                     name = name[5].split(".")[0]
    //                     name = name.substring(10)
    //                 } else {
    //                     const splitStr = item.split("activities%2F")
    //                     const newSplitStr = splitStr[1]
    //                     name = newSplitStr.split("?")[0]
    //                 }

    //                 convertedFiles.push({
    //                     uid: Math.random(),
    //                     url: item,
    //                     name: name,
    //                     thumbUrl: item,
    //                     status: "success"
    //                 })
    //             })
    //         }

    //         setAttachedFiles(convertedFiles)

    //         // const dueDateInitial = new Date(timestamp * 1000);
    //         form.setFieldsValue({
    //             title: activity.title,
    //             topic: activity.topic,
    //             instructions: activity.instructions,
    //             points: activity.points,
    //             dueDate: moment.unix(activity.dueDate),
    //             // files: attachedFiles,
    //             // dueDate: new Date(activity.dueDate * 1000),
    //             dueTime: moment.unix(activity.dueTime)
    //         })
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [activity])

    // const handleUploadFile = (event) => {
    //     // setAttachedFiles([attachedFiles, ...event.fileList]);
    //     if (event.file.status === "uploading") {
    //         // setAttachedFiles();
    //         setBtnLoading(true)
    //     } else {
    //         // console.log(event.file.status = "ok")
    //         setBtnLoading(false)
    //         // setAttachedFiles(event.fileList);
    //     }
    // }

    const dummyRequest = ({ onSuccess }: any) => {
        setTimeout(() => {
            // onSuccess("done");
            onSuccess("ok")
        }, 0)
    }

    // const handleEditRemove = (file) => {
    //     const { url } = file
    //     const index = editShowAssRef.current.fileList.indexOf(file)
    //     editShowAssRef.current.fileList.splice(index, 1)
    //     setAttachedFiles(editShowAssRef.current.fileList)
    //     setBtnLoading(true)
    //     dispatch(
    //         removeFile(query.activityId, url, (callback: any) => {
    //             if (callback === "success") {
    //                 notification.success({
    //                     description: t`File successfully removed`,
    //                     message: "Success",
    //                     duration: 2
    //                 })
    //                 setBtnLoading(false)
    //             } else {
    //                 notification.error({
    //                     description: t`Error deleting file. Please refresh your page.`,
    //                     message: "Error",
    //                     duration: 2
    //                 })
    //                 setBtnLoading(false)
    //             }
    //         })
    //     )
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
    let released = 'June 24th 2024, 10:16:44 am'

    return (
        <div className="quizContainer">
            <div style={{ padding: "15px 0px" }}>
                <div className="header">
                    <button onClick={() => router.back()} type="button" className="arrowBack">
                        <ArrowLeftOutlined style={{ fontSize: "20px" }} />
                    </button>

                    <Text style={{ fontSize: "36px", fontWeight: 600 }}>Edit Assignment</Text>
                </div>
                <div className="breadcrumb">
                    {/* <div className="breadcrumbLink">{currentCourse ? currentCourse.courseName : ""}</div>
                <RightOutlined /> */}
                    {/* <div className="breadcrumbLink">Activity</div>
                <RightOutlined /> */}
                    <div className="breadcrumbLink">Assignment</div>
                    <RightOutlined />
                    <div className="breadcrumbLink">Edit</div>
                    <RightOutlined />
                    <div className="breadcrumbLink">{activity ? activity.title : ""}</div>
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
                                <div className="quizDue">
                                    <Form.Item name="dueDate" className="quizFormLabel" label={`Due by`} style={{ position: "relative", width: "100%" }}>
                                        {/* <Row gutter={[6, 0]}> */}
                                        {/* <Col span={12}> */}
                                        {/* eslint-disable-next-line react/jsx-no-bind */}
                                        <DatePicker format="MM/DD/YYYY" className="quizFormInput" style={{ width: "100%" }} />
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
                                <Upload fileList={[...attachedFiles]} ref={editShowAssRef}
                                // onRemove={handleEditRemove}
                                >
                                    <p>
                                        Attached Files
                                    </p>
                                </Upload>
                                <Form.Item style={{ marginTop: "1rem" }} name="files" className="quizFormLabel">
                                    <Upload ref={editAssRef} multiple={true}
                                        // onChange={handleUploadFile}  
                                        customRequest={dummyRequest}>
                                        <Button style={{ border: "1px solid black" }} icon={<UploadOutlined />}>
                                            Attach more files
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

export default ProtectedComponent(TutorEditAssignment);
