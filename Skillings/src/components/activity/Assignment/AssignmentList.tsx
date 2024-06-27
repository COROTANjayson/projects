import React from "react"
import { Button, Table, Typography } from "antd"
import type { ColumnsType } from "antd/es/table"
import AssignmentSubmission from "./AssignmentSubmission"
import { useDispatch } from "react-redux"
// import { getGeneralAssignmentAnswerList } from "@/app/redux/activity/activity.actions"
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
    assignments: Array<any>
}

const AssignmentList: React.FC<Props> = ({ assignments }) => {
    const dispatch = useDispatch()
    const [viewSubmissions, setViewSubmissions] = React.useState(false)
    // const [loading, setLoading] = React.useState(false);
    // const [activityData, setActivityData] = React.useState(null);
    // const [studentSubmissions, setStudentSubmissions] = React.useState([]);
    const [activityId, setActivityId] = React.useState("")
    const [answerList, setAnswerList] = React.useState(null)
    // const dispatch = useDispatch();

    // React.useEffect(() => {
    //     fetchAnswersByActType("Assignment")
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [])

    // const fetchAnswersByActType = async (type) => {
    //     const payload = {
    //         type
    //     }

    //     dispatch(
    //         getGeneralAssignmentAnswerList(payload, (response: any) => {
    //             if (response) {
    //                 setAnswerList(response)
    //                 // console.log('student submissions by type mao ni: ', response);
    //             }
    //         })
    //     )
    // }

    // const selectAnswerListByActivityId = (activityId) => {
    //     if (answerList) {
    //         const newAnswerList = answerList.filter((answer) => {
    //             if (answer.activityId === activityId) {
    //                 return answer
    //             }
    //         })

    //         return newAnswerList.length
    //     }
    // }

    // const fetchAnswer = async (activityId) => {
    //     // const payload = {
    //     //   activityId: activityId,
    //     //   type: 'Assignment'
    //     // }

    //     setActivityId(activityId)
    //     // dispatch(
    //     //   getAssignmentAnswerList(payload, (response: any) => {
    //     //     if (response) {
    //     //       // console.log('fetch answer callback', response);
    //     //       console.log('getAssignmentAnswerList', response);
    //     //       setStudentSubmissions(response);
    //     //     }
    //     //   })
    //     // )
    // }

    // const handleActivity = async (id) => {
    //     // setLoading(true);
    //     // const specificActivityData = assignments.find(item => item.id === id);
    //     fetchAnswer(id)
    //     // console.log('specificData', specificActivityData);
    //     setViewSubmissions(true)
    //     // setLoading(false);
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
                        <div style={{ backgroundColor: "#FFCE11", width: "100%", height: "46px", display: " flex", justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ display: "block", color: "white" }}>{row}</Text>
                        </div>
                    </div>
                </>
            )
        },
        {
            title: "Submitted",
            // dataIndex: "score",
            // key: 'score',
            align: "center",
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            render: (row) => (
                <>
                    <div style={{ backgroundColor: "#F5F7FA", height: "46px", margin: "4px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        {/* <Text style={{ display: "block" }}>{selectAnswerListByActivityId(row.id)}</Text> */}
                        <Text style={{ display: "block" }}>3</Text>

                    </div>
                </>
            )
        },
        {
            title: "Remaining",
            // dataIndex: "score",
            // key: 'score',
            align: "center",
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            render: (row) => (
                <>
                    <div style={{ backgroundColor: "#F5F7FA", height: "46px", margin: "4px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        {/* <Text style={{ display: "block" }}>{row.members.length - selectAnswerListByActivityId(row.id)}</Text> */}
                        <Text style={{ display: "block" }}>1</Text>

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

    return (
        <>
            {viewSubmissions ? <AssignmentSubmission activityId={activityId} /> : <Table columns={columns} dataSource={assignments} />}
            {viewSubmissions && (
                <Button style={{ float: "right" }} onClick={() => setViewSubmissions(false)}>
                    Back
                </Button>
            )}
        </>
    )
}

export default AssignmentList
