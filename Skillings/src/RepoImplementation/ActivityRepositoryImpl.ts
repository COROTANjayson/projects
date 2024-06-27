/* eslint-disable arrow-body-style */
import { auth, db, firebase, firebaseAdd, firebaseUpdate, storage } from "@/firebase/firebase";
import { uploadToAWSS3 } from "./aws.repository"
import { ACTIVITIES_ANSWER_COLLECTION, ACTIVITIES_COLLECTION, ATTEMPTS_ANSWER_COLLECTION, COURSE_DATA_COLLECTION, USER_DATA_COLLECTION } from "./collection"
// import { MERGE_FALSE, MERGE_TRUE } from "./firebase/firebase.options"
import { ActivitiesRepository } from "@/domain/repositories/ActivityRepository";
import { MERGE_FALSE, MERGE_TRUE } from "@/firebase/firebase.options";

export class DataActivityRepository implements ActivitiesRepository {
    uniqueID() {
        return Math.random().toString(36).substr(2, 9)
    }
    getSpecificFileType(fileType: string | string[]) {
        if (fileType.includes(".sheet")) {
            return "xlsx"
        } else if (fileType.includes(".ms-excel")) {
            return "xls"
        } else if (fileType.includes(".document")) {
            return "docx"
        } else if (fileType.includes("msword")) {
            return "doc"
        } else if (fileType.includes(".presentation")) {
            return "pptx"
        } else if (fileType.includes(".ms-powerpoint")) {
            return "ppt"
        }

        return fileType
    }
    getThisIsNotInRepot() {
    
        return 'fileType'
    }

    async createQuiz(payload: any): Promise<any> {
        const ranksRef = db.collection(ACTIVITIES_COLLECTION).doc()
        payload = firebaseAdd(payload)
        return ranksRef
            .set(payload, MERGE_FALSE)
            .then(() => true)
            .catch(() => false)
    }

    async getActivitiesByTutor(tutorId: string, callback: any): Promise<any> {
        // const activitiesRef = db.collection(ACTIVITIES_COLLECTION).where("tutorId", "==", tutorId).where("isDeleted", "==", false).orderBy("creation", "desc")
        const activitiesRef = db.collection(ACTIVITIES_COLLECTION).where("tutorId", "==", tutorId).where("isDeleted", "==", false)
        activitiesRef.onSnapshot((snap) => {
            const mappedSnap = snap.docs.map(async (docSnap) => {
                const courseRef = db.collection(COURSE_DATA_COLLECTION).doc(docSnap.data().courseId)
                const courseSnapshot = await courseRef.get()
                return { id: docSnap.id, ...docSnap.data(), courseData: courseSnapshot.data() }
            })
            Promise.all(mappedSnap).then((resp) => {
                callback && callback(resp)
            })
        })
    }

    async getActivitiesByCourses(payload: any, callback: any): Promise<any> {
        const coursesRef = db.collection(ACTIVITIES_COLLECTION)
        coursesRef
            .where("courseId", "in", payload)
            .where("isDeleted", "==", false)
            .get()
            .then((snapshot) => {
                const activities: { id: string; }[] = []
                snapshot.forEach((doc) => {
                    activities.push({ id: doc.id, ...doc.data() })
                })
                return callback(activities)
            })
            .catch((error) => {
                // eslint-disable-next-line no-console
                console.error(error)
            })
    }

    async getActivitiesByCourse(id: any, callback: any): Promise<any> {
        const coursesRef = db.collection(ACTIVITIES_COLLECTION)
        coursesRef
            .where("courseId", "==", id)
            .where("isDeleted", "==", false)
            .get()
            .then((snapshot) => {
                const activities: { id: string; }[] = []
                snapshot.forEach((doc) => {
                    activities.push({ id: doc.id, ...doc.data() })
                })
                return callback(activities)
            })
            .catch((error) => {
                // eslint-disable-next-line no-console
                console.error(error)
            })
    }

