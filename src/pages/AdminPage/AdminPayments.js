import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/AdminPage/AdminPayments.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, DollarSign, Filter, Search, Download, Eye, Calendar, TrendingUp, Shield } from 'lucide-react';
import { format } from 'date-fns';
const AdminPayments = () => {
    const navigate = useNavigate();
    const [payments, setPayments] = useState([]);
    const [filteredPayments, setFilteredPayments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterMethod, setFilterMethod] = useState('all');
    useEffect(() => {
        fetchPayments();
    }, []);
    useEffect(() => {
        filterPayments();
    }, [payments, searchTerm, filterStatus, filterMethod]);
    const fetchPayments = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const token = localStorage.getItem('token');
            const API_BASE_URL = import.meta.env.VITE_API_URL; //Constant URL
            const response = await fetch(`${API_BASE_URL}/api/payments/all-receipts`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (data.success) {
                setPayments(data.data);
            }
            else {
                setError(data.message || 'Failed to load payments');
            }
        }
        catch (err) {
            setError(err.message || 'Failed to load payments');
            console.error('Error fetching payments:', err);
        }
        finally {
            setIsLoading(false);
        }
    };
    const filterPayments = () => {
        let filtered = [...payments];
        // Search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(payment => payment.transaction_id.toLowerCase().includes(term) ||
                payment.transaction_reference.toLowerCase().includes(term) ||
                `${payment.first_name || ''} ${payment.last_name || ''}`.toLowerCase().includes(term) ||
                payment.email?.toLowerCase().includes(term) ||
                payment.phone.toLowerCase().includes(term));
        }
        // Status filter
        if (filterStatus !== 'all') {
            filtered = filtered.filter(payment => payment.payment_status === filterStatus);
        }
        // Method filter
        if (filterMethod !== 'all') {
            filtered = filtered.filter(payment => payment.payment_method === filterMethod);
        }
        setFilteredPayments(filtered);
    };
    const calculateStats = () => {
        const total = payments.reduce((sum, payment) => sum + payment.amount, 0);
        const completed = payments.filter(p => p.payment_status === 'Completed').length;
        const pending = payments.filter(p => p.payment_status === 'Pending').length;
        const failed = payments.filter(p => p.payment_status === 'Failed').length;
        const mpesa = payments.filter(p => p.payment_method === 'M-Pesa').length;
        const card = payments.filter(p => p.payment_method === 'Card').length;
        return { total, completed, pending, failed, mpesa, card };
    };
    const stats = calculateStats();
    if (isLoading) {
        return (_jsx("div", { className: "flex justify-center py-12", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-[#027480]" }) }));
    }
    if (error) {
        return (_jsxs("div", { className: "bg-red-900/20 border border-red-800/30 rounded-xl p-6 text-center", children: [_jsx(Shield, { className: "h-12 w-12 text-red-400 mx-auto mb-3" }), _jsx("h3", { className: "text-xl font-bold text-white mb-2", children: "Failed to Load Payments" }), _jsx("p", { className: "text-gray-400 mb-4", children: error }), _jsx("button", { onClick: fetchPayments, className: "px-6 py-2 bg-[#027480] text-white rounded-lg hover:bg-[#02606d] transition-colors", children: "Retry" })] }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-3xl font-bold text-black flex items-center gap-2", children: [_jsx(CreditCard, { className: "h-8 w-8" }), "Payment Management"] }), _jsx("p", { className: "text-gray-600", children: "Manage and track all payment transactions" })] }), _jsxs("div", { className: "text-sm text-gray-600", children: ["Total: ", payments.length, " payments \u2022 Revenue: KES ", stats.total.toLocaleString()] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [_jsx("div", { className: "bg-gradient-to-br from-gray-300/30 to-red-600/10 border border-blue-800/30 rounded-xl p-5", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-blue-300", children: "Total Revenue" }), _jsxs("p", { className: "text-2xl font-bold text-white", children: ["KES ", stats.total.toLocaleString()] })] }), _jsx(DollarSign, { className: "h-10 w-10 text-blue-400" })] }) }), _jsx("div", { className: "bg-gradient-to-br from-green-900/30 to-green-800/10 border border-green-800/30 rounded-xl p-5", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-green-300", children: "Completed" }), _jsx("p", { className: "text-2xl font-bold text-white", children: stats.completed })] }), _jsx(TrendingUp, { className: "h-10 w-10 text-green-400" })] }) }), _jsx("div", { className: "bg-gradient-to-br from-orange-900/30 to-orange-800/10 border border-orange-800/30 rounded-xl p-5", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-orange-300", children: "Pending" }), _jsx("p", { className: "text-2xl font-bold text-white", children: stats.pending })] }), _jsx(CreditCard, { className: "h-10 w-10 text-orange-400" })] }) }), _jsx("div", { className: "bg-gradient-to-br from-red-900/30 to-red-800/10 border border-red-800/30 rounded-xl p-5", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-red-300", children: "Failed" }), _jsx("p", { className: "text-2xl font-bold text-white", children: stats.failed })] }), _jsx(Shield, { className: "h-10 w-10 text-red-400" })] }) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "bg-[#001524] border border-[#445048] rounded-xl p-5", children: [_jsx("h3", { className: "text-lg font-bold text-white mb-3", children: "Payment Methods" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "h-3 w-3 rounded-full bg-green-500" }), _jsx("span", { className: "text-gray-300", children: "M-Pesa" })] }), _jsxs("span", { className: "font-bold text-white", children: [stats.mpesa, " payments"] })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "h-3 w-3 rounded-full bg-blue-500" }), _jsx("span", { className: "text-gray-300", children: "Card" })] }), _jsxs("span", { className: "font-bold text-white", children: [stats.card, " payments"] })] })] })] }), _jsxs("div", { className: "bg-[#001524] border border-[#445048] rounded-xl p-5", children: [_jsx("h3", { className: "text-lg font-bold text-white mb-3", children: "Quick Actions" }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("button", { className: "p-3 bg-[#027480] hover:bg-[#02606d] text-white rounded-lg transition-colors flex items-center justify-center gap-2", children: [_jsx(Download, { className: "h-4 w-4" }), "Export"] }), _jsxs("button", { className: "p-3 border border-[#445048] hover:border-gray-500 text-gray-300 hover:text-white rounded-lg transition-colors flex items-center justify-center gap-2", children: [_jsx(Eye, { className: "h-4 w-4" }), "Overview"] })] })] })] }), _jsxs("div", { className: "flex flex-col md:flex-row gap-4", children: [_jsxs("div", { className: "flex-1 relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" }), _jsx("input", { type: "text", placeholder: "Search by transaction ID, customer, phone...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full bg-[#0f2434] border border-[#445048] rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#027480] focus:ring-2 focus:ring-[#027480]/50" })] }), _jsxs("div", { className: "flex gap-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Filter, { className: "h-5 w-5 text-gray-400" }), _jsxs("select", { value: filterStatus, onChange: (e) => setFilterStatus(e.target.value), className: "bg-[#0f2434] border border-[#445048] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#027480] min-w-[140px]", children: [_jsx("option", { value: "all", children: "All Status" }), _jsx("option", { value: "Completed", children: "Completed" }), _jsx("option", { value: "Pending", children: "Pending" }), _jsx("option", { value: "Failed", children: "Failed" }), _jsx("option", { value: "Refunded", children: "Refunded" })] })] }), _jsxs("select", { value: filterMethod, onChange: (e) => setFilterMethod(e.target.value), className: "bg-[#0f2434] border border-[#445048] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#027480] min-w-[140px]", children: [_jsx("option", { value: "all", children: "All Methods" }), _jsx("option", { value: "M-Pesa", children: "M-Pesa" }), _jsx("option", { value: "Card", children: "Card" })] })] })] }), _jsxs("div", { className: "bg-[#001524] border border-[#445048] rounded-xl overflow-hidden", children: [_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-[#0f2434]", children: _jsxs("tr", { children: [_jsx("th", { className: "py-4 px-6 text-left text-sm font-semibold text-gray-300", children: "Transaction" }), _jsx("th", { className: "py-4 px-6 text-left text-sm font-semibold text-gray-300", children: "Customer" }), _jsx("th", { className: "py-4 px-6 text-left text-sm font-semibold text-gray-300", children: "Amount" }), _jsx("th", { className: "py-4 px-6 text-left text-sm font-semibold text-gray-300", children: "Status" }), _jsx("th", { className: "py-4 px-6 text-left text-sm font-semibold text-gray-300", children: "Method" }), _jsx("th", { className: "py-4 px-6 text-left text-sm font-semibold text-gray-300", children: "Date" }), _jsx("th", { className: "py-4 px-6 text-left text-sm font-semibold text-gray-300", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-[#445048]", children: filteredPayments.map((payment) => (_jsxs("tr", { className: "hover:bg-[#0f2434]/50", children: [_jsx("td", { className: "py-4 px-6", children: _jsxs("div", { children: [_jsx("div", { className: "font-mono text-sm font-bold text-white", children: payment.transaction_id }), _jsxs("div", { className: "text-xs text-gray-500", children: ["Ref: ", payment.transaction_reference] }), _jsxs("div", { className: "text-xs text-gray-500", children: ["Booking #", payment.booking_id] })] }) }), _jsx("td", { className: "py-4 px-6", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "h-8 w-8 rounded-full bg-[#D6CC99] flex items-center justify-center", children: _jsxs("span", { className: "text-[#001524] text-xs font-bold", children: [payment.first_name?.[0], payment.last_name?.[0]] }) }), _jsxs("div", { children: [_jsxs("div", { className: "font-medium text-white", children: [payment.first_name, " ", payment.last_name] }), _jsx("div", { className: "text-xs text-gray-400", children: payment.email }), _jsx("div", { className: "text-xs text-gray-500", children: payment.phone })] })] }) }), _jsxs("td", { className: "py-4 px-6", children: [_jsxs("div", { className: "text-lg font-bold text-white", children: ["KES ", payment.amount.toLocaleString()] }), _jsxs("div", { className: "text-xs text-gray-500", children: ["Net: KES ", payment.net_amount.toLocaleString()] })] }), _jsx("td", { className: "py-4 px-6", children: _jsx("span", { className: `inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${payment.payment_status === 'Completed'
                                                        ? 'bg-green-900/30 text-green-300 border border-green-800/50'
                                                        : payment.payment_status === 'Pending'
                                                            ? 'bg-yellow-900/30 text-yellow-300 border border-yellow-800/50'
                                                            : 'bg-red-900/30 text-red-300 border border-red-800/50'}`, children: payment.payment_status }) }), _jsx("td", { className: "py-4 px-6", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: `h-8 w-8 rounded-full flex items-center justify-center ${payment.payment_method === 'M-Pesa'
                                                                ? 'bg-green-900/30 text-green-300'
                                                                : 'bg-blue-900/30 text-blue-300'}`, children: payment.payment_method === 'M-Pesa' ? 'M' : '💳' }), _jsx("span", { className: "text-sm text-gray-300", children: payment.payment_method })] }) }), _jsxs("td", { className: "py-4 px-6", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Calendar, { className: "h-4 w-4 text-gray-400" }), _jsx("span", { className: "text-sm text-gray-300", children: format(new Date(payment.payment_date), 'MMM dd, yyyy') })] }), _jsx("div", { className: "text-xs text-gray-500", children: format(new Date(payment.payment_date), 'hh:mm a') })] }), _jsx("td", { className: "py-4 px-6", children: _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => navigate(`/receipt/${payment.payment_id}`), className: "p-2 bg-[#027480] hover:bg-[#02606d] rounded-lg transition-colors", title: "View Receipt", children: _jsx(Eye, { className: "h-4 w-4 text-white" }) }), _jsx("button", { onClick: () => window.open(`/api/payments/${payment.payment_id}/receipt?download=true`, '_blank'), className: "p-2 border border-[#445048] text-gray-400 hover:text-white hover:border-gray-500 rounded-lg transition-colors", title: "Download", children: _jsx(Download, { className: "h-4 w-4" }) })] }) })] }, payment.payment_id))) })] }) }), filteredPayments.length === 0 && (_jsxs("div", { className: "text-center py-12", children: [_jsx(CreditCard, { className: "h-12 w-12 text-gray-400 mx-auto mb-3" }), _jsx("p", { className: "text-gray-400", children: "No payments found matching your criteria" })] }))] }), _jsx("div", { className: "bg-[#00101f] border border-[#445048] rounded-xl p-5", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold text-white", children: "Summary" }), _jsxs("p", { className: "text-gray-400 text-sm", children: ["Showing ", filteredPayments.length, " of ", payments.length, " payments"] })] }), _jsxs("div", { className: "text-right", children: [_jsxs("div", { className: "text-2xl font-bold text-white", children: ["KES ", filteredPayments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()] }), _jsx("div", { className: "text-sm text-gray-400", children: "Total filtered amount" })] })] }) })] }));
};
export default AdminPayments;
