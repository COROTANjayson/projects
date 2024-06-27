import React from "react"
import { Avatar, Button, Table, Typography } from "antd"
import type { ColumnsType } from "antd/es/table"
import { useDispatch, shallowEqual, useSelector } from "react-redux"
// import { getAssignmentAnswerList } from "@/app/redux/activity/activity.actions"
// import { RootState } from "@/data/utils/rootState"
import Link from "next/link"
import moment from "moment"
import { RootState } from "@/redux/store"

// interface DataType {
//   key: string;
//   name: string;
//   age: number;
//   address: string;
//   tags: string[];
// }
const { Text } = Typography

interface DataType {
    key?: string
    student?: string
    type?: string
    status?: boolean
    time_submitted?: any
    score?: any
    userData?: any
}

type Props = {
    submissions?: Array<any>
    activityId?: any
}

const AssignmentSubmission: React.FC<Props> = ({ activityId }) => {
    const { user } = useSelector((state: RootState) => ({ user: state.auth.user }), shallowEqual)
    const [studentSubmissions, setStudentSubmissions] = React.useState([])
    const [loading, setLoading] = React.useState(true)
    const dispatch = useDispatch()

    // const convertUnix = (value) => {
    //     const time = moment.unix(value).format("MMMM Do YYYY, h:mm:ss a")
    //     return time
    // }

    // React.useEffect(() => {
    //     fetchStudentAnswers(activityId)
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
    //                 // console.log('student submissions mao ni: ', response);
    //                 setStudentSubmissions(response)
    //                 setLoading(false)
    //             }
    //         })
    //     )
    // }

    const columns: ColumnsType<DataType> = [
        {
            title: "Student",
            dataIndex: "userData",
            key: "userData",
            render: (row) => (
                <>
                    <div style={{ display: "flex", columnGap: "8px", backgroundColor: "#F5F7FA", height: "46px", alignItems: "center", padding: "16px", margin: "4px" }}>
                        {/* <Avatar style={{ display: "flex", alignItems: "center", color: "#fff", backgroundColor: "#007BFF", width: "24px", height: "24px" }}>{row.charAt(0)}</Avatar> */}
                        <Avatar style={{ display: "flex", alignItems: "center", color: "#fff", backgroundColor: "#007BFF", width: "24px", height: "24px" }}>{row.fullName.charAt(0)}</Avatar>
                        <Text style={{ display: "block" }}>{row.fullName}</Text>
                    </div>
                </>
            )
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            align: "center",
            render: (row) => (
                <>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <div style={{ backgroundColor: "#FFCE11", width: "100%", height: "46px", display: " flex", justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ display: "block", color: "white" }}>{row}</Text>
                        </div>
                    </div>
                </>
            )
        },
        {
            title: "Status",
            // dataIndex: "status",
            // key: "status",
            align: "center",
            render: (row) => (
                <>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <div
                            style={{
                                backgroundColor: `${row.graded ? "#07CB14" : "#F5F7FA"}`,
                                width: "100%",
                                margin: "4px",
                                height: "46px",
                                display: " flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }}
                        >
                            <Text style={{ display: "block", color: `${row.graded ? "white" : "black"}` }}>{row.graded ? "Done" : "Not graded"}</Text>
                        </div>
                    </div>
                </>
            )
        },
        {
            title: "Date Submitted",
            // key: "time_submitted",
            // dataIndex: "time_submitted",
            align: "center",
            render: (row) => (
                <>
                    <div style={{ backgroundColor: "#F5F7FA", height: "46px", display: " flex", justifyContent: "center", alignItems: "center" }}>
                        {/* <Text style={{ display: "block" }}>{convertUnix(row.dateSubmitted)}</Text> */}
                        <Text style={{ display: "block" }}>date draft</Text>

                    </div>
                </>
            )
        },
        {
            title: "Score",
            // dataIndex: "score",
            // key: 'score',
            align: "center",
            render: (row) => (
                <>
                    <div style={{ backgroundColor: "#F5F7FA", height: "46px", margin: "4px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ display: "block" }}>
                            {row.totalGrade}/{row.totalPoints}
                        </Text>
                    </div>
                </>
            )
        },
        {
            title: "Action",
            // dataIndex: 'score',
            // key: 'score',
            align: "center",
            render: (row) => (
                <>
                    <Button style={{ border: "none", backgroundColor: "#F5F7FA", width: "100%", height: "46px", margin: "4px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Link href={`/tutor/activity/submission/check/${row.activityId}?studentId=${row.userData.id}`}>{row.graded ? "Re-check" : "Check"}</Link>
                    </Button>
                </>
            )
        }
        // {
        //   title: 'Action',
        //   key: 'action',
        //   render: (_, record) => (
        //     <Space size="middle">
        //       <a>Invite {record.name}</a>
        //       <a>Delete</a>
        //     </Space>
        //   ),
        // },
    ]

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const data: DataType[] = [
        {
            key: "1",
            student: "John Brown",
            type: "Assignment",
            status: false,
            time_submitted: "20 Sept 2020 12:20",
            score: "5/14"
        },
        {
            key: "2",
            student: "Jokno Baldwin",
            type: "Assignment",
            status: true,
            time_submitted: "20 Sept 2020 12:20",
            score: "5/14"
        },
        {
            key: "3",
            student: "Jeniffer suarez",
            type: "Assignment",
            status: false,
            time_submitted: "20 Sept 2020 12:20",
            score: "5/14"
        }
    ]

    return (
        <>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <Table columns={columns} dataSource={studentSubmissions} />
                    {/* <div>
                        <div>hello world</div>
                        {data.map((answer, index) => (
                            <div key={index}>{answer.student}</div>
                        ))}
                    </div> */}
                </>
            )}
        </>
    )
}

export default AssignmentSubmission