    async getActivitiesByTutorAndCourse(tutorId: string, courseId: string, callback: any): Promise<any> {
        const user = auth.currentUser
        const activitiesRef = db.collection(ACTIVITIES_COLLECTION).where("tutorId", "==", tutorId).where("courseId", "==", courseId).where("isDeleted", "==", false).orderBy("creation", "desc")
        activitiesRef.onSnapshot((snap) => {
            const mappedSnap = snap.docs.map(async (docSnap) => {
                const courseRef = db.collection(COURSE_DATA_COLLECTION).doc(docSnap.data().courseId)
                const courseSnapshot = await courseRef.get()
                const answerRef = db.collection(ACTIVITIES_COLLECTION).doc(docSnap.id).collection(ACTIVITIES_ANSWER_COLLECTION).doc(user?.uid)
                const answerDoc = await answerRef.get()
                return { id: docSnap.id, ...docSnap.data(), courseData: courseSnapshot.data(), userSubmitted: answerDoc.exists }
            })
            Promise.all(mappedSnap).then((resp) => {
                callback && callback(resp)
            })
        })
    }

    async getActivity(activityId: string, callback: any): Promise<any> {
        const activityRef = db.collection(ACTIVITIES_COLLECTION).doc(activityId)
        await activityRef.get().then((doc) => {
            const snap = { id: doc.id, ...doc.data() }
            Promise.resolve(snap).then((resp) => {
                callback && callback(resp)
            })
        })
    }

    async getActivityRealtime(activityId: string, callback: any): Promise<any> {
        const activityRef = db.collection(ACTIVITIES_COLLECTION).doc(activityId)
        activityRef.onSnapshot(async (snapshot) => {
            const snap = { id: snapshot.id, ...snapshot.data() }
            Promise.resolve(snap).then((resp) => {
                callback && callback(resp)
            })
        })
    }

    async editQuiz(activityId: string, payload: any): Promise<any> {
        const ranksRef = db.collection(ACTIVITIES_COLLECTION).doc(activityId)
        payload = firebaseUpdate(payload)
        return (
            ranksRef
                .set(payload, MERGE_TRUE)
                // eslint-disable-next-line arrow-body-style
                .then(() => {
                    return true
                })
                // eslint-disable-next-line arrow-body-style
                .catch(() => {
                    return false
                })
        )
    }

