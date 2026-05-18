import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { X, Download, CheckCircle, Car, Calendar, User, MapPin, Mail, Phone, Ticket, Globe, Loader2, } from "lucide-react";
/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */
const formatDate = (dateString) => new Date(dateString).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
});
const formatDateTime = (dateString) => new Date(dateString).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
});
const formatCurrency = (amount) => new Intl.NumberFormat("en-US", { style: "currency", currency: "KES" }).format(amount);
/**
 * Remove all oklch() and color-mix() from CSS text by replacing them with a
 * fallback color (#000000). This allows html2canvas to parse the styles.
 */
const sanitizeCSS = (cssText) => {
    let sanitized = cssText.replace(/oklch\([^)]+\)/gi, "#000000");
    sanitized = sanitized.replace(/color-mix\([^)]+\)/gi, "#000000");
    return sanitized;
};
/**
 * Build a cloned receipt inside a hidden iframe with all stylesheets copied
 * and sanitised. Returns a promise that resolves when images are loaded.
 */
const buildSanitizedClone = async (receiptElement) => {
    // Create hidden iframe
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.top = "-9999px";
    iframe.style.left = "-9999px";
    iframe.style.width = `${receiptElement.offsetWidth}px`;
    iframe.style.height = `${receiptElement.offsetHeight}px`;
    document.body.appendChild(iframe);
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) {
        document.body.removeChild(iframe);
        throw new Error("Cannot access iframe document");
    }
    // ---------- 1. Copy all stylesheets ----------
    const mainStyleSheets = Array.from(document.styleSheets);
    for (const sheet of mainStyleSheets) {
        try {
            // Inline stylesheets (<style>)
            if (sheet.ownerNode && sheet.ownerNode instanceof HTMLStyleElement) {
                const styleClone = iframeDoc.createElement("style");
                styleClone.textContent = sanitizeCSS(sheet.ownerNode.textContent ?? "");
                iframeDoc.head.appendChild(styleClone);
            }
            // External stylesheets (<link>)
            else if (sheet.href) {
                try {
                    const response = await fetch(sheet.href);
                    if (response.ok) {
                        const cssText = await response.text();
                        const styleClone = iframeDoc.createElement("style");
                        styleClone.textContent = sanitizeCSS(cssText);
                        iframeDoc.head.appendChild(styleClone);
                    }
                    else {
                        // Fallback: copy the <link> (might still contain oklch, but unlikely to work)
                        const linkClone = iframeDoc.createElement("link");
                        linkClone.rel = "stylesheet";
                        linkClone.href = sheet.href;
                        iframeDoc.head.appendChild(linkClone);
                    }
                }
                catch {
                    // CORS blocked – copy the link as fallback
                    const linkClone = iframeDoc.createElement("link");
                    linkClone.rel = "stylesheet";
                    linkClone.href = sheet.href;
                    iframeDoc.head.appendChild(linkClone);
                }
            }
        }
        catch (e) {
            // Cross-origin sheet (CORS) – ignore
        }
    }
    // ---------- 2. Clone the receipt element ----------
    const clone = receiptElement.cloneNode(true);
    iframeDoc.body.appendChild(clone);
    // Wait for images to load inside the iframe
    const images = iframeDoc.querySelectorAll("img");
    await Promise.all(Array.from(images).map((img) => new Promise((resolve) => {
        if (img.complete)
            resolve();
        else {
            img.onload = () => resolve();
            img.onerror = () => resolve();
        }
    })));
    return { iframe, clone };
};
/**
 * Generate a PDF blob from the receipt.
 */
