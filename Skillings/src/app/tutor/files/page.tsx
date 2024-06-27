"use client";
import { Row, Typography, Grid, Col } from "antd";
import React from "react";

import { useAppSelector } from "@/redux/hooks";
import ProtectedComponent from "@/components/protected";

const { Text } = Typography;
const { useBreakpoint } = Grid;

const TutorFiles = () => {
    const screenSize = useBreakpoint();
    const user = useAppSelector((state) => state.auth.user);

    console.log("user", user);

    return (
        <div style={{ margin: "0px auto", width: "100%" }}>
            Files
        </div>
    );
};

export default ProtectedComponent(TutorFiles);
