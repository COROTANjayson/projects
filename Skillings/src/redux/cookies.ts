import { setCookie } from "cookies-next";

export const setAuthCookie = (token: string, name: string) => {
    const toBase64 = Buffer.from(token).toString("base64");

    setCookie(name, toBase64, {
        maxAge: 60 * 60 * 24 * 3, // 3 days
        path: "/",
        secure: process.env.NODE_ENV === "production",
    });
};
