import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Extended Interface for Admin View (includes User details)
export interface Ticket {
  ticket_id: number;
  user_id: string;
  subject: string;
  category: string;
  priority: 'Low' | 'Medium' | 'High';
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  admin_response?: string;
  created_at: string;
  updated_at: string;
  // Extra fields from the JOIN in backend
  full_name?: string; 
  email?: string;
}

export interface UpdateTicketPayload {
  ticket_id: number;
  status: string;
  admin_response: string;
}

export const ticketApi = createApi({
  reducerPath: 'ticketApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'https://vanske-car-rental.azurewebsites.net/api', // Update with your actual port
    prepareHeaders: (headers) => {
      // In a real app, attach Admin Token here
      const token = localStorage.getItem('token'); 
      if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Tickets', 'AdminTickets'],
  endpoints: (builder) => ({
    // User: Get own tickets
    getUserTickets: builder.query<Ticket[], string>({
      query: (userId) => `/tickets/user/${userId}`,
      providesTags: ['Tickets'],
    }),
    
    // User: Create ticket
    createTicket: builder.mutation<void, Partial<Ticket>>({
      query: (body) => ({
        url: '/tickets',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Tickets', 'AdminTickets'], // Invalidate Admin list too
    }),

    // Admin: Get ALL tickets
    getAllTickets: builder.query<Ticket[], void>({
      query: () => '/tickets',
      providesTags: ['AdminTickets'],
    }),

    // Admin: Update status & reply
    updateTicketStatus: builder.mutation<void, UpdateTicketPayload>({
      query: ({ ticket_id, ...body }) => ({
        url: `/tickets/${ticket_id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['AdminTickets', 'Tickets'], // Refresh both lists
    }),
  }),
});

export const { 
  useGetUserTicketsQuery, 
  useCreateTicketMutation, 
  useGetAllTicketsQuery, 
  useUpdateTicketStatusMutation 
} = ticketApi;

// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// // export interface Ticket {
// //   ticket_id: number;
// //   user_id: string;
// //   subject: string;
// //   category: string;
// //   priority: 'Low' | 'Medium' | 'High';
// //   description: string;
// //   status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
// //   admin_response?: string;
// //   created_at: string;
// //   updated_at: string;
// // }
// export interface Ticket {
//   ticket_id: number;
//   user_id: string;
//   subject: string;
//   category: string;
//   priority: 'Low' | 'Medium' | 'High';
//   description: string;
//   status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
//   admin_response?: string;
//   created_at: string;
//   updated_at: string;
//   // Extra fields from the JOIN in backend
//   full_name?: string; 
//   email?: string;
// }

// export interface UpdateTicketPayload {
//   ticket_id: number;
//   status: string;
//   admin_response: string;
// }

// export const ticketApi = createApi({
//   reducerPath: 'ticketApi',
//   baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/api' }), // Check your base URL

//     prepareHeaders: (headers) => {
//       // In a real app, attach Admin Token here
//       const token = localStorage.getItem('token'); 
//       if (token) headers.set('authorization', `Bearer ${token}`);
//       return headers;
//     },



//   tagTypes: ['Tickets','AdminTickets'],
//   endpoints: (builder) => ({
//     getUserTickets: builder.query<Ticket[], string>({
//       query: (userId) => `/tickets/user/${userId}`,
//       providesTags: ['Tickets'],
//     }),
//     createTicket: builder.mutation<void, Partial<Ticket>>({
//       query: (body) => ({
//         url: '/tickets',
//         method: 'POST',
//         body,
//       }),
//       invalidatesTags: ['Tickets'],
//     }),
//   }),
// });

// export const { useGetUserTicketsQuery, useCreateTicketMutation } = ticketApi;