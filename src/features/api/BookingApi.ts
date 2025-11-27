import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Booking {
  booking_id: number;
  user_id: string;
  vehicle_id: number;
  start_date: string;
  end_date: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface CreateBookingRequest {
  vehicle_id: number;
  start_date: string;
  end_date: string;
  total_amount: number;
}



export const BookingApi = createApi({
  reducerPath: 'bookingApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000/api/bookings',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Booking'],
  endpoints: (builder) => ({
    // Create new booking
    createBooking: builder.mutation<Booking, CreateBookingRequest>({
      query: (bookingData) => ({
        url: '',
        method: 'POST',
        body: bookingData,
      }),
      invalidatesTags: ['Booking'],
    }),



    // Get user's bookings
    // getUserBookings: builder.query<Booking[], void>({
    //   query: () => '/my-bookings',
    //   providesTags: ['Booking'],
    // }),

// Example for BookingAPI.ts
getUserBookings: builder.query<Booking[], void>({
  query: () => '/my-bookings',
  transformResponse: (response: any) => {
    if (Array.isArray(response)) return response;
    if (response?.data && Array.isArray(response.data)) return response.data;
    if (response?.bookings && Array.isArray(response.bookings)) return response.bookings;
    return [];
  },
  providesTags: (result = []) => [
    ...result.map(({ booking_id }) => ({ type: 'Booking' as const, id: booking_id })),
    { type: 'Booking', id: 'LIST' },
  ],
}),


    // Get booking by ID
    getBookingById: builder.query<Booking, number>({
      query: (id) => `/${id}`,
      providesTags: ['Booking'],
    }),

    // Cancel booking
    cancelBooking: builder.mutation<Booking, number>({
      query: (id) => ({
        url: `/${id}/cancel`,
        method: 'POST',
      }),
      invalidatesTags: ['Booking'],
    }),
  }),
});

export const {
  useCreateBookingMutation,
  useGetUserBookingsQuery,
  useGetBookingByIdQuery,
  useCancelBookingMutation,
} = BookingApi;