"use client";
// import AdminBreadcrumb from "@/components/admin/AdminBreadcrumb";
import styles from "./styles.module.css";
import {
    HomeOutlined,
    ProductOutlined,
    ReadOutlined,
    TeamOutlined,
    WalletOutlined,
} from "@ant-design/icons";
import {
    Avatar,
    Col,
    Dropdown,
    Image,
    Layout,
    MenuProps,
    Row,
    message,
    Typography,
} from "antd";
import Sider from "antd/es/layout/Sider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { logoutUser } from "@/redux/features/auth.slice";

const { Header, Content } = Layout;
const { Text } = Typography;

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [currentMenu, setCurrentMenu] = useState("dashboard");

    const handleChangeMenu = (menu: string) => {
        setCurrentMenu(menu);
        localStorage.setItem("currentMenu", menu);
        router.push(`/admin/${menu}`);
    };

    const handleLogout = async () => {
        const resp = (await dispatch(logoutUser())) as {
            payload: { success: boolean; message: string };
        };

        if (resp.payload.success) {
            router.replace("/login");
        } else {
            message.error(resp.payload.message, 5);
        }
    };

    useEffect(() => {
        const menu = localStorage.getItem("currentMenu");
        if (menu) setCurrentMenu(menu);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const items: MenuProps["items"] = [
        // { key: "1", label: "Settings" },
        { key: "2", label: <Text onClick={handleLogout}>Logout</Text> },
    ];

    return (
        <Layout style={{ backgroundColor: "#fff" }}>
            <Sider
                width={250}
                style={{ backgroundColor: "#f2f4f7", height: "100vh" }}
            >
                <Row justify="center" style={{ margin: "15px 0px 20px 0px" }}>
                    <Col>
                        <Image
                            width={150}
                            height={"100%"}
                            src="/banner-logo.png"
                            preview={false}
                            alt="Skillings Logo"
                        />
                    </Col>
                </Row>
                <Row>
                    <Col
                        span={23}
                        className={`${styles.menuHover} ${
                            currentMenu === "dashboard" ? styles.activeMenu : ""
                        }`}
                        onClick={() => handleChangeMenu("dashboard")}
                    >
                        <HomeOutlined style={{ marginRight: "10px" }} />{" "}
                        Dashboard
                    </Col>
                </Row>
                <Row>
                    <Col
                        span={23}
                        className={`${styles.menuHover} ${
                            currentMenu === "programs" ? styles.activeMenu : ""
                        }`}
                        onClick={() => handleChangeMenu("programs")}
                    >
                        <ProductOutlined style={{ marginRight: "10px" }} />{" "}
                        Programs
                    </Col>
                </Row>
                <Row>
                    <Col
                        span={23}
                        className={`${styles.menuHover} ${
                            currentMenu === "courses" ? styles.activeMenu : ""
                        }`}
                        onClick={() => handleChangeMenu("courses")}
                    >
                        <ReadOutlined style={{ marginRight: "10px" }} /> Courses
                    </Col>
                </Row>
                <Row>
                    <Col
                        span={23}
                        className={`${styles.menuHover} ${
                            currentMenu === "tutors" ? styles.activeMenu : ""
                        }`}
                        onClick={() => handleChangeMenu("tutors")}
                    >
                        <TeamOutlined style={{ marginRight: "10px" }} /> Tutors
                    </Col>
                </Row>
                <Row>
                    <Col
                        span={23}
                        className={`${styles.menuHover} ${
                            currentMenu === "wallet" ? styles.activeMenu : ""
                        }`}
                        onClick={() => handleChangeMenu("wallet")}
                    >
                        <WalletOutlined style={{ marginRight: "10px" }} />{" "}
                        Wallet
                    </Col>
                </Row>
                <Row>
                    <Col
                        span={23}
                        className={`${styles.menuHover} ${
                            currentMenu === "settings" ? styles.activeMenu : ""
                        }`}
                        onClick={() => handleChangeMenu("settings")}
                    >
                        <WalletOutlined style={{ marginRight: "10px" }} />{" "}
                        Settings
                    </Col>
                </Row>
            </Sider>
            <Layout>
                <Header
                    style={{ backgroundColor: "#fff", padding: "0px 20px" }}
                >
                    <Row
                        justify="space-between"
                        align="middle"
                        style={{ height: "100%" }}
                    >
                        <Col>
                            breadcrumb
                            {/* <AdminBreadcrumb
                                base={currentMenu}
                                currentPath={window.location.pathname}
                            /> */}
                        </Col>
                        <Col>
                            <Dropdown menu={{ items }} trigger={["click"]}>
                                <Avatar
                                    style={{
                                        backgroundColor: "#3b82f6",
                                        verticalAlign: "middle",
                                        cursor: "pointer",
                                    }}
                                    size="large"
                                >
                                    S
                                </Avatar>
                            </Dropdown>
                        </Col>
                    </Row>
                </Header>
                <Content className={styles.contentStyle}>{children}</Content>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;
