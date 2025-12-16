import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    status: string;
    verified: boolean;
    national_id: string;
    contact_phone: string;
  };
}

interface ForgotPasswordRequest {
  email: string;
}

interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

interface VerifyOTPRequest {
  email: string;
  otp: string;
}

interface VerifyOTPResponse {
  success: boolean;
  message: string;
}

interface ResetPasswordRequest {
  email: string;
  otp: string;
  new_password: string;
  //new_password: string;
}

interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export const AuthApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://vanske-car-rental.azurewebsites.net/api/auth/',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');  
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
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
    forgotPassword: builder.mutation<ForgotPasswordResponse, ForgotPasswordRequest>({
      query: (emailData) => ({
        url: 'forgot-password',
        method: 'POST',
        body: emailData,
      }),
    }),
    verifyOTP: builder.mutation<VerifyOTPResponse, VerifyOTPRequest>({
      query: (otpData) => ({
        url: 'verify-otp',
        method: 'POST',
        body: otpData,
      }),
    }),
    resetPassword: builder.mutation<ResetPasswordResponse, ResetPasswordRequest>({
      query: (resetData) => ({
        url: 'reset-password',
        method: 'POST',
        body: resetData,
      }),
    }),
  }),
});

export const { 
  useLoginMutation, 
  useRegisterMutation,
  useForgotPasswordMutation,
  useVerifyOTPMutation,
  useResetPasswordMutation
} = AuthApi;




// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// interface LoginRequest {
//   email: string;
//   password: string;
// }

// interface LoginResponse {
//   token: string;
//   user: {
//     user_id: string;
//     first_name: string;
//     last_name: string;
//     email: string;
//     role: string;
//     status: string;
//     verified: boolean;
//     national_id: string;
//     contact_phone: string;
//   };
// }

// export const AuthApi = createApi({
//   reducerPath: 'authApi',
//   baseQuery: fetchBaseQuery({
//     baseUrl: 'http://localhost:3000/api/auth/',
// prepareHeaders: (headers) => {
//   const token = localStorage.getItem('token');  
//   if (token) {
//     headers.set('authorization', `Bearer ${token}`);
//   }
//   return headers;
// },
//   }),
//   endpoints: (builder) => ({
//     login: builder.mutation<LoginResponse, LoginRequest>({
//       query: (credentials) => ({
//         url: 'login',
//         method: 'POST',
//         body: credentials,
//       }),
//     }),
//     register: builder.mutation({
//       query: (userData) => ({
//         url: 'register',
//         method: 'POST',
//         body: userData,
//       }),
//     }),
//   }),
// });

// export const { useLoginMutation, useRegisterMutation } = AuthApi;









