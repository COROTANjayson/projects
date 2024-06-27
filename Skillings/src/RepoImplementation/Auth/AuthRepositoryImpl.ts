import { auth, db } from "@/firebase/firebase";
import {
    AuthTypes,
    RegisterTypes,
    RespTypes,
    UserType,
} from "@/domain/entities/Auth";
import AuthRepository from "@/domain/repositories/AuthRepository";
import moment from "moment";
import { setAuthCookie } from "@/redux/cookies";
import { deleteCookie } from "cookies-next";

export default class AuthRepositoryImpl implements AuthRepository {
    async LogoutUser(): Promise<RespTypes> {
        return await auth
            .signOut()
            .then(() => {
                deleteCookie("cookie_token");
                return {
                    success: true,
                    message: "Logout Success",
                };
            })
            .catch((error) => {
                if (error instanceof Error) {
                    return {
                        success: false,
                        message: "Logout Failed",
                        errorMessage: {
                            message: error.message,
                            stack: error.stack,
                            name: error.name,
                            cause: error.cause,
                        },
                    };
                }
                return {
                    success: false,
                    message: "Logout Failed",
                    errorMessage: error,
                };
            });
    }
    async LoginUser(payload: AuthTypes): Promise<RespTypes> {
        return await auth
            .signInWithEmailAndPassword(payload.email, payload.password)
            .then(async (response) => {
                const tokenRef = await response.user?.getIdTokenResult();

                const userRef = await db
                    .collection("skillings_users")
                    .doc(response.user?.uid)
                    .get();

                // @ts-ignore
                setAuthCookie(tokenRef?.token, "cookie_token");

                return {
                    success: true,
                    message: "Login Success",
                    datas: { ...userRef.data() },
                };
            })
            .catch((error) => {
                if (error instanceof Error) {
                    return {
                        success: false,
                        message: error.message,
                        datas: null,
                        errorMessage: {
                            message: error.message,
                            stack: error.stack,
                            name: error.name,
                            cause: error.cause,
                        },
                    };
                }
                return {
                    success: false,
                    message: "Login Failed",
                    datas: null,
                    errorMessage: error,
                };
            });
    }

    async Register(payload: RegisterTypes): Promise<RespTypes> {
        try {
            return await auth
                .createUserWithEmailAndPassword(payload.email, payload.password)
                .then(async (response) => {
                    const user = response.user;
                    if (user?.uid) {
                        const payloadRefs = {
                            email: payload.email,
                            firstName: payload.firstName,
                            lastName: payload.lastName,
                            role: "student",
                            company: "indo",
                            uid: user?.uid,
                            teacherAccepted: false,
                            isDeclined: false,
                            currency: "IDR",
                            loginType: "credential",
                            owner: user?.email,
                            creation: moment().unix(),
                            modified: moment().unix(),
                            modifiedBy: user?.email,
                            isDeleted: false,
                        };

                        db.collection("skillings_users")
                            .doc(user?.uid)
                            .set(payloadRefs, { merge: true });

                        const tokenRef = await user?.getIdTokenResult();

                        // @ts-ignore
                        setAuthCookie(tokenRef?.token, "cookie_token");

                        return {
                            success: true,
                            message: "Register Success",
                            datas: payloadRefs,
                        };
                    }

                    return {
                        success: false,
                        message: "Register Failed",
                        datas: null,
                    };
                })
                .catch((error) => {
                    if (error instanceof Error) {
                        if (
                            error.message.includes("auth/email-already-in-use")
                        ) {
                            return {
                                success: false,
                                message:
                                    "Email already in use. Please use another email.",
                                datas: null,
                                errorMessage: {
                                    message: error.message,
                                    stack: error.stack,
                                    name: error.name,
                                    cause: error.cause,
                                },
                            };
                        }
                        return {
                            success: false,
                            message: "Register Failed",
                            datas: null,
                            errorMessage: {
                                message: error.message,
                                stack: error.stack,
                                name: error.name,
                                cause: error.cause,
                            },
                        };
                    }
                    return {
                        success: false,
                        message: "Register Failed",
                        datas: null,
                        errorMessage: error,
                    };
                });
        } catch (error) {
            if (error instanceof Error) {
                return {
                    success: false,
                    message: "Register Failed",
                    datas: null,
                    errorMessage: {
                        message: error.message,
                        stack: error.stack,
                        name: error.name,
                        cause: error.cause,
                    },
                };
            }

            return {
                success: false,
                message: "Register Failed",
                datas: null,
                errorMessage: error,
            };
        }
    }

    async UpdateProfile(payload: UserType): Promise<RespTypes> {
        console.log("RepoImpl UpdateProfile", payload);

        try {
            const currUserUid = await auth.currentUser?.uid;
            console.log("currUserUid", currUserUid);

            await db.collection("skillings_users").doc(currUserUid).set(
                {
                    about: payload.about,
                    introVideo: payload.introVideo,
                    workExperienceType: payload.workExperienceType,
                    workExperienceLevel: payload.workExperienceLevel,
                    workExperienceDesc: payload.workExperienceDesc,
                    modified: moment().unix(),
                },
                { merge: true }
            );

            return {
                success: true,
                message: "Update Profile Success",
                datas: payload,
            };
        } catch (error) {
            if (error instanceof Error) {
                return {
                    success: false,
                    message: "Update Profile Failed",
                    errorMessage: {
                        message: error.message,
                        stack: error.stack,
                        name: error.name,
                        cause: error.cause,
                    },
                };
            }
            return {
                success: false,
                message: "Update Profile Failed",
                errorMessage: error,
            };
        }
    }
}
