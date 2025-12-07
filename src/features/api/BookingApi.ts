
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
//import { type InitializePaymentRequest } from '../../types/types';
// 1. INTERFACES

export interface BookingDetail {
  booking_id: number;
  user_id: string;
  vehicle_id: number;
  
  // MATCHING BACKEND NAMES
  booking_date: string; // Rental Start
  return_date: string;  // Rental End
  
  total_amount: number;
  
  // ADDED 'Active' HERE
  status: 'Pending' | 'Confirmed' | 'Active' | 'Completed' | 'Cancelled' | 'Late'; 
  
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
  vehicle_images: string;
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
};

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
  }};


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
    }
  };



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
// 2. API DEFINITION

export const bookingApi = createApi({
  reducerPath: 'bookingApi',
  baseQuery: fetchBaseQuery({
    // Base URL for ALL endpoints
    baseUrl: 'http://localhost:3000/api',
    prepareHeaders: (headers, { getState }) => {
      // Get token from Redux state or localStorage
      const token = (getState() as any)?.auth?.token || localStorage.getItem('token');
      
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
        headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  //   prepareHeaders: (headers) => {
  //     const token = localStorage.getItem('token');
  //     if (token) headers.set('authorization', `Bearer ${token}`);
  //     headers.set('Content-Type', 'application/json');
  //     return headers;
  //   },
  // }),
  // Add 'Payment' to tagTypes
  tagTypes: ['Booking', 'Payment'],

  endpoints: (builder) => ({
    
    // --- BOOKING ENDPOINTS ---

    getAllBookings: builder.query<BookingDetail[], void>({
      query: () => '/bookings',
      transformResponse: (response: any) => {
        const rawData = Array.isArray(response) ? response : (response?.data || []);
        // Map backend 'booking_status' to frontend 'status'
        return rawData.map((b: any) => ({
          ...b,
          status: b.booking_status 
        }));
      },
      providesTags: (result) => 
        result 
          ? [
              ...result.map(({ booking_id }) => ({ type: 'Booking' as const, id: booking_id })),
              { type: 'Booking', id: 'LIST' }
            ]
          : [{ type: 'Booking', id: 'LIST' }],
    }),

    getUserBookings: builder.query<BookingDetail[], void>({
      query: () => '/bookings/my-bookings',
      transformResponse: (response: any) => {
        const rawData = Array.isArray(response) ? response : (response?.data || []);
        return rawData.map((b: any) => ({
          ...b,
          status: b.booking_status 
        }));
      },
      providesTags: (result) => 
        result 
          ? [
              ...result.map(({ booking_id }) => ({ type: 'Booking' as const, id: booking_id })),
              { type: 'Booking', id: 'LIST' }
            ]
          : [{ type: 'Booking', id: 'LIST' }],
    }),

    getBookingById: builder.query<BookingDetail, number>({
      query: (id) => `/bookings/${id}`,
      transformResponse: (response: any) => {
        const booking = response.data || response;
        return {
          ...booking,
          status: booking.booking_status
        };
      },
      providesTags: (_result, _error, id) => [{ type: 'Booking', id }],
    }),

    createBooking: builder.mutation<BookingDetail, CreateBookingRequest>({
      query: (body) => ({ 
        url: '/bookings', 
        method: 'POST', 
        body 
      }),
      invalidatesTags: [{ type: 'Booking', id: 'LIST' }],
    }),

    updateBookingStatus: builder.mutation<void, { id: number; status: string }>({
      query: ({ id, status }) => ({
        url: `/bookings/${id}/status`, 
        method: 'PATCH',
        body: { booking_status: status },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Booking', id },
        { type: 'Booking', id: 'LIST' }
      ],
    }),

    updateBooking: builder.mutation<void, { id: number; data: UpdateBookingRequest }>({
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

    completeBooking: builder.mutation<void, { id: number; return_date: string; end_mileage: number }>({
      query: ({ id, ...body }) => ({
        url: `/bookings/${id}/complete`,
        method: 'POST',
        body: {
            actual_return_date: body.return_date,
            end_mileage: body.end_mileage
        },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Booking', id },
        { type: 'Booking', id: 'LIST' }
      ],
    }),

    cancelBooking: builder.mutation<void, number>({
      query: (id) => ({ 
        url: `/bookings/${id}/cancel`, 
        method: 'POST' 
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Booking', id },
        { type: 'Booking', id: 'LIST' }
      ],
    }),

    // --- PAYMENT ENDPOINTS ---

    // ✅ NEW: Payment Processing Endpoint (using new service)
    processPayment: builder.mutation<PaymentResponse, InitializePaymentRequest>({
      query: (body) => ({
        url: `/initialize-payment`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Booking', id: 'LIST' }],
    }),

    // ✅ NEW: Payment Verification Endpoint
    verifyPayment: builder.mutation<PaymentResponse, VerifyPaymentRequest>({
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
    getPaymentByBookingId: builder.query<any, number>({
      query: (bookingId) => `/payments/booking/${bookingId}`,
      providesTags: (_result, _error, bookingId) => [
        { type: 'Payment' as const, id: bookingId }
      ],
    }),

    // ✅ OLD: Legacy Payment Endpoint (for backward compatibility)
    initializePayment: builder.mutation<PaymentResponse, any>({
      query: (data) => ({
        url: '/payments/initialize',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Booking', id: 'LIST' }],
    }),

    // ✅ OLD: Process Payment (legacy endpoint - if you still need it)
    processPaymentLegacy: builder.mutation<void, ProcessPaymentRequest>({
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

    sendChatMessage: builder.mutation<ChatResponse, {
      message: string;
      history: ChatMessage[];
      userId: string | number;
    }>({
      query: (body) => ({
        url: '/chat',
        method: 'POST',
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
  useSendChatMessageMutation, //chat ai
  
  // Payment endpoints
  useProcessPaymentMutation,
  useVerifyPaymentMutation,
  useGetPaymentByBookingIdQuery,
  useInitializePaymentMutation,
  useProcessPaymentLegacyMutation,
  useGetReceiptQuery
} = bookingApi;







// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// //import { type InitializePaymentRequest } from '../../types/types';
// // 1. INTERFACES

// export interface BookingDetail {
//   booking_id: number;
//   user_id: string;
//   vehicle_id: number;
  
//   // MATCHING BACKEND NAMES
//   booking_date: string; // Rental Start
//   return_date: string;  // Rental End
  
//   total_amount: number;
  
//   // ADDED 'Active' HERE
//   status: 'Pending' | 'Confirmed' | 'Active' | 'Completed' | 'Cancelled' | 'Late'; 
  
//   created_at: string;
//   updated_at: string;

//   // Joined Data
//   user_first_name: string;
//   user_last_name: string;
//   user_email: string;
//   user_contact_phone: string;

//   vehicle_manufacturer: string;
//   vehicle_model: string;
//   vehicle_year: number;
//   vehicle_color: string;
//   vehicle_license_plate: string;
//   vehicle_images: string;
//   vehicle_rental_rate: number;
//   vehicle_type: string;
// }

// export interface CreateBookingRequest {
//   vehicle_id: number;
//   user_id?: string;
//   booking_date: string;
//   return_date: string;
//   total_amount: number;
// }

// export interface UpdateBookingRequest {
//   booking_date?: string; 
//   return_date?: string;  
//   total_amount?: number;
// }

// // Payment Request Interface
// export interface ProcessPaymentRequest {
//   booking_id: number; 
//   amount: number; 
//   payment_method: string; // 'mpesa' | 'card'
//   transaction_code: string;
//   phone_number?: string; 
// }

// // New Payment Interfaces
// // Update this in your BookingApi.ts
// export type InitializePaymentRequest = {
//   booking_id: number;
//   amount: number;
//   payment_method: string;
//   user_id: string;
//   email: string;
//   phone?: string;
//   vehicle_make: string;
//   vehicle_model: string;
//   vehicle_year: number;
//   transaction_reference?: string;
//   payment_status?: string;
// };

// export interface VerifyPaymentRequest {
//   reference: string;
// };

// export interface PaymentResponse {
//   success: boolean;
//   message: string;
//   data?: {
//     payment_id: number;
//     reference: string;
//     authorization_url?: string;
//     access_code?: string;
//     amount: number;
//     currency: string;
//     status: string;
//   }};


// export type ReceiptResponse = {
//   success: boolean;
//   data: {
//     payment: {
//       payment_id: number;
//       payment_date: string;
//       payment_method: string;
//       transaction_id: string;
//       net_amount: number;
//       commission_fee: number;
//       gross_amount: number;
//     };
//     booking: {
//       booking_id: number;
//       total_amount: number;
//       booking_date: string;
//       return_date: string;
//       vehicle_manufacturer: string;
//       vehicle_model: string;
//       vehicle_year: number;
//       license_plate?: string;
//       vin_number?: string;
//     };
//     user: {
//       first_name: string;
//       last_name: string;
//       email: string;
//       contact_phone: string;
//       address?: string;
//     }
//   };



// }
// export interface ChatMessage {
//   role: string;
//   parts: { text: string }[];
// }

// export interface ChatResponse {
//   reply: string;
//   actionPerformed?: string;
//   functionResult?: any;
// }
// // 2. API DEFINITION

// export const bookingApi = createApi({
//   reducerPath: 'bookingApi',
//   baseQuery: fetchBaseQuery({
//     // Base URL for ALL endpoints
//     baseUrl: 'http://localhost:3000/api',
//     prepareHeaders: (headers, { getState }) => {
//       // Get token from Redux state or localStorage
//       const token = (getState() as any)?.auth?.token || localStorage.getItem('token');
      
//       if (token) {
//         headers.set('Authorization', `Bearer ${token}`);
//       }
//         headers.set('Content-Type', 'application/json');
//       return headers;
//     },
//   }),
//   //   prepareHeaders: (headers) => {
//   //     const token = localStorage.getItem('token');
//   //     if (token) headers.set('authorization', `Bearer ${token}`);
//   //     headers.set('Content-Type', 'application/json');
//   //     return headers;
//   //   },
//   // }),
//   // Add 'Payment' to tagTypes
//   tagTypes: ['Booking', 'Payment'],

//   endpoints: (builder) => ({
    
//     // --- BOOKING ENDPOINTS ---

//     getAllBookings: builder.query<BookingDetail[], void>({
//       query: () => '/bookings',
//       transformResponse: (response: any) => {
//         const rawData = Array.isArray(response) ? response : (response?.data || []);
//         // Map backend 'booking_status' to frontend 'status'
//         return rawData.map((b: any) => ({
//           ...b,
//           status: b.booking_status 
//         }));
//       },
//       providesTags: (result) => 
//         result 
//           ? [
//               ...result.map(({ booking_id }) => ({ type: 'Booking' as const, id: booking_id })),
//               { type: 'Booking', id: 'LIST' }
//             ]
//           : [{ type: 'Booking', id: 'LIST' }],
//     }),

//     getUserBookings: builder.query<BookingDetail[], void>({
//       query: () => '/bookings/my-bookings',
//       transformResponse: (response: any) => {
//         const rawData = Array.isArray(response) ? response : (response?.data || []);
//         return rawData.map((b: any) => ({
//           ...b,
//           status: b.booking_status 
//         }));
//       },
//       providesTags: (result) => 
//         result 
//           ? [
//               ...result.map(({ booking_id }) => ({ type: 'Booking' as const, id: booking_id })),
//               { type: 'Booking', id: 'LIST' }
//             ]
//           : [{ type: 'Booking', id: 'LIST' }],
//     }),

//     getBookingById: builder.query<BookingDetail, number>({
//       query: (id) => `/bookings/${id}`,
//       transformResponse: (response: any) => {
//         const booking = response.data || response;
//         return {
//           ...booking,
//           status: booking.booking_status
//         };
//       },
//       providesTags: (_result, _error, id) => [{ type: 'Booking', id }],
//     }),

//     createBooking: builder.mutation<BookingDetail, CreateBookingRequest>({
//       query: (body) => ({ 
//         url: '/bookings', 
//         method: 'POST', 
//         body 
//       }),
//       invalidatesTags: [{ type: 'Booking', id: 'LIST' }],
//     }),

//     updateBookingStatus: builder.mutation<void, { id: number; status: string }>({
//       query: ({ id, status }) => ({
//         url: `/bookings/${id}/status`, 
//         method: 'PATCH',
//         body: { booking_status: status },
//       }),
//       invalidatesTags: (_result, _error, { id }) => [
//         { type: 'Booking', id },
//         { type: 'Booking', id: 'LIST' }
//       ],
//     }),

//     updateBooking: builder.mutation<void, { id: number; data: UpdateBookingRequest }>({
//       query: ({ id, data }) => ({
//         url: `/bookings/${id}`,
//         method: 'PUT',
//         body: data,
//       }),
//       invalidatesTags: (_result, _error, { id }) => [
//         { type: 'Booking', id },
//         { type: 'Booking', id: 'LIST' }
//       ],
//     }),

//     completeBooking: builder.mutation<void, { id: number; return_date: string; end_mileage: number }>({
//       query: ({ id, ...body }) => ({
//         url: `/bookings/${id}/complete`,
//         method: 'POST',
//         body: {
//             actual_return_date: body.return_date,
//             end_mileage: body.end_mileage
//         },
//       }),
//       invalidatesTags: (_result, _error, { id }) => [
//         { type: 'Booking', id },
//         { type: 'Booking', id: 'LIST' }
//       ],
//     }),

//     cancelBooking: builder.mutation<void, number>({
//       query: (id) => ({ 
//         url: `/bookings/${id}/cancel`, 
//         method: 'POST' 
//       }),
//       invalidatesTags: (_result, _error, id) => [
//         { type: 'Booking', id },
//         { type: 'Booking', id: 'LIST' }
//       ],
//     }),

//     // --- PAYMENT ENDPOINTS ---

//     // ✅ NEW: Payment Processing Endpoint (using new service)
//     processPayment: builder.mutation<PaymentResponse, InitializePaymentRequest>({
//       query: (body) => ({
//         url: `/initialize-payment`,
//         method: 'POST',
//         body,
//       }),
//       invalidatesTags: [{ type: 'Booking', id: 'LIST' }],
//     }),

//     // ✅ NEW: Payment Verification Endpoint
//     verifyPayment: builder.mutation<PaymentResponse, VerifyPaymentRequest>({
//       query: (body) => ({
//         url: `/payments/verify`,
//         method: 'POST',
//         body,
//       }),
//       invalidatesTags: (_result, _error, { reference }) => [
//         { type: 'Booking', id: 'LIST' }, 
//         { type: 'Payment', id: reference }
//       ],
//     }),

//     // ✅ NEW: Get Payment by Booking ID
//     getPaymentByBookingId: builder.query<any, number>({
//       query: (bookingId) => `/payments/booking/${bookingId}`,
//       providesTags: (_result, _error, bookingId) => [
//         { type: 'Payment' as const, id: bookingId }
//       ],
//     }),

//     // ✅ OLD: Legacy Payment Endpoint (for backward compatibility)
//     initializePayment: builder.mutation<PaymentResponse, any>({
//       query: (data) => ({
//         url: '/payments/initialize',
//         method: 'POST',
//         body: data,
//       }),
//       invalidatesTags: [{ type: 'Booking', id: 'LIST' }],
//     }),

//     // ✅ OLD: Process Payment (legacy endpoint - if you still need it)
//     processPaymentLegacy: builder.mutation<void, ProcessPaymentRequest>({
//       query: (body) => ({
//         url: '/bookings/payments/process', // Old endpoint
//         method: 'POST',
//         body,
//       }),
//       invalidatesTags: [{ type: 'Booking', id: 'LIST' }],
//     }),


//     //Receipt
//         getReceipt: builder.query({
//       query: ({ bookingId, paymentId }) => ({
//         url: paymentId 
//           ? `/payments/${paymentId}/receipt` 
//           : `/bookings/${bookingId}/latest-receipt`,
//         method: 'GET',
//       }),
//     }),



//     // AI chat
//     // sendChatMessage: builder.mutation<{ reply: string; actionPerformed?: string }, { message: string; history: any[]; userId: string }>({
//     //   query: (body) => ({
//     //     url: '/chat', //backend url
//     //     method: 'POST',
//     //     body,
//     //   }),
//     // }),

//     sendChatMessage: builder.mutation<ChatResponse, {
//       message: string;
//       history: ChatMessage[];
//       userId: string | number;
//     }>({
//       query: (body) => ({
//         url: '/chat',
//         method: 'POST',
//         body,
//       }),
//     }),

//   }),
// });


// // 3. EXPORTS

// export const {
//   useGetAllBookingsQuery,
//   useGetUserBookingsQuery,
//   useGetBookingByIdQuery,
//   useCreateBookingMutation,
//   useUpdateBookingStatusMutation,
//   useUpdateBookingMutation,
//   useCompleteBookingMutation,
//   useCancelBookingMutation,
//   useSendChatMessageMutation, //chat ai
  
//   // Payment endpoints
//   useProcessPaymentMutation,
//   useVerifyPaymentMutation,
//   useGetPaymentByBookingIdQuery,
//   useInitializePaymentMutation,
//   useProcessPaymentLegacyMutation,
//   useGetReceiptQuery
// } = bookingApi;






