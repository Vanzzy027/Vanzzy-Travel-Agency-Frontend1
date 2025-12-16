import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useGetUserReceiptsQuery } from '../../features/api/paymentApi';
import { Receipt, Download, Eye, Calendar, CreditCard, Car } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
const UserReceipts = () => {
    const { data: receiptsResponse, isLoading, error } = useGetUserReceiptsQuery();
    const navigate = useNavigate();
    if (isLoading) {
        return (_jsx("div", { className: "flex justify-center py-8", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-[#027480]" }) }));
    }
    if (error) {
        return (_jsx("div", { className: "bg-red-900/20 border border-red-800/30 rounded-lg p-4 text-center", children: _jsx("p", { className: "text-red-300", children: "Failed to load receipts" }) }));
    }
    const receipts = receiptsResponse?.data || [];
    if (receipts.length === 0) {
        return (_jsxs("div", { className: "text-center py-8", children: [_jsx(Receipt, { className: "h-12 w-12 text-gray-400 mx-auto mb-3" }), _jsx("h3", { className: "text-lg font-semibold text-white mb-2", children: "No Receipts Yet" }), _jsx("p", { className: "text-[#C4AD9D]", children: "Your payment receipts will appear here" })] }));
    }
    return (_jsxs("div", { className: "space-y-4", children: [_jsx("h2", { className: "text-xl font-bold text-white mb-4", children: "Payment Receipts" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: receipts.map((receipt) => (_jsxs("div", { className: "bg-[#001524] border border-[#445048] rounded-xl p-4 hover:border-[#027480] transition-all duration-300 hover:shadow-lg hover:shadow-[#027480]/10", children: [_jsxs("div", { className: "flex justify-between items-start mb-3", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx(CreditCard, { className: "h-4 w-4 text-green-400" }), _jsx("span", { className: "text-sm font-medium text-white", children: receipt.payment_method })] }), _jsxs("h3", { className: "font-bold text-white", children: ["Receipt #", receipt.payment_id] }), _jsxs("p", { className: "text-xs text-gray-400", children: ["Transaction: ", receipt.transaction_id] })] }), _jsxs("span", { className: `px-2 py-1 rounded-full text-xs font-medium ${receipt.amount > 0
                                        ? 'bg-green-900/30 text-green-300 border border-green-800/50'
                                        : 'bg-red-900/30 text-red-300 border border-red-800/50'}`, children: ["KES ", receipt.amount.toLocaleString()] })] }), _jsxs("div", { className: "space-y-2 mb-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Car, { className: "h-4 w-4 text-gray-400" }), _jsxs("span", { className: "text-sm text-[#C4AD9D]", children: [receipt.vehicle_make, " ", receipt.vehicle_model] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Calendar, { className: "h-4 w-4 text-gray-400" }), _jsx("span", { className: "text-sm text-[#C4AD9D]", children: format(new Date(receipt.payment_date), 'MMM dd, yyyy') })] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs("button", { onClick: () => navigate(`/receipt/${receipt.payment_id}`), className: "flex-1 bg-[#027480] hover:bg-[#02606d] text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors", children: [_jsx(Eye, { className: "h-4 w-4" }), "View"] }), _jsxs("button", { onClick: () => window.open(`/api/payments/${receipt.payment_id}/receipt?download=true`, '_blank'), className: "flex-1 border border-[#445048] text-[#C4AD9D] hover:text-white hover:border-gray-500 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors", children: [_jsx(Download, { className: "h-4 w-4" }), "PDF"] })] })] }, receipt.payment_id))) })] }));
};
export default UserReceipts;