    shuffle(array: any) {
        let currentIndex = array.length
        let temporaryValue
        let randomIndex
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex)
            currentIndex -= 1
            temporaryValue = array[currentIndex]
            array[currentIndex] = array[randomIndex]
            array[randomIndex] = temporaryValue
        }
        return array
    }

    async getQuizSelective(activityId: string, userId: string, callback: any): Promise<any> {
        const activityRef = db.collection(ACTIVITIES_COLLECTION).doc(activityId)
        await activityRef.get().then(async (docsnap) => {
            const doc = await db.collection(ACTIVITIES_COLLECTION).doc(activityId).collection("answers").doc(userId).get()
            const data = doc.data() || {}
            const snapshot = docsnap.data() || { questionArray: [] }
            const cleanArray: any[] = []
            const self = this
            snapshot.questionArray.forEach(function (item: { type: string; choices: { description: any }[]; answers: any; rows: any; question: any; trueOrFalse: any }) {
                if (item.type === "Multiple Choice") {
                    const cleanChoices: { description: any }[] = []
                    item.choices.forEach(function (choice: { description: any }) {
                        const choiceClean = {
                            description: choice.description
                        }
                        cleanChoices.push(choiceClean)
                    })
                    const question = {
                        type: item.type,
                        question: item.question,
                        choices: cleanChoices
                    }
                    cleanArray.push(question)
                } else if (item.type === "True or False") {
                    const question = {
                        type: item.type,
                        question: item.question
                    }
                    cleanArray.push(question)
                } else if (item.type === "Identification") {
                    const question = {
                        type: item.type,
                        question: item.question
                    }
                    cleanArray.push(question)
                } else if (item.type === "Enumeration") {
                    const cleanChoices: string[] = []
                    item.answers.forEach(function () {
                        cleanChoices.push("")
                    })
                    const question = {
                        type: item.type,
                        question: item.question,
                        answers: cleanChoices
                    }
                    cleanArray.push(question)
                } else if (item.type === "Matching Type") {
                    const cleanChoices: { left: any }[] = []
                    const randomChoices: any[] = []
                    item.rows.forEach(function (choice: { right: any }) {
                        randomChoices.push(choice.right)
                    })

                    item.rows.forEach(function (choice: { left: any }) {
                        const choiceClean = {
                            left: choice.left,
                            choices: self.shuffle(randomChoices)
                        }
                        cleanChoices.push(choiceClean)
                    })
                    const question = {
                        type: item.type,
                        question: item.question,
                        rows: cleanChoices
                    }
                    cleanArray.push(question)
                } else {
                    cleanArray.push(item)
                }
            })
            let access = {}
            if (doc.exists && !data.canRetake) {
                access = { status: "Done", canRetake: false, role: data.role }
            } else if (doc.exists && data.canRetake) {
                access = { status: "Done", canRetake: true, role: data.role }
            } else if (!doc.exists) {
                access = { status: "To Do", canRetake: false, role: data.role }
            }
            const snap = { ...snapshot, ...access, questionArray: cleanArray }
            return Promise.resolve(snap).then((resp) => {
                callback && callback(resp)
            })
        })
    }

    storeQuizAnswerToLocalDB(payload: any): void {
        const { key, value } = payload
        if (!value) return
        localStorage.setItem(key, JSON.stringify(value))
    }

    async getQuizAnswerLocalDB(activityId: any): Promise<any> {
        const answers = localStorage.getItem(activityId)
        if (!answers) return false
        return JSON.parse(answers)
    }

    async submitQuiz(userId: string, payload: any): Promise<any> {
        payload = firebaseAdd(payload)
        const uniqueId = this.uniqueID() + this.uniqueID()
        const question = payload.activityCopy
        payload.question = question
        payload.topic = question.topic || ""
        payload.title = question.title || ""
        delete payload.activityCopy
        return (
            db
                .collection(ACTIVITIES_COLLECTION)
                .doc(payload.activityId)
                .collection(ACTIVITIES_ANSWER_COLLECTION)
                .doc(userId)
                .collection(ATTEMPTS_ANSWER_COLLECTION)
                .doc(uniqueId)
                .set(payload, MERGE_TRUE)
                .then(async () => {
                    localStorage.removeItem(payload.activityId)
                    try {
                        const attemptsArray: any[] = []
                        const attemptDataInit = await db.collection(ACTIVITIES_COLLECTION).doc(payload.activityId).collection(ACTIVITIES_ANSWER_COLLECTION).doc(userId).get()
                        const attemptData = attemptDataInit.data() || {}
                        if (!attemptDataInit.exists) {
                            attemptsArray.push(uniqueId)
                            await db.collection(ACTIVITIES_COLLECTION).doc(payload.activityId).collection(ACTIVITIES_ANSWER_COLLECTION).doc(userId).set(
                                {
                                    attemptsArray,
                                    latestAttempt: uniqueId,
                                    canRetake: false,
                                    role: payload.role,
                                    activityType: "Quiz"
                                },
                                { merge: true }
                            )
                        } else {
                            const attemptsArray = attemptData.attemptsArray
                            attemptsArray.push(uniqueId)
                            await db.collection(ACTIVITIES_COLLECTION).doc(payload.activityId).collection(ACTIVITIES_ANSWER_COLLECTION).doc(userId).set(
                                {
                                    attemptsArray,
                                    latestAttempt: uniqueId,
                                    canRetake: false,
                                    role: payload.role,
                                    activityType: "Quiz"
                                },
                                MERGE_TRUE
                            )
                        }
                        return { success: true, userId, attemptId: uniqueId }
                        // eslint-disable-next-line no-empty
                    } catch (e) {}
                })
                // eslint-disable-next-line arrow-body-style
                .catch((err: any) => {
                    return { success: false, error: err.message }
                })
        )
    }

    async deleteActivity(activityId: string): Promise<any> {
        const activityRef = db.collection(ACTIVITIES_COLLECTION).doc(activityId)
        let payload:any = {
            isDeleted: true
        }
        payload = firebaseUpdate(payload)
        return activityRef
            .set(payload, MERGE_TRUE)
            .then(() => true)
            .catch(() => false)
    }

    // const uniqueID = () => {
    //     return Math.random().toString(36).substr(2, 9)
    // }

    async createLesson(payload: any): Promise<any> {
        const files: any = []
        const assignmentRef = db.collection(ACTIVITIES_COLLECTION).doc()

        if (payload.files.length > 0) {
            const promises = payload.files.map(async (file: { originFileObj: any; name: any; }) => {
                const fileUrl = await uploadToAWSS3(file.originFileObj, `company/tutorActivity/${this.uniqueID()}_${file.name}`)
                files.push(fileUrl)

                if (files.length === payload.files.length) {
                    payload.files = files
                    payload = firebaseAdd(payload)
                    return await assignmentRef
                        .set(payload, MERGE_FALSE)
                        .then(() => {
                            return "success"
                        })
                        .catch((err: { code: any; message: any }) => {
                            return err.message
                        })
                }
            })
            const results = await Promise.all(promises)
            if (results.indexOf("success") > -1) {
                return "success"
            } else {
                return "Error adding document"
            }
        } else {
            payload = firebaseAdd(payload)
            return await assignmentRef
                .set(payload, MERGE_FALSE)
                .then(() => {
                    return "success"
                })
                .catch((err: { code: any; message: any }) => {
                    return err.message
                })
        }
    }

    async editLesson(activityId: string, payload: any): Promise<any> {
        const items = {
            ...payload,
            files: []
        }
        if (payload.files.length > 0) {
            const promises = payload.files.map(async (file: any) => {
                return await uploadToAWSS3(file.originFileObj, `company/tutorActivity/${this.uniqueID()}_${file.name}`)
                    .then((data: any) => {
                        return items.files.push(data)
                    })
                    .then(async function () {
                        const { files } = items

                        if (items.files.length === payload.files.length) {
                            const val = await firebaseUpdate(payload)
                            delete val.files
                            const activitiesRef = db.collection(ACTIVITIES_COLLECTION).doc(activityId)
                            return activitiesRef
                                .set(
                                    {
                                        ...val,
                                        files: firebase.firestore.FieldValue.arrayUnion(...files)
                                    },
                                    MERGE_TRUE
                                )
                                .then(() => {
                                    return "success"
                                })
                        }
                    })
            })

            const results = await Promise.all(promises)
            if (results.includes("success")) {
                return "success"
            } else {
                return "Error uploading files"
            }
        } else {
            payload = firebaseUpdate(payload)
            delete payload.files
            return await db
                .collection(ACTIVITIES_COLLECTION)
                .doc(activityId)
                .set({ ...payload }, MERGE_TRUE)
                .then(() => {
                    return "success"
                })
                .catch((err: { code: any; message: any }) => {
                    return err.message
                })
        }
    }

    async createAssignment(payload: any): Promise<any> {
        const files: any = []
        const assignmentRef = db.collection(ACTIVITIES_COLLECTION).doc()

        // payload.files.map(async (file: any) => {
        //     const getFileType = file.type.split("/").length > 1 ? file.type.split("/")[1] : file.type
        //     const fileUrl = await uploadToAWSS3(file.originFileObj, `company/tutorActivity/${this.uniqueID()}_${file.name}.${getFileType}`)
        //     files.push(fileUrl)
        // })

        if (payload.files.length > 0) {
            const promises = payload.files.map(async (file: { originFileObj: any; name: any; }) => {
                const fileUrl = await uploadToAWSS3(file.originFileObj, `company/tutorActivity/${this.uniqueID()}_${file.name}`)
                files.push(fileUrl)

                if (files.length === payload.files.length) {
                    payload.files = files
                    payload = firebaseAdd(payload)
                    return await assignmentRef
                        .set(payload, MERGE_FALSE)
                        .then(() => {
                            return "success"
                        })
                        .catch((err: { code: any; message: any }) => {
                            return err.message
                        })
                }
            })
            const results = await Promise.all(promises)
            if (results.indexOf("success") > -1) {
                return "success"
            } else {
                return "Error adding document"
            }
        } else {
            payload = firebaseAdd(payload)
            return await assignmentRef
                .set(payload, MERGE_FALSE)
                .then(() => {
                    return "success"
                })
                .catch((err: { code: any; message: any }) => {
                    return err.message
                })
        }

        // const assignmentRef = db.collection(ACTIVITIES_COLLECTION).doc()
        //     payload.files = files
        //     payload = firebaseAdd(payload)
        //     return await assignmentRef
        //         .set({...payload, file: files}, MERGE_FALSE)
        //         .then(() => {
        //             return "success"
        //         })
        //         .catch((err: { code: any; message: any }) => {
        //             return err.message
        //         })
    }

    async assignStudents(activityId: string, payload: any): Promise<any> {
        return await db
            .collection(ACTIVITIES_COLLECTION)
            .doc(activityId)
            .update({
                members: payload.members
            })
            .then(() => {
                return "success"
            })
            .catch((err: { code: any; message: any }) => {
                return err.message
            })
    }

    async editAssignment(activityId: string, payload: any): Promise<any> {
        const items = {
            ...payload,
            files: []
        }
        if (payload.files.length > 0) {
            const promises = payload.files.map(async (file: any) => {
                return await uploadToAWSS3(file.originFileObj, `company/tutorActivity/${this.uniqueID()}_${file.name}`)
                    .then((data: any) => {
                        return items.files.push(data)
                    })
                    .then(async function () {
                        const { files } = items

                        if (items.files.length === payload.files.length) {
                            const val = await firebaseUpdate(payload)
                            delete val.files
                            const activitiesRef = db.collection(ACTIVITIES_COLLECTION).doc(activityId)
                            return activitiesRef
                                .set(
                                    {
                                        ...val,
                                        files: firebase.firestore.FieldValue.arrayUnion(...files)
                                    },
                                    MERGE_TRUE
                                )
                                .then(() => {
                                    return "success"
                                })
                        }
                    })
            })

            const results = await Promise.all(promises)
            if (results.includes("success")) {
                return "success"
            } else {
                return "Error uploading files"
            }
        } else {
            payload = firebaseUpdate(payload)
            delete payload.files
            return await db
                .collection(ACTIVITIES_COLLECTION)
                .doc(activityId)
                .set({ ...payload }, MERGE_TRUE)
                .then(() => {
                    return "success"
                })
                .catch((err: { code: any; message: any }) => {
                    return err.message
                })
        }
    }

    async removeFile(activityId: string, url: string): Promise<any> {
        try {
            await db
                .collection(ACTIVITIES_COLLECTION)
                .doc(activityId)
                .update({
                    files: firebase.firestore.FieldValue.arrayRemove(url)
                })
            return "success"
        } catch (err:any) {
            return err.message
        }
    }

    async getAssignmentAnswer(activityId: string, userId: string): Promise<any> {
        const attemptRef = await db.collection(ACTIVITIES_COLLECTION).doc(activityId).collection(ACTIVITIES_ANSWER_COLLECTION).doc(userId).get()

        const snapshot: any = attemptRef.data()
        if (attemptRef.exists) {
            const latestAttempt = snapshot.latestAttempt
            const canRetake = snapshot.canRetake
            const answerRef = await db
                .collection(ACTIVITIES_COLLECTION)
                .doc(activityId)
                .collection(ACTIVITIES_ANSWER_COLLECTION)
                .doc(userId)
                .collection(ATTEMPTS_ANSWER_COLLECTION)
                .doc(latestAttempt)
                .get()

            return {
                id: latestAttempt,
                canRetake,
                ...answerRef.data()
            }
        } else {
            const activityRef = await db.collection(ACTIVITIES_COLLECTION).doc(activityId).get()
            const snapshot = activityRef.data()
            return { canRetake: true, activity: { ...snapshot } }
        }
    }

    async getAssignmentAnswerV2(activityId: string, userId: string, callback: any): Promise<any> {
        // Get a reference to the answers collection
        const answersRef = db.collection(ACTIVITIES_ANSWER_COLLECTION)

        // Query the answers collection for a specific answer based on the activityId and userId
        const query = answersRef.where("activityId", "==", activityId).where("userId", "==", userId)

        // Get the first document in the query results
        const snapshot = await query.limit(1).get()

        if (snapshot.empty) {
            // No documents were found
            const response = {
                success: false,
                message: "Answer not found"
            }
            callback && callback(response)
        } else {
            // The answer document exists, so you can retrieve the data
            const answerRef = snapshot.docs[0]
            const answer = answerRef.data()
            answer.id = snapshot.docs[0].id

            // const answersDataPromise = updatedAnswers.map(async (answer) => {
            //     const userRef = db.collection(USER_DATA_COLLECTION).doc(answer.userId);
            //     const userSnapshot = await userRef.get();
            //     const userData = userSnapshot.data();
            //     return {
            //         ...answer,
            //         userData
            //     }
            // })

            const userRef = db.collection(USER_DATA_COLLECTION).doc(answer.userId)
            const userSnapshot = await userRef.get()
            const userData = userSnapshot.data()
            answer.userData = userData

            // const answerData = await Promise.all(answersDataPromise)

            // Return the answer data as a response object
            const response = {
                success: true,
                data: answer
            }

            // put the response in callback;
            callback && callback(response)
        }
    }

    async getAssignmentAnswerList(payload: any, callback: any): Promise<any> {
        // Get a reference to the answers collection
        const { activityId, type } = payload
        const answersRef = db.collection(ACTIVITIES_ANSWER_COLLECTION)

        // Query the answers collection for a specific answer based on the activityId and userId
        const query = answersRef.where("activityId", "==", activityId).where("type", "==", type).get()

        // const studentPromises = studentIds.map(async (studentId) => {
        //     const snapshot = await db.collection(USER_DATA_COLLECTION).doc(studentId).get()
        //     const data = snapshot.data()
        //     return {
        //         value: data.email,
        //         label: data.fullName,
        //         email: data.email,
        //         studentName: data.fullName,
        //         id: data.id
        //     }
        // })
        // const studentData = await Promise.all(studentPromises)

        // Get the first document in the query results
        query
            .then(async (snapshot) => {
                const updatedAnswers = []
                snapshot.forEach(async (doc) => {
                    const answer = doc.data()
                    // await doc.ref.update({ userData });
                    // return { id: doc.id, ...answer, userData }
                    updatedAnswers.push({ id: doc.id, ...answer })
                })

                // console.log('updatedAnswers', updatedAnswers);

                const answersDataPromise = updatedAnswers.map(async (answer) => {
                    const userRef = db.collection(USER_DATA_COLLECTION).doc(answer.userId)
                    const userSnapshot = await userRef.get()
                    const userData = userSnapshot.data()
                    return {
                        ...answer,
                        userData
                    }
                })

                const answerData = await Promise.all(answersDataPromise)

                // console.log('answerData', answerData);

                // updatedAnswers.map(() => {

                // })

                callback(answerData)
            })
            .catch((error) => {
                callback(null, error)
            })
    }

    async getGeneralAssignmentAnswerList(payload: any, callback: any): Promise<any> {
        // Get a reference to the answers collection
        const { type } = payload
        const answersRef = db.collection(ACTIVITIES_ANSWER_COLLECTION)

        // Query the answers collection for a specific answer based on the activityId and userId
        const query = answersRef.where("type", "==", type).get()

        // Get the first document in the query results
        query
            .then(async (snapshot) => {
                const updatedAnswers = []
                snapshot.forEach(async (doc) => {
                    const answer = doc.data()
                    updatedAnswers.push({ id: doc.id, ...answer })
                })

                // const answersDataPromise = updatedAnswers.map(async (answer) => {
                //     const userRef = db.collection(USER_DATA_COLLECTION).doc(answer.userId)
                //     const userSnapshot = await userRef.get()
                //     const userData = userSnapshot.data()
                //     return {
                //         ...answer,
                //         userData
                //     }
                // })

                // const answerData = await Promise.all(answersDataPromise)

                callback(updatedAnswers)
            })
            .catch((error) => {
                callback(null, error)
            })
    }

    async submitAssignment(userId: string, payload: any, callback: any): Promise<any> {
        let { files } = payload
        const uniqueId = this.uniqueID() + this.uniqueID()
        payload.attemptId = uniqueId
        const items = {
            ...payload,
            files: []
        }
        files.forEach((item: any) => {
            if (typeof item === "string") {
                files.length = 0
                files = []
            }
        })
        if (files.length > 0) {
            const promises = files.map(async (item: any) => {
                let uploadTask = storage.ref(`activities/answers/${this.uniqueID()}_${item.name}`).put(item.originFileObj)
                if (typeof item === "string") {
                    uploadTask = storage.ref(item).putString(item)
                }

                return uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                        callback && callback({ uid: item.uid, name: item.name, progress: parseFloat(progress.toFixed(3)) })
                    },
                    (error) => {
                        callback && callback({ message: error.message })
                    },
                    () => {
                        return uploadTask.snapshot.ref
                            .getDownloadURL()
                            .then((data) => {
                                items.files.push(data)
                            })
                            .then(async () => {
                                if (items.files.length === files.length) {
                                    const toAdd = firebaseAdd(items)
                                    toAdd.topic = toAdd.activity.topic || ""
                                    toAdd.title = toAdd.activity.title
                                    toAdd.id = uniqueId
                                    delete toAdd.file
                                    delete toAdd.activity.answers
                                    delete toAdd.callback

                                    await db
                                        .collection(ACTIVITIES_COLLECTION)
                                        .doc(payload.activityId)
                                        .collection(ACTIVITIES_ANSWER_COLLECTION)
                                        .doc(userId)
                                        .collection(ATTEMPTS_ANSWER_COLLECTION)
                                        .doc(uniqueId)
                                        .set(toAdd, MERGE_FALSE)
                                        .then(async () => {
                                            try {
                                                const attemptsArray: any[] = []
                                                const attemptDataInit = await db.collection(ACTIVITIES_COLLECTION).doc(payload.activityId).collection(ACTIVITIES_ANSWER_COLLECTION).doc(userId).get()

                                                if (attemptDataInit.exists) {
                                                    const attemptData = attemptDataInit.data()
                                                    const attemptsArray = attemptData?.attemptsArray || []
                                                    attemptsArray.push(uniqueId)
                                                    await db
                                                        .collection(ACTIVITIES_COLLECTION)
                                                        .doc(payload.activityId)
                                                        .collection(ACTIVITIES_ANSWER_COLLECTION)
                                                        .doc(userId)
                                                        .set(
                                                            {
                                                                attemptsArray,
                                                                latestAttempt: uniqueId,
                                                                canRetake: false,
                                                                role: payload.role || "tutee",
                                                                activityType: "Assignment"
                                                            },
                                                            MERGE_TRUE
                                                        )
                                                } else {
                                                    attemptsArray.push(uniqueId)
                                                    await db
                                                        .collection(ACTIVITIES_COLLECTION)
                                                        .doc(payload.activityId)
                                                        .collection(ACTIVITIES_ANSWER_COLLECTION)
                                                        .doc(userId)
                                                        .set(
                                                            {
                                                                attemptsArray,
                                                                latestAttempt: uniqueId,
                                                                canRetake: false,
                                                                role: payload.role || "student",
                                                                activityType: "Assignment"
                                                            },
                                                            MERGE_FALSE
                                                        )
                                                }
                                                // eslint-disable-next-line no-empty
                                            } catch (e) {}
                                            return callback && callback("success")
                                        })
                                        .catch((err: { code: any; message: any }) => {
                                            return err.message
                                        })
                                }
                            })
                    }
                )
            })

            const results = await Promise.all(promises)

            if (results.indexOf("success") > -1) {
                return callback && callback("success")
            } else {
                return callback && callback("Error adding document")
            }
        } else {
            const toAdd = firebaseAdd(payload)
            toAdd.topic = toAdd.activity.topic || ""
            toAdd.title = toAdd.activity.title
            toAdd.id = uniqueId
            delete toAdd.callback
            delete toAdd.answers
            delete toAdd.callback
            return db
                .collection(ACTIVITIES_COLLECTION)
                .doc(payload.activityId)
                .collection(ACTIVITIES_ANSWER_COLLECTION)
                .doc(userId)
                .collection(ATTEMPTS_ANSWER_COLLECTION)
                .doc(uniqueId)
                .set(toAdd, MERGE_TRUE)
                .then(async () => {
                    try {
                        const attemptsArray: any[] = []
                        const attemptDataInit = await db.collection(ACTIVITIES_COLLECTION).doc(payload.activityId).collection(ACTIVITIES_ANSWER_COLLECTION).doc(userId).get()

                        if (attemptDataInit.exists) {
                            const attemptData = attemptDataInit.data()
                            const attemptsArray = attemptData?.attemptsArray || []
                            attemptsArray.push(uniqueId)
                            await db
                                .collection(ACTIVITIES_COLLECTION)
                                .doc(payload.activityId)
                                .collection(ACTIVITIES_ANSWER_COLLECTION)
                                .doc(userId)
                                .set(
                                    {
                                        attemptsArray,
                                        latestAttempt: uniqueId,
                                        canRetake: false,
                                        role: payload.role || "student",
                                        activityType: "Assignment",
                                        directScoring: payload.directScoring || false
                                    },
                                    MERGE_TRUE
                                )
                        } else {
                            attemptsArray.push(uniqueId)
                            await db
                                .collection(ACTIVITIES_COLLECTION)
                                .doc(payload.activityId)
                                .collection(ACTIVITIES_ANSWER_COLLECTION)
                                .doc(userId)
                                .set(
                                    {
                                        attemptsArray,
                                        latestAttempt: uniqueId,
                                        canRetake: false,
                                        role: payload.role || "student",
                                        activityType: "Assignment",
                                        directScoring: payload.directScoring || false
                                    },
                                    MERGE_FALSE
                                )
                        }
                        // eslint-disable-next-line no-empty
                    } catch (e) {}
                    return callback && callback("success")
                })
        }
    }

    async submitAssignmentV2(userId: string, payload: any, callback: any): Promise<any> {
        const files: any = []
        const answerRef = db.collection(ACTIVITIES_ANSWER_COLLECTION).doc()

        if (payload.files.length > 0) {
            const promises = payload.files.map(async (file) => {
                const fileUrl = await uploadToAWSS3(file.originFileObj, `company/tutorActivity/${this.uniqueID()}_${file.name}`)
                files.push(fileUrl)

                if (files.length === payload.files.length) {
                    payload.files = files
                    payload = firebaseAdd(payload)
                    return await answerRef
                        .set(payload, MERGE_FALSE)
                        .then(() => {
                            return "success"
                        })
                        .catch((err: { code: any; message: any }) => {
                            return err.message
                        })
                }
            })
            const results = await Promise.all(promises)
            if (results.indexOf("success") > -1) {
                return "success"
            } else {
                return "Error adding document"
            }
        } else {
            payload = firebaseAdd(payload)
            return await answerRef
                .set(payload, MERGE_FALSE)
                .then(() => {
                    return callback && callback("success")
                })
                .catch((err: { code: any; message: any }) => {
                    return err.message
                })
        }
    }

    async checkUserActivityDone(activityId: string, userId: string): Promise<any> {
        const docRef = db.collection(ACTIVITIES_COLLECTION).doc(activityId).collection(ACTIVITIES_ANSWER_COLLECTION).doc(userId)
        const doc = await docRef.get()
        const data = doc.data() || {}
        if (doc.exists && !data.canRetake) {
            return { status: "Done", canRetake: false }
        } else if (doc.exists && data.canRetake) {
            return { status: "Done", canRetake: true }
        } else if (!doc.exists) {
            return { status: "To Do", canRetake: false }
        }
    }

    async getActivityAnswer(activityId: string, userId: string): Promise<any> {
        const attemptRef = await db.collection(ACTIVITIES_COLLECTION).doc(activityId).collection(ACTIVITIES_ANSWER_COLLECTION).doc(userId).get()
        const snapshot = attemptRef.data()
        if (attemptRef.exists) {
            const latestAttempt = snapshot?.latestAttempt
            const canRetake = snapshot?.canRetake
            const answerRef = await db
                .collection(ACTIVITIES_COLLECTION)
                .doc(activityId)
                .collection(ACTIVITIES_ANSWER_COLLECTION)
                .doc(userId)
                .collection(ATTEMPTS_ANSWER_COLLECTION)
                .doc(latestAttempt)
                .get()
            const answers = { ...answerRef.data() }
            return { id: latestAttempt, canRetake, ...answers }
        } else {
            return false
        }
    }

    async getActivityAnswerV2(activityId: string, userId: string): Promise<any> {
        db.collection(ACTIVITIES_ANSWER_COLLECTION)
            .where("activityId", "==", activityId)
            .where("userId", "==", userId)
            .get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    return doc.data()
                })
            })
            .catch(function () {
                return false
            })
    }

    async saveScoreAssignment(ids: any, payload: any): Promise<any> {
        return db
            .collection(ACTIVITIES_COLLECTION)
            .doc(ids.activityId)
            .collection(ACTIVITIES_ANSWER_COLLECTION)
            .doc(ids.userId)
            .collection(ATTEMPTS_ANSWER_COLLECTION)
            .doc(ids.attemptId)
            .set(payload, { merge: true })
            .then(() => {
                return { success: true, answerId: ids.userId }
            })
            .catch((err: any) => {
                return { success: false, error: err }
            })
    }

    async saveScoreAssignmentV2(id: any, payload: any): Promise<any> {
        return db
            .collection(ACTIVITIES_ANSWER_COLLECTION)
            .doc(id)
            .set(payload, { merge: true })
            .then(() => {
                // return { success: true, answerId: ids.userId }
                return { success: true }
            })
            .catch((err: any) => {
                return { success: false, error: err }
            })
    }

    async saveScoreQuiz(ids: any, payload: any): Promise<any> {
        return db
            .collection(ACTIVITIES_COLLECTION)
            .doc(ids.activityId)
            .collection(ACTIVITIES_ANSWER_COLLECTION)
            .doc(ids.userId)
            .collection(ATTEMPTS_ANSWER_COLLECTION)
            .doc(ids.attemptId)
            .set(payload, { merge: true })
            .then(() => {
                return { success: true, answerId: ids.userId }
            })
            .catch((err: any) => {
                return { success: false, error: err }
            })
    }

    async transferGradeStatus(activityId: string, payload: any): Promise<any> {
        payload = firebaseUpdate(payload)
        return db
            .collection(ACTIVITIES_COLLECTION)
            .doc(activityId)
            .set(payload, { merge: true })
            .then(() => {
                return { success: true }
            })
            .catch((err: any) => {
                return { success: false, error: err }
            })
    }
}
