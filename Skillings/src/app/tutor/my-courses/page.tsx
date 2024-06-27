"use client";
import { Row, Typography, Grid, Col } from "antd";
import React from "react";
import StarRatings from "react-star-ratings";
import SetupProfile from "@/components/tutor/dashboard/SetupProfile";
import { useAppSelector } from "@/redux/hooks";
import ProtectedComponent from "@/components/protected";

const { Text } = Typography;
const { useBreakpoint } = Grid;

const TutorCourses = () => {
    const screenSize = useBreakpoint();
    const user = useAppSelector((state) => state.auth.user);

    console.log("user", user);

    return (
        <div style={{ margin: "0px auto", width: "100%" }}>
           My Courses
        </div>
    );
};

export default ProtectedComponent(TutorCourses);
