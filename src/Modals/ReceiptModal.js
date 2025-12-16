import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { X, Download, Printer, Share2, CheckCircle, Car, Calendar, CreditCard, User, MapPin, Mail, Phone } from 'lucide-react';
const ReceiptModal = ({ isOpen, onClose, booking, payment, user }) => {
    const receiptRef = useRef(null);
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
    if (!isOpen)
        return null;
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };
    // Generate QR Code Data
    const qrCodeData = JSON.stringify({
        receiptId: `REC-${payment.payment_id}`,
        bookingId: booking.booking_id,
        paymentId: payment.payment_id,
        transactionId: payment.transaction_id,
        amount: payment.net_amount,
        date: payment.payment_date,
        user: `${user.first_name} ${user.last_name}`
    });
    // Download as PDF
    const downloadAsPDF = async () => {
        if (!receiptRef.current)
            return;
        setIsGeneratingPDF(true);
        try {
            const canvas = await html2canvas(receiptRef.current, {
                scale: 2,
                backgroundColor: '#ffffff',
                useCORS: true,
                logging: false
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });
            const imgWidth = 190;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            const xOffset = (210 - imgWidth) / 2; // Center on A4
            pdf.addImage(imgData, 'PNG', xOffset, 10, imgWidth, imgHeight);
            pdf.save(`Receipt-${payment.transaction_id}.pdf`);
        }
        catch (error) {
            console.error('Error generating PDF:', error);
        }
        finally {
            setIsGeneratingPDF(false);
        }
    };
    // Print Receipt
    const printReceipt = () => {
        window.print();
    };
    // Share Receipt (can be extended for email sharing)
    const shareReceipt = () => {
        if (navigator.share) {
            navigator.share({
                title: `Payment Receipt - ${payment.transaction_id}`,
                text: `Payment receipt for booking #${booking.booking_id}`,
                url: window.location.href,
            });
        }
        else {
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(`Payment Receipt\nTransaction: ${payment.transaction_id}\nAmount: ${formatCurrency(payment.net_amount)}`);
            alert('Receipt details copied to clipboard!');
        }
    };
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4", children: _jsxs("div", { className: "bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col", children: [_jsxs("div", { className: "flex items-center justify-between p-6 border-b", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Payment Receipt" }), _jsxs("p", { className: "text-gray-600", children: ["Transaction #", payment.transaction_id] })] }), _jsx("button", { onClick: onClose, className: "p-2 hover:bg-gray-100 rounded-lg transition-colors", children: _jsx(X, { className: "w-6 h-6 text-gray-500" }) })] }), _jsx("div", { className: "flex-1 overflow-y-auto p-6", children: _jsxs("div", { ref: receiptRef, className: "max-w-3xl mx-auto bg-white p-8 border-2 border-dashed border-gray-200 rounded-xl", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4", children: _jsx(CheckCircle, { className: "w-10 h-10 text-green-600" }) }), _jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Payment Successful!" }), _jsx("p", { className: "text-gray-600 mt-2", children: "Thank you for your payment" }), _jsxs("div", { className: "mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full", children: [_jsx("span", { className: "w-2 h-2 bg-green-500 rounded-full animate-pulse" }), _jsxs("span", { className: "text-green-700 font-semibold", children: ["Paid \u2022 ", formatDate(payment.payment_date)] })] })] }), _jsxs("div", { className: "text-center mb-8", children: [_jsxs("div", { className: "inline-block px-6 py-2 bg-gray-900 text-white rounded-full font-bold text-lg", children: ["Vans", _jsx("span", { className: "text-[#027480]", children: "KE" })] }), _jsx("p", { className: "text-gray-600 mt-2", children: "Vans-Travel-Agency" }), _jsx("p", { className: "text-gray-500 text-sm", children: "receipt@vansrental.com \u2022 +254 112 178 578" })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [_jsxs("div", { className: "lg:col-span-2 space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-gray-50 p-5 rounded-xl border", children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx(User, { className: "w-5 h-5 text-gray-600" }), _jsx("h3", { className: "font-bold text-gray-900", children: "Customer Information" })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("p", { className: "font-semibold text-gray-900", children: [user.first_name, " ", user.last_name] }), _jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: [_jsx(Mail, { className: "w-4 h-4" }), _jsx("span", { children: user.email })] }), _jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: [_jsx(Phone, { className: "w-4 h-4" }), _jsx("span", { children: user.contact_phone })] }), user.address && (_jsxs("div", { className: "flex items-start gap-2 text-sm text-gray-600", children: [_jsx(MapPin, { className: "w-4 h-4 mt-0.5" }), _jsx("span", { children: user.address })] }))] })] }), _jsxs("div", { className: "bg-gray-50 p-5 rounded-xl border", children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx(Car, { className: "w-5 h-5 text-gray-600" }), _jsx("h3", { className: "font-bold text-gray-900", children: "Vehicle Details" })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("p", { className: "font-semibold text-gray-900", children: [booking.vehicle_manufacturer, " ", booking.vehicle_model] }), _jsxs("p", { className: "text-sm text-gray-600", children: ["Year: ", booking.vehicle_year] }), booking.license_plate && (_jsxs("p", { className: "text-sm text-gray-600", children: ["Plate: ", booking.license_plate] })), booking.vin_number && (_jsxs("p", { className: "text-sm text-gray-600", children: ["VIN: ", booking.vin_number] }))] })] })] }), _jsxs("div", { className: "bg-gray-50 p-5 rounded-xl border", children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx(Calendar, { className: "w-5 h-5 text-gray-600" }), _jsx("h3", { className: "font-bold text-gray-900", children: "Rental Period" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Pick-up Date" }), _jsx("p", { className: "font-semibold text-gray-900", children: formatDate(booking.booking_date) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Return Date" }), _jsx("p", { className: "font-semibold text-gray-900", children: formatDate(booking.return_date) })] })] })] }), _jsxs("div", { className: "bg-gray-50 p-5 rounded-xl border", children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx(CreditCard, { className: "w-5 h-5 text-gray-600" }), _jsx("h3", { className: "font-bold text-gray-900", children: "Payment Breakdown" })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600", children: "Subtotal" }), _jsx("span", { className: "font-medium", children: formatCurrency(booking.total_amount) })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600", children: "Commission Fee" }), _jsx("span", { className: "font-medium", children: formatCurrency(payment.commission_fee) })] }), _jsxs("div", { className: "flex justify-between border-t pt-3", children: [_jsx("span", { className: "text-gray-600", children: "Taxes & Fees" }), _jsx("span", { className: "font-medium", children: formatCurrency(payment.gross_amount - booking.total_amount - payment.commission_fee) })] }), _jsxs("div", { className: "flex justify-between text-lg font-bold border-t pt-3", children: [_jsx("span", { className: "text-gray-900", children: "Total Paid" }), _jsx("span", { className: "text-[#027480]", children: formatCurrency(payment.net_amount) })] })] })] })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "bg-gray-50 p-6 rounded-xl border text-center", children: [_jsx("h3", { className: "font-bold text-gray-900 mb-4", children: "Digital Verification" }), _jsx("div", { className: "flex justify-center", children: _jsx(QRCodeSVG, { value: qrCodeData, size: 180, level: "H", includeMargin: true, bgColor: "#ffffff", fgColor: "#001524" }) }), _jsx("p", { className: "text-xs text-gray-500 mt-4", children: "Scan to verify this receipt" }), _jsx("div", { className: "mt-4 p-3 bg-gray-100 rounded-lg", children: _jsx("p", { className: "text-xs font-mono text-gray-700 break-all", children: payment.transaction_id }) })] }), _jsxs("div", { className: "bg-gray-50 p-5 rounded-xl border", children: [_jsx("h3", { className: "font-bold text-gray-900 mb-3", children: "Payment Method" }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-6 bg-gray-200 rounded flex items-center justify-center", children: payment.payment_method === 'Credit Card' ? '💳' : '🏦' }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold text-gray-900", children: payment.payment_method }), _jsxs("p", { className: "text-sm text-gray-600", children: ["Payment ID: ", payment.payment_id] })] })] })] }), _jsxs("div", { className: "bg-blue-50 p-5 rounded-xl border border-blue-100", children: [_jsx("h3", { className: "font-bold text-gray-900 mb-3", children: "Important Notes" }), _jsxs("ul", { className: "space-y-2 text-sm text-gray-600", children: [_jsxs("li", { className: "flex items-start gap-2", children: [_jsx("span", { className: "text-blue-500 mt-0.5", children: "\u2022" }), "Keep this receipt for your records"] }), _jsxs("li", { className: "flex items-start gap-2", children: [_jsx("span", { className: "text-blue-500 mt-0.5", children: "\u2022" }), "Present QR code at pickup if required"] }), _jsxs("li", { className: "flex items-start gap-2", children: [_jsx("span", { className: "text-blue-500 mt-0.5", children: "\u2022" }), "Contact support for any queries"] })] })] })] })] }), _jsxs("div", { className: "mt-8 pt-8 border-t text-center", children: [_jsx("p", { className: "text-gray-600 text-sm", children: "This is an official payment receipt. For any inquiries, contact our support team." }), _jsxs("p", { className: "text-gray-500 text-xs mt-2", children: ["Generated on ", formatDate(new Date().toISOString())] })] })] }) }), _jsx("div", { className: "border-t p-6 bg-gray-50", children: _jsxs("div", { className: "flex flex-wrap gap-3 justify-end", children: [_jsxs("button", { onClick: shareReceipt, className: "px-5 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2", children: [_jsx(Share2, { className: "w-4 h-4" }), "Share"] }), _jsxs("button", { onClick: printReceipt, className: "px-5 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2", children: [_jsx(Printer, { className: "w-4 h-4" }), "Print"] }), _jsxs("button", { onClick: downloadAsPDF, disabled: isGeneratingPDF, className: "px-5 py-2.5 bg-[#027480] text-white rounded-lg font-medium hover:bg-[#02606d] transition-colors flex items-center gap-2 disabled:opacity-50", children: [_jsx(Download, { className: "w-4 h-4" }), isGeneratingPDF ? 'Generating...' : 'Download PDF'] })] }) })] }) }), _jsx("style", { children: `
          @media print {
            body * {
              visibility: hidden;
            }
            .receipt-printable,
            .receipt-printable * {
              visibility: visible;
            }
            .receipt-printable {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              padding: 20px;
            }
            .no-print {
              display: none !important;
            }
          }
        ` })] }));
};
export default ReceiptModal;
