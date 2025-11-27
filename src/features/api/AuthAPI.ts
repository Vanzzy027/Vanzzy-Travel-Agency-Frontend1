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

export const AuthApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000/api/auth/',
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
  }),
});

export const { useLoginMutation, useRegisterMutation } = AuthApi;


















// // features/api/AuthAPI.ts
// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// //import { mockAuthAPI } from './mockAuthAPI';

// interface LoginRequest {
//   email: string;
//   password: string;
// }

// interface UserInfo {
//   user_id: string;
//   first_name: string;
//   last_name: string;
//   email: string;
//   role: string;
//   status: string;
//   verified: boolean;
//   national_id: string;
//   contact_phone: string;
// }

// interface LoginResponse {
//   token: string;
//   userInfo: UserInfo;
// }

// // Check if we're in development mode and should use mock API
// const useMockAPI = import.meta.env.MODE === 'development';

// export const AuthApi = createApi({
//   reducerPath: 'authApi',
//   baseQuery: fetchBaseQuery({
//     baseUrl: useMockAPI ? '' : '/api/auth', // Empty baseUrl for mock, real URL for production
//     prepareHeaders: (headers) => {
//       headers.set('Content-Type', 'application/json');
//       return headers;
//     },
//   }),
//   endpoints: (builder) => ({
//     login: builder.mutation<LoginResponse, LoginRequest>({
//       query: (credentials) => {
//         // If using mock API, we'll handle it differently
//         if (useMockAPI) {
//           // This will be handled by the mock function
//           return {
//             url: '', // Empty URL for mock
//             method: 'POST',
//             body: credentials,
//           };
//         }
        
//         // Real API call
//         return {
//           url: 'login',
//           method: 'POST',
//           body: credentials,
//         };
//       },
//       // // Transform the response for mock API
//       // transformResponse: (response: LoginResponse, meta, arg) => {
//       //   if (useMockAPI) {
//       //     // For mock API, we need to simulate the response
//       //     return mockAuthAPI.login(arg)
//       //       .then(mockResponse => mockResponse)
//       //       .catch(error => { throw error; });
//       //   }
//       //   return response;
//       // },
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

// // import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// // interface LoginRequest {
// //   email: string;
// //   password: string;
// // }

// // interface User{
// // user_id: number;
// // first_name: string;
// // last_name: string;
// // email: string;
// // phone_number: number;
// // user_type: string;



// // }


// // interface LoginResponse {
// //   token: string;
// //   userInfo: User; 
// // }

// // interface RegisterRequest {
// //   first_name: string;
// //   last_name: string;
// //   email: string;
// //   phone_number: string;  
// //   password: string;
// // }

// // interface RegisterResponse {
// //   message: string;
// // }

// // export const AuthApi = createApi({
// //   reducerPath: 'authApi',
// //   baseQuery: fetchBaseQuery({ 
// //     baseUrl: 'http://localhost:3000/api',  
// //     prepareHeaders: (headers, { getState }) => {
// //       const token = (getState() as any).authSlice?.token;
// //       if (token) {
// //         headers.set('Authorization', `Bearer ${token}`);
// //       }
// //       return headers;
// //     },
// //   }),
// //   endpoints: (builder) => ({
// //     login: builder.mutation<LoginResponse, LoginRequest>({
// //       query: (credentials) => ({
// //         url: '/auth/login',  
// //         method: 'POST',
// //         body: credentials,
// //       }),
// //     }),
// //     register: builder.mutation<RegisterResponse, RegisterRequest>({
// //       query: (userInfo) => ({
// //         url: '/auth/register', 
// //         method: 'POST',
// //         body: userInfo,
// //       }),
// //     }),
// //   }),
// // });

// // export const { useLoginMutation, useRegisterMutation } = AuthApi;