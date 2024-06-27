import { UploadFile } from "antd";

export type CourseSchedulesType = {
    id: string;
    day: any;
    startTime: any;
    endTime: any;
};

export type CourseOutlineType = {
    id: string;
    description: string;
};

export type CourseTypes = {
    id?: string;
    title: string;
    category: string | null;
    level: string[];
    description: string;
    subCategory: string | null;
    courseType: string;
    coverPhoto: File | string | null;
    maxNoEnrolles: number;
    aboutCourse: string;
    courseOutline: CourseOutlineType[];
    courseMaterials: UploadFile<any>[] | string[];
    videoLink: string;
    priceType: string; // "Admin price" | "Tutor price" | "Free"
    currency: string;
    price: number;
    // schedules: CourseSchedulesType[];
    tags: string[];
    visibility: string;
    overallRatings: number;
    favorite: boolean;
};

export type DispatchResp = {
    payload: {
        success: boolean;
        message: string;
        datas?: CourseTypes;
    };
};
