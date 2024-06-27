export type RespTypes = {
    success: boolean;
    message: string;
    datas?: any;
    errorMessage?: any;
};

export type AuthTypes = {
    email: string;
    password: string;
};

export type RegisterTypes = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};

export type UpdateProfile = {
    introVideo: File | string | null;
    about: string;
    workExperienceType: string;
    workExperienceLevel: string[];
    workExperienceDesc: string;
};

export type UserType = {
    uid: string;
    email: string;
    firstName: string;
    lastName: string;
    isDisabled: boolean;
    country: string;
    partnerCode: string;
    role: string; // "admin" | "tutor" | "student"
    phoneNumber: string;
    photoURL: string;
    about: string;
    courses: string[];
    currency: string;
    files: string[];
    folders: string[];
    isSuperAdmin?: boolean;
    emailVerified: boolean;
    allowNotifications: boolean;
    company: string;
    introVideo: string;
    workExperienceType: string;
    workExperienceLevel: string[];
    workExperienceDesc: string;
};
