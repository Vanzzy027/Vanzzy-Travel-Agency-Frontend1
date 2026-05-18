import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";
export const UserApi = createApi({
    reducerPath: "userApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["User"],
    endpoints: (builder) => ({
        // Get current user's profile
        getProfile: builder.query({
            query: () => "users/profile", // Removed leading slash
            transformResponse: (response) => {
                if (response?.data)
                    return response.data;
                return response;
            },
            //  Give profile a specific ID so admin actions don't wipe it out
            providesTags: [{ type: "User", id: "PROFILE" }],
        }),
        // Update current user's profile
        updateProfile: builder.mutation({
            query: (updates) => ({
                url: "users/profile/update",
                method: "PUT",
                body: updates,
            }),
            //  Only invalidate the profile, not the admin's user list
            invalidatesTags: [{ type: "User", id: "PROFILE" }],
        }),
        // Get user by ID (admin only)
        getUserById: builder.query({
            query: (id) => `users/${id}`,
            transformResponse: (response) => {
                if (response?.data)
                    return response.data;
                return response;
            },
            providesTags: (_result, _error, id) => [{ type: "User", id }],
        }),
        // READ all users (admin only)
        getAllUsers: builder.query({
            query: () => "users/all",
            transformResponse: (response) => {
                if (response?.data && Array.isArray(response.data))
                    return response.data;
                if (Array.isArray(response))
                    return response;
                if (response?.users && Array.isArray(response.users))
                    return response.users;
                return [];
            },
            //  Map over the array to cache each user individually
            providesTags: (result) => result
                ? [
                    // Note: Assuming your user ID field is user_id based on your Auth context.
                    // If it's just 'id', change user_id to id below!
                    ...result.map((user) => ({
                        type: "User",
                        id: user.user_id || user.id,
                    })),
                    { type: "User", id: "LIST" },
                ]
                : [{ type: "User", id: "LIST" }],
        }),
        // UPDATE user by ID (admin only)
        updateUser: builder.mutation({
            query: ({ id, updates }) => ({
                url: `users/${id}`,
                method: "PUT",
                body: updates,
            }),
            //  Only refresh the exact user that was updated
            invalidatesTags: (_result, _error, { id }) => [{ type: "User", id }],
        }),
        // DELETE user (admin only)
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `users/${id}`,
                method: "DELETE",
            }),
            //  Invalidate the list so the user disappears from the table
            invalidatesTags: (_result, _error, id) => [
                { type: "User", id },
                { type: "User", id: "LIST" },
            ],
        }),
        // Change user role (super admin only)
        changeUserRole: builder.mutation({
            query: ({ id, role }) => ({
                url: `users/${id}/role`,
                method: "PATCH",
                body: { role },
            }),
            //  Only refresh the exact user whose role changed
            invalidatesTags: (_result, _error, { id }) => [{ type: "User", id }],
        }),
    }),
});
export const { useGetProfileQuery, useUpdateProfileMutation, useGetUserByIdQuery, useGetAllUsersQuery, useUpdateUserMutation, useDeleteUserMutation, useChangeUserRoleMutation, } = UserApi;
