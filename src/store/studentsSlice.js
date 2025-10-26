import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchStudents, addStudent, deleteStudent } from "../api/firebaseDB";

export const getStudents = createAsyncThunk(
  "students/getStudents",
  async () => {
    return await fetchStudents();
  }
);

export const createStudent = createAsyncThunk(
  "students/createStudent",
  async (student) => {
    await addStudent(student);
    return await fetchStudents();
  }
);

export const removeStudent = createAsyncThunk(
  "students/removeStudent",
  async (id) => {
    await deleteStudent(id);
    return id;
  }
);

const studentsSlice = createSlice({
  name: "students",
  initialState: {
    list: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getStudents.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getStudents.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(getStudents.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createStudent.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(removeStudent.fulfilled, (state, action) => {
        state.list = state.list.filter(
          (student) => student.id !== action.payload
        );
      });
  },
});

export default studentsSlice.reducer;
