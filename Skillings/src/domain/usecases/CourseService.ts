import { RespTypes } from "../entities/Auth";
import { CourseTypes } from "../entities/Course";
import CourseRepository from "../repositories/CourseRepository";

export default class CourseServiceImpl {
    CourseRepo: CourseRepository;

    constructor(ir: CourseRepository) {
        this.CourseRepo = ir;
    }

    async CreateCourse(payload: CourseTypes): Promise<RespTypes> {
        return this.CourseRepo.CreateCourse(payload);
    }

    async GetCourses(): Promise<RespTypes> {
        return this.CourseRepo.GetCourses();
    }
}
