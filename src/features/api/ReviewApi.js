import { createApi } from "@reduxjs/toolkit/query/react";
// 🚨 Import your global base query! (Adjust path to where it lives)
import { baseQueryWithReauth } from "./baseQuery";
export const reviewApi = createApi({
    reducerPath: "reviewApi",
    // 🚨 USE YOUR CUSTOM BASE QUERY HERE!
    // This automatically adds the auth token AND handles 401 session expirations!
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Reviews", "EligibleBookings"],
    endpoints: (builder) => ({
        getEligibleBookings: builder.query({
            // 👈 Added 'reviews/' prefix
            query: (userId) => `reviews/eligible/${userId}`,
            providesTags: ["EligibleBookings"],
        }),
        getUserReviews: builder.query({
            // 👈 Added 'reviews/' prefix
            query: (userId) => `reviews/user/${userId}`,
            providesTags: ["Reviews"],
        }),
        createReview: builder.mutation({
            query: (body) => ({
                // 👈 Changed from '' to 'reviews' to hit /api/reviews
                url: "reviews",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Reviews", "EligibleBookings"],
        }),
        // --- Admin Endpoints ---
        getAllReviews: builder.query({
            // 👈 Added 'reviews/' prefix
            query: () => "reviews/admin/all",
            providesTags: ["Reviews"],
        }),
        updateReviewStatus: builder.mutation({
            query: ({ id, ...body }) => ({
                // 👈 Added 'reviews/' prefix
                url: `reviews/admin/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Reviews"],
        }),
    }),
});
export const { useGetEligibleBookingsQuery, useGetUserReviewsQuery, useCreateReviewMutation, useGetAllReviewsQuery, useUpdateReviewStatusMutation, } = reviewApi;
// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// const API_BASE_URL = import.meta.env.VITE_API_URL; // Consistent with API
// export const reviewApi = createApi({
//   reducerPath: 'reviewApi',
//   baseQuery: fetchBaseQuery({ baseUrl: `${API_BASE_URL}/api/reviews`}),
//   tagTypes: ['Reviews', 'EligibleBookings'],
//   endpoints: (builder) => ({
//     getEligibleBookings: builder.query<any[], string>({
//       query: (userId) => `/eligible/${userId}`,
//       providesTags: ['EligibleBookings'],
//     }),
//     getUserReviews: builder.query<any[], string>({
//       query: (userId) => `/user/${userId}`,
//       providesTags: ['Reviews'],
//     }),
//     createReview: builder.mutation({
//       query: (body) => ({
//         url: '',
//         method: 'POST',
//         body,
//       }),
//       invalidatesTags: ['Reviews', 'EligibleBookings'],
//     }),
//     // Admin
//     getAllReviews: builder.query<any[], void>({
//       query: () => '/admin/all',
//       providesTags: ['Reviews'],
//     }),
//     updateReviewStatus: builder.mutation({
//       query: ({ id, ...body }) => ({
//         url: `/admin/${id}`,
//         method: 'PUT',
//         body,
//       }),
//       invalidatesTags: ['Reviews'],
//     }),
//   }),
// });
// export const {
//     useGetEligibleBookingsQuery, useGetUserReviewsQuery, useCreateReviewMutation,
//     useGetAllReviewsQuery, useUpdateReviewStatusMutation
// } = reviewApi;
