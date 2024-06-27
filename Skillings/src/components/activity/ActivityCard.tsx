import React, { useState } from "react"
import { MoreOutlined } from "@ant-design/icons"
import { Dropdown, Menu, Typography, Button, Modal, Select, Avatar, SelectProps, Tag, notification, Form, MenuProps } from "antd"
import Link from "next/link"
import { useSelector, shallowEqual, useDispatch } from "react-redux"
import { RootState } from "@/redux/store"
// import { assignStudents, deleteActivity } from "@/app/redux/activity/activity.actions"
// import { t } from "@lingui/macro"
const { Text } = Typography
const { Option } = Select
// import { getStudentsFromBookingSchedule } from "@/app/redux/booking/booking.actions"

type Props = {
    activityData: any
    courseStudents: any
}

const activityTypeColors: any = {
    Assignment: "#FFCE11",
    Lesson: "#07CB14",
    Quiz: "#007BFF"
}

const ActivityCard = ({ activityData, courseStudents }: Props) => {
    const { user } = useSelector((state: RootState) => ({ user: state.auth.user }), shallowEqual)
    const dispatch = useDispatch()
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [openActivityRemove, setOpenActivityRemove] = useState(false)
    // const [courseStudents, setCourseStudents] = useState([])
    const [form] = Form.useForm()

    const showModal = () => {
        setOpen(true)
    }

    React.useEffect(() => {
        // eslint-disable-next-line no-console
        // getMembers()
        // value: student.data().email,
        //     label: student.data().fullName,
        //         email: student.data().email,
        //             studentName: student.data().fullName,
        //                 id: student.data().id
        // eslint-disable-next-line react-hooks/exhaustive-deps
        // if (activityData) {
        //     form.setFieldsValue({
        //         members: activityData.members
        //     })
        // }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activityData])

    // const handleSelect = (value) => {
    //     setSelectedStudents(value);
    // }

    // const getMembers = async () => {
    //     if (activityData) {
    //         await getStudentsFromBookingSchedule(activityData.courseId, (callback: any) => {
    //             setCourseStudents(callback)
    //         })
    //     }
    // }

    // const handleOk = () => {
    //     form.validateFields().then((values) => {
    //         const payload = {
    //             members: values.members
    //         }
    //         setLoading(true)
    //         dispatch(
    //             assignStudents(activityData.id, payload, (callback: any) => {
    //                 // Get this url from response in real world.
    //                 if (callback === "success") {
    //                     notification.success({
    //                         description: t`User/s assigned successfully!`,
    //                         message: "Success",
    //                         duration: 2
    //                     })
    //                     // form.resetFields()
    //                     // router.push(`/tutor/${user.id}/activity`)
    //                     // router.back()
    //                     setLoading(false)
    //                     handleCancel()
    //                 } else {
    //                     notification.error({
    //                         description: callback,
    //                         message: "Error",
    //                         duration: 2
    //                     })
    //                     // setValues({ ...values, loading: false })
    //                     setLoading(false)
    //                     handleCancel()
    //                 }
    //             })
    //         )
    //     })
    // }

    const handleCancel = () => {
        setOpen(false)
    }

    const options: SelectProps["options"] = []
    for (let i = 10; i < 36; i++) {
        options.push({
            label: i.toString(36) + i,
            value: i.toString(36) + i
        })
    }

    // const handleCancelActivityRemove = () => {
    //     setOpenActivityRemove(false);
    // }

    // const handleActivityRemove = () => {
    //     setLoading(true)
    //     deleteActivity(activityData.id).then(() => {
    //         setLoading(false)
    //         notification.success({
    //             description: t`Lesson Deleted Successfully`,
    //             message: "Success",
    //             duration: 2
    //         })
    //     })
    //     setOpenActivityRemove(false)
    // }

    let activityType = activityData.type === 'Lesson' ? 'lesson' : activityData.type === 'Assignment' ? 'assignment' : activityData.type === 'Quiz' ? 'quiz' : ''

    const items: MenuProps['items'] = [
        {
            label: <Link href={`/tutor/activity/${activityType}/preview/${activityData.id}`}>Open</Link>,
            key: '0',
        },
        {
            label: <Link href={`/tutor/activity/${activityType}/edit/${activityData.id}`}>Edit</Link>,
            key: '1',
        },
        {
            label: <div onClick={showModal}>Send</div>,
            key: '3',
        },
        {
            label: <div onClick={() => setOpenActivityRemove(true)}>Remove</div>,
            key: '4',
        },


    ];
    return (
        <div className="activityContainer">
            <Modal
                open={openActivityRemove}
                title="Remove Activity"
                // onOk={handleActivityRemove}
                onCancel={() => setOpenActivityRemove(false)}
                footer={[
                    <Button key="back" onClick={() => setOpenActivityRemove(false)}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" danger loading={loading}
                    //  onClick={handleActivityRemove}
                    >
                        Okay
                    </Button>
                ]}
            >
                <p>Are you sure you want to remove this activity?</p>
                <div>{activityData.id}</div>
                <Tag color="blue">{activityData.topic}</Tag>
            </Modal>
            <Modal
                // title="Title"
                // onOk={handleOk}
                open={open}
                onCancel={handleCancel}
                footer={[
                    <div key="back" style={{ display: "flex", columnGap: "10px" }}>
                        {activityData.type == "Quiz" && (
                            <>
                                <div>
                                    <img style={{ width: "24px", height: "24px" }} src="/images/activity/bulb.svg" />
                                </div>
                                <div style={{ textAlign: "left" }}>
                                    <Text style={{ fontSize: "14px", fontWeight: 600 }}>{activityData.title}</Text>
                                    <br />
                                    <Text style={{ fontSize: "12px" }}>
                                        {activityData.questionArray.length} Question{activityData.questionArray.length > 1 ? "s" : null}
                                    </Text>
                                </div>
                            </>
                        )}
                    </div>,
                    <div key="submit">
                        {/* <Button key="back" onClick={handleCancel}>
                            Cancel
                        </Button> */}
                        <Button key="submit" htmlType="submit" form="assignForm" type="primary" loading={loading}>
                            Send
                        </Button>
                    </div>
                ]}
            >
                <div>
                    <Form id="assignForm" layout="vertical" form={form}
                    // ={handleOk}
                    >
                        <Text style={{ fontWeight: 600, fontSize: "24px" }}>Send to</Text>
                        {/* <Select
                        mode="multiple"
                        allowClear
                        style={{ width: '100%' }}
                        placeholder="Please select"
                        defaultValue={['a10', 'c12']}
                        onChange={handleChange}
                        options={options}
                    /> */}
                        <Form.Item
                            name="members"
                        // rules={[
                        //     {
                        //         required: true,
                        //         message: "Please select students"
                        //     }
                        // ]}
                        >
                            {/* <Select className="customSelect" mode="multiple" placeholder="Assign students" style={{ width: "100%", marginTop: "24px" }}>
                                {courseStudents &&
                                    courseStudents.map((student) => (
                                        <Option className="customOption" key={student.value} value={student.value} label={student.label}>
                                            <div style={{ padding: "10px", display: "flex", alignItems: "center", columnGap: "12px" }}>
                                                <Avatar style={{ display: "flex", alignItems: "center", color: "#fff", backgroundColor: "#007BFF", width: "24px", height: "24px" }}>
                                                    {student.label.charAt(0)}
                                                </Avatar>{" "}
                                                <div>{student.label}</div>
                                            </div>
                                        </Option>
                                    ))}
                            </Select> */}
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
            <div className="header">
                <Text>{activityData.type}</Text>
                <Dropdown
                    menu={{ items }}
                    trigger={["click"]}
                >
                    <MoreOutlined style={{ transform: " rotate(90deg)" }} />
                </Dropdown>
            </div>
            <div className="main" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <div style={{ backgroundColor: "white", width: "50px", height: "80px", borderTop: `2px solid ${activityTypeColors[activityData.type]}` }}></div>
                {/* <div style={{ backgroundColor: "white", width: "50px", height: "80px", borderTop: `2px solid ` }}></div> */}

            </div>
            <div className="footer">
                {activityData.type == "Assignment" ? (
                    <Text style={{ fontSize: "14px", fontWeight: 600 }}>{activityData.title}</Text>
                ) : (
                    <Text style={{ fontSize: "14px", fontWeight: 600 }}>{activityData.topic}</Text>
                )}
                {/* <Text style={{ fontSize: "14px", fontWeight: 600 }}>{activityData.topic}</Text> */}
                {/* {activityData.type != "Lesson" ? (
                    <div style={{ fontSize: "10px" }}>
                        <span>10</span> Questions
                    </div>
                ) : (
                    ""
                )} */}
            </div>
        </div>
    )
}

export default ActivityCard
