import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQueryWithReauth } from "./baseQuery";

// --- INTERFACES --- (Unchanged)
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
  payment_status: string; // ADDED
  amount: number;
  transaction_id: string;
  booking_id: number;
  booking_date: string;
  vehicle_make: string;
  vehicle_model: string;
  first_name: string;
  last_name: string;
  email: string; // ADDED
  phone: string; // ADDED
}

export const paymentApi = createApi({
  reducerPath: "paymentApi",

  // 🚨 USE YOUR CUSTOM BASE QUERY HERE!
  baseQuery: baseQueryWithReauth,

  tagTypes: ["Payment", "Receipt"],

  endpoints: (builder) => ({
    // Get receipt by payment ID or booking ID
    getReceipt: builder.query<
      ReceiptResponse,
      { paymentId?: number; bookingId?: number }
    >({
      query: ({ paymentId, bookingId }) => {
        // 🚨 Added "payments/" prefix to match your old baseUrl behavior
        if (paymentId) {
          return `payments/${paymentId}/receipt`;
        }
        return `payments/receipt${bookingId ? `?bookingId=${bookingId}` : ""}`;
      },
      providesTags: (result, _, { paymentId }) =>
        result ? [{ type: "Receipt", id: paymentId }] : ["Receipt"],
    }),

    // Initialize payment
    initializePayment: builder.mutation({
      query: (paymentData: PaymentRequest) => ({
        url: "payments/initialize", // 👈 Added prefix
        method: "POST",
        body: paymentData,
      }),
      invalidatesTags: ["Payment", "Receipt"],
    }),

    // Get user's receipts
    getUserReceipts: builder.query<
      { success: boolean; data: UserReceipt[] },
      void
    >({
      query: () => "payments/my-receipts", // 👈 Added prefix
      providesTags: ["Receipt"],
    }),

    // Get all receipts (admin only)
    getAllReceipts: builder.query<
      { success: boolean; data: UserReceipt[] },
      void
    >({
      query: () => "payments/all-receipts", // 👈 Added prefix
      providesTags: ["Receipt"],
    }),

    // Get payment by booking ID
    getPaymentByBooking: builder.query({
      query: (bookingId: number) => `payments/booking/${bookingId}`, // 👈 Added prefix
      providesTags: (result, _, bookingId) =>
        result ? [{ type: "Payment", id: bookingId }] : ["Payment"],
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
