import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";
// API
export const ticketApi = createApi({
    reducerPath: "ticketApi",
    //  Perfectly implemented!
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Tickets", "AdminTickets"],
    endpoints: (builder) => ({
        getUserTickets: builder.query({
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
                url: "tickets",
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
            query: () => "tickets",
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
                url: `tickets/${ticket_id}`,
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
