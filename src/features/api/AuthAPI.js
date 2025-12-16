import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const API_BASE_URL = import.meta.env.VITE_API_URL; // Consistent with API
export const AuthApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_BASE_URL}/api/auth/`,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: 'login',
                method: 'POST',
                body: credentials,
            }),
        }),
        register: builder.mutation({
            query: (userData) => ({
                url: 'register',
                method: 'POST',
                body: userData,
            }),
        }),
        forgotPassword: builder.mutation({
            query: (emailData) => ({
                url: 'forgot-password',
                method: 'POST',
                body: emailData,
            }),
        }),
        verifyOTP: builder.mutation({
            query: (otpData) => ({
                url: 'verify-otp',
                method: 'POST',
                body: otpData,
            }),
        }),
        resetPassword: builder.mutation({
            query: (resetData) => ({
                url: 'reset-password',
                method: 'POST',
                body: resetData,
            }),
        }),
    }),
});
export const { useLoginMutation, useRegisterMutation, useForgotPasswordMutation, useVerifyOTPMutation, useResetPasswordMutation } = AuthApi;
