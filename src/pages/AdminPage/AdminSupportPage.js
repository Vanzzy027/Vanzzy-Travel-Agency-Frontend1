import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useGetAllTicketsQuery, useUpdateTicketStatusMutation } from '../../features/api/TicketApi';
import { toast } from 'sonner';
const AdminSupportPage = () => {
    const { data: tickets, isLoading, error } = useGetAllTicketsQuery();
    const [filterStatus, setFilterStatus] = useState('All');
    const [selectedTicket, setSelectedTicket] = useState(null);
    // --- DERIVED STATE ---
    const filteredTickets = tickets?.filter(t => filterStatus === 'All' ? true : t.status === filterStatus) || [];
    const stats = {
        total: tickets?.length || 0,
        open: tickets?.filter(t => t.status === 'Open').length || 0,
        progress: tickets?.filter(t => t.status === 'In Progress').length || 0,
        resolved: tickets?.filter(t => t.status === 'Resolved').length || 0,
    };
    if (isLoading)
        return _jsx("div", { className: "p-10 text-[#027480] animate-pulse", children: "Loading Admin Console..." });
    if (error)
        return _jsx("div", { className: "p-10 text-red-500", children: "Failed to load tickets." });
    return (_jsxs("div", { className: "min-h-screen bg-[#001524] p-6 text-[#E9E6DD]", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-3xl font-bold mb-2", children: "Support Tickets" }), _jsx("p", { className: "text-[#C4AD9D] mb-6", children: "Manage and respond to user inquiries." }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [_jsx(StatCard, { label: "Total Tickets", value: stats.total }), _jsx(StatCard, { label: "Pending", value: stats.open, color: "text-yellow-500", border: "border-yellow-500/30" }), _jsx(StatCard, { label: "In Progress", value: stats.progress, color: "text-[#F57251]", border: "border-[#F57251]/30" }), _jsx(StatCard, { label: "Resolved", value: stats.resolved, color: "text-green-500", border: "border-green-500/30" })] })] }), _jsxs("div", { className: "bg-[#0f2434] rounded-xl border border-[#445048] overflow-hidden", children: [_jsx("div", { className: "p-4 border-b border-[#445048] flex gap-2 overflow-x-auto", children: ['All', 'Open', 'In Progress', 'Resolved', 'Closed'].map(status => (_jsx("button", { onClick: () => setFilterStatus(status), className: `px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${filterStatus === status
                                ? 'bg-[#027480] text-white'
                                : 'bg-[#001524] text-[#C4AD9D] hover:bg-[#1a3b4b]'}`, children: status }, status))) }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-left border-collapse", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-[#001524] text-[#C4AD9D] text-xs uppercase tracking-wider", children: [_jsx("th", { className: "p-4", children: "ID" }), _jsx("th", { className: "p-4", children: "User" }), _jsx("th", { className: "p-4", children: "Subject" }), _jsx("th", { className: "p-4", children: "Priority" }), _jsx("th", { className: "p-4", children: "Status" }), _jsx("th", { className: "p-4", children: "Date" }), _jsx("th", { className: "p-4", children: "Action" })] }) }), _jsxs("tbody", { className: "text-sm divide-y divide-[#445048]/50", children: [filteredTickets.map(ticket => (_jsxs("tr", { className: "hover:bg-[#152e40] transition-colors group", children: [_jsxs("td", { className: "p-4 text-[#445048] font-mono", children: ["#", ticket.ticket_id] }), _jsxs("td", { className: "p-4", children: [_jsx("div", { className: "font-bold text-white", children: ticket.full_name || 'Guest' }), _jsx("div", { className: "text-xs text-[#C4AD9D]", children: ticket.email })] }), _jsxs("td", { className: "p-4", children: [_jsx("div", { className: "font-medium text-[#E9E6DD] truncate max-w-[200px]", children: ticket.subject }), _jsx("div", { className: "text-xs text-[#027480] uppercase tracking-wide", children: ticket.category })] }), _jsx("td", { className: "p-4", children: _jsx(PriorityBadge, { priority: ticket.priority }) }), _jsx("td", { className: "p-4", children: _jsx(StatusBadge, { status: ticket.status }) }), _jsx("td", { className: "p-4 text-[#C4AD9D]", children: new Date(ticket.created_at).toLocaleDateString() }), _jsx("td", { className: "p-4", children: _jsx("button", { onClick: () => setSelectedTicket(ticket), className: "text-[#027480] hover:text-[#F57251] font-bold text-xs uppercase border border-[#027480] hover:border-[#F57251] px-3 py-1 rounded transition-colors", children: "Manage" }) })] }, ticket.ticket_id))), filteredTickets.length === 0 && (_jsx("tr", { children: _jsx("td", { colSpan: 7, className: "p-8 text-center text-[#C4AD9D]", children: "No tickets found." }) }))] })] }) })] }), selectedTicket && (_jsx(ResolveTicketModal, { ticket: selectedTicket, onClose: () => setSelectedTicket(null) }))] }));
};
// --- SUB-COMPONENTS ---
const StatCard = ({ label, value, color = 'text-white', border = 'border-[#445048]' }) => (_jsxs("div", { className: `bg-[#0f2434] p-4 rounded-xl border ${border}`, children: [_jsx("p", { className: "text-[#C4AD9D] text-xs uppercase mb-1", children: label }), _jsx("p", { className: `text-2xl font-bold ${color}`, children: value })] }));
const PriorityBadge = ({ priority }) => {
    const colors = {
        High: 'bg-red-500/20 text-red-400',
        Medium: 'bg-yellow-500/20 text-yellow-400',
        Low: 'bg-gray-500/20 text-gray-400'
    };
    return _jsx("span", { className: `px-2 py-1 rounded text-xs font-bold ${colors[priority]}`, children: priority });
};
const StatusBadge = ({ status }) => {
    const colors = {
        Open: 'bg-blue-500/20 text-blue-400',
        'In Progress': 'bg-[#F57251]/20 text-[#F57251]',
        Resolved: 'bg-green-500/20 text-green-400',
        Closed: 'bg-gray-500/20 text-gray-400'
    };
    return _jsx("span", { className: `px-2 py-1 rounded text-xs font-bold ${colors[status]}`, children: status });
};
// --- RESOLVE MODAL COMPONENT ---
const ResolveTicketModal = ({ ticket, onClose }) => {
    const [updateTicket, { isLoading }] = useUpdateTicketStatusMutation();
    const [formState, setFormState] = useState({
        status: ticket.status,
        admin_response: ticket.admin_response || ''
    });
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateTicket({
                ticket_id: ticket.ticket_id,
                status: formState.status,
                admin_response: formState.admin_response
            }).unwrap();
            toast.success(`Ticket #${ticket.ticket_id} updated successfully`);
            onClose();
        }
        catch (err) {
            toast.error('Failed to update ticket');
        }
    };
    return (_jsx("div", { className: "fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4", children: _jsxs("div", { className: "bg-[#001524] rounded-2xl w-full max-w-2xl border border-[#445048] shadow-2xl flex flex-col max-h-[90vh]", children: [_jsxs("div", { className: "p-6 border-b border-[#445048] flex justify-between items-center bg-[#0f2434] rounded-t-2xl", children: [_jsxs("div", { children: [_jsxs("h2", { className: "text-xl font-bold text-[#E9E6DD] flex items-center gap-2", children: ["Resolve Ticket #", ticket.ticket_id, _jsx(PriorityBadge, { priority: ticket.priority })] }), _jsxs("p", { className: "text-sm text-[#C4AD9D]", children: ["User: ", ticket.full_name, " (", ticket.email, ")"] })] }), _jsx("button", { onClick: onClose, className: "text-[#C4AD9D] hover:text-[#F57251] text-2xl", children: "\u00D7" })] }), _jsxs("div", { className: "p-6 overflow-y-auto flex-1", children: [_jsxs("div", { className: "bg-[#445048]/20 p-4 rounded-xl border border-[#445048] mb-6", children: [_jsxs("div", { className: "flex justify-between mb-2", children: [_jsx("span", { className: "text-[#027480] text-xs font-bold uppercase", children: ticket.category }), _jsx("span", { className: "text-[#C4AD9D] text-xs", children: new Date(ticket.created_at).toLocaleString() })] }), _jsx("h3", { className: "font-bold text-[#E9E6DD] text-lg mb-2", children: ticket.subject }), _jsx("p", { className: "text-[#C4AD9D] leading-relaxed whitespace-pre-wrap", children: ticket.description })] }), _jsxs("form", { id: "resolve-form", onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-[#C4AD9D] text-sm mb-2 font-bold", children: "Update Status" }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: ['Open', 'In Progress', 'Resolved', 'Closed'].map(status => (_jsxs("label", { className: `
                    cursor-pointer border rounded-lg p-3 text-center text-sm font-bold transition-all
                    ${formState.status === status
                                                    ? 'bg-[#027480] border-[#027480] text-white shadow-[0_0_10px_rgba(2,116,128,0.4)]'
                                                    : 'bg-[#001524] border-[#445048] text-[#C4AD9D] hover:bg-[#0f2434]'}
                  `, children: [_jsx("input", { type: "radio", name: "status", value: status, checked: formState.status === status, onChange: (e) => setFormState({ ...formState, status: e.target.value }), className: "hidden" }), status] }, status))) })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-[#C4AD9D] text-sm mb-2 font-bold", children: ["Admin Response", _jsx("span", { className: "text-xs font-normal ml-2 text-gray-500", children: "(Visible to user)" })] }), _jsx("textarea", { required: true, rows: 5, className: "w-full bg-[#0f2434] border border-[#445048] rounded-xl p-4 text-[#E9E6DD] focus:border-[#027480] outline-none transition-colors", placeholder: "Type your response or solution here...", value: formState.admin_response, onChange: (e) => setFormState({ ...formState, admin_response: e.target.value }) })] })] })] }), _jsxs("div", { className: "p-6 border-t border-[#445048] bg-[#0f2434] rounded-b-2xl flex justify-end gap-3", children: [_jsx("button", { onClick: onClose, className: "px-6 py-3 rounded-xl border border-[#445048] text-[#C4AD9D] font-bold hover:bg-[#445048]/20", children: "Cancel" }), _jsx("button", { type: "submit", form: "resolve-form", disabled: isLoading, className: "px-6 py-3 rounded-xl bg-[#F57251] text-white font-bold hover:bg-[#d65f41] disabled:opacity-50 shadow-lg shadow-[#F57251]/20 flex items-center gap-2", children: isLoading ? 'Updating...' : 'Save Updates' })] })] }) }));
};
export default AdminSupportPage;
