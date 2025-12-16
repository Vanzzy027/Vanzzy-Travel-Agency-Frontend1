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
      <div className="min-h-screen bg-gradient-to-br from-[#0f2434] to-[#1a3247] flex items-center justify-center p-4">
        <div className="text-center bg-[#001524] rounded-2xl border border-[#445048] p-8 max-w-md w-full">
          <Loader2 className="h-10 w-10 md:h-12 md:w-12 animate-spin text-[#027480] mx-auto mb-4" />
          <p className="text-white text-base md:text-lg">Loading receipt...</p>
          <p className="text-[#C4AD9D] text-sm mt-2">Please wait while we fetch your payment details</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f2434] to-[#1a3247] flex items-center justify-center p-4">
        <div className="bg-[#001524] rounded-2xl border border-[#445048] p-6 md:p-8 max-w-md w-full">
          <div className="flex items-center justify-center gap-3 mb-4">
            <AlertCircle className="h-10 w-10 md:h-12 md:w-12 text-red-500" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white text-center mb-3">Receipt Not Found</h2>
          <p className="text-[#C4AD9D] text-sm md:text-base text-center mb-6">
            {(error as any)?.data?.message || 'Unable to load receipt. The payment may not exist or has been cancelled.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="py-3 px-4 border-2 border-[#445048] text-[#C4AD9D] rounded-lg font-semibold hover:border-gray-500 hover:text-white transition-colors flex items-center justify-center text-sm md:text-base"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Dashboard
            </button>
            <button
              onClick={() => navigate('/')}
              className="py-3 px-4 bg-[#027480] text-white rounded-lg font-semibold hover:bg-[#02606d] transition-colors flex items-center justify-center text-sm md:text-base"
            >
              <Home className="mr-2 h-4 w-4" />
              Home
            </button>
          </div>
          <p className="text-[#445048] text-xs md:text-sm text-center mt-6">
            Need help? Contact our support team
          </p>
        </div>
      </div>
    );
  }

  if (!receiptResponse?.data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f2434] to-[#1a3247] flex items-center justify-center p-4">
        <div className="bg-[#001524] rounded-2xl border border-[#445048] p-6 md:p-8 max-w-md w-full">
          <div className="flex items-center justify-center gap-3 mb-4">
            <AlertCircle className="h-10 w-10 md:h-12 md:w-12 text-yellow-500" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white text-center mb-3">No Receipt Data</h2>
          <p className="text-[#C4AD9D] text-sm md:text-base text-center mb-6">
            No receipt data available. Please check your payment information.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-3 bg-gradient-to-r from-[#027480] to-[#F57251] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const { payment, booking, user } = receiptResponse.data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f2434] to-[#1a3247] p-4">
      {/* Back button for mobile - shown only on small screens */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-[#C4AD9D] hover:text-white transition-colors text-sm"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </button>
      </div>

      {/* Instructions for mobile */}
      <div className="lg:hidden mb-4 text-center">
        <p className="text-[#C4AD9D] text-sm">
          Pinch to zoom or scroll to view receipt details
        </p>
      </div>

      {/* Receipt Modal Container - Responsive */}
      <div className="flex justify-center items-center min-h-[calc(100vh-100px)]">
        <div className="w-full max-w-4xl mx-auto">
          <ReceiptModal
            isOpen={isModalOpen}
            onClose={handleClose}
            booking={booking}
            payment={payment}
            user={user}
          />
        </div>
      </div>

      {/* Action buttons for mobile */}
      <div className="lg:hidden mt-6">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => window.print()}
            className="py-3 bg-[#027480] text-white rounded-lg font-semibold hover:bg-[#02606d] transition-colors flex items-center justify-center text-sm"
          >
            <span className="mr-2">🖨️</span>
            Print Receipt
          </button>
          <button
            onClick={handleClose}
            className="py-3 bg-[#445048] text-[#E9E6DD] rounded-lg font-semibold hover:bg-[#5a625b] transition-colors flex items-center justify-center text-sm"
          >
            <Home className="mr-2 h-4 w-4" />
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptPage;


// // src/pages/ReceiptPage.tsx
// import React, { useState, useEffect } from 'react';
// import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
// import { useGetReceiptQuery } from '../features/api/paymentApi';
// import ReceiptModal from '../Modals/ReceiptModal';
// import { Loader2, ArrowLeft, AlertCircle, Home } from 'lucide-react';

// const ReceiptPage: React.FC = () => {
//   const { paymentId } = useParams<{ paymentId?: string }>();
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const bookingId = searchParams.get('bookingId');
  
//   const [isModalOpen, setIsModalOpen] = useState(true);

//   // Fetch receipt data
//   const { data: receiptResponse, isLoading, isError, error } = useGetReceiptQuery(
//     { 
//       paymentId: paymentId ? parseInt(paymentId) : undefined, 
//       bookingId: bookingId ? parseInt(bookingId) : undefined 
//     },
//     { skip: !paymentId && !bookingId }
//   );

//   const handleClose = () => {
//     setIsModalOpen(false);
//     // Navigate back to dashboard after a short delay
//     setTimeout(() => navigate('/dashboard'), 300);
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-[#0f2434] to-[#1a3247] flex items-center justify-center">
//         <div className="text-center">
//           <Loader2 className="h-12 w-12 animate-spin text-[#027480] mx-auto mb-4" />
//           <p className="text-white text-lg">Loading receipt...</p>
//         </div>
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-[#0f2434] to-[#1a3247] flex items-center justify-center p-4">
//         <div className="bg-[#001524] rounded-2xl border border-[#445048] p-8 max-w-md w-full">
//           <div className="flex items-center justify-center gap-3 mb-4">
//             <AlertCircle className="h-12 w-12 text-red-500" />
//           </div>
//           <h2 className="text-2xl font-bold text-white text-center mb-3">Receipt Not Found</h2>
//           <p className="text-[#C4AD9D] text-center mb-6">
//             {(error as any)?.data?.message || 'Unable to load receipt. The payment may not exist or has been cancelled.'}
//           </p>
//           <div className="flex gap-3">
//             <button
//               onClick={() => navigate('/dashboard')}
//               className="flex-1 py-3 border-2 border-[#445048] text-[#C4AD9D] rounded-lg font-semibold hover:border-gray-500 hover:text-white transition-colors flex items-center justify-center"
//             >
//               <ArrowLeft className="mr-2 h-4 w-4" />
//               Dashboard
//             </button>
//             <button
//               onClick={() => navigate('/')}
//               className="flex-1 py-3 bg-[#027480] text-white rounded-lg font-semibold hover:bg-[#02606d] transition-colors flex items-center justify-center"
//             >
//               <Home className="mr-2 h-4 w-4" />
//               Home
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!receiptResponse?.data) {
//     return null;
//   }

//   const { payment, booking, user } = receiptResponse.data;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#0f2434] to-[#1a3247]">
//       <ReceiptModal
//         isOpen={isModalOpen}
//         onClose={handleClose}
//         booking={booking}
//         payment={payment}
//         user={user}
//       />
//     </div>
//   );
// };

// export default ReceiptPage;