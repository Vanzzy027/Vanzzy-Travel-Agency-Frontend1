import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  Shield, X, CreditCard, Smartphone, ArrowLeft, Loader2, 
  CheckCircle, AlertCircle, Fuel, Settings, Users, Gauge, 
  ShieldCheck, Calendar,Car, 
} from 'lucide-react';
//import { useProcessPaymentMutation } from '../features/api/BookingApi';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  bookingData: {
    booking_id: number;
    total_amount: number;
    vehicle_manufacturer?: string;
    vehicle_model?: string;
    vehicle_year?: number;
  };
  userData: {
    email: string;
    user_id: string;
    first_name: string;
    last_name: string;
    phone?: string;
  };
  vehicleDetails: {
    vehicle_id: number;
    vehicleSpec_id: number;
    vin_number: string;
    license_plate: string;
    current_mileage: number;
    rental_rate: number;
    status: string;
    manufacturer: string;
    model: string;
    year: number;
    fuel_type: string;
    transmission: string;
    seating_capacity: number;
    color: string;
    features: string | string[];
    images: string | string[];
    on_promo: boolean;
    created_at?: string;
    updated_at?: string;
  };
}

interface PaystackResponse {
  status: string;
  reference: string;
  transaction?: string;
  id?: string;
  customer?: {
    phone?: string;
    email?: string;
  };
  authorization?: {
    mobile_money_number?: string;
  };
  metadata?: any;
  message?: string;
}

declare global {
  interface Window {
    PaystackPop: {
      setup(options: any): { openIframe: () => void };
    };
  }
}

