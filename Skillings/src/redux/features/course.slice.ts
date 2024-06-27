import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { CourseTypes } from "@/domain/entities/Course";
import CourseRepositoryImpl from "@/RepoImplementation/CourseRepositoryImpl";
import CourseServiceImpl from "@/domain/usecases/CourseService";
// Define a type for the slice state
interface CourseState {
    loading: boolean;
    courseList: Array<CourseTypes>;
}

// Define the initial state using that type
const initialState: CourseState = {
    loading: false,
    courseList: [],
};

export const createCourse = createAsyncThunk(
    "courseSlice/createCourse",
    async (payload: CourseTypes) => {
        const courseRepo = new CourseRepositoryImpl();
        const courseService = new CourseServiceImpl(courseRepo);
        const courses = await courseService.CreateCourse(payload);
        return courses;
    }
);

export const getCourses = createAsyncThunk(
    "courseSlice/getCourses",
    async () => {
        const courseRepo = new CourseRepositoryImpl();
        const courseService = new CourseServiceImpl(courseRepo);
        const courses = await courseService.GetCourses();
        return courses;
    }
);
export const courseSlice = createSlice({
    name: "courseSlice",
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // ADD COURSE
        builder.addCase(createCourse.fulfilled, (state, action) => ({
            ...state,
            courseList: [...state.courseList, { ...action.payload.datas }],
            loading: false,
        }));
        builder.addCase(createCourse.pending, (state) => ({
            ...state,
            loading: true,
        }));
        builder.addCase(createCourse.rejected, (state) => ({
            ...state,
            loading: false,
        }));
        // GET COURSES
        builder.addCase(getCourses.fulfilled, (state, action) => ({
            ...state,
            courseList: action.payload.datas,
            loading: false,
        }));
        builder.addCase(getCourses.pending, (state) => ({
            ...state,
            loading: true,
        }));
        builder.addCase(getCourses.rejected, (state) => ({
            ...state,
            loading: false,
        }));
    },
});

// Other code such as selectors can use the imported `RootState` type
export const courses = (state: RootState) => state.courses;

export default courseSlice.reducer;
