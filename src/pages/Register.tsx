
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







import React, { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useRegisterMutation } from "../features/api/AuthAPI";
import { Car, Shield, Key, Mail, Lock, User, Phone, MapPin, Eye, EyeOff } from "lucide-react";

type RegisterFormValues = {
  first_name: string;
  last_name: string;
  email: string;
  contact_phone: string;
  national_id: string;
  address?: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
};

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [registerUser, { isLoading }] = useRegisterMutation();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterFormValues>({
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

  const normalizePhone = (phoneRaw: string) => {
    let phone = phoneRaw.replace(/\s|-/g, ""); // remove spaces/dashes
    // Auto-format to +254XXXXXXXXX
    if (phone.startsWith("0")) {
      phone = "+254" + phone.slice(1);
    } else if (/^7\d{8}$/.test(phone)) {
      phone = "+254" + phone;
    }
    return phone;
  };

  const onSubmit: SubmitHandler<RegisterFormValues> = async (data) => {
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
    } catch (err: any) {
      console.error("Registration error:", err);
      // If server returned validation errors or message, show them
      const serverMessage =
        err?.data?.message || err?.data?.error || err?.error || "Registration failed";
      // If server includes field-specific errors, set them in the form
      if (err?.data?.errors && typeof err.data.errors === "object") {
        Object.entries(err.data.errors).forEach(([field, message]: any) => {
          setError(field as keyof RegisterFormValues, { type: "server", message: String(message) });
        });
      } else {
        toast.error(String(serverMessage));
      }
    }
  };

  const VehicleSVG = () => (
    <svg viewBox="0 0 400 300" className="w-full h-full">
      {/* Car Body */}
      <path 
        d="M80,180 L320,180 Q340,180 340,160 L340,140 Q340,120 320,120 L280,120 L260,80 L140,80 L120,120 L80,120 Q60,120 60,140 L60,160 Q60,180 80,180" 
        fill="#027480" 
        stroke="#001524" 
        strokeWidth="2"
      />
      
      {/* Windows */}
      <path 
        d="M150,120 L250,120 L230,90 L170,90 Z" 
        fill="#E9E6DD" 
        stroke="#001524" 
        strokeWidth="1"
      />
      
      {/* Wheels */}
      <circle cx="120" cy="180" r="20" fill="#001524" />
      <circle cx="120" cy="180" r="10" fill="#E9E6DD" />
      <circle cx="280" cy="180" r="20" fill="#001524" />
      <circle cx="280" cy="180" r="10" fill="#E9E6DD" />
      
      {/* Headlights */}
      <ellipse cx="340" cy="130" rx="5" ry="8" fill="#F57251" />
      
      {/* Grill */}
      <rect x="320" y="130" width="15" height="20" fill="#445048" rx="2" />
      
      {/* Logo */}
      <text x="200" y="220" textAnchor="middle" fill="#E9E6DD" fontSize="24" fontWeight="bold">
        VansKE
      </text>
    </svg>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001524] via-[#001524] to-[#027480] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 bg-[#E9E6DD] rounded-3xl shadow-2xl overflow-hidden min-h-[80vh]">
        
        {/* Left Side - Brand & Vehicle Showcase */}
        <div className="bg-gradient-to-br from-[#001524] to-[#027480] p-12 flex flex-col justify-between text-[#E9E6DD] relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#F57251]/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#D6CC99]/10 rounded-full -translate-x-24 translate-y-24"></div>
          
          {/* Brand */}
          <div className="relative z-10">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-16 h-16 rounded-full bg-[#E9E6DD] flex items-center justify-center">
                <span className="text-[#001524] font-bold text-3xl">V</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold">Join VansKE</h1>
                <p className="text-[#C4AD9D] text-lg">Create your account to rent luxury vehicles</p>
              </div>
            </div>
            
            {/* Vehicle SVG */}
            <div className="mt-8 mb-8 h-48 flex items-center justify-center">
              <div className="w-4/5">
                <VehicleSVG />
              </div>
            </div>
            
            <div className="mt-8">
              <div className="flex items-center space-x-3 mb-6">
                <Shield className="w-6 h-6 text-[#F57251]" />
                <h3 className="text-xl font-semibold">Secure Account Creation</h3>
              </div>
              <div className="flex items-center space-x-3 mb-6">
                <Car className="w-6 h-6 text-[#F57251]" />
                <h3 className="text-xl font-semibold">Access Premium Fleet</h3>
              </div>
              <div className="flex items-center space-x-3">
                <Key className="w-6 h-6 text-[#F57251]" />
                <h3 className="text-xl font-semibold">Instant Booking Access</h3>
              </div>
            </div>
          </div>

          {/* Testimonial */}
          <div className="relative z-10 mt-auto pt-8 border-t border-[#445048]">
            <p className="italic text-[#C4AD9D] mb-4">
              "Signing up with VansKE was seamless. Now I enjoy premium vehicles at my fingertips!"
            </p>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="p-12 flex flex-col justify-center">
          {/* Registration Form Header */}
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-[#001524] mb-2">Create Your Account</h2>
            <p className="text-[#445048]">Fill in your details to get started</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-[#001524] mb-2">
                  First Name *
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 w-5 h-5 text-[#445048]" />
                  <input
                    id="first_name"
                    {...register("first_name", { required: "First name is required" })}
                    className={`w-full pl-12 pr-4 py-3 bg-white border-2 rounded-xl text-[#001524] placeholder-[#C4AD9D] focus:outline-none focus:border-[#027480] focus:ring-2 focus:ring-[#027480]/20 transition-all duration-200 ${
                      errors.first_name ? "border-[#F57251]" : "border-[#445048]/20"
                    }`}
                    placeholder="Enter your first name"
                  />
                </div>
                {errors.first_name && <p className="mt-2 text-sm text-[#F57251]">{errors.first_name.message}</p>}
              </div>

              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-[#001524] mb-2">
                  Last Name *
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 w-5 h-5 text-[#445048]" />
                  <input
                    id="last_name"
                    {...register("last_name", { required: "Last name is required" })}
                    className={`w-full pl-12 pr-4 py-3 bg-white border-2 rounded-xl text-[#001524] placeholder-[#C4AD9D] focus:outline-none focus:border-[#027480] focus:ring-2 focus:ring-[#027480]/20 transition-all duration-200 ${
                      errors.last_name ? "border-[#F57251]" : "border-[#445048]/20"
                    }`}
                    placeholder="Enter your last name"
                  />
                </div>
                {errors.last_name && <p className="mt-2 text-sm text-[#F57251]">{errors.last_name.message}</p>}
              </div>
            </div>

            {/* Email & Phone Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#001524] mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 w-5 h-5 text-[#445048]" />
                  <input
                    id="email"
                    type="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: { value: /^\S+@\S+$/i, message: "Enter a valid email address" },
                    })}
                    className={`w-full pl-12 pr-4 py-3 bg-white border-2 rounded-xl text-[#001524] placeholder-[#C4AD9D] focus:outline-none focus:border-[#027480] focus:ring-2 focus:ring-[#027480]/20 transition-all duration-200 ${
                      errors.email ? "border-[#F57251]" : "border-[#445048]/20"
                    }`}
                    placeholder="your.email@example.com"
                  />
                </div>
                {errors.email && <p className="mt-2 text-sm text-[#F57251]">{errors.email.message}</p>}
              </div>

              <div>
                <label htmlFor="contact_phone" className="block text-sm font-medium text-[#001524] mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-3.5 w-5 h-5 text-[#445048]" />
                  <input
                    id="contact_phone"
                    type="tel"
                    {...register("contact_phone", {
                      required: "Phone number is required",
                      validate: (val) => {
                        const stripped = val.replace(/\s|-/g, "");
                        if (!/^\+?\d{7,15}$/.test(stripped)) return "Please enter a valid phone number";
                        return true;
                      },
                    })}
                    className={`w-full pl-12 pr-4 py-3 bg-white border-2 rounded-xl text-[#001524] placeholder-[#C4AD9D] focus:outline-none focus:border-[#027480] focus:ring-2 focus:ring-[#027480]/20 transition-all duration-200 ${
                      errors.contact_phone ? "border-[#F57251]" : "border-[#445048]/20"
                    }`}
                    placeholder="+254 700 123 456"
                  />
                </div>
                {errors.contact_phone && <p className="mt-2 text-sm text-[#F57251]">{errors.contact_phone.message}</p>}
              </div>
            </div>

            {/* National ID & Address Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="national_id" className="block text-sm font-medium text-[#001524] mb-2">
                  National ID *
                </label>
                <input
                  id="national_id"
                  {...register("national_id", { required: "National ID is required" })}
                  className={`w-full px-4 py-3 bg-white border-2 rounded-xl text-[#001524] placeholder-[#C4AD9D] focus:outline-none focus:border-[#027480] focus:ring-2 focus:ring-[#027480]/20 transition-all duration-200 ${
                    errors.national_id ? "border-[#F57251]" : "border-[#445048]/20"
                  }`}
                  placeholder="Enter your national ID number"
                />
                {errors.national_id && <p className="mt-2 text-sm text-[#F57251]">{errors.national_id.message}</p>}
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-[#001524] mb-2">
                  Address (Optional)
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-[#445048]" />
                  <input
                    id="address"
                    {...register("address")}
                    className="w-full pl-12 pr-4 py-3 bg-white border-2 border-[#445048]/20 rounded-xl text-[#001524] placeholder-[#C4AD9D] focus:outline-none focus:border-[#027480] focus:ring-2 focus:ring-[#027480]/20 transition-all duration-200"
                    placeholder="Enter your full address"
                  />
                </div>
              </div>
            </div>

            {/* Password Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#001524] mb-2">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-5 h-5 text-[#445048]" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register("password", {
                      required: "Password is required",
                      minLength: { value: 6, message: "Password must be at least 6 characters" },
                    })}
                    className={`w-full pl-12 pr-12 py-3 bg-white border-2 rounded-xl text-[#001524] placeholder-[#C4AD9D] focus:outline-none focus:border-[#027480] focus:ring-2 focus:ring-[#027480]/20 transition-all duration-200 ${
                      errors.password ? "border-[#F57251]" : "border-[#445048]/20"
                    }`}
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-[#445048] hover:text-[#027480]"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && <p className="mt-2 text-sm text-[#F57251]">{errors.password.message}</p>}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#001524] mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-5 h-5 text-[#445048]" />
                  <input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (val) => val === passwordValue || "Passwords do not match",
                    })}
                    className={`w-full pl-12 pr-4 py-3 bg-white border-2 rounded-xl text-[#001524] placeholder-[#C4AD9D] focus:outline-none focus:border-[#027480] focus:ring-2 focus:ring-[#027480]/20 transition-all duration-200 ${
                      errors.confirmPassword ? "border-[#F57251]" : "border-[#445048]/20"
                    }`}
                    placeholder="Confirm your password"
                  />
                </div>
                {errors.confirmPassword && <p className="mt-2 text-sm text-[#F57251]">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center space-x-3">
              <input
                id="terms"
                {...register("terms", { required: "You must agree to the terms and conditions" } as any)}
                type="checkbox"
                className="w-4 h-4 text-[#027480] bg-white border-[#445048]/30 rounded focus:ring-[#027480] focus:ring-2"
              />
              <label htmlFor="terms" className="text-sm text-[#445048]">
                I agree to the{" "}
                <a href="https://business.gov.nl/regulation/general-terms-conditions/?gad_source=1&gad_campaignid=9542970719&gbraid=0AAAAADAUIc9ijFy0Rks_nhRyQdBzkBWd0" className="text-[#027480] hover:text-[#F57251] transition-colors duration-200 font-medium">
                  Terms and Conditions
                </a>{" "}
                and{" "}
                <a href="#" className="text-[#027480] hover:text-[#F57251] transition-colors duration-200 font-medium">
                  Privacy Policy
                </a>
              </label>
            </div>
            {errors.terms && <p className="mt-1 text-sm text-[#F57251]">{errors.terms.message}</p>}

            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full bg-gradient-to-r from-[#027480] to-[#F57251] text-[#E9E6DD] py-4 px-6 rounded-xl font-semibold text-lg hover:from-[#026270] hover:to-[#e56546] transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
            >
              {isSubmitting || isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-[#E9E6DD] border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                "Create Account"
              )}
            </button>

            {/* Login Link */}
            <div className="text-center pt-4">
              <p className="text-[#445048]">
                Already have an account?{" "}
                <Link to="/login" className="text-[#027480] hover:text-[#F57251] font-semibold transition-colors duration-200">
                  Sign in here
                </Link>
              </p>
            </div>
          </form>

          {/* Security Notice */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-800 font-medium">Security Notice</p>
                <p className="text-xs text-blue-600 mt-1">
                  Your information is secured with 256-bit SSL encryption. We never store passwords in plain text.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-auto pt-8 border-t border-[#445048]/20">
            <Link
              to="/"
              className="text-[#027480] hover:text-[#F57251] transition-colors duration-200 flex items-center justify-center space-x-2 text-sm"
            >
              <span>🏡</span>
              <span>Back to Homepage</span>
            </Link>
            <div className="flex items-center justify-center space-x-2 text-[#445048] text-xs mt-2">
              <span>🔒</span>
              <span>256-bit SSL encryption • ISO 27001 certified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;










// import React from "react";
// import { useForm, type SubmitHandler } from "react-hook-form";
// import { Link, useNavigate } from "react-router-dom";
// import Navbar from "../components/Header";
// import Footer from "../components/Footer";
// import SignUp from "../assets/sign-up.svg";
// import { toast } from "react-hot-toast";
// import { useRegisterMutation } from "../features/api/AuthAPI";

// type RegisterFormValues = {
//   first_name: string;
//   last_name: string;
//   email: string;
//   phone_number: string;  
//   password: string; 
//   password_confirm: string; 
// };

// const Register: React.FC = () => {
//   const navigate = useNavigate();
//   const [registerUser, { isLoading }] = useRegisterMutation();

//   const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterFormValues>();

//   const passwordValue = watch("password"); 

//   const onSubmit: SubmitHandler<RegisterFormValues> = async (data) => {
//     let phone = data.phone_number.replace(/\s|-/g, ""); // remove spaces/dashes

//     // Auto-format to +254XXXXXXXXX
//     if (phone.startsWith("0")) {
//       phone = "+254" + phone.slice(1);
//     } else if (/^7\d{8}$/.test(phone)) {
//       phone = "+254" + phone;
//     }

//     try {
//       const res = await registerUser({ ...data, phone_number: phone }).unwrap();
//       toast.success("Account created successfully ☕✨");
//       navigate("/login");
//     } catch (err: any) {
//       console.error('Registration error:', err);
//       toast.error(err.data?.message || "Registration failed");
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col font-sans bg-[#f8f3ef]">
//       <Navbar />

//       <div className="flex-grow flex items-center justify-center py-10 bg-[#e8ded5]">
//         <div className="grid grid-cols-1 md:grid-cols-2 bg-[#fffdfb] rounded-2xl shadow-2xl w-full max-w-6xl overflow-hidden border border-[#d3b8a5]">

//           <div className="flex flex-col justify-center px-10 py-8">
//             <h2 className="text-3xl font-bold text-[#5c3a21] text-center mb-2">Join P4L</h2>
//             <p className="text-center text-[#8a6f57] mb-6">Create your account to get started</p>

//             <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

//               {/* First & Last Name */}
//               <div className="flex flex-col md:flex-row gap-4">
//                 <div className="form-control w-full">
//                   <label className="label"><span className="label-text text-[#5c3a21]">First Name</span></label>
//                   <input
//                     type="text"
//                     placeholder="First Name"
//                     {...register("first_name", { required: "First name is required" })}
//                     className="input input-bordered border-[#c9a589] focus:border-[#8b5e34]"
//                   />
//                   {errors.first_name && <p className="text-red-600 text-sm mt-1">{errors.first_name.message}</p>}
//                 </div>

//                 <div className="form-control w-full">
//                   <label className="label"><span className="label-text text-[#5c3a21]">Last Name</span></label>
//                   <input
//                     type="text"
//                     placeholder="Last Name"
//                     {...register("last_name", { required: "Last name is required" })}
//                     className="input input-bordered border-[#c9a589] focus:border-[#8b5e34]"
//                   />
//                   {errors.last_name && <p className="text-red-600 text-sm mt-1">{errors.last_name.message}</p>}
//                 </div>
//               </div>

//               {/* Email */}
//               <div className="form-control">
//                 <label className="label"><span className="label-text text-[#5c3a21]">Email</span></label>
//                 <input
//                   type="email"
//                   placeholder="Email address"
//                   {...register("email", {
//                     required: "Email is required",
//                     pattern: { value: /^\S+@\S+$/i, message: "Enter a valid email address" },
//                   })}
//                   className="input input-bordered border-[#c9a589] focus:border-[#8b5e34]"
//                 />
//                 {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
//               </div>

//               {/* Phone */}
//               <div className="form-control">
//                 <label className="label"><span className="label-text text-[#5c3a21]">Phone Number</span></label>
//                 <div className="flex">
//                   {/*<span className="px-4 py-2 bg-gray-200 border border-r-0 border-[#c9a589] text-gray-700 rounded-l-sm">+254</span> */}
//                   <input
//                     type="tel"
//                     placeholder="0712345678"
//                     {...register("phone_number", {
//                       required: "Phone number is required",
//                       pattern: {
//                         value: /^(\+254|0)?(7|1)\d{8}$/,
//                         message: "Enter a valid Kenyan phone number (e.g., 0712345678)",
//                       },
//                     })}
//                     className="input input-bordered border-[#c9a589] focus:border-[#8b5e34] rounded-r-sm flex-grow"
//                   />
//                 </div>
//                 {errors.phone_number && <p className="text-red-600 text-sm mt-1">{errors.phone_number.message}</p>}
//               </div>

//               {/* Password */}
//               <div className="form-control">
//                 <label className="label"><span className="label-text text-[#5c3a21]">Password</span></label>
//                 <input
//                   type="password"
//                   placeholder="Password"
//                   {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })}
//                   className="input input-bordered border-[#c9a589] focus:border-[#8b5e34]"
//                 />
//                 {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
//               </div>

//               {/* Confirm Password */}
//               <div className="form-control">
//                 <label className="label"><span className="label-text text-[#5c3a21]">Confirm Password</span></label>
//                 <input
//                   type="password"
//                   placeholder="Confirm Password"
//                   {...register("password_confirm", { 
//                     required: "Please confirm your password",
//                     validate: (value) => value === passwordValue || "Passwords do not match",
//                   })}
//                   className="input input-bordered border-[#c9a589] focus:border-[#8b5e34]"
//                 />
//                 {errors.password_confirm && <p className="text-red-600 text-sm mt-1">{errors.password_confirm.message}</p>}
//               </div>

//               <button
//                 type="submit"
//                 className="btn mt-4 bg-[#8b5e34] border-none text-white hover:bg-[#6e4828]"
//                 disabled={isLoading}
//               >
//                 {isLoading ? "Creating..." : "Create Account"}
//               </button>

//               <div className="text-center mt-4 text-sm space-y-2">
//                 <Link to="/" className="text-[#8b5e34] hover:underline flex justify-center items-center gap-1">
//                   🏡 Go to HomePage
//                 </Link>
//                 <Link to="/login" className="text-[#8b5e34] hover:underline flex justify-center items-center gap-1">
//                   Already have an account? <span className="font-semibold">Login</span>
//                 </Link>
//               </div>
//             </form>
//           </div>

//           <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-[#e8ded5] via-[#c9a589] to-[#8b5e34]">
//             <img src={SignUp} alt="Register illustration" className="w-3/4 max-w-md rounded-lg shadow-xl" />
//           </div>
//         </div>
//       </div>


//     </div>
//   );
// };

// export default Register;



