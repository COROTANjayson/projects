import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "./storage";
import { configureStore } from "@reduxjs/toolkit";
import plantSlice from "./features/plant.slice";
import authSlice from "./features/auth.slice";
import courseSlice from "./features/course.slice";

const reducers = combineReducers({
    plantSlice,
    auth: authSlice,
    courses: courseSlice,
});

const persistConfig = {
    key: "root",
    storage,
    blacklist: [],
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const makeStore = () => {
    return configureStore({
        reducer: persistedReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({ serializableCheck: false }),
    });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
