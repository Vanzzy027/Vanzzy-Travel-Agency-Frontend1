// src/features/api/paymentApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// export const bookingApi = createApi({
//   reducerPath: 'bookingApi',
//   baseQuery: fetchBaseQuery({
//     // Base URL for ALL endpoints
//     baseUrl: 'http://localhost:3000/api',
//     prepareHeaders: (headers) => {
//       const token = localStorage.getItem('token');
//       if (token) headers.set('authorization', `Bearer ${token}`);
//       headers.set('Content-Type', 'application/json');
//       return headers;
//     },
//   }),
export const paymentApi = createApi({
    reducerPath: 'paymentApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://vanske-car-rental.azurewebsites.net/api/payments',
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Payment', 'Receipt'],
    endpoints: (builder) => ({
        // Get receipt by payment ID or booking ID
        getReceipt: builder.query({
            query: ({ paymentId, bookingId }) => {
                if (paymentId) {
                    return `/${paymentId}/receipt`;
                }
                return `/receipt${bookingId ? `?bookingId=${bookingId}` : ''}`;
            },
            providesTags: (result, _, { paymentId }) => result ? [{ type: 'Receipt', id: paymentId }] : ['Receipt'],
        }),
        // Initialize payment
        initializePayment: builder.mutation({
            query: (paymentData) => ({
                url: '/initialize',
                method: 'POST',
                body: paymentData,
            }),
            invalidatesTags: ['Payment', 'Receipt'],
        }),
        // Get user's receipts
        getUserReceipts: builder.query({
            query: () => '/my-receipts',
            providesTags: ['Receipt'],
        }),
        // Get all receipts (admin only)
        getAllReceipts: builder.query({
            query: () => '/all-receipts',
            providesTags: ['Receipt'],
        }),
        // Get payment by booking ID
        getPaymentByBooking: builder.query({
            query: (bookingId) => `/booking/${bookingId}`,
            providesTags: (result, _, bookingId) => result ? [{ type: 'Payment', id: bookingId }] : ['Payment'],
        }),
    }),
});
export const { useGetReceiptQuery, useInitializePaymentMutation, useGetUserReceiptsQuery, useGetAllReceiptsQuery, useGetPaymentByBookingQuery, } = paymentApi;
