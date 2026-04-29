import React, { useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  X,
  Download,
  Printer,
  Share2,
  CheckCircle,
  Car,
  Calendar,
  User,
  MapPin,
  Mail,
  Phone,
  Ticket,
  Globe,
} from "lucide-react";

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: {
    booking_id: number;
    total_amount: number;
    booking_date: string;
    return_date: string;
    vehicle_manufacturer: string;
    vehicle_model: string;
    vehicle_year: number;
    license_plate?: string;
    vin_number?: string;
  };
  payment: {
    payment_id: number;
    payment_date: string;
    payment_method: string;
    transaction_id: string;
    net_amount: number;
    commission_fee: number;
    gross_amount: number;
  };
  user: {
    first_name: string;
    last_name: string;
    email: string;
    contact_phone: string;
    address?: string;
  };
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  booking,
  payment,
  user,
}) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  if (!isOpen) return null;

  // Format Date Only (for rental period)
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format Date & Time (for the generation timestamp)
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
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
    if (!receiptRef.current) return;
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
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
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
    } else {
      navigator.clipboard.writeText(
        `VansKE Receipt: ${payment.transaction_id}\nAmount: ${formatCurrency(payment.net_amount)}`,
      );
      alert("Receipt details copied to clipboard!");
    }
  };

  return (
    <>
      {/* Modal Overlay */}
      <div className="fixed inset-0 bg-[#001524]/80 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Modal Container */}
        <div className="bg-[#E9E6DD] rounded-2xl w-full max-w-4xl max-h-[95vh] flex flex-col shadow-2xl overflow-hidden border border-[#C4AD9D]/30">
          {/* Header Actions */}
          <div className="flex items-center justify-between p-4 bg-white/50 backdrop-blur-sm border-b border-[#C4AD9D]/50">
            <h2 className="text-xl font-bold text-[#001524] flex items-center gap-2">
              <Ticket className="w-5 h-5 text-[#027480]" />
              Transaction:{" "}
              <span className="font-mono text-[#027480]">
                {payment.transaction_id}
              </span>
            </h2>
            <button
              onClick={onClose}
              className="p-2 bg-white hover:bg-[#F57251] hover:text-white rounded-full transition-colors shadow-sm text-[#445048]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8">
            {/* --- ACTUAL TICKET (Printable Area) --- */}
            <div
              ref={receiptRef}
              className="receipt-printable max-w-3xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden border border-[#C4AD9D]/30 relative"
            >
              {/* TICKET HEADER (Now dynamically sizing to its content!) */}
              <div className="bg-[#001524] px-6 sm:px-8 pt-8 pb-8 flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4 border-b-4 border-[#027480]">
                <div className="flex items-start gap-4 w-full sm:w-auto">
                  {/* PERFECTLY ROUNDED LOGO */}
                  <div className="w-20 h-20 rounded-full bg-white p-1.5 shadow-md border-2 border-[#E9E6DD] shrink-0 flex items-center justify-center overflow-hidden mt-1">
                    <img
                      src="/logo.png"
                      alt="VansKE"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h1 className="text-3xl font-black text-white tracking-wide">
                      Vans<span className="text-[#027480]">KE</span>
                    </h1>
                    <p className="text-[#C4AD9D] text-sm uppercase tracking-wider font-semibold mb-3">
                      Car Rental Ticket
                    </p>

                    {/* NEW: Company Contact Info */}
                    <div className="text-[#E9E6DD] text-xs space-y-1.5 font-medium">
                      <p className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-[#F57251] shrink-0" />
                        <span>+254 112 178 578</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-[#F57251] shrink-0" />
                        <span className="truncate">receipt@vansrental.com</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5 text-[#F57251] shrink-0" />
                        <span className="truncate">
                          https://vanskecarrental.netlify.app
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-center sm:text-right mt-4 sm:mt-0 shrink-0">
                  <p className="text-[#C4AD9D] text-sm font-semibold uppercase mb-1">
                    Receipt No.
                  </p>
                  <p className="text-2xl font-mono font-bold text-white bg-[#027480]/20 px-3 py-1.5 rounded-md border border-[#027480]/50 shadow-inner">
                    REC-{payment.payment_id}
                  </p>
                </div>
              </div>

              {/*.... ticket body remains the same ... */}

              {/* TICKET BODY */}
              <div className="p-6 sm:p-8">
                {/* PAID STAMP & SUMMARY */}
                <div className="flex flex-col sm:flex-row items-center justify-between bg-[#E9E6DD]/40 rounded-xl p-6 border border-[#C4AD9D]/30 mb-8 relative overflow-hidden">
                  <CheckCircle className="absolute -right-6 -bottom-6 w-32 h-32 text-[#027480]/5" />

                  <div className="relative z-10">
                    <p className="text-[#445048] font-semibold mb-1">
                      Total Amount Paid
                    </p>
                    <h2 className="text-4xl font-black text-[#001524]">
                      {formatCurrency(payment.net_amount)}
                    </h2>
                    <p className="text-sm text-[#445048] mt-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#027480] rounded-full"></span>
                      {payment.payment_method} •{" "}
                      {formatDateTime(payment.payment_date)}
                    </p>
                  </div>

                  {/* Catchy PAID Stamp */}
                  <div className="mt-4 sm:mt-0 relative z-10 transform sm:rotate-12">
                    <div className="border-4 border-[#F57251] text-[#F57251] rounded-lg px-6 py-2 text-2xl font-black tracking-widest uppercase shadow-sm bg-white/80 backdrop-blur-sm">
                      PAID
                    </div>
                  </div>
                </div>

                {/* INFO GRIDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  {/* Customer Info */}
                  <div>
                    <h3 className="text-sm font-bold text-[#C4AD9D] uppercase tracking-wider mb-3 flex items-center gap-2 border-b border-[#E9E6DD] pb-2">
                      <User className="w-4 h-4 text-[#027480]" /> Billed To
                    </h3>
                    <p className="font-bold text-lg text-[#001524]">
                      {user.first_name} {user.last_name}
                    </p>
                    <div className="text-[#445048] text-sm mt-2 space-y-1">
                      <p className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5" /> {user.email}
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5" /> {user.contact_phone}
                      </p>
                      {user.address && (
                        <p className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5" /> {user.address}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Vehicle Info */}
                  <div>
                    <h3 className="text-sm font-bold text-[#C4AD9D] uppercase tracking-wider mb-3 flex items-center gap-2 border-b border-[#E9E6DD] pb-2">
                      <Car className="w-4 h-4 text-[#027480]" /> Vehicle Details
                    </h3>
                    <p className="font-bold text-lg text-[#001524]">
                      {booking.vehicle_manufacturer} {booking.vehicle_model}
                    </p>
                    <div className="text-[#445048] text-sm mt-2 space-y-1">
                      <p>
                        Year:{" "}
                        <span className="font-semibold text-[#001524]">
                          {booking.vehicle_year}
                        </span>
                      </p>
                      {booking.license_plate && (
                        <p>
                          Plate:{" "}
                          <span className="font-mono bg-[#E9E6DD] px-2 py-0.5 rounded text-[#001524] font-bold">
                            {booking.license_plate}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* DASHED SEPARATOR */}
                <div className="w-full border-t-2 border-dashed border-[#C4AD9D] my-8 relative">
                  <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#E9E6DD] rounded-full border-r border-[#C4AD9D]/30"></div>
                  <div className="absolute -right-10 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#E9E6DD] rounded-full border-l border-[#C4AD9D]/30"></div>
                </div>

                {/* Timeline & QR */}
                <div className="flex flex-col md:flex-row justify-between gap-8 items-center">
                  {/* Timeline */}
                  <div className="flex-1 w-full bg-[#001524] rounded-xl p-6 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-[#027480] to-transparent opacity-30"></div>
                    <h3 className="flex items-center gap-2 text-[#C4AD9D] text-sm font-bold uppercase mb-4">
                      <Calendar className="w-4 h-4 text-[#F57251]" /> Rental
                      Period
                    </h3>
                    <div className="flex items-center justify-between relative z-10">
                      <div>
                        <p className="text-xs text-[#E9E6DD] mb-1">Pick-up</p>
                        <p className="font-bold">
                          {formatDate(booking.booking_date)}
                        </p>
                      </div>
                      <div className="h-0.5 w-12 bg-[#027480]"></div>
                      <div className="text-right">
                        <p className="text-xs text-[#E9E6DD] mb-1">Return</p>
                        <p className="font-bold">
                          {formatDate(booking.return_date)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="flex flex-col items-center justify-center shrink-0">
                    <div className="p-2 border-2 border-[#E9E6DD] rounded-xl bg-white">
                      <QRCodeSVG
                        value={qrCodeData}
                        size={100}
                        level="M"
                        fgColor="#001524"
                      />
                    </div>
                    <p className="text-[10px] text-[#C4AD9D] mt-2 uppercase font-bold tracking-widest">
                      Official QR Code
                    </p>
                  </div>
                </div>

                {/* NEW: IMPORTANT NOTES & FOOTER */}
                <div className="mt-8 pt-6 border-t border-[#E9E6DD] flex flex-col md:flex-row justify-between gap-6">
                  {/* Important Notes */}
                  <div className="flex-1">
                    <h4 className="font-bold text-[#001524] text-sm uppercase tracking-wider mb-2">
                      Important Notes
                    </h4>
                    <ul className="space-y-1.5 text-sm text-[#445048]">
                      <li className="flex items-start gap-2">
                        <span className="text-[#F57251] font-bold mt-0.5">
                          •
                        </span>
                        Keep this receipt for your records
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#F57251] font-bold mt-0.5">
                          •
                        </span>
                        Present QR code at pickup if required
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#F57251] font-bold mt-0.5">
                          •
                        </span>
                        Contact support for any queries
                      </li>
                    </ul>
                  </div>

                  {/* Disclaimer & Timestamp */}
                  <div className="flex-1 flex flex-col justify-end text-left md:text-right">
                    <p className="text-sm text-[#445048] mb-2">
                      This is an official payment receipt. For any inquiries,
                      contact our support team.
                    </p>
                    <p className="text-xs font-mono text-[#C4AD9D]">
                      Generated on {formatDateTime(new Date().toISOString())}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* --- END ACTUAL TICKET --- */}
          </div>

          {/* Action Buttons Footer */}
          <div className="p-4 sm:p-6 bg-white border-t border-[#C4AD9D]/30 flex flex-wrap gap-3 justify-end items-center">
            <button
              onClick={shareReceipt}
              className="px-4 py-2 border-2 border-[#E9E6DD] rounded-lg font-bold text-[#001524] hover:border-[#027480] hover:text-[#027480] transition-colors flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" /> Share
            </button>
            <button
              onClick={printReceipt}
              className="px-4 py-2 border-2 border-[#E9E6DD] rounded-lg font-bold text-[#001524] hover:border-[#027480] hover:text-[#027480] transition-colors flex items-center gap-2"
            >
              <Printer className="w-4 h-4" /> Print
            </button>
            <button
              onClick={downloadAsPDF}
              disabled={isGeneratingPDF}
              className="px-6 py-2 bg-[#027480] text-white rounded-lg font-bold hover:bg-[#001524] transition-colors flex items-center gap-2 shadow-md disabled:opacity-70"
            >
              <Download className="w-4 h-4" />
              {isGeneratingPDF ? "Generating..." : "Download Ticket"}
            </button>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>
        {`
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
        `}
      </style>
    </>
  );
};

export default ReceiptModal;
