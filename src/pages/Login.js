import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/slice/AuthSlice";
import { useLoginMutation, useForgotPasswordMutation, useResetPasswordMutation } from "../features/api/AuthAPI";
import { Car, Shield, Key, Mail, Lock, Eye, EyeOff, ChevronLeft } from "lucide-react";
const Login = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const [showPassword, setShowPassword] = useState(false);
    const [forgotPassword, setForgotPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetOTP, setResetOTP] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // API hooks
    const [loginUser, { isLoading: isLoginLoading }] = useLoginMutation();
    const [forgotPasswordApi, { isLoading: isForgotPasswordLoading }] = useForgotPasswordMutation();
    const [resetPasswordApi, { isLoading: isResetPasswordLoading }] = useResetPasswordMutation();
    const onSubmit = async (data) => {
        try {
            const response = await loginUser(data).unwrap();
            dispatch(setCredentials({ token: response.token, user: response.user }));
            localStorage.setItem('user', JSON.stringify(response.user));
            localStorage.setItem('token', response.token);
            toast.success(`Welcome ${response.user.first_name} back to VansKE! 🚗`);
            setTimeout(() => {
                switch (response.user.role) {
                    case 'superAdmin':
                        navigate('/super-admin');
                        break;
                    case 'admin':
                        navigate('/admin');
                        break;
                    case 'user':
                        navigate('/UserDashboard');
                        break;
                    default:
                        navigate('/');
                }
            }, 800);
        }
        catch (error) {
            toast.error(error.data?.error || "Login failed. Please check your credentials.");
        }
    };
    const handleForgotPassword = async () => {
        if (!resetEmail) {
            toast.error("Please enter your email");
            return;
        }
        try {
            const response = await forgotPasswordApi({ email: resetEmail }).unwrap();
            toast.success("Reset OTP sent to your email. Please check your inbox.");
        }
        catch (error) {
            toast.error(error.data?.error || "Failed to send OTP. Please check your email.");
        }
    };
    const handleResetPassword = async () => {
        if (!newPassword || !confirmPassword) {
            toast.error("Please enter and confirm your new password");
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        if (!resetOTP) {
            toast.error("Please enter the OTP from your email");
            return;
        }
        try {
            const response = await resetPasswordApi({
                email: resetEmail,
                otp: resetOTP,
                new_password: newPassword
            }).unwrap();
            toast.success("Password reset successfully! Please login with your new password.");
            setForgotPassword(false);
            setResetEmail('');
            setResetOTP('');
            setNewPassword('');
            setConfirmPassword('');
        }
        catch (error) {
            toast.error(error.data?.error || "Failed to reset password. Please check OTP and try again.");
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-[#001524] via-[#001524] to-[#027480] flex items-center justify-center p-4 md:p-8", children: _jsxs("div", { className: "w-full max-w-4xl bg-[#E9E6DD] rounded-3xl shadow-2xl overflow-hidden", children: [_jsxs("div", { className: "md:hidden bg-gradient-to-r from-[#001524] to-[#027480] p-6 text-center", children: [_jsxs(Link, { to: "/", className: "inline-flex items-center text-[#E9E6DD] hover:text-[#F57251] mb-4", children: [_jsx(ChevronLeft, { size: 20, className: "mr-2" }), _jsx("span", { children: "Back to Home" })] }), _jsxs("div", { className: "flex items-center justify-center space-x-3 mb-4", children: [_jsx("div", { className: "w-12 h-12 rounded-full bg-[#E9E6DD] flex items-center justify-center", children: _jsx("span", { className: "text-[#001524] font-bold text-xl", children: "V" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-[#E9E6DD]", children: "VansKE" }), _jsx("p", { className: "text-[#C4AD9D] text-sm", children: "Luxury & Performance" })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 min-h-[70vh]", children: [_jsxs("div", { className: "hidden lg:flex bg-gradient-to-br from-[#001524] to-[#027480] p-8 lg:p-12 flex-col justify-between text-[#E9E6DD] relative overflow-hidden", children: [_jsx("div", { className: "absolute top-0 right-0 w-64 h-64 bg-[#F57251]/10 rounded-full -translate-y-32 translate-x-32" }), _jsx("div", { className: "absolute bottom-0 left-0 w-48 h-48 bg-[#D6CC99]/10 rounded-full -translate-x-24 translate-y-24" }), _jsxs("div", { className: "relative z-10", children: [_jsxs("div", { className: "flex items-center space-x-4 mb-8", children: [_jsx("div", { className: "w-16 h-16 rounded-full bg-[#E9E6DD] flex items-center justify-center", children: _jsx("span", { className: "text-[#001524] font-bold text-3xl", children: "V" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-3xl lg:text-4xl font-bold", children: "VansKE Car Rental" }), _jsx("p", { className: "text-[#C4AD9D] text-base lg:text-lg", children: "Luxury & Performance" })] })] }), _jsxs("div", { className: "mt-8 space-y-6", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx(Shield, { className: "w-5 h-5 lg:w-6 lg:h-6 text-[#F57251] flex-shrink-0" }), _jsx("h3", { className: "text-lg lg:text-xl font-semibold", children: "Secure & Trusted Platform" })] }), _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx(Car, { className: "w-5 h-5 lg:w-6 lg:h-6 text-[#F57251] flex-shrink-0" }), _jsx("h3", { className: "text-lg lg:text-xl font-semibold", children: "Premium Fleet Management" })] }), _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx(Key, { className: "w-5 h-5 lg:w-6 lg:h-6 text-[#F57251] flex-shrink-0" }), _jsx("h3", { className: "text-lg lg:text-xl font-semibold", children: "Instant Booking Access" })] })] })] }), _jsx("div", { className: "relative z-10 mt-auto pt-8 border-t border-[#445048]", children: _jsx("p", { className: "italic text-[#C4AD9D] text-sm lg:text-base", children: "\"Experience luxury on wheels with VansKE - where every journey is exceptional.\"" }) })] }), _jsxs("div", { className: "p-6 md:p-8 lg:p-12 flex flex-col justify-center", children: [!forgotPassword ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "mb-6 md:mb-8", children: [_jsx("h2", { className: "text-2xl md:text-3xl font-bold text-[#001524] mb-2", children: "Welcome Back" }), _jsx("p", { className: "text-[#445048] text-sm md:text-base", children: "Sign in to access your VansKE account" })] }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-4 md:space-y-6", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-[#001524] mb-2", children: "Email Address" }), _jsxs("div", { className: "relative", children: [_jsx(Mail, { className: "absolute left-3 md:left-4 top-3 md:top-3.5 w-4 h-4 md:w-5 md:h-5 text-[#445048]" }), _jsx("input", { id: "email", type: "email", ...register("email", {
                                                                        required: "Email is required",
                                                                        pattern: {
                                                                            value: /^\S+@\S+$/i,
                                                                            message: "Enter a valid email address",
                                                                        },
                                                                    }), className: "w-full pl-10 md:pl-12 pr-4 py-3 bg-white border border-[#445048]/30 rounded-lg md:rounded-xl text-[#001524] placeholder-[#C4AD9D] text-sm md:text-base focus:outline-none focus:border-[#027480] focus:ring-2 focus:ring-[#027480]/20 transition-all duration-200", placeholder: "your.email@example.com" })] }), errors.email && (_jsx("p", { className: "mt-1 text-sm text-[#F57251]", children: errors.email.message }))] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("label", { htmlFor: "password", className: "block text-sm font-medium text-[#001524]", children: "Password" }), _jsx("button", { type: "button", onClick: () => setForgotPassword(true), className: "text-xs md:text-sm text-[#027480] hover:text-[#F57251] transition-colors duration-200 font-medium", children: "Forgot password?" })] }), _jsxs("div", { className: "relative", children: [_jsx(Lock, { className: "absolute left-3 md:left-4 top-3 md:top-3.5 w-4 h-4 md:w-5 md:h-5 text-[#445048]" }), _jsx("input", { id: "password", type: showPassword ? "text" : "password", ...register("password", {
                                                                        required: "Password is required",
                                                                        minLength: {
                                                                            value: 6,
                                                                            message: "Password must be at least 6 characters",
                                                                        },
                                                                    }), className: "w-full pl-10 md:pl-12 pr-10 md:pr-12 py-3 bg-white border border-[#445048]/30 rounded-lg md:rounded-xl text-[#001524] placeholder-[#C4AD9D] text-sm md:text-base focus:outline-none focus:border-[#027480] focus:ring-2 focus:ring-[#027480]/20 transition-all duration-200", placeholder: "Enter your password" }), _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute right-3 md:right-4 top-3 md:top-3.5 text-[#445048] hover:text-[#027480]", children: showPassword ? _jsx(EyeOff, { size: 18, className: "md:w-5 md:h-5" }) : _jsx(Eye, { size: 18, className: "md:w-5 md:h-5" }) })] }), errors.password && (_jsx("p", { className: "mt-1 text-sm text-[#F57251]", children: errors.password.message }))] }), _jsxs("div", { className: "flex items-center space-x-2 md:space-x-3", children: [_jsx("input", { id: "remember", name: "remember", type: "checkbox", className: "w-4 h-4 text-[#027480] bg-white border-[#445048]/30 rounded focus:ring-[#027480] focus:ring-1 md:focus:ring-2" }), _jsx("label", { htmlFor: "remember", className: "text-xs md:text-sm text-[#445048]", children: "Remember me for 30 days" })] }), _jsx("button", { type: "submit", disabled: isLoginLoading || isSubmitting, className: "w-full bg-gradient-to-r from-[#027480] to-[#F57251] text-[#E9E6DD] py-3 md:py-4 px-6 rounded-lg md:rounded-xl font-semibold text-base md:text-lg hover:from-[#026270] hover:to-[#e56546] transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl", children: isLoginLoading ? (_jsxs("div", { className: "flex items-center justify-center space-x-2", children: [_jsx("div", { className: "w-4 h-4 md:w-5 md:h-5 border-2 border-[#E9E6DD] border-t-transparent rounded-full animate-spin" }), _jsx("span", { children: "Signing In..." })] })) : ('Sign In') }), _jsxs("div", { className: "relative py-4", children: [_jsx("div", { className: "absolute inset-0 flex items-center", children: _jsx("div", { className: "w-full border-t border-[#445048]/20" }) }), _jsx("div", { className: "relative flex justify-center text-sm", children: _jsx("span", { className: "px-4 bg-[#E9E6DD] text-[#445048] text-xs md:text-sm", children: "Or continue with" }) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3 md:gap-4", children: [_jsxs("button", { type: "button", className: "w-full bg-white border border-[#445048]/20 text-[#001524] py-2.5 md:py-3 px-4 rounded-lg md:rounded-xl font-medium hover:border-[#027480] hover:text-[#027480] transition-all duration-200 flex items-center justify-center space-x-2 text-sm md:text-base shadow-sm", children: [_jsx("span", { className: "text-blue-500", children: "\uD83D\uDD35" }), _jsx("span", { children: "Google" })] }), _jsxs("button", { type: "button", className: "w-full bg-white border border-[#445048]/20 text-[#001524] py-2.5 md:py-3 px-4 rounded-lg md:rounded-xl font-medium hover:border-[#027480] hover:text-[#027480] transition-all duration-200 flex items-center justify-center space-x-2 text-sm md:text-base shadow-sm", children: [_jsx("span", { className: "text-blue-700", children: "\uD83D\uDCD8" }), _jsx("span", { children: "Facebook" })] })] }), _jsx("div", { className: "text-center pt-4", children: _jsxs("p", { className: "text-[#445048] text-sm md:text-base", children: ["Don't have an account?", ' ', _jsx(Link, { to: "/register", className: "text-[#027480] hover:text-[#F57251] font-semibold transition-colors duration-200", children: "Create one here" })] }) })] })] })) : (
                                /* Password Reset Flow - Single Step */
                                _jsxs("div", { children: [_jsxs("div", { className: "mb-6 md:mb-8", children: [_jsxs("button", { onClick: () => {
                                                        setForgotPassword(false);
                                                        setResetEmail('');
                                                        setResetOTP('');
                                                        setNewPassword('');
                                                        setConfirmPassword('');
                                                    }, className: "flex items-center text-[#027480] hover:text-[#F57251] mb-4 md:mb-6 transition-colors text-sm md:text-base", children: [_jsx(ChevronLeft, { size: 18, className: "mr-2" }), "Back to login"] }), _jsx("h2", { className: "text-2xl md:text-3xl font-bold text-[#001524] mb-2", children: "Reset Your Password" }), _jsx("p", { className: "text-[#445048] text-sm md:text-base", children: "Enter your email to receive a reset OTP, then set a new password" })] }), _jsxs("div", { className: "space-y-4 md:space-y-6", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "resetEmail", className: "block text-sm font-medium text-[#001524] mb-2", children: "Email Address" }), _jsxs("div", { className: "relative", children: [_jsx(Mail, { className: "absolute left-3 md:left-4 top-3 md:top-3.5 w-4 h-4 md:w-5 md:h-5 text-[#445048]" }), _jsx("input", { id: "resetEmail", type: "email", value: resetEmail, onChange: (e) => setResetEmail(e.target.value), className: "w-full pl-10 md:pl-12 pr-4 py-3 bg-white border border-[#445048]/30 rounded-lg md:rounded-xl text-[#001524] placeholder-[#C4AD9D] text-sm md:text-base focus:outline-none focus:border-[#027480] focus:ring-2 focus:ring-[#027480]/20 transition-all duration-200", placeholder: "Enter your registered email" })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "resetOTP", className: "block text-sm font-medium text-[#001524] mb-2", children: "OTP (Sent to your email)" }), _jsx("input", { id: "resetOTP", type: "text", value: resetOTP, onChange: (e) => setResetOTP(e.target.value.replace(/\D/g, '').slice(0, 6)), className: "w-full px-4 py-3 bg-white border border-[#445048]/30 rounded-lg md:rounded-xl text-[#001524] text-center text-lg md:text-xl tracking-widest focus:outline-none focus:border-[#027480] focus:ring-2 focus:ring-[#027480]/20 transition-all duration-200", placeholder: "Enter 6-digit OTP", maxLength: 6 })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "newPassword", className: "block text-sm font-medium text-[#001524] mb-2", children: "New Password" }), _jsxs("div", { className: "relative", children: [_jsx(Lock, { className: "absolute left-3 md:left-4 top-3 md:top-3.5 w-4 h-4 md:w-5 md:h-5 text-[#445048]" }), _jsx("input", { id: "newPassword", type: showPassword ? "text" : "password", value: newPassword, onChange: (e) => setNewPassword(e.target.value), className: "w-full pl-10 md:pl-12 pr-10 md:pr-12 py-3 bg-white border border-[#445048]/30 rounded-lg md:rounded-xl text-[#001524] placeholder-[#C4AD9D] text-sm md:text-base focus:outline-none focus:border-[#027480] focus:ring-2 focus:ring-[#027480]/20 transition-all duration-200", placeholder: "Enter new password" }), _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute right-3 md:right-4 top-3 md:top-3.5 text-[#445048] hover:text-[#027480]", children: showPassword ? _jsx(EyeOff, { size: 18, className: "md:w-5 md:h-5" }) : _jsx(Eye, { size: 18, className: "md:w-5 md:h-5" }) })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "confirmPassword", className: "block text-sm font-medium text-[#001524] mb-2", children: "Confirm Password" }), _jsxs("div", { className: "relative", children: [_jsx(Lock, { className: "absolute left-3 md:left-4 top-3 md:top-3.5 w-4 h-4 md:w-5 md:h-5 text-[#445048]" }), _jsx("input", { id: "confirmPassword", type: showPassword ? "text" : "password", value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value), className: "w-full pl-10 md:pl-12 pr-10 md:pr-12 py-3 bg-white border border-[#445048]/30 rounded-lg md:rounded-xl text-[#001524] placeholder-[#C4AD9D] text-sm md:text-base focus:outline-none focus:border-[#027480] focus:ring-2 focus:ring-[#027480]/20 transition-all duration-200", placeholder: "Confirm new password" })] })] }), _jsxs("div", { className: "space-y-3 md:space-y-4", children: [_jsx("button", { onClick: handleForgotPassword, disabled: !resetEmail || isForgotPasswordLoading, className: "w-full bg-gradient-to-r from-[#027480] to-[#F57251] text-[#E9E6DD] py-3 px-6 rounded-lg md:rounded-xl font-semibold text-sm md:text-base hover:from-[#026270] hover:to-[#e56546] transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none", children: isForgotPasswordLoading ? (_jsxs("div", { className: "flex items-center justify-center space-x-2", children: [_jsx("div", { className: "w-4 h-4 md:w-5 md:h-5 border-2 border-[#E9E6DD] border-t-transparent rounded-full animate-spin" }), _jsx("span", { children: "Sending OTP..." })] })) : ('Send Reset OTP') }), _jsx("button", { onClick: handleResetPassword, disabled: !resetOTP || !newPassword || !confirmPassword || newPassword !== confirmPassword || isResetPasswordLoading, className: "w-full bg-gradient-to-r from-[#F57251] to-[#027480] text-[#E9E6DD] py-3 px-6 rounded-lg md:rounded-xl font-semibold text-sm md:text-base hover:from-[#e56546] hover:to-[#026270] transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none", children: isResetPasswordLoading ? (_jsxs("div", { className: "flex items-center justify-center space-x-2", children: [_jsx("div", { className: "w-4 h-4 md:w-5 md:h-5 border-2 border-[#E9E6DD] border-t-transparent rounded-full animate-spin" }), _jsx("span", { children: "Resetting Password..." })] })) : ('Reset Password') })] }), _jsx("div", { className: "hidden md:block mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl", children: _jsxs("div", { className: "flex items-start space-x-3", children: [_jsx(Shield, { className: "w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-blue-800 font-medium", children: "Reset Instructions" }), _jsxs("ol", { className: "text-xs text-blue-600 mt-1 list-decimal pl-4 space-y-1", children: [_jsx("li", { children: "Enter your email address" }), _jsx("li", { children: "Click \"Send Reset OTP\" to receive a 6-digit code" }), _jsx("li", { children: "Check your email for the OTP and enter it above" }), _jsx("li", { children: "Set your new password and confirm it" }), _jsx("li", { children: "Click \"Reset Password\" to complete" })] })] })] }) })] })] })), _jsxs("div", { className: "hidden lg:block mt-auto pt-8 border-t border-[#445048]/20", children: [_jsxs(Link, { to: "/", className: "text-[#027480] hover:text-[#F57251] transition-colors duration-200 flex items-center justify-center space-x-2 text-sm", children: [_jsx("span", { children: "\uD83C\uDFE1" }), _jsx("span", { children: "Back to Homepage" })] }), _jsxs("div", { className: "flex items-center justify-center space-x-2 text-[#445048] text-xs mt-2", children: [_jsx("span", { children: "\uD83D\uDD12" }), _jsx("span", { children: "256-bit SSL encryption \u2022 ISO 27001 certified" })] })] })] })] })] }) }));
};
export default Login;
