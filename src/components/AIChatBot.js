import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect, useMemo, useCallback, } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MessageSquare, X, Send, Trash2, Car, User, Bot, Lock, Loader2, Sparkles, } from "lucide-react";
import { bookingApi } from "../features/api/BookingApi";
const AIChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const [sendMessage, { isLoading }] = bookingApi.useSendChatMessageMutation();
    const messagesEndRef = useRef(null);
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
        if (!input.trim() || !isAuthenticated)
            return;
        const userMessage = input.trim();
        setMessages((prev) => [
            ...prev,
            { role: "user", parts: [{ text: userMessage }] },
        ]);
        setInput("");
        try {
            const userId = user?.user_id ?? user?.id;
            if (userId === undefined)
                return;
            const history = messages.map((msg) => ({
                role: msg.role,
                parts: [{ text: msg.parts[0].text }],
            }));
            const response = await sendMessage({
                message: userMessage,
                history,
                userId,
            }).unwrap();
            setMessages((prev) => [
                ...prev,
                { role: "model", parts: [{ text: response.reply }] },
            ]);
        }
        catch (error) {
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
    const suggestedPrompts = useMemo(() => [
        "Find available SUVs",
        "Show me luxury cars",
        "How do I book a van?",
        "Cheapest car available",
    ], []);
    return (_jsxs("div", { className: "fixed bottom-6 right-6 z-[9999] font-sans", children: [!isOpen && (_jsx("button", { onClick: () => setIsOpen(true), className: "btn btn-primary shadow-2xl rounded-full h-16 w-16 p-0 flex items-center justify-center border-none hover:scale-105 transition-transform", children: _jsx(MessageSquare, { size: 28, className: "text-white" }) })), isOpen && (_jsxs("div", { className: "card bg-base-100 w-[380px] md:w-[420px] h-[600px] shadow-2xl border border-base-300 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300", children: [_jsxs("div", { className: "bg-primary p-4 text-primary-content flex justify-between items-center shadow-md", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "avatar placeholder", children: _jsx("div", { className: "bg-accent text-white rounded-full w-10", children: _jsx(Car, { size: 20 }) }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-bold text-sm tracking-wide uppercase", children: "VansKE AI" }), _jsxs("div", { className: "flex items-center gap-1 opacity-80 text-[10px]", children: [_jsx("span", { className: "h-2 w-2 bg-green-400 rounded-full animate-pulse" }), "Online Assistant"] })] })] }), _jsxs("div", { className: "flex gap-1", children: [_jsx("button", { onClick: () => setMessages([]), className: "btn btn-ghost btn-xs text-primary-content hover:bg-white/10", children: _jsx(Trash2, { size: 16 }) }), _jsx("button", { onClick: () => setIsOpen(false), className: "btn btn-ghost btn-xs text-primary-content hover:bg-white/10", children: _jsx(X, { size: 18 }) })] })] }), _jsx("div", { className: "bg-base-200/50 p-3 flex gap-2 overflow-x-auto no-scrollbar border-b border-base-300", children: suggestedPrompts.map((p, idx) => (_jsx("button", { onClick: () => {
                                setInput(p);
                            }, className: "btn btn-xs btn-outline btn-primary whitespace-nowrap rounded-full lowercase italic font-normal", children: p }, idx))) }), _jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-4 bg-base-100 scrollbar-thin", children: [!isAuthenticated ? (_jsxs("div", { className: "flex flex-col items-center justify-center h-full text-center space-y-4 px-6", children: [_jsx("div", { className: "p-4 bg-error/10 rounded-full text-error", children: _jsx(Lock, { size: 32 }) }), _jsxs("div", { children: [_jsx("h4", { className: "font-bold text-base-content", children: "Authentication Required" }), _jsx("p", { className: "text-xs text-base-content/60 mt-1", children: "Log in to unlock AI booking and personalized support." })] }), _jsx("button", { onClick: () => navigate("/login"), className: "btn btn-secondary btn-sm rounded-full w-full", children: "Login to Continue" })] })) : (messages.map((msg, idx) => (_jsxs("div", { className: `chat ${msg.role === "user" ? "chat-end" : "chat-start"}`, children: [_jsx("div", { className: "chat-image avatar", children: _jsx("div", { className: "w-8 rounded-full border border-base-300", children: msg.role === "user" ? (_jsx("div", { className: "bg-neutral flex items-center justify-center h-full text-white", children: _jsx(User, { size: 14 }) })) : (_jsx("div", { className: "bg-primary flex items-center justify-center h-full text-white", children: _jsx(Bot, { size: 14 }) })) }) }), _jsx("div", { className: `chat-bubble text-sm ${msg.role === "user"
                                            ? "bg-primary text-primary-content"
                                            : "bg-base-200 text-base-content border border-base-300"}`, children: msg.parts[0].text })] }, idx)))), isLoading && (_jsx("div", { className: "chat chat-start opacity-70", children: _jsxs("div", { className: "chat-bubble bg-base-200 flex items-center gap-2 text-xs italic", children: [_jsx(Loader2, { size: 14, className: "animate-spin" }), "AI is thinking..."] }) })), _jsx("div", { ref: messagesEndRef })] }), _jsxs("div", { className: "p-4 bg-base-100 border-t border-base-300", children: [_jsxs("div", { className: "relative flex items-center gap-2", children: [_jsx("input", { type: "text", value: input, onChange: (e) => setInput(e.target.value), onKeyDown: (e) => e.key === "Enter" && handleSend(), disabled: !isAuthenticated || isLoading, placeholder: isAuthenticated
                                            ? "Ask about a vehicle..."
                                            : "Please login first", className: "input input-bordered input-primary w-full pr-12 rounded-full focus:outline-none focus:ring-1 focus:ring-primary h-12 text-sm bg-base-200" }), _jsx("button", { onClick: handleSend, disabled: !input.trim() || isLoading, className: "btn btn-primary btn-circle btn-sm absolute right-2 shadow-lg", children: isLoading ? (_jsx(Loader2, { size: 16, className: "animate-spin" })) : (_jsx(Send, { size: 16 })) })] }), _jsxs("div", { className: "mt-2 flex justify-center items-center gap-1 text-[9px] uppercase tracking-widest opacity-40", children: [_jsx(Sparkles, { size: 10 }), "Powered by VansKE Core Intelligence"] })] })] }))] }));
};
export default AIChatBot;
