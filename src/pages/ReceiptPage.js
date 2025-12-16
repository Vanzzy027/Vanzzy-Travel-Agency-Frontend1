import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/ReceiptPage.tsx
import { useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useGetReceiptQuery } from '../features/api/paymentApi';
import ReceiptModal from '../Modals/ReceiptModal';
import { Loader2, ArrowLeft, AlertCircle, Home } from 'lucide-react';
const ReceiptPage = () => {
    const { paymentId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const bookingId = searchParams.get('bookingId');
    const [isModalOpen, setIsModalOpen] = useState(true);
    // Fetch receipt data
    const { data: receiptResponse, isLoading, isError, error } = useGetReceiptQuery({
        paymentId: paymentId ? parseInt(paymentId) : undefined,
        bookingId: bookingId ? parseInt(bookingId) : undefined
    }, { skip: !paymentId && !bookingId });
    const handleClose = () => {
        setIsModalOpen(false);
        // Navigate back to dashboard after a short delay
        setTimeout(() => navigate('/dashboard'), 300);
    };
    if (isLoading) {
        return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-[#0f2434] to-[#1a3247] flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx(Loader2, { className: "h-12 w-12 animate-spin text-[#027480] mx-auto mb-4" }), _jsx("p", { className: "text-white text-lg", children: "Loading receipt..." })] }) }));
    }
    if (isError) {
        return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-[#0f2434] to-[#1a3247] flex items-center justify-center p-4", children: _jsxs("div", { className: "bg-[#001524] rounded-2xl border border-[#445048] p-8 max-w-md w-full", children: [_jsx("div", { className: "flex items-center justify-center gap-3 mb-4", children: _jsx(AlertCircle, { className: "h-12 w-12 text-red-500" }) }), _jsx("h2", { className: "text-2xl font-bold text-white text-center mb-3", children: "Receipt Not Found" }), _jsx("p", { className: "text-[#C4AD9D] text-center mb-6", children: error?.data?.message || 'Unable to load receipt. The payment may not exist or has been cancelled.' }), _jsxs("div", { className: "flex gap-3", children: [_jsxs("button", { onClick: () => navigate('/dashboard'), className: "flex-1 py-3 border-2 border-[#445048] text-[#C4AD9D] rounded-lg font-semibold hover:border-gray-500 hover:text-white transition-colors flex items-center justify-center", children: [_jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }), "Dashboard"] }), _jsxs("button", { onClick: () => navigate('/'), className: "flex-1 py-3 bg-[#027480] text-white rounded-lg font-semibold hover:bg-[#02606d] transition-colors flex items-center justify-center", children: [_jsx(Home, { className: "mr-2 h-4 w-4" }), "Home"] })] })] }) }));
    }
    if (!receiptResponse?.data) {
        return null;
    }
    const { payment, booking, user } = receiptResponse.data;
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-[#0f2434] to-[#1a3247]", children: _jsx(ReceiptModal, { isOpen: isModalOpen, onClose: handleClose, booking: booking, payment: payment, user: user }) }));
};
export default ReceiptPage;
