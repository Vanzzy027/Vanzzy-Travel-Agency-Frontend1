import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQueryWithReauth } from "./baseQuery";

export const reviewApi = createApi({
  reducerPath: "reviewApi",

  // USE CUSTOM BASE QUERY HERE!
  // This automatically adds the auth token AND handles 401 session expirations!
  baseQuery: baseQueryWithReauth,

  tagTypes: ["Reviews", "EligibleBookings"],

  endpoints: (builder) => ({
    getEligibleBookings: builder.query<any[], string>({
      // 👈 Added 'reviews/' prefix
      query: (userId) => `reviews/eligible/${userId}`,
      providesTags: ["EligibleBookings"],
    }),

    getUserReviews: builder.query<any[], string>({
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
    getAllReviews: builder.query<any[], void>({
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

export const {
  useGetEligibleBookingsQuery,
  useGetUserReviewsQuery,
  useCreateReviewMutation,
  useGetAllReviewsQuery,
  useUpdateReviewStatusMutation,
} = reviewApi;
