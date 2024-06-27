import { CourseTypes } from "../entities/Course";
import { RespTypes } from "../entities/Auth";

type CourseRepository = {
    CreateCourse(payload: CourseTypes): Promise<RespTypes>;
    GetCourses(): Promise<RespTypes>;
};

export default CourseRepository;
