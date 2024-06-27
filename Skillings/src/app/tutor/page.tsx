"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Tutor = () => {
    const history = useRouter();
    useEffect(() => {
        history.replace("/tutor/dashboard");

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return <div></div>;
};

export default Tutor;
