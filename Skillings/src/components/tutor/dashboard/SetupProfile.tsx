"use client";
import {
    Typography,
    Button,
    Row,
    Collapse,
    Divider,
    Col,
    Modal,
    Input,
    Upload,
    Radio,
    Checkbox,
    Grid,
    message,
} from "antd";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { shallowEqual } from "react-redux";
import { UploadOutlined } from "@ant-design/icons";
import { expLevel, expType } from "@/utils/staticHelper";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { updateProfile } from "@/redux/features/auth.slice";
import { useEffect, useState } from "react";

const { Text, Paragraph } = Typography;
const { Panel } = Collapse;
const { TextArea } = Input;
const { useBreakpoint } = Grid;

const SetupProfile = () => {
    const dispatch = useAppDispatch();
    const screenSize = useBreakpoint();
    const tutor = useAppSelector((state) => state.auth.user, shallowEqual);

    const [introVideoModal, setIntroVideoModal] = useState(false);
    const [aboutMeModal, setAboutMeModal] = useState(false);
    const [workTeachingExpModal, setWorkTeachingExpModal] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [stepsProgress, setStepsProgress] = useState(["", "", ""]);

    const [datas, setDatas] = useState({
        introVideo: [],
        about: "",
        workExperienceType: "",
        workExperienceLevel: [],
        workExperienceDesc: "",
    });

    const cancelAllModal = () => {
        setDatas({
            introVideo: [],
            about: "",
            workExperienceType: "",
            workExperienceLevel: [],
            workExperienceDesc: "",
        });
        setIntroVideoModal(false);
        setAboutMeModal(false);
        setWorkTeachingExpModal(false);
    };

    const addSocialMedHandler = async (type: string) => {
        setSaveLoading(true);

        const payload = {
            introVideo:
                type === "introVideo"
                    ? // @ts-ignore
                      datas.introVideo[0].originFileObj
                    : tutor.introVideo,
            about: type === "about" ? datas.about : tutor.about,
            workExperienceType:
                type === "workExp"
                    ? datas.workExperienceType
                    : tutor.workExperienceType,
            workExperienceLevel:
                type === "workExp"
                    ? datas.workExperienceLevel
                    : tutor.workExperienceLevel,
            workExperienceDesc:
                type === "workExp"
                    ? datas.workExperienceDesc
                    : tutor.workExperienceDesc,
        };

        const resp = (await dispatch(updateProfile(payload))) as {
            payload: { success: boolean; message: string };
        };

        if (resp && resp.payload.success) {
            message.success(resp.payload.message);
        } else {
            message.error(resp.payload.message, 5);
        }
        setSaveLoading(false);
        cancelAllModal();
    };

    const datasButtonChecker = () => {
        if (datas.workExperienceType === "Formal") {
            if (datas.workExperienceLevel.length < 1) {
                return true;
            } else {
                return false;
            }
        } else if (datas.workExperienceType === "Informal") {
            if (!datas.workExperienceDesc) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    };

    useEffect(() => {
        if (tutor && tutor.uid) {
            setStepsProgress([
                tutor.about || "",
                tutor.workExperienceType || "",
                tutor.introVideo || "",
            ]);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tutor]);

    return (
        <>
            <div
                style={{
                    padding: "10px 20px 20px 20px",
                    border: "1px solid #ccc",
                    backgroundColor: "#fff",
                    marginBottom: "15px",
                }}
            >
                <div style={{ padding: "10px 0" }}>
                    <Paragraph
                        style={{
                            textAlign: "center",
                            fontSize: !screenSize.md ? "16px" : "20px",
                            fontWeight: 600,
                            marginBottom: "10px",
                        }}
                    >
                        Set up your profile
                    </Paragraph>
                    <Paragraph
                        style={{
                            textAlign: "center",
                            fontSize: 16,
                            marginBottom: "10px",
                        }}
                    >
                        Students will likely book if they know more about you
                    </Paragraph>
                </div>
                <Text>
                    {stepsProgress.filter((f) => f !== "").length} of 3 steps
                    completed
                </Text>
                <div style={{ display: "flex", gap: 8, marginBottom: "20px" }}>
                    {stepsProgress
                        .filter((f) => f !== "")
                        .map(() => (
                            <div
                                key={`${Math.random()}`}
                                style={{
                                    height: "7px",
                                    backgroundColor: "#007BFF",
                                    width: "100%",
                                }}
                            />
                        ))}
                    {stepsProgress
                        .filter((f) => f === "")
                        .map(() => (
                            <div
                                key={`${Math.random()}`}
                                style={{
                                    height: "7px",
                                    backgroundColor: "#DFEFFF",
                                    width: "100%",
                                }}
                            />
                        ))}
                </div>
                <Collapse
                    defaultActiveKey={["1"]}
                    expandIconPosition="end"
                    items={[
                        {
                            key: "1",
                            label: (
                                <Text
                                    style={{
                                        fontSize: !screenSize.md
                                            ? "16px"
                                            : "18px",
                                        fontWeight: 500,
                                    }}
                                >
                                    Build your profile identity
                                </Text>
                            ),
                            children: (
                                <>
                                    <div>
                                        <Row justify="space-between">
                                            <div>
                                                <div>
                                                    <Text
                                                        style={{
                                                            fontWeight: 500,
                                                            fontSize: "16px",
                                                        }}
                                                    >
                                                        Add Video Introduction
                                                    </Text>
                                                </div>
                                                <div>
                                                    <Text
                                                        style={{
                                                            color: "rgba(0,0,0,0.6)",
                                                        }}
                                                    >
                                                        {typeof tutor.introVideo ===
                                                            "string" &&
                                                        tutor.introVideo !== ""
                                                            ? "Completed"
                                                            : "Tell us more about yourself and what can you share to students."}
                                                    </Text>
                                                </div>
                                            </div>
                                            <div style={{ margin: "auto 0px" }}>
                                                {typeof tutor.introVideo ===
                                                    "string" &&
                                                tutor.introVideo !== "" ? (
                                                    <BsFillCheckCircleFill
                                                        color="#007BFF"
                                                        style={{
                                                            fontSize: "30px",
                                                            marginRight: "12px",
                                                        }}
                                                    />
                                                ) : (
                                                    <Button
                                                        type="primary"
                                                        onClick={() =>
                                                            setIntroVideoModal(
                                                                true
                                                            )
                                                        }
                                                        loading={saveLoading}
                                                    >
                                                        Add
                                                    </Button>
                                                )}
                                            </div>
                                        </Row>
                                    </div>
                                    <Divider
                                        style={{ margin: "10px 0px 24px 0px" }}
                                    />
                                    <div>
                                        <Row justify="space-between">
                                            <div>
                                                <div>
                                                    <Text
                                                        style={{
                                                            fontWeight: 500,
                                                            fontSize: "16px",
                                                        }}
                                                    >
                                                        Add a description
                                                    </Text>
                                                </div>
                                                <div>
                                                    <Text
                                                        style={{
                                                            color: "rgba(0,0,0,0.6)",
                                                        }}
                                                    >
                                                        {tutor.about
                                                            ? "Completed"
                                                            : "Briefly write a description about yourself that learners see on your Page"}
                                                    </Text>
                                                </div>
                                            </div>
                                            <div style={{ margin: "auto 0px" }}>
                                                {tutor.about ? (
                                                    <BsFillCheckCircleFill
                                                        color="#007BFF"
                                                        style={{
                                                            fontSize: "30px",
                                                            marginRight: "12px",
                                                        }}
                                                    />
                                                ) : (
                                                    <Button
                                                        type="primary"
                                                        onClick={() =>
                                                            setAboutMeModal(
                                                                true
                                                            )
                                                        }
                                                        loading={saveLoading}
                                                    >
                                                        Add
                                                    </Button>
                                                )}
                                            </div>
                                        </Row>
                                    </div>
                                    <Divider
                                        style={{ margin: "10px 0px 24px 0px" }}
                                    />

                                    <div>
                                        <Row justify="space-between">
                                            <div>
                                                <div>
                                                    <Text
                                                        style={{
                                                            fontWeight: 500,
                                                            fontSize: "16px",
                                                        }}
                                                    >
                                                        Provide Teaching or
                                                        Working Experience
                                                    </Text>
                                                </div>
                                                <div>
                                                    <Text
                                                        style={{
                                                            color: "rgba(0,0,0,0.6)",
                                                        }}
                                                    >
                                                        {tutor.workExperienceType
                                                            ? "Completed"
                                                            : "Add some of your working experience"}
                                                    </Text>
                                                </div>
                                            </div>
                                            <div style={{ margin: "auto 0px" }}>
                                                {tutor.workExperienceType ? (
                                                    <BsFillCheckCircleFill
                                                        color="#007BFF"
                                                        style={{
                                                            fontSize: "30px",
                                                            marginRight: "12px",
                                                        }}
                                                    />
                                                ) : (
                                                    <Button
                                                        type="primary"
                                                        onClick={() =>
                                                            setWorkTeachingExpModal(
                                                                true
                                                            )
                                                        }
                                                        loading={saveLoading}
                                                    >
                                                        Add
                                                    </Button>
                                                )}
                                            </div>
                                        </Row>
                                    </div>
                                </>
                            ),
                        },
                    ]}
                />
            </div>

            {/* //////////////////introduction video modal ///////////////////////////*/}
            <Modal
                centered
                title={
                    <Row justify="center">
                        <Text style={{ fontSize: "20px", fontWeight: 600 }}>
                            Add Video Introduction
                        </Text>
                    </Row>
                }
                open={introVideoModal}
                onCancel={cancelAllModal}
                footer={null}
            >
                <Row justify="center">
                    <Text style={{ color: "rgba(0,0,0,0.6)" }}>
                        Add introduction video that learners see on your Page.
                    </Text>
                </Row>
                <br />
                <Row justify="center">
                    <Upload
                        maxCount={1}
                        listType="picture"
                        fileList={datas.introVideo}
                        onChange={(file: any) =>
                            setDatas({ ...datas, introVideo: file.fileList })
                        }
                        accept="video/*"
                    >
                        {datas.introVideo.length < 1 && (
                            <Button
                                type="primary"
                                ghost
                                icon={<UploadOutlined />}
                            >
                                UPLOAD FILE
                            </Button>
                        )}
                    </Upload>
                </Row>
                <br />
                <br />

                <div>
                    <Button
                        type="primary"
                        style={{ width: "100%" }}
                        disabled={!datas.introVideo}
                        onClick={() => addSocialMedHandler("introVideo")}
                        loading={saveLoading}
                    >
                        Add
                    </Button>
                </div>
            </Modal>

            {/*/////////////////////// about me modal ////////////////////////////*/}
            <Modal
                title={
                    <Row justify="center">
                        <Text style={{ fontSize: "20px", fontWeight: 600 }}>
                            Add About Me
                        </Text>
                    </Row>
                }
                open={aboutMeModal}
                onCancel={cancelAllModal}
                footer={null}
            >
                <Text>About me</Text>
                <TextArea
                    rows={6}
                    value={datas.about}
                    onChange={(e) =>
                        setDatas({ ...datas, about: e.target.value })
                    }
                />

                <br />
                <br />
                <div>
                    <Button
                        type="primary"
                        style={{ width: "100%" }}
                        disabled={!datas.about}
                        onClick={() => addSocialMedHandler("about")}
                        loading={saveLoading}
                    >
                        Add
                    </Button>
                </div>
            </Modal>

            {/* //////////////////work teaching exp modal//////////////////////// */}
            <Modal
                title={
                    <Row justify="center">
                        <Text style={{ fontSize: "20px", fontWeight: 600 }}>
                            Add Work Experience
                        </Text>
                    </Row>
                }
                open={workTeachingExpModal}
                onCancel={cancelAllModal}
                footer={null}
            >
                <Text>Level of teaching</Text>
                <Row style={{ marginTop: "5px" }} gutter={5}>
                    <Radio.Group
                        onChange={(e) =>
                            setDatas({
                                ...datas,
                                workExperienceType: e.target.value,
                            })
                        }
                        value={datas.workExperienceType}
                        style={{ width: "100%", display: "flex" }}
                    >
                        {expType.map((eachExpType: string) => (
                            <Col key={`${Math.random()}`} span="8">
                                <Button size="large" style={{ width: "100%" }}>
                                    <Radio
                                        value={eachExpType}
                                        style={{
                                            fontSize: !screenSize.sm
                                                ? "12px"
                                                : "14px",
                                        }}
                                    >
                                        {eachExpType}
                                    </Radio>
                                </Button>
                            </Col>
                        ))}
                    </Radio.Group>
                </Row>

                {datas.workExperienceType === "Formal" && (
                    <>
                        <br />
                        <Text>Level of education</Text>
                        <div style={{ marginTop: "5px" }}>
                            <div
                                style={{
                                    display: "flex",
                                    gap: 10,
                                    flexWrap: "wrap",
                                }}
                            >
                                <Checkbox.Group
                                    className="teaching-exp-checkbox-button"
                                    options={expLevel}
                                    value={datas.workExperienceLevel}
                                    onChange={(values) =>
                                        setDatas({
                                            ...datas,
                                            workExperienceLevel: values,
                                        })
                                    }
                                />
                            </div>
                        </div>

                        <br />
                        <Text>Other Information</Text>
                        <TextArea
                            rows={4}
                            value={datas.workExperienceDesc}
                            onChange={(e) =>
                                setDatas({
                                    ...datas,
                                    workExperienceDesc: e.target.value,
                                })
                            }
                        />
                    </>
                )}

                {datas.workExperienceType === "Informal" && (
                    <>
                        <br />
                        <Text>Other Information</Text>
                        <TextArea
                            rows={4}
                            value={datas.workExperienceDesc}
                            onChange={(e) =>
                                setDatas({
                                    ...datas,
                                    workExperienceDesc: e.target.value,
                                })
                            }
                        />
                    </>
                )}

                <br />
                <br />

                <div>
                    <Button
                        type="primary"
                        style={{ width: "100%" }}
                        disabled={datasButtonChecker()}
                        onClick={() => addSocialMedHandler("workExp")}
                        loading={saveLoading}
                    >
                        Add
                    </Button>
                </div>
            </Modal>
        </>
    );
};

export default SetupProfile;
