"use client";

import React from "react"
import { Image, Typography, Input, Upload } from "antd"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
// import { getActivityData } from "@/app/redux/activity/activity.actions"
import moment from "moment"
// import { RootState } from "@/data/utils/rootState"
import Link from "next/link"
import { RootState } from "@/redux/store"
import { usePathname } from "next/navigation"
import ProtectedComponent from "@/components/protected"

const { Text } = Typography
const TutorAssignmentPreview = () => {
    const user = useSelector((state: RootState) => state.auth.user, shallowEqual)
    const dispatch = useDispatch()

    const pathname = usePathname();

    const parts = pathname.split("/");
    const activityId = parts[parts.length - 1];
    // const [activity, setActivity] = React.useState(null)
    // const [released, setReleased] = React.useState("")
    const editShowAssRef = React.useRef<any>()
    const [attachedFiles, setAttachedFiles] = React.useState([])

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
        instructions: 'this is test',
        points: 40
    }
    let released = 'June 24th 2024, 10:16:44 am'

    return (
        activity && (
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
                            <Link href={`/tutor/activity/assignment/edit/${activityId}`}>
                                <button className="edit">
                                    <Image width={16} src="/images/activity/edit.svg" preview={false} />
                                </button>
                            </Link>
                            {/* <button className="edit">
                            <Image width={16} src="/images/activity/edit.svg" preview={false} />
                        </button> */}
                        </div>
                    </section>

                    <section className="section">
                        <div style={{ backgroundColor: "#FDFDFD", border: "1px solid #E4E4E4", padding: "25px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "23px"}}>
                                <p>{activity.instructions}</p>

                                <Text>
                                    {activity.points} <span>Pts</span>
                                </Text>
                            </div>
                            {/* <div style={{ color: "#007BFF" }}>File_name_uploaded.jpg</div> */}
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
                            <div style={{ marginTop: "22px" }}>
                                {/* <Text style={{ fontWeight: 600 }}>Answer</Text>
                                <div style={{ minHeight: "142px", border: "1px solid #E4E4E4", marginTop: "10px", padding: "5px" }}>
                                    <p></p>
                                </div> */}

                                <div style={{ marginTop: "18px" }}>
                                    <div className="quizFormLabel">Points</div>
                                    <Input value={activity.points} disabled style={{ width: "96px" }} placeholder="0" type="number" min="0" className="quizFormInput" />
                                </div>
                            </div>
                        </div>
                        {/* <div style={{ backgroundColor: "#FDFDFD", border: "1px solid #E4E4E4", padding: "25px" }}>
                        <Text style={{ fontWeight: 600 }}>Comments</Text>
                        <div style={{ minHeight: "142px", border: "1px solid #E4E4E4", marginTop: "10px", padding: "5px" }}>
                            <p></p>
                        </div>
                    </div> */}
                    </section>
                </div>
            </div>
        )
    )
}

export default ProtectedComponent(TutorAssignmentPreview);
