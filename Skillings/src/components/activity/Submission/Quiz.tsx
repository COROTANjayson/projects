import React from "react"
import { Typography, Form, Input, Space, Collapse, Select, Row, Col, Tag, Checkbox, Card, message, Divider, Radio, InputNumber, Button, notification, Avatar } from "antd"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/router"
import { enumerationCompute, getActivityData, getAssignmentAnswerV2, saveScoreAssignmentV2 } from "@/app/redux/activity/activity.actions"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import moment from "moment"
import { RootState } from "@/data/utils/rootState"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Link from "next/link"
import { Trans, t } from "@lingui/macro"
import { CaretRightOutlined, CheckCircleFilled, CloseCircleFilled, DeleteTwoTone, UserOutlined } from "@ant-design/icons"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { TextArea } = Input
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { Text, Title } = Typography
const { Option } = Select
// const { Panel } = Collapse
const QuizCheck = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const user = useSelector((state: RootState) => state.auth.user, shallowEqual)
    const dispatch = useDispatch()
    const router = useRouter()
    const { query }: any = router
    const [activity, setActivity] = React.useState(null)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [released, setReleased] = React.useState("")
    const [studentAnswer, setStudentAnswer] = React.useState(null)
    const [studentData, setStudentData] = React.useState(null)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const editShowAssRef = React.useRef<any>()
    const [form] = Form.useForm()
    const [quizForm] = Form.useForm()
    const history = useRouter()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { activityId }: any = history.query
    const [values, setValues] = React.useState<any>({
        gradedArray: [],
        draftsArray: [],
        content: {},
        loading: false,
        documentStatus: "",
        toGrade: {},
        studentAttemptEvidenceReady: false,
        dataObject: {},
        isReady: false,
        answerArray: [],
        score: 0,
        newScore: 0,
        oldScore: 0,
        uid: ""
    })

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

                    response.data.answerArray.forEach((item) => {
                        if (item.markCorrect === undefined) {
                            item.markCorrect = []
                        }
                    })
                    const updatedValues = {
                        ...values,
                        // questionArray: response.data.questionArray,
                        questionArray: response.data.activityCopy.questionArray,
                        dataObject: { ...response.data },
                        ...response.data.question,
                        creation: response.data.creation,
                        gradedArray: values.gradedArray,
                        // draftsArray: values.draftsArray,
                        // documentStatus: status,
                        answerArray: response.data.answerArray,
                        // canRetake: response.data.canRetake,
                        score: response.data.score,
                        newScore: response.data.score,
                        oldScore: response.data.oldScore,
                        // uid: item.uid,
                        // toGrade: item,
                        studentAttemptEvidenceReady: true,
                        isReady: true,
                        loading: false
                    }

                    // console.log('updated values', updatedValues)

                    setValues(updatedValues)
                }
            })
        )
    }

    const convertUnix = (value) => {
        const time = moment.unix(value).format("MMMM Do YYYY, h:mm:ss a")
        return time
    }

    React.useEffect(() => {
        fetchAnswer()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    React.useEffect(() => {
        dispatch(
            getActivityData(query.activityId, (callback: any) => {
                // eslint-disable-next-line no-console
                console.log("callback quiz preview", callback)
                setActivity(callback)
            })
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    React.useEffect(() => {
        if (activity) {
            const time = moment.unix(activity.modified).format("MMMM Do YYYY, h:mm:ss a")
            setReleased(time)
        }
    }, [activity])

    const truncateText = (text, length) => (text.length > length ? text.substring(0, length) + "..." : text)

    const saveScore = () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const payload = {
            answerArray: values.answerArray,
            score: values.newScore,
            oldScore: values.oldScore || values.score
        }
        // const ids = {
        //     userId: values.uid,
        //     activityId: activityId,
        //     attemptId: values.dataObject.id
        // }

        // console.log('saveScore: ', payload);
        // setValues({ ...values, loading: true })
        // message.loading(t`Saving Grade...`)
        // saveScoreQuiz(ids, payload).then(() => {
        //     const draftsArray = values.draftsArray
        //     const filtered = draftsArray.filter(function (el) {
        //         return el.uid !== values.toGrade.uid
        //     })
        //     const gradedArray = values.gradedArray
        //     gradedArray.push(values.toGrade)

        //     const params = {
        //         gradedArray: gradedArray,
        //         draftsArray: filtered,
        //         graded: gradedArray.length,
        //         drafts: filtered.length
        //     }
        //     dispatch(
        //         transferGradeStatus(activityId, params, (callback: any) => {
        //             if (callback.success) {
        //                 message.destroy()
        //                 setTimeout(function () {
        //                     message.success(t`Grade Saved Successfully`)
        //                     setValues({
        //                         ...values,
        //                         gradedArray: gradedArray,
        //                         draftsArray: filtered,
        //                         loading: false
        //                         // creation: 0
        //                     })
        //                 }, 500)
        //             } else {
        //                 message.destroy()
        //                 message.error(callback.error)
        //             }
        //         })
        //     )
        // })
    }

    // function toTitleCase(str) {
    //     return str.replace(/\w\S*/g, function (txt) {
    //         return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    //     })
    // }

    const handlePointsChange = (value, index) => {
        // console.log('handlePointsChange value', value);
        const answerArray = values.answerArray

        const score = answerArray[index]
        score["score"] = value
        setValues({ ...values, answerArray: answerArray })
        let newScore = 0
        answerArray.forEach((item) => {
            if (item.score) {
                newScore += item.score
            }
            if (item.essayScore) {
                newScore += item.essayScore
            }
        })
        setValues({
            ...values,
            newScore: newScore
        })
    }

    const isMatch = (a, b, isStrict = false) => {
        // console.log('question answer', a);
        // console.log('student answer', b);
        a = a.replace(/<[^>]*>?/gm, "")
        b = b.replace(/<[^>]*>?/gm, "")
        if (isStrict) {
            return a.toUpperCase().replace(/ /g, "").trim() === b.toUpperCase().replace(/ /g, "").trim()
        }
        return (
            a
                .toUpperCase()
                .replace(/ /g, "")
                .trim()
                .replace(/[^\w\s]/gi, "") ===
            b
                .toUpperCase()
                .replace(/ /g, "")
                .trim()
                .replace(/[^\w\s]/gi, "")
        )
    }

    const saveScoreOnly = () => {
        const payload = {
            answerArray: values.answerArray,
            score: values.newScore,
            totalGrade: values.newScore,
            graded: true
            // oldScore: values.oldScore || values.score
        }
        // const ids = {
        //     userId: values.uid,
        //     activityId: activityId,
        //     attemptId: values.dataObject.id
        // }
        setValues({ ...values, loading: true })
        message.loading(t`Saving Grade...`)
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
            setValues({
                ...values,
                loading: false,
                dataObject: {
                    ...values.dataObject,
                    score: values.newScore
                }
            })
        })
        // message.loading(t`Saving Grade...`)
        // saveScoreQuiz(ids, payload).then(() => {
        //     message.destroy()
        //     message.success("Grade saved.")
        //     setValues({
        //         ...values,
        //         loading: false,
        //         dataObject: {
        //             ...values.dataObject,
        //             score: values.newScore
        //         }
        //     })
        // })
    }

    React.useEffect(() => {
        // console.log('values track', values);
    }, [values])

    const handleFinalScore = (finalScore) => {
        setValues({
            ...values,
            newScore: finalScore
        })
    }

    return (
        activity &&
        studentAnswer &&
        studentData && (
            <div className="quizPreviewContainer">
                <div style={{ width: "636px", marginLeft: "auto", marginRight: "auto" }}>
                    <section className="header">
                        <div style={{ display: "flex", columnGap: "16px" }}>
                            <div className="">
                                <Text style={{ fontSize: "24px", fontWeight: 600 }}>{activity.topic}</Text>
                                <div>{released}</div>
                            </div>
                        </div>
                        <div>
                            <div style={{ textAlign: "right" }}>
                                <Text style={{ fontWeight: 500, fontSize: "18px" }}>
                                    {studentAnswer.totalGrade}/{activity.totalPoints}
                                </Text>
                            </div>
                            <div>
                                <Text>Total Points</Text>
                            </div>
                        </div>
                    </section>

                    <section className="section" style={{ padding: "16px", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
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

                    <Form layout="vertical" form={form}>
                        <section className="section" style={{ marginTop: "0px   " }}>
                            {/* <div className="trueFalse" style={{ backgroundColor: "#FDFDFD", padding: "24px", border: "1px solid #E4E4E4" }}>
                                <Text style={{ fontSize: "12px" }}>Instruction(Optional)</Text>
                                <br />
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <Text style={{ fontWeight: 600 }}>This is true or false question ?</Text>
                                    <Text style={{ fontSize: "12px" }}>15 Pts</Text>
                                </div>
                                <Form.Item
                                    name="trueFalse"
                                    style={{ marginTop: "22px" }}
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please select an answer."
                                        }
                                    ]}
                                >
                                    <Radio.Group>
                                        <Space direction="vertical">
                                            <Radio className="" value={1}>
                                                True
                                            </Radio>
                                            <Radio className="" value={2}>
                                                False
                                            </Radio>
                                        </Space>
                                    </Radio.Group>
                                </Form.Item>
                            </div> */}
                            {/* 1st version - gi display none sa nako */}
                            {studentAnswer &&
                                activity.questionArray.map((question, index) => (
                                    <div key={question.id} id="" style={{ display: "none " }}>
                                        {question.type !== "Instruction Box" ? (
                                            <div className="" style={{ position: "relative" }}>
                                                <div
                                                    // className="questionWrapper"
                                                    style={{ border: "1px solid #E4E4E4", padding: "24px", background: "#FDFDFD" }}
                                                    // bordered={false}
                                                    // expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                                                >
                                                    <div key={question.id}>
                                                        <div>
                                                            <div style={{ marginBottom: "1rem", display: "flex", alignItems: "center", columnGap: "0.50rem" }}>
                                                                <Text style={{ fontSize: "12px", fontWeight: "600" }}>
                                                                    <Trans>Question</Trans> # {index + 1}
                                                                </Text>

                                                                <Tag color="blue">{question.type}</Tag>
                                                            </div>
                                                            <div style={{ display: "flex", justifyContent: "justify-between" }}>
                                                                <div style={{ flex: 1 }}>
                                                                    {question.question ? (
                                                                        <div
                                                                            className="question-preview"
                                                                            dangerouslySetInnerHTML={{
                                                                                __html: truncateText(question.question, 90)
                                                                            }}
                                                                        />
                                                                    ) : (
                                                                        ""
                                                                    )}
                                                                </div>
                                                                <Row justify="end" gutter={[10, 24]}>
                                                                    <Col>
                                                                        <Text>{question.pointsPerItem} Pts</Text>
                                                                    </Col>
                                                                </Row>
                                                            </div>
                                                        </div>
                                                        <Space direction="vertical" style={{ width: "100%" }}>
                                                            {/* <Input.TextArea
                                                            disabled
                                                            defaultValue={question.question}
                                                            className="quizFormInput"
                                                            autoSize={{ minRows: 4, maxRows: 8 }}
                                                            placeholder={t`Question`}
                                                        /> */}
                                                            {question.choices ? (
                                                                <div style={{ display: "flex", marginTop: "16px" }}>
                                                                    <Space direction="vertical" style={{ width: "100%" }}>
                                                                        <Text className="quizFormLabel" style={{ fontSize: "14px" }}>
                                                                            <Trans>Choices</Trans>:
                                                                        </Text>
                                                                        {question.choices.map((choice) => (
                                                                            <Space key={choice.id} direction="vertical">
                                                                                <Input.TextArea
                                                                                    disabled
                                                                                    defaultValue={choice.description}
                                                                                    className="quizFormInput"
                                                                                    // onChange={(e) => handleChoiceChange(e, index, choiceKey, "description")}
                                                                                    autoSize={{ minRows: 1, maxRows: 8 }}
                                                                                    placeholder={t`Choice`}
                                                                                />
                                                                                <Space>
                                                                                    <Checkbox
                                                                                        className=""
                                                                                        checked={choice.isCorrect}
                                                                                        // onChange={(e) => handleChoiceChange(e.target.checked, index, choiceKey, "isCorrect")}
                                                                                    >
                                                                                        <Trans>correct</Trans>
                                                                                    </Checkbox>
                                                                                </Space>
                                                                            </Space>
                                                                        ))}
                                                                        {/* <Button
                                                                            size="small"
                                                                            shape="round"
                                                                            style={{ color: "#f87b11" }}
                                                                            onClick={() => {
                                                                                addChoice(index)
                                                                            }}
                                                                        >
                                                                            <Trans>Add Choice</Trans> +
                                                                        </Button> */}
                                                                    </Space>
                                                                </div>
                                                            ) : (
                                                                <div />
                                                            )}
                                                            {question.trueOrFalse ? (
                                                                <Space direction="vertical">
                                                                    <Text className="quizFormLabel" style={{ fontSize: "14px" }}>
                                                                        <Trans>Answer</Trans>:
                                                                    </Text>
                                                                    <Select
                                                                        defaultValue="True"
                                                                        value={question.trueOrFalse}
                                                                        // onChange={(e) => handleTrueOrFalseChange(e, index)}
                                                                        style={{ width: 120, border: "1px solid black" }}
                                                                    >
                                                                        <Option value="True">
                                                                            <Trans>True</Trans>
                                                                        </Option>
                                                                        <Option value="False">
                                                                            <Trans>False</Trans>
                                                                        </Option>
                                                                    </Select>
                                                                </Space>
                                                            ) : null}
                                                            {question.type === "Identification" ? (
                                                                <Space direction="vertical">
                                                                    <Text>
                                                                        <Trans>Possible Answers</Trans>:
                                                                    </Text>
                                                                    {question.answers.map((answer) => (
                                                                        <Space key={answer.id}>
                                                                            <Input
                                                                                placeholder={t`Answer`}
                                                                                style={{ maxWidth: 300 }}
                                                                                value={answer}
                                                                                // onChange={(e) => handleAnswerChangeEnumeration(e.target.value, index, answerKey)}
                                                                            />
                                                                            {question.answers.length > 1 ? <DeleteTwoTone twoToneColor="#eb2f96" /> : <div />}
                                                                        </Space>
                                                                    ))}
                                                                    {/* <Trans>Answer:</Trans> */}
                                                                    {/* <Input placeholder={t`Answer`} style={{ maxWidth: 300 }} value={question.answer} onChange={(e) => handleInputChange(e.target.value, index)} /> */}
                                                                </Space>
                                                            ) : (
                                                                <div />
                                                            )}
                                                            {question.type === "Essay" ? (
                                                                <Space direction="vertical" style={{ width: "100%" }}>
                                                                    <Text>
                                                                        <Trans>Answer</Trans>:
                                                                    </Text>
                                                                    <Input.TextArea
                                                                        disabled
                                                                        defaultValue={studentAnswer.answerArray[index].answer}
                                                                        className="quizFormInput"
                                                                        autoSize={{ minRows: 4, maxRows: 8 }}
                                                                        placeholder={t`Question`}
                                                                    />
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
                                                                        <Input placeholder="0" />
                                                                    </Form.Item>
                                                                    {/* <Trans>Answer:</Trans> */}
                                                                    {/* <Input placeholder={t`Answer`} style={{ maxWidth: 300 }} value={question.answer} onChange={(e) => handleInputChange(e.target.value, index)} /> */}
                                                                </Space>
                                                            ) : (
                                                                <div />
                                                            )}
                                                            {question.type === "Enumeration" ? (
                                                                <Space direction="vertical">
                                                                    <Text>
                                                                        <Trans>Answers</Trans>:
                                                                    </Text>
                                                                    {question.answers.map((answer) => (
                                                                        <Space key={answer.id}>
                                                                            <Input placeholder={t`Answer`} style={{ maxWidth: 300 }} value={answer} />
                                                                            {question.answers.length > 1 ? <DeleteTwoTone twoToneColor="#eb2f96" /> : <div />}
                                                                        </Space>
                                                                    ))}

                                                                    <hr />
                                                                    <Text type="secondary">
                                                                        <Trans>Alternative Answers (Optional: Will not be counted as a point)</Trans>
                                                                    </Text>

                                                                    {question.alternativeAnswers.map((answer) => (
                                                                        <Space key={answer.id}>
                                                                            <Input placeholder={t`Answer`} style={{ maxWidth: 300 }} value={answer} />
                                                                            {question.alternativeAnswers.length > 1 ? <DeleteTwoTone twoToneColor="#eb2f96" /> : <div />}
                                                                        </Space>
                                                                    ))}
                                                                    {/* <Button
                                                                        size="small"
                                                                        shape="round"
                                                                        style={{ color: "#f87b11" }}
                                                                    >
                                                                        <Trans>Add Alternative</Trans> +
                                                                    </Button> */}
                                                                </Space>
                                                            ) : (
                                                                <div />
                                                            )}
                                                            {question.type === "Matching Type" ? (
                                                                <Space direction="vertical">
                                                                    <Text>
                                                                        <Trans>Setup</Trans>:
                                                                    </Text>
                                                                    {question.rows.map((data) => (
                                                                        <Row gutter={10} style={{ width: "100%" }} key={data.id}>
                                                                            <Col span={11}>
                                                                                <Input placeholder={t`Label`} style={{ maxWidth: 300 }} value={data.left} />
                                                                            </Col>
                                                                            <Col span={11}>
                                                                                <Input placeholder={t`Answer`} style={{ maxWidth: 300 }} value={data.right} />
                                                                            </Col>
                                                                            <Col span={2}>{question.rows.length > 1 ? <DeleteTwoTone twoToneColor="#eb2f96" /> : <div />}</Col>
                                                                        </Row>
                                                                    ))}
                                                                </Space>
                                                            ) : (
                                                                <div />
                                                            )}
                                                        </Space>
                                                    </div>
                                                </div>
                                                <br />
                                            </div>
                                        ) : (
                                            <div style={{ marginBottom: "10px" }} key={question.id}>
                                                <Card
                                                    title={`Instruction Box - Row # ${index + 1}`}
                                                    bordered={false}
                                                    style={{ width: "100%" }}
                                                    extra={
                                                        <Row justify="end" gutter={[10, 24]}>
                                                            <Col>
                                                                <DeleteTwoTone twoToneColor="red" />
                                                            </Col>
                                                        </Row>
                                                    }
                                                >
                                                    <Input.TextArea
                                                        autoSize={{ minRows: 4, maxRows: 8 }}
                                                        placeholder={t`Example: Part 1: Question ${index + 2} to ${index + 12} is multiple choice: \nChoose the correct answer per item.`}
                                                    />
                                                </Card>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            {/* 1st version (end) */}

                            {values && (
                                <Row>
                                    <Col span={24}>
                                        <Form name="basic" form={quizForm} layout="vertical" onFinish={saveScore}>
                                            {/* <Title level={2}>{toTitleCase(values.title)}</Title> */}
                                            <Title level={2}>{values.title}</Title>
                                            <Text type="secondary">
                                                <Trans>Submission</Trans>: {moment.unix(parseInt(values.creation)).format("dddd, MMMM D, YYYY h:mm:ss A")}
                                            </Text>
                                            <Divider />
                                            <Form.Item>
                                                {values.questionArray &&
                                                    values.questionArray.map((question, index) => (
                                                        <div key={question.id}>
                                                            <div style={{ position: "relative" }}>
                                                                <Tag
                                                                    color="blue"
                                                                    style={{
                                                                        position: "absolute",
                                                                        top: -8,
                                                                        left: 8
                                                                    }}
                                                                >
                                                                    {question.type}
                                                                </Tag>
                                                                <Collapse
                                                                    bordered={false}
                                                                    activeKey={index + 1}
                                                                    style={{ padding: "10px" }}
                                                                    expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                                                                >
                                                                    {/* <Panel header={t`Question #` + (index + 1)} key={index + 1}> */}
                                                                    <div key={index + 1} style={{ padding: "24px" }}>
                                                                        <Space direction="vertical" style={{ width: "100%" }}>
                                                                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                                                <div
                                                                                    style={{ fontWeight: 600 }}
                                                                                    className="dangerous-image"
                                                                                    // eslint-disable-next-line react/no-danger
                                                                                    dangerouslySetInnerHTML={{
                                                                                        __html: question.question
                                                                                    }}
                                                                                />
                                                                                {question.pointsPerItem > 1 ? (
                                                                                    <Text type="secondary">
                                                                                        {question.pointsPerItem} <Trans>Points</Trans>
                                                                                    </Text>
                                                                                ) : (
                                                                                    <Text type="secondary">
                                                                                        {question.pointsPerItem} <Trans>Point</Trans>
                                                                                    </Text>
                                                                                )}
                                                                            </div>
                                                                            {question.type === "Multiple Choice" ? (
                                                                                <Space direction="vertical" style={{ width: "100%" }}>
                                                                                    <Text>
                                                                                        <Trans>Choices</Trans>:
                                                                                    </Text>
                                                                                    <Radio.Group value={values.answerArray[index].answer}>
                                                                                        {question.choices.map((choice) => (
                                                                                            <Radio
                                                                                                style={{
                                                                                                    display: "flex",
                                                                                                    color: question.choices.find((x) => x.description === values.answerArray[index].answer)["isCorrect"]
                                                                                                        ? "green"
                                                                                                        : "red"
                                                                                                }}
                                                                                                key={choice.id}
                                                                                                value={choice.description}
                                                                                                disabled
                                                                                            >
                                                                                                <Text>
                                                                                                    <div
                                                                                                        className="dangerous-image"
                                                                                                        // eslint-disable-next-line react/no-danger
                                                                                                        dangerouslySetInnerHTML={{
                                                                                                            __html: choice.description
                                                                                                        }}
                                                                                                    />
                                                                                                </Text>
                                                                                            </Radio>
                                                                                        ))}
                                                                                        {/* {
                                                                                        question.trueOrFalse === values.answerArray[index].answer ?
                                                                                            <span style={{ color: 'green', fontWeight: '600' }}><CheckCircleFilled />
                                                                                            </span>
                                                                                            :
                                                                                            <span style={{ color: 'red', fontWeight: '600' }}><CloseCircleFilled />
                                                                                            </span>
                                                                                    } */}
                                                                                    </Radio.Group>
                                                                                    <div style={{ display: "flex", alignItems: "center", columnGap: "0.5rem" }}>
                                                                                        <span style={{ fontSize: "12px" }}>Correct answer: </span>
                                                                                        {question.choices.find((x) => x.description === values.answerArray[index].answer) &&
                                                                                        question.choices.find((x) => x.description === values.answerArray[index].answer)["isCorrect"] ? (
                                                                                            <Tag color="green">
                                                                                                <div
                                                                                                    // eslint-disable-next-line react/no-danger
                                                                                                    dangerouslySetInnerHTML={{
                                                                                                        __html: question.choices.find((x) => x.isCorrect === true)["description"]
                                                                                                    }}
                                                                                                />
                                                                                            </Tag>
                                                                                        ) : (
                                                                                            <Tag color="red">
                                                                                                <div
                                                                                                    // eslint-disable-next-line react/no-danger
                                                                                                    dangerouslySetInnerHTML={{
                                                                                                        __html: question.choices.find((x) => x.isCorrect === true)["description"]
                                                                                                    }}
                                                                                                />
                                                                                            </Tag>
                                                                                        )}
                                                                                    </div>

                                                                                    {values.answerArray[index].score !== undefined ? (
                                                                                        <div>
                                                                                            <Tag color="blue">
                                                                                                <Trans>Points Earned</Trans>:{" "}
                                                                                            </Tag>
                                                                                            <InputNumber
                                                                                                min={0}
                                                                                                defaultValue={values.answerArray[index].score || 0}
                                                                                                max={question.pointsPerItem}
                                                                                                onChange={(e) => handlePointsChange(e, index)}
                                                                                            />
                                                                                        </div>
                                                                                    ) : (
                                                                                        <div>
                                                                                            <Tag color="blue">
                                                                                                <Trans>Points Earned</Trans>:{" "}
                                                                                            </Tag>
                                                                                            <InputNumber
                                                                                                min={0}
                                                                                                defaultValue={0}
                                                                                                max={question.pointsPerItem}
                                                                                                onChange={(e) => handlePointsChange(e, index)}
                                                                                            />
                                                                                        </div>
                                                                                    )}
                                                                                </Space>
                                                                            ) : (
                                                                                ""
                                                                            )}
                                                                            {question.type === "True or False" ? (
                                                                                <Space direction="vertical">
                                                                                    {/* <Text>
                                                                                    <Trans>Student answer</Trans>:
                                                                                </Text> */}
                                                                                    <div style={{ display: "flex", columnGap: "1rem", alignItems: "center" }}>
                                                                                        <Select
                                                                                            defaultValue={values.answerArray[index].answer}
                                                                                            style={{
                                                                                                width: 120,
                                                                                                border: question.trueOrFalse === values.answerArray[index].answer ? "1px solid green" : "1px solid red"
                                                                                            }}
                                                                                            disabled
                                                                                        >
                                                                                            <Option value=""> </Option>
                                                                                            <Option value="True">
                                                                                                <Trans>True</Trans>
                                                                                            </Option>
                                                                                            <Option value="False">
                                                                                                <Trans>False</Trans>
                                                                                            </Option>
                                                                                        </Select>
                                                                                        {question.trueOrFalse === values.answerArray[index].answer ? (
                                                                                            <span style={{ color: "green", fontWeight: "600" }}>
                                                                                                <CheckCircleFilled />
                                                                                            </span>
                                                                                        ) : (
                                                                                            <span style={{ color: "red", fontWeight: "600" }}>
                                                                                                <CloseCircleFilled />
                                                                                            </span>
                                                                                        )}
                                                                                    </div>
                                                                                    <div style={{ display: "flex", alignItems: "center", columnGap: "0.5rem" }}>
                                                                                        <span style={{ fontSize: "12px" }}>Correct answer: </span>
                                                                                        <Tag color="green">{question.trueOrFalse}</Tag>
                                                                                    </div>

                                                                                    {/* {question.trueOrFalse === values.answerArray[index].answer ? (
                                                                                    <Tag color="green">
                                                                                        {question.trueOrFalse}
                                                                                    </Tag>
                                                                                ) : (
                                                                                    <Tag color="red">
                                                                                        {question.trueOrFalse}
                                                                                    </Tag>
                                                                                )} */}
                                                                                    {values.answerArray[index].score !== undefined ? (
                                                                                        <div>
                                                                                            <Tag color="blue">
                                                                                                <Trans>Points Earned</Trans>:{" "}
                                                                                            </Tag>
                                                                                            <InputNumber
                                                                                                min={0}
                                                                                                defaultValue={values.answerArray[index].score || 0}
                                                                                                max={question.pointsPerItem}
                                                                                                onChange={(e) => handlePointsChange(e, index)}
                                                                                            />
                                                                                        </div>
                                                                                    ) : (
                                                                                        <div>
                                                                                            <Tag color="blue">
                                                                                                <Trans>Points Earned</Trans>:{" "}
                                                                                            </Tag>
                                                                                            <InputNumber
                                                                                                min={0}
                                                                                                defaultValue={0}
                                                                                                max={question.pointsPerItem}
                                                                                                onChange={(e) => handlePointsChange(e, index)}
                                                                                            />
                                                                                        </div>
                                                                                    )}
                                                                                </Space>
                                                                            ) : (
                                                                                ""
                                                                            )}
                                                                            {question.type === "Essay" ? (
                                                                                <Space direction="vertical" style={{ width: "100%" }}>
                                                                                    <Text>
                                                                                        <Trans>Student Answer</Trans>:
                                                                                    </Text>
                                                                                    <Input.TextArea defaultValue={values.answerArray[index].answer} autoSize={{ minRows: 4, maxRows: 8 }} disabled />
                                                                                    <div
                                                                                        style={{
                                                                                            marginTop: "15px"
                                                                                        }}
                                                                                    >
                                                                                        <Trans>Give Points</Trans>:
                                                                                    </div>
                                                                                    <InputNumber
                                                                                        min={0}
                                                                                        defaultValue={values.answerArray[index].essayScore || values.answerArray[index].score || 0}
                                                                                        max={question.pointsPerItem}
                                                                                        onChange={(e) => handlePointsChange(e, index)}
                                                                                    />
                                                                                </Space>
                                                                            ) : (
                                                                                ""
                                                                            )}
                                                                            {question.type === "Identification" ? (
                                                                                <Space direction="vertical">
                                                                                    <Text>
                                                                                        <Trans>Student Answer</Trans>:
                                                                                    </Text>
                                                                                    <div
                                                                                        // eslint-disable-next-line react/no-danger
                                                                                        dangerouslySetInnerHTML={{
                                                                                            __html: values.answerArray[index].answer
                                                                                        }}
                                                                                    />
                                                                                    {question.answers ? (
                                                                                        <>
                                                                                            <Text>
                                                                                                <Trans>Possible Answers</Trans>:
                                                                                            </Text>
                                                                                            <Space wrap>
                                                                                                {question.answers.map((possible, index2) => (
                                                                                                    <>
                                                                                                        {isMatch(values.answerArray[index].answer, possible, question.isStrict) ? (
                                                                                                            <Tag color="green" key={index2}>
                                                                                                                {possible}
                                                                                                            </Tag>
                                                                                                        ) : (
                                                                                                            <Tag color="red" key={index2}>
                                                                                                                {possible}
                                                                                                            </Tag>
                                                                                                        )}
                                                                                                    </>
                                                                                                ))}
                                                                                            </Space>
                                                                                        </>
                                                                                    ) : isMatch(question.answer, values.answerArray[index].answer, question.isStrict) ? (
                                                                                        <Tag color="green">
                                                                                            <Trans>Answer is</Trans>: {question.answer}
                                                                                        </Tag>
                                                                                    ) : (
                                                                                        <Tag color="red">
                                                                                            <Trans>Answer is</Trans>: {question.answer}
                                                                                        </Tag>
                                                                                    )}
                                                                                    {values.answerArray[index].score !== undefined ? (
                                                                                        <div>
                                                                                            <Tag color="blue">
                                                                                                <Trans>Points Earned</Trans>:{" "}
                                                                                            </Tag>
                                                                                            <InputNumber
                                                                                                min={0}
                                                                                                defaultValue={values.answerArray[index].score || 0}
                                                                                                max={question.pointsPerItem}
                                                                                                onChange={(e) => handlePointsChange(e, index)}
                                                                                            />
                                                                                        </div>
                                                                                    ) : (
                                                                                        <div>
                                                                                            <Tag color="blue">
                                                                                                <Trans>Points Earned</Trans>:{" "}
                                                                                            </Tag>
                                                                                            <InputNumber
                                                                                                min={0}
                                                                                                defaultValue={0}
                                                                                                max={question.pointsPerItem}
                                                                                                onChange={(e) => handlePointsChange(e, index)}
                                                                                            />
                                                                                        </div>
                                                                                    )}
                                                                                </Space>
                                                                            ) : (
                                                                                ""
                                                                            )}
                                                                            {question.type === "Enumeration" ? (
                                                                                <Space direction="vertical" style={{ width: "100%" }}>
                                                                                    <Text>
                                                                                        <Trans>Student&lsquo;s Answer</Trans>:
                                                                                    </Text>
                                                                                    <Space wrap>
                                                                                        {values.answerArray[index].answer.map((answer, answerKey) => (
                                                                                            <Tag color="grey" key={answerKey}>
                                                                                                {answer}
                                                                                            </Tag>
                                                                                        ))}
                                                                                    </Space>
                                                                                    <Text>
                                                                                        <Trans>Answer Keys</Trans>:
                                                                                    </Text>
                                                                                    <Space wrap>
                                                                                        {enumerationCompute(values.answerArray[index].answer, question, question.isStrict).map((result, resultKey) => (
                                                                                            <div key={resultKey}>
                                                                                                {result.isCorrect ? (
                                                                                                    <Tag color="green" key={resultKey}>
                                                                                                        {result.answer}
                                                                                                    </Tag>
                                                                                                ) : (
                                                                                                    <Tag color="blue" key={resultKey}>
                                                                                                        {result.answer}
                                                                                                    </Tag>
                                                                                                )}
                                                                                            </div>
                                                                                        ))}
                                                                                    </Space>
                                                                                    {values.answerArray[index].score !== undefined ? (
                                                                                        <div>
                                                                                            <Tag color="blue">
                                                                                                <Trans>Points Earned</Trans>:{" "}
                                                                                            </Tag>
                                                                                            <InputNumber
                                                                                                min={0}
                                                                                                defaultValue={values.answerArray[index].score || 0}
                                                                                                max={question.pointsPerItem * question.answers.length}
                                                                                                onChange={(e) => handlePointsChange(e, index)}
                                                                                            />
                                                                                        </div>
                                                                                    ) : (
                                                                                        <div>
                                                                                            <Tag color="blue">
                                                                                                <Trans>Points Earned</Trans>:{" "}
                                                                                            </Tag>
                                                                                            <InputNumber
                                                                                                min={0}
                                                                                                defaultValue={0}
                                                                                                max={question.pointsPerItem * question.answers.length}
                                                                                                onChange={(e) => handlePointsChange(e, index)}
                                                                                            />
                                                                                        </div>
                                                                                    )}
                                                                                </Space>
                                                                            ) : (
                                                                                ""
                                                                            )}
                                                                            {question.type === "Matching Type" ? (
                                                                                <Space direction="vertical" style={{ width: "100%" }}>
                                                                                    <Text>
                                                                                        <Trans>Student Answer</Trans>:
                                                                                    </Text>
                                                                                    {values.answerArray[index].answer.map((answer, answerKey) => (
                                                                                        <Row
                                                                                            gutter={10}
                                                                                            style={{
                                                                                                width: "100%"
                                                                                            }}
                                                                                            key={Math.random() + `-${answerKey}`}
                                                                                        >
                                                                                            <Col md={5} sm={24}>
                                                                                                <Input
                                                                                                    placeholder={t`Label`}
                                                                                                    style={{
                                                                                                        maxWidth: 300
                                                                                                    }}
                                                                                                    value={question.rows[answerKey].left}
                                                                                                    disabled
                                                                                                />
                                                                                            </Col>
                                                                                            <Col md={5} sm={24}>
                                                                                                <Input
                                                                                                    style={{
                                                                                                        maxWidth: 300
                                                                                                    }}
                                                                                                    value={answer}
                                                                                                    disabled
                                                                                                />
                                                                                            </Col>
                                                                                            <Col md={8} sm={24}>
                                                                                                {question.rows[answerKey].right === answer ? (
                                                                                                    <Tag color="green">
                                                                                                        <Trans>Correct Answer</Trans>: {question.rows[answerKey].right}
                                                                                                    </Tag>
                                                                                                ) : (
                                                                                                    <Tag color="red">
                                                                                                        <Trans>Correct Answer</Trans>: {question.rows[answerKey].right}
                                                                                                    </Tag>
                                                                                                )}
                                                                                            </Col>
                                                                                        </Row>
                                                                                    ))}
                                                                                    {values.answerArray[index].score !== undefined ? (
                                                                                        <div>
                                                                                            <Tag color="blue">
                                                                                                <Trans>Points Earned</Trans>:{" "}
                                                                                            </Tag>
                                                                                            <InputNumber
                                                                                                min={0}
                                                                                                defaultValue={values.answerArray[index].score || 0}
                                                                                                max={question.pointsPerItem * question.rows.length}
                                                                                                onChange={(e) => handlePointsChange(e, index)}
                                                                                            />
                                                                                        </div>
                                                                                    ) : (
                                                                                        <div>
                                                                                            <Tag color="blue">
                                                                                                <Trans>Points Earned</Trans>:{" "}
                                                                                            </Tag>
                                                                                            <InputNumber
                                                                                                min={0}
                                                                                                defaultValue={0}
                                                                                                max={question.pointsPerItem * question.rows.length}
                                                                                                onChange={(e) => handlePointsChange(e, index)}
                                                                                            />
                                                                                        </div>
                                                                                    )}
                                                                                </Space>
                                                                            ) : (
                                                                                ""
                                                                            )}
                                                                        </Space>
                                                                    </div>
                                                                </Collapse>
                                                                <br />
                                                            </div>
                                                        </div>
                                                    ))}
                                            </Form.Item>
                                            <Divider />
                                            {values.numberOfQuestions ? (
                                                <Form.Item style={{ textAlign: "right" }}>
                                                    <Title level={5}>
                                                        <Trans>Summary</Trans>
                                                    </Title>
                                                    <Text>
                                                        <Trans>Number of Questions</Trans>: {values.numberOfQuestions}
                                                    </Text>
                                                    <br />
                                                    <Text>
                                                        <Trans>Number of Instruction Box</Trans>: {values.numberOfInstructions || 0}
                                                    </Text>
                                                    <br />
                                                    <Text>
                                                        <Trans>Total Points</Trans>: {values.totalPoints}
                                                    </Text>
                                                    <Divider />
                                                    <Title level={5}>
                                                        <Trans>Final Score</Trans>:
                                                    </Title>
                                                    <InputNumber min={0} defaultValue={values.newScore} value={values.newScore} onChange={(e) => handleFinalScore(e)} />
                                                </Form.Item>
                                            ) : (
                                                <div />
                                            )}

                                            <Form.Item style={{ textAlign: "right" }}>
                                                <Button type="primary" onClick={saveScoreOnly}>
                                                    <Trans>Save Score</Trans>
                                                </Button>
                                                {/* <Space>
                                                    {values.documentStatus === "draft" ? (
                                                        <div>
                                                            {values.canRetake ? (
                                                                <div>
                                                                    <Button type="primary" disabled>
                                                                        <Trans>Student is Retaking</Trans>
                                                                    </Button>
                                                                    <br />
                                                                    <br />
                                                                    <Button type="primary" htmlType="submit" loading={values.loading}>
                                                                        <Trans>Force Save Score</Trans>
                                                                    </Button>
                                                                </div>
                                                            ) : (
                                                                <Button type="primary" htmlType="submit" loading={values.loading}>
                                                                    <Trans>Save Score</Trans>
                                                                </Button>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <br />
                                                            <br />
                                                            <Button type="primary" onClick={saveScoreOnly}>
                                                                <Trans>Save Score</Trans>
                                                            </Button>
                                                        </div>
                                                    )}
                                                </Space> */}
                                            </Form.Item>
                                            <Divider />
                                        </Form>
                                    </Col>
                                </Row>
                            )}

                            <div>
                                {/* <div style={{ backgroundColor: "#FDFDFD", padding: "24px", border: "1px solid #E4E4E4" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                            <Text style={{ fontWeight: 600 }}></Text>
                                            <Text style={{ fontSize: "12px" }}>15 Pts</Text>
                                        </div>
                                        <div>
                                            <Form.Item name="answer" style={{ marginTop: "22px" }}>
                                                <TextArea rows={2} placeholder="Your answer" className="quizFormInput" />
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
                                    </div> */}

                                {/* <div style={{ backgroundColor: "#FDFDFD", padding: "0 24px", border: "1px solid #E4E4E4" }}>
                                    <Form.Item label="Comments" name="comments" style={{ marginTop: "22px" }}>
                                        <TextArea rows={2} disabled={true} placeholder="" className="quizFormInput" />
                                    </Form.Item>
                                </div> */}
                            </div>
                        </section>

                        <section className="section">
                            <div>
                                <div style={{ marginBottom: "8px" }}>
                                    <Text style={{ fontSize: "16px", fontWeight: 600 }}>Summary</Text>
                                </div>
                                <div>
                                    <Text>No. of question: {activity.questionArray.length}</Text>
                                    <br />
                                    <Text>Total points: {activity.totalPoints}</Text>
                                </div>
                            </div>
                        </section>
                    </Form>
                </div>
            </div>
        )
    )
}

export default QuizCheck
