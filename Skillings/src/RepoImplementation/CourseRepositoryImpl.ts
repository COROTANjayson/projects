import { RespTypes } from "@/domain/entities/Auth";
import { CourseTypes } from "@/domain/entities/Course";
import CourseRepository from "@/domain/repositories/CourseRepository";
import { firebaseAdd } from "@/firebase/common";
import { auth, db } from "@/firebase/firebase";

export default class CourseRepositoryImpl implements CourseRepository {
    async CreateCourse(payload: CourseTypes): Promise<RespTypes> {
        // upload the course materials
        let courseMaterialsUploaded = [];
        if (payload.courseMaterials.length) {
            const formData = new FormData();
            payload.courseMaterials.forEach(
                // @ts-ignore
                (eachFile) => formData.append("file", eachFile.originFileObj)
            );

            // post in our own api
            const materialsResp = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            const result = await materialsResp.json();
            courseMaterialsUploaded = result.files || [];
        }

        // upload the cover photo
        let coverPhotoUploaded = "";
        if (payload.coverPhoto) {
            const formData = new FormData();
            formData.append("file", payload.coverPhoto as Blob);

            // post in our own api
            const materialsResp = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            const result = await materialsResp.json();
            coverPhotoUploaded = (result && result.files[0]) || "";
        }

        // clean the course outline for empty description
        const courseOutline = payload.courseOutline.filter(
            (each) => each.description.trim().length > 0
        );

        // catch the error to prevent future bugs
        try {
            // get the user details to detect what company is creating the course
            const uid = auth.currentUser?.uid;
            const userRef = await db
                .collection("skillings_users")
                .doc(uid)
                .get();

            // add the uploaded URL and other fields to add
            let modifiedPayload = {
                ...payload,
                courseMaterials: courseMaterialsUploaded,
                coverPhoto: coverPhotoUploaded,
                courseOutline,
                company: userRef.data()?.company,
            };
            // add the basic fields
            modifiedPayload = await firebaseAdd(modifiedPayload);

            // create the course
            const addResp = await db
                .collection("courses")
                .add(modifiedPayload)
                .then(async (docRef) => {
                    const addedRef = await db
                        .collection("courses")
                        .doc(docRef.id)
                        .get();
                    return {
                        id: docRef.id,
                        ...addedRef.data(),
                    };
                });

            return {
                success: true,
                message: "Course created successfully",
                datas: addResp,
            };
        } catch (error) {
            if (error instanceof Error) {
                console.log("Error creating course", error.message);
            }
            return { success: false, message: "Error creating course" };
        }
    }

    async GetCourses(): Promise<RespTypes> {
        try {
            // get the user details to get the specific company courses
            const uid = auth.currentUser?.uid;
            const userRef = await db
                .collection("skillings_users")
                .doc(uid)
                .get();

            // get company courses
            const courseList = await db
                .collection("courses")
                .where("company", "==", userRef.data()?.company)
                .get();

            const courses = await courseList.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            const coursesPromise = await Promise.all(courses);

            console.log("coursesPromise", coursesPromise);

            return {
                success: true,
                message: "Courses fetched successfully",
                datas: coursesPromise,
            };
        } catch (error) {
            if (error instanceof Error) {
                console.log("Error fetching courses", error.message);
            }
            return { success: false, message: "Error fetching courses" };
        }
    }
}
