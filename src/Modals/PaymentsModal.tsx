import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner'; // Assuming you use sonner or similar
// Import your payment API hook here when ready
// import { useInitiateMpesaMutation, useCheckStatusQuery } from '../features/api/PaymentApi';

interface PaymentModalProps {
  bookingId: number;
  onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ bookingId, onClose }) => {
  const navigate = useNavigate();
  const [method, setMethod] = useState<'card' | 'mpesa'>('mpesa');
  
  // M-Pesa States
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'verify' | 'success'>('idle');

  // Card States
  const [cardNumber, setCardNumber] = useState('');

  const handlePayNow = async () => {
    if (method === 'mpesa') {
      if (phoneNumber.length < 10) return toast.error("Invalid phone number");
      
      setPaymentStatus('processing');
      
      // SIMULATION: Call your Backend API to trigger Daraja STK Push here
      try {
        // await initiateMpesa({ bookingId, phoneNumber }).unwrap();
        
        // Simulate waiting for STK push to arrive on phone
        setTimeout(() => {
          setPaymentStatus('verify'); // Change button to Red "Redirect/Check"
          toast.info("STK Push sent! Enter PIN on your phone.");
        }, 2000);
      } catch (err) {
        setPaymentStatus('idle');
        toast.error("Failed to send STK Push");
      }
    } else {
        // Handle Card Logic
        toast.success("Card payment simulated successfully");
        finishPayment();
    }
  };

  const handleCheckStatus = async () => {
    // This is the "Red Button" logic
    // Call backend to query Daraja status
    try {
      // const status = await checkTransactionStatus(bookingId).unwrap();
      
      // Simulating success from Daraja
      setPaymentStatus('success');
      
      setTimeout(() => {
        finishPayment();
      }, 1500);
      
    } catch (err) {
       toast.error("Payment not received yet. Please try again.");
    }
  };

  const finishPayment = () => {
    toast.success("Booking Confirmed! Payment Received.");
    onClose();
    navigate('/UserDashboard'); // Or wherever you want them to go after
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-[#001524] rounded-2xl w-full max-w-lg border border-[#445048] shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#027480] p-4 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">Complete Payment</h3>
          <button onClick={onClose} className="text-white hover:text-red-200">✕</button>
        </div>

        <div className="p-6">
          {paymentStatus === 'success' ? (
            <div className="text-center py-10">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-green-500">Payment Successful!</h3>
              <p className="text-[#C4AD9D]">Redirecting you...</p>
            </div>
          ) : (
            <>
              {/* Method Selection */}
              <div className="flex gap-4 mb-6">
                <button 
                  onClick={() => setMethod('mpesa')}
                  className={`flex-1 py-3 rounded-xl font-semibold border-2 transition-all ${method === 'mpesa' ? 'border-[#00D632] bg-[#00D632]/10 text-[#00D632]' : 'border-[#445048] text-[#C4AD9D]'}`}
                >
                  M-Pesa
                </button>
                <button 
                  onClick={() => setMethod('card')}
                  className={`flex-1 py-3 rounded-xl font-semibold border-2 transition-all ${method === 'card' ? 'border-[#F57251] bg-[#F57251]/10 text-[#F57251]' : 'border-[#445048] text-[#C4AD9D]'}`}
                >
                  Visa / Card
                </button>
              </div>

              {/* M-PESA FORM */}
              {method === 'mpesa' && (
                <div className="space-y-4">
                   <div className="bg-[#445048]/30 p-4 rounded-lg border border-[#445048]">
                     <img src="https://upload.wikimedia.org/wikipedia/commons/1/15/M-PESA_LOGO-01.svg" alt="Mpesa" className="h-8 mb-2" />
                     <p className="text-sm text-[#C4AD9D]">Enter your M-Pesa number to receive the payment prompt.</p>
                   </div>
                   
                   <div>
                     <label className="text-sm text-[#C4AD9D] block mb-1">Phone Number</label>
                     <input 
                       type="text" 
                       placeholder="2547..." 
                       value={phoneNumber}
                       onChange={(e) => setPhoneNumber(e.target.value)}
                       disabled={paymentStatus !== 'idle'}
                       className="w-full bg-[#0f2434] border border-[#445048] rounded-lg p-3 text-white focus:outline-none focus:border-[#00D632]"
                     />
                   </div>
                </div>
              )}

              {/* CARD FORM */}
              {method === 'card' && (
                <div className="space-y-4">
                   <div className="bg-[#445048]/30 p-4 rounded-lg border border-[#445048] flex items-center gap-4">
                     <span className="text-2xl">💳</span>
                     <p className="text-sm text-[#C4AD9D]">Secure Credit/Debit Card Payment</p>
                   </div>
                   <input type="text" placeholder="Card Number" className="w-full bg-[#0f2434] border border-[#445048] rounded-lg p-3 text-white" />
                   <div className="flex gap-4">
                     <input type="text" placeholder="MM/YY" className="w-1/2 bg-[#0f2434] border border-[#445048] rounded-lg p-3 text-white" />
                     <input type="text" placeholder="CVC" className="w-1/2 bg-[#0f2434] border border-[#445048] rounded-lg p-3 text-white" />
                   </div>
                </div>
              )}

              {/* ACTION BUTTONS */}
              <div className="mt-8">
                {method === 'mpesa' && paymentStatus === 'verify' ? (
                  // THE RED BUTTON LOGIC
                  <button 
                    onClick={handleCheckStatus}
                    className="w-full bg-[#F57251] hover:bg-[#d65f41] text-white py-4 rounded-xl font-bold text-lg shadow-[0_0_15px_rgba(245,114,81,0.5)] animate-pulse"
                  >
                    Confirm Payment & Redirect ➜
                  </button>
                ) : (
                  // THE GREEN BUTTON
                  <button 
                    onClick={handlePayNow}
                    disabled={paymentStatus === 'processing'}
                    className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all ${
                        paymentStatus === 'processing' 
                        ? 'bg-gray-600 cursor-not-allowed' 
                        : 'bg-[#00D632] hover:bg-[#00b029] text-[#001524]'
                    }`}
                  >
                    {paymentStatus === 'processing' ? 'Sending Request...' : `Pay Now`}
                  </button>
                )}
                
                {paymentStatus === 'verify' && (
                   <p className="text-center text-xs text-[#C4AD9D] mt-3">
                     Check your phone for the M-Pesa PIN prompt. Once done, click the button above.
                   </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;