import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice"
import notificationReducer from "./notificationSlice";
import attendanceReducer from "./attendanceSlice"

export default configureStore({
    reducer:{
        auth: authReducer,
        notifications: notificationReducer,
        attendance:attendanceReducer
    },
});