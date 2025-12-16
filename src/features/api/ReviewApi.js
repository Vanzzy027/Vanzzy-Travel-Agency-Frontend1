import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const API_BASE_URL = import.meta.env.VITE_API_URL; // Consistent with API
export const reviewApi = createApi({
    reducerPath: 'reviewApi',
    baseQuery: fetchBaseQuery({ baseUrl: `${API_BASE_URL}/api/reviews` }),
    tagTypes: ['Reviews', 'EligibleBookings'],
    endpoints: (builder) => ({
        getEligibleBookings: builder.query({
            query: (userId) => `/eligible/${userId}`,
            providesTags: ['EligibleBookings'],
        }),
        getUserReviews: builder.query({
            query: (userId) => `/user/${userId}`,
            providesTags: ['Reviews'],
        }),
        createReview: builder.mutation({
            query: (body) => ({
                url: '',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Reviews', 'EligibleBookings'],
        }),
        // Admin
        getAllReviews: builder.query({
            query: () => '/admin/all',
            providesTags: ['Reviews'],
        }),
        updateReviewStatus: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/admin/${id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['Reviews'],
        }),
    }),
});
export const { useGetEligibleBookingsQuery, useGetUserReviewsQuery, useCreateReviewMutation, useGetAllReviewsQuery, useUpdateReviewStatusMutation } = reviewApi;
