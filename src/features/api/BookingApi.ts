import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

// 1. INTERFACES (Keep all your interfaces exactly as they were)
export interface BookingDetail {
  booking_id: number;
  user_id: string;
  vehicle_id: number;

  // MATCHING BACKEND NAMES
  booking_date: string; // Rental Start
  return_date: string; // Rental End

  total_amount: number;

  // ADDED 'Active' HERE
  status:
    | "Pending"
    | "Confirmed"
    | "Active"
    | "Completed"
    | "Cancelled"
    | "Late";

  created_at: string;
  updated_at: string;

  // Joined Data
  user_first_name: string;
  user_last_name: string;
  user_email: string;
  user_contact_phone: string;

  vehicle_manufacturer: string;
  vehicle_model: string;
  vehicle_year: number;
  vehicle_color: string;
  vehicle_license_plate: string;
  vehicle_images: string[]; //array of image URLs
  vehicle_rental_rate: number;
  vehicle_type: string;
}

export interface CreateBookingRequest {
  vehicle_id: number;
  user_id?: string;
  booking_date: string;
  return_date: string;
  total_amount: number;
}

export interface UpdateBookingRequest {
  booking_date?: string;
  return_date?: string;
  total_amount?: number;
}

// Payment Request Interface
export interface ProcessPaymentRequest {
  booking_id: number;
  amount: number;
  payment_method: string; // 'mpesa' | 'card'
  transaction_code: string;
  phone_number?: string;
}

// New Payment Interfaces
// Update this in your BookingApi.ts
export type InitializePaymentRequest = {
  booking_id: number;
  amount: number;
  payment_method: string;
  user_id: string;
  email: string;
  phone?: string;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_year: number;
  transaction_reference?: string;
  payment_status?: string;
};

export interface VerifyPaymentRequest {
  reference: string;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  data?: {
    payment_id: number;
    reference: string;
    authorization_url?: string;
    access_code?: string;
    amount: number;
    currency: string;
    status: string;
  };
}

export type ReceiptResponse = {
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
};

export interface BookingCompletionResponse {
  message: string;
  late_fee: number;
  total_paid: number;
  // add other fields your backend returns here
}

export interface ChatMessage {
  role: string;
  parts: { text: string }[];
}

export interface ChatResponse {
  reply: string;
  actionPerformed?: string;
  functionResult?: any;
}

// --- HELPER FUNCTION FOR PARSING IMAGES ---
// This saves us from copying and pasting the same 15 lines of code 3 times!
const transformBookingData = (booking: any) => {
  let parsedImages = [];

  if (Array.isArray(booking.vehicle_images)) {
    parsedImages = booking.vehicle_images;
  } else if (typeof booking.vehicle_images === "string") {
    try {
      const parsed = JSON.parse(booking.vehicle_images);
      parsedImages = Array.isArray(parsed)
        ? parsed
        : booking.vehicle_images.split(",").map((img: string) => img.trim());
    } catch {
      parsedImages = booking.vehicle_images
        .split(",")
        .map((img: string) => img.trim());
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
    getAllBookings: builder.query<BookingDetail[], void>({
      query: () => "/bookings",
      transformResponse: (response: any) => {
        const rawData = Array.isArray(response)
          ? response
          : response?.data || [];
        return rawData.map(transformBookingData); // 🔥 Much cleaner!
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ booking_id }) => ({
                type: "Booking" as const,
                id: booking_id,
              })),
              { type: "Booking", id: "LIST" },
            ]
          : [{ type: "Booking", id: "LIST" }],
    }),

    getUserBookings: builder.query<BookingDetail[], void>({
      query: () => "/bookings/my-bookings",
      transformResponse: (response: any) => {
        const rawData = Array.isArray(response)
          ? response
          : response?.data || [];
        return rawData.map(transformBookingData); // 🔥 Much cleaner!
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ booking_id }) => ({
                type: "Booking" as const,
                id: booking_id,
              })),
              { type: "Booking", id: "LIST" },
            ]
          : [{ type: "Booking", id: "LIST" }],
    }),

    getBookingById: builder.query<BookingDetail, number>({
      query: (id) => `/bookings/${id}`,
      transformResponse: (response: any) => {
        const booking = response?.data || response;
        return transformBookingData(booking); // 🔥 Much cleaner!
      },
      providesTags: (_result, _error, id) => [{ type: "Booking", id }],
    }),

    createBooking: builder.mutation<BookingDetail, CreateBookingRequest>({
      query: (body) => ({
        url: "/bookings",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Booking", id: "LIST" }],
    }),

    updateBooking: builder.mutation<
      void,
      { id: number; data: UpdateBookingRequest }
    >({
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

    updateBookingStatus: builder.mutation<void, { id: number; status: string }>(
      {
        query: ({ id, status }) => ({
          url: `/bookings/${id}/status`,
          method: "PATCH",
          body: { booking_status: status },
        }),
        invalidatesTags: (_result, _error, { id }) => [
          { type: "Booking", id },
          { type: "Booking", id: "LIST" },
        ],
      },
    ),

    completeBooking: builder.mutation<
      BookingCompletionResponse,
      { id: number; return_date: string; end_mileage: number }
    >({
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

    cancelBooking: builder.mutation<void, number>({
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
    processPayment: builder.mutation<PaymentResponse, InitializePaymentRequest>(
      {
        query: (body) => ({
          url: `/initialize-payment`,
          method: "POST",
          body,
        }),
        invalidatesTags: [{ type: "Booking", id: "LIST" }],
      },
    ),

    verifyPayment: builder.mutation<PaymentResponse, VerifyPaymentRequest>({
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

    getPaymentByBookingId: builder.query<any, number>({
      query: (bookingId) => `/payments/booking/${bookingId}`,
      providesTags: (_result, _error, bookingId) => [
        { type: "Payment" as const, id: bookingId },
      ],
    }),

    initializePayment: builder.mutation<PaymentResponse, any>({
      query: (data) => ({
        url: "/payments/initialize",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Booking", id: "LIST" }],
    }),

    processPaymentLegacy: builder.mutation<void, ProcessPaymentRequest>({
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
    sendChatMessage: builder.mutation<
      ChatResponse,
      { message: string; history: ChatMessage[]; userId: string | number }
    >({
      query: (body) => ({
        url: "/chat",
        method: "POST",
        body,
      }),
    }),
  }),
});

// 3. EXPORTS
export const {
  useGetAllBookingsQuery,
  useGetUserBookingsQuery,
  useGetBookingByIdQuery,
  useCreateBookingMutation,
  useUpdateBookingStatusMutation,
  useUpdateBookingMutation,
  useCompleteBookingMutation,
  useCancelBookingMutation,
  useSendChatMessageMutation,
  useProcessPaymentMutation,
  useVerifyPaymentMutation,
  useGetPaymentByBookingIdQuery,
  useInitializePaymentMutation,
  useProcessPaymentLegacyMutation,
  useGetReceiptQuery,
} = bookingApi;
