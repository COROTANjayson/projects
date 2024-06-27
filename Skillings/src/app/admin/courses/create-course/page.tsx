"use client";

import styles from "./styles.module.css";
import {
    Button,
    Col,
    Input,
    InputNumber,
    Popover,
    Row,
    Select,
    Typography,
    Upload,
    UploadProps,
    message,
} from "antd";
import {
    PlusOutlined,
    DownloadOutlined,
    PictureOutlined,
    QuestionCircleOutlined,
    DeleteTwoTone,
} from "@ant-design/icons";
import { ChangeEvent, useRef, useState } from "react";
import { CourseTypes, DispatchResp } from "@/domain/entities/Course";
import CourseStepsBreadcrumb from "@/components/admin/courses/create-course/CourseStepsBreadcrumb";
import CourseTags from "@/components/admin/courses/create-course/CourseTags";
import { generate16RandomID } from "@/utils/utils";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { createCourse } from "@/redux/features/course.slice";
import { EmptyCreateCourse } from "@/domain/entities/CourseInit";
import { useRouter } from "next/navigation";
import ProtectedComponent from "@/components/protected";

const { Title, Text } = Typography;

const dummyCategories = ["Home Schooling", "Course", "Preparations"];
const dummySubCategories = ["Math", "Science", "English"];
const partialLevel = ["Primary", "Secondary", "Tertiary"];

