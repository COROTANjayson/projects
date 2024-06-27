import React from "react"
import { Image, Typography, Input, Upload, Button, Avatar, Form, notification } from "antd"
import Router from "next/router"
import { useDispatch } from "react-redux"
import moment from "moment"
import { useRouter } from "next/router"
import { getAssignmentAnswerV2, saveScoreAssignmentV2 } from "@/app/redux/activity/activity.actions"
import dynamic from "next/dynamic"
import { UserOutlined } from "@ant-design/icons"
import { t } from "@lingui/macro"
const QuillNoSSRWrapper = dynamic(import("react-quill"), {
    ssr: false,
    loading: () => <p>Loading ...</p>
})

const { Text } = Typography
type Props = {
    activity: any
}

const AssignmentCheck = ({ activity }: Props) => {
    // const user = useSelector((state: RootState) => state.auth.user, shallowEqual)
    const router = useRouter()
    const { query }: any = router
    const [btnLoading, setBtnLoading] = React.useState(false)
    const [released, setReleased] = React.useState("")
    const [attachedFiles, setAttachedFiles] = React.useState([])
    const [studentAnswer, setStudentAnswer] = React.useState(null)
    const [studentData, setStudentData] = React.useState(null)
    const editShowAssRef = React.useRef<any>()
    const dispatch = useDispatch()
    const [form] = Form.useForm()

    const fetchAnswer = async () => {
        dispatch(
            getAssignmentAnswerV2(query.activityId, query.studentId, (response: any) => {
                if (response) {
                    // setAttempted(response.success ? true : false)
                    setStudentAnswer(response.data)
                    setStudentData(response.data.userData)
                    // console.log('studentanswer', response);
                    form.setFieldsValue({
                        totalGrade: response.data.totalGrade
                    })
                }
            })
        )
    }

    const convertUnix = (value) => {
        const time = moment.unix(value).format("MMMM Do YYYY, h:mm:ss a")
        return time
    }

    const handleSubmit = (values) => {
        const payload = {
            totalGrade: parseInt(values.totalGrade),
            graded: true
        }

        setBtnLoading(true)
        saveScoreAssignmentV2(studentAnswer.id, payload).then((response) => {
            // console.log('response', response);
            if (response.success) {
                notification.success({
                    description: t`Graded Answer Successfully.`,
                    message: t`Success`,
                    duration: 2
                })
            } else {
                notification.error({
                    description: t`There is something wrong.`,
                    message: t`Error`,
                    duration: 2
                })
            }

            setBtnLoading(false)
        })
    }

    // const saveGradeAssignment = () => {

    //   setValues({ ...values, loading: true })
    //   message.loading(t`Saving Grade...`)
    //   saveScoreAssignment(ids, payload).then(() => {
    //     if (values.draftsArray.includes(values.toGrade)) {
    //       const draftsArray = values.draftsArray
    //       const filtered = draftsArray.filter(function (el) {
    //         return el.uid !== values.toGrade.uid
    //       })
    //       const gradedArray = values.gradedArray
    //       gradedArray.push(values.toGrade)

    //       const params = {
    //         gradedArray: gradedArray,
    //         draftsArray: filtered,
    //         graded: gradedArray.length,
    //         drafts: filtered.length
    //       }
    //       dispatch(
    //         transferGradeStatus(activityId, params, (callback: any) => {
    //           if (callback.success) {
    //             message.destroy()
    //             setTimeout(function () {
    //               message.success(t`Grade Saved Successfully`)
    //               setValues({
    //                 ...values,
    //                 gradedArray: gradedArray,
    //                 draftsArray: filtered,
    //                 loading: false
    //                 // creation: 0
    //               })
    //             }, 500)
    //           } else {
    //             message.destroy()
    //             message.error(callback.error)
    //           }
    //         })
    //       )
    //     } else {
    //       setTimeout(function () {
    //         message.destroy()
    //         message.success(t`Grade Saved Successfully`)
    //         setValues({
    //           ...values,
    //           loading: false
    //         })
    //       }, 500)
    //     }
    //   })
    // }

    React.useEffect(() => {
        fetchAnswer()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    React.useEffect(() => {
        if (activity) {
            const time = moment.unix(activity.modified).format("MMMM Do YYYY, h:mm:ss a")
            setReleased(time)

            const convertedFiles: any[] = []
            if (activity.files) {
                activity.files.map((item) => {
                    const hostName = new URL(item).hostname
                    let name

                    if (hostName === "skillings-bucket-sea.s3.ap-southeast-1.amazonaws.com") {
                        const splitStr = item.split("activities%2F")
                        const newSplitStr = splitStr[0]
                        name = newSplitStr.split("/")
                        name = name[5].split(".")[0]
                        name = name.substring(10)
                    } else {
                        const splitStr = item.split("activities%2F")
                        const newSplitStr = splitStr[1]
                        name = newSplitStr.split("?")[0]
                    }

                    convertedFiles.push({
                        uid: Math.random(),
                        url: item,
                        name: name,
                        thumbUrl: item,
                        status: "success"
                    })
                })
            }

            setAttachedFiles(convertedFiles)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activity])

    return (
        studentAnswer &&
        studentData && (
            <div className="assignmentPreviewContainer">
                <div style={{ width: "636px", marginLeft: "auto", marginRight: "auto" }}>
                    <section className="header">
                        <div style={{ display: "flex", columnGap: "16px" }}>
                            <div className="" style={{ flex: "none" }}>
                                <div className="previewLogo">
                                    <Image width={16} src="/images/activity/document.svg" preview={false} />
                                </div>
                            </div>
                            <div className="">
                                <Text style={{ fontSize: "24px", fontWeight: 600 }}>{activity.topic}</Text>
                                <div>{released}</div>
                            </div>
                        </div>
                        <div>
                            {/* <Link href={`/tutor/${user.id}/activity/assignment/edit/${query.activityId}`}>
              <button className="edit">
                <Image width={16} src="/images/activity/edit.svg" preview={false} />
              </button>
            </Link> */}
                            <div style={{ textAlign: "right" }}>
                                <Text style={{ fontWeight: 500, fontSize: "18px" }}>
                                    {studentAnswer.totalGrade}/{activity.points}
                                </Text>
                            </div>
                            <div>
                                <Text>Total Points</Text>
                            </div>
                            {/* <button className="edit">
                            <Image width={16} src="/images/activity/edit.svg" preview={false} />
                        </button> */}
                        </div>
                    </section>

                    <section className="section" style={{ padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                        <div>
                            <Avatar
                                style={{ cursor: "pointer" }}
                                size="default"
                                src={""}
                                icon={studentData.photoURL ? <img src={studentData.photoURL} /> : <UserOutlined style={{ fontSize: "12px" }} />}
                            />
                            <Text style={{ marginLeft: "8px", fontSize: "16px", fontWeight: "600" }}>{studentData.fullName}</Text>
                        </div>
                        <div>
                            <Text>Submitted : {convertUnix(studentAnswer.dateSubmitted)}</Text>
                        </div>
                    </section>

                    <Form id="assignForm" layout="vertical" form={form} onFinish={handleSubmit}>
                        <section className="section" style={{ marginTop: "0px" }}>
                            <div style={{ backgroundColor: "#FDFDFD", border: "1px solid #E4E4E4", padding: "25px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <p>{activity.instructions}</p>

                                    <Text>
                                        {activity.points} <span>Pts</span>
                                    </Text>
                                </div>
                                {activity.files.length > 0 ? <Upload fileList={[...attachedFiles]} ref={editShowAssRef} disabled></Upload> : <Text>No files</Text>}
                                <div style={{ marginTop: "22px" }}>
                                    <div style={{ marginTop: "18px" }}>
                                        <div className="quizFormLabel">Answer</div>
                                        <div style={{ marginTop: "10px" }}>
                                            <QuillNoSSRWrapper readOnly={true} theme={"bubble"} value={studentAnswer.answer || ""} />
                                        </div>
                                    </div>
                                </div>
                                <div style={{ marginTop: "22px" }}>
                                    <div className="quizFormLabel">Points</div>
                                    <Form.Item
                                        name="totalGrade"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Please enter points"
                                            }
                                        ]}
                                    >
                                        <Input style={{ width: "96px" }} placeholder="0" type="number" min="0" max={activity.points} className="quizFormInput" />
                                    </Form.Item>
                                </div>
                            </div>
                            {/* <div style={{ backgroundColor: "#FDFDFD", border: "1px solid #E4E4E4", padding: "25px" }}>
                        <Text style={{ fontWeight: 600 }}>Comments</Text>
                        <div style={{ minHeight: "142px", border: "1px solid #E4E4E4", marginTop: "10px", padding: "5px" }}>
                            <p></p>
                        </div>
                    </div> */}
                        </section>
                        <Form.Item>
                            <section style={{ marginTop: "18px", marginBottom: "18px", display: "flex", justifyContent: "flex-end", columnGap: "1rem" }}>
                                <Button onClick={() => Router.back()} style={{ width: "128px" }}>
                                    Back
                                </Button>
                                <Button type="primary" htmlType="submit" loading={btnLoading} style={{ width: "128px" }}>
                                    Save
                                </Button>
                            </section>
                        </Form.Item>

                        {/* <div className="quizFormButtons">
              <Button onClick={() => Router.back()} htmlType="button" loading={btnLoading} danger className="cancel">
                Cancel
              </Button>
              <Button htmlType="submit" loading={btnLoading} type="primary" className="save">
                Save
              </Button>
            </div> */}
                    </Form>
                </div>
            </div>
        )
    )
}

export default AssignmentCheck
