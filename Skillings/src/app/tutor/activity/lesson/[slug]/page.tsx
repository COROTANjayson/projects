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
import 'react-quill/dist/quill.snow.css';
import ReactQuill from "react-quill";
const QuillRWrapper = dynamic(
    async () => {
        const { default: RQ } = await import('react-quill');
        // eslint-disable-next-line react/display-name
        return ({ ...props }) => <RQ {...props} />;
    },
    // {
    //     ssr: false,
    // }
) as typeof ReactQuill;

const { Text } = Typography
const { TextArea } = Input

const TutorCreateLesson = () => {
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
    const createLessRef = React.useRef()

    // React.useEffect(() => {
    //     // eslint-disable-next-line no-console
    //     console.log("query", query)
    //     // eslint-disable-next-line no-console
    //     console.log("user", user)
    //     // eslint-disable-next-line no-console
    //     console.log("courseData", courseData)

    //     // GetSpecificCourse = async (uid: string, courseId: string, callback: any)
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

    // const onSubmit = (values: any) => {
    //     // couponCode
    //     // numberOfUsage
    //     // isPercentage
    //     // value

    //     // eslint-disable-next-line no-console
    //     console.log("onsubmit values", values)

    //     form.validateFields()
    //         .then((values) => {
    //             // eslint-disable-next-line no-console
    //             const payload = {
    //                 tutorId: query.tutorId,
    //                 courseId: query.courseId,
    //                 members: [],
    //                 type: "Lesson",
    //                 ...values,
    //                 files: values.files == undefined ? [] : values.files.fileList
    //             }
    //             setBtnLoading(true)
    //             dispatch(
    //                 createLesson(payload, (callback: any) => {
    //                     // Get this url from response in real world.
    //                     if (callback === "success") {
    //                         notification.success({
    //                             description: t`Lesson Created Successfully`,
    //                             message: "Success",
    //                             duration: 2
    //                         })

    //                         setBtnLoading(false)
    //                         // setValues({
    //                         //     ...values,
    //                         //     loading: false,
    //                         //     title: "",
    //                         //     instructions: "",
    //                         //     files: [],
    //                         //     topic: "",
    //                         //     members: [],
    //                         //     publishDate: 0,
    //                         //     publishTime: 0
    //                         // })
    //                         form.resetFields()
    //                         // <Link href={`/tutor/${user.id}/activity/lesson/${course.courseId}`}>Lesson</Link>

    //                         router.push(`/tutor/${user.id}/activity`)
    //                         setBtnLoading(false)
    //                     } else {
    //                         notification.error({
    //                             description: callback,
    //                             message: "Error",
    //                             duration: 2
    //                         })

    //                         setBtnLoading(false)
    //                         // setValues({ ...values, loading: false })
    //                     }
    //                 })
    //             )

    //             // router.push(`/tutor/${query.tutorId}/coupons/`)
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

                    <Text style={{ fontSize: "36px", fontWeight: 600 }}>Create Lesson</Text>
                </div>
                <div className="breadcrumb">
                    <div className="breadcrumbLink">{currentCourse ? currentCourse.courseName : ""}</div>
                    <RightOutlined />
                    <div className="breadcrumbLink">Activity</div>
                    <RightOutlined />
                    <div className="breadcrumbLink">Lesson </div>
                    <RightOutlined />
                    <div className="breadcrumbLink test">Create</div>
                </div>

                <div className="main">
                    <div className="quizForm">
                        <Form layout="vertical"
                        //  form={form} onFinish={onSubmit}
                        >
                            <div className="quizInfo">
                                <Form.Item
                                    label="Topic"
                                    name="topic"
                                    className="quizFormLabel"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please input topic."
                                        }
                                    ]}
                                >
                                    <TextArea rows={2} placeholder="Type your topic" className="quizFormInput" />
                                </Form.Item>

                                <Form.Item name="instructions" label="Description" className="quizFormLabel" initialValue={""} rules={[{ required: false }]}>
                                    {/* <QuillNoSSRWrapper theme="snow" value={convertedText} onChange={setConvertedText} style={{ minHeight: "" }} /> */}
                                    <QuillRWrapper theme="snow" style={{ border: "1px solid black" }} placeholder="Write here" />
                                </Form.Item>
                                <Form.Item name="files" label="Attachments" className="quizFormLabel">
                                    {/* <Input type="file" multiple className="quizFormInput" /> */}
                                    <Upload ref={createLessRef} multiple={true} name="file"
                                        // onChange={handleUploadFile} 
                                        customRequest={dummyRequest}

                                    >
                                        <Button style={{ border: "1px solid black" }} icon={<UploadOutlined />}>
                                            Attach files
                                        </Button>
                                    </Upload>
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

export default ProtectedComponent(TutorCreateLesson);
