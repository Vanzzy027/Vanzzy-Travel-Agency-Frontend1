import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { User } from '../../types/types'; // Adjust path as needed


const API_BASE_URL = import.meta.env.VITE_API_URL; // Consistent with API

export const UserApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/api/users`, // Check your port
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    
    // Get current user's profile
    getProfile: builder.query<User, void>({
      query: () => '/profile',
      transformResponse: (response: any) => {
        console.log("🚀 PROFILE API RESPONSE:", response);
        
        // Handle different response formats
        if (response?.data) return response.data;
        return response;
      },
      providesTags: ['User'],
    }),

    // Update current user's profile
    updateProfile: builder.mutation<User, Partial<User>>({
      query: (updates) => ({
        url: '/profile/update',
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: ['User'],
    }),

    // Get user by ID (admin only)
    getUserById: builder.query<User, string>({
      query: (id) => `/${id}`,
      transformResponse: (response: any) => {
        if (response?.data) return response.data;
        return response;
      },
    }),

    // READ all users (admin only)
    getAllUsers: builder.query<User[], void>({
      query: () => '/all',
      transformResponse: (response: any) => {
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
    updateUser: builder.mutation<void, { id: string; updates: Partial<User> }>({
      query: ({ id, updates }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: ['User'],
    }),

    // DELETE user (admin only)
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),

    // Change user role (super admin only)
    changeUserRole: builder.mutation<void, { id: string; role: string }>({
      query: ({ id, role }) => ({
        url: `/${id}/role`,
        method: 'PATCH',
        body: { role },
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const { 
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetUserByIdQuery,
  useGetAllUsersQuery, 
  useUpdateUserMutation, 
  useDeleteUserMutation,
  useChangeUserRoleMutation,
} = UserApi;
