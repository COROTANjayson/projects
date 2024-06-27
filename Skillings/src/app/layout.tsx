import "./globals.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import StoreProvider from "@/components/StoreProvider";

import '@/styles/activity/index.css'
import '@/styles/activity/lesson.css'
import '@/styles/activity/assignment.css'
import '@/styles/activity/quiz.css'
import '@/styles/activity/submission.css'




const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
    style: ["normal", "italic"],
});

export const metadata: Metadata = {
    title: "Skillings",
    description: "Online tutoring platform",
    icons: {
        icon: "/logo.png",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={poppins.className}>
                <StoreProvider>{children}</StoreProvider>
            </body>
        </html>
    );
}
