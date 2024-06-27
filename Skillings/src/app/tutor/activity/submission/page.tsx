'use client'
import React from "react"
import { Typography, Tabs } from "antd"
import { ArrowLeftOutlined, RightOutlined } from "@ant-design/icons"
// import Router, { useRouter } from "next/router"
// import QuizSubmission from "@/components/Activity/Quiz/QuizSubmission"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
// import { getActivitiesByTutor } from "@/app/redux/activity/activity.actions"
import AssignmentList from "@/components/activity/Assignment/AssignmentList"
import QuizList from "@/components/activity/Quiz/QuizList"
// import { getStudentsFromBookingSchedule } from "@/app/redux/booking/booking.actions"
import { RootState } from "@/redux/store"
import { useRouter } from "next/navigation"
// import { getActivityData } from "@/app/redux/activity/activity.actions"

const { Text } = Typography
// const { TextArea } = Input
const { TabPane } = Tabs
const Submission = () => {
    const user = useSelector((state: RootState) => state.auth.user, shallowEqual)
    const router = useRouter()
    const dispatch = useDispatch()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // const { query }: any = router
    const [quizzes, setQuizzes] = React.useState([])
    const [assignments, setAssignments] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    // const [courseStudents, setCourseStudents] = React.useState(null)
    // const [overview, setOverview] = React.useState(null)
    // const [activity, setActivity] = React.useState(null)

    // React.useEffect(() => {
    //     // eslint-disable-next-line no-console
    //     dispatch(
    //         getActivitiesByTutor(user.uid, (callback: any) => {
    //             // const tempoActivities: any = []
    //             // console.log('getactivitiesbytutor', callback);
    //             callback.sort(compareTimestamps)

    //             const filteredQuizzes = callback.filter((activity) => activity.type === "Quiz")
    //             const filteredAssignments = callback.filter((activity) => activity.type === "Assignment")

    //             // console.log('filteredQuizzes', filteredQuizzes);
    //             // console.log('filteredAssignments', filteredAssignments);

    //             // console.log('activities', callback);
    //             setQuizzes(filteredQuizzes)
    //             setAssignments(filteredAssignments)

    //             setLoading(false)
    //         })
    //     )
    //     getMembers()
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [])

    // const fetchStudentAnswers = async (activityId) => {
    //     const payload = {
    //         activityId: activityId,
    //         type: "Assignment"
    //     }

    //     dispatch(
    //         getAssignmentAnswerList(payload, (response: any) => {
    //             if (response) {
    //                 // console.log('fetch answer callback', response);
    //                 // console.log('student submission mao ni: ', response);
    //                 // setStudentSubmissions(response)
    //                 setLoading(false)
    //             }
    //         })
    //     )
    // }

    // const getMembers = async () => {
    //     await getStudentsFromBookingSchedule(query.courseId, (callback: any) => {
    //         setCourseStudents(callback)
    //     })

        // const getStudents = (await new Promise((resolve) => {
        //     getStudentsFromBookingSchedule(query.courseId, (callback) => {
        //         resolve(callback)
        //     })
        // })) as any[]

        // console.log('students', getStudents.length);
        // console.log('students', getStudents);
        // setCourseStudents(getStudents);
    // }

    // const getAssignedActivities = async (courseIds) => {
    //     const activitiesByCourse = (await new Promise((resolve) => {
    //         getActivitiesByCourses(courseIds, (activitiesCallback) => {
    //             resolve(activitiesCallback)
    //         })
    //     })) as any[]

    //     const filteredActivities = activitiesByCourse.filter((activity) => {
    //         return activity.members.includes(user.email)
    //     })

    //     return filteredActivities
    // }

    // React.useEffect(() => {
    //     getMembers();
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [])

    // const compareTimestamps = (a, b) => {
    //     // Compare the timestamp values of a and b
    //     if (a.modified < b.modified) {
    //         return 1
    //     } else if (a.modified > b.modified) {
    //         return -1
    //     } else {
    //         return 0
    //     }
    // }
    let courseStudents:any = [
        {
        id: '1'
    }]

    return (
        <>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="submissionContainer">
                    <div
                        style={{
                            marginTop: "20px",
                            width: "100%",
                            height: "157px",
                            display: "flex",
                            alignItems: "center",
                            padding: "35px",
                            borderTop: "8px solid #007BFF",
                            borderBottom: "1px solid #E4E4E4",
                            borderRight: "1px solid #E4E4E4",
                            borderLeft: "1px solid #E4E4E4"
                        }}
                        className=""
                    >
                        <div className="">
                            <div className="header" >
                                <button onClick={() => router.back()} type="button" className="arrowBack" >
                                    <ArrowLeftOutlined style={{ fontSize: "20px" }} />
                                </button>

                                <div>
                                    <Text style={{ fontSize: "33px", fontWeight: 600 }}>Course • Submission</Text>
                                    <div className="breadcrumb">
                                        {/* <div className="breadcrumbLink">{currentCourse ? currentCourse.courseName : ""}</div>
                    <RightOutlined /> */}
                                        {/* <div className="breadcrumbLink">Activity</div>
                    <RightOutlined /> */}
                                        <div className="breadcrumbLink">Activity</div>
                                        <RightOutlined />
                                        <div className="breadcrumbLink">Course Examp</div>
                                        <RightOutlined />
                                        {/* <div className="breadcrumbLink">{activity ? activity.title : ""}</div> */}
                                        <div className="breadcrumbLink">Submission</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className=" overview" style={{ border: "1px solid #E4E4E4", marginTop: "24px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "36px 26px 26px 26px", borderBottom: "1px solid #E4E4E4" }}>
                            <Text style={{ fontSize: "36px", fontWeight: 600 }}>Overview</Text>
                            <div style={{ fontSize: "14px", display: "flex", columnGap: "4px" }}>
                                {/* <div style={{ backgroundColor: "#F5F7FA", padding: "13px 16px" }}>
                                    <Text style={{ fontWeight: 600 }}>Submitted: 0</Text>
                                </div>
                                <div style={{ backgroundColor: "#F5F7FA", padding: "13px 16px" }}>
                                    <Text style={{ fontWeight: 600 }}>Remaining: 0</Text>
                                </div> */}
                                <div style={{ backgroundColor: "#F5F7FA", padding: "13px 16px" }}>
                                    <Text style={{ fontWeight: 600 }}>No. of students: {courseStudents && courseStudents.length}</Text>
                                </div>
                            </div>
                        </div>

                        <div className="tabs_section" style={{ padding: "26px" }}>
                            {/* <Tabs type="card" onChange={onTabChange} activeKey={activeKey} defaultActiveKey={params.tab} */}
                            <Tabs type="line" defaultActiveKey="1">
                                <TabPane tab="Quiz" key="1">
                                    <QuizList quizzes={quizzes} />
                                </TabPane>
                                <TabPane tab="Assignment" key="2">
                                    <AssignmentList assignments={assignments} />{" "}
                                </TabPane>
                            </Tabs>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Submission