const generatePDFBlob = async (receiptElement) => {
    const { iframe, clone } = await buildSanitizedClone(receiptElement);
    try {
        // Wait a tick for styles to fully apply
        await new Promise((r) => setTimeout(r, 150));
        const canvas = await html2canvas(clone, {
            scale: 2,
            backgroundColor: "#ffffff",
            useCORS: true,
            logging: false,
            allowTaint: false,
        });
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
        });
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 10;
        const maxWidth = pageWidth - margin * 2;
        const maxHeight = pageHeight - margin * 2;
        let imgWidth = maxWidth;
        let imgHeight = (canvas.height * imgWidth) / canvas.width;
        if (imgHeight > maxHeight) {
            imgHeight = maxHeight;
            imgWidth = (canvas.width * imgHeight) / canvas.height;
        }
        pdf.addImage(imgData, "PNG", (pageWidth - imgWidth) / 2, margin, imgWidth, imgHeight);
        return pdf.output("blob");
    }
    finally {
        document.body.removeChild(iframe);
    }
};
/* ------------------------------------------------------------------ */
/*  Receipt Modal Component                                            */
/* ------------------------------------------------------------------ */
const ReceiptModal = ({ isOpen, onClose, booking, payment, user, }) => {
    const receiptRef = useRef(null);
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
    const [isSharing, setIsSharing] = useState(false);
    if (!isOpen)
        return null;
    const receiptNumber = `REC-${payment.payment_id}`;
    const safeFileName = `${user.first_name}_${user.last_name}_${receiptNumber}.pdf`;
    const qrCodeData = JSON.stringify({
        receiptId: receiptNumber,
        transactionId: payment.transaction_id,
        amount: payment.net_amount,
        date: payment.payment_date,
    });
    // ─── Download ───
    const downloadAsPDF = async () => {
        if (!receiptRef.current)
            return;
        setIsGeneratingPDF(true);
        try {
            const pdfBlob = await generatePDFBlob(receiptRef.current);
            const url = URL.createObjectURL(pdfBlob);
            const link = document.createElement("a");
            link.href = url;
            link.download = safeFileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
        catch (err) {
            console.error("Download error:", err);
            alert("Unable to generate PDF. Please try again.");
        }
        finally {
            setIsGeneratingPDF(false);
        }
    };
    // ─── Print ───
    const printReceipt = async () => {
        if (!receiptRef.current)
            return;
        try {
            const { iframe, clone } = await buildSanitizedClone(receiptRef.current);
            // Ensure the iframe is visible for printing
            iframe.style.position = "fixed";
            iframe.style.top = "0";
            iframe.style.left = "0";
            iframe.style.width = "100%";
            iframe.style.height = "100%";
            iframe.style.border = "none";
            iframe.style.zIndex = "99999";
            const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
            if (!iframeDoc)
                throw new Error("No iframe document");
            // Add print‑friendly styles
            const printStyle = iframeDoc.createElement("style");
            printStyle.textContent = `
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          width: 100%;
          background: white;
        }
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
      `;
            iframeDoc.head.appendChild(printStyle);
            // Wait for images again (already done in buildSanitizedClone, but just in case)
            await new Promise((r) => setTimeout(r, 200));
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();
            // Clean up after print dialog closes
            const onAfterPrint = () => {
                document.body.removeChild(iframe);
                window.removeEventListener("afterprint", onAfterPrint);
            };
            window.addEventListener("afterprint", onAfterPrint);
            // Fallback removal
            setTimeout(() => {
                if (document.body.contains(iframe))
                    document.body.removeChild(iframe);
            }, 5000);
        }
        catch (err) {
            console.error("Print error:", err);
            alert("Could not open print dialog. Please try again.");
        }
    };
    // ─── Share ───
    const shareReceipt = async () => {
        if (!receiptRef.current)
            return;
        setIsSharing(true);
        try {
            const pdfBlob = await generatePDFBlob(receiptRef.current);
            const file = new File([pdfBlob], safeFileName, {
                type: "application/pdf",
            });
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: `VansKE Receipt - ${payment.transaction_id}`,
                    text: `Payment receipt for booking #${booking.booking_id}. Total: ${formatCurrency(payment.net_amount)}`,
                    files: [file],
                });
            }
            else if (navigator.share) {
                await navigator.share({
                    title: `VansKE Receipt - ${payment.transaction_id}`,
                    text: `Payment receipt for booking #${booking.booking_id}. Total: ${formatCurrency(payment.net_amount)}`,
                });
            }
            else {
                await navigator.clipboard.writeText(`VansKE Receipt: ${payment.transaction_id}\nAmount: ${formatCurrency(payment.net_amount)}\nReceipt ID: ${receiptNumber}`);
                alert("Receipt details copied to clipboard! You can also download the PDF.");
            }
        }
        catch (error) {
            console.error("Share error:", error);
            if (error instanceof Error && error.name !== "AbortError") {
                alert("Unable to share. You can download the PDF instead.");
            }
        }
        finally {
            setIsSharing(false);
        }
    };
    // ─── UI ───
    return (_jsx("div", { className: "fixed inset-0 bg-[#001524]/80 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6", children: _jsxs("div", { className: "bg-[#E9E6DD] rounded-2xl w-full max-w-4xl max-h-[95vh] flex flex-col shadow-2xl overflow-hidden border border-[#EDE6E1]", children: [_jsxs("div", { className: "flex items-center justify-between p-4 bg-white/50 backdrop-blur-sm border-b border-[#EDE6E1] print:hidden", children: [_jsxs("h2", { className: "text-xl font-bold text-[#001524] flex items-center gap-2", children: [_jsx(Ticket, { className: "w-5 h-5 text-[#027480]" }), "Transaction:", " ", _jsx("span", { className: "font-mono text-[#027480]", children: payment.transaction_id })] }), _jsx("button", { onClick: onClose, className: "p-2 bg-white hover:bg-[#F57251] hover:text-white rounded-full transition-colors shadow-sm text-[#445048]", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsx("div", { className: "flex-1 overflow-y-auto p-4 sm:p-8", children: _jsxs("div", { ref: receiptRef, className: "max-w-3xl mx-auto bg-white rounded-xl overflow-hidden shadow-xl border border-[#EDE6E1]", children: [_jsxs("div", { className: "bg-[#001524] px-6 sm:px-8 pt-8 pb-8 flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4 border-b-4 border-[#027480]", children: [_jsxs("div", { className: "flex items-start gap-4 w-full sm:w-auto", children: [_jsx("div", { className: "w-20 h-20 rounded-full bg-white p-1.5 shadow-lg border-2 border-[#E9E6DD] shrink-0 flex items-center justify-center overflow-hidden mt-1", children: _jsx("img", { src: "/logo.png", alt: "VansKE", className: "w-full h-full object-cover rounded-full", crossOrigin: "anonymous" }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("h1", { className: "text-3xl font-black text-white tracking-wide", children: ["Vans", _jsx("span", { className: "text-[#027480]", children: "KE" })] }), _jsx("p", { className: "text-[#C4AD9D] text-sm uppercase tracking-wider font-semibold mb-3", children: "Car Rental Ticket" }), _jsxs("div", { className: "text-[#E9E6DD] text-xs space-y-2 font-medium", children: [_jsxs("p", { className: "flex items-start gap-2", children: [_jsx(Phone, { className: "w-3.5 h-3.5 text-[#F57251] shrink-0 mt-0.5" }), _jsx("span", { children: "+254 112 178 578" })] }), _jsxs("p", { className: "flex items-start gap-2", children: [_jsx(Mail, { className: "w-3.5 h-3.5 text-[#F57251] shrink-0 mt-0.5" }), _jsx("span", { className: "break-all", children: "receipt@vansrental.com" })] }), _jsxs("p", { className: "flex items-start gap-2", children: [_jsx(Globe, { className: "w-3.5 h-3.5 text-[#F57251] shrink-0 mt-0.5" }), _jsx("span", { className: "break-all", children: "https://vanskecarrental.netlify.app" })] })] })] })] }), _jsxs("div", { className: "text-center sm:text-right mt-4 sm:mt-0 shrink-0", children: [_jsx("p", { className: "text-[#C4AD9D] text-sm font-semibold uppercase mb-1", children: "Receipt No." }), _jsx("p", { className: "text-2xl font-mono font-bold text-white bg-white/10 px-3 py-1.5 rounded-md backdrop-blur-sm border border-white/20 shadow-inner", children: receiptNumber })] })] }), _jsxs("div", { className: "p-6 sm:p-8", children: [_jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-between bg-linear-to-r from-[#F6F5F1] to-white rounded-xl p-6 border border-[#EDE6E1] shadow-sm mb-8 relative overflow-hidden", children: [_jsx(CheckCircle, { className: "absolute -right-6 -bottom-6 w-32 h-32 text-[#027480]/5" }), _jsxs("div", { className: "relative z-10", children: [_jsx("p", { className: "text-[#445048] font-semibold mb-1", children: "Total Amount Paid" }), _jsx("h2", { className: "text-4xl font-black text-[#001524]", children: formatCurrency(payment.net_amount) }), _jsxs("p", { className: "text-sm text-[#445048] mt-2 flex items-center gap-2", children: [_jsx("span", { className: "w-2 h-2 bg-[#027480] rounded-full" }), payment.payment_method, " \u2022", " ", formatDateTime(payment.payment_date)] })] }), _jsx("div", { className: "mt-4 sm:mt-0 relative z-10 transform sm:rotate-12", children: _jsx("div", { className: "border-4 border-[#F57251] text-[#F57251] rounded-lg px-6 py-2 text-2xl font-black tracking-widest uppercase shadow-lg bg-white/80 backdrop-blur-sm", children: "PAID" }) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8 mb-8", children: [_jsxs("div", { children: [_jsxs("h3", { className: "text-sm font-bold text-[#C4AD9D] uppercase tracking-wider mb-3 flex items-center gap-2 border-b border-[#E9E6DD] pb-2", children: [_jsx(User, { className: "w-4 h-4 text-[#027480]" }), " Billed To"] }), _jsxs("p", { className: "font-bold text-lg text-[#001524]", children: [user.first_name, " ", user.last_name] }), _jsxs("div", { className: "text-[#445048] text-sm mt-2 space-y-1", children: [_jsxs("p", { className: "flex items-center gap-2", children: [_jsx(Mail, { className: "w-3.5 h-3.5" }), " ", user.email] }), _jsxs("p", { className: "flex items-center gap-2", children: [_jsx(Phone, { className: "w-3.5 h-3.5" }), " ", user.contact_phone] }), user.address && (_jsxs("p", { className: "flex items-center gap-2", children: [_jsx(MapPin, { className: "w-3.5 h-3.5" }), " ", user.address] }))] })] }), _jsxs("div", { children: [_jsxs("h3", { className: "text-sm font-bold text-[#C4AD9D] uppercase tracking-wider mb-3 flex items-center gap-2 border-b border-[#E9E6DD] pb-2", children: [_jsx(Car, { className: "w-4 h-4 text-[#027480]" }), " Vehicle Details"] }), _jsxs("p", { className: "font-bold text-lg text-[#001524]", children: [booking.vehicle_manufacturer, " ", booking.vehicle_model] }), _jsxs("div", { className: "text-[#445048] text-sm mt-2 space-y-1", children: [_jsxs("p", { children: ["Year:", " ", _jsx("span", { className: "font-semibold text-[#001524]", children: booking.vehicle_year })] }), booking.license_plate && (_jsxs("p", { children: ["Plate:", " ", _jsx("span", { className: "font-mono bg-[#E9E6DD] px-2 py-0.5 rounded text-[#001524] font-bold shadow-sm", children: booking.license_plate })] }))] })] })] }), _jsxs("div", { className: "w-full border-t-2 border-dashed border-[#C4AD9D] my-8 relative", children: [_jsx("div", { className: "absolute -left-10 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#E9E6DD] rounded-full border-r border-[#EDE6E1] print:hidden shadow-inner" }), _jsx("div", { className: "absolute -right-10 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#E9E6DD] rounded-full border-l border-[#EDE6E1] print:hidden shadow-inner" })] }), _jsxs("div", { className: "flex flex-col md:flex-row justify-between gap-8 items-center", children: [_jsxs("div", { className: "flex-1 w-full bg-linear-to-br from-[#012B38] to-[#014452] rounded-xl p-6 text-white shadow-lg relative overflow-hidden border border-[#014452]", children: [_jsx("div", { className: "absolute inset-0 bg-white/5 rounded-xl" }), _jsxs("h3", { className: "flex items-center gap-2 text-[#0a0a09] text-sm font-bold uppercase mb-4 relative z-10", children: [_jsx(Calendar, { className: "w-4 h-4 text-[#F57251]" }), " Rental Period"] }), _jsxs("div", { className: "flex items-center justify-between relative z-10", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs text-[#2c221b] mb-1", children: "Pick-up" }), _jsx("p", { className: "font-bold text-black text-lg", children: formatDate(booking.booking_date) })] }), _jsx("div", { className: "h-0.5 w-12 bg-[#027480]/50" }), _jsxs("div", { className: "text-right", children: [_jsx("p", { className: "text-xs text-[#2c221b] mb-1", children: "Return" }), _jsx("p", { className: "font-bold text-black text-lg", children: formatDate(booking.return_date) })] })] })] }), _jsxs("div", { className: "flex flex-col items-center justify-center shrink-0", children: [_jsx("div", { className: "p-2 border-2 border-[#E9E6DD] rounded-xl bg-white shadow-sm", children: _jsx(QRCodeSVG, { value: qrCodeData, size: 100, level: "M", fgColor: "#001524" }) }), _jsx("p", { className: "text-[10px] text-[#F57251] mt-2 uppercase font-bold tracking-widest", children: "Official QR Code" })] })] }), _jsxs("div", { className: "mt-8 pt-6 border-t border-[#E9E6DD] flex flex-col md:flex-row justify-between gap-6", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h4", { className: "font-bold text-[#001524] text-sm uppercase tracking-wider mb-2", children: "Important Notes" }), _jsxs("ul", { className: "space-y-1.5 text-sm text-[#445048]", children: [_jsxs("li", { className: "flex items-start gap-2", children: [_jsx("span", { className: "text-[#F57251] font-bold mt-0.5", children: "\u2022" }), " ", "Keep this receipt for your records"] }), _jsxs("li", { className: "flex items-start gap-2", children: [_jsx("span", { className: "text-[#F57251] font-bold mt-0.5", children: "\u2022" }), " ", "Present QR code at pickup if required"] }), _jsxs("li", { className: "flex items-start gap-2", children: [_jsx("span", { className: "text-[#F57251] font-bold mt-0.5", children: "\u2022" }), " ", "Contact support for any queries"] })] })] }), _jsxs("div", { className: "flex-1 flex flex-col justify-end text-left md:text-right", children: [_jsx("p", { className: "text-sm text-[#445048] mb-2", children: "This is an official payment receipt." }), _jsxs("p", { className: "text-xs font-mono text-[#837a73]", children: ["Generated on ", formatDateTime(new Date().toISOString())] })] })] })] })] }) }), _jsx("div", { className: "p-4 sm:p-6 bg-white/50 backdrop-blur-md border-t border-[#EDE6E1] flex flex-wrap gap-3 justify-end items-center print:hidden", children: _jsxs("button", { onClick: downloadAsPDF, disabled: isGeneratingPDF, className: "px-6 py-2 bg-[#027480] text-white rounded-lg font-bold hover:bg-[#001524] transition-colors flex items-center gap-2 shadow-md disabled:opacity-70", children: [isGeneratingPDF ? (_jsx(Loader2, { className: "w-4 h-4 animate-spin" })) : (_jsx(Download, { className: "w-4 h-4" })), isGeneratingPDF ? "Generating..." : "Download"] }) })] }) }));
};
export default ReceiptModal;
