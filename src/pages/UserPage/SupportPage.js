import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useGetUserTicketsQuery, useCreateTicketMutation } from '../../features/api/TicketApi';
import { toast } from 'sonner';
// Get logged-in user from localStorage
const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
const userId = storedUser?.user_id || ""; // safe fallback
const SupportPage = () => {
    // Fetch tickets for logged-in user
    const { data: tickets, isLoading } = useGetUserTicketsQuery(userId);
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Status Style Helper
    const getStatusColor = (status) => {
        switch (status) {
            case 'Open': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
            case 'In Progress': return 'bg-[#F57251]/20 text-[#F57251] border-[#F57251]/50';
            case 'Resolved': return 'bg-green-500/20 text-green-400 border-green-500/50';
            case 'Closed': return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };
    if (isLoading)
        return (_jsx("div", { className: "min-h-screen bg-[#001524] flex items-center justify-center text-[#027480] animate-pulse", children: "Loading Support Center..." }));
    return (_jsxs("div", { className: "min-h-screen bg-[#001524] p-6 md:p-10 text-[#E9E6DD] pb-20", children: [_jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-[#E9E6DD]", children: "Support Center" }), _jsx("p", { className: "text-[#C4AD9D] mt-1", children: "Track your issues and get help from our team." })] }), _jsxs("button", { onClick: () => setIsModalOpen(true), className: "bg-[#F57251] hover:bg-[#d65f41] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2", children: [_jsx("span", { children: "+" }), " Create New Ticket"] })] }), _jsx("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: tickets && tickets.length > 0 ? (tickets.map((ticket) => (_jsx(TicketCard, { ticket: ticket, getStatusColor: getStatusColor }, ticket.ticket_id)))) : (_jsxs("div", { className: "col-span-full text-center py-20 bg-[#0f2434]/50 rounded-3xl border border-[#445048] border-dashed", children: [_jsx("div", { className: "text-5xl mb-4", children: "\uD83C\uDFAB" }), _jsx("h3", { className: "text-xl font-bold text-white mb-2", children: "No tickets yet" }), _jsx("p", { className: "text-[#C4AD9D]", children: "You haven't raised any support requests." })] })) }), isModalOpen && (_jsx(CreateTicketModal, { onClose: () => setIsModalOpen(false), userId: userId }))] }));
};
// ------------------------ TICKET CARD ------------------------
const TicketCard = ({ ticket, getStatusColor }) => {
    const stages = ['Open', 'In Progress', 'Resolved'];
    const currentStageIndex = stages.indexOf(ticket.status) === -1
        ? 3
        : stages.indexOf(ticket.status);
    return (_jsxs("div", { className: "bg-[#0f2434] rounded-2xl p-6 border border-[#445048] hover:border-[#027480] transition-colors relative overflow-hidden group", children: [_jsxs("div", { className: `absolute top-0 right-0 px-3 py-1 text-xs font-bold rounded-bl-xl ${ticket.priority === 'High'
                    ? 'bg-red-500 text-white'
                    : ticket.priority === 'Medium'
                        ? 'bg-yellow-500 text-black'
                        : 'bg-[#445048] text-[#C4AD9D]'}`, children: [ticket.priority, " Priority"] }), _jsx("div", { className: "flex justify-between items-start mb-4 mt-2", children: _jsxs("div", { children: [_jsx("span", { className: "text-[#027480] text-xs font-bold uppercase tracking-wider mb-1 block", children: ticket.category }), _jsx("h3", { className: "text-xl font-bold text-white", children: ticket.subject }), _jsxs("p", { className: "text-[#C4AD9D] text-xs mt-1", children: ["ID: #", ticket.ticket_id, " \u2022 ", new Date(ticket.created_at).toLocaleDateString()] })] }) }), _jsx("div", { className: "bg-[#001524] p-4 rounded-xl border border-[#445048]/50 mb-6", children: _jsx("p", { className: "text-[#E9E6DD] text-sm leading-relaxed", children: ticket.description }) }), _jsxs("div", { className: "mb-6", children: [_jsxs("div", { className: "flex justify-between text-xs text-[#C4AD9D] mb-2 uppercase tracking-wide", children: [_jsx("span", { children: "Received" }), _jsx("span", { children: "Reviewing" }), _jsx("span", { children: "Resolved" })] }), _jsx("div", { className: "h-2 bg-[#001524] rounded-full overflow-hidden flex", children: stages.map((stage, idx) => (_jsx("div", { className: `flex-1 transition-all duration-500 border-r border-[#001524] last:border-0 ${idx <= currentStageIndex ? 'bg-[#027480]' : 'bg-[#445048]/30'}` }, stage))) })] }), _jsxs("div", { className: "flex items-center justify-between mt-auto", children: [_jsx("span", { className: `px-3 py-1 rounded-lg text-xs font-bold border ${getStatusColor(ticket.status)}`, children: ticket.status }), ticket.admin_response && (_jsxs("div", { className: "text-xs text-[#C4AD9D] text-right max-w-[60%]", children: [_jsx("span", { className: "text-[#F57251] font-bold", children: "Admin Note:" }), ' ', ticket.admin_response] }))] })] }));
};
// ------------------------ CREATE TICKET MODAL ------------------------
const CreateTicketModal = ({ onClose, userId }) => {
    const [createTicket, { isLoading }] = useCreateTicketMutation();
    const [formData, setFormData] = useState({
        subject: "",
        category: "General",
        priority: "Low",
        description: ""
    });
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createTicket({ ...formData, user_id: userId }).unwrap();
            toast.success('Ticket created successfully!');
            onClose();
        }
        catch {
            toast.error('Failed to create ticket.');
        }
    };
    return (_jsx("div", { className: "fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4", children: _jsxs("div", { className: "bg-[#001524] rounded-2xl w-full max-w-lg border border-[#445048] shadow-2xl", children: [_jsxs("div", { className: "p-6 border-b border-[#445048] flex justify-between items-center", children: [_jsx("h2", { className: "text-xl font-bold text-[#E9E6DD]", children: "New Support Ticket" }), _jsx("button", { onClick: onClose, className: "text-[#C4AD9D] hover:text-[#F57251]", children: "\u2715" })] }), _jsxs("form", { onSubmit: handleSubmit, className: "p-6 space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-[#C4AD9D] text-sm mb-1", children: "Subject" }), _jsx("input", { required: true, type: "text", className: "w-full bg-[#0f2434] border border-[#445048] rounded-lg p-3 text-white focus:border-[#027480] outline-none", placeholder: "Brief summary of the issue", value: formData.subject, onChange: (e) => setFormData({ ...formData, subject: e.target.value }) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-[#C4AD9D] text-sm mb-1", children: "Category" }), _jsxs("select", { className: "w-full bg-[#0f2434] border border-[#445048] rounded-lg p-3 text-white focus:border-[#027480] outline-none", value: formData.category, onChange: (e) => setFormData({ ...formData, category: e.target.value }), children: [_jsx("option", { children: "General" }), _jsx("option", { children: "Technical Issue" }), _jsx("option", { children: "Billing & Payments" }), _jsx("option", { children: "Vehicle Condition" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-[#C4AD9D] text-sm mb-1", children: "Priority" }), _jsxs("select", { className: "w-full bg-[#0f2434] border border-[#445048] rounded-lg p-3 text-white focus:border-[#027480] outline-none", value: formData.priority, onChange: (e) => setFormData({ ...formData, priority: e.target.value, }), children: [_jsx("option", { children: "Low" }), _jsx("option", { children: "Medium" }), _jsx("option", { children: "High" })] })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-[#C4AD9D] text-sm mb-1", children: "Description" }), _jsx("textarea", { required: true, rows: 5, className: "w-full bg-[#0f2434] border border-[#445048] rounded-lg p-3 text-white focus:border-[#027480] outline-none resize-none", placeholder: "Please provide details...", value: formData.description, onChange: (e) => setFormData({ ...formData, description: e.target.value }) })] }), _jsxs("div", { className: "pt-4 flex gap-3", children: [_jsx("button", { type: "button", onClick: onClose, className: "flex-1 py-3 rounded-xl border border-[#445048] text-[#C4AD9D] hover:bg-[#445048]/20 font-bold", children: "Cancel" }), _jsx("button", { type: "submit", disabled: isLoading, className: "flex-1 py-3 rounded-xl bg-[#F57251] hover:bg-[#d65f41] text-white font-bold shadow-lg shadow-[#F57251]/20", children: isLoading ? 'Submitting...' : 'Submit Ticket' })] })] })] }) }));
};
export default SupportPage;
