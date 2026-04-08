import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/AdminPage/AdminPayments.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// 1. Import the hook from your API slice
import { useGetAllReceiptsQuery } from "../../features/api/paymentApi";
import { CreditCard, DollarSign, Search, Download, Eye, TrendingUp, Shield, } from "lucide-react";
import { format } from "date-fns";
// interface Payment {
//   payment_id: number;
//   booking_id: number;
//   user_id: string;
//   amount: number;
//   gross_amount: number;
//   commission_fee: number;
//   net_amount: number;
//   payment_status: string;
//   payment_method: string;
//   transaction_id: string;
//   transaction_reference: string;
//   phone: string;
//   payment_date: string;
//   created_at: string;
//   first_name?: string;
//   last_name?: string;
//   email?: string;
//   booking_date?: string;
//   return_date?: string;
//   vehicle_make?: string;
//   vehicle_model?: string;
// }
const AdminPayments = () => {
    const navigate = useNavigate();
    // 2. REPLACE manual fetch/states with RTK Query
    const { data: receiptsResponse, isLoading, error: apiError, } = useGetAllReceiptsQuery();
    // Local states for filtering only
    const [filteredPayments, setFilteredPayments] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterMethod, setFilterMethod] = useState("all");
    // 3. Extract payments from response
    const payments = receiptsResponse?.data || [];
    // 4. Update filtering effect to run when 'payments' changes
    useEffect(() => {
        let filtered = [...payments];
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter((payment) => payment.transaction_id.toLowerCase().includes(term) ||
                `${payment.first_name || ""} ${payment.last_name || ""}`
                    .toLowerCase()
                    .includes(term) ||
                payment.email?.toLowerCase().includes(term) ||
                payment.phone.toLowerCase().includes(term));
        }
        if (filterStatus !== "all") {
            filtered = filtered.filter((payment) => payment.payment_status === filterStatus);
        }
        if (filterMethod !== "all") {
            filtered = filtered.filter((payment) => payment.payment_method === filterMethod);
        }
        setFilteredPayments(filtered);
    }, [payments, searchTerm, filterStatus, filterMethod]);
    const calculateStats = () => {
        const total = payments.reduce((sum, payment) => sum + payment.amount, 0);
        const completed = payments.filter((p) => p.payment_status === "Completed").length;
        const pending = payments.filter((p) => p.payment_status === "Pending").length;
        const failed = payments.filter((p) => p.payment_status === "Failed").length;
        const mpesa = payments.filter((p) => p.payment_method === "M-Pesa").length;
        const card = payments.filter((p) => p.payment_method === "Card").length;
        return { total, completed, pending, failed, mpesa, card };
    };
    const stats = calculateStats();
    if (isLoading) {
        return (_jsx("div", { className: "flex justify-center py-12", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-[#027480]" }) }));
    }
    if (apiError) {
        return (_jsxs("div", { className: "bg-red-900/20 border border-red-800/30 rounded-xl p-6 text-center", children: [_jsx(Shield, { className: "h-12 w-12 text-red-400 mx-auto mb-3" }), _jsx("h3", { className: "text-xl font-bold text-white mb-2", children: "Failed to Load Payments" }), _jsx("p", { className: "text-gray-400 mb-4", children: apiError?.data?.message || "Error fetching data" })] }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-3xl font-bold text-black flex items-center gap-2", children: [_jsx(CreditCard, { className: "h-8 w-8" }), "Payment Management"] }), _jsx("p", { className: "text-gray-600", children: "Manage and track all payment transactions" })] }), _jsxs("div", { className: "text-sm text-gray-600", children: ["Total: ", payments.length, " payments \u2022 Revenue: KES", " ", stats.total.toLocaleString()] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [_jsx("div", { className: "bg-gradient-to-br from-gray-300/30 to-red-600/10 border border-blue-800/30 rounded-xl p-5", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-blue-300", children: "Total Revenue" }), _jsxs("p", { className: "text-2xl font-bold text-white", children: ["KES ", stats.total.toLocaleString()] })] }), _jsx(DollarSign, { className: "h-10 w-10 text-blue-400" })] }) }), _jsx("div", { className: "bg-gradient-to-br from-green-900/30 to-green-800/10 border border-green-800/30 rounded-xl p-5", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-green-300", children: "Completed" }), _jsx("p", { className: "text-2xl font-bold text-white", children: stats.completed })] }), _jsx(TrendingUp, { className: "h-10 w-10 text-green-400" })] }) }), _jsx("div", { className: "bg-gradient-to-br from-orange-900/30 to-orange-800/10 border border-orange-800/30 rounded-xl p-5", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-orange-300", children: "Pending" }), _jsx("p", { className: "text-2xl font-bold text-white", children: stats.pending })] }), _jsx(CreditCard, { className: "h-10 w-10 text-orange-400" })] }) }), _jsx("div", { className: "bg-gradient-to-br from-red-900/30 to-red-800/10 border border-red-800/30 rounded-xl p-5", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-red-300", children: "Failed" }), _jsx("p", { className: "text-2xl font-bold text-white", children: stats.failed })] }), _jsx(Shield, { className: "h-10 w-10 text-red-400" })] }) })] }), _jsxs("div", { className: "flex flex-col md:flex-row gap-4", children: [_jsxs("div", { className: "flex-1 relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" }), _jsx("input", { type: "text", placeholder: "Search transactions...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full bg-[#0f2434] border border-[#445048] rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#027480]" })] }), _jsx("div", { className: "flex gap-3", children: _jsxs("select", { value: filterStatus, onChange: (e) => setFilterStatus(e.target.value), className: "bg-[#0f2434] border border-[#445048] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#027480]", children: [_jsx("option", { value: "all", children: "All Status" }), _jsx("option", { value: "Completed", children: "Completed" }), _jsx("option", { value: "Pending", children: "Pending" }), _jsx("option", { value: "Failed", children: "Failed" })] }) })] }), _jsx("div", { className: "bg-[#001524] border border-[#445048] rounded-xl overflow-hidden", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-[#0f2434]", children: _jsxs("tr", { children: [_jsx("th", { className: "py-4 px-6 text-left text-sm font-semibold text-gray-300", children: "Transaction" }), _jsx("th", { className: "py-4 px-6 text-left text-sm font-semibold text-gray-300", children: "Customer" }), _jsx("th", { className: "py-4 px-6 text-left text-sm font-semibold text-gray-300", children: "Amount" }), _jsx("th", { className: "py-4 px-6 text-left text-sm font-semibold text-gray-300", children: "Status" }), _jsx("th", { className: "py-4 px-6 text-left text-sm font-semibold text-gray-300", children: "Date" }), _jsx("th", { className: "py-4 px-6 text-left text-sm font-semibold text-gray-300", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-[#445048]", children: filteredPayments.map((payment) => (_jsxs("tr", { className: "hover:bg-[#0f2434]/50", children: [_jsx("td", { className: "py-4 px-6 text-white font-mono text-sm", children: payment.transaction_id }), _jsxs("td", { className: "py-4 px-6 text-white", children: [payment.first_name, " ", payment.last_name] }), _jsxs("td", { className: "py-4 px-6 text-white font-bold", children: ["KES ", payment.amount.toLocaleString()] }), _jsx("td", { className: "py-4 px-6", children: _jsx("span", { className: `px-3 py-1 rounded-full text-xs ${payment.payment_status === "Completed" ? "bg-green-900/30 text-green-300" : "bg-yellow-900/30 text-yellow-300"}`, children: payment.payment_status }) }), _jsx("td", { className: "py-4 px-6 text-gray-300 text-sm", children: format(new Date(payment.payment_date), "MMM dd, yyyy") }), _jsx("td", { className: "py-4 px-6", children: _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => navigate(`/receipt/${payment.payment_id}`), className: "p-2 bg-[#027480] hover:bg-[#02606d] rounded-lg transition-colors", title: "View Receipt", children: _jsx(Eye, { className: "h-4 w-4 text-white" }) }), _jsx("button", { onClick: () => navigate(`/receipt/${payment.payment_id}`), className: "p-2 border border-[#445048] text-gray-400 hover:text-white rounded-lg transition-colors", title: "Download", children: _jsx(Download, { className: "h-4 w-4" }) })] }) })] }, payment.payment_id))) })] }) }) })] }));
};
export default AdminPayments;
