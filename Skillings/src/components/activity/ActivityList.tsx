// import { getStudentsFromBookingSchedule } from "@/app/redux/booking/booking.actions"
import { Row, Col } from "antd"
import React, { useEffect, useState } from "react"
import ActivityCard from "./ActivityCard"

type Props = {
    activities: any
    course: any
}

const ActivityList = ({ activities, course }: Props) => {
    const [courseStudents, setCourseStudents] = useState([])

   useEffect(() => {
        // eslint-disable-next-line no-console
        // getMembers()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // const getMembers = async () => {
    //     await getStudentsFromBookingSchedule(course.courseId, (callback: any) => {
    //         // console.log('getmembers sa activitylist', callback);
    //         setCourseStudents(callback)
    //     })
    // }

    return (
        <>
            <Row gutter={[20, 20]}>
                {activities.map((activity:any) => {
                    if (activity.courseId == course.courseId)
                        return (
                            <Col className="gutter-row" span={6} key={activity.id}>
                                <ActivityCard activityData={activity} courseStudents={courseStudents} />
                            </Col>
                        )
                })}
            </Row>
        </>
    )
}

export default ActivityList
