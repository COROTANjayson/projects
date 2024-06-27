"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Admin = () => {
    const history = useRouter();
    useEffect(() => {
        history.replace("/admin/dashboard");

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return <div></div>;
};

export default Admin;
