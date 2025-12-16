import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useGetUserReceiptsQuery } from '../../features/api/paymentApi';
import { CreditCard, Download, Eye, Filter, Search, Calendar, CheckCircle, XCircle, Clock, Smartphone, Receipt, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
const UserPaymentsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterMethod, setFilterMethod] = useState('all');
    // Fetch user payments
    const { data: paymentsResponse, isLoading, error, refetch } = useGetUserReceiptsQuery();
    const payments = paymentsResponse?.data || [];
    // Filter payments based on search and filters
    const filteredPayments = payments.filter(payment => {
        // Search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            return (payment.transaction_id.toLowerCase().includes(term) ||
                payment.transaction_reference.toLowerCase().includes(term) ||
                payment.vehicle_make.toLowerCase().includes(term) ||
                payment.vehicle_model.toLowerCase().includes(term) ||
                payment.phone.toLowerCase().includes(term));
        }
        return true;
    }).filter(payment => {
        // Status filter
        if (filterStatus !== 'all') {
            return payment.payment_status === filterStatus;
        }
        return true;
    }).filter(payment => {
        // Method filter
        if (filterMethod !== 'all') {
            return payment.payment_method === filterMethod;
        }
        return true;
    });
    // Calculate stats
    const calculateStats = () => {
        const totalSpent = payments.reduce((sum, payment) => sum + payment.amount, 0);
        const completed = payments.filter(p => p.payment_status === 'Completed').length;
        const pending = payments.filter(p => p.payment_status === 'Pending').length;
        const failed = payments.filter(p => p.payment_status === 'Failed').length;
        const mpesa = payments.filter(p => p.payment_method === 'M-Pesa').length;
        const card = payments.filter(p => p.payment_method === 'Card').length;
        return { totalSpent, completed, pending, failed, mpesa, card };
    };
    const stats = calculateStats();
    // Handle receipt download
    const handleDownloadReceipt = async (paymentId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/api/payments/${paymentId}/receipt?download=true`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                // Create blob and download
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `receipt-${paymentId}.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                toast.success('Receipt downloaded successfully!');
            }
            else {
                toast.error('Failed to download receipt');
            }
        }
        catch (error) {
            console.error('Download error:', error);
            toast.error('Error downloading receipt');
        }
    };
    // Handle view receipt (in modal or new page)
    const handleViewReceipt = (paymentId) => {
        window.open(`/receipt/${paymentId}`, '_blank');
    };
    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES',
            minimumFractionDigits: 0,
        }).format(amount);
    };
    // Get status icon and color
    const getStatusInfo = (status) => {
        switch (status) {
            case 'Completed':
                return {
                    icon: _jsx(CheckCircle, { size: 16 }),
                    color: 'text-green-400',
                    bgColor: 'bg-green-900/30',
                    borderColor: 'border-green-800/50'
                };
            case 'Pending':
                return {
                    icon: _jsx(Clock, { size: 16 }),
                    color: 'text-yellow-400',
                    bgColor: 'bg-yellow-900/30',
                    borderColor: 'border-yellow-800/50'
                };
            case 'Failed':
                return {
                    icon: _jsx(XCircle, { size: 16 }),
                    color: 'text-red-400',
                    bgColor: 'bg-red-900/30',
                    borderColor: 'border-red-800/50'
                };
            default:
                return {
                    icon: _jsx(Clock, { size: 16 }),
                    color: 'text-gray-400',
                    bgColor: 'bg-gray-900/30',
                    borderColor: 'border-gray-800/50'
                };
        }
    };
    // Loading state
    if (isLoading) {
        return (_jsx("div", { className: "min-h-screen bg-[#001524] p-6 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx(Loader2, { className: "h-12 w-12 text-[#027480] animate-spin mx-auto mb-4" }), _jsx("h3", { className: "text-xl font-bold text-white", children: "Loading your payments..." }), _jsx("p", { className: "text-[#C4AD9D]", children: "Please wait while we fetch your payment history" })] }) }));
    }
    // Error state
    if (error) {
        return (_jsx("div", { className: "min-h-screen bg-[#001524] p-6 flex items-center justify-center", children: _jsxs("div", { className: "bg-red-900/20 border border-red-800/30 rounded-2xl p-8 max-w-md text-center", children: [_jsx(XCircle, { className: "h-16 w-16 text-red-400 mx-auto mb-4" }), _jsx("h3", { className: "text-2xl font-bold text-white mb-2", children: "Failed to Load Payments" }), _jsx("p", { className: "text-[#C4AD9D] mb-6", children: "We couldn't load your payment history. Please try again." }), _jsx("button", { onClick: () => refetch(), className: "bg-[#F57251] hover:bg-[#d65f41] text-white px-6 py-3 rounded-xl font-bold transition-colors", children: "Retry" })] }) }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-[#001524] p-6", children: [_jsxs("div", { className: "mb-8", children: [_jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-3xl font-bold text-white flex items-center gap-3", children: [_jsx(CreditCard, { size: 32, className: "text-[#027480]" }), "My Payments"] }), _jsx("p", { className: "text-[#C4AD9D] mt-2", children: "View your payment history and download receipts" })] }), _jsx("div", { className: "flex items-center gap-4", children: _jsxs("div", { className: "text-right", children: [_jsx("p", { className: "text-sm text-[#C4AD9D]", children: "Total Spent" }), _jsx("p", { className: "text-2xl font-bold text-[#027480]", children: formatCurrency(stats.totalSpent) })] }) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8", children: [_jsx("div", { className: "bg-gradient-to-br from-[#0f2434] to-[#1a3247] border border-[#027480]/30 rounded-xl p-5", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-[#C4AD9D]", children: "Completed" }), _jsx("p", { className: "text-2xl font-bold text-green-400", children: stats.completed })] }), _jsx(CheckCircle, { className: "h-10 w-10 text-green-400" })] }) }), _jsx("div", { className: "bg-gradient-to-br from-[#0f2434] to-[#1a3247] border border-[#F57251]/30 rounded-xl p-5", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-[#C4AD9D]", children: "Pending" }), _jsx("p", { className: "text-2xl font-bold text-yellow-400", children: stats.pending })] }), _jsx(Clock, { className: "h-10 w-10 text-yellow-400" })] }) }), _jsx("div", { className: "bg-gradient-to-br from-[#0f2434] to-[#1a3247] border border-red-800/30 rounded-xl p-5", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-[#C4AD9D]", children: "Failed" }), _jsx("p", { className: "text-2xl font-bold text-red-400", children: stats.failed })] }), _jsx(XCircle, { className: "h-10 w-10 text-red-400" })] }) }), _jsx("div", { className: "bg-gradient-to-br from-[#0f2434] to-[#1a3247] border border-[#445048] rounded-xl p-5", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-[#C4AD9D]", children: "Total Payments" }), _jsx("p", { className: "text-2xl font-bold text-white", children: payments.length })] }), _jsx(Receipt, { className: "h-10 w-10 text-[#027480]" })] }) })] })] }), _jsxs("div", { className: "mb-6 space-y-4", children: [_jsxs("div", { className: "flex flex-col md:flex-row gap-4", children: [_jsxs("div", { className: "flex-1 relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#C4AD9D]" }), _jsx("input", { type: "text", placeholder: "Search by transaction ID, vehicle, phone...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full bg-[#0f2434] border border-[#445048] rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#027480] focus:ring-2 focus:ring-[#027480]/50" })] }), _jsxs("div", { className: "flex gap-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Filter, { className: "h-5 w-5 text-[#C4AD9D]" }), _jsxs("select", { value: filterStatus, onChange: (e) => setFilterStatus(e.target.value), className: "bg-[#0f2434] border border-[#445048] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#027480] min-w-[140px]", children: [_jsx("option", { value: "all", children: "All Status" }), _jsx("option", { value: "Completed", children: "Completed" }), _jsx("option", { value: "Pending", children: "Pending" }), _jsx("option", { value: "Failed", children: "Failed" })] })] }), _jsxs("select", { value: filterMethod, onChange: (e) => setFilterMethod(e.target.value), className: "bg-[#0f2434] border border-[#445048] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#027480] min-w-[140px]", children: [_jsx("option", { value: "all", children: "All Methods" }), _jsx("option", { value: "M-Pesa", children: "M-Pesa" }), _jsx("option", { value: "Card", children: "Card" })] })] })] }), _jsxs("div", { className: "flex flex-wrap gap-4", children: [_jsxs("div", { className: "flex items-center gap-2 px-4 py-2 bg-green-900/20 rounded-lg border border-green-800/30", children: [_jsx(Smartphone, { size: 16, className: "text-green-400" }), _jsxs("span", { className: "text-white text-sm", children: ["M-Pesa: ", stats.mpesa, " payments"] })] }), _jsxs("div", { className: "flex items-center gap-2 px-4 py-2 bg-blue-900/20 rounded-lg border border-blue-800/30", children: [_jsx(CreditCard, { size: 16, className: "text-blue-400" }), _jsxs("span", { className: "text-white text-sm", children: ["Card: ", stats.card, " payments"] })] })] })] }), _jsxs("div", { className: "bg-[#0f2434] border border-[#445048] rounded-2xl overflow-hidden", children: [_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-[#001524]", children: _jsxs("tr", { children: [_jsx("th", { className: "py-4 px-6 text-left text-sm font-semibold text-[#C4AD9D]", children: "Transaction" }), _jsx("th", { className: "py-4 px-6 text-left text-sm font-semibold text-[#C4AD9D]", children: "Vehicle" }), _jsx("th", { className: "py-4 px-6 text-left text-sm font-semibold text-[#C4AD9D]", children: "Amount" }), _jsx("th", { className: "py-4 px-6 text-left text-sm font-semibold text-[#C4AD9D]", children: "Status" }), _jsx("th", { className: "py-4 px-6 text-left text-sm font-semibold text-[#C4AD9D]", children: "Method" }), _jsx("th", { className: "py-4 px-6 text-left text-sm font-semibold text-[#C4AD9D]", children: "Date" }), _jsx("th", { className: "py-4 px-6 text-left text-sm font-semibold text-[#C4AD9D]", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-[#445048]", children: filteredPayments.map((payment) => {
                                        const statusInfo = getStatusInfo(payment.payment_status);
                                        return (_jsxs("tr", { className: "hover:bg-[#152e40]/50 transition-colors", children: [_jsx("td", { className: "py-4 px-6", children: _jsxs("div", { className: "space-y-1", children: [_jsx("div", { className: "font-mono text-sm font-bold text-white", children: payment.transaction_id }), _jsxs("div", { className: "text-xs text-[#C4AD9D]", children: ["Ref: ", payment.transaction_reference] }), _jsxs("div", { className: "text-xs text-[#445048]", children: ["Booking #", payment.booking_id] })] }) }), _jsx("td", { className: "py-4 px-6", children: _jsxs("div", { children: [_jsxs("div", { className: "font-medium text-white", children: [payment.vehicle_make, " ", payment.vehicle_model] }), _jsx("div", { className: "text-xs text-[#C4AD9D]", children: format(new Date(payment.booking_date), 'MMM dd, yyyy') })] }) }), _jsx("td", { className: "py-4 px-6", children: _jsxs("div", { className: "space-y-1", children: [_jsx("div", { className: "text-lg font-bold text-white", children: formatCurrency(payment.amount) }), _jsxs("div", { className: "text-xs text-[#C4AD9D]", children: ["Net: ", formatCurrency(payment.net_amount)] })] }) }), _jsx("td", { className: "py-4 px-6", children: _jsxs("div", { className: `inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.bgColor} ${statusInfo.borderColor}`, children: [statusInfo.icon, _jsx("span", { className: statusInfo.color, children: payment.payment_status })] }) }), _jsxs("td", { className: "py-4 px-6", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: `h-8 w-8 rounded-full flex items-center justify-center ${payment.payment_method === 'M-Pesa'
                                                                        ? 'bg-green-900/30 text-green-300'
                                                                        : 'bg-blue-900/30 text-blue-300'}`, children: payment.payment_method === 'M-Pesa' ? 'M' : '💳' }), _jsx("span", { className: "text-sm text-gray-300", children: payment.payment_method })] }), payment.phone && (_jsx("div", { className: "text-xs text-[#445048] mt-1", children: payment.phone }))] }), _jsxs("td", { className: "py-4 px-6", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Calendar, { className: "h-4 w-4 text-[#C4AD9D]" }), _jsx("span", { className: "text-sm text-gray-300", children: format(new Date(payment.payment_date), 'MMM dd, yyyy') })] }), _jsx("div", { className: "text-xs text-[#445048] ml-6", children: format(new Date(payment.payment_date), 'hh:mm a') })] }), _jsx("td", { className: "py-4 px-6", children: _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => handleViewReceipt(payment.payment_id), className: "p-2 bg-[#027480] hover:bg-[#02606d] rounded-lg transition-colors", title: "View Receipt", children: _jsx(Eye, { className: "h-4 w-4 text-white" }) }), _jsx("button", { onClick: () => handleDownloadReceipt(payment.payment_id), className: "p-2 border border-[#445048] text-gray-400 hover:text-white hover:border-gray-500 rounded-lg transition-colors", title: "Download Receipt", children: _jsx(Download, { className: "h-4 w-4" }) })] }) })] }, payment.payment_id));
                                    }) })] }) }), filteredPayments.length === 0 && (_jsxs("div", { className: "text-center py-12", children: [_jsx(CreditCard, { className: "h-16 w-16 text-[#445048] mx-auto mb-4" }), _jsx("h3", { className: "text-xl font-bold text-white mb-2", children: payments.length === 0 ? 'No payments yet' : 'No matching payments found' }), _jsx("p", { className: "text-[#C4AD9D]", children: payments.length === 0
                                    ? 'You haven\'t made any payments yet. Book a vehicle to get started!'
                                    : 'Try adjusting your search or filters' })] }))] }), _jsx("div", { className: "mt-6 bg-[#00101f] border border-[#445048] rounded-2xl p-6", children: _jsxs("div", { className: "flex flex-col md:flex-row justify-between items-center gap-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold text-white", children: "Payment Summary" }), _jsxs("p", { className: "text-[#C4AD9D] text-sm", children: ["Showing ", filteredPayments.length, " of ", payments.length, " payments"] })] }), _jsxs("div", { className: "text-right", children: [_jsx("div", { className: "text-2xl font-bold text-white", children: formatCurrency(filteredPayments.reduce((sum, p) => sum + p.amount, 0)) }), _jsx("div", { className: "text-sm text-[#C4AD9D]", children: "Total filtered amount" })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-lg font-bold text-green-400", children: formatCurrency(payments.filter(p => p.payment_status === 'Completed').reduce((sum, p) => sum + p.amount, 0)) }), _jsx("div", { className: "text-xs text-[#C4AD9D]", children: "Completed" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-lg font-bold text-yellow-400", children: formatCurrency(payments.filter(p => p.payment_status === 'Pending').reduce((sum, p) => sum + p.amount, 0)) }), _jsx("div", { className: "text-xs text-[#C4AD9D]", children: "Pending" })] })] })] }) }), _jsx("div", { className: "mt-6 p-4 bg-[#027480]/10 rounded-xl border border-[#027480]/20", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx(InfoIcon, { className: "h-5 w-5 text-[#027480] mt-0.5 flex-shrink-0" }), _jsxs("div", { children: [_jsx("h4", { className: "font-medium text-white mb-1", children: "About Your Payments" }), _jsxs("ul", { className: "text-sm text-[#C4AD9D] space-y-1 list-disc list-inside", children: [_jsx("li", { children: "Receipts can be downloaded as PDF files" }), _jsx("li", { children: "Payments may take up to 24 hours to reflect as \"Completed\"" }), _jsx("li", { children: "Contact support if you have any issues with your payments" }), _jsx("li", { children: "Keep your transaction IDs for reference" })] })] })] }) })] }));
};
// Info Icon component
const InfoIcon = ({ className }) => (_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: className, children: [_jsx("circle", { cx: "12", cy: "12", r: "10" }), _jsx("line", { x1: "12", y1: "16", x2: "12", y2: "12" }), _jsx("line", { x1: "12", y1: "8", x2: "12.01", y2: "8" })] }));
export default UserPaymentsPage;
