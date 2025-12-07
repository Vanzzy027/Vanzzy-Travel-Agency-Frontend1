// src/pages/ReceiptPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useGetReceiptQuery } from '../features/api/paymentApi';
import ReceiptModal from '../Modals/ReceiptModal';
import { Loader2, ArrowLeft, AlertCircle, Home } from 'lucide-react';

const ReceiptPage: React.FC = () => {
  const { paymentId } = useParams<{ paymentId?: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookingId = searchParams.get('bookingId');
  
  const [isModalOpen, setIsModalOpen] = useState(true);

  // Fetch receipt data
  const { data: receiptResponse, isLoading, isError, error } = useGetReceiptQuery(
    { 
      paymentId: paymentId ? parseInt(paymentId) : undefined, 
      bookingId: bookingId ? parseInt(bookingId) : undefined 
    },
    { skip: !paymentId && !bookingId }
  );

  const handleClose = () => {
    setIsModalOpen(false);
    // Navigate back to dashboard after a short delay
    setTimeout(() => navigate('/dashboard'), 300);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f2434] to-[#1a3247] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#027480] mx-auto mb-4" />
          <p className="text-white text-lg">Loading receipt...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f2434] to-[#1a3247] flex items-center justify-center p-4">
        <div className="bg-[#001524] rounded-2xl border border-[#445048] p-8 max-w-md w-full">
          <div className="flex items-center justify-center gap-3 mb-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-white text-center mb-3">Receipt Not Found</h2>
          <p className="text-[#C4AD9D] text-center mb-6">
            {(error as any)?.data?.message || 'Unable to load receipt. The payment may not exist or has been cancelled.'}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex-1 py-3 border-2 border-[#445048] text-[#C4AD9D] rounded-lg font-semibold hover:border-gray-500 hover:text-white transition-colors flex items-center justify-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Dashboard
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex-1 py-3 bg-[#027480] text-white rounded-lg font-semibold hover:bg-[#02606d] transition-colors flex items-center justify-center"
            >
              <Home className="mr-2 h-4 w-4" />
              Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!receiptResponse?.data) {
    return null;
  }

  const { payment, booking, user } = receiptResponse.data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f2434] to-[#1a3247]">
      <ReceiptModal
        isOpen={isModalOpen}
        onClose={handleClose}
        booking={booking}
        payment={payment}
        user={user}
      />
    </div>
  );
};

export default ReceiptPage;