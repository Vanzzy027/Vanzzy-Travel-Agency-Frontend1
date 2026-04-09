import React, { useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useGetReceiptQuery } from "../features/api/paymentApi";
import ReceiptModal from "../Modals/ReceiptModal";
import { Loader2, ArrowLeft, AlertCircle } from "lucide-react";
import { useSelector } from "react-redux";

const ReceiptPage: React.FC = () => {
  const { paymentId } = useParams<{ paymentId?: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookingId = searchParams.get("bookingId");

  // Get current user role from Redux to handle dynamic redirects
  const { user: currentUser } = useSelector((state: any) => state.auth);

  // Determine where to send the user back to
  const backPath =
    currentUser?.role === "admin"
      ? "/admin/payments"
      : "/UserDashboard/my-payments";

  const [isModalOpen, setIsModalOpen] = useState(true);

  // Fetch receipt data
  const {
    data: receiptResponse,
    isLoading,
    isError,
    error,
  } = useGetReceiptQuery(
    {
      paymentId: paymentId ? parseInt(paymentId) : undefined,
      bookingId: bookingId ? parseInt(bookingId) : undefined,
    },
    { skip: !paymentId && !bookingId },
  );

  const handleClose = () => {
    setIsModalOpen(false);
    // Dynamic redirect after modal closes
    setTimeout(() => navigate(backPath), 300);
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f2434] to-[#1a3247] flex items-center justify-center p-4">
        <div className="text-center bg-[#001524] rounded-2xl border border-[#445048] p-8 max-w-md w-full">
          <Loader2 className="h-10 w-10 animate-spin text-[#027480] mx-auto mb-4" />
          <p className="text-white text-lg">Loading receipt...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f2434] to-[#1a3247] flex items-center justify-center p-4">
        <div className="bg-[#001524] rounded-2xl border border-[#445048] p-8 max-w-md w-full text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-3">
            Receipt Not Found
          </h2>
          <p className="text-[#C4AD9D] mb-6">
            {(error as any)?.data?.message || "Unable to load receipt details."}
          </p>
          <button
            onClick={() => navigate(backPath)}
            className="w-full py-3 bg-[#027480] text-white rounded-lg font-semibold flex items-center justify-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Payments
          </button>
        </div>
      </div>
    );
  }

  // Robust Data Extraction
  const receiptData = receiptResponse?.data?.payment
    ? receiptResponse.data
    : (receiptResponse?.data as any)?.data;

  if (!receiptData || !receiptData.payment) {
    return (
      <div className="min-h-screen bg-[#001524] flex items-center justify-center p-4">
        <div className="bg-[#0f2434] border border-red-800/30 p-8 rounded-2xl text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">
            Invalid Data Format
          </h2>
          <button
            onClick={() => navigate(backPath)}
            className="mt-4 bg-[#027480] text-white px-6 py-2 rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const { payment, booking, user } = receiptData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f2434] to-[#1a3247] p-4">
      {/* Header with Dynamic Back Button */}
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center">
        <button
          onClick={() => navigate(backPath)}
          className="flex items-center text-[#C4AD9D] hover:text-white transition-colors"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          {currentUser?.role === "admin"
            ? "Back to Admin Panel"
            : "Back to My Payments"}
        </button>
        <div className="hidden md:block text-[#C4AD9D] text-sm font-mono">
          TRX: {payment.transaction_id}
        </div>
      </div>

      {/* Main View */}
      <div className="flex justify-center items-start min-h-screen pb-10">
        <div className="w-full max-w-4xl">
          <ReceiptModal
            isOpen={isModalOpen}
            onClose={handleClose}
            booking={booking}
            payment={payment}
            user={user}
          />
        </div>
      </div>
    </div>
  );
};

export default ReceiptPage;
