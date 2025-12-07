// // LOCATION: Frontend (e.g., src/components/ChatBot.tsx)

// const sendMessage = async () => {
//   const userMessage = "Do you have any SUVs available?";

//   // Make sure your history matches Gemini format
//   // For simplicity, I'm sending empty history here, but you should manage state
//   const payload = {
//     message: userMessage,
//     history: [] 
//   };

//   const response = await fetch("http://localhost:3000/api/chat", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(payload),
//   });

//   const data = await response.json();
//   console.log("AI Says:", data.reply);
// };