"use client";

import { useEffect, useState } from "react";

type AdminBreadcrumbProps = {
    base: string;
    currentPath: string;
};

const AdminBreadcrumb = (payloadPath: AdminBreadcrumbProps) => {
    const [values, setValues] = useState<string[]>([]);

    console.log("values", values);

    useEffect(() => {
        payloadPath.currentPath
            .split("/")
            .filter((item) => item !== "")
            .forEach((item) => {
                if (!values.includes(item)) {
                    setValues((prev) => [...prev, item]);
                }
            });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [payloadPath]);
    return <div>AdminBreadcrumb</div>;
};

export default AdminBreadcrumb;
