import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Shield,
  X,
  CreditCard,
  Smartphone,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

// --- Stripe ---
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
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
    rental_rate: number;
    status: string;
    manufacturer: string;
    model: string;
    year: number;
    fuel_type: string;
    transmission: string;
    seating_capacity: number;
    color: string;
    current_mileage: number;
    features: string | string[];
    images: string | string[];
    on_promo: boolean;
  };
}

interface PaystackResponse {
  status: string;
  reference: string;
  transaction?: string;
  id?: string;
  message?: string;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */
const API_BASE_URL = import.meta.env.VITE_API_URL;
const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
if (!PAYSTACK_PUBLIC_KEY) {
  console.error("Paystack public key is not set!");
}
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

// Init Stripe outside component to avoid re‑creation
const stripePromise = STRIPE_PUBLISHABLE_KEY
  ? loadStripe(STRIPE_PUBLISHABLE_KEY)
  : null;

/* ------------------------------------------------------------------ */
/*  Custom Hook: usePaystackScript                                     */
/* ------------------------------------------------------------------ */
const usePaystackScript = (): boolean => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Already present?
    if ((window as any).PaystackPop) {
      setLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = () => {
      console.log("✅ Paystack script loaded.");
      setLoaded(true);
    };
    script.onerror = () => {
      console.error("❌ Failed to load Paystack script.");
    };
    document.body.appendChild(script);

    // No cleanup needed – script persists
  }, []);

  return loaded;
};

/* ------------------------------------------------------------------ */
/*  Sub‑component: Stripe Card Form                                    */
/* ------------------------------------------------------------------ */
const StripeCardForm: React.FC<{
  bookingData: PaymentModalProps["bookingData"];
  userData: PaymentModalProps["userData"];
  vehicleDetails: PaymentModalProps["vehicleDetails"];
  onSuccess: (paymentIntentId: string) => void;
  onCancel: () => void;
}> = ({ bookingData, userData, vehicleDetails, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setErrorMsg("");

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/payments/stripe/create-intent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            booking_id: bookingData.booking_id,
            amount: bookingData.total_amount,
            currency: "kes",
            metadata: {
              user_id: userData.user_id,
              vehicle_id: vehicleDetails.vehicle_id,
            },
          }),
        },
      );

      if (!res.ok) {
        throw new Error("Failed to create payment intent.");
      }

      const { clientSecret } = await res.json();

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement)!,
            billing_details: {
              email: userData.email,
              name: `${userData.first_name} ${userData.last_name}`,
              phone: userData.phone || undefined,
            },
          },
        },
      );

      if (error) {
        setErrorMsg(error.message || "Card payment failed.");
        toast.error(error.message || "Card payment failed.");
      } else if (paymentIntent?.status === "succeeded") {
        onSuccess(paymentIntent.id);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An unexpected error occurred.");
      toast.error(err.message || "Card payment failed.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-[#0f2434] p-4 rounded-xl border border-[#445048]">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#ffffff",
                "::placeholder": { color: "#8899A6" },
              },
              invalid: { color: "#F57251" },
            },
          }}
        />
      </div>
      {errorMsg && (
        <p className="text-red-400 text-sm flex items-center gap-1">
          <AlertCircle size={14} /> {errorMsg}
        </p>
      )}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={processing}
          className="flex-1 py-3 border border-[#445048] text-[#C4AD9D] rounded-xl font-semibold hover:text-white transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || processing}
          className="flex-1 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 text-white py-3 rounded-xl font-bold shadow-lg transition-all disabled:opacity-50"
        >
          {processing ? "Processing…" : "Pay with Card"}
        </button>
      </div>
    </form>
  );
};

