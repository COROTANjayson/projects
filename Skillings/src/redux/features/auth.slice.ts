import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AuthRepositoryImpl from "@/RepoImplementation/Auth/AuthRepositoryImpl";
import type { RootState } from "../store";
import AuthServiceImpl from "@/domain/usecases/AuthService";
import {
    UserType,
    AuthTypes,
    RegisterTypes,
    UpdateProfile,
} from "@/domain/entities/Auth";

export type AuthInitType = {
    loading: boolean;
    user: UserType;
    isAuth: boolean;
};

const resetAuth = {
    uid: "",
    email: "",
    firstName: "",
    lastName: "",
    isDisabled: false,
    country: "",
    partnerCode: "",
    role: "",
    phoneNumber: "",
    photoURL: "",
    about: "",
    courses: [],
    currency: "",
    files: [],
    folders: [],
    isSuperAdmin: false,
    emailVerified: false,
    allowNotifications: false,
    company: "",
    introVideo: "",
    workExperienceType: "",
    workExperienceLevel: [],
    workExperienceDesc: "",
};

// Define the initial state using that type
const initialState: AuthInitType = {
    loading: false,
    user: {
        uid: "",
        email: "",
        firstName: "",
        lastName: "",
        isDisabled: false,
        country: "",
        partnerCode: "",
        role: "",
        phoneNumber: "",
        photoURL: "",
        about: "",
        courses: [],
        currency: "",
        files: [],
        folders: [],
        isSuperAdmin: false,
        emailVerified: false,
        allowNotifications: false,
        company: "",
        introVideo: "",
        workExperienceType: "",
        workExperienceLevel: [],
        workExperienceDesc: "",
    },
    isAuth: false,
};

export const logoutUser = createAsyncThunk("authSlice/logoutUser", async () => {
    const authRepo = new AuthRepositoryImpl();
    const authService = new AuthServiceImpl(authRepo);
    const auths = await authService.LogoutUser();
    return auths;
});

export const loginUser = createAsyncThunk(
    "authSlice/loginUser",
    async (payload: AuthTypes) => {
        const authRepo = new AuthRepositoryImpl();
        const authService = new AuthServiceImpl(authRepo);
        const auths = await authService.LoginUser(payload);
        return auths;
    }
);

export const register = createAsyncThunk(
    "authSlice/register",
    async (payload: RegisterTypes) => {
        const authRepo = new AuthRepositoryImpl();
        const authService = new AuthServiceImpl(authRepo);
        const auths = await authService.Register(payload);
        return auths;
    }
);

export const updateProfile = createAsyncThunk(
    "authSlice/updateProfile",
    async (payload: UpdateProfile) => {
        const authRepo = new AuthRepositoryImpl();
        const authService = new AuthServiceImpl(authRepo);
        const auths = await authService.UpdateProfile(payload);
        return auths;
    }
);

export const authSlice = createSlice({
    name: "authSlice",
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // LOGOUT
        builder.addCase(logoutUser.fulfilled, (state) => ({
            ...state,
            user: resetAuth,
            loading: false,
            isAuth: false,
        }));
        builder.addCase(logoutUser.pending, (state) => ({
            ...state,
            loading: true,
        }));
        builder.addCase(logoutUser.rejected, (state) => ({
            ...state,
            loading: false,
        }));
        // LOGIN
        builder.addCase(loginUser.fulfilled, (state, action) => {
            if (action.payload.success) {
                return {
                    ...state,
                    user: action.payload.datas,
                    loading: false,
                };
            } else {
                return {
                    ...state,
                    loading: false,
                };
            }
        });
        builder.addCase(loginUser.pending, (state) => ({
            ...state,
            loading: true,
        }));
        builder.addCase(loginUser.rejected, (state) => ({
            ...state,
            loading: false,
        }));
        // REGISTER
        builder.addCase(register.fulfilled, (state, action) => {
            if (action.payload.success) {
                return {
                    ...state,
                    user: action.payload.datas,
                    loading: false,
                    isAuth: true,
                };
            } else {
                return {
                    ...state,
                    loading: false,
                };
            }
        });
        builder.addCase(register.pending, (state) => ({
            ...state,
            loading: true,
        }));
        builder.addCase(register.rejected, (state) => ({
            ...state,
            loading: false,
        }));
        // UPDATE PROFILE
        builder.addCase(updateProfile.fulfilled, (state, action) => {
            if (action.payload.success) {
                return {
                    ...state,
                    user: { ...state.user, ...action.payload.datas },
                    loading: false,
                    isAuth: true,
                };
            } else {
                return {
                    ...state,
                    loading: false,
                };
            }
        });
        builder.addCase(updateProfile.pending, (state) => ({
            ...state,
            loading: true,
        }));
        builder.addCase(updateProfile.rejected, (state) => ({
            ...state,
            loading: false,
        }));
    },
});

// Other code such as selectors can use the imported `RootState` type
export const auth = (state: RootState) => state.auth;

export default authSlice.reducer;
