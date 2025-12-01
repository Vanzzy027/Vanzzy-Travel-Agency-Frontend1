import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/slice/AuthSlice";
import { AuthApi } from "../features/api/AuthAPI";
// import DashboardLayout from "../layouts/DashboardLayout";
// import UserDashboardLayout from "../Userdashboarddesign/UserDashboardLayout";
// import AdminDashboardLayout from "../Userdashboarddesign/AdminDashboardLayout";
// import SuperAdminDashboardLayout from "../Userdashboarddesign/SuperAdminDashboardLayout"; 

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

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginUser, { isLoading }] = AuthApi.useLoginMutation();

const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    try {
      const response = await loginUser(data).unwrap();
      
      console.log("LOGIN RESPONSE:", response);
      //  Save to Redux
      dispatch(setCredentials({ token: response.token, user: response.user }));
      
      //  SAVE TO LOCAL STORAGE (So it survives refresh)
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('token', response.token);

      toast.success(`Welcome ${response.user.first_name} back to VansKE! 🚗 !`);

      //toast.success("Welcome back to VansKE! 🚗");
    
      
      // Redirect based on user role
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

  return (
    <div className="min-h-screen bg-[#E9E6DD] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-[#001524] rounded-3xl shadow-2xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-[#027480] to-[#F57251] py-8 px-8 text-center">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-[#001524] flex items-center justify-center">
              <span className="text-[#E9E6DD] font-bold text-2xl">V</span>
            </div>
            <div>
              <h2 className="text-4xl font-bold text-[#E9E6DD]">Welcome Back</h2>
              <p className="text-[#E9E6DD]/80 mt-2">Sign in to your VansKE account</p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#E9E6DD] mb-2">
                Email Address *
              </label>
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
                className={`w-full px-4 py-3 bg-[#445048] border-2 rounded-xl text-[#E9E6DD] placeholder-[#C4AD9D] focus:outline-none focus:ring-2 focus:ring-[#027480] transition-all duration-200 ${
                  errors.email ? 'border-[#F57251]' : 'border-transparent'
                }`}
                placeholder="your.email@example.com"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-[#F57251]">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-[#E9E6DD]">
                  Password *
                </label>
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-[#027480] hover:text-[#F57251] transition-colors duration-200"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className={`w-full px-4 py-3 bg-[#445048] border-2 rounded-xl text-[#E9E6DD] placeholder-[#C4AD9D] focus:outline-none focus:ring-2 focus:ring-[#027480] transition-all duration-200 ${
                  errors.password ? 'border-[#F57251]' : 'border-transparent'
                }`}
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-2 text-sm text-[#F57251]">{errors.password.message}</p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center space-x-3">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="w-4 h-4 text-[#027480] bg-[#445048] border-[#445048] rounded focus:ring-[#027480] focus:ring-2"
              />
              <label htmlFor="remember" className="text-sm text-[#C4AD9D]">
                Remember me for 30 days
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || isSubmitting}
              className="w-full bg-gradient-to-r from-[#027480] to-[#F57251] text-[#E9E6DD] py-4 px-6 rounded-xl font-semibold text-lg hover:from-[#026270] hover:to-[#e56546] transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-[#E9E6DD] border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                'Sign In to VansKE'
              )}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#445048]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#001524] text-[#C4AD9D]">Or continue with</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="w-full bg-[#445048] text-[#E9E6DD] py-3 px-4 rounded-xl font-medium hover:bg-[#027480] transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <span>🔵</span>
                <span>Google</span>
              </button>
              <button
                type="button"
                className="w-full bg-[#445048] text-[#E9E6DD] py-3 px-4 rounded-xl font-medium hover:bg-[#027480] transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <span>📘</span>
                <span>Facebook</span>
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center pt-4">
              <p className="text-[#C4AD9D]">
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  className="text-[#027480] hover:text-[#F57251] font-semibold transition-colors duration-200"
                >
                  Create one here
                </Link>
              </p>
            </div>

            {/* Home Link */}
            <div className="text-center">
              <Link
                to="/"
                className="text-[#027480] hover:text-[#F57251] transition-colors duration-200 flex items-center justify-center space-x-2 text-sm"
              >
                <span>🏡</span>
                <span>Back to Homepage</span>
              </Link>
            </div>
          </form>
        </div>

        {/* Security Footer */}
        <div className="bg-[#445048] py-4 px-8 text-center">
          <div className="flex items-center justify-center space-x-2 text-[#C4AD9D] text-sm">
            <span>🔒</span>
            <span>Secure login with 256-bit SSL encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

