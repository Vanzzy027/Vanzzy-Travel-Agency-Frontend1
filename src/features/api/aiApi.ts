// // Add inside endpoints: (builder) => ({ ...
//     sendChatMessage: builder.mutation<{ reply: string; actionPerformed?: string }, { message: string; history: any[]; userId: string }>({
//       query: (body) => ({
//         url: '/chat', // Ensure this route exists in your backend
//         method: 'POST',
//         body,
//       }),
//     }),