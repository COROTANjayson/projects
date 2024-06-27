import { message } from "antd";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { ComponentType, useEffect, useState } from "react";

export default function ProtectedComponent(
    Component: ComponentType
): ComponentType {
    const ProtectedCompo = (props: any) => {
        const router = useRouter();
        const [authenticated, setAuthenticated] = useState(false);
        useEffect(() => {
            const getUser = async () => {
                const token = getCookie("cookie_token");

                if (!token) {
                    router.replace("/login");
                    message.error("Session expired", 5);
                } else {
                    setAuthenticated(true);
                }
            };
            getUser();

            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        return authenticated ? <Component {...props} /> : null;
    };

    return ProtectedCompo;
}
