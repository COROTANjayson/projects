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
import 'react-quill/dist/quill.snow.css';

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

const TutorEditLesson = () => {
    const pathname = usePathname();
    const parts = pathname.split("/");
    const activityId = parts[parts.length - 1];
    const router = useRouter()
    const user = useSelector((state: RootState) => state.auth.user, shallowEqual)

    const dispatch = useDispatch()
    // const [activity, setActivity] = React.useState(null)
    const [btnLoading, setBtnLoading] = useState(false)
    const [form] = Form.useForm()
    const editShowAssRef = React.useRef<any>()
    const editAssRef = React.useRef()
    const [attachedFiles, setAttachedFiles] = useState([])

    React.useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user.uid, user.courses])

    // React.useEffect(() => {
    //     // eslint-disable-next-line no-console
    //     console.log("query activity id", query)
    //     dispatch(
    //         getActivityData(query.activityId, (callback: any) => {
    //             // eslint-disable-next-line no-console
    //             console.log("callback", callback)
    //             setActivity(callback)
    //         })
    //     )
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [])

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

    //         form.setFieldsValue({
    //             topic: activity.topic,
    //             instructions: activity.instructions
    //         })
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [activity])

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
    //     // eslint-disable-next-line no-console
    //     console.log("onsubmit values", values)

    //     form.validateFields()
    //         .then((values) => {
    //             // eslint-disable-next-line no-console
    //             setBtnLoading(true)
    //             const payload = {
    //                 tutorId: query.tutorId,
    //                 courseId: query.courseId,
    //                 members: [],
    //                 type: "Lesson",
    //                 ...values,
    //                 files: values.files == undefined ? [] : values.files.fileList
    //             }
    //             dispatch(
    //                 editLesson(query.activityId, payload, (callback: any) => {
    //                     // Get this url from response in real world.
    //                     if (callback === "success") {
    //                         notification.success({
    //                             description: t`Lesson Updated Successfully`,
    //                             message: "Success",
    //                             duration: 2
    //                         })
    //                         // form.resetFields()
    //                         // router.push(`/courses/${courseId}/activities?course=${query.course}`)
    //                         router.back()
    //                         setBtnLoading(false)
    //                     } else {
    //                         notification.error({
    //                             description: callback,
    //                             message: "Error",
    //                             duration: 2
    //                         })
    //                         // setValues({ ...values, loading: false })
    //                         setBtnLoading(false)
    //                     }
    //                 })
    //             )

    //             // router.push(`/tutor/${query.tutorId}/coupons/`)
    //         })

    //         // eslint-disable-next-line
    //         .catch((info) => {
    //             // console.log("Validate Failed:", info)
    //         })

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

    return (
        <div className="quizContainer">
        <div style={{ padding: "15px 0px" }}>
            <div className="header">
                <button onClick={() => router.back()} type="button" className="arrowBack">
                    <ArrowLeftOutlined style={{ fontSize: "20px" }} />
                </button>

                <Text style={{ fontSize: "36px", fontWeight: 600 }}>Edit Lesson</Text>
            </div>
            <div className="breadcrumb">
                <div className="breadcrumbLink">Lesson </div>
                <RightOutlined />
                <div className="breadcrumbLink test">Edit</div>
                <RightOutlined />
                <div className="breadcrumbLink test">{activity ? activity.topic : ""}</div>
            </div>

            <div className="main">
                <div className="quizForm">
                    <Form layout="vertical" form={form} 
                    // onFinish={onSubmit}
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
                                <QuillNoSSRWrapper theme="snow" style={{ border: "1px solid black" }} placeholder="Write here" />
                            </Form.Item>
                            <Upload fileList={[...attachedFiles]} ref={editShowAssRef}
                            //  onRemove={handleEditRemove}
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

export default ProtectedComponent(TutorEditLesson);
