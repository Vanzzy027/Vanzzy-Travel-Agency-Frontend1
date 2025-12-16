import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// import React from "react";
// import { useForm, type SubmitHandler } from "react-hook-form";
// import { Link, useNavigate } from "react-router-dom";
// import { toast } from "sonner";
// import { useRegisterMutation } from "../features/api/AuthAPI";
// type RegisterFormValues = {
//   first_name: string;
//   last_name: string;
//   email: string;
//   contact_phone: string;
//   national_id: string;
//   address?: string;
//   password: string;
//   confirmPassword: string;
//   terms: boolean;
// };
// const Register: React.FC = () => {
//   const navigate = useNavigate();
//   const [registerUser, { isLoading }] = useRegisterMutation();
//   const {
//     register,
//     handleSubmit,
//     watch,
//     formState: { errors, isSubmitting },
//     setError,
//   } = useForm<RegisterFormValues>({
//     defaultValues: {
//       first_name: "",
//       last_name: "",
//       email: "",
//       contact_phone: "",
//       national_id: "",
//       address: "",
//       password: "",
//       confirmPassword: "",
//     },
//   });
//   const passwordValue = watch("password");
//   const normalizePhone = (phoneRaw: string) => {
//     let phone = phoneRaw.replace(/\s|-/g, ""); // remove spaces/dashes
//     // Auto-format to +254XXXXXXXXX
//     if (phone.startsWith("0")) {
//       phone = "+254" + phone.slice(1);
//     } else if (/^7\d{8}$/.test(phone)) {
//       phone = "+254" + phone;
//     }
//     return phone;
//   };
//   const onSubmit: SubmitHandler<RegisterFormValues> = async (data) => {
//     try {
//       // Basic client-side validation already handled by react-hook-form rules below.
//       // Normalize phone
//       const formattedPhone = normalizePhone(data.contact_phone || "");
//       const payload = {
//         first_name: data.first_name.trim(),
//         last_name: data.last_name.trim(),
//         email: data.email.trim(),
//         contact_phone: formattedPhone,
//         national_id: data.national_id.trim(),
//         address: data.address?.trim() || null,
//         password: data.password,
//         // role intentionally omitted - default 'user' on backend
//       };
//       const res = await registerUser(payload).unwrap();
//       toast.success("Account created successfully 🚗✨");
//       navigate("/login");
//     } catch (err: any) {
//       console.error("Registration error:", err);
//       // If server returned validation errors or message, show them
//       const serverMessage =
//         err?.data?.message || err?.data?.error || err?.error || "Registration failed";
//       // If server includes field-specific errors, set them in the form
//       if (err?.data?.errors && typeof err.data.errors === "object") {
//         Object.entries(err.data.errors).forEach(([field, message]: any) => {
//           setError(field as keyof RegisterFormValues, { type: "server", message: String(message) });
//         });
//       } else {
//         toast.error(String(serverMessage));
//       }
//     }
//   };
//   return (
//     <div className="min-h-screen bg-[#E9E6DD] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-2xl w-full space-y-8 bg-[#001524] rounded-3xl shadow-2xl overflow-hidden">
//         {/* Header Section */}
//         <div className="bg-gradient-to-r from-[#027480] to-[#F57251] py-8 px-8 text-center">
//           <div className="flex items-center justify-center space-x-4 mb-4">
//             <div className="w-16 h-16 rounded-full bg-[#001524] flex items-center justify-center">
//               <span className="text-[#E9E6DD] font-bold text-2xl">V</span>
//             </div>
//             <div>
//               <h2 className="text-4xl font-bold text-[#E9E6DD]">Join VansKE</h2>
//               <p className="text-[#E9E6DD]/80 mt-2">Create your account to start renting luxury vehicles</p>
//             </div>
//           </div>
//         </div>
//         {/* Form Section */}
//         <div className="p-8">
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//             {/* Name Row */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label htmlFor="first_name" className="block text-sm font-medium text-[#E9E6DD] mb-2">
//                   First Name *
//                 </label>
//                 <input
//                   id="first_name"
//                   {...register("first_name", { required: "First name is required" })}
//                   className={`w-full px-4 py-3 bg-[#445048] border-2 rounded-xl text-[#E9E6DD] placeholder-[#C4AD9D] focus:outline-none focus:ring-2 focus:ring-[#027480] transition-all duration-200 ${
//                     errors.first_name ? "border-[#F57251]" : "border-transparent"
//                   }`}
//                   placeholder="Enter your first name"
//                 />
//                 {errors.first_name && <p className="mt-1 text-sm text-[#F57251]">{errors.first_name.message}</p>}
//               </div>
//               <div>
//                 <label htmlFor="last_name" className="block text-sm font-medium text-[#E9E6DD] mb-2">
//                   Last Name *
//                 </label>
//                 <input
//                   id="last_name"
//                   {...register("last_name", { required: "Last name is required" })}
//                   className={`w-full px-4 py-3 bg-[#445048] border-2 rounded-xl text-[#E9E6DD] placeholder-[#C4AD9D] focus:outline-none focus:ring-2 focus:ring-[#027480] transition-all duration-200 ${
//                     errors.last_name ? "border-[#F57251]" : "border-transparent"
//                   }`}
//                   placeholder="Enter your last name"
//                 />
//                 {errors.last_name && <p className="mt-1 text-sm text-[#F57251]">{errors.last_name.message}</p>}
//               </div>
//             </div>
//             {/* Email & Phone Row */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label htmlFor="email" className="block text-sm font-medium text-[#E9E6DD] mb-2">
//                   Email Address *
//                 </label>
//                 <input
//                   id="email"
//                   type="email"
//                   {...register("email", {
//                     required: "Email is required",
//                     pattern: { value: /^\S+@\S+$/i, message: "Enter a valid email address" },
//                   })}
//                   className={`w-full px-4 py-3 bg-[#445048] border-2 rounded-xl text-[#E9E6DD] placeholder-[#C4AD9D] focus:outline-none focus:ring-2 focus:ring-[#027480] transition-all duration-200 ${
//                     errors.email ? "border-[#F57251]" : "border-transparent"
//                   }`}
//                   placeholder="your.email@example.com"
//                 />
//                 {errors.email && <p className="mt-1 text-sm text-[#F57251]">{errors.email.message}</p>}
//               </div>
//               <div>
//                 <label htmlFor="contact_phone" className="block text-sm font-medium text-[#E9E6DD] mb-2">
//                   Phone Number *
//                 </label>
//                 <input
//                   id="contact_phone"
//                   type="tel"
//                   {...register("contact_phone", {
//                     required: "Phone number is required",
//                     validate: (val) => {
//                       const stripped = val.replace(/\s|-/g, "");
//                       if (!/^\+?\d{7,15}$/.test(stripped)) return "Please enter a valid phone number";
//                       return true;
//                     },
//                   })}
//                   className={`w-full px-4 py-3 bg-[#445048] border-2 rounded-xl text-[#E9E6DD] placeholder-[#C4AD9D] focus:outline-none focus:ring-2 focus:ring-[#027480] transition-all duration-200 ${
//                     errors.contact_phone ? "border-[#F57251]" : "border-transparent"
//                   }`}
//                   placeholder="+254 700 123 456"
//                 />
//                 {errors.contact_phone && <p className="mt-1 text-sm text-[#F57251]">{errors.contact_phone.message}</p>}
//               </div>
//             </div>
//             {/* National ID Row */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label htmlFor="national_id" className="block text-sm font-medium text-[#E9E6DD] mb-2">
//                   National ID *
//                 </label>
//                 <input
//                   id="national_id"
//                   {...register("national_id", { required: "National ID is required" })}
//                   className={`w-full px-4 py-3 bg-[#445048] border-2 rounded-xl text-[#E9E6DD] placeholder-[#C4AD9D] focus:outline-none focus:ring-2 focus:ring-[#027480] transition-all duration-200 ${
//                     errors.national_id ? "border-[#F57251]" : "border-transparent"
//                   }`}
//                   placeholder="Enter your national ID number"
//                 />
//                 {errors.national_id && <p className="mt-1 text-sm text-[#F57251]">{errors.national_id.message}</p>}
//               </div>
//               {/* role selection intentionally removed; role will default to 'user' on backend */}
//               <div>
//                 <label htmlFor="address" className="block text-sm font-medium text-[#E9E6DD] mb-2">
//                   Address (Optional)
//                 </label>
//                 <input
//                   id="address"
//                   {...register("address")}
//                   className="w-full px-4 py-3 bg-[#445048] border-2 border-transparent rounded-xl text-[#E9E6DD] focus:outline-none focus:ring-2 focus:ring-[#027480] transition-all duration-200"
//                   placeholder="Enter your full address"
//                 />
//               </div>
//             </div>
//             {/* Password Row */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label htmlFor="password" className="block text-sm font-medium text-[#E9E6DD] mb-2">
//                   Password *
//                 </label>
//                 <input
//                   id="password"
//                   type="password"
//                   {...register("password", {
//                     required: "Password is required",
//                     minLength: { value: 6, message: "Password must be at least 6 characters" },
//                   })}
//                   className={`w-full px-4 py-3 bg-[#445048] border-2 rounded-xl text-[#E9E6DD] placeholder-[#C4AD9D] focus:outline-none focus:ring-2 focus:ring-[#027480] transition-all duration-200 ${
//                     errors.password ? "border-[#F57251]" : "border-transparent"
//                   }`}
//                   placeholder="Create a strong password"
//                 />
//                 {errors.password && <p className="mt-1 text-sm text-[#F57251]">{errors.password.message}</p>}
//               </div>
//               <div>
//                 <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#E9E6DD] mb-2">
//                   Confirm Password *
//                 </label>
//                 <input
//                   id="confirmPassword"
//                   type="password"
//                   {...register("confirmPassword", {
//                     required: "Please confirm your password",
//                     validate: (val) => val === passwordValue || "Passwords do not match",
//                   })}
//                   className={`w-full px-4 py-3 bg-[#445048] border-2 rounded-xl text-[#E9E6DD] placeholder-[#C4AD9D] focus:outline-none focus:ring-2 focus:ring-[#027480] transition-all duration-200 ${
//                     errors.confirmPassword ? "border-[#F57251]" : "border-transparent"
//                   }`}
//                   placeholder="Confirm your password"
//                 />
//                 {errors.confirmPassword && <p className="mt-1 text-sm text-[#F57251]">{errors.confirmPassword.message}</p>}
//               </div>
//             </div>
//             {/* Terms and Conditions */}
//             <div className="flex items-center space-x-3">
//               <input
//                 id="terms"
//                 {...register("terms", { required: true } as any)}
//                 type="checkbox"
//                 className="w-4 h-4 text-[#027480] bg-[#445048] border-[#445048] rounded focus:ring-[#027480] focus:ring-2"
//               />
//               <label htmlFor="terms" className="text-sm text-[#C4AD9D]">
//                 I agree to the{" "}
//                 <a href="https://business.gov.nl/regulation/general-terms-conditions/?gad_source=1&gad_campaignid=9542970719&gbraid=0AAAAADAUIc9ijFy0Rks_nhRyQdBzkBWd0" className="text-[#027480] hover:text-[#F57251] transition-colors duration-200">
//                   Terms and Conditions
//                 </a>{" "}
//                 and{" "}
//                 <a href="#" className="text-[#027480] hover:text-[#F57251] transition-colors duration-200">
//                   Privacy Policy
//                 </a>
//               </label>
//             </div>
//             {/* Submit error box - server side errors */}
//             {/* We show any server submit error as toast above but also keep a regular error panel */}
//             <div>
//               {/* No-op container kept for parity with your previous markup */}
//             </div>
//             <button
//               type="submit"
//               disabled={isSubmitting || isLoading}
//               className="w-full bg-gradient-to-r from-[#027480] to-[#F57251] text-[#E9E6DD] py-4 px-6 rounded-xl font-semibold text-lg hover:from-[#026270] hover:to-[#e56546] transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
//             >
//               {isSubmitting || isLoading ? (
//                 <div className="flex items-center justify-center space-x-2">
//                   <div className="w-5 h-5 border-2 border-[#E9E6DD] border-t-transparent rounded-full animate-spin"></div>
//                   <span>Creating Account...</span>
//                 </div>
//               ) : (
//                 "Create Account"
//               )}
//             </button>
//             {/* Login Link */}
//             <div className="text-center">
//               <p className="text-[#C4AD9D]">
//                 Already have an account?{" "}
//                 <Link to="/login" className="text-[#027480] hover:text-[#F57251] font-semibold transition-colors duration-200">
//                   Sign in here
//                 </Link>
//               </p>
//             </div>
//           </form>
//         </div>
//         {/* Security Badge */}
//         <div className="bg-[#445048] py-4 px-8 text-center">
//           <div className="flex items-center justify-center space-x-2 text-[#C4AD9D] text-sm">
//             <span>🔒</span>
//             <span>Your information is secured with 256-bit SSL encryption</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default Register;
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useRegisterMutation } from "../features/api/AuthAPI";
import { Car, Shield, Key, Mail, Lock, User, Phone, MapPin, Eye, EyeOff } from "lucide-react";
const Register = () => {
    const navigate = useNavigate();
    const [registerUser, { isLoading }] = useRegisterMutation();
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, watch, formState: { errors, isSubmitting }, setError, } = useForm({
        defaultValues: {
            first_name: "",
            last_name: "",
            email: "",
            contact_phone: "",
            national_id: "",
            address: "",
            password: "",
            confirmPassword: "",
            terms: false,
        },
    });
    const passwordValue = watch("password");
    const normalizePhone = (phoneRaw) => {
        let phone = phoneRaw.replace(/\s|-/g, ""); // remove spaces/dashes
        // Auto-format to +254XXXXXXXXX
        if (phone.startsWith("0")) {
            phone = "+254" + phone.slice(1);
        }
        else if (/^7\d{8}$/.test(phone)) {
            phone = "+254" + phone;
        }
        return phone;
    };
    const onSubmit = async (data) => {
        try {
            // Basic client-side validation already handled by react-hook-form rules below.
            // Normalize phone
            const formattedPhone = normalizePhone(data.contact_phone || "");
            const payload = {
                first_name: data.first_name.trim(),
                last_name: data.last_name.trim(),
                email: data.email.trim(),
                contact_phone: formattedPhone,
                national_id: data.national_id.trim(),
                address: data.address?.trim() || null,
                password: data.password,
                // role intentionally omitted - default 'user' on backend
            };
            const res = await registerUser(payload).unwrap();
            toast.success("Account created successfully 🚗✨");
            navigate("/login");
        }
        catch (err) {
            console.error("Registration error:", err);
            // If server returned validation errors or message, show them
            const serverMessage = err?.data?.message || err?.data?.error || err?.error || "Registration failed";
            // If server includes field-specific errors, set them in the form
            if (err?.data?.errors && typeof err.data.errors === "object") {
                Object.entries(err.data.errors).forEach(([field, message]) => {
                    setError(field, { type: "server", message: String(message) });
                });
            }
            else {
                toast.error(String(serverMessage));
            }
        }
    };
    const VehicleSVG = () => (_jsxs("svg", { viewBox: "0 0 400 300", className: "w-full h-full", children: [_jsx("path", { d: "M80,180 L320,180 Q340,180 340,160 L340,140 Q340,120 320,120 L280,120 L260,80 L140,80 L120,120 L80,120 Q60,120 60,140 L60,160 Q60,180 80,180", fill: "#027480", stroke: "#001524", strokeWidth: "2" }), _jsx("path", { d: "M150,120 L250,120 L230,90 L170,90 Z", fill: "#E9E6DD", stroke: "#001524", strokeWidth: "1" }), _jsx("circle", { cx: "120", cy: "180", r: "20", fill: "#001524" }), _jsx("circle", { cx: "120", cy: "180", r: "10", fill: "#E9E6DD" }), _jsx("circle", { cx: "280", cy: "180", r: "20", fill: "#001524" }), _jsx("circle", { cx: "280", cy: "180", r: "10", fill: "#E9E6DD" }), _jsx("ellipse", { cx: "340", cy: "130", rx: "5", ry: "8", fill: "#F57251" }), _jsx("rect", { x: "320", y: "130", width: "15", height: "20", fill: "#445048", rx: "2" }), _jsx("text", { x: "200", y: "220", textAnchor: "middle", fill: "#E9E6DD", fontSize: "24", fontWeight: "bold", children: "VansKE" })] }));
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-[#001524] via-[#001524] to-[#027480] flex items-center justify-center p-4", children: _jsxs("div", { className: "w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 bg-[#E9E6DD] rounded-3xl shadow-2xl overflow-hidden min-h-[80vh]", children: [_jsxs("div", { className: "bg-gradient-to-br from-[#001524] to-[#027480] p-12 flex flex-col justify-between text-[#E9E6DD] relative overflow-hidden", children: [_jsx("div", { className: "absolute top-0 right-0 w-64 h-64 bg-[#F57251]/10 rounded-full -translate-y-32 translate-x-32" }), _jsx("div", { className: "absolute bottom-0 left-0 w-48 h-48 bg-[#D6CC99]/10 rounded-full -translate-x-24 translate-y-24" }), _jsxs("div", { className: "relative z-10", children: [_jsxs("div", { className: "flex items-center space-x-4 mb-8", children: [_jsx("div", { className: "w-16 h-16 rounded-full bg-[#E9E6DD] flex items-center justify-center", children: _jsx("span", { className: "text-[#001524] font-bold text-3xl", children: "V" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-4xl font-bold", children: "Join VansKE" }), _jsx("p", { className: "text-[#C4AD9D] text-lg", children: "Create your account to rent luxury vehicles" })] })] }), _jsx("div", { className: "mt-8 mb-8 h-48 flex items-center justify-center", children: _jsx("div", { className: "w-4/5", children: _jsx(VehicleSVG, {}) }) }), _jsxs("div", { className: "mt-8", children: [_jsxs("div", { className: "flex items-center space-x-3 mb-6", children: [_jsx(Shield, { className: "w-6 h-6 text-[#F57251]" }), _jsx("h3", { className: "text-xl font-semibold", children: "Secure Account Creation" })] }), _jsxs("div", { className: "flex items-center space-x-3 mb-6", children: [_jsx(Car, { className: "w-6 h-6 text-[#F57251]" }), _jsx("h3", { className: "text-xl font-semibold", children: "Access Premium Fleet" })] }), _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx(Key, { className: "w-6 h-6 text-[#F57251]" }), _jsx("h3", { className: "text-xl font-semibold", children: "Instant Booking Access" })] })] })] }), _jsx("div", { className: "relative z-10 mt-auto pt-8 border-t border-[#445048]", children: _jsx("p", { className: "italic text-[#C4AD9D] mb-4", children: "\"Signing up with VansKE was seamless. Now I enjoy premium vehicles at my fingertips!\"" }) })] }), _jsxs("div", { className: "p-12 flex flex-col justify-center", children: [_jsxs("div", { className: "mb-10", children: [_jsx("h2", { className: "text-3xl font-bold text-[#001524] mb-2", children: "Create Your Account" }), _jsx("p", { className: "text-[#445048]", children: "Fill in your details to get started" })] }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "first_name", className: "block text-sm font-medium text-[#001524] mb-2", children: "First Name *" }), _jsxs("div", { className: "relative", children: [_jsx(User, { className: "absolute left-4 top-3.5 w-5 h-5 text-[#445048]" }), _jsx("input", { id: "first_name", ...register("first_name", { required: "First name is required" }), className: `w-full pl-12 pr-4 py-3 bg-white border-2 rounded-xl text-[#001524] placeholder-[#C4AD9D] focus:outline-none focus:border-[#027480] focus:ring-2 focus:ring-[#027480]/20 transition-all duration-200 ${errors.first_name ? "border-[#F57251]" : "border-[#445048]/20"}`, placeholder: "Enter your first name" })] }), errors.first_name && _jsx("p", { className: "mt-2 text-sm text-[#F57251]", children: errors.first_name.message })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "last_name", className: "block text-sm font-medium text-[#001524] mb-2", children: "Last Name *" }), _jsxs("div", { className: "relative", children: [_jsx(User, { className: "absolute left-4 top-3.5 w-5 h-5 text-[#445048]" }), _jsx("input", { id: "last_name", ...register("last_name", { required: "Last name is required" }), className: `w-full pl-12 pr-4 py-3 bg-white border-2 rounded-xl text-[#001524] placeholder-[#C4AD9D] focus:outline-none focus:border-[#027480] focus:ring-2 focus:ring-[#027480]/20 transition-all duration-200 ${errors.last_name ? "border-[#F57251]" : "border-[#445048]/20"}`, placeholder: "Enter your last name" })] }), errors.last_name && _jsx("p", { className: "mt-2 text-sm text-[#F57251]", children: errors.last_name.message })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-[#001524] mb-2", children: "Email Address *" }), _jsxs("div", { className: "relative", children: [_jsx(Mail, { className: "absolute left-4 top-3.5 w-5 h-5 text-[#445048]" }), _jsx("input", { id: "email", type: "email", ...register("email", {
                                                                required: "Email is required",
                                                                pattern: { value: /^\S+@\S+$/i, message: "Enter a valid email address" },
                                                            }), className: `w-full pl-12 pr-4 py-3 bg-white border-2 rounded-xl text-[#001524] placeholder-[#C4AD9D] focus:outline-none focus:border-[#027480] focus:ring-2 focus:ring-[#027480]/20 transition-all duration-200 ${errors.email ? "border-[#F57251]" : "border-[#445048]/20"}`, placeholder: "your.email@example.com" })] }), errors.email && _jsx("p", { className: "mt-2 text-sm text-[#F57251]", children: errors.email.message })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "contact_phone", className: "block text-sm font-medium text-[#001524] mb-2", children: "Phone Number *" }), _jsxs("div", { className: "relative", children: [_jsx(Phone, { className: "absolute left-4 top-3.5 w-5 h-5 text-[#445048]" }), _jsx("input", { id: "contact_phone", type: "tel", ...register("contact_phone", {
                                                                required: "Phone number is required",
                                                                validate: (val) => {
                                                                    const stripped = val.replace(/\s|-/g, "");
                                                                    if (!/^\+?\d{7,15}$/.test(stripped))
                                                                        return "Please enter a valid phone number";
                                                                    return true;
                                                                },
                                                            }), className: `w-full pl-12 pr-4 py-3 bg-white border-2 rounded-xl text-[#001524] placeholder-[#C4AD9D] focus:outline-none focus:border-[#027480] focus:ring-2 focus:ring-[#027480]/20 transition-all duration-200 ${errors.contact_phone ? "border-[#F57251]" : "border-[#445048]/20"}`, placeholder: "+254 700 123 456" })] }), errors.contact_phone && _jsx("p", { className: "mt-2 text-sm text-[#F57251]", children: errors.contact_phone.message })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "national_id", className: "block text-sm font-medium text-[#001524] mb-2", children: "National ID *" }), _jsx("input", { id: "national_id", ...register("national_id", { required: "National ID is required" }), className: `w-full px-4 py-3 bg-white border-2 rounded-xl text-[#001524] placeholder-[#C4AD9D] focus:outline-none focus:border-[#027480] focus:ring-2 focus:ring-[#027480]/20 transition-all duration-200 ${errors.national_id ? "border-[#F57251]" : "border-[#445048]/20"}`, placeholder: "Enter your national ID number" }), errors.national_id && _jsx("p", { className: "mt-2 text-sm text-[#F57251]", children: errors.national_id.message })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "address", className: "block text-sm font-medium text-[#001524] mb-2", children: "Address (Optional)" }), _jsxs("div", { className: "relative", children: [_jsx(MapPin, { className: "absolute left-4 top-3.5 w-5 h-5 text-[#445048]" }), _jsx("input", { id: "address", ...register("address"), className: "w-full pl-12 pr-4 py-3 bg-white border-2 border-[#445048]/20 rounded-xl text-[#001524] placeholder-[#C4AD9D] focus:outline-none focus:border-[#027480] focus:ring-2 focus:ring-[#027480]/20 transition-all duration-200", placeholder: "Enter your full address" })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "block text-sm font-medium text-[#001524] mb-2", children: "Password *" }), _jsxs("div", { className: "relative", children: [_jsx(Lock, { className: "absolute left-4 top-3.5 w-5 h-5 text-[#445048]" }), _jsx("input", { id: "password", type: showPassword ? "text" : "password", ...register("password", {
                                                                required: "Password is required",
                                                                minLength: { value: 6, message: "Password must be at least 6 characters" },
                                                            }), className: `w-full pl-12 pr-12 py-3 bg-white border-2 rounded-xl text-[#001524] placeholder-[#C4AD9D] focus:outline-none focus:border-[#027480] focus:ring-2 focus:ring-[#027480]/20 transition-all duration-200 ${errors.password ? "border-[#F57251]" : "border-[#445048]/20"}`, placeholder: "Create a strong password" }), _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute right-4 top-3.5 text-[#445048] hover:text-[#027480]", children: showPassword ? _jsx(EyeOff, { size: 20 }) : _jsx(Eye, { size: 20 }) })] }), errors.password && _jsx("p", { className: "mt-2 text-sm text-[#F57251]", children: errors.password.message })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "confirmPassword", className: "block text-sm font-medium text-[#001524] mb-2", children: "Confirm Password *" }), _jsxs("div", { className: "relative", children: [_jsx(Lock, { className: "absolute left-4 top-3.5 w-5 h-5 text-[#445048]" }), _jsx("input", { id: "confirmPassword", type: showPassword ? "text" : "password", ...register("confirmPassword", {
                                                                required: "Please confirm your password",
                                                                validate: (val) => val === passwordValue || "Passwords do not match",
                                                            }), className: `w-full pl-12 pr-4 py-3 bg-white border-2 rounded-xl text-[#001524] placeholder-[#C4AD9D] focus:outline-none focus:border-[#027480] focus:ring-2 focus:ring-[#027480]/20 transition-all duration-200 ${errors.confirmPassword ? "border-[#F57251]" : "border-[#445048]/20"}`, placeholder: "Confirm your password" })] }), errors.confirmPassword && _jsx("p", { className: "mt-2 text-sm text-[#F57251]", children: errors.confirmPassword.message })] })] }), _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("input", { id: "terms", ...register("terms", { required: "You must agree to the terms and conditions" }), type: "checkbox", className: "w-4 h-4 text-[#027480] bg-white border-[#445048]/30 rounded focus:ring-[#027480] focus:ring-2" }), _jsxs("label", { htmlFor: "terms", className: "text-sm text-[#445048]", children: ["I agree to the", " ", _jsx("a", { href: "https://business.gov.nl/regulation/general-terms-conditions/?gad_source=1&gad_campaignid=9542970719&gbraid=0AAAAADAUIc9ijFy0Rks_nhRyQdBzkBWd0", className: "text-[#027480] hover:text-[#F57251] transition-colors duration-200 font-medium", children: "Terms and Conditions" }), " ", "and", " ", _jsx("a", { href: "#", className: "text-[#027480] hover:text-[#F57251] transition-colors duration-200 font-medium", children: "Privacy Policy" })] })] }), errors.terms && _jsx("p", { className: "mt-1 text-sm text-[#F57251]", children: errors.terms.message }), _jsx("button", { type: "submit", disabled: isSubmitting || isLoading, className: "w-full bg-gradient-to-r from-[#027480] to-[#F57251] text-[#E9E6DD] py-4 px-6 rounded-xl font-semibold text-lg hover:from-[#026270] hover:to-[#e56546] transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl", children: isSubmitting || isLoading ? (_jsxs("div", { className: "flex items-center justify-center space-x-2", children: [_jsx("div", { className: "w-5 h-5 border-2 border-[#E9E6DD] border-t-transparent rounded-full animate-spin" }), _jsx("span", { children: "Creating Account..." })] })) : ("Create Account") }), _jsx("div", { className: "text-center pt-4", children: _jsxs("p", { className: "text-[#445048]", children: ["Already have an account?", " ", _jsx(Link, { to: "/login", className: "text-[#027480] hover:text-[#F57251] font-semibold transition-colors duration-200", children: "Sign in here" })] }) })] }), _jsx("div", { className: "mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl", children: _jsxs("div", { className: "flex items-start space-x-3", children: [_jsx(Shield, { className: "w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-blue-800 font-medium", children: "Security Notice" }), _jsx("p", { className: "text-xs text-blue-600 mt-1", children: "Your information is secured with 256-bit SSL encryption. We never store passwords in plain text." })] })] }) }), _jsxs("div", { className: "mt-auto pt-8 border-t border-[#445048]/20", children: [_jsxs(Link, { to: "/", className: "text-[#027480] hover:text-[#F57251] transition-colors duration-200 flex items-center justify-center space-x-2 text-sm", children: [_jsx("span", { children: "\uD83C\uDFE1" }), _jsx("span", { children: "Back to Homepage" })] }), _jsxs("div", { className: "flex items-center justify-center space-x-2 text-[#445048] text-xs mt-2", children: [_jsx("span", { children: "\uD83D\uDD12" }), _jsx("span", { children: "256-bit SSL encryption \u2022 ISO 27001 certified" })] })] })] })] }) }));
};
export default Register;
