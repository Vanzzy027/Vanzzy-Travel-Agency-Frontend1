import React, { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/slice/AuthSlice";
import { 
  useLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation
} from "../features/api/AuthAPI";
import { Car, Shield, Key, Mail, Lock, Eye, EyeOff, ChevronLeft } from "lucide-react";

type LoginFormValues = {
  email: string;
  password: string;
};

const Login: React.FC = () => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm<LoginFormValues>();
  
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

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
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
    } catch (error: any) {
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
    } catch (error: any) {
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
    } catch (error: any) {
      toast.error(error.data?.error || "Failed to reset password. Please check OTP and try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001524] via-[#001524] to-[#027480] flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-4xl bg-[#E9E6DD] rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Mobile Header - Only shown on small screens */}
        <div className="md:hidden bg-gradient-to-r from-[#001524] to-[#027480] p-6 text-center">
          <Link to="/" className="inline-flex items-center text-[#E9E6DD] hover:text-[#F57251] mb-4">
            <ChevronLeft size={20} className="mr-2" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-[#E9E6DD] flex items-center justify-center">
              <span className="text-[#001524] font-bold text-xl">V</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#E9E6DD]">VansKE</h1>
              <p className="text-[#C4AD9D] text-sm">Luxury & Performance</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[70vh]">
          
          {/* Left Side - Brand & Vehicle Showcase (Hidden on mobile) */}
          <div className="hidden lg:flex bg-gradient-to-br from-[#001524] to-[#027480] p-8 lg:p-12 flex-col justify-between text-[#E9E6DD] relative overflow-hidden">
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
                  <h1 className="text-3xl lg:text-4xl font-bold">VansKE Car Rental</h1>
                  <p className="text-[#C4AD9D] text-base lg:text-lg">Luxury & Performance</p>
                </div>
              </div>
              
              {/* Features */}
              <div className="mt-8 space-y-6">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 lg:w-6 lg:h-6 text-[#F57251] flex-shrink-0" />
                  <h3 className="text-lg lg:text-xl font-semibold">Secure & Trusted Platform</h3>
                </div>
                <div className="flex items-center space-x-3">
                  <Car className="w-5 h-5 lg:w-6 lg:h-6 text-[#F57251] flex-shrink-0" />
                  <h3 className="text-lg lg:text-xl font-semibold">Premium Fleet Management</h3>
                </div>
                <div className="flex items-center space-x-3">
                  <Key className="w-5 h-5 lg:w-6 lg:h-6 text-[#F57251] flex-shrink-0" />
                  <h3 className="text-lg lg:text-xl font-semibold">Instant Booking Access</h3>
                </div>
              </div>
            </div>

            {/* Testimonial */}
            <div className="relative z-10 mt-auto pt-8 border-t border-[#445048]">
              <p className="italic text-[#C4AD9D] text-sm lg:text-base">
                "Experience luxury on wheels with VansKE - where every journey is exceptional."
              </p>
            </div>
          </div>

          {/* Right Side - Login Form (Always visible) */}
          <div className="p-6 md:p-8 lg:p-12 flex flex-col justify-center">
            {!forgotPassword ? (
              <>
                {/* Login Form Header */}
                <div className="mb-6 md:mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-[#001524] mb-2">Welcome Back</h2>
                  <p className="text-[#445048] text-sm md:text-base">Sign in to access your VansKE account</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[#001524] mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 md:left-4 top-3 md:top-3.5 w-4 h-4 md:w-5 md:h-5 text-[#445048]" />
                      <input
                        id="email"
                        type="email"
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^\S+@\S+$/i,
                            message: "Enter a valid email address",
                          },
                        })}
                        className="w-full pl-10 md:pl-12 pr-4 py-3 bg-white border border-[#445048]/30 rounded-lg md:rounded-xl text-[#001524] placeholder-[#C4AD9D] text-sm md:text-base focus:outline-none focus:border-[#027480] focus:ring-2 focus:ring-[#027480]/20 transition-all duration-200"
                        placeholder="your.email@example.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-[#F57251]">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label htmlFor="password" className="block text-sm font-medium text-[#001524]">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setForgotPassword(true)}
                        className="text-xs md:text-sm text-[#027480] hover:text-[#F57251] transition-colors duration-200 font-medium"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 md:left-4 top-3 md:top-3.5 w-4 h-4 md:w-5 md:h-5 text-[#445048]" />
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        {...register("password", {
                          required: "Password is required",
                          minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters",
                          },
                        })}
                        className="w-full pl-10 md:pl-12 pr-10 md:pr-12 py-3 bg-white border border-[#445048]/30 rounded-lg md:rounded-xl text-[#001524] placeholder-[#C4AD9D] text-sm md:text-base focus:outline-none focus:border-[#027480] focus:ring-2 focus:ring-[#027480]/20 transition-all duration-200"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 md:right-4 top-3 md:top-3.5 text-[#445048] hover:text-[#027480]"
                      >
                        {showPassword ? <EyeOff size={18} className="md:w-5 md:h-5" /> : <Eye size={18} className="md:w-5 md:h-5" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-sm text-[#F57251]">{errors.password.message}</p>
                    )}
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <input
                      id="remember"
                      name="remember"
                      type="checkbox"
                      className="w-4 h-4 text-[#027480] bg-white border-[#445048]/30 rounded focus:ring-[#027480] focus:ring-1 md:focus:ring-2"
                    />
                    <label htmlFor="remember" className="text-xs md:text-sm text-[#445048]">
                      Remember me for 30 days
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoginLoading || isSubmitting}
                    className="w-full bg-gradient-to-r from-[#027480] to-[#F57251] text-[#E9E6DD] py-3 md:py-4 px-6 rounded-lg md:rounded-xl font-semibold text-base md:text-lg hover:from-[#026270] hover:to-[#e56546] transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
                  >
                    {isLoginLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-[#E9E6DD] border-t-transparent rounded-full animate-spin"></div>
                        <span>Signing In...</span>
                      </div>
                    ) : (
                      'Sign In'
                    )}
                  </button>

                  {/* Divider */}
                  <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-[#445048]/20"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-[#E9E6DD] text-[#445048] text-xs md:text-sm">Or continue with</span>
                    </div>
                  </div>

                  {/* Social Login */}
                  <div className="grid grid-cols-2 gap-3 md:gap-4">
                    <button
                      type="button"
                      className="w-full bg-white border border-[#445048]/20 text-[#001524] py-2.5 md:py-3 px-4 rounded-lg md:rounded-xl font-medium hover:border-[#027480] hover:text-[#027480] transition-all duration-200 flex items-center justify-center space-x-2 text-sm md:text-base shadow-sm"
                    >
                      <span className="text-blue-500">🔵</span>
                      <span>Google</span>
                    </button>
                    <button
                      type="button"
                      className="w-full bg-white border border-[#445048]/20 text-[#001524] py-2.5 md:py-3 px-4 rounded-lg md:rounded-xl font-medium hover:border-[#027480] hover:text-[#027480] transition-all duration-200 flex items-center justify-center space-x-2 text-sm md:text-base shadow-sm"
                    >
                      <span className="text-blue-700">📘</span>
                      <span>Facebook</span>
                    </button>
                  </div>

                  {/* Sign Up Link */}
                  <div className="text-center pt-4">
                    <p className="text-[#445048] text-sm md:text-base">
                      Don't have an account?{' '}
                      <Link 
                        to="/register" 
                        className="text-[#027480] hover:text-[#F57251] font-semibold transition-colors duration-200"
                      >
                        Create one here
                      </Link>
                    </p>
                  </div>
                </form>
              </>
            ) : (
              /* Password Reset Flow - Single Step */
              <div>
                <div className="mb-6 md:mb-8">
                  <button
                    onClick={() => {
                      setForgotPassword(false);
                      setResetEmail('');
                      setResetOTP('');
                      setNewPassword('');
                      setConfirmPassword('');
                    }}
                    className="flex items-center text-[#027480] hover:text-[#F57251] mb-4 md:mb-6 transition-colors text-sm md:text-base"
                  >
                    <ChevronLeft size={18} className="mr-2" />
                    Back to login
                  </button>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#001524] mb-2">Reset Your Password</h2>
                  <p className="text-[#445048] text-sm md:text-base">Enter your email to receive a reset OTP, then set a new password</p>
                </div>

                {/* Single Form for Reset */}
                <div className="space-y-4 md:space-y-6">
                  {/* Email Input */}
                  <div>
                    <label htmlFor="resetEmail" className="block text-sm font-medium text-[#001524] mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 md:left-4 top-3 md:top-3.5 w-4 h-4 md:w-5 md:h-5 text-[#445048]" />
                      <input
                        id="resetEmail"
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="w-full pl-10 md:pl-12 pr-4 py-3 bg-white border border-[#445048]/30 rounded-lg md:rounded-xl text-[#001524] placeholder-[#C4AD9D] text-sm md:text-base focus:outline-none focus:border-[#027480] focus:ring-2 focus:ring-[#027480]/20 transition-all duration-200"
                        placeholder="Enter your registered email"
                      />
                    </div>
                  </div>

                  {/* OTP Input */}
                  <div>
                    <label htmlFor="resetOTP" className="block text-sm font-medium text-[#001524] mb-2">
                      OTP (Sent to your email)
                    </label>
                    <input
                      id="resetOTP"
                      type="text"
                      value={resetOTP}
                      onChange={(e) => setResetOTP(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="w-full px-4 py-3 bg-white border border-[#445048]/30 rounded-lg md:rounded-xl text-[#001524] text-center text-lg md:text-xl tracking-widest focus:outline-none focus:border-[#027480] focus:ring-2 focus:ring-[#027480]/20 transition-all duration-200"
                      placeholder="Enter 6-digit OTP"
                      maxLength={6}
                    />
                  </div>

                  {/* New Password */}
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-[#001524] mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 md:left-4 top-3 md:top-3.5 w-4 h-4 md:w-5 md:h-5 text-[#445048]" />
                      <input
                        id="newPassword"
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full pl-10 md:pl-12 pr-10 md:pr-12 py-3 bg-white border border-[#445048]/30 rounded-lg md:rounded-xl text-[#001524] placeholder-[#C4AD9D] text-sm md:text-base focus:outline-none focus:border-[#027480] focus:ring-2 focus:ring-[#027480]/20 transition-all duration-200"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 md:right-4 top-3 md:top-3.5 text-[#445048] hover:text-[#027480]"
                      >
                        {showPassword ? <EyeOff size={18} className="md:w-5 md:h-5" /> : <Eye size={18} className="md:w-5 md:h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#001524] mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 md:left-4 top-3 md:top-3.5 w-4 h-4 md:w-5 md:h-5 text-[#445048]" />
                      <input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-10 md:pl-12 pr-10 md:pr-12 py-3 bg-white border border-[#445048]/30 rounded-lg md:rounded-xl text-[#001524] placeholder-[#C4AD9D] text-sm md:text-base focus:outline-none focus:border-[#027480] focus:ring-2 focus:ring-[#027480]/20 transition-all duration-200"
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 md:space-y-4">
                    <button
                      onClick={handleForgotPassword}
                      disabled={!resetEmail || isForgotPasswordLoading}
                      className="w-full bg-gradient-to-r from-[#027480] to-[#F57251] text-[#E9E6DD] py-3 px-6 rounded-lg md:rounded-xl font-semibold text-sm md:text-base hover:from-[#026270] hover:to-[#e56546] transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isForgotPasswordLoading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-[#E9E6DD] border-t-transparent rounded-full animate-spin"></div>
                          <span>Sending OTP...</span>
                        </div>
                      ) : (
                        'Send Reset OTP'
                      )}
                    </button>

                    <button
                      onClick={handleResetPassword}
                      disabled={!resetOTP || !newPassword || !confirmPassword || newPassword !== confirmPassword || isResetPasswordLoading}
                      className="w-full bg-gradient-to-r from-[#F57251] to-[#027480] text-[#E9E6DD] py-3 px-6 rounded-lg md:rounded-xl font-semibold text-sm md:text-base hover:from-[#e56546] hover:to-[#026270] transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isResetPasswordLoading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-[#E9E6DD] border-t-transparent rounded-full animate-spin"></div>
                          <span>Resetting Password...</span>
                        </div>
                      ) : (
                        'Reset Password'
                      )}
                    </button>
                  </div>

                  {/* Instructions - Hidden on mobile, shown on tablet+ */}
                  <div className="hidden md:block mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-blue-800 font-medium">Reset Instructions</p>
                        <ol className="text-xs text-blue-600 mt-1 list-decimal pl-4 space-y-1">
                          <li>Enter your email address</li>
                          <li>Click "Send Reset OTP" to receive a 6-digit code</li>
                          <li>Check your email for the OTP and enter it above</li>
                          <li>Set your new password and confirm it</li>
                          <li>Click "Reset Password" to complete</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Footer - Desktop only */}
            <div className="hidden lg:block mt-auto pt-8 border-t border-[#445048]/20">
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
    </div>
  );
};

export default Login;

// import React, { useState } from "react";
// import { useForm, type SubmitHandler } from "react-hook-form";
// import { Link, useNavigate } from "react-router-dom";
// import { toast } from "sonner";
// import { useDispatch } from "react-redux";
// import { setCredentials } from "../features/slice/AuthSlice";
// import { 
//   useLoginMutation,
//   useForgotPasswordMutation,
//   useResetPasswordMutation
// } from "../features/api/AuthAPI";
// import { Car, Shield, Key, Mail, Lock, Eye, EyeOff } from "lucide-react";

// type LoginFormValues = {
//   email: string;
//   password: string;
// };

// const Login: React.FC = () => {
//   const { 
//     register, 
//     handleSubmit, 
//     formState: { errors, isSubmitting } 
//   } = useForm<LoginFormValues>();
  
//   const [showPassword, setShowPassword] = useState(false);
//   const [forgotPassword, setForgotPassword] = useState(false);
//   const [resetEmail, setResetEmail] = useState('');
//   const [resetOTP, setResetOTP] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');

//   const dispatch = useDispatch();
//   const navigate = useNavigate();
  
//   // API hooks
//   const [loginUser, { isLoading: isLoginLoading }] = useLoginMutation();
//   const [forgotPasswordApi, { isLoading: isForgotPasswordLoading }] = useForgotPasswordMutation();
//   const [resetPasswordApi, { isLoading: isResetPasswordLoading }] = useResetPasswordMutation();

//   const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
//     try {
//       const response = await loginUser(data).unwrap();
      
//       dispatch(setCredentials({ token: response.token, user: response.user }));
      
//       localStorage.setItem('user', JSON.stringify(response.user));
//       localStorage.setItem('token', response.token);

//       toast.success(`Welcome ${response.user.first_name} back to VansKE! 🚗`);
      
//       setTimeout(() => {
//         switch (response.user.role) {
//           case 'superAdmin':
//             navigate('/super-admin');
//             break;
//           case 'admin':
//             navigate('/admin');
//             break;
//           case 'user':
//             navigate('/UserDashboard');
//             break;
//           default:
//             navigate('/');
//         }
//       }, 800);
//     } catch (error: any) {
//       toast.error(error.data?.error || "Login failed. Please check your credentials.");
//     }
//   };

//   const handleForgotPassword = async () => {
//     if (!resetEmail) {
//       toast.error("Please enter your email");
//       return;
//     }

//     try {
//       const response = await forgotPasswordApi({ email: resetEmail }).unwrap();
      
//       toast.success("Reset OTP sent to your email. Please check your inbox.");
//     } catch (error: any) {
//       toast.error(error.data?.error || "Failed to send OTP. Please check your email.");
//     }
//   };

//   const handleResetPassword = async () => {
//     if (!newPassword || !confirmPassword) {
//       toast.error("Please enter and confirm your new password");
//       return;
//     }

//     if (newPassword !== confirmPassword) {
//       toast.error("Passwords do not match");
//       return;
//     }

//     if (!resetOTP) {
//       toast.error("Please enter the OTP from your email");
//       return;
//     }

//     try {
//       const response = await resetPasswordApi({ 
//         email: resetEmail, 
//         otp: resetOTP,
//         new_password: newPassword
//       }).unwrap();
      
//       toast.success("Password reset successfully! Please login with your new password.");
//       setForgotPassword(false);
//       setResetEmail('');
//       setResetOTP('');
//       setNewPassword('');
//       setConfirmPassword('');
//     } catch (error: any) {
//       toast.error(error.data?.error || "Failed to reset password. Please check OTP and try again.");
//     }
//   };

//   const VehicleSVG = () => (
//     <svg viewBox="0 0 400 300" className="w-full h-full">
//       {/* Car Body */}
//       <path 
//         d="M80,180 L320,180 Q340,180 340,160 L340,140 Q340,120 320,120 L280,120 L260,80 L140,80 L120,120 L80,120 Q60,120 60,140 L60,160 Q60,180 80,180" 
//         fill="#027480" 
//         stroke="#001524" 
//         strokeWidth="2"
//       />
      
//       {/* Windows */}
//       <path 
//         d="M150,120 L250,120 L230,90 L170,90 Z" 
//         fill="#E9E6DD" 
//         stroke="#001524" 
//         strokeWidth="1"
//       />
      
//       {/* Wheels */}
//       <circle cx="120" cy="180" r="20" fill="#001524" />
//       <circle cx="120" cy="180" r="10" fill="#E9E6DD" />
//       <circle cx="280" cy="180" r="20" fill="#001524" />
//       <circle cx="280" cy="180" r="10" fill="#E9E6DD" />
      
//       {/* Headlights */}
//       <ellipse cx="340" cy="130" rx="5" ry="8" fill="#F57251" />
      
//       {/* Grill */}
//       <rect x="320" y="130" width="15" height="20" fill="#445048" rx="2" />
      
//       {/* Logo */}
//       <text x="200" y="220" textAnchor="middle" fill="#E9E6DD" fontSize="24" fontWeight="bold">
//         VansKE
//       </text>
//     </svg>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#001524] via-[#001524] to-[#027480] flex items-center justify-center p-4">
//       <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 bg-[#E9E6DD] rounded-3xl shadow-2xl overflow-hidden min-h-[80vh]">
        
//         {/* Left Side - Brand & Vehicle Showcase */}
//         <div className="bg-gradient-to-br from-[#001524] to-[#027480] p-12 flex flex-col justify-between text-[#E9E6DD] relative overflow-hidden">
//           {/* Decorative Elements */}
//           <div className="absolute top-0 right-0 w-64 h-64 bg-[#F57251]/10 rounded-full -translate-y-32 translate-x-32"></div>
//           <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#D6CC99]/10 rounded-full -translate-x-24 translate-y-24"></div>
          
//           {/* Brand */}
//           <div className="relative z-10">
//             <div className="flex items-center space-x-4 mb-8">
//               <div className="w-16 h-16 rounded-full bg-[#E9E6DD] flex items-center justify-center">
//                 <span className="text-[#001524] font-bold text-3xl">V</span>
//               </div>
//               <div>
//                 <h1 className="text-4xl font-bold">VansKE Car Rental</h1>
//                 <p className="text-[#C4AD9D] text-lg">Luxury & Performance</p>
//               </div>
//             </div>
            
//             {/* Vehicle SVG */}
//             <div className="mt-8 mb-8 h-48 flex items-center justify-center">
//               <div className="w-4/5">
//                 <VehicleSVG />
//               </div>
//             </div>
            
//             <div className="mt-8">
//               <div className="flex items-center space-x-3 mb-6">
//                 <Shield className="w-6 h-6 text-[#F57251]" />
//                 <h3 className="text-xl font-semibold">Secure & Trusted Platform</h3>
//               </div>
//               <div className="flex items-center space-x-3 mb-6">
//                 <Car className="w-6 h-6 text-[#F57251]" />
//                 <h3 className="text-xl font-semibold">Premium Fleet Management</h3>
//               </div>
//               <div className="flex items-center space-x-3">
//                 <Key className="w-6 h-6 text-[#F57251]" />
//                 <h3 className="text-xl font-semibold">Instant Booking Access</h3>
//               </div>
//             </div>
//           </div>

//           {/* Testimonial */}
//           <div className="relative z-10 mt-auto pt-8 border-t border-[#445048]">
//             <p className="italic text-[#C4AD9D] mb-4">
//               "Experience luxury on wheels with VansKE - where every journey is exceptional."
//             </p>
//           </div>
//         </div>

//         {/* Right Side - Login Form */}
//         <div className="p-12 flex flex-col justify-center">
//           {!forgotPassword ? (
//             <>
//               {/* Login Form Header */}
//               <div className="mb-10">
//                 <h2 className="text-3xl font-bold text-[#001524] mb-2">Welcome Back</h2>
//                 <p className="text-[#445048]">Sign in to access your VansKE account</p>
//               </div>

//               <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//                 {/* Email */}
//                 <div>
//                   <label htmlFor="email" className="block text-sm font-medium text-[#001524] mb-2">
//                     Email Address
//                   </label>
//                   <div className="relative">
//                     <Mail className="absolute left-4 top-3.5 w-5 h-5 text-[#445048]" />
//                     <input
//                       id="email"
//                       type="email"
//                       {...register("email", {
//                         required: "Email is required",
//                         pattern: {
//                           value: /^\S+@\S+$/i,
//                           message: "Enter a valid email address",
//                         },
//                       })}
//                       className="w-full pl-12 pr-4 py-3 bg-white border-2 border-[#445048]/20 rounded-xl text-[#001524] placeholder-[#C4AD9D] focus:outline-none focus:border-[#027480] focus:ring-2 focus:ring-[#027480]/20 transition-all duration-200"
//                       placeholder="your.email@example.com"
//                     />
//                   </div>
//                   {errors.email && (
//                     <p className="mt-2 text-sm text-[#F57251]">{errors.email.message}</p>
//                   )}
//                 </div>

//                 {/* Password */}
//                 <div>
//                   <div className="flex items-center justify-between mb-2">
//                     <label htmlFor="password" className="block text-sm font-medium text-[#001524]">
//                       Password
//                     </label>
//                     <button
//                       type="button"
//                       onClick={() => setForgotPassword(true)}
//                       className="text-sm text-[#027480] hover:text-[#F57251] transition-colors duration-200 font-medium"
//                     >
//                       Forgot password?
//                     </button>
//                   </div>
//                   <div className="relative">
//                     <Lock className="absolute left-4 top-3.5 w-5 h-5 text-[#445048]" />
//                     <input
//                       id="password"
//                       type={showPassword ? "text" : "password"}
//                       {...register("password", {
//                         required: "Password is required",
//                         minLength: {
//                           value: 6,
//                           message: "Password must be at least 6 characters",
//                         },
//                       })}
//                       className="w-full pl-12 pr-12 py-3 bg-white border-2 border-[#445048]/20 rounded-xl text-[#001524] placeholder-[#C4AD9D] focus:outline-none focus:border-[#027480] focus:ring-2 focus:ring-[#027480]/20 transition-all duration-200"
//                       placeholder="Enter your password"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="absolute right-4 top-3.5 text-[#445048] hover:text-[#027480]"
//                     >
//                       {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                     </button>
//                   </div>
//                   {errors.password && (
//                     <p className="mt-2 text-sm text-[#F57251]">{errors.password.message}</p>
//                   )}
//                 </div>

//                 {/* Remember Me */}
//                 <div className="flex items-center space-x-3">
//                   <input
//                     id="remember"
//                     name="remember"
//                     type="checkbox"
//                     className="w-4 h-4 text-[#027480] bg-white border-[#445048]/30 rounded focus:ring-[#027480] focus:ring-2"
//                   />
//                   <label htmlFor="remember" className="text-sm text-[#445048]">
//                     Remember me for 30 days
//                   </label>
//                 </div>

//                 {/* Submit Button */}
//                 <button
//                   type="submit"
//                   disabled={isLoginLoading || isSubmitting}
//                   className="w-full bg-gradient-to-r from-[#027480] to-[#F57251] text-[#E9E6DD] py-4 px-6 rounded-xl font-semibold text-lg hover:from-[#026270] hover:to-[#e56546] transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
//                 >
//                   {isLoginLoading ? (
//                     <div className="flex items-center justify-center space-x-2">
//                       <div className="w-5 h-5 border-2 border-[#E9E6DD] border-t-transparent rounded-full animate-spin"></div>
//                       <span>Signing In...</span>
//                     </div>
//                   ) : (
//                     'Sign In to VansKE'
//                   )}
//                 </button>

//                 {/* Divider */}
//                 <div className="relative">
//                   <div className="absolute inset-0 flex items-center">
//                     <div className="w-full border-t border-[#445048]/20"></div>
//                   </div>
//                   <div className="relative flex justify-center text-sm">
//                     <span className="px-4 bg-[#E9E6DD] text-[#445048]">Or continue with</span>
//                   </div>
//                 </div>

//                 {/* Social Login */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <button
//                     type="button"
//                     className="w-full bg-white border-2 border-[#445048]/20 text-[#001524] py-3 px-4 rounded-xl font-medium hover:border-[#027480] hover:text-[#027480] transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm"
//                   >
//                     <span className="text-blue-500">🔵</span>
//                     <span>Google</span>
//                   </button>
//                   <button
//                     type="button"
//                     className="w-full bg-white border-2 border-[#445048]/20 text-[#001524] py-3 px-4 rounded-xl font-medium hover:border-[#027480] hover:text-[#027480] transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm"
//                   >
//                     <span className="text-blue-700">📘</span>
//                     <span>Facebook</span>
//                   </button>
//                 </div>

//                 {/* Sign Up Link */}
//                 <div className="text-center pt-4">
//                   <p className="text-[#445048]">
//                     Don't have an account?{' '}
//                     <Link 
//                       to="/register" 
//                       className="text-[#027480] hover:text-[#F57251] font-semibold transition-colors duration-200"
//                     >
//                       Create one here
//                     </Link>
//                   </p>
//                 </div>
//               </form>
//             </>
//           ) : (
//             /* Password Reset Flow - Single Step */
//             <div>
//               <div className="mb-10">
//                 <button
//                   onClick={() => {
//                     setForgotPassword(false);
//                     setResetEmail('');
//                     setResetOTP('');
//                     setNewPassword('');
//                     setConfirmPassword('');
//                   }}
//                   className="flex items-center text-[#027480] hover:text-[#F57251] mb-6 transition-colors"
//                 >
//                   ← Back to login
//                 </button>
//                 <h2 className="text-3xl font-bold text-[#001524] mb-2">Reset Your Password</h2>
//                 <p className="text-[#445048]">Enter your email to receive a reset OTP, then set a new password</p>
//               </div>

//               {/* Single Form for Reset */}
//               <div className="space-y-6">
//                 {/* Email Input */}
//                 <div>
//                   <label htmlFor="resetEmail" className="block text-sm font-medium text-[#001524] mb-2">
//                     Email Address
//                   </label>
//                   <div className="relative">
//                     <Mail className="absolute left-4 top-3.5 w-5 h-5 text-[#445048]" />
//                     <input
//                       id="resetEmail"
//                       type="email"
//                       value={resetEmail}
//                       onChange={(e) => setResetEmail(e.target.value)}
//                       className="w-full pl-12 pr-4 py-3 bg-white border-2 border-[#445048]/20 rounded-xl text-[#001524] placeholder-[#C4AD9D] focus:outline-none focus:border-[#027480] focus:ring-2 focus:ring-[#027480]/20 transition-all duration-200"
//                       placeholder="Enter your registered email"
//                     />
//                   </div>
//                 </div>

//                 {/* OTP Input */}
//                 <div>
//                   <label htmlFor="resetOTP" className="block text-sm font-medium text-[#001524] mb-2">
//                     OTP (Sent to your email)
//                   </label>
//                   <input
//                     id="resetOTP"
//                     type="text"
//                     value={resetOTP}
//                     onChange={(e) => setResetOTP(e.target.value.replace(/\D/g, '').slice(0, 6))}
//                     className="w-full px-4 py-3 bg-white border-2 border-[#445048]/20 rounded-xl text-[#001524] text-center text-xl tracking-widest focus:outline-none focus:border-[#027480] focus:ring-2 focus:ring-[#027480]/20 transition-all duration-200"
//                     placeholder="Enter 6-digit OTP"
//                     maxLength={6}
//                   />
//                 </div>

//                 {/* New Password */}
//                 <div>
//                   <label htmlFor="newPassword" className="block text-sm font-medium text-[#001524] mb-2">
//                     New Password
//                   </label>
//                   <div className="relative">
//                     <Lock className="absolute left-4 top-3.5 w-5 h-5 text-[#445048]" />
//                     <input
//                       id="newPassword"
//                       type={showPassword ? "text" : "password"}
//                       value={newPassword}
//                       onChange={(e) => setNewPassword(e.target.value)}
//                       className="w-full pl-12 pr-12 py-3 bg-white border-2 border-[#445048]/20 rounded-xl text-[#001524] placeholder-[#C4AD9D] focus:outline-none focus:border-[#027480] focus:ring-2 focus:ring-[#027480]/20 transition-all duration-200"
//                       placeholder="Enter new password"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="absolute right-4 top-3.5 text-[#445048] hover:text-[#027480]"
//                     >
//                       {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                     </button>
//                   </div>
//                 </div>

//                 {/* Confirm Password */}
//                 <div>
//                   <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#001524] mb-2">
//                     Confirm Password
//                   </label>
//                   <div className="relative">
//                     <Lock className="absolute left-4 top-3.5 w-5 h-5 text-[#445048]" />
//                     <input
//                       id="confirmPassword"
//                       type={showPassword ? "text" : "password"}
//                       value={confirmPassword}
//                       onChange={(e) => setConfirmPassword(e.target.value)}
//                       className="w-full pl-12 pr-12 py-3 bg-white border-2 border-[#445048]/20 rounded-xl text-[#001524] placeholder-[#C4AD9D] focus:outline-none focus:border-[#027480] focus:ring-2 focus:ring-[#027480]/20 transition-all duration-200"
//                       placeholder="Confirm new password"
//                     />
//                   </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="space-y-4">
//                   <button
//                     onClick={handleForgotPassword}
//                     disabled={!resetEmail || isForgotPasswordLoading}
//                     className="w-full bg-gradient-to-r from-[#027480] to-[#F57251] text-[#E9E6DD] py-3 px-6 rounded-xl font-semibold hover:from-[#026270] hover:to-[#e56546] transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
//                   >
//                     {isForgotPasswordLoading ? (
//                       <div className="flex items-center justify-center space-x-2">
//                         <div className="w-5 h-5 border-2 border-[#E9E6DD] border-t-transparent rounded-full animate-spin"></div>
//                         <span>Sending OTP...</span>
//                       </div>
//                     ) : (
//                       'Send Reset OTP'
//                     )}
//                   </button>

//                   <button
//                     onClick={handleResetPassword}
//                     disabled={!resetOTP || !newPassword || !confirmPassword || newPassword !== confirmPassword || isResetPasswordLoading}
//                     className="w-full bg-gradient-to-r from-[#F57251] to-[#027480] text-[#E9E6DD] py-3 px-6 rounded-xl font-semibold hover:from-[#e56546] hover:to-[#026270] transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
//                   >
//                     {isResetPasswordLoading ? (
//                       <div className="flex items-center justify-center space-x-2">
//                         <div className="w-5 h-5 border-2 border-[#E9E6DD] border-t-transparent rounded-full animate-spin"></div>
//                         <span>Resetting Password...</span>
//                       </div>
//                     ) : (
//                       'Reset Password'
//                     )}
//                   </button>
//                 </div>

//                 {/* Instructions */}
//                 <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
//                   <div className="flex items-start space-x-3">
//                     <Shield className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
//                     <div>
//                       <p className="text-sm text-blue-800 font-medium">Reset Instructions</p>
//                       <ol className="text-xs text-blue-600 mt-1 list-decimal pl-4 space-y-1">
//                         <li>Enter your email address</li>
//                         <li>Click "Send Reset OTP" to receive a 6-digit code</li>
//                         <li>Check your email for the OTP and enter it above</li>
//                         <li>Set your new password and confirm it</li>
//                         <li>Click "Reset Password" to complete</li>
//                       </ol>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Footer */}
//           <div className="mt-auto pt-8 border-t border-[#445048]/20">
//             <Link
//               to="/"
//               className="text-[#027480] hover:text-[#F57251] transition-colors duration-200 flex items-center justify-center space-x-2 text-sm"
//             >
//               <span>🏡</span>
//               <span>Back to Homepage</span>
//             </Link>
//             <div className="flex items-center justify-center space-x-2 text-[#445048] text-xs mt-2">
//               <span>🔒</span>
//               <span>256-bit SSL encryption • ISO 27001 certified</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
