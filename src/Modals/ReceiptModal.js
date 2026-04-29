import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { X, Download, Printer, Share2, CheckCircle, Car, Calendar, User, MapPin, Mail, Phone, Ticket, Globe, } from "lucide-react";
const ReceiptModal = ({ isOpen, onClose, booking, payment, user, }) => {
    const receiptRef = useRef(null);
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
    if (!isOpen)
        return null;
    // Format Date Only (for rental period)
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };
    // Format Date & Time (for the generation timestamp)
    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "KES",
        }).format(amount);
    };
    const qrCodeData = JSON.stringify({
        receiptId: `REC-${payment.payment_id}`,
        transactionId: payment.transaction_id,
        amount: payment.net_amount,
        date: payment.payment_date,
    });
    const downloadAsPDF = async () => {
        if (!receiptRef.current)
            return;
        setIsGeneratingPDF(true);
        try {
            const canvas = await html2canvas(receiptRef.current, {
                scale: 3,
                backgroundColor: "#ffffff",
                useCORS: true,
                logging: false,
            });
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4",
            });
            const imgWidth = 190;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            const xOffset = (210 - imgWidth) / 2;
            pdf.addImage(imgData, "PNG", xOffset, 10, imgWidth, imgHeight);
            pdf.save(`VansKE-Receipt-${payment.transaction_id}.pdf`);
        }
        catch (error) {
            console.error("Error generating PDF:", error);
        }
        finally {
            setIsGeneratingPDF(false);
        }
    };
    const printReceipt = () => window.print();
    const shareReceipt = () => {
        if (navigator.share) {
            navigator.share({
                title: `VansKE Receipt - ${payment.transaction_id}`,
                text: `Payment receipt for booking #${booking.booking_id}`,
                url: window.location.href,
            });
        }
        else {
            navigator.clipboard.writeText(`VansKE Receipt: ${payment.transaction_id}\nAmount: ${formatCurrency(payment.net_amount)}`);
            alert("Receipt details copied to clipboard!");
        }
    };
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "fixed inset-0 bg-[#001524]/80 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6", children: _jsxs("div", { className: "bg-[#E9E6DD] rounded-2xl w-full max-w-4xl max-h-[95vh] flex flex-col shadow-2xl overflow-hidden border border-[#C4AD9D]/30", children: [_jsxs("div", { className: "flex items-center justify-between p-4 bg-white/50 backdrop-blur-sm border-b border-[#C4AD9D]/50", children: [_jsxs("h2", { className: "text-xl font-bold text-[#001524] flex items-center gap-2", children: [_jsx(Ticket, { className: "w-5 h-5 text-[#027480]" }), "Transaction:", " ", _jsx("span", { className: "font-mono text-[#027480]", children: payment.transaction_id })] }), _jsx("button", { onClick: onClose, className: "p-2 bg-white hover:bg-[#F57251] hover:text-white rounded-full transition-colors shadow-sm text-[#445048]", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsx("div", { className: "flex-1 overflow-y-auto p-4 sm:p-8", children: _jsxs("div", { ref: receiptRef, className: "receipt-printable max-w-3xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden border border-[#C4AD9D]/30 relative", children: [_jsxs("div", { className: "bg-[#001524] px-6 sm:px-8 pt-8 pb-8 flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4 border-b-4 border-[#027480]", children: [_jsxs("div", { className: "flex items-start gap-4 w-full sm:w-auto", children: [_jsx("div", { className: "w-20 h-20 rounded-full bg-white p-1.5 shadow-md border-2 border-[#E9E6DD] shrink-0 flex items-center justify-center overflow-hidden mt-1", children: _jsx("img", { src: "/logo.png", alt: "VansKE", className: "w-full h-full object-cover rounded-full" }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("h1", { className: "text-3xl font-black text-white tracking-wide", children: ["Vans", _jsx("span", { className: "text-[#027480]", children: "KE" })] }), _jsx("p", { className: "text-[#C4AD9D] text-sm uppercase tracking-wider font-semibold mb-3", children: "Car Rental Ticket" }), _jsxs("div", { className: "text-[#E9E6DD] text-xs space-y-1.5 font-medium", children: [_jsxs("p", { className: "flex items-center gap-2", children: [_jsx(Phone, { className: "w-3.5 h-3.5 text-[#F57251] shrink-0" }), _jsx("span", { children: "+254 112 178 578" })] }), _jsxs("p", { className: "flex items-center gap-2", children: [_jsx(Mail, { className: "w-3.5 h-3.5 text-[#F57251] shrink-0" }), _jsx("span", { className: "truncate", children: "receipt@vansrental.com" })] }), _jsxs("p", { className: "flex items-center gap-2", children: [_jsx(Globe, { className: "w-3.5 h-3.5 text-[#F57251] shrink-0" }), _jsx("span", { className: "truncate", children: "https://vanskecarrental.netlify.app" })] })] })] })] }), _jsxs("div", { className: "text-center sm:text-right mt-4 sm:mt-0 shrink-0", children: [_jsx("p", { className: "text-[#C4AD9D] text-sm font-semibold uppercase mb-1", children: "Receipt No." }), _jsxs("p", { className: "text-2xl font-mono font-bold text-white bg-[#027480]/20 px-3 py-1.5 rounded-md border border-[#027480]/50 shadow-inner", children: ["REC-", payment.payment_id] })] })] }), _jsxs("div", { className: "p-6 sm:p-8", children: [_jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-between bg-[#E9E6DD]/40 rounded-xl p-6 border border-[#C4AD9D]/30 mb-8 relative overflow-hidden", children: [_jsx(CheckCircle, { className: "absolute -right-6 -bottom-6 w-32 h-32 text-[#027480]/5" }), _jsxs("div", { className: "relative z-10", children: [_jsx("p", { className: "text-[#445048] font-semibold mb-1", children: "Total Amount Paid" }), _jsx("h2", { className: "text-4xl font-black text-[#001524]", children: formatCurrency(payment.net_amount) }), _jsxs("p", { className: "text-sm text-[#445048] mt-2 flex items-center gap-2", children: [_jsx("span", { className: "w-2 h-2 bg-[#027480] rounded-full" }), payment.payment_method, " \u2022", " ", formatDateTime(payment.payment_date)] })] }), _jsx("div", { className: "mt-4 sm:mt-0 relative z-10 transform sm:rotate-12", children: _jsx("div", { className: "border-4 border-[#F57251] text-[#F57251] rounded-lg px-6 py-2 text-2xl font-black tracking-widest uppercase shadow-sm bg-white/80 backdrop-blur-sm", children: "PAID" }) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8 mb-8", children: [_jsxs("div", { children: [_jsxs("h3", { className: "text-sm font-bold text-[#C4AD9D] uppercase tracking-wider mb-3 flex items-center gap-2 border-b border-[#E9E6DD] pb-2", children: [_jsx(User, { className: "w-4 h-4 text-[#027480]" }), " Billed To"] }), _jsxs("p", { className: "font-bold text-lg text-[#001524]", children: [user.first_name, " ", user.last_name] }), _jsxs("div", { className: "text-[#445048] text-sm mt-2 space-y-1", children: [_jsxs("p", { className: "flex items-center gap-2", children: [_jsx(Mail, { className: "w-3.5 h-3.5" }), " ", user.email] }), _jsxs("p", { className: "flex items-center gap-2", children: [_jsx(Phone, { className: "w-3.5 h-3.5" }), " ", user.contact_phone] }), user.address && (_jsxs("p", { className: "flex items-center gap-2", children: [_jsx(MapPin, { className: "w-3.5 h-3.5" }), " ", user.address] }))] })] }), _jsxs("div", { children: [_jsxs("h3", { className: "text-sm font-bold text-[#C4AD9D] uppercase tracking-wider mb-3 flex items-center gap-2 border-b border-[#E9E6DD] pb-2", children: [_jsx(Car, { className: "w-4 h-4 text-[#027480]" }), " Vehicle Details"] }), _jsxs("p", { className: "font-bold text-lg text-[#001524]", children: [booking.vehicle_manufacturer, " ", booking.vehicle_model] }), _jsxs("div", { className: "text-[#445048] text-sm mt-2 space-y-1", children: [_jsxs("p", { children: ["Year:", " ", _jsx("span", { className: "font-semibold text-[#001524]", children: booking.vehicle_year })] }), booking.license_plate && (_jsxs("p", { children: ["Plate:", " ", _jsx("span", { className: "font-mono bg-[#E9E6DD] px-2 py-0.5 rounded text-[#001524] font-bold", children: booking.license_plate })] }))] })] })] }), _jsxs("div", { className: "w-full border-t-2 border-dashed border-[#C4AD9D] my-8 relative", children: [_jsx("div", { className: "absolute -left-10 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#E9E6DD] rounded-full border-r border-[#C4AD9D]/30" }), _jsx("div", { className: "absolute -right-10 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#E9E6DD] rounded-full border-l border-[#C4AD9D]/30" })] }), _jsxs("div", { className: "flex flex-col md:flex-row justify-between gap-8 items-center", children: [_jsxs("div", { className: "flex-1 w-full bg-[#001524] rounded-xl p-6 text-white relative overflow-hidden", children: [_jsx("div", { className: "absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-[#027480] to-transparent opacity-30" }), _jsxs("h3", { className: "flex items-center gap-2 text-[#C4AD9D] text-sm font-bold uppercase mb-4", children: [_jsx(Calendar, { className: "w-4 h-4 text-[#F57251]" }), " Rental Period"] }), _jsxs("div", { className: "flex items-center justify-between relative z-10", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs text-[#E9E6DD] mb-1", children: "Pick-up" }), _jsx("p", { className: "font-bold", children: formatDate(booking.booking_date) })] }), _jsx("div", { className: "h-0.5 w-12 bg-[#027480]" }), _jsxs("div", { className: "text-right", children: [_jsx("p", { className: "text-xs text-[#E9E6DD] mb-1", children: "Return" }), _jsx("p", { className: "font-bold", children: formatDate(booking.return_date) })] })] })] }), _jsxs("div", { className: "flex flex-col items-center justify-center shrink-0", children: [_jsx("div", { className: "p-2 border-2 border-[#E9E6DD] rounded-xl bg-white", children: _jsx(QRCodeSVG, { value: qrCodeData, size: 100, level: "M", fgColor: "#001524" }) }), _jsx("p", { className: "text-[10px] text-[#C4AD9D] mt-2 uppercase font-bold tracking-widest", children: "Official QR Code" })] })] }), _jsxs("div", { className: "mt-8 pt-6 border-t border-[#E9E6DD] flex flex-col md:flex-row justify-between gap-6", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h4", { className: "font-bold text-[#001524] text-sm uppercase tracking-wider mb-2", children: "Important Notes" }), _jsxs("ul", { className: "space-y-1.5 text-sm text-[#445048]", children: [_jsxs("li", { className: "flex items-start gap-2", children: [_jsx("span", { className: "text-[#F57251] font-bold mt-0.5", children: "\u2022" }), "Keep this receipt for your records"] }), _jsxs("li", { className: "flex items-start gap-2", children: [_jsx("span", { className: "text-[#F57251] font-bold mt-0.5", children: "\u2022" }), "Present QR code at pickup if required"] }), _jsxs("li", { className: "flex items-start gap-2", children: [_jsx("span", { className: "text-[#F57251] font-bold mt-0.5", children: "\u2022" }), "Contact support for any queries"] })] })] }), _jsxs("div", { className: "flex-1 flex flex-col justify-end text-left md:text-right", children: [_jsx("p", { className: "text-sm text-[#445048] mb-2", children: "This is an official payment receipt. For any inquiries, contact our support team." }), _jsxs("p", { className: "text-xs font-mono text-[#C4AD9D]", children: ["Generated on ", formatDateTime(new Date().toISOString())] })] })] })] })] }) }), _jsxs("div", { className: "p-4 sm:p-6 bg-white border-t border-[#C4AD9D]/30 flex flex-wrap gap-3 justify-end items-center", children: [_jsxs("button", { onClick: shareReceipt, className: "px-4 py-2 border-2 border-[#E9E6DD] rounded-lg font-bold text-[#001524] hover:border-[#027480] hover:text-[#027480] transition-colors flex items-center gap-2", children: [_jsx(Share2, { className: "w-4 h-4" }), " Share"] }), _jsxs("button", { onClick: printReceipt, className: "px-4 py-2 border-2 border-[#E9E6DD] rounded-lg font-bold text-[#001524] hover:border-[#027480] hover:text-[#027480] transition-colors flex items-center gap-2", children: [_jsx(Printer, { className: "w-4 h-4" }), " Print"] }), _jsxs("button", { onClick: downloadAsPDF, disabled: isGeneratingPDF, className: "px-6 py-2 bg-[#027480] text-white rounded-lg font-bold hover:bg-[#001524] transition-colors flex items-center gap-2 shadow-md disabled:opacity-70", children: [_jsx(Download, { className: "w-4 h-4" }), isGeneratingPDF ? "Generating..." : "Download Ticket"] })] })] }) }), _jsx("style", { children: `
          @media print {
            body {
                background: white !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            body * {
              visibility: hidden;
            }
            .fixed.inset-0 {
                background: transparent !important;
                position: absolute;
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
              margin: 0;
              padding: 0;
              border: none !important;
              box-shadow: none !important;
            }
          }
        ` })] }));
};
export default ReceiptModal;