const AdminCreateCourse = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const createCourseLoading = useAppSelector(
        (state) => state.courses.loading
    );
    const coverPhotoRef = useRef(null);
    const courseMaterialRef = useRef(null);
    const [datas, setDatas] = useState<CourseTypes>({
        title: "",
        category: null,
        level: [],
        description: "",
        subCategory: null,
        courseType: "",
        coverPhoto: null,
        maxNoEnrolles: 20,
        aboutCourse: "",
        courseOutline: [
            {
                id: generate16RandomID(),
                description: "",
            },
            {
                id: generate16RandomID(),
                description: "",
            },
            {
                id: generate16RandomID(),
                description: "",
            },
        ],
        courseMaterials: [],
        videoLink: "",
        priceType: "Admin price",
        price: 0,
        currency: "IDR",
        tags: [],
        visibility: "",
        overallRatings: 0,
        favorite: false,
    });
    const [coverPhotoPreview, setCoverPhotoPreview] = useState<string>("");
    const [courseSteps, setCourseSteps] = useState(1);

    const courseTypeExplain = (
        <div>
            <p>
                <span style={{ fontWeight: 600 }}>Basic {"(Classic)"}</span>:
                This is one time session and fixed price of the course.
            </p>
            <p>
                <span style={{ fontWeight: 600 }}>Advance {"(Bundled)"}</span>:
                This is multiple session with fixed price of the course.
            </p>
        </div>
    );

    const coverPhotoOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        // @ts-ignore
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                // @ts-ignore
                setCoverPhotoPreview(e.target?.result);
            };
            reader.readAsDataURL(file);
        }
        setDatas({ ...datas, coverPhoto: file });
    };

    const onClickPhoto = () => {
        // @ts-ignore
        coverPhotoRef.current?.click();
    };

    const onClickCourseMaterial = () => {
        // @ts-ignore
        courseMaterialRef.current?.click();
    };

    const courseMaterialOnChange: UploadProps["onChange"] = (info) => {
        setDatas({
            ...datas,
            courseMaterials: info.fileList,
        });
    };

    // const addNewSchedule = () => {
    //     setDatas({
    //         ...datas,
    //         schedules: [
    //             ...datas.schedules,
    //             {
    //                 day: null,
    //                 startTime: null,
    //                 endTime: null,
    //                 id: generate16RandomID(),
    //             },
    //         ],
    //     });
    // };

    // const deleteNewSchedule = (index: number) => {
    //     const newSchedules = datas.schedules.filter((_, i) => i !== index);
    //     setDatas({
    //         ...datas,
    //         schedules: newSchedules,
    //     });
    // };

    const handleSetDatas = (newTags: string[]) => {
        setDatas({ ...datas, tags: newTags });
    };

    const courseOutlineOnChange = (value: string, index: number) => {
        const outline = datas.courseOutline;
        outline[index].description = value;
        setDatas({ ...datas, courseOutline: outline });
    };

    const handleDeleteOutline = (id: string) => {
        const newOutline = datas.courseOutline.filter((val) => val.id !== id);
        setDatas({
            ...datas,
            courseOutline: newOutline,
        });
    };

    // const scheduleOnChange = (dateValue: dayjs.Dayjs, index: number) => {
    //     const schedules = datas.schedules;
    //     schedules[index].day = dateValue;
    //     setDatas({ ...datas, schedules: schedules });
    // };

    // const startTimeOnChange = (timeValue: dayjs.Dayjs, index: number) => {
    //     const schedules = datas.schedules;
    //     schedules[index].startTime = timeValue;
    //     setDatas({ ...datas, schedules: schedules });

    //     if (!datas.schedules[index].endTime) return;
    //     if (datas.schedules[index].endTime.isBefore(timeValue))
    //         return message.error("End time must be greater than start time", 5);

    //     // calculate how many minutes in all session
    //     const totalMinutes = datas.schedules.reduce((acc, curr) => {
    //         if (curr.startTime && curr.endTime) {
    //             const start = dayjs(curr.startTime);
    //             const end = dayjs(curr.endTime);
    //             const diff = end.diff(start, "minute");
    //             return acc + diff;
    //         }
    //         return acc;
    //     }, 0);
    //     setDatas({ ...datas, sessionDuration: totalMinutes });
    // };

    // const endTimeOnChange = (timeValue: dayjs.Dayjs, index: number) => {
    //     const schedules = datas.schedules;
    //     schedules[index].endTime = timeValue;
    //     setDatas({ ...datas, schedules: schedules });

    //     if (!datas.schedules[index].startTime) return;
    //     if (datas.schedules[index].startTime.isAfter(timeValue))
    //         return message.error("End time must be greater than start time", 5);

    //     // calculate how many minutes in all session
    //     const totalMinutes = datas.schedules.reduce((acc, curr) => {
    //         if (curr.startTime && curr.endTime) {
    //             const start = dayjs(curr.startTime);
    //             const end = dayjs(curr.endTime);
    //             const diff = end.diff(start, "minute");
    //             return acc + diff;
    //         }
    //         return acc;
    //     }, 0);
    //     setDatas({ ...datas, sessionDuration: totalMinutes });
    // };

    const handleCreateCourse = async () => {
        const resp = (await dispatch(createCourse(datas))) as DispatchResp;

        console.log("resp", resp);

        if (resp && resp.payload.success) {
            // reset the datas state
            setDatas(EmptyCreateCourse);
            message.success("Course created successfully");
            router.replace("/admin/courses");
        }
    };

    const disabledContinueSteps = () => {
        if (courseSteps === 1) {
            return (
                !datas.title ||
                !datas.category ||
                !datas.subCategory ||
                !datas.description ||
                !datas.level.length ||
                !datas.courseType
            );
        } else if (courseSteps === 2) {
            return !datas.aboutCourse || !datas.courseOutline.length;
        } else if (courseSteps === 3) {
            return !datas.price || !datas.tags.length || !datas.visibility;
        }
    };

    return (
        <>
            {/* breadcrumb */}
            <CourseStepsBreadcrumb courseSteps={courseSteps} />

            {/* /////////////// step 1 //////////////////// */}
            {courseSteps === 1 && (
                <>
                    <Row style={{ marginTop: 30 }}>
                        <Col>
                            <Title level={4}>
                                Course Information & Details
                            </Title>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={12}>
                            <Title level={5}>Title</Title>
                            <Input
                                size="large"
                                placeholder="e.g. Introduction to Trigonometry"
                                width="100%"
                                value={datas.title}
                                onChange={(e) =>
                                    setDatas({
                                        ...datas,
                                        title: e.target.value,
                                    })
                                }
                            />
                            <Row gutter={10} style={{ marginTop: 15 }}>
                                <Col span={12}>
                                    <Title level={5}>Category</Title>
                                    <Select
                                        size="large"
                                        style={{ width: "100%" }}
                                        placeholder="Select category"
                                        options={dummyCategories.map(
                                            (category) => ({
                                                value: category,
                                                label: category,
                                            })
                                        )}
                                        value={datas.category}
                                        onChange={(value) =>
                                            setDatas({
                                                ...datas,
                                                category: value,
                                            })
                                        }
                                    />
                                </Col>
                                <Col span={12}>
                                    <Title level={5}>Sub-Category</Title>
                                    <Select
                                        size="large"
                                        style={{ width: "100%" }}
                                        placeholder="Select sub-category"
                                        options={dummySubCategories.map(
                                            (subCategory) => ({
                                                value: subCategory,
                                                label: subCategory,
                                            })
                                        )}
                                        value={datas.subCategory}
                                        onChange={(value) =>
                                            setDatas({
                                                ...datas,
                                                subCategory: value,
                                            })
                                        }
                                    />
                                </Col>
                            </Row>

                            <Row style={{ marginTop: 15 }}>
                                <Col span={24}>
                                    <Title level={5}>Level</Title>
                                    <Select
                                        size="large"
                                        mode="multiple"
                                        style={{ width: "100%" }}
                                        placeholder="Select level"
                                        options={partialLevel.map((level) => ({
                                            value: level,
                                            label: level,
                                        }))}
                                        value={datas.level}
                                        onChange={(value) =>
                                            setDatas({ ...datas, level: value })
                                        }
                                    />
                                </Col>
                            </Row>
                            <Row style={{ marginTop: 15 }}>
                                <Col span={24}>
                                    <Title level={5}>Description</Title>
                                    <Input.TextArea
                                        rows={5}
                                        placeholder="Tell us about your course"
                                        value={datas.description}
                                        onChange={(e) =>
                                            setDatas({
                                                ...datas,
                                                description: e.target.value,
                                            })
                                        }
                                    />
                                </Col>
                            </Row>
                            <Row style={{ marginTop: 15 }}>
                                <Col span={24}>
                                    <Title level={5}>
                                        Course Type{" "}
                                        <Popover
                                            content={courseTypeExplain}
                                            title="Course Type"
                                        >
                                            <QuestionCircleOutlined
                                                style={{ color: "#3b82f6" }}
                                            />
                                        </Popover>
                                    </Title>
                                    <Select
                                        size="large"
                                        style={{ width: "100%" }}
                                        placeholder="Select course type"
                                        options={[
                                            // {
                                            //     value: "Basic (Classic)",
                                            //     label: "Basic (Classic)",
                                            // },
                                            {
                                                value: "Advance (Bundled)",
                                                label: "Advance (Bundled)",
                                            },
                                        ]}
                                        value={datas.courseType}
                                        onChange={(value) =>
                                            setDatas({
                                                ...datas,
                                                courseType: value,
                                            })
                                        }
                                    />
                                </Col>
                            </Row>
                        </Col>
                        <Col span={12} style={{ paddingLeft: 50 }}>
                            <Row>
                                <Col span={24}>
                                    <Title level={5}>Cover Photo</Title>
                                    <input
                                        type="file"
                                        accept="image/jpeg, image/png"
                                        onChange={coverPhotoOnChange}
                                        style={{ display: "none" }}
                                        ref={coverPhotoRef}
                                    />
                                    {!coverPhotoPreview && (
                                        <div
                                            className={styles.coverPhotoDisplay}
                                            onClick={onClickPhoto}
                                        >
                                            <PictureOutlined
                                                style={{
                                                    fontSize: 40,
                                                    color: "#ccc",
                                                    borderRadius: "15px",
                                                }}
                                            />
                                            <p
                                                style={{
                                                    color: "#3b82f6",
                                                    fontWeight: 600,
                                                }}
                                            >
                                                Select a photo
                                            </p>
                                            <small>(JPG or PNG only)</small>
                                        </div>
                                    )}
                                    {coverPhotoPreview && (
                                        <>
                                            <img
                                                src={coverPhotoPreview}
                                                alt="cover"
                                                className={
                                                    styles.uploadCoverPhotoStyle
                                                }
                                            />
                                            <p
                                                className={
                                                    styles.changeCoverPhotoStyle
                                                }
                                                onClick={onClickPhoto}
                                            >
                                                Change
                                            </p>
                                        </>
                                    )}
                                </Col>
                            </Row>
                            <Row style={{ marginTop: 15 }}>
                                <Col span={24}>
                                    <Title level={5}>
                                        Maximum Number of Enrollees
                                    </Title>
                                    <InputNumber
                                        size="large"
                                        placeholder="e.g. 20"
                                        style={{ width: "100%" }}
                                        min={1}
                                        value={datas.maxNoEnrolles}
                                        onChange={(value) =>
                                            setDatas({
                                                ...datas,
                                                maxNoEnrolles: value || 0,
                                            })
                                        }
                                    />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </>
            )}

            {/* /////////////// step 2 //////////////////// */}
            {courseSteps === 2 && (
                <>
                    <Row style={{ marginTop: 30 }}>
                        <Col>
                            <Title level={4}>Add Course Materials</Title>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={12}>
                            <Title level={5}>About Course</Title>
                            <Input.TextArea
                                rows={5}
                                placeholder="Add details about this course, like who is this course for?"
                                style={{ borderRadius: 10 }}
                                value={datas.aboutCourse}
                                onChange={(e) =>
                                    setDatas({
                                        ...datas,
                                        aboutCourse: e.target.value,
                                    })
                                }
                            />
                            <Row gutter={10} style={{ marginTop: 15 }}>
                                <Col span={24}>
                                    <Title level={5}>Course Outline</Title>
                                    {datas.courseOutline.map(
                                        (outline, index) => (
                                            <Input
                                                key={index}
                                                size="large"
                                                placeholder={`e.g. Lesson ${
                                                    index + 1
                                                } - What is trigonometry`}
                                                style={{
                                                    marginBottom: 15,
                                                }}
                                                value={outline.description}
                                                onChange={(e) =>
                                                    courseOutlineOnChange(
                                                        e.target.value,
                                                        index
                                                    )
                                                }
                                                suffix={
                                                    datas.courseOutline
                                                        .length === 1 ? null : (
                                                        <DeleteTwoTone
                                                            twoToneColor="red"
                                                            style={{
                                                                cursor: "pointer",
                                                            }}
                                                            onClick={() =>
                                                                handleDeleteOutline(
                                                                    outline.id
                                                                )
                                                            }
                                                        />
                                                    )
                                                }
                                            />
                                        )
                                    )}
                                </Col>

                                <Col span={24}>
                                    <Button
                                        size="large"
                                        style={{
                                            borderRadius: 10,
                                            backgroundColor: "#f2f4f7",
                                            width: "100%",
                                        }}
                                        onClick={() =>
                                            setDatas({
                                                ...datas,
                                                courseOutline: [
                                                    ...datas.courseOutline,
                                                    {
                                                        id: generate16RandomID(),
                                                        description: "",
                                                    },
                                                ],
                                            })
                                        }
                                    >
                                        Add field
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={12} style={{ paddingLeft: 50 }}>
                            <Row>
                                <Col span={24}>
                                    <Title level={5}>
                                        Upload Course Materials (Optional)
                                    </Title>

                                    <div
                                        className={
                                            !datas.courseMaterials.length
                                                ? styles.courseMaterialsDisplay
                                                : styles.courseMaterialsDisplayFile
                                        }
                                    >
                                        <Upload
                                            listType="picture"
                                            // @ts-ignore
                                            defaultFileList={[
                                                ...datas.courseMaterials,
                                            ]}
                                            onChange={courseMaterialOnChange}
                                            style={{
                                                display: "none",
                                            }}
                                        >
                                            <Button
                                                style={{
                                                    display: "none",
                                                }}
                                                ref={courseMaterialRef}
                                            >
                                                Upload
                                            </Button>
                                        </Upload>

                                        {!datas.courseMaterials.length ? (
                                            <>
                                                <DownloadOutlined
                                                    style={{
                                                        fontSize: 40,
                                                        color: "#ccc",
                                                        borderRadius: "15px",
                                                    }}
                                                />

                                                <p
                                                    style={{
                                                        color: "#3b82f6",
                                                        fontWeight: 600,
                                                        cursor: "pointer",
                                                    }}
                                                    onClick={
                                                        onClickCourseMaterial
                                                    }
                                                >
                                                    Select file
                                                </p>
                                            </>
                                        ) : (
                                            <Row justify="center">
                                                <Col>
                                                    <Button
                                                        type="primary"
                                                        style={{
                                                            borderRadius: 40,
                                                            padding: "13px 9px",
                                                            marginTop: "10px",
                                                        }}
                                                        onClick={
                                                            onClickCourseMaterial
                                                        }
                                                    >
                                                        <PlusOutlined />
                                                    </Button>
                                                </Col>
                                            </Row>
                                        )}
                                    </div>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: 15 }}>
                                <Col span={24}>
                                    <Title level={5}>
                                        Add Course Video Introduction Link
                                        (Optional)
                                    </Title>
                                    <Input
                                        size="large"
                                        placeholder="https://www.youtube.com/watch?v=..."
                                        value={datas.videoLink}
                                        onChange={(e) =>
                                            setDatas({
                                                ...datas,
                                                videoLink: e.target.value,
                                            })
                                        }
                                    />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </>
            )}

            {/* /////////////// step 3 //////////////////// */}
            {courseSteps === 3 && (
                <>
                    <Row style={{ marginTop: 30 }}>
                        <Col>
                            <Title level={4}>Pricing</Title>
                        </Col>
                    </Row>

                    <Row gutter={20}>
                        <Col span={12}>
                            <div
                                style={{
                                    border: "2px solid #f97316",
                                    padding: "18px 20px 23px 20px",
                                    borderRadius: "10px",
                                    width: "100%",
                                }}
                            >
                                <Title level={3} style={{ margin: 0 }}>
                                    Course Price
                                </Title>
                                <Text style={{ color: "#27272a" }}>
                                    Admins will set the course price.
                                </Text>
                                <div style={{ marginTop: 20 }}>
                                    <Text
                                        style={{
                                            color: "#171717",
                                            fontWeight: 600,
                                        }}
                                    >
                                        Price
                                    </Text>
                                </div>
                                <InputNumber
                                    size="large"
                                    placeholder="Rp 0.00"
                                    style={{ width: "100%" }}
                                    value={datas.price}
                                    onChange={(value) =>
                                        setDatas({
                                            ...datas,
                                            price: value || 0,
                                        })
                                    }
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row gutter={20} style={{ marginTop: 20 }}>
                        <Col span={12}>
                            <Title level={4} style={{ margin: 0 }}>
                                Publish
                            </Title>
                            <Row>
                                <Col span={24}>
                                    <Title level={5}>Course Tags</Title>
                                </Col>
                                <Col span={24}>
                                    <div
                                        style={{
                                            border: "1px solid #ccc",
                                            borderRadius: 8,
                                            padding: 15,
                                            minHeight: 150,
                                        }}
                                    >
                                        <CourseTags
                                            tags={datas.tags}
                                            handleSetDatas={handleSetDatas}
                                        />
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <Title level={5} style={{ marginTop: 20 }}>
                                        Visibility
                                    </Title>
                                </Col>
                                <Select
                                    size="large"
                                    style={{ width: "100%" }}
                                    placeholder="Set privacy"
                                    options={[
                                        // { value: "Public", label: "Public" },
                                        {
                                            value: "Organization",
                                            label: "Organization",
                                        },
                                    ]}
                                    value={datas.visibility}
                                    onChange={(value) =>
                                        setDatas({
                                            ...datas,
                                            visibility: value,
                                        })
                                    }
                                ></Select>
                            </Row>
                        </Col>
                    </Row>
                </>
            )}

            {/* /////////////// step 4 ////////////////////
            {courseSteps === 4 && (
                <>
                    <Row style={{ marginTop: 30 }}>
                        <Col>
                            <Title level={4}>Set Schedule</Title>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={12}>
                            <Row>
                                <Col span={8}>
                                    <Title level={5}>No. of Sessions</Title>
                                    <InputNumber
                                        size="large"
                                        placeholder="e.g. 1"
                                        style={{
                                            width: "100%",
                                            borderRadius: 10,
                                        }}
                                        min={0}
                                        value={datas.noOfSessions}
                                        disabled
                                    />
                                </Col>
                                <Col span={16} style={{ paddingLeft: 20 }}>
                                    <Title level={5}>Session Duration</Title>
                                    <div style={{ position: "relative" }}>
                                        <InputNumber
                                            size="large"
                                            placeholder="e.g. 3"
                                            style={{
                                                width: "100%",
                                                borderRadius: 10,
                                                paddingRight: 60,
                                            }}
                                            min={0}
                                            value={datas.sessionDuration}
                                            disabled
                                        />
                                        <span
                                            style={{
                                                position: "absolute",
                                                right: 32,
                                                top: 9,
                                                color: "#ccc",
                                            }}
                                        >
                                            mins
                                        </span>
                                    </div>
                                </Col>
                            </Row>
                            {datas.schedules.map((sched, index) => (
                                <div
                                    key={sched.id}
                                    className={styles.sessionDisplay}
                                >
                                    <div style={{ padding: "10px 15px" }}>
                                        <Row>
                                            <Col span={24}>
                                                <Row>
                                                    <Col>
                                                        <Title level={5}>
                                                            Scheduled Date
                                                        </Title>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col span={24}>
                                                        <DatePicker
                                                            size="large"
                                                            style={{
                                                                width: "100%",
                                                            }}
                                                            format={
                                                                "MMMM DD, YYYY"
                                                            }
                                                            value={sched.day}
                                                            onChange={(
                                                                dateValue
                                                            ) =>
                                                                scheduleOnChange(
                                                                    dateValue,
                                                                    index
                                                                )
                                                            }
                                                        />
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                        <Row style={{ marginTop: 20 }}>
                                            <Col span={12}>
                                                <Row>
                                                    <Title level={5}>
                                                        Start Time
                                                    </Title>
                                                </Row>
                                                <Row>
                                                    <DatePicker
                                                        size="large"
                                                        picker={"time"}
                                                        style={{
                                                            width: "100%",
                                                            borderRadius: 10,
                                                        }}
                                                        value={sched.startTime}
                                                        onChange={(
                                                            startValue
                                                        ) =>
                                                            startTimeOnChange(
                                                                startValue,
                                                                index
                                                            )
                                                        }
                                                    />
                                                </Row>
                                            </Col>
                                            <Col
                                                span={12}
                                                style={{ paddingLeft: 20 }}
                                            >
                                                <Row>
                                                    <Title level={5}>
                                                        End Time
                                                    </Title>
                                                </Row>
                                                <Row>
                                                    <DatePicker
                                                        size="large"
                                                        picker={"time"}
                                                        style={{
                                                            width: "100%",
                                                            borderRadius: 10,
                                                        }}
                                                        value={sched.endTime}
                                                        onChange={(endValue) =>
                                                            endTimeOnChange(
                                                                endValue,
                                                                index
                                                            )
                                                        }
                                                    />
                                                </Row>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            ))}
                            <Button
                                size="large"
                                style={{
                                    width: "100%",
                                    backgroundColor: "#f2f4f7",
                                    borderRadius: 10,
                                    marginTop: 15,
                                }}
                                onClick={addNewSchedule}
                            >
                                Add Schedule
                            </Button>
                        </Col>
                        <Col span={12} style={{ paddingLeft: 50 }}></Col>
                    </Row>
                </>
            )} */}

            {/* /////////////// step 5 //////////////////// */}

            {/* ////////////////// Continue and Back Button ////////////////// */}
            <br />
            <br />
            {courseSteps === 1 ? (
                <Row justify="end" gutter={16}>
                    <Col>
                        <Button
                            style={{
                                backgroundColor: "#f2f4f7",
                                borderRadius: 10,
                            }}
                            size="large"
                        >
                            Save Draft
                        </Button>
                    </Col>
                    <Col>
                        <Button
                            type="primary"
                            style={{ borderRadius: 10 }}
                            size="large"
                            onClick={() => setCourseSteps(courseSteps + 1)}
                            disabled={disabledContinueSteps()}
                        >
                            Continue
                        </Button>
                    </Col>
                </Row>
            ) : (
                <Row justify="space-between" gutter={16}>
                    <Col>
                        <Button
                            style={{
                                backgroundColor: "#f2f4f7",
                                borderRadius: 10,
                                border: "none",
                            }}
                            size="large"
                            loading={createCourseLoading}
                        >
                            Save Draft
                        </Button>
                    </Col>
                    <Col>
                        <Row gutter={15}>
                            <Col>
                                <Button
                                    style={{
                                        borderRadius: 10,
                                        padding: "0px 35px",
                                    }}
                                    size="large"
                                    onClick={() =>
                                        setCourseSteps(courseSteps - 1)
                                    }
                                    loading={createCourseLoading}
                                >
                                    Back
                                </Button>
                            </Col>
                            {courseSteps === 3 ? (
                                <Col>
                                    <Button
                                        type="primary"
                                        style={{ borderRadius: 10 }}
                                        size="large"
                                        disabled={disabledContinueSteps()}
                                        onClick={handleCreateCourse}
                                        loading={createCourseLoading}
                                    >
                                        Publish
                                    </Button>
                                </Col>
                            ) : (
                                <Col>
                                    <Button
                                        type="primary"
                                        style={{ borderRadius: 10 }}
                                        size="large"
                                        onClick={() =>
                                            setCourseSteps(courseSteps + 1)
                                        }
                                        disabled={disabledContinueSteps()}
                                    >
                                        Continue
                                    </Button>
                                </Col>
                            )}
                        </Row>
                    </Col>
                </Row>
            )}
        </>
    );
};

export default ProtectedComponent(AdminCreateCourse);
