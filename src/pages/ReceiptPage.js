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
        return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-[#0f2434] to-[#1a3247] flex items-center justify-center p-4", children: _jsxs("div", { className: "text-center bg-[#001524] rounded-2xl border border-[#445048] p-8 max-w-md w-full", children: [_jsx(Loader2, { className: "h-10 w-10 md:h-12 md:w-12 animate-spin text-[#027480] mx-auto mb-4" }), _jsx("p", { className: "text-white text-base md:text-lg", children: "Loading receipt..." }), _jsx("p", { className: "text-[#C4AD9D] text-sm mt-2", children: "Please wait while we fetch your payment details" })] }) }));
    }
    if (isError) {
        return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-[#0f2434] to-[#1a3247] flex items-center justify-center p-4", children: _jsxs("div", { className: "bg-[#001524] rounded-2xl border border-[#445048] p-6 md:p-8 max-w-md w-full", children: [_jsx("div", { className: "flex items-center justify-center gap-3 mb-4", children: _jsx(AlertCircle, { className: "h-10 w-10 md:h-12 md:w-12 text-red-500" }) }), _jsx("h2", { className: "text-xl md:text-2xl font-bold text-white text-center mb-3", children: "Receipt Not Found" }), _jsx("p", { className: "text-[#C4AD9D] text-sm md:text-base text-center mb-6", children: error?.data?.message || 'Unable to load receipt. The payment may not exist or has been cancelled.' }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [_jsxs("button", { onClick: () => navigate('/dashboard'), className: "py-3 px-4 border-2 border-[#445048] text-[#C4AD9D] rounded-lg font-semibold hover:border-gray-500 hover:text-white transition-colors flex items-center justify-center text-sm md:text-base", children: [_jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }), "Dashboard"] }), _jsxs("button", { onClick: () => navigate('/'), className: "py-3 px-4 bg-[#027480] text-white rounded-lg font-semibold hover:bg-[#02606d] transition-colors flex items-center justify-center text-sm md:text-base", children: [_jsx(Home, { className: "mr-2 h-4 w-4" }), "Home"] })] }), _jsx("p", { className: "text-[#445048] text-xs md:text-sm text-center mt-6", children: "Need help? Contact our support team" })] }) }));
    }
    if (!receiptResponse?.data) {
        return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-[#0f2434] to-[#1a3247] flex items-center justify-center p-4", children: _jsxs("div", { className: "bg-[#001524] rounded-2xl border border-[#445048] p-6 md:p-8 max-w-md w-full", children: [_jsx("div", { className: "flex items-center justify-center gap-3 mb-4", children: _jsx(AlertCircle, { className: "h-10 w-10 md:h-12 md:w-12 text-yellow-500" }) }), _jsx("h2", { className: "text-xl md:text-2xl font-bold text-white text-center mb-3", children: "No Receipt Data" }), _jsx("p", { className: "text-[#C4AD9D] text-sm md:text-base text-center mb-6", children: "No receipt data available. Please check your payment information." }), _jsxs("button", { onClick: () => navigate('/dashboard'), className: "w-full py-3 bg-gradient-to-r from-[#027480] to-[#F57251] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center", children: [_jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }), "Return to Dashboard"] })] }) }));
    }
    const { payment, booking, user } = receiptResponse.data;
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-[#0f2434] to-[#1a3247] p-4", children: [_jsx("div", { className: "lg:hidden mb-4", children: _jsxs("button", { onClick: () => navigate('/dashboard'), className: "flex items-center text-[#C4AD9D] hover:text-white transition-colors text-sm", children: [_jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }), "Back to Dashboard"] }) }), _jsx("div", { className: "lg:hidden mb-4 text-center", children: _jsx("p", { className: "text-[#C4AD9D] text-sm", children: "Pinch to zoom or scroll to view receipt details" }) }), _jsx("div", { className: "flex justify-center items-center min-h-[calc(100vh-100px)]", children: _jsx("div", { className: "w-full max-w-4xl mx-auto", children: _jsx(ReceiptModal, { isOpen: isModalOpen, onClose: handleClose, booking: booking, payment: payment, user: user }) }) }), _jsx("div", { className: "lg:hidden mt-6", children: _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("button", { onClick: () => window.print(), className: "py-3 bg-[#027480] text-white rounded-lg font-semibold hover:bg-[#02606d] transition-colors flex items-center justify-center text-sm", children: [_jsx("span", { className: "mr-2", children: "\uD83D\uDDA8\uFE0F" }), "Print Receipt"] }), _jsxs("button", { onClick: handleClose, className: "py-3 bg-[#445048] text-[#E9E6DD] rounded-lg font-semibold hover:bg-[#5a625b] transition-colors flex items-center justify-center text-sm", children: [_jsx(Home, { className: "mr-2 h-4 w-4" }), "Close"] })] }) })] }));
};
export default ReceiptPage;
