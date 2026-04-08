import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  MessageSquare,
  X,
  Send,
  Trash2,
  Car,
  User,
  Bot,
  Lock,
  Loader2,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { bookingApi } from "../features/api/BookingApi";
import type { RootState } from "../store/store";

interface User {
  user_id?: string;
  id?: number;
}

interface ChatMessage {
  role: string;
  parts: { text: string }[];
}

const AIChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const user = useSelector(
    (state: RootState) => state.auth.user as User | null,
  );
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  const [sendMessage, { isLoading }] = bookingApi.useSendChatMessageMutation();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: "model",
          parts: [
            {
              text: "Hello! I'm your VansKE assistant. I can help you find vehicles, check availability, or manage your bookings. How can I help you today?",
            },
          ],
        },
      ]);
    }
  }, [isOpen, messages.length]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || !isAuthenticated) return;

    const userMessage = input.trim();
    setMessages((prev) => [
      ...prev,
      { role: "user", parts: [{ text: userMessage }] },
    ]);
    setInput("");

    try {
      const userId = user?.user_id ?? user?.id;
      if (userId === undefined) return;

      const history = messages.map((msg) => ({
        role: msg.role as "user" | "model",
        parts: [{ text: msg.parts[0].text }],
      }));

      const response: any = await sendMessage({
        message: userMessage,
        history,
        userId,
      }).unwrap();

      setMessages((prev) => [
        ...prev,
        { role: "model", parts: [{ text: response.reply }] },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          parts: [
            { text: "I'm having trouble connecting. Please try again later." },
          ],
        },
      ]);
    }
  };

  const suggestedPrompts = useMemo(
    () => [
      "Find available SUVs",
      "Show me luxury cars",
      "How do I book a van?",
      "Cheapest car available",
    ],
    [],
  );

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="btn btn-primary shadow-2xl rounded-full h-16 w-16 p-0 flex items-center justify-center border-none hover:scale-105 transition-transform"
        >
          <MessageSquare size={28} className="text-white" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="card bg-base-100 w-[380px] md:w-[420px] h-[600px] shadow-2xl border border-base-300 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Custom Header */}
          <div className="bg-primary p-4 text-primary-content flex justify-between items-center shadow-md">
            <div className="flex items-center gap-3">
              <div className="avatar placeholder">
                <div className="bg-accent text-white rounded-full w-10">
                  <Car size={20} />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide uppercase">
                  VansKE AI
                </h3>
                <div className="flex items-center gap-1 opacity-80 text-[10px]">
                  <span className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></span>
                  Online Assistant
                </div>
              </div>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setMessages([])}
                className="btn btn-ghost btn-xs text-primary-content hover:bg-white/10"
              >
                <Trash2 size={16} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="btn btn-ghost btn-xs text-primary-content hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Quick Prompts Container */}
          <div className="bg-base-200/50 p-3 flex gap-2 overflow-x-auto no-scrollbar border-b border-base-300">
            {suggestedPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInput(p);
                }}
                className="btn btn-xs btn-outline btn-primary whitespace-nowrap rounded-full lowercase italic font-normal"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-base-100 scrollbar-thin">
            {!isAuthenticated ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4 px-6">
                <div className="p-4 bg-error/10 rounded-full text-error">
                  <Lock size={32} />
                </div>
                <div>
                  <h4 className="font-bold text-base-content">
                    Authentication Required
                  </h4>
                  <p className="text-xs text-base-content/60 mt-1">
                    Log in to unlock AI booking and personalized support.
                  </p>
                </div>
                <button
                  onClick={() => navigate("/login")}
                  className="btn btn-secondary btn-sm rounded-full w-full"
                >
                  Login to Continue
                </button>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`chat ${msg.role === "user" ? "chat-end" : "chat-start"}`}
                >
                  <div className="chat-image avatar">
                    <div className="w-8 rounded-full border border-base-300">
                      {msg.role === "user" ? (
                        <div className="bg-neutral flex items-center justify-center h-full text-white">
                          <User size={14} />
                        </div>
                      ) : (
                        <div className="bg-primary flex items-center justify-center h-full text-white">
                          <Bot size={14} />
                        </div>
                      )}
                    </div>
                  </div>
                  <div
                    className={`chat-bubble text-sm ${
                      msg.role === "user"
                        ? "bg-primary text-primary-content"
                        : "bg-base-200 text-base-content border border-base-300"
                    }`}
                  >
                    {msg.parts[0].text}
                  </div>
                </div>
              ))
            )}

            {isLoading && (
              <div className="chat chat-start opacity-70">
                <div className="chat-bubble bg-base-200 flex items-center gap-2 text-xs italic">
                  <Loader2 size={14} className="animate-spin" />
                  AI is thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-4 bg-base-100 border-t border-base-300">
            <div className="relative flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                disabled={!isAuthenticated || isLoading}
                placeholder={
                  isAuthenticated
                    ? "Ask about a vehicle..."
                    : "Please login first"
                }
                className="input input-bordered input-primary w-full pr-12 rounded-full focus:outline-none focus:ring-1 focus:ring-primary h-12 text-sm bg-base-200"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="btn btn-primary btn-circle btn-sm absolute right-2 shadow-lg"
              >
                {isLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Send size={16} />
                )}
              </button>
            </div>
            <div className="mt-2 flex justify-center items-center gap-1 text-[9px] uppercase tracking-widest opacity-40">
              <Sparkles size={10} />
              Powered by VansKE Core Intelligence
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChatBot;
