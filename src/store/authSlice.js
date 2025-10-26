import { createSlice } from "@reduxjs/toolkit";

const storedToken = localStorage.getItem("token");
const storedEmail = localStorage.getItem("email");
const storedUid = localStorage.getItem("uid");

const initialAuthState = {
  token: storedToken || null,
  email: storedEmail || null,
  uid: storedUid || null,
  isLoggedIn: !!storedToken,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    login(state, action) {
      state.token = action.payload.token;
      state.email = action.payload.email;
      state.uid = action.payload.uid;
      state.isLoggedIn = true;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("email", action.payload.email);
      localStorage.setItem("uid", action.payload.uid);
    },
    logout(state) {
      state.token = null;
      state.email = null;
      state.uid = null;
      state.isLoggedIn = false;
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      localStorage.removeItem("uid");
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
