import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    token: localStorage.getItem("token"),
    user: JSON.parse(localStorage.getItem("user") || "null"),
    isAuthenticated: !!localStorage.getItem("token"),
};
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.token = action.payload.token;
            state.user = action.payload.user;
            state.isAuthenticated = true;
            // Store in localStorage
            localStorage.setItem("token", action.payload.token);
            localStorage.setItem("user", JSON.stringify(action.payload.user));
        },
        logout: (state) => {
            state.token = null;
            state.user = null;
            state.isAuthenticated = false;
            // Clear localStorage
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        },
        updateUser: (state, action) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
                localStorage.setItem("user", JSON.stringify(state.user));
            }
        },
    },
});
export const { setCredentials, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
