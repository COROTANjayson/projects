export interface ActivitiesRepository {
    createQuiz(payload: any): Promise<any>
    getActivitiesByTutor(tutorId: string, callback: any): Promise<any>
    getActivitiesByCourses(payload: any, callback: any): Promise<any>
    getActivitiesByCourse(id: any, callback: any): Promise<any>
    getActivity(activityId: string, callback: any): Promise<any>
    editQuiz(activityId: string, payload: any): Promise<any>
    getQuizSelective(activityId: string, userId: string, callback: any): Promise<any>
    getQuizAnswerLocalDB(activityId: any): Promise<any>
    storeQuizAnswerToLocalDB(payload: any): void
    submitQuiz(userId: string, payload: any): Promise<any>
    deleteActivity(activityId: string): Promise<any>
    createLesson(payload: any): Promise<any>
    editLesson(activityId: string, payload: any): Promise<any>
    createAssignment(payload: any): Promise<any>
    assignStudents(activityId: string, payload: any): Promise<any>
    editAssignment(activityId: string, payload: any): Promise<any>
    removeFile(activityId: string, url: string): Promise<any>
    getAssignmentAnswer(activityId: string, userId: string): Promise<any>
    getAssignmentAnswerV2(activityId: string, userId: string, callback: any): Promise<any>
    getAssignmentAnswerList(payload: any, callback: any): Promise<any>
    getGeneralAssignmentAnswerList(payload: any, callback: any): Promise<any>
    submitAssignment(userId: string, payload: any, callback: any): Promise<any>
    submitAssignmentV2(userId: string, payload: any, callback: any): Promise<any>
    checkUserActivityDone(activityId: string, userId: string): Promise<any>
    getActivityAnswer(activityId: string, userId: string): Promise<any>
    getActivityAnswerV2(activityId: string, userId: string): Promise<any>
    getActivityRealtime(activityId: string, callback: any): Promise<any>
    saveScoreAssignment(ids: any, payload: any): Promise<any>
    saveScoreAssignmentV2(id: any, payload: any): Promise<any>
    saveScoreQuiz(ids: any, payload: any): Promise<any>
    transferGradeStatus(activityId: string, payload: any): Promise<any>
    getActivitiesByTutorAndCourse(tutorId: string, courseId: string, callback: any): Promise<any>
}
