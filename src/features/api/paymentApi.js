import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";
export const paymentApi = createApi({
    reducerPath: "paymentApi",
    // 🚨 USE YOUR CUSTOM BASE QUERY HERE!
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Payment", "Receipt"],
    endpoints: (builder) => ({
        // Get receipt by payment ID or booking ID
        getReceipt: builder.query({
            query: ({ paymentId, bookingId }) => {
                // 🚨 Added "payments/" prefix to match your old baseUrl behavior
                if (paymentId) {
                    return `payments/${paymentId}/receipt`;
                }
                return `payments/receipt${bookingId ? `?bookingId=${bookingId}` : ""}`;
            },
            providesTags: (result, _, { paymentId }) => result ? [{ type: "Receipt", id: paymentId }] : ["Receipt"],
        }),
        // Initialize payment
        initializePayment: builder.mutation({
            query: (paymentData) => ({
                url: "payments/initialize", // 👈 Added prefix
                method: "POST",
                body: paymentData,
            }),
            invalidatesTags: ["Payment", "Receipt"],
        }),
        // Get user's receipts
        getUserReceipts: builder.query({
            query: () => "payments/my-receipts", // 👈 Added prefix
            providesTags: ["Receipt"],
        }),
        // Get all receipts (admin only)
        getAllReceipts: builder.query({
            query: () => "payments/all-receipts", // 👈 Added prefix
            providesTags: ["Receipt"],
        }),
        // Get payment by booking ID
        getPaymentByBooking: builder.query({
            query: (bookingId) => `payments/booking/${bookingId}`, // 👈 Added prefix
            providesTags: (result, _, bookingId) => result ? [{ type: "Payment", id: bookingId }] : ["Payment"],
        }),
    }),
});
export const { useGetReceiptQuery, useInitializePaymentMutation, useGetUserReceiptsQuery, useGetAllReceiptsQuery, useGetPaymentByBookingQuery, } = paymentApi;