const PaymentModal: React.FC<PaymentModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  bookingData, 
  userData,
  vehicleDetails 
}) => {
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement>(null);
  
  const [step, setStep] = useState<'method' | 'details' | 'paystack'>('method');
  const [method, setMethod] = useState<'mpesa' | 'card'>('mpesa');
  const [phoneNumber, setPhoneNumber] = useState(userData.phone || '');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [paystackLoaded, setPaystackLoaded] = useState(false);
  const [paymentTimeout, setPaymentTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<PaystackResponse | null>(null);

  //const [processPayment] = useProcessPaymentMutation();

  // Helper function to parse features
  const parseFeatures = (features: string | string[]): string[] => {
    if (Array.isArray(features)) return features;
    try {
      const parsed = JSON.parse(features);
      return Array.isArray(parsed) ? parsed : [features];
    } catch {
      return typeof features === 'string' ? [features] : [];
    }
  };

  // Get vehicle features
  const vehicleFeatures = parseFeatures(vehicleDetails.features);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (paymentTimeout) clearTimeout(paymentTimeout);
    };
  }, [isOpen, paymentTimeout]);

  // Load Paystack Inline Script
  useEffect(() => {
    if (!isOpen) return;

    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => {
      setPaystackLoaded(true);
      console.log('✅ Paystack loaded successfully');
    };
    script.onerror = () => {
      console.error('❌ Failed to load Paystack');
      toast.error("Failed to load payment gateway");
    };
    
    // Check if script already exists
    const existingScript = document.querySelector('script[src="https://js.paystack.co/v1/inline.js"]');
    if (!existingScript) {
      document.body.appendChild(script);
      console.log('📥 Paystack script added to DOM');
    } else {
      setPaystackLoaded(true);
      console.log('📦 Paystack script already exists');
    }

    return () => {
      // Don't remove script on cleanup to avoid reloading
    };
  }, [isOpen]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setStep('method');
      setPaymentStatus('idle');
      setPaymentDetails(null);
      setPhoneNumber(userData.phone || '');
    }
  }, [isOpen, userData.phone]);

  const handleClose = () => {
    if (paymentTimeout) clearTimeout(paymentTimeout);
    setPaymentStatus('idle');
    setStep('method');
    onClose();
  };

  const amountInKobo = Math.round(bookingData.total_amount * 100);

  const handleMethodSelect = (selectedMethod: 'mpesa' | 'card') => {
    setMethod(selectedMethod);
    if (selectedMethod === 'mpesa') {
      if (userData.phone) {
        setPhoneNumber(userData.phone);
        launchPaystack();
      } else {
        setStep('details');
      }
    } else {
      launchPaystack();
    }
  };

  const launchPaystack = () => {
    if (!paystackLoaded) {
      toast.error("Payment system still loading. Please wait...");
      return;
    }

    if (method === 'mpesa' && !phoneNumber) {
      toast.error("Please enter a valid phone number");
      return;
    }

    console.log('🚀 Launching Paystack payment...');
    setPaymentStatus('processing');
    setStep('paystack');

    // Set timeout for payment initialization (15 seconds)
    const timeout = setTimeout(() => {
      toast.error("Payment system timed out. Please try again.");
      setPaymentStatus('idle');
      setStep('method');
    }, 15000);

    setPaymentTimeout(timeout);

    // Small delay to ensure UI updates
    setTimeout(() => {
      initializePaystackPayment();
    }, 300);
  };

  const initializePaystackPayment = () => {
    try {
      // Create a unique reference
      const reference = `B-${bookingData.booking_id}-${Date.now()}`;

      console.log('⚙️ Configuring Paystack with:', {
        amount: amountInKobo,
        email: userData.email,
        method,
        phone: method === 'mpesa' ? phoneNumber : undefined,
        vehicle: vehicleDetails
      });

      const paymentHandler = window.PaystackPop.setup({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_your_key',
        email: userData.email,
        amount: amountInKobo,
        currency: 'KES',
        ref: reference,
        
        // Method-specific configurations
        ...(method === 'mpesa' && {
          mobile_money: {
            phone: phoneNumber,
            provider: 'mpesa'
          },
          channels: ['mobile_money'],
        }),
        ...(method === 'card' && {
          channels: ['card'],
        }),

        metadata: {
          booking_id: bookingData.booking_id,
          user_id: userData.user_id,
          vehicle_id: vehicleDetails.vehicle_id,
          vehicle_spec_id: vehicleDetails.vehicleSpec_id,
          vehicle_make: vehicleDetails.manufacturer,
          vehicle_model: vehicleDetails.model,
          vehicle_year: vehicleDetails.year,
          license_plate: vehicleDetails.license_plate,
          phone: phoneNumber,
          custom_fields: [
            { 
              display_name: "Vehicle", 
              variable_name: "vehicle", 
              value: `${vehicleDetails.year} ${vehicleDetails.manufacturer} ${vehicleDetails.model}` 
            },
            { 
              display_name: "License Plate", 
              variable_name: "license_plate", 
              value: vehicleDetails.license_plate 
            },
            { 
              display_name: "Mobile Number", 
              variable_name: "mobile_number", 
              value: phoneNumber 
            }
          ]
        },
        
        callback: function (response: PaystackResponse) {
          console.log('📞 Paystack callback received:', response);
          if (paymentTimeout) clearTimeout(paymentTimeout);
          
          if (response.status === 'success') {
            handlePaymentSuccess(response);
          } else {
            handlePaymentFailure(response);
          }
        },
        
        onClose: function () {
          console.log('❌ Paystack modal closed by user');
          if (paymentTimeout) clearTimeout(paymentTimeout);
          setPaymentStatus('idle');
          setStep('method');
          toast.info("Payment cancelled.");
        }
      });

      console.log('🖱️ Opening Paystack iframe...');
      paymentHandler.openIframe();
      
    } catch (error) {
      console.error('💥 Paystack initialization error:', error);
      if (paymentTimeout) clearTimeout(paymentTimeout);
      toast.error("Failed to initialize payment");
      setPaymentStatus('idle');
      setStep('method');
    }
  };

  const handlePaymentSuccess = async (response: PaystackResponse) => {
    try {
      console.log('✅ Payment successful, response:', response);
      
      // Extract REAL payment data from Paystack
      const actualPhone = response.customer?.phone || 
                         response.authorization?.mobile_money_number || 
                         response.metadata?.phone || 
                         phoneNumber;
      
      const transactionId = response.transaction || 
                           response.id || 
                           `PSK-${Date.now()}`;
      
      const paystackReference = response.reference;

      console.log('📱 Actual payment data:', {
        actualPhone,
        transactionId,
        paystackReference,
        status: response.status,
        message: response.message
      });

      // Prepare payment data for backend
      const paymentData = {
        booking_id: bookingData.booking_id,
        user_id: userData.user_id,
        amount: bookingData.total_amount,
        payment_method: method === 'mpesa' ? 'M-Pesa' : 'Card',
        payment_status: 'completed',
        transaction_id: transactionId.toString(),
        transaction_reference: paystackReference,
        phone: actualPhone,
        email: userData.email,
        vehicle_id: vehicleDetails.vehicle_id,
        vehicle_make: vehicleDetails.manufacturer,
        vehicle_model: vehicleDetails.model,
        vehicle_year: vehicleDetails.year,
        license_plate: vehicleDetails.license_plate,
        gross_amount: bookingData.total_amount,
        commission_fee: bookingData.total_amount * 0.02,
        net_amount: bookingData.total_amount * 0.98,
      };

      console.log('📤 Sending payment data to backend:', paymentData);
      
      // Save payment details for UI
      setPaymentDetails(response);
      
      // Call backend payment endpoint
      const backendResponse = await fetch('https://vanske-car-rental.azurewebsites.net/api/payments/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(paymentData),
      });

      console.log('🔧 Backend response status:', backendResponse.status);

      if (!backendResponse.ok) {
        const errorText = await backendResponse.text();
        console.error('❌ Backend sync failed:', errorText);
        throw new Error(`Backend sync failed: ${errorText}`);
      }

      const result = await backendResponse.json();
      console.log('✅ Backend sync successful:', result);

      setPaymentStatus('success');
      toast.success("Payment Received Successfully!");
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      // Auto close after delay
      setTimeout(() => {
        handleClose();
        navigate('/UserDashboard');
      }, 3000);

    } catch (err: any) {
      console.error("Payment processing error:", err);
      
      let errorMessage = "Payment successful but failed to update booking.";
      
      if (err?.data?.message) {
        errorMessage = typeof err.data.message === 'string' 
          ? err.data.message 
          : JSON.stringify(err.data.message);
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (err?.status === 400) {
        errorMessage = "Invalid payment data. Please check your information.";
      } else if (err?.status === 404) {
        errorMessage = "Payment endpoint not found. Please contact support.";
      }
      
      toast.error(errorMessage);
      setPaymentStatus('failed');
    }
  };

  const handlePaymentFailure = (response: PaystackResponse) => {
    console.log('❌ Payment failed:', response);
    setPaymentStatus('failed');
    setPaymentDetails(response);
    
    let errorMessage = "Transaction was not completed.";
    if (response.message) {
      errorMessage = response.message;
    }
    
    toast.error(errorMessage);
  };

  const handleMpesaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length >= 9) {
      launchPaystack();
    } else {
      toast.error("Please enter a valid phone number");
    }
  };

  const handleBack = () => {
    setStep('method');
    setPaymentStatus('idle');
    if (paymentTimeout) clearTimeout(paymentTimeout);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-200">
      <div 
        ref={modalRef}
        className={`bg-[#001524] rounded-2xl border border-[#445048] shadow-2xl overflow-hidden relative animate-in slide-in-from-bottom-4 duration-300 ${
          step === 'paystack' ? 'w-full max-w-3xl' : 'w-full max-w-2xl'
        }`}
      >
        {/* Header - Only show if not in Paystack step */}
        {step !== 'paystack' && (
          <div className="bg-gradient-to-r from-[#027480] to-[#014d57] p-4 flex justify-between items-center">
            <div className="flex items-center gap-2 text-white">
              <Shield size={20} />
              <h3 className="text-xl font-bold">Secure Payment</h3>
            </div>
            <button 
              onClick={handleClose}
              className="text-white hover:text-red-200 transition-colors p-1 rounded-full hover:bg-white/10"
            >
              <X size={24} />
            </button>
          </div>
        )}

        <div className="p-6">
          {paymentStatus === 'success' ? (
            <div className="text-center py-8 animate-in zoom-in duration-300">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-6">
                <CheckCircle size={40} className="text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-green-400 mb-2">Payment Successful!</h3>
              <p className="text-[#C4AD9D] mb-2">
                Your booking for the <span className="text-white font-semibold">{vehicleDetails.manufacturer} {vehicleDetails.model}</span> is confirmed.
              </p>
              
              {paymentDetails && (
                <div className="mt-4 p-4 bg-[#0f2434] rounded-lg border border-[#445048] text-left">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-[#C4AD9D]">Reference:</div>
                    <div className="text-white font-mono">{paymentDetails.reference}</div>
                    
                    {paymentDetails.customer?.phone && (
                      <>
                        <div className="text-[#C4AD9D]">Phone:</div>
                        <div className="text-white">{paymentDetails.customer.phone}</div>
                      </>
                    )}
                    
                    {paymentDetails.transaction && (
                      <>
                        <div className="text-[#C4AD9D]">Transaction ID:</div>
                        <div className="text-white font-mono">{paymentDetails.transaction}</div>
                      </>
                    )}
                  </div>
                </div>
              )}
              
              <p className="text-xs text-gray-500 mt-6">Redirecting you to dashboard...</p>
            </div>
          ) : paymentStatus === 'failed' ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/20 mb-6">
                <AlertCircle size={40} className="text-red-400" />
              </div>
              <h3 className="text-2xl font-bold text-red-400 mb-2">Payment Failed</h3>
              
              {paymentDetails?.message && (
                <p className="text-[#C4AD9D] mb-4">{paymentDetails.message}</p>
              )}
              
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleClose}
                  className="px-6 py-3 border-2 border-[#445048] text-[#C4AD9D] rounded-lg font-semibold hover:border-gray-500 hover:text-white transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setPaymentStatus('idle');
                    setStep('method');
                    setPaymentDetails(null);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-[#F57251] to-[#d65f41] text-white rounded-lg font-semibold hover:opacity-90 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Step 1: Method Selection with Vehicle Details */}
              {step === 'method' && (
                <div className="animate-in slide-in-from-left-4 duration-300">
                  {/* Vehicle Details Section */}
                  <div className="bg-gradient-to-br from-[#0f2434] to-[#1a3247] p-6 rounded-xl mb-6 border border-[#445048]/50 shadow-inner">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">
                          {vehicleDetails.year} {vehicleDetails.manufacturer} {vehicleDetails.model}
                        </h3>
                        <p className="text-sm text-[#C4AD9D]">VIN: {vehicleDetails.vin_number}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          vehicleDetails.status === 'Available' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {vehicleDetails.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Car size={16} className="text-[#C4AD9D]" />
                          <span className="text-sm text-[#C4AD9D]">License Plate</span>
                        </div>
                        <p className="text-white font-semibold">{vehicleDetails.license_plate || '-'}</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Gauge size={16} className="text-[#C4AD9D]" />
                          <span className="text-sm text-[#C4AD9D]">Mileage</span>
                        </div>
                        <p className="text-white font-semibold">
                          {vehicleDetails.current_mileage?.toLocaleString() || '0'} km
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-[#C4AD9D]" />
                          <span className="text-sm text-[#C4AD9D]">Daily Rate</span>
                        </div>
                        <p className="text-white font-semibold">
                          ${vehicleDetails.rental_rate || '0'}
                        </p>
                      </div>
                    </div>

                    {/* Specifications Grid */}
                    <div className="mb-4">
                      <h4 className="text-sm font-bold text-[#C4AD9D] uppercase mb-3 tracking-wider">Specifications</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="bg-[#0a1a24] p-3 rounded-lg border border-[#445048]/30">
                          <div className="flex items-center gap-2 mb-1">
                            <Fuel size={14} className="text-[#F57251]" />
                            <span className="text-xs text-[#C4AD9D]">Fuel Type</span>
                          </div>
                          <p className="text-white font-medium">{vehicleDetails.fuel_type || '-'}</p>
                        </div>

                        <div className="bg-[#0a1a24] p-3 rounded-lg border border-[#445048]/30">
                          <div className="flex items-center gap-2 mb-1">
                            <Settings size={14} className="text-[#F57251]" />
                            <span className="text-xs text-[#C4AD9D]">Transmission</span>
                          </div>
                          <p className="text-white font-medium">{vehicleDetails.transmission || '-'}</p>
                        </div>

                        <div className="bg-[#0a1a24] p-3 rounded-lg border border-[#445048]/30">
                          <div className="flex items-center gap-2 mb-1">
                            <Users size={14} className="text-[#F57251]" />
                            <span className="text-xs text-[#C4AD9D]">Capacity</span>
                          </div>
                          <p className="text-white font-medium">
                            {vehicleDetails.seating_capacity || '0'} Seats
                          </p>
                        </div>

                        <div className="bg-[#0a1a24] p-3 rounded-lg border border-[#445048]/30">
                          <div className="flex items-center gap-2 mb-1">
                            <ShieldCheck size={14} className="text-[#F57251]" />
                            <span className="text-xs text-[#C4AD9D]">Color</span>
                          </div>
                          <p className="text-white font-medium">{vehicleDetails.color || '-'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    {vehicleFeatures.length > 0 && (
                      <div>
                        <h4 className="text-sm font-bold text-[#C4AD9D] uppercase mb-2 tracking-wider">Features</h4>
                        <div className="flex flex-wrap gap-2">
                          {vehicleFeatures.slice(0, 4).map((feature, index) => (
                            feature && (
                              <span 
                                key={index}
                                className="px-3 py-1 bg-[#F57251]/10 text-[#F57251] text-xs rounded-full border border-[#F57251]/20"
                              >
                                {feature}
                              </span>
                            )
                          ))}
                          {vehicleFeatures.length > 4 && (
                            <span className="px-3 py-1 bg-[#445048]/30 text-[#C4AD9D] text-xs rounded-full">
                              +{vehicleFeatures.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Amount Summary */}
                  <div className="bg-gradient-to-br from-[#0f2434] to-[#1a3247] p-4 rounded-xl mb-6 border border-[#445048]/50 shadow-inner">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-xs text-[#C4AD9D] uppercase font-bold tracking-wider">Total Amount</p>
                        <h2 className="text-3xl font-bold text-white">KES {bookingData.total_amount.toLocaleString()}</h2>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-[#C4AD9D]">Booking Ref: #{bookingData.booking_id}</p>
                        <p className="text-xs text-gray-500">Vehicle ID: {vehicleDetails.vehicle_id}</p>
                      </div>
                    </div>
                    
                    {/* Commission breakdown */}
                    <div className="mt-3 pt-3 border-t border-[#445048]/50 text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-[#C4AD9D]">Vehicle Daily Rate:</span>
                        <span className="text-[#C4AD9D]">KES {vehicleDetails.rental_rate || '0'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#C4AD9D]">Service Fee (2%):</span>
                        <span className="text-[#C4AD9D]">KES {(bookingData.total_amount * 0.02).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <h4 className="text-lg font-semibold text-white mb-4">Select Payment Method</h4>
                  <div className="space-y-4">
                    <button
                      onClick={() => handleMethodSelect('mpesa')}
                      disabled={!paystackLoaded}
                      className="w-full bg-gradient-to-r from-[#0f2434] to-[#1a3247] p-4 rounded-xl border-2 border-[#445048] hover:border-green-500 transition-all duration-300 flex items-center gap-4 group hover:shadow-lg hover:shadow-green-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center">
                        <Smartphone size={24} className="text-white" />
                      </div>
                      <div className="text-left">
                        <h5 className="font-bold text-white text-lg">M-Pesa</h5>
                        <p className="text-sm text-[#C4AD9D]">Pay via mobile money</p>
                        {userData.phone && (
                          <p className="text-xs text-green-400 mt-1">Default: {userData.phone}</p>
                        )}
                      </div>
                      {!paystackLoaded && (
                        <div className="ml-auto">
                          <Loader2 className="h-4 w-4 animate-spin text-white" />
                        </div>
                      )}
                    </button>

                    <button
                      onClick={() => handleMethodSelect('card')}
                      disabled={!paystackLoaded}
                      className="w-full bg-gradient-to-r from-[#0f2434] to-[#1a3247] p-4 rounded-xl border-2 border-[#445048] hover:border-orange-500 transition-all duration-300 flex items-center gap-4 group hover:shadow-lg hover:shadow-orange-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-600 to-orange-800 flex items-center justify-center">
                        <CreditCard size={24} className="text-white" />
                      </div>
                      <div className="text-left">
                        <h5 className="font-bold text-white text-lg">Credit/Debit Card</h5>
                        <p className="text-sm text-[#C4AD9D]">Pay with Visa or Mastercard</p>
                      </div>
                      {!paystackLoaded && (
                        <div className="ml-auto">
                          <Loader2 className="h-4 w-4 animate-spin text-white" />
                        </div>
                      )}
                    </button>
                  </div>

                  {/* Loading Indicator for Paystack */}
                  {!paystackLoaded && (
                    <div className="mt-4 p-3 bg-blue-900/20 rounded-lg border border-blue-800/30">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                        <p className="text-sm text-blue-300">Loading payment system...</p>
                      </div>
                    </div>
                  )}

                  {/* Security Footer */}
                  <div className="mt-6 pt-6 border-t border-[#445048]/30">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                      <Shield size={14} className="text-green-400" />
                      Secured by Paystack • 256-bit SSL Encryption
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: M-Pesa Phone Input */}
              {step === 'details' && (
                <form onSubmit={handleMpesaSubmit} className="animate-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="text-[#C4AD9D] hover:text-white flex items-center gap-2 transition-colors"
                    >
                      <ArrowLeft size={18} />
                      Back
                    </button>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center">
                        <Smartphone size={16} className="text-white" />
                      </div>
                      <span className="font-semibold text-white">M-Pesa Payment</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-[#445048]/20 p-4 rounded-lg border border-[#445048]">
                      <p className="text-sm text-[#C4AD9D]">
                        Enter your M-Pesa number. A payment request will be sent to this number.
                      </p>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#C4AD9D] uppercase mb-2 block">M-Pesa Number</label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                          +254
                        </div>
                        <input
                          type="tel"
                          placeholder="712 345 678"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 9))}
                          className="w-full bg-[#0f2434] border border-[#445048] rounded-lg p-3 pl-16 text-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/50 transition-all placeholder-gray-600"
                          required
                          disabled={paymentStatus === 'processing'}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Enter your Safaricom number (e.g., 712345678)</p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={handleBack}
                        disabled={paymentStatus === 'processing'}
                        className="flex-1 py-3 border-2 border-[#445048] text-[#C4AD9D] rounded-lg font-semibold hover:border-gray-500 hover:text-white transition-colors disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={paymentStatus === 'processing' || !paystackLoaded || phoneNumber.length < 9}
                        className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 rounded-lg font-bold shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {paymentStatus === 'processing' ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Loading...
                          </>
                        ) : !paystackLoaded ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Loading Gateway...
                          </>
                        ) : (
                          'Proceed to Payment'
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Step 3: Paystack Interface Loading/Placeholder */}
              {step === 'paystack' && (
                <div className="animate-in slide-in-from-bottom-4 duration-300">
                  <div className="text-center py-12">
                    <div className="h-20 w-20 border-4 border-[#445048] border-t-[#F57251] rounded-full animate-spin mx-auto mb-6"></div>
                    <h4 className="text-2xl font-bold text-white mb-3">Loading Payment Gateway</h4>
                    <p className="text-[#C4AD9D] mb-6">
                      Please wait while we connect to the secure payment system...
                    </p>
                    <div className="inline-flex items-center gap-3 bg-blue-900/20 px-4 py-3 rounded-lg border border-blue-800/30">
                      <Shield size={18} className="text-blue-400" />
                      <span className="text-blue-300 text-sm">
                        Your payment details are secured
                      </span>
                    </div>
                    <div className="mt-8">
                      <button
                        onClick={() => {
                          if (paymentTimeout) clearTimeout(paymentTimeout);
                          setPaymentStatus('idle');
                          setStep('method');
                        }}
                        className="px-6 py-2 border border-[#445048] text-[#C4AD9D] rounded-lg hover:text-white hover:border-gray-500 transition-colors"
                      >
                        Cancel Payment
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-6">
                      This may take a few seconds. If nothing appears in 15 seconds, please try again.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;



