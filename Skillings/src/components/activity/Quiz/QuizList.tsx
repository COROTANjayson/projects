import React from "react"
import { Button, Table, Typography } from "antd"
import type { ColumnsType } from "antd/es/table"
import QuizSubmission from "./QuizSubmission"
// import { useDispatch } from "react-redux"
// import { getAssignmentAnswerList } from "@/app/redux/activity/activity.actions"

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
}

type Props = {
    quizzes: Array<any>
}

const QuizList: React.FC<Props> = ({ quizzes }) => {
    const [viewSubmissions, setViewSubmissions] = React.useState(false)
    const [activityId, setActivityId] = React.useState("")

    // const fetchAnswer = async (activityId) => {
    //     setActivityId(activityId)
    // }

    // const handleActivity = async (id) => {
    //     fetchAnswer(id)
    //     setViewSubmissions(true)
    // }

    const columns: ColumnsType<DataType> = [
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
            align: "center",
            render: (row) => (
                <>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <div style={{ backgroundColor: "#007BFF", width: "100%", height: "46px", display: " flex", justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ display: "block", color: "white" }}>{row}</Text>
                        </div>
                    </div>
                </>
            )
        },
        {
            title: "Submitted",
            dataIndex: "score",
            // key: 'score',
            align: "center",
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            render: (row) => (
                <>
                    <div style={{ backgroundColor: "#F5F7FA", height: "46px", margin: "4px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ display: "block" }}>0</Text>
                    </div>
                </>
            )
        },
        {
            title: "Remaining",
            dataIndex: "score",
            // key: 'score',
            align: "center",
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            render: (row) => (
                <>
                    <div style={{ backgroundColor: "#F5F7FA", height: "46px", margin: "4px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ display: "block" }}>0</Text>
                    </div>
                </>
            )
        },
        {
            title: "Action",
            dataIndex: "id",
            align: "center",
            render: (row) => (
                <>
                    <Button
                        // onClick={() => handleActivity(row)}
                        style={{ border: "none", backgroundColor: "#F5F7FA", width: "100%", height: "46px", margin: "4px", display: "flex", justifyContent: "center", alignItems: "center" }}
                    >
                        View
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
            {viewSubmissions ? <QuizSubmission activityId={activityId} /> : <Table columns={columns} dataSource={quizzes} />}
            {viewSubmissions && (
                <Button style={{ float: "right" }} onClick={() => setViewSubmissions(false)}>
                    Back
                </Button>
            )}
        </>
    )
}

export default QuizList
