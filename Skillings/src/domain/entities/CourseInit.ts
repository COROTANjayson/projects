import { generate16RandomID } from "@/utils/utils";

export const EmptyCreateCourse = {
    title: "",
    category: null,
    level: [],
    description: "",
    subCategory: null,
    courseType: "",
    coverPhoto: null,
    maxNoEnrolles: 20,
    aboutCourse: "",
    courseOutline: [
        {
            id: generate16RandomID(),
            description: "",
        },
        {
            id: generate16RandomID(),
            description: "",
        },
        {
            id: generate16RandomID(),
            description: "",
        },
    ],
    courseMaterials: [],
    videoLink: "",
    priceType: "Admin price",
    price: 0,
    currency: "IDR",
    tags: [],
    visibility: "",
    overallRatings: 0,
    favorite: false,
};
