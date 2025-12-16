import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetReceiptQuery } from '../../features/api/paymentApi';
import { 
  ArrowLeft, 
  Download, 
  Printer, 
  CheckCircle, 
  Smartphone,
  CreditCard,
  Calendar,
  Car,
  User,
  DollarSign,
  Shield
} from 'lucide-react';
import { format } from 'date-fns';

const ReceiptDetailPage: React.FC = () => {
  const { paymentId } = useParams<{ paymentId: string }>();
  const navigate = useNavigate();
  
  const { data: receiptData, isLoading, error } = useGetReceiptQuery(
    { paymentId: Number(paymentId) },
    { skip: !paymentId }
  );

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Similar download logic as before
    window.open(`/api/payments/${paymentId}/receipt?download=true`, '_blank');
  };

  if (isLoading) {
    return <div>Loading receipt...</div>;
  }

  if (error || !receiptData) {
    return <div>Receipt not found</div>;
  }

  const { payment, booking, user } = receiptData.data;

  return (
    <div className="min-h-screen bg-gray-50 p-6 print:p-0">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 print:hidden">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#027480] hover:text-[#02606d]"
          >
            <ArrowLeft size={20} />
            Back to Payments
          </button>
        </div>

        {/* Receipt Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden print:shadow-none print:border-0">
          {/* Receipt Header */}
          <div className="bg-gradient-to-r from-[#027480] to-[#014d57] p-8 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold mb-2">Payment Receipt</h1>
                <p className="opacity-90">Transaction #{payment.transaction_id}</p>
              </div>
              <div className="text-right">
                <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                  <CheckCircle size={20} />
                  <span className="font-semibold">{(payment as any).payment_status}</span>
                </div>
                <p className="mt-2 opacity-90">
                  {format(new Date(payment.payment_date), 'MMMM dd, yyyy • hh:mm a')}
                </p>
              </div>
            </div>
          </div>

          {/* Receipt Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Payment Details */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <DollarSign size={20} className="text-[#027480]" />
                    Payment Information
                  </h3>
                  <div className="space-y-3">
                    <DetailRow label="Transaction ID" value={payment.transaction_id} />
                    <DetailRow label="Payment Method" value={payment.payment_method} />
                    <DetailRow label="Phone Number" value={payment.phone} />
                    <DetailRow label="Gross Amount" value={`KES ${payment.gross_amount.toLocaleString()}`} />
                    <DetailRow label="Commission Fee" value={`KES ${payment.commission_fee.toLocaleString()}`} />
                    <DetailRow 
                      label="Net Amount" 
                      value={`KES ${payment.net_amount.toLocaleString()}`}
                      highlight 
                    />
                  </div>
                </div>

                {/* User Details */}
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <User size={20} className="text-[#027480]" />
                    Customer Information
                  </h3>
                  <div className="space-y-3">
                    <DetailRow label="Name" value={`${user.first_name} ${user.last_name}`} />
                    <DetailRow label="Email" value={user.email} />
                    <DetailRow label="Phone" value={user.contact_phone} />
                    {user.address && <DetailRow label="Address" value={user.address} />}
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Car size={20} className="text-[#027480]" />
                    Booking Information
                  </h3>
                  <div className="space-y-3">
                    <DetailRow label="Booking ID" value={`#${booking.booking_id}`} />
                    <DetailRow label="Vehicle" value={`${booking.vehicle_manufacturer} ${booking.vehicle_model}`} />
                    <DetailRow label="Year" value={booking.vehicle_year.toString()} />
                    {booking.license_plate && <DetailRow label="License Plate" value={booking.license_plate} />}
                    {booking.vin_number && <DetailRow label="VIN" value={booking.vin_number} />}
                    <DetailRow label="Pickup Date" value={format(new Date(booking.booking_date), 'MMM dd, yyyy')} />
                    <DetailRow label="Return Date" value={format(new Date(booking.return_date), 'MMM dd, yyyy')} />
                    <DetailRow 
                      label="Total Booking Amount" 
                      value={`KES ${booking.total_amount.toLocaleString()}`}
                      highlight 
                    />
                  </div>
                </div>

                {/* Security Stamp */}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <Shield size={24} className="text-green-500" />
                    <div>
                      <p className="font-medium text-gray-800">Secured Transaction</p>
                      <p className="text-sm text-gray-600">
                        This receipt has been digitally signed and verified
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Note */}
            <div className="border-t border-gray-200 pt-6">
              <p className="text-sm text-gray-600 text-center">
                Thank you for your business! This receipt serves as official proof of payment.
                For any queries, please contact our support team.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8 print:hidden">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-3 bg-[#027480] text-white rounded-lg hover:bg-[#02606d] transition-colors"
          >
            <Printer size={20} />
            Print Receipt
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-6 py-3 border border-[#445048] text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download size={20} />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

const DetailRow = ({ label, value, highlight = false }: any) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
    <span className="text-gray-600">{label}</span>
    <span className={`font-medium ${highlight ? 'text-[#027480] text-lg' : 'text-gray-800'}`}>
      {value}
    </span>
  </div>
);

export default ReceiptDetailPage;