"use client";
import { useEffect, useReducer, useState } from "react";
import styles from "./styles.module.css";
import {
    Avatar,
    Button,
    Col,
    Dropdown,
    Image,
    Layout,
    Menu,
    MenuProps,
    Row,
    Typography,
    message,
} from "antd";
import { BiBook } from "react-icons/bi";
import { BsStar } from "react-icons/bs";
import { IoCalendarOutline } from "react-icons/io5";
import { FolderOpenOutlined, WalletOutlined } from "@ant-design/icons";
import { useAppDispatch } from "@/redux/hooks";
import { logoutUser } from "@/redux/features/auth.slice";
import { usePathname, useRouter } from "next/navigation";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;
// const { useBreakpoint } = Grid;

const TutorLayout = ({ children }: { children: React.ReactNode }) => {
    // const { xs } = useBreakpoint();
    const router = useRouter()
    const dispatch = useAppDispatch();
    const history = useRouter();
    const [collapsed, setCollapsed] = useState(false);
    const [menuDefaultKey, setMenuDefaultKey] = useState([""]);
    const pathname = usePathname()
    const handleLogout = async () => {
        const resp = (await dispatch(logoutUser())) as {
            payload: { success: boolean; message: string };
        };

        console.log("resp", resp);

        if (resp.payload.success) {
            history.replace("/login");
        } else {
            message.error(resp.payload.message, 5);
        }
    };
    const onChangeMenu = (menu: string) => {
        setMenuDefaultKey([menu])
        router.push(`/tutor/${menu}`)
    }
    useEffect(() => {
        if (pathname.includes('/dashboard')) {
            setMenuDefaultKey(['dashboard'])
        } else if (pathname.includes('my-courses')) {
            setMenuDefaultKey(['my-courses'])
        } else if (pathname.includes('activity')) {
            setMenuDefaultKey(['activity'])
        } else if (pathname.includes('calendar')) {
            setMenuDefaultKey(['calendar'])
        } else if (pathname.includes('wallet')) {
            setMenuDefaultKey(['wallet'])
        } else if (pathname.includes('files')) {
            setMenuDefaultKey(['files'])
        }
    }, [pathname])

    const items: MenuProps["items"] = [
        // { key: "1", label: "Settings" },
        { key: "2", label: <Text onClick={handleLogout}>Logout</Text> },
    ];
    return (
        <Layout className={styles.layoutStyle}>
            <Header className={styles.headerStyle}>
                <Row
                    justify="space-between"
                    align="middle"
                    style={{ height: "100%" }}
                >
                    <Col>
                        <Image
                            width={180}
                            height={"100%"}
                            src="/banner-logo.png"
                            preview={false}
                            alt="Skillings Logo"
                        />
                    </Col>
                    <Col>
                        <Row>
                            <Col>
                                <Button style={{ marginRight: "30px" }}>
                                    My Profile
                                </Button>
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
                    </Col>
                </Row>
            </Header>
            <Layout>
                <Sider
                    width="20%"
                    collapsed={collapsed}
                    collapsible
                    onCollapse={() => setCollapsed(!collapsed)}
                    theme="light"
                >
                    <Menu
                        style={{
                            width: "100%",
                            fontSize: "17px",
                            padding: "10px 0px",
                            height: "100%",
                        }}
                        // defaultSelectedKeys={menuDefaultKey}
                        selectedKeys={menuDefaultKey}
                        mode="inline"
                        theme="light"
                        items={[
                            {
                                key: "dashboard",
                                icon: (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="25"
                                        height="20"
                                    >
                                        <path
                                            fill="currentColor"
                                            data-name="Dashboard Icon"
                                            d="M0 11.111h8.889V0H0zM0 20h8.889v-6.667H0zm11.111 0H20V8.889h-8.889zm0-20v6.667H20V0z"
                                        />
                                    </svg>
                                ),
                                label: "Dashboard",
                                onClick: () => {
                                    onChangeMenu('dashboard')
                                },
                            },
                            {
                                key: "my-courses",
                                label: "My Courses",
                                icon: (
                                    <BiBook style={{ width: 25, height: 20 }} />
                                ),
                                onClick: () => {
                                    onChangeMenu('my-courses')
                                },
                            },
                            {

                                key: "activity",
                                label: "Activity",
                                icon: <BsStar style={{ fontSize: "25px" }} />,
                                onClick: () => {
                                    onChangeMenu('activity')
                                },
                            },
                            {
                                key: "calendar",
                                label: "Calendar",
                                icon: (
                                    <IoCalendarOutline
                                        style={{ fontSize: "25px" }}
                                    />
                                ),
                                onClick: () => {
                                    onChangeMenu('calendar')
                                },
                            },
                            {
                                key: "wallet",
                                label: "Wallet",
                                icon: (
                                    <WalletOutlined
                                        style={{ fontSize: "25px" }}
                                    />
                                ),
                                onClick: () => {
                                    onChangeMenu('wallet')
                                },
                            },
                            {
                                key: "files",
                                label: "Files",
                                icon: (
                                    <FolderOpenOutlined
                                        style={{ fontSize: "25px" }}
                                    />
                                ),
                                onClick: () => {
                                    onChangeMenu('files')
                                },
                            },
                            // {
                            //     key: "Tutor Get Help",
                            //     label: "Get help",
                            // }
                        ]}
                    />
                </Sider>
                <Content className={styles.contentStyle}>{children}</Content>
            </Layout>
        </Layout>
    );
};

export default TutorLayout;
