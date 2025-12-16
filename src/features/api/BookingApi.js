import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
;
;
// 2. API DEFINITION
const API_BASE_URL = import.meta.env.VITE_API_URL; // Consistent with API
export const bookingApi = createApi({
    reducerPath: 'bookingApi',
    baseQuery: fetchBaseQuery({
        // Base URL for ALL endpoints
        baseUrl: `${API_BASE_URL}/api`,
        prepareHeaders: (headers, { getState }) => {
            // Get token from Redux state or localStorage
            const token = getState()?.auth?.token || localStorage.getItem('token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            headers.set('Content-Type', 'application/json');
            return headers;
        },
    }),
    // Add 'Payment' to tagTypes
    tagTypes: ['Booking', 'Payment'],
    endpoints: (builder) => ({
        // --- BOOKING ENDPOINTS ---
        getAllBookings: builder.query({
            query: () => '/bookings',
            transformResponse: (response) => {
                const rawData = Array.isArray(response) ? response : (response?.data || []);
                // Map backend 'booking_status' to frontend 'status'
                return rawData.map((b) => ({
                    ...b,
                    status: b.booking_status
                }));
            },
            providesTags: (result) => result
                ? [
                    ...result.map(({ booking_id }) => ({ type: 'Booking', id: booking_id })),
                    { type: 'Booking', id: 'LIST' }
                ]
                : [{ type: 'Booking', id: 'LIST' }],
        }),
        getUserBookings: builder.query({
            query: () => '/bookings/my-bookings',
            transformResponse: (response) => {
                const rawData = Array.isArray(response) ? response : (response?.data || []);
                return rawData.map((b) => ({
                    ...b,
                    status: b.booking_status
                }));
            },
            providesTags: (result) => result
                ? [
                    ...result.map(({ booking_id }) => ({ type: 'Booking', id: booking_id })),
                    { type: 'Booking', id: 'LIST' }
                ]
                : [{ type: 'Booking', id: 'LIST' }],
        }),
        getBookingById: builder.query({
            query: (id) => `/bookings/${id}`,
            transformResponse: (response) => {
                const booking = response.data || response;
                return {
                    ...booking,
                    status: booking.booking_status
                };
            },
            providesTags: (_result, _error, id) => [{ type: 'Booking', id }],
        }),
        createBooking: builder.mutation({
            query: (body) => ({
                url: '/bookings',
                method: 'POST',
                body
            }),
            invalidatesTags: [{ type: 'Booking', id: 'LIST' }],
        }),
        updateBooking: builder.mutation({
            query: ({ id, data }) => ({
                url: `/bookings/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'Booking', id },
                { type: 'Booking', id: 'LIST' }
            ],
        }),
        // ✅ 1. Status Update
        updateBookingStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `/bookings/${id}/status`, // Matches route /:id/status
                method: 'PATCH', // Matches route method
                body: { booking_status: status },
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'Booking', id },
                { type: 'Booking', id: 'LIST' }
            ],
        }),
        // ✅ 2. Complete Booking
        completeBooking: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/bookings/${id}/complete`,
                method: 'PATCH',
                body: {
                    actual_return_date: body.return_date,
                    end_mileage: body.end_mileage
                },
            }),
            invalidatesTags: ['Booking'],
        }),
        // ✅ 3. Cancel Booking
        cancelBooking: builder.mutation({
            query: (id) => ({
                url: `/bookings/${id}/cancel`,
                method: 'PATCH'
            }),
            invalidatesTags: ['Booking'],
        }),
        // ✅ NEW: Payment Processing Endpoint (using new service)
        processPayment: builder.mutation({
            query: (body) => ({
                url: `/initialize-payment`,
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Booking', id: 'LIST' }],
        }),
        // ✅ NEW: Payment Verification Endpoint
        verifyPayment: builder.mutation({
            query: (body) => ({
                url: `/payments/verify`,
                method: 'POST',
                body,
            }),
            invalidatesTags: (_result, _error, { reference }) => [
                { type: 'Booking', id: 'LIST' },
                { type: 'Payment', id: reference }
            ],
        }),
        // ✅ NEW: Get Payment by Booking ID
        getPaymentByBookingId: builder.query({
            query: (bookingId) => `/payments/booking/${bookingId}`,
            providesTags: (_result, _error, bookingId) => [
                { type: 'Payment', id: bookingId }
            ],
        }),
        // ✅ OLD: Legacy Payment Endpoint (for backward compatibility)
        initializePayment: builder.mutation({
            query: (data) => ({
                url: '/payments/initialize',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: [{ type: 'Booking', id: 'LIST' }],
        }),
        // ✅ OLD: Process Payment (legacy endpoint - if you still need it)
        processPaymentLegacy: builder.mutation({
            query: (body) => ({
                url: '/bookings/payments/process', // Old endpoint
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Booking', id: 'LIST' }],
        }),
        //Receipt
        getReceipt: builder.query({
            query: ({ bookingId, paymentId }) => ({
                url: paymentId
                    ? `/payments/${paymentId}/receipt`
                    : `/bookings/${bookingId}/latest-receipt`,
                method: 'GET',
            }),
        }),
        // AI chat
        // sendChatMessage: builder.mutation<{ reply: string; actionPerformed?: string }, { message: string; history: any[]; userId: string }>({
        //   query: (body) => ({
        //     url: '/chat', //backend url
        //     method: 'POST',
        //     body,
        //   }),
        // }),
        sendChatMessage: builder.mutation({
            query: (body) => ({
                url: '/chat',
                method: 'POST',
                body,
            }),
        }),
    }),
});
// 3. EXPORTS
export const { useGetAllBookingsQuery, useGetUserBookingsQuery, useGetBookingByIdQuery, useCreateBookingMutation, useUpdateBookingStatusMutation, useUpdateBookingMutation, useCompleteBookingMutation, useCancelBookingMutation, useSendChatMessageMutation, //chat ai
// Payment endpoints
useProcessPaymentMutation, useVerifyPaymentMutation, useGetPaymentByBookingIdQuery, useInitializePaymentMutation, useProcessPaymentLegacyMutation, useGetReceiptQuery } = bookingApi;