/* ------------------------------------------------------------------ */
/*  Main Payment Modal                                                 */
/* ------------------------------------------------------------------ */
const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  bookingData,
  userData,
  vehicleDetails,
}) => {
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement>(null);

  // --- Paystack script loader ---
  const paystackScriptLoaded = usePaystackScript();
  const paystackHandlerRef = useRef<any>(null);

  // UI states
  const [paymentMethod, setPaymentMethod] = useState<"mpesa" | "card" | null>(
    null,
  );
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "processing" | "success" | "failed"
  >("idle");

  // Amount in kobo
  const amountInKobo = Math.round(bookingData.total_amount * 100);

  // Generate a stable reference only once when modal opens
  const paystackReference = useRef(`B-${bookingData.booking_id}-${Date.now()}`);
  const paystackConfig = {
    email: userData.email,
    amount: amountInKobo,
    currency: "KES",
    publicKey: PAYSTACK_PUBLIC_KEY,
    reference: paystackReference.current,
    metadata: {
      booking_id: bookingData.booking_id,
      user_id: userData.user_id,
      vehicle_id: vehicleDetails.vehicle_id,
      phone: userData.phone || "",
      custom_fields: [
        {
          display_name: "Vehicle",
          variable_name: "vehicle",
          value: `${vehicleDetails.manufacturer} ${vehicleDetails.model}`,
        },
        {
          display_name: "License Plate",
          variable_name: "license_plate",
          value: vehicleDetails.license_plate,
        },
      ],
    },
  };

  // --- Effects ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        paymentStatus !== "processing"
      ) {
        handleClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, paymentStatus]);

  useEffect(() => {
    if (!isOpen) {
      setPaymentMethod(null);
      setPaymentStatus("idle");
    }
  }, [isOpen]);

  // Cleanup Paystack iframe on unmount
  useEffect(() => {
    return () => {
      if (paystackHandlerRef.current) {
        paystackHandlerRef.current.close();
      }
    };
  }, []);

  // --- Handlers ---
  const handleClose = () => {
    setPaymentStatus("idle");
    setPaymentMethod(null);
    onClose();
  };

  const handleMethodSelect = (method: "mpesa" | "card") => {
    setPaymentMethod(method);
    if (method === "mpesa") {
      if (!paystackScriptLoaded) {
        toast.error("Payment system is still loading. Please wait.");
        return;
      }
      handlePaystackPopup();
    }
  };

  const handlePaystackPopup = () => {
    if (!PAYSTACK_PUBLIC_KEY) {
      toast.error("Paystack key is missing.");
      return;
    }
    setPaymentStatus("processing");

    // Check if the V2 library has loaded properly
    if (typeof (window as any).PaystackPop === "undefined") {
      toast.error(
        "Payment system is still loading. Please try again in a moment.",
      );
      setPaymentStatus("idle");
      return;
    }

    // Instantiate the V2 object and call newTransaction
    const paystack = new (window as any).PaystackPop();
    paystack.newTransaction({
      key: PAYSTACK_PUBLIC_KEY,
      email: userData.email,
      amount: amountInKobo,
      currency: "KES",
      ref: paystackConfig.reference,
      metadata: paystackConfig.metadata,
      onSuccess: (response: any) => {
        console.log("✅ Paystack onSuccess fired:", response);
        const standardizedResponse: PaystackResponse = {
          status: "success",
          reference: response.reference,
          transaction: response.trans, // V2 uses 'trans' for the transaction ID
          id: response.trans,
        };
        handlePaymentSuccess(standardizedResponse, "mpesa");
      },
      onCancel: () => {
        console.log("🔒 Paystack popup closed");
        setPaymentStatus("idle");
        toast.info("Payment window closed.");
      },
      onError: (error: any) => {
        console.error("💥 Paystack error:", error);
        setPaymentStatus("failed");
        toast.error("Payment failed.");
      },
    });
  };

  const handleStripeSuccess = async (paymentIntentId: string) => {
    setPaymentStatus("processing");
    try {
      const paymentData = {
        booking_id: bookingData.booking_id,
        user_id: userData.user_id,
        amount: bookingData.total_amount,
        payment_method: "Card",
        payment_status: "completed",
        transaction_id: paymentIntentId,
        transaction_reference: paymentIntentId,
        phone: userData.phone || "",
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

      const backendResponse = await fetch(
        `${API_BASE_URL}/api/payments/initialize`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(paymentData),
        },
      );

      if (!backendResponse.ok) {
        throw new Error("Backend failed to record transaction.");
      }

      setPaymentStatus("success");
      toast.success("Payment verified successfully!");

      if (onSuccess) onSuccess();

      setTimeout(() => {
        handleClose();
        navigate("/UserDashboard");
      }, 2500);
    } catch (err: any) {
      console.error("Sync Failure:", err);
      toast.error(
        err.message || "Payment processed, but system synchronization failed.",
      );
      setPaymentStatus("failed");
    }
  };

  const handlePaymentSuccess = async (
    response: PaystackResponse,
    method: "mpesa" | "card",
  ) => {
    console.log("📦 handlePaymentSuccess called with", response, method);
    setPaymentStatus("processing");

    const transactionId =
      response.transaction || response.id || `PSK-${Date.now()}`;

    const paymentData = {
      booking_id: bookingData.booking_id,
      user_id: userData.user_id,
      amount: bookingData.total_amount,
      payment_method: method === "mpesa" ? "M-Pesa" : "Card",
      payment_status: "completed",
      transaction_id: transactionId.toString(),
      transaction_reference: response.reference,
      phone: userData.phone || "",
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

    try {
      const backendResponse = await fetch(
        `${API_BASE_URL}/api/payments/initialize`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(paymentData),
        },
      );

      if (!backendResponse.ok) {
        throw new Error("Backend failed to register transaction.");
      }

      setPaymentStatus("success");
      toast.success("Payment verified successfully!");

      if (onSuccess) onSuccess();

      setTimeout(() => {
        handleClose();
        navigate("/UserDashboard");
      }, 3000);
    } catch (err: any) {
      console.error("Sync Failure:", err);
      toast.error(err.message || "System synchronization failed.");
      setPaymentStatus("failed");
    }
  };

  // --- Render ---
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-[100]">
      <div
        ref={modalRef}
        className="bg-[#001524] w-full sm:rounded-2xl border-t sm:border border-[#445048] shadow-2xl overflow-hidden flex flex-col h-[90dvh] sm:h-auto sm:max-h-[90vh] max-w-2xl"
      >
        {/* Header */}
        <div className="flex-none bg-gradient-to-r from-[#027480] to-[#014d57] p-4 flex justify-between items-center z-10 shadow-md">
          <div className="flex items-center gap-2 text-white">
            <Shield size={20} />
            <h3 className="text-xl font-bold">Secure Rental Payment</h3>
          </div>
          <button
            onClick={handleClose}
            disabled={paymentStatus === "processing"}
            className="text-white hover:text-red-200 transition-colors p-2 rounded-full hover:bg-white/10 disabled:opacity-30"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
          {/* Success / Failed screens */}
          {paymentStatus === "success" && (
            <div className="text-center py-8 animate-in zoom-in duration-300">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-6">
                <CheckCircle size={40} className="text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-green-400 mb-2">
                Payment Successful!
              </h3>
              <p className="text-[#C4AD9D]">
                Your booking for{" "}
                <span className="text-white font-semibold">
                  {vehicleDetails.manufacturer} {vehicleDetails.model}
                </span>{" "}
                is confirmed.
              </p>
              <p className="text-xs text-gray-500 mt-6 animate-pulse">
                Redirecting to your dashboard...
              </p>
            </div>
          )}

          {paymentStatus === "failed" && (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/20 mb-6">
                <AlertCircle size={40} className="text-red-400" />
              </div>
              <h3 className="text-2xl font-bold text-red-400 mb-2">
                Payment Failed
              </h3>
              <p className="text-[#C4AD9D] mb-4">
                Transaction was not completed. Please try again or use another
                method.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleClose}
                  className="px-6 py-3 border-2 border-[#445048] text-[#C4AD9D] rounded-lg font-semibold hover:border-gray-500 hover:text-white transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setPaymentStatus("idle");
                    setPaymentMethod(null);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-[#F57251] to-[#d65f41] text-white rounded-lg font-semibold hover:opacity-90 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Payment method selection */}
          {paymentStatus === "idle" && !paymentMethod && (
            <div className="space-y-6">
              {/* Vehicle Summary */}
              <div className="bg-gradient-to-br from-[#0f2434] to-[#1a3247] p-4 md:p-6 rounded-xl border border-[#445048]/50">
                <h3 className="text-xl font-bold text-white">
                  {vehicleDetails.year} {vehicleDetails.manufacturer}{" "}
                  {vehicleDetails.model}
                </h3>
                <div className="mt-3 grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-[#C4AD9D]">
                      Daily Base Rate
                    </span>
                    <p className="text-white font-semibold">
                      KES {vehicleDetails.rental_rate?.toLocaleString() ?? "0"}{" "}
                      / day
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-[#C4AD9D]">Total Charge</span>
                    <p className="text-2xl font-bold text-white">
                      KES {bookingData.total_amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Gateway buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => handleMethodSelect("mpesa")}
                  className="w-full bg-gradient-to-r from-[#0f2434] to-[#1a3247] p-4 rounded-xl border-2 border-[#445048] hover:border-green-500 transition-all flex items-center gap-4"
                >
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center shrink-0">
                    <Smartphone size={24} className="text-white" />
                  </div>
                  <div className="text-left">
                    <h5 className="font-bold text-white text-lg">M‑Pesa</h5>
                    <p className="text-sm text-[#C4AD9D]">
                      Pay directly via M‑Pesa (Paystack)
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => handleMethodSelect("card")}
                  className="w-full bg-gradient-to-r from-[#0f2434] to-[#1a3247] p-4 rounded-xl border-2 border-[#445048] hover:border-orange-500 transition-all flex items-center gap-4"
                >
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-600 to-orange-800 flex items-center justify-center shrink-0">
                    <CreditCard size={24} className="text-white" />
                  </div>
                  <div className="text-left">
                    <h5 className="font-bold text-white text-lg">
                      Credit / Debit Card
                    </h5>
                    <p className="text-sm text-[#C4AD9D]">
                      Pay securely with Stripe
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Stripe Card Form */}
          {paymentMethod === "card" && paymentStatus === "idle" && (
            <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={() => setPaymentMethod(null)}
                  className="text-[#C4AD9D] hover:text-white flex items-center gap-2 transition-colors text-sm"
                >
                  ← Back to methods
                </button>
              </div>

              {stripePromise ? (
                <Elements
                  stripe={stripePromise}
                  options={{
                    mode: "payment",
                    amount: bookingData.total_amount * 100,
                    currency: "kes",
                  }}
                >
                  <StripeCardForm
                    bookingData={bookingData}
                    userData={userData}
                    vehicleDetails={vehicleDetails}
                    onSuccess={handleStripeSuccess}
                    onCancel={() => setPaymentMethod(null)}
                  />
                </Elements>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle
                    className="mx-auto text-orange-400 mb-3"
                    size={32}
                  />
                  <p className="text-white font-semibold">
                    Stripe is not configured
                  </p>
                  <p className="text-[#C4AD9D] text-sm">
                    Please provide a Stripe publishable key.
                  </p>
                  <button
                    onClick={() => setPaymentMethod(null)}
                    className="mt-4 px-4 py-2 border border-[#445048] text-[#C4AD9D] rounded-lg hover:text-white transition-colors"
                  >
                    Go back
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
