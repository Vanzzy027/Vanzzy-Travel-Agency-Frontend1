import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const API_BASE_URL = import.meta.env.VITE_API_URL; // Consistent with API
export const UserApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_BASE_URL}/api/users`, // Check your port
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token)
                headers.set('authorization', `Bearer ${token}`);
            return headers;
        },
    }),
    tagTypes: ['User'],
    endpoints: (builder) => ({
        // Get current user's profile
        getProfile: builder.query({
            query: () => '/profile',
            transformResponse: (response) => {
                console.log("🚀 PROFILE API RESPONSE:", response);
                // Handle different response formats
                if (response?.data)
                    return response.data;
                return response;
            },
            providesTags: ['User'],
        }),
        // Update current user's profile
        updateProfile: builder.mutation({
            query: (updates) => ({
                url: '/profile/update',
                method: 'PUT',
                body: updates,
            }),
            invalidatesTags: ['User'],
        }),
        // Get user by ID (admin only)
        getUserById: builder.query({
            query: (id) => `/${id}`,
            transformResponse: (response) => {
                if (response?.data)
                    return response.data;
                return response;
            },
        }),
        // READ all users (admin only)
        getAllUsers: builder.query({
            query: () => '/all',
            transformResponse: (response) => {
                console.log("🚀 RAW API RESPONSE:", response);
                if (response?.data && Array.isArray(response.data)) {
                    return response.data;
                }
                if (Array.isArray(response)) {
                    return response;
                }
                if (response?.users && Array.isArray(response.users)) {
                    return response.users;
                }
                return [];
            },
            providesTags: ['User'],
        }),
        // UPDATE user by ID (admin only)
        updateUser: builder.mutation({
            query: ({ id, updates }) => ({
                url: `/${id}`,
                method: 'PUT',
                body: updates,
            }),
            invalidatesTags: ['User'],
        }),
        // DELETE user (admin only)
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['User'],
        }),
        // Change user role (super admin only)
        changeUserRole: builder.mutation({
            query: ({ id, role }) => ({
                url: `/${id}/role`,
                method: 'PATCH',
                body: { role },
            }),
            invalidatesTags: ['User'],
        }),
    }),
});
export const { useGetProfileQuery, useUpdateProfileMutation, useGetUserByIdQuery, useGetAllUsersQuery, useUpdateUserMutation, useDeleteUserMutation, useChangeUserRoleMutation, } = UserApi;
