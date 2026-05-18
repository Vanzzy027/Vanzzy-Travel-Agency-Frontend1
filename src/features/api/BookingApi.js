import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";
// --- HELPER FUNCTION FOR PARSING IMAGES ---
// This saves us from copying and pasting the same 15 lines of code 3 times!
const transformBookingData = (booking) => {
    let parsedImages = [];
    if (Array.isArray(booking.vehicle_images)) {
        parsedImages = booking.vehicle_images;
    }
    else if (typeof booking.vehicle_images === "string") {
        try {
            const parsed = JSON.parse(booking.vehicle_images);
            parsedImages = Array.isArray(parsed)
                ? parsed
                : booking.vehicle_images.split(",").map((img) => img.trim());
        }
        catch {
            parsedImages = booking.vehicle_images
                .split(",")
                .map((img) => img.trim());
        }
    }
    return {
        ...booking,
        status: booking.booking_status, // Normalize status
        vehicle_images: parsedImages, // Normalize images
    };
};
// 2. API DEFINITION
export const bookingApi = createApi({
    reducerPath: "bookingApi",
    // 🚨 USE YOUR CUSTOM BASE QUERY HERE!
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Booking", "Payment"],
    endpoints: (builder) => ({
        // --- BOOKING ENDPOINTS ---
        getAllBookings: builder.query({
            query: () => "/bookings",
            transformResponse: (response) => {
                const rawData = Array.isArray(response)
                    ? response
                    : response?.data || [];
                return rawData.map(transformBookingData); // 🔥 Much cleaner!
            },
            providesTags: (result) => result
                ? [
                    ...result.map(({ booking_id }) => ({
                        type: "Booking",
                        id: booking_id,
                    })),
                    { type: "Booking", id: "LIST" },
                ]
                : [{ type: "Booking", id: "LIST" }],
        }),
        getUserBookings: builder.query({
            query: () => "/bookings/my-bookings",
            transformResponse: (response) => {
                const rawData = Array.isArray(response)
                    ? response
                    : response?.data || [];
                return rawData.map(transformBookingData); // 🔥 Much cleaner!
            },
            providesTags: (result) => result
                ? [
                    ...result.map(({ booking_id }) => ({
                        type: "Booking",
                        id: booking_id,
                    })),
                    { type: "Booking", id: "LIST" },
                ]
                : [{ type: "Booking", id: "LIST" }],
        }),
        getBookingById: builder.query({
            query: (id) => `/bookings/${id}`,
            transformResponse: (response) => {
                const booking = response?.data || response;
                return transformBookingData(booking); // 🔥 Much cleaner!
            },
            providesTags: (_result, _error, id) => [{ type: "Booking", id }],
        }),
        createBooking: builder.mutation({
            query: (body) => ({
                url: "/bookings",
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "Booking", id: "LIST" }],
        }),
        updateBooking: builder.mutation({
            query: ({ id, data }) => ({
                url: `/bookings/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: "Booking", id },
                { type: "Booking", id: "LIST" },
            ],
        }),
        updateBookingStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `/bookings/${id}/status`,
                method: "PATCH",
                body: { booking_status: status },
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: "Booking", id },
                { type: "Booking", id: "LIST" },
            ],
        }),
        completeBooking: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/bookings/${id}/complete`,
                method: "PATCH",
                body: {
                    actual_return_date: body.return_date,
                    end_mileage: body.end_mileage,
                },
            }),
            // 🔥 Improved to not over-fetch data
            invalidatesTags: (_result, _error, { id }) => [
                { type: "Booking", id },
                { type: "Booking", id: "LIST" },
            ],
        }),
        cancelBooking: builder.mutation({
            query: (id) => ({
                url: `/bookings/${id}/cancel`,
                method: "PATCH",
            }),
            // 🔥 Improved to not over-fetch data
            invalidatesTags: (_result, _error, id) => [
                { type: "Booking", id },
                { type: "Booking", id: "LIST" },
            ],
        }),
        // --- PAYMENT ENDPOINTS ---
        processPayment: builder.mutation({
            query: (body) => ({
                url: `/initialize-payment`,
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "Booking", id: "LIST" }],
        }),
        verifyPayment: builder.mutation({
            query: (body) => ({
                url: `/payments/verify`,
                method: "POST",
                body,
            }),
            invalidatesTags: (_result, _error, { reference }) => [
                { type: "Booking", id: "LIST" },
                { type: "Payment", id: reference },
            ],
        }),
        getPaymentByBookingId: builder.query({
            query: (bookingId) => `/payments/booking/${bookingId}`,
            providesTags: (_result, _error, bookingId) => [
                { type: "Payment", id: bookingId },
            ],
        }),
        initializePayment: builder.mutation({
            query: (data) => ({
                url: "/payments/initialize",
                method: "POST",
                body: data,
            }),
            invalidatesTags: [{ type: "Booking", id: "LIST" }],
        }),
        processPaymentLegacy: builder.mutation({
            query: (body) => ({
                url: "/bookings/payments/process",
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "Booking", id: "LIST" }],
        }),
        getReceipt: builder.query({
            query: ({ bookingId, paymentId }) => ({
                url: paymentId
                    ? `/payments/${paymentId}/receipt`
                    : `/bookings/${bookingId}/latest-receipt`,
                method: "GET",
            }),
        }),
        // --- AI CHAT ---
        sendChatMessage: builder.mutation({
            query: (body) => ({
                url: "/chat",
                method: "POST",
                body,
            }),
        }),
    }),
});
// 3. EXPORTS
export const { useGetAllBookingsQuery, useGetUserBookingsQuery, useGetBookingByIdQuery, useCreateBookingMutation, useUpdateBookingStatusMutation, useUpdateBookingMutation, useCompleteBookingMutation, useCancelBookingMutation, useSendChatMessageMutation, useProcessPaymentMutation, useVerifyPaymentMutation, useGetPaymentByBookingIdQuery, useInitializePaymentMutation, useProcessPaymentLegacyMutation, useGetReceiptQuery, } = bookingApi;
