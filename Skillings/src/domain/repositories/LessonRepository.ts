export interface LessonRepository {
    createLesson(payload: any, courseId: string, callback: any): Promise<any>
    getLessons(courseId: string, callback: any): Promise<any>
    getLessonsByCourseAndTutor(courseId: string, tutorId: string, callback: any): Promise<any>
    editLesson(payload: any, courseId: string, lessonId: string, callback: any): Promise<any>
    deleteLesson(courseId: string, lessonId: string): Promise<any>
    getLessonById(courseId: string, lessonId: string): Promise<any>
    getVideoDuration(videoId: any): Promise<any>
    getAllIndividualTutorLessons(payload: any, callback: any): Promise<any>
}
