import React, { useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { 
  X, 
  Download, 
  Printer, 
  Share2, 
  CheckCircle,
  Car,
  Calendar,
  CreditCard,
  User,
  MapPin,
  Mail,
  Phone
} from 'lucide-react';

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
  user
}) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
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
    if (!receiptRef.current) return;
    
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
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
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
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(
        `Payment Receipt\nTransaction: ${payment.transaction_id}\nAmount: ${formatCurrency(payment.net_amount)}`
      );
      alert('Receipt details copied to clipboard!');
    }
  };

  return (
    <>
      {/* Modal Overlay */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Payment Receipt</h2>
              <p className="text-gray-600">Transaction #{payment.transaction_id}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Receipt Content - Printable Area */}
            <div 
              ref={receiptRef} 
              className="max-w-3xl mx-auto bg-white p-8 border-2 border-dashed border-gray-200 rounded-xl"
            >
              {/* Receipt Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Payment Successful!</h1>
                <p className="text-gray-600 mt-2">Thank you for your payment</p>
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-green-700 font-semibold">Paid • {formatDate(payment.payment_date)}</span>
                </div>
              </div>

              {/* Company Info */}
              <div className="text-center mb-8">
                <div className="inline-block px-6 py-2 bg-gray-900 text-white rounded-full font-bold text-lg">
                  Vans<span className="text-[#027480]">KE</span>
                </div>
                <p className="text-gray-600 mt-2">Vans-Travel-Agency</p>
                <p className="text-gray-500 text-sm">receipt@vansrental.com • +254 112 178 578</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Transaction Details */}
                <div className="lg:col-span-2 space-y-6">
                  {/* User & Vehicle Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* User Info Card */}
                    <div className="bg-gray-50 p-5 rounded-xl border">
                      <div className="flex items-center gap-3 mb-4">
                        <User className="w-5 h-5 text-gray-600" />
                        <h3 className="font-bold text-gray-900">Customer Information</h3>
                      </div>
                      <div className="space-y-2">
                        <p className="font-semibold text-gray-900">
                          {user.first_name} {user.last_name}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="w-4 h-4" />
                          <span>{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4" />
                          <span>{user.contact_phone}</span>
                        </div>
                        {user.address && (
                          <div className="flex items-start gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mt-0.5" />
                            <span>{user.address}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Vehicle Info Card */}
                    <div className="bg-gray-50 p-5 rounded-xl border">
                      <div className="flex items-center gap-3 mb-4">
                        <Car className="w-5 h-5 text-gray-600" />
                        <h3 className="font-bold text-gray-900">Vehicle Details</h3>
                      </div>
                      <div className="space-y-2">
                        <p className="font-semibold text-gray-900">
                          {booking.vehicle_manufacturer} {booking.vehicle_model}
                        </p>
                        <p className="text-sm text-gray-600">Year: {booking.vehicle_year}</p>
                        {booking.license_plate && (
                          <p className="text-sm text-gray-600">Plate: {booking.license_plate}</p>
                        )}
                        {booking.vin_number && (
                          <p className="text-sm text-gray-600">VIN: {booking.vin_number}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Rental Period */}
                  <div className="bg-gray-50 p-5 rounded-xl border">
                    <div className="flex items-center gap-3 mb-4">
                      <Calendar className="w-5 h-5 text-gray-600" />
                      <h3 className="font-bold text-gray-900">Rental Period</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Pick-up Date</p>
                        <p className="font-semibold text-gray-900">
                          {formatDate(booking.booking_date)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Return Date</p>
                        <p className="font-semibold text-gray-900">
                          {formatDate(booking.return_date)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Breakdown */}
                  <div className="bg-gray-50 p-5 rounded-xl border">
                    <div className="flex items-center gap-3 mb-4">
                      <CreditCard className="w-5 h-5 text-gray-600" />
                      <h3 className="font-bold text-gray-900">Payment Breakdown</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">{formatCurrency(booking.total_amount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Commission Fee</span>
                        <span className="font-medium">{formatCurrency(payment.commission_fee)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-3">
                        <span className="text-gray-600">Taxes & Fees</span>
                        <span className="font-medium">
                          {formatCurrency(payment.gross_amount - booking.total_amount - payment.commission_fee)}
                        </span>
                      </div>
                      <div className="flex justify-between text-lg font-bold border-t pt-3">
                        <span className="text-gray-900">Total Paid</span>
                        <span className="text-[#027480]">{formatCurrency(payment.net_amount)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - QR Code & Summary */}
                <div className="space-y-6">
                  {/* QR Code */}
                  <div className="bg-gray-50 p-6 rounded-xl border text-center">
                    <h3 className="font-bold text-gray-900 mb-4">Digital Verification</h3>
                    <div className="flex justify-center">
                      <QRCodeSVG
                        value={qrCodeData}
                        size={180}
                        level="H"
                        includeMargin={true}
                        bgColor="#ffffff"
                        fgColor="#001524"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-4">
                      Scan to verify this receipt
                    </p>
                    <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                      <p className="text-xs font-mono text-gray-700 break-all">
                        {payment.transaction_id}
                      </p>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="bg-gray-50 p-5 rounded-xl border">
                    <h3 className="font-bold text-gray-900 mb-3">Payment Method</h3>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-6 bg-gray-200 rounded flex items-center justify-center">
                        {payment.payment_method === 'Credit Card' ? '💳' : '🏦'}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{payment.payment_method}</p>
                        <p className="text-sm text-gray-600">Payment ID: {payment.payment_id}</p>
                      </div>
                    </div>
                  </div>

                  {/* Important Notes */}
                  <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                    <h3 className="font-bold text-gray-900 mb-3">Important Notes</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-0.5">•</span>
                        Keep this receipt for your records
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-0.5">•</span>
                        Present QR code at pickup if required
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-0.5">•</span>
                        Contact support for any queries
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-8 border-t text-center">
                <p className="text-gray-600 text-sm">
                  This is an official payment receipt. For any inquiries, contact our support team.
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  Generated on {formatDate(new Date().toISOString())}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t p-6 bg-gray-50">
            <div className="flex flex-wrap gap-3 justify-end">
              <button
                onClick={shareReceipt}
                className="px-5 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
              <button
                onClick={printReceipt}
                className="px-5 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
              <button
                onClick={downloadAsPDF}
                disabled={isGeneratingPDF}
                className="px-5 py-2.5 bg-[#027480] text-white rounded-lg font-medium hover:bg-[#02606d] transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>
        {`
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
        `}
      </style>
    </>
  );
};

export default ReceiptModal;