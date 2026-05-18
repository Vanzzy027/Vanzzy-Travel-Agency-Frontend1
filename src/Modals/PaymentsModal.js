import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Shield, X, CreditCard, Smartphone, CheckCircle, AlertCircle, } from "lucide-react";
// --- Stripe ---
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements, } from "@stripe/react-stripe-js";
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
const usePaystackScript = () => {
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        // Already present?
        if (window.PaystackPop) {
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
const StripeCardForm = ({ bookingData, userData, vehicleDetails, onSuccess, onCancel }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [processing, setProcessing] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements)
            return;
        setProcessing(true);
        setErrorMsg("");
        try {
            const res = await fetch(`${API_BASE_URL}/api/payments/stripe/create-intent`, {
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
            });
            if (!res.ok) {
                throw new Error("Failed to create payment intent.");
            }
            const { clientSecret } = await res.json();
            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: {
                        email: userData.email,
                        name: `${userData.first_name} ${userData.last_name}`,
                        phone: userData.phone || undefined,
                    },
                },
            });
            if (error) {
                setErrorMsg(error.message || "Card payment failed.");
                toast.error(error.message || "Card payment failed.");
            }
            else if (paymentIntent?.status === "succeeded") {
                onSuccess(paymentIntent.id);
            }
        }
        catch (err) {
            console.error(err);
            setErrorMsg(err.message || "An unexpected error occurred.");
            toast.error(err.message || "Card payment failed.");
        }
        finally {
            setProcessing(false);
        }
    };
    return (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsx("div", { className: "bg-[#0f2434] p-4 rounded-xl border border-[#445048]", children: _jsx(CardElement, { options: {
                        style: {
                            base: {
                                fontSize: "16px",
                                color: "#ffffff",
                                "::placeholder": { color: "#8899A6" },
                            },
                            invalid: { color: "#F57251" },
                        },
                    } }) }), errorMsg && (_jsxs("p", { className: "text-red-400 text-sm flex items-center gap-1", children: [_jsx(AlertCircle, { size: 14 }), " ", errorMsg] })), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { type: "button", onClick: onCancel, disabled: processing, className: "flex-1 py-3 border border-[#445048] text-[#C4AD9D] rounded-xl font-semibold hover:text-white transition-colors disabled:opacity-50", children: "Cancel" }), _jsx("button", { type: "submit", disabled: !stripe || processing, className: "flex-1 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 text-white py-3 rounded-xl font-bold shadow-lg transition-all disabled:opacity-50", children: processing ? "Processing…" : "Pay with Card" })] })] }));
};
/* ------------------------------------------------------------------ */
/*  Main Payment Modal                                                 */
/* ------------------------------------------------------------------ */
const PaymentModal = ({ isOpen, onClose, onSuccess, bookingData, userData, vehicleDetails, }) => {
    const navigate = useNavigate();
    const modalRef = useRef(null);
    // --- Paystack script loader ---
    const paystackScriptLoaded = usePaystackScript();
    const paystackHandlerRef = useRef(null);
    // UI states
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState("idle");
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
        const handleClickOutside = (event) => {
            if (modalRef.current &&
                !modalRef.current.contains(event.target) &&
                paymentStatus !== "processing") {
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
    const handleMethodSelect = (method) => {
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
        if (typeof window.PaystackPop === "undefined") {
            toast.error("Payment system is still loading. Please try again in a moment.");
            setPaymentStatus("idle");
            return;
        }
        // Instantiate the V2 object and call newTransaction
        const paystack = new window.PaystackPop();
        paystack.newTransaction({
            key: PAYSTACK_PUBLIC_KEY,
            email: userData.email,
            amount: amountInKobo,
            currency: "KES",
            ref: paystackConfig.reference,
            metadata: paystackConfig.metadata,
            onSuccess: (response) => {
                console.log("✅ Paystack onSuccess fired:", response);
                const standardizedResponse = {
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
            onError: (error) => {
                console.error("💥 Paystack error:", error);
                setPaymentStatus("failed");
                toast.error("Payment failed.");
            },
        });
    };
    const handleStripeSuccess = async (paymentIntentId) => {
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
            const backendResponse = await fetch(`${API_BASE_URL}/api/payments/initialize`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(paymentData),
            });
            if (!backendResponse.ok) {
                throw new Error("Backend failed to record transaction.");
            }
            setPaymentStatus("success");
            toast.success("Payment verified successfully!");
            if (onSuccess)
                onSuccess();
            setTimeout(() => {
                handleClose();
                navigate("/UserDashboard");
            }, 2500);
        }
        catch (err) {
            console.error("Sync Failure:", err);
            toast.error(err.message || "Payment processed, but system synchronization failed.");
            setPaymentStatus("failed");
        }
    };
    const handlePaymentSuccess = async (response, method) => {
        console.log("📦 handlePaymentSuccess called with", response, method);
        setPaymentStatus("processing");
        const transactionId = response.transaction || response.id || `PSK-${Date.now()}`;
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
            const backendResponse = await fetch(`${API_BASE_URL}/api/payments/initialize`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(paymentData),
            });
            if (!backendResponse.ok) {
                throw new Error("Backend failed to register transaction.");
            }
            setPaymentStatus("success");
            toast.success("Payment verified successfully!");
            if (onSuccess)
                onSuccess();
            setTimeout(() => {
                handleClose();
                navigate("/UserDashboard");
            }, 3000);
        }
        catch (err) {
            console.error("Sync Failure:", err);
            toast.error(err.message || "System synchronization failed.");
            setPaymentStatus("failed");
        }
    };
    // --- Render ---
    if (!isOpen)
        return null;
    return (_jsx("div", { className: "fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-[100]", children: _jsxs("div", { ref: modalRef, className: "bg-[#001524] w-full sm:rounded-2xl border-t sm:border border-[#445048] shadow-2xl overflow-hidden flex flex-col h-[90dvh] sm:h-auto sm:max-h-[90vh] max-w-2xl", children: [_jsxs("div", { className: "flex-none bg-gradient-to-r from-[#027480] to-[#014d57] p-4 flex justify-between items-center z-10 shadow-md", children: [_jsxs("div", { className: "flex items-center gap-2 text-white", children: [_jsx(Shield, { size: 20 }), _jsx("h3", { className: "text-xl font-bold", children: "Secure Rental Payment" })] }), _jsx("button", { onClick: handleClose, disabled: paymentStatus === "processing", className: "text-white hover:text-red-200 transition-colors p-2 rounded-full hover:bg-white/10 disabled:opacity-30", children: _jsx(X, { size: 24 }) })] }), _jsxs("div", { className: "flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar", children: [paymentStatus === "success" && (_jsxs("div", { className: "text-center py-8 animate-in zoom-in duration-300", children: [_jsx("div", { className: "inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-6", children: _jsx(CheckCircle, { size: 40, className: "text-green-400" }) }), _jsx("h3", { className: "text-2xl font-bold text-green-400 mb-2", children: "Payment Successful!" }), _jsxs("p", { className: "text-[#C4AD9D]", children: ["Your booking for", " ", _jsxs("span", { className: "text-white font-semibold", children: [vehicleDetails.manufacturer, " ", vehicleDetails.model] }), " ", "is confirmed."] }), _jsx("p", { className: "text-xs text-gray-500 mt-6 animate-pulse", children: "Redirecting to your dashboard..." })] })), paymentStatus === "failed" && (_jsxs("div", { className: "text-center py-8", children: [_jsx("div", { className: "inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/20 mb-6", children: _jsx(AlertCircle, { size: 40, className: "text-red-400" }) }), _jsx("h3", { className: "text-2xl font-bold text-red-400 mb-2", children: "Payment Failed" }), _jsx("p", { className: "text-[#C4AD9D] mb-4", children: "Transaction was not completed. Please try again or use another method." }), _jsxs("div", { className: "flex gap-3 justify-center", children: [_jsx("button", { onClick: handleClose, className: "px-6 py-3 border-2 border-[#445048] text-[#C4AD9D] rounded-lg font-semibold hover:border-gray-500 hover:text-white transition-colors", children: "Close" }), _jsx("button", { onClick: () => {
                                                setPaymentStatus("idle");
                                                setPaymentMethod(null);
                                            }, className: "px-6 py-3 bg-gradient-to-r from-[#F57251] to-[#d65f41] text-white rounded-lg font-semibold hover:opacity-90 transition-colors", children: "Try Again" })] })] })), paymentStatus === "idle" && !paymentMethod && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "bg-gradient-to-br from-[#0f2434] to-[#1a3247] p-4 md:p-6 rounded-xl border border-[#445048]/50", children: [_jsxs("h3", { className: "text-xl font-bold text-white", children: [vehicleDetails.year, " ", vehicleDetails.manufacturer, " ", vehicleDetails.model] }), _jsxs("div", { className: "mt-3 grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("span", { className: "text-xs text-[#C4AD9D]", children: "Daily Base Rate" }), _jsxs("p", { className: "text-white font-semibold", children: ["KES ", vehicleDetails.rental_rate?.toLocaleString() ?? "0", " ", "/ day"] })] }), _jsxs("div", { children: [_jsx("span", { className: "text-xs text-[#C4AD9D]", children: "Total Charge" }), _jsxs("p", { className: "text-2xl font-bold text-white", children: ["KES ", bookingData.total_amount.toLocaleString()] })] })] })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("button", { onClick: () => handleMethodSelect("mpesa"), className: "w-full bg-gradient-to-r from-[#0f2434] to-[#1a3247] p-4 rounded-xl border-2 border-[#445048] hover:border-green-500 transition-all flex items-center gap-4", children: [_jsx("div", { className: "h-12 w-12 rounded-xl bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center shrink-0", children: _jsx(Smartphone, { size: 24, className: "text-white" }) }), _jsxs("div", { className: "text-left", children: [_jsx("h5", { className: "font-bold text-white text-lg", children: "M\u2011Pesa" }), _jsx("p", { className: "text-sm text-[#C4AD9D]", children: "Pay directly via M\u2011Pesa (Paystack)" })] })] }), _jsxs("button", { onClick: () => handleMethodSelect("card"), className: "w-full bg-gradient-to-r from-[#0f2434] to-[#1a3247] p-4 rounded-xl border-2 border-[#445048] hover:border-orange-500 transition-all flex items-center gap-4", children: [_jsx("div", { className: "h-12 w-12 rounded-xl bg-gradient-to-br from-orange-600 to-orange-800 flex items-center justify-center shrink-0", children: _jsx(CreditCard, { size: 24, className: "text-white" }) }), _jsxs("div", { className: "text-left", children: [_jsx("h5", { className: "font-bold text-white text-lg", children: "Credit / Debit Card" }), _jsx("p", { className: "text-sm text-[#C4AD9D]", children: "Pay securely with Stripe" })] })] })] })] })), paymentMethod === "card" && paymentStatus === "idle" && (_jsxs("div", { className: "space-y-4 animate-in slide-in-from-right-4 duration-300", children: [_jsx("div", { className: "flex items-center justify-between mb-2", children: _jsx("button", { onClick: () => setPaymentMethod(null), className: "text-[#C4AD9D] hover:text-white flex items-center gap-2 transition-colors text-sm", children: "\u2190 Back to methods" }) }), stripePromise ? (_jsx(Elements, { stripe: stripePromise, options: {
                                        mode: "payment",
                                        amount: bookingData.total_amount * 100,
                                        currency: "kes",
                                    }, children: _jsx(StripeCardForm, { bookingData: bookingData, userData: userData, vehicleDetails: vehicleDetails, onSuccess: handleStripeSuccess, onCancel: () => setPaymentMethod(null) }) })) : (_jsxs("div", { className: "text-center py-8", children: [_jsx(AlertCircle, { className: "mx-auto text-orange-400 mb-3", size: 32 }), _jsx("p", { className: "text-white font-semibold", children: "Stripe is not configured" }), _jsx("p", { className: "text-[#C4AD9D] text-sm", children: "Please provide a Stripe publishable key." }), _jsx("button", { onClick: () => setPaymentMethod(null), className: "mt-4 px-4 py-2 border border-[#445048] text-[#C4AD9D] rounded-lg hover:text-white transition-colors", children: "Go back" })] }))] }))] })] }) }));
};
export default PaymentModal;
