"use client";
import React, { useRef } from "react"
import { Image, Typography, Upload } from "antd"
import { useDispatch } from "react-redux"
import { useRouter } from "next/router"
// import { getActivityData } from "@/app/redux/activity/activity.actions"
import moment from "moment"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useAppSelector } from "@/redux/hooks"
import ProtectedComponent from "@/components/protected"
import { usePathname } from "next/navigation";
// import Quill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import type ReactQuill from 'react-quill';
const QuillWrapper = dynamic(
    async () => {
        const { default: RQ } = await import('react-quill');
        // eslint-disable-next-line react/display-name
        return ({ ...props }) => <RQ {...props} />;
    },
    {
        ssr: false,
    }
) as typeof ReactQuill;
// const Delta = Quill.import('delta');

const { Text } = Typography
const TutorLessonPreview = () => {
    const user = useAppSelector((state) => state.auth.user);
    const dispatch = useDispatch()

    // const [activity, setActivity] = React.useState(null)
    // const [released, setReleased] = React.useState("")
    const editShowAssRef = React.useRef<any>()
    const [attachedFiles, setAttachedFiles] = React.useState([])
    const pathname = usePathname();

    const parts = pathname.split("/");
    const activityId = parts[parts.length - 1];
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
    //         const time = moment.unix(activity.modified).format("MMMM Do YYYY, h:mm:ss a")
    //         setReleased(time)

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
    //     }
    // }, [activity])
    let activity = {
        id: '2na0a00fgevxe',
        courseName: 'Physics',
        courseId: 'fjsd89SAA0ds22KKm',
        topic: 'Earth science',
        type: 'Lesson',
        files: [],
        instructions: 'this is test'
    }
    let released = 'June 24th 2024, 10:16:44 am'
    return (
        activity && (
            <div className="lessonPreviewContainer">
                <div style={{ width: "636px", marginLeft: "auto", marginRight: "auto" }}>
                    <section className="header">
                        <div style={{ display: "flex", columnGap: "16px" }}>
                            {/* <div className="" style={{ flex: 'none' }}>
              <div className="previewLogo">
                <Image width={16} src="/images/activity/document.svg" preview={false} />
              </div>
            </div> */}
                            <div className="">
                                <Text style={{ fontSize: "24px", fontWeight: 600 }}>{activity.topic}</Text>
                                <div>
                                    <span className="">{released}</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div style={{ cursor: "pointer" }}>
                                <Link href={`/tutor/activity/lesson/edit/${activityId}`}>
                                    <button className="edit">
                                        <Image width={15} src="/images/activity/edit.svg" preview={false} />
                                    </button>
                                </Link>
                            </div>

                            {/* <button className="edit">
                                <Image width={16} src="/images/activity/edit.svg" preview={false} />
                            </button> */}
                        </div>
                    </section>

                    <section className="section">
                        <div style={{}}>
                            <Text style={{ fontWeight: 600 }}>Learning Objectives</Text>
                            <div style={{ minHeight: "142px", marginTop: "10px", padding: "5px" }}>
                                <QuillWrapper readOnly={true} theme={"bubble"} style={{ border: "1px solid black" }} value={activity.instructions}/>
                            </div>

                            <Text style={{ fontWeight: 600 }}>Attached files</Text>
                            <div style={{ marginTop: "10px" }}>
                                {activity.files.length > 0 ? (
                                    // activity.files.map((file) => (
                                    //     <a style={{ color: "#007BFF", marginTop: "10px" }} href={file} key={file}>
                                    //         {file}
                                    //     </a>
                                    // ))
                                    <Upload fileList={[...attachedFiles]} ref={editShowAssRef} disabled>
                                        {/* <p>
                                            <Trans>Attached Files</Trans>
                                        </p> */}
                                    </Upload>
                                ) : (
                                    <Text>No files</Text>
                                )}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        )
    );
};

export default ProtectedComponent(TutorLessonPreview);
