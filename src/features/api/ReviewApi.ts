import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const reviewApi = createApi({
  reducerPath: 'reviewApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://vanske-car-rental.azurewebsites.net/api/reviews' }),
  tagTypes: ['Reviews', 'EligibleBookings'],
  endpoints: (builder) => ({
    getEligibleBookings: builder.query<any[], string>({
      query: (userId) => `/eligible/${userId}`,
      providesTags: ['EligibleBookings'],
    }),
    getUserReviews: builder.query<any[], string>({
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
    getAllReviews: builder.query<any[], void>({
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

export const { 
    useGetEligibleBookingsQuery, useGetUserReviewsQuery, useCreateReviewMutation,
    useGetAllReviewsQuery, useUpdateReviewStatusMutation 
} = reviewApi;