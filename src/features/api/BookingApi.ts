import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// ==========================================
// 1. TYPE DEFINITIONS
// ==========================================

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
  booking_date?: string; // Changed from start_date
  return_date?: string;  // Changed from end_date
  total_amount?: number;
}

// ==========================================
// 2. API DEFINITION
// ==========================================

export const bookingApi = createApi({
  reducerPath: 'bookingApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000/api/bookings',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) headers.set('authorization', `Bearer ${token}`);
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Booking'],

  endpoints: (builder) => ({
    
    // READ
    getAllBookings: builder.query<BookingDetail[], void>({
      query: () => '',
      transformResponse: (response: any) => {
        const rawData = Array.isArray(response) ? response : (response?.data || []);
        // Map backend 'booking_status' to frontend 'status'
        return rawData.map((b: any) => ({
          ...b,
          status: b.booking_status 
        }));
      },
      providesTags: (result) => result ? [{ type: 'Booking', id: 'LIST' }] : [{ type: 'Booking', id: 'LIST' }],
    }),

    getUserBookings: builder.query<BookingDetail[], void>({
      query: () => '/my-bookings',
      transformResponse: (response: any) => {
        const rawData = Array.isArray(response) ? response : (response?.data || []);
        return rawData.map((b: any) => ({
          ...b,
          status: b.booking_status 
        }));
      },
      providesTags: [{ type: 'Booking', id: 'LIST' }],
    }),

    getBookingById: builder.query<BookingDetail, number>({
      query: (id) => `/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Booking', id }],
    }),

    // WRITE
    createBooking: builder.mutation<BookingDetail, CreateBookingRequest>({
      query: (body) => ({ url: '', method: 'POST', body }),
      invalidatesTags: [{ type: 'Booking', id: 'LIST' }],
    }),

    // THIS IS THE ONE CAUSING REFERENCE ERROR IF MISSING
    updateBookingStatus: builder.mutation<void, { id: number; status: string }>({
      query: ({ id, status }) => ({
        url: `/${id}/status`, // Ensure backend has this route, or use PUT /:id
        method: 'PATCH',
        body: { booking_status: status },
      }),
      invalidatesTags: [{ type: 'Booking', id: 'LIST' }],
    }),

    updateBooking: builder.mutation<void, { id: number; data: UpdateBookingRequest }>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: [{ type: 'Booking', id: 'LIST' }],
    }),

    completeBooking: builder.mutation<void, { id: number; return_date: string; end_mileage: number }>({
      query: ({ id, ...body }) => ({
        url: `/${id}/complete`,
        method: 'POST', // Backend expects POST for completion usually
        body: {
            actual_return_date: body.return_date, // Map to backend expected field
            end_mileage: body.end_mileage
        },
      }),
      invalidatesTags: [{ type: 'Booking', id: 'LIST' }],
    }),

    cancelBooking: builder.mutation<void, number>({
      query: (id) => ({ url: `/${id}/cancel`, method: 'POST' }),
      invalidatesTags: [{ type: 'Booking', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetAllBookingsQuery,
  useGetUserBookingsQuery,
  useGetBookingByIdQuery,
  useCreateBookingMutation,
  useUpdateBookingStatusMutation, // Exported correctly
  useUpdateBookingMutation,
  useCompleteBookingMutation,
  useCancelBookingMutation
} = bookingApi;








// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import type { User } from './UserApi'; 
// import type { VehicleWithSpecs } from './VehicleAPI'; 

// export interface BookingDetail {
//   booking_id: number;
//   user_id: string;
//   vehicle_id: number;
//   booking_date: string;
//   return_date: string;
//   total_amount: number;
//   // We map 'booking_status' to 'status' for frontend consistency
//   status: 'Pending' | 'Confirmed' | 'Active' | 'Completed' | 'Cancelled'; 
//   created_at: string;
//   updated_at: string;
//     // Joined User Data
//   user_first_name: string;
//   user_last_name: string;
//   user_email: string;
//   user_contact_phone: string;
//   // The transformer will create this nested object
//   vehicle?: {
//     manufacturer: string;
//     model: string;
//     year: number;
//     color: string;
//     rental_rate: number;
//     vehicle_type?: string;
//     images?: string; // or string[]
//   }; 
// }

// export interface CreateBookingRequest {
//   vehicle_id: number;
//   booking_date: string;
//   return_date: string;
//   total_amount: number;
// }

// export const BookingApi = createApi({
//   reducerPath: 'bookingApi',
//   baseQuery: fetchBaseQuery({
//     baseUrl: 'http://localhost:3000/api/bookings',
//     prepareHeaders: (headers) => {
//       const token = localStorage.getItem('token');
//       if (token) {
//         headers.set('authorization', `Bearer ${token}`);
//       }
//       headers.set('Content-Type', 'application/json');
//       return headers;
//     },
//   }),
//   tagTypes: ['Booking', 'Vehicle'],
//   endpoints: (builder) => ({
    
//     // --- USER ENDPOINTS ---

//     createBooking: builder.mutation<Booking, CreateBookingRequest>({
//       query: (bookingData) => ({
//         url: '',
//         method: 'POST',
//         body: bookingData,
//       }),
//       invalidatesTags: ['Booking', 'Vehicle'],
//     }),

//     getUserBookings: builder.query<Booking[], void>({
//       query: () => '/my-bookings',
//       // CRITICAL FIX: Transform the Flat Backend Data into Nested Frontend Data
//       transformResponse: (response: any) => {
//         const rawData = Array.isArray(response) ? response : (response?.data || []);
        
//         return rawData.map((item: any) => ({
//           ...item,
//           // 1. Map booking_status to status
//           status: item.booking_status, 
          
//           // 2. Nest the flat vehicle details into a 'vehicle' object
//           vehicle: {
//             manufacturer: item.vehicle_manufacturer,
//             model: item.vehicle_model,
//             year: item.vehicle_year,
//             color: item.vehicle_color,
//             rental_rate: item.vehicle_rental_rate,
//             vehicle_type: item.vehicle_type || 'Car', // Fallback
//             // Backend might not be sending images yet, handle safely
//             images: item.vehicle_images || item.images || '[]' 
//           }
//         }));
//       },
//       providesTags: (result = []) => [
//         ...result.map(({ booking_id }) => ({ type: 'Booking' as const, id: booking_id })),
//         { type: 'Booking', id: 'LIST' },
//       ],
//     }),

//     getBookingById: builder.query<Booking, number>({
//       query: (id) => `/${id}`,
//       providesTags: (_result, _error, id) => [{ type: 'Booking', id }],
//     }),

//     // ... (rest of your endpoints remain the same)
//     cancelBooking: builder.mutation<Booking, number>({
//       query: (id) => ({
//         url: `/${id}/cancel`,
//         method: 'POST',
//       }),
//       invalidatesTags: ['Booking'],
//     }),

//     getAllBookings: builder.query<Booking[], void>({
//       query: () => '', 
//       transformResponse: (response: any) => {
//         const rawData = response.data || response || [];
//         // Apply same transformation for Admin view if needed
//         return rawData.map((item: any) => ({
//           ...item,
//           status: item.booking_status,
//           vehicle: {
//             manufacturer: item.vehicle_manufacturer,
//             model: item.vehicle_model,
//             year: item.vehicle_year,
//             rental_rate: item.vehicle_rental_rate,
//           }
//         }));
//       },
//       providesTags: (result = []) => [
//         ...result.map(({ booking_id }) => ({ type: 'Booking' as const, id: booking_id })),
//         { type: 'Booking', id: 'LIST' },
//       ],
//     }),

//     updateBookingStatus: builder.mutation<Booking, { id: number; status: string }>({
//       query: ({ id, status }) => ({
//         url: `/${id}`, 
//         method: 'PUT',
//         body: { status },
//       }),
//       invalidatesTags: (_result, _error, { id }) => [
//         { type: 'Booking', id },
//         { type: 'Booking', id: 'LIST' },
//       ],
//     }),

//     completeBooking: builder.mutation<void, { id: number; return_date: string; condition: string }>({
//       query: ({ id, ...data }) => ({
//         url: `/${id}/complete`, 
//         method: 'POST',
//         body: data,
//       }),
//       invalidatesTags: (_result, _error, { id }) => [
//         { type: 'Booking', id },
//         { type: 'Booking', id: 'LIST' },
//       ],
//     }),

//   }),
// });

// export const {
//   useCreateBookingMutation,
//   useGetUserBookingsQuery,
//   useGetBookingByIdQuery,
//   useCancelBookingMutation,
//   useGetAllBookingsQuery,
//   useUpdateBookingStatusMutation,
//   useCompleteBookingMutation
// } = BookingApi;


















