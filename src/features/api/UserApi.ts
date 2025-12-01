import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


export interface User {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  contact_phone: string;
  address?: string;
  role: 'user' | 'admin' | 'superAdmin';
  status: 'active' | 'inactive' | 'banned';
  verified: boolean;
  national_id: string;
  photo?: string;
  created_at: string;
}

export const UserApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000/api/users',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    
    // --- USER ENDPOINTS ---

    // Get logged in user details
    getMyProfile: builder.query<User, void>({
      query: () => '/profile', // Matches Hono: userRoutes.get('/profile')
      providesTags: ['User'],
      transformResponse: (response: any) => response.data || response,
    }),

    // Update own profile
    updateProfile: builder.mutation<User, Partial<User>>({
      query: (data) => ({
        url: '/profile/update', // Matches Hono: userRoutes.put('/profile/update')
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    // --- ADMIN ENDPOINTS ---

    // Get ALL users (for CustomerManagement)
getAllUsers: builder.query<User[], void>({
    query: () => '/all', 
transformResponse: (response: any): User[] => {
        // Guarantees an array is returned for providesTags
        const data = response?.data || response;
        return Array.isArray(data) ? data : [];
   
    },
    providesTags: (result) =>
        // 💡 FIX: Check if result is truthy AND if it is an array
        Array.isArray(result) && result.length > 0
            ? [
                ...result.map(({ user_id }) => ({ type: 'User' as const, id: user_id })),
                { type: 'User', id: 'LIST' },
            ]
            : [{ type: 'User', id: 'LIST' }],
}),

    // Get specific user by ID
    getUserById: builder.query<User, string>({
      query: (id) => `/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'User', id }],
    }),

    // Update User (Used for Soft Delete/Ban/Verify)
    // Matches Hono: userRoutes.put('/:id')
    updateUser: builder.mutation<User, { id: string; updates: Partial<User> }>({
      query: ({ id, updates }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: updates,
      }),
      // Invalidates the specific user AND the list so the table updates
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' },
      ],
    }),

    // Hard Delete User (Optional, if you decide to use it later)
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),
  }),
});

export const { 
  useGetMyProfileQuery, 
  useUpdateProfileMutation,
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation
} = UserApi;



// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// export const UserApi = createApi({
//   reducerPath: 'userApi',
//   baseQuery: fetchBaseQuery({
//     baseUrl: 'http://localhost:3000/api/users', // Adjust based on your backend route
//     prepareHeaders: (headers) => {
//       const token = localStorage.getItem('token');
//       if (token) {
//         headers.set('authorization', `Bearer ${token}`);
//       }
//       return headers;
//     },
//   }),
//   tagTypes: ['User'],
//   endpoints: (builder) => ({
//     // Get logged in user details
//     getMyProfile: builder.query({
//       query: () => '/me', // Or whatever your backend endpoint is for current user
//       providesTags: ['User'],
//     }),
//     // Update profile
//     updateProfile: builder.mutation({
//       query: (data) => ({
//         url: '/profile',
//         method: 'PUT',
//         body: data,
//       }),
//       invalidatesTags: ['User'],
//     }),
//   }),
// });

// export const { useGetMyProfileQuery, useUpdateProfileMutation } = UserApi;