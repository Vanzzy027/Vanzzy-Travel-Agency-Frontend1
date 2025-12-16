import { useState, useRef, useEffect, type KeyboardEvent, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { bookingApi } from '../features/api/BookingApi';
import type { RootState } from '../store/store';

// Define proper types for your user object
interface User {
  id?: number;
  user_id?: string;
  userId?: number;
  email?: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  [key: string]: any;
}

interface ChatMessage {
  role: string;
  parts: { text: string }[];
}

interface ChatResponse {
  reply: string;
  actionPerformed?: string;
  functionResult?: any;
}

// Memoized selectors to avoid unnecessary re-renders
const selectUser = (state: RootState) => state.auth.user;
const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
//const selectAuthToken = (state: RootState) => state.auth.token;

const AIChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  // Initialize with empty messages - we'll show welcome message locally
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  // Get authentication state using memoized selectors
  const user = useSelector(selectUser) as User | null;
  const isAuthenticated = useSelector(selectIsAuthenticated);
  //const authToken = useSelector(selectAuthToken);
  
  const [sendMessage, { isLoading }] = bookingApi.useSendChatMessageMutation();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat on first open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Show welcome message locally (not in Gemini history)
      setMessages([{
        role: "model",
        parts: [{ 
          text: "👋 Hello! I'm your rental assistant. I can help you:\n• Find available vehicles\n• Create bookings\n• Check booking status\n• Answer rental questions\n\nTry asking: 'Find me a Toyota SUV' or 'Book vehicle 1006 for 3 days starting tomorrow'" 
        }]
      }]);
    }
  }, [isOpen, messages.length]);

  // Helper function to get user ID from user object
  const getUserId = useCallback((user: User | null): string | number => {
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Match your user object structure
    const userId = user.user_id || user.userId || user.id;
    if (!userId) {
      throw new Error('User ID not found in user object');
    }
    
    return userId;
  }, []);

  // Helper function to get user display name
  const getUserDisplayName = useCallback((user: User | null): string => {
    if (!user) return '';
    return user.name || user.first_name || `${user.first_name} ${user.last_name}`.trim() || user.email || 'User';
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = async () => {
    if (!input.trim() || !isAuthenticated) return;

    const userMessage = input.trim();
    
    // Add User Message to UI immediately
    setMessages(prev => [...prev, { role: "user", parts: [{ text: userMessage }] }]);
    setInput("");
    setIsTyping(true);

    try {
      // Get user ID
      const userId = getUserId(user);
      
      // Prepare history for Gemini - must start with user message
      // We need to send conversation history but ensure it starts with user role
      const conversationHistory = messages
        .filter(msg => msg.role === "user" || msg.role === "model")
        .map(msg => ({
          role: msg.role as "user" | "model",
          parts: [{ text: msg.parts[0].text }]
        }));
      
      // If there's no user message in history yet, we need to start with one
     // const hasUserMessages = conversationHistory.some(msg => msg.role === "user");
      
      // Send to Backend
      const response = await sendMessage({
        message: userMessage,
        history: conversationHistory, // Send the conversation so far
        userId: userId
      }).unwrap();

      const aiResponse = response as ChatResponse;

      // Add AI Response to UI
      setMessages(prev => [...prev, { 
        role: "model", 
        parts: [{ 
          text: aiResponse.reply || "I processed your request."
        }] 
      }]);
      
if (aiResponse.actionPerformed === 'create_booking' && aiResponse.functionResult) {
  const bookingResult = typeof aiResponse.functionResult === 'string' 
    ? JSON.parse(aiResponse.functionResult) 
    : aiResponse.functionResult;
  
  if (bookingResult.status === "success") {
    // Format the booking success message nicely
    const bookingMessage = [
      `✅ **${bookingResult.message}**`,
      ``,
      `📋 Booking ID: #${bookingResult.booking_id}`,
      `🚗 Vehicle: ${bookingResult.vehicle_name}`,
      `📅 Dates: ${bookingResult.dates}`,
      `⏱️ Duration: ${bookingResult.duration}`,
      `💰 Total Amount: $${bookingResult.total_amount || 'To be calculated'}`,
      `💳 Daily Rate: $${bookingResult.daily_rate || 'N/A'}/day`,
      ``,
      `**Next Steps:**`,
      `1. Proceed to payment to confirm your booking`,
      `2. View your booking: [Dashboard → Bookings](${window.location.origin}/dashboard/bookings)`,
      `3. Contact support if you need assistance`
    ].join('\n');

    // Add formatted booking message after a short delay
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: "model",
        parts: [{
          text: bookingMessage
        }]
      }]);
    }, 800);
  } else if (bookingResult.status === "error") {
    // Show booking error message
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: "model",
        parts: [{
          text: `❌ Booking Failed: ${bookingResult.message || 'Unknown error'}\n\nPlease try again or contact support.`
        }]
      }]);
    }, 800);
  }
}
    
    } catch (error: any) {
      console.error("Chat error:", error);
      
      let errorMessage = "Sorry, I'm having trouble connecting right now. Please try again.";
      
      if (error?.status === 401) {
        errorMessage = "🔒 Your session has expired. Please log in again.";
      } else if (error?.status === 400) {
        errorMessage = "⚠️ Invalid request. Please check your input and try again.";
      } else if (error?.status === 500) {
        // Handle Gemini API error
        if (error?.data?.error?.includes('First content should be with role')) {
          errorMessage = "⚠️ Chat session error. Please clear chat and try again.";
        } else {
          errorMessage = `❌ Server error: ${error.data?.error || 'Please try again later.'}`;
        }
      } else if (error?.data?.error) {
        errorMessage = `❌ Error: ${error.data.error}`;
      } else if (error?.message) {
        errorMessage = `❌ ${error.message}`;
      }
      
      setMessages(prev => [...prev, { 
        role: "model", 
        parts: [{ text: errorMessage }] 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([{
      role: "model",
      parts: [{ 
        text: "👋 Hi! I'm your rental assistant. How can I help you today?\n\nYou can:\n• Search for vehicles\n• Create bookings\n• Check availability\n• Ask rental questions\n\nWhat would you like to do?" 
      }]
    }]);
  };

  const handlePromptClick = (prompt: string) => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    
    setInput(prompt);
    setTimeout(() => {
      handleSend();
    }, 100);
  };

  // Memoize suggested prompts
  const suggestedPrompts = useMemo(() => [
    "Find available SUVs",
    "Book a Toyota for 3 days",
    "Show me luxury vehicles",
    "Check vehicle availability for next week",
    "What's the cheapest car available?"
  ], []);

  // Format message text with links
  const formatMessageText = (text: string) => {
    // Convert markdown-like links to actual links
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts: any[] = [];
    let lastIndex = 0;
    let match;
    
    while ((match = linkRegex.exec(text)) !== null) {
      // Add text before the link
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      
      // Add the link
      parts.push(
        <a 
          key={match.index}
          href={match[2]} 
          className="text-blue-600 hover:text-blue-800 underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {match[1]}
        </a>
      );
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    
    // If no links were found, return the text as is
    if (parts.length === 0) {
      return text;
    }
    
    return parts;
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans">
      {/* Toggle Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2 animate-pulse hover:scale-105"
          aria-label="Open AI Chat"
        >
          <span className="text-xl">🤖</span>
          <span className="font-semibold">AI Assistant</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white w-[420px] h-[600px] rounded-2xl shadow-2xl flex flex-col border border-gray-300 overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-full">
                <span className="text-blue-600 text-xl">🚗</span>
              </div>
              <div>
                <h3 className="font-bold text-lg">VansKE Rental AI</h3>
                <p className="text-blue-100 text-xs">
                  {isAuthenticated && user ? `Hi, ${getUserDisplayName(user)}!` : '🔒 Login required'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={clearChat}
                className="text-sm bg-white/20 hover:bg-white/30 p-1.5 rounded-full transition hover:scale-110"
                title="Clear chat history"
                aria-label="Clear chat"
              >
                🗑️
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-sm bg-white/20 hover:bg-white/30 p-1.5 rounded-full transition hover:scale-110"
                aria-label="Close chat"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Suggested Prompts */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 border-b border-blue-100">
            <p className="text-xs text-gray-600 mb-2 font-medium">💡 Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePromptClick(prompt)}
                  disabled={!isAuthenticated}
                  className="text-xs bg-white border border-blue-200 hover:border-blue-400 hover:bg-blue-50 text-gray-700 px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-sm active:scale-95"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white">
            {!isAuthenticated && (
              <div className="text-center my-4 animate-fadeIn">
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 shadow-sm">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-yellow-600 text-xl">🔒</span>
                  </div>
                  <p className="text-yellow-700 text-sm font-medium mb-3">
                    Authentication Required
                  </p>
                  <p className="text-yellow-600 text-xs mb-4">
                    Please log in to use the AI assistant for booking vehicles
                  </p>
                  <button
                    onClick={() => window.location.href = '/login'}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:shadow-md transition hover:scale-105 active:scale-95"
                  >
                    Log In Now
                  </button>
                </div>
              </div>
            )}
            
            {messages.length === 0 && isAuthenticated ? (
              <div className="text-center my-4 animate-fadeIn">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4 shadow-sm">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 text-xl">🤖</span>
                  </div>
                  <p className="text-blue-700 text-sm font-medium mb-3">
                    AI Rental Assistant Ready
                  </p>
                  <p className="text-blue-600 text-xs mb-4">
                    Start by typing a message or clicking a prompt above
                  </p>
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`mb-4 animate-slideIn ${msg.role === 'user' ? 'text-right' : 'text-left'}`}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="inline-flex max-w-[85%]">
                    {msg.role === 'model' && (
                      <div className="flex-shrink-0 mr-2 mt-1">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-sm">
                          <span className="text-white text-sm">🤖</span>
                        </div>
                      </div>
                    )}
                    <div className={`rounded-2xl px-4 py-3 shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none' 
                        : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none'
                    }`}>
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {formatMessageText(msg.parts[0].text)}
                      </div>
                      {msg.role === 'model' && (
                        <div className="text-xs mt-2 opacity-60">
                          {idx === 0 ? "AI Assistant" : "VansKE AI"}
                        </div>
                      )}
                    </div>
                    {msg.role === 'user' && (
                      <div className="flex-shrink-0 ml-2 mt-1">
                        <div className="w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center shadow-sm">
                          <span className="text-white text-sm">👤</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            
            {isTyping && (
              <div className="mb-4 text-left animate-pulse">
                <div className="inline-flex max-w-[85%]">
                  <div className="flex-shrink-0 mr-2 mt-1">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">🤖</span>
                    </div>
                  </div>
                  <div className="bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="text-xs text-gray-500">Thinking</div>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4 bg-white">
            {!isAuthenticated ? (
              <div className="text-center py-3">
                <p className="text-gray-600 text-sm mb-3">Log in to chat with AI Assistant</p>
                <button 
                  onClick={() => window.location.href = '/login'}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:shadow-lg transition hover:scale-105 active:scale-95 shadow-md"
                >
                  🔐 Log In to Continue
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full border border-gray-300 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder-gray-500 text-sm shadow-inner"
                    placeholder="Type your message here..."
                    disabled={isLoading || isTyping}
                    aria-label="Chat input"
                  />
                  <div className="absolute right-3 top-3 text-xs text-gray-400">
                    ⏎ Enter
                  </div>
                </div>
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading || isTyping || !isAuthenticated}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-full hover:shadow-lg disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center min-w-[44px] hover:scale-105 active:scale-95 shadow-md"
                  aria-label="Send message"
                >
                  {isLoading || isTyping ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <span className="text-lg">➤</span>
                  )}
                </button>
              </div>
            )}
            <div className="text-xs text-gray-400 mt-3 text-center flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Powered by Gemini AI • Vehicle rental specialist</span>
            </div>
          </div>
        </div>
      )}

      {/* Add CSS animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideIn {
          animation: slideIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AIChatBot;
