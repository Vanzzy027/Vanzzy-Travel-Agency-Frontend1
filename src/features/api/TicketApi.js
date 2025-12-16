import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const API_BASE_URL = import.meta.env.VITE_API_URL; // Consistent with API
export const ticketApi = createApi({
    reducerPath: 'ticketApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_BASE_URL}/api`, // Update with your actual port
        prepareHeaders: (headers) => {
            // In a real app, attach Admin Token here
            const token = localStorage.getItem('token');
            if (token)
                headers.set('authorization', `Bearer ${token}`);
            return headers;
        },
    }),
    tagTypes: ['Tickets', 'AdminTickets'],
    endpoints: (builder) => ({
        // User: Get own tickets
        getUserTickets: builder.query({
            query: (userId) => `/tickets/user/${userId}`,
            providesTags: ['Tickets'],
        }),
        // User: Create ticket
        createTicket: builder.mutation({
            query: (body) => ({
                url: '/tickets',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Tickets', 'AdminTickets'], // Invalidate Admin list too
        }),
        // Admin: Get ALL tickets
        getAllTickets: builder.query({
            query: () => '/tickets',
            providesTags: ['AdminTickets'],
        }),
        // Admin: Update status & reply
        updateTicketStatus: builder.mutation({
            query: ({ ticket_id, ...body }) => ({
                url: `/tickets/${ticket_id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['AdminTickets', 'Tickets'], // Refresh both lists
        }),
    }),
});
export const { useGetUserTicketsQuery, useCreateTicketMutation, useGetAllTicketsQuery, useUpdateTicketStatusMutation } = ticketApi;
