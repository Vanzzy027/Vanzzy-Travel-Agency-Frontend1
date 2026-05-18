import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";
export const AuthApi = createApi({
    reducerPath: "authApi",
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: "auth/login", // 👈 Added auth/
                method: "POST",
                body: credentials,
            }),
        }),
        register: builder.mutation({
            query: (userData) => ({
                url: "auth/register", // 👈 Added auth/
                method: "POST",
                body: userData,
            }),
        }),
        forgotPassword: builder.mutation({
            query: (emailData) => ({
                url: "auth/forgot-password", // 👈 Added auth/
                method: "POST",
                body: emailData,
            }),
        }),
        verifyOTP: builder.mutation({
            query: (otpData) => ({
                url: "auth/verify-otp", // 👈 Added auth/
                method: "POST",
                body: otpData,
            }),
        }),
        resetPassword: builder.mutation({
            query: (resetData) => ({
                url: "auth/reset-password", // 👈 Added auth/
                method: "POST",
                body: resetData,
            }),
        }),
    }),
});
export const { useLoginMutation, useRegisterMutation, useForgotPasswordMutation, useVerifyOTPMutation, useResetPasswordMutation, } = AuthApi;
