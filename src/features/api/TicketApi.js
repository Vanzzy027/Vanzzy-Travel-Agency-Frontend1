// import { createApi } from "@reduxjs/toolkit/query/react";
// import { baseQueryWithReauth } from "./baseQuery";
// // Types
// export interface Ticket {
//   ticket_id: number;
//   user_id: string;
//   subject: string;
//   category: string;
//   priority: "Low" | "Medium" | "High";
//   description: string;
//   status: "Open" | "In Progress" | "Resolved" | "Closed";
//   admin_response?: string;
//   created_at: string;
//   updated_at: string;
//   full_name?: string;
//   email?: string;
// }
// export interface UpdateTicketPayload {
//   ticket_id: number;
//   status: string;
//   admin_response: string;
// }
// // API
// export const ticketApi = createApi({
//   reducerPath: "ticketApi",
//   // ✅ USE YOUR CUSTOM BASE QUERY
//   baseQuery: baseQueryWithReauth,
//   tagTypes: ["Tickets", "AdminTickets"],
//   endpoints: (builder) => ({
//     getUserTickets: builder.query<Ticket[], string>({
//       query: (userId) => `/tickets/user/${userId}`,
//       providesTags: ["Tickets"],
//     }),
//     createTicket: builder.mutation<void, Partial<Ticket>>({
//       query: (body) => ({
//         url: "/tickets",
//         method: "POST",
//         body,
//       }),
//       invalidatesTags: ["Tickets", "AdminTickets"],
//     }),
//     getAllTickets: builder.query<Ticket[], void>({
//       query: () => "/tickets",
//       providesTags: ["AdminTickets"],
//     }),
//     updateTicketStatus: builder.mutation<void, UpdateTicketPayload>({
//       query: ({ ticket_id, ...body }) => ({
//         url: `/tickets/${ticket_id}`,
//         method: "PUT",
//         body,
//       }),
//       invalidatesTags: ["AdminTickets", "Tickets"],
//     }),
//   }),
// });
// export const {
//   useGetUserTicketsQuery,
//   useCreateTicketMutation,
//   useGetAllTicketsQuery,
//   useUpdateTicketStatusMutation,
// } = ticketApi;
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";
// API
export const ticketApi = createApi({
    reducerPath: "ticketApi",
    // ✅ Perfectly implemented!
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Tickets", "AdminTickets"],
    endpoints: (builder) => ({
        getUserTickets: builder.query({
            // Removed leading slash for consistency
            query: (userId) => `tickets/user/${userId}`,
            providesTags: (result) => result
                ? [
                    ...result.map(({ ticket_id }) => ({
                        type: "Tickets",
                        id: ticket_id,
                    })),
                    { type: "Tickets", id: "LIST" },
                ]
                : [{ type: "Tickets", id: "LIST" }],
        }),
        createTicket: builder.mutation({
            query: (body) => ({
                url: "tickets", // Removed leading slash
                method: "POST",
                body,
            }),
            // Invalidate the LIST so the new ticket appears, but don't dump the individual caches
            invalidatesTags: [
                { type: "Tickets", id: "LIST" },
                { type: "AdminTickets", id: "LIST" },
            ],
        }),
        getAllTickets: builder.query({
            query: () => "tickets", // Removed leading slash
            providesTags: (result) => result
                ? [
                    ...result.map(({ ticket_id }) => ({
                        type: "AdminTickets",
                        id: ticket_id,
                    })),
                    { type: "AdminTickets", id: "LIST" },
                ]
                : [{ type: "AdminTickets", id: "LIST" }],
        }),
        updateTicketStatus: builder.mutation({
            query: ({ ticket_id, ...body }) => ({
                url: `tickets/${ticket_id}`, // Removed leading slash
                method: "PUT",
                body,
            }),
            // 🔥 Now it ONLY updates the specific ticket that was changed!
            invalidatesTags: (_result, _error, { ticket_id }) => [
                { type: "AdminTickets", id: ticket_id },
                { type: "Tickets", id: ticket_id },
            ],
        }),
    }),
});
export const { useGetUserTicketsQuery, useCreateTicketMutation, useGetAllTicketsQuery, useUpdateTicketStatusMutation, } = ticketApi;
