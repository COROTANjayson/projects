import { CourseTypes } from "@/domain/entities/Course";

export let dummyCourses: CourseTypes[] = [
  {
    id: "1-dummy-course",
    title: "Physics",
    category: "Course",
    level: ["Tertiary"],
    description: "This is dummy test",
    subCategory: "Science",
    courseType: "Advance (Bundled)",
    coverPhoto:
      "https://skillings-bucket-sea.s3.ap-southeast-1.amazonaws.com/wela-skillings/courses/coverphoto/1719388418750--hero_mars93fd33s5.jpg",
    maxNoEnrolles: 20,
    aboutCourse: "This is dummy test",
    courseOutline: [{ id: "dummy-test", description: "hellooo" }],
    courseMaterials: [],
    videoLink: "",
    priceType: "Tutor price", // "Admin price" | "Tutor price" | "Free"
    currency: "string",
    price: 120,
    // schedules: CourseSchedulesType[],
    tags: ["Science"],
    visibility: "Organization",
    overallRatings: 200,
    favorite: false,
  },
];
