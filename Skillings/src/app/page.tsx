"use client";
import { Col, Row } from "antd";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Main = () => {
    const history = useRouter();

    useEffect(() => {
        history.replace("/login");

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Row>
            <Col>Landing Page</Col>
        </Row>
    );
};

export default Main;
