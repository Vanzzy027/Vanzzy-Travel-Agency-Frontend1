// src/features/api/paymentApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface ReceiptResponse {
  success: boolean;
  data: {
    payment: {
      payment_id: number;
      payment_date: string;
      payment_method: string;
      transaction_id: string;
      net_amount: number;
      commission_fee: number;
      gross_amount: number;
      phone?: string;
    };
    booking: {
      booking_id: number;
      total_amount: number;
      booking_date: string;
      return_date: string;
      vehicle_manufacturer: string;
      vehicle_model: string;
      vehicle_year: number;
      license_plate?: string;
      vin_number?: string;
    };
    user: {
      first_name: string;
      last_name: string;
      email: string;
      contact_phone: string;
      address?: string;
    };
  };
}

interface PaymentRequest {
  booking_id: number;
  amount: number;
  payment_method: string;
  transaction_id?: string;
  transaction_reference?: string;
  phone?: string;
}

interface UserReceipt {
  payment_id: number;
  payment_date: string;
  payment_method: string;
  amount: number;
  transaction_id: string;
  booking_id: number;
  booking_date: string;
  vehicle_make: string;
  vehicle_model: string;
  first_name: string;
  last_name: string;
}


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
    baseUrl: 'http://localhost:3000/api/payments',
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
    getReceipt: builder.query<ReceiptResponse, { paymentId?: number; bookingId?: number }>({
      query: ({ paymentId, bookingId }) => {
        if (paymentId) {
          return `/${paymentId}/receipt`;
        }
        return `/receipt${bookingId ? `?bookingId=${bookingId}` : ''}`;
      },
      providesTags: (result, error, { paymentId }) => 
        result ? [{ type: 'Receipt', id: paymentId }] : ['Receipt'],
    }),

    // Initialize payment
    initializePayment: builder.mutation({
      query: (paymentData: PaymentRequest) => ({
        url: '/initialize',
        method: 'POST',
        body: paymentData,
      }),
      invalidatesTags: ['Payment', 'Receipt'],
    }),

    // Get user's receipts
    getUserReceipts: builder.query<{ success: boolean; data: UserReceipt[] }, void>({
      query: () => '/my-receipts',
      providesTags: ['Receipt'],
    }),

    // Get all receipts (admin only)
    getAllReceipts: builder.query<{ success: boolean; data: UserReceipt[] }, void>({
      query: () => '/all-receipts',
      providesTags: ['Receipt'],
    }),

    // Get payment by booking ID
    getPaymentByBooking: builder.query({
      query: (bookingId: number) => `/booking/${bookingId}`,
      providesTags: (result, error, bookingId) => 
        result ? [{ type: 'Payment', id: bookingId }] : ['Payment'],
    }),
  }),
});

export const {
  useGetReceiptQuery,
  useInitializePaymentMutation,
  useGetUserReceiptsQuery,
  useGetAllReceiptsQuery,
  useGetPaymentByBookingQuery,
} = paymentApi;