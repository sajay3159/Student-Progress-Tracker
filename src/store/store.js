import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import studentsReducer from "./studentsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    students: studentsReducer,
  },
});
