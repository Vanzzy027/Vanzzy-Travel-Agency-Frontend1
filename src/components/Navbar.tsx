// Navbar.tsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/fleet", label: "Fleet" },
    { path: "/about", label: "About Us" },
    { path: "/contact", label: "Contact Us" },
  ];

  return (
    <div className="sticky top-0 z-50 p-4 bg-[#E9E6DD] shadow-md">
      <nav className="max-w-7xl mx-auto bg-[#001524] rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between">
          
          {/* Brand with company name and motto */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#027480] flex items-center justify-center">
              <span className="text-[#E9E6DD] font-bold text-lg">V</span>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-[#E9E6DD]">VansKE Car Rental</h1>
              <p className="text-[#C4AD9D] text-sm">Luxury & Performance</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-lg font-medium transition-colors duration-200 ${
                  isActive(link.path)
                    ? "text-[#F57251]"
                    : "text-[#E9E6DD] hover:text-[#F57251]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right: Desktop Auth Buttons + Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {/* Desktop Auth Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              <Link
                to="/login"
                className="px-6 py-2 text-[#E9E6DD] hover:text-[#F57251] transition-colors duration-200 font-medium"
              >
                Login
              </Link>
              
              <Link
                to="/register"
                className="px-6 py-2 bg-[#F57251] text-[#E9E6DD] rounded-full hover:bg-[#e56546] transition-colors duration-200 font-medium"
              >
                Sign Up
              </Link>
              
              <Link
                to="/login" // Redirects to login for booking
                className="px-6 py-2 bg-[#027480] text-[#E9E6DD] rounded-full hover:bg-[#01616d] transition-colors duration-200 font-medium"
              >
                Rent Now
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#C4AD9D] hover:text-[#E9E6DD] hover:bg-[#00101f] rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Floating Mobile Menu - Overlays content, doesn't push it down */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute left-4 right-4 mt-4 bg-[#001524] border border-[#445048] rounded-2xl shadow-xl z-50">
            {/* Navigation Links */}
            <div className="p-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg mb-2 last:mb-0 transition-all duration-200 ${
                    isActive(link.path)
                      ? "text-[#F57251] bg-[#00101f]"
                      : "text-[#E9E6DD] hover:text-[#F57251] hover:bg-[#00101f]/50"
                  }`}
                >
                  <span className="font-medium text-lg">{link.label}</span>
                </Link>
              ))}
            </div>

            {/* Mobile Auth Buttons */}
            <div className="p-4 border-t border-[#445048] space-y-3">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center px-4 py-3 text-[#E9E6DD] bg-[#00101f] hover:bg-[#00101f]/80 rounded-lg transition-colors font-medium"
              >
                Login
              </Link>
              
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center px-4 py-3 bg-[#F57251] text-[#E9E6DD] hover:bg-[#e56546] rounded-lg transition-colors font-medium"
              >
                Sign Up
              </Link>
              
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center px-4 py-3 bg-[#027480] text-[#E9E6DD] hover:bg-[#01616d] rounded-lg transition-colors font-medium"
              >
                Rent a Car Now
              </Link>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;

// import React from "react";
// import {  Link } from "react-router-dom";

// const Navbar: React.FC = () => {
//   return (
//     <div className="p-4 bg-[#E9E6DD]">
//       <nav className="max-w-7xl mx-auto bg-[#001524] rounded-2xl p-4 shadow-lg">
//         <div className="flex items-center justify-between">
          
//           {/* Brand */}
//           <Link to="/" className="flex items-center space-x-2">
//             <div className="w-10 h-10 rounded-full bg-[#027480] flex items-center justify-center">
//               <span className="text-[#E9E6DD] font-bold text-lg">V</span>
//             </div>

//             <div>
//               <h1 className="text-2xl font-bold text-[#E9E6DD]">VansKE Car Rental</h1>
//               <p className="text-[#C4AD9D] text-sm">Luxury & Performance</p>
//             </div>
//           </Link>

//           {/* Navigation Links */}
//           <div className="hidden md:flex items-center space-x-8">
//             <Link to="/" className="text-[#E9E6DD] hover:text-[#F57251] transition-colors duration-200">
//               Home
//             </Link> 

//             <Link to="/fleet" className="text-[#E9E6DD] hover:text-[#F57251] transition-colors duration-200">
//               Fleet
//             </Link>

//             <Link to="/about" className="text-[#E9E6DD] hover:text-[#F57251] transition-colors duration-200">
//               About Us
//             </Link>

//             <Link to="/contact" className="text-[#E9E6DD] hover:text-[#F57251] transition-colors duration-200">
//               Contact Us
//             </Link>

//             {/* {/* <Link to="/contact" className="text-[#E9E6DD] hover:text-[#F57251] transition-colors duration-200">
//               Contact
//             </Link>
//           </div> */}

//           {/* Right-side actions */}
//           <div className="flex items-center space-x-8">
//             {/* Login */ }
//              <Link
//               to="/login"
//               className="text-[#E9E6DD] hover:text-[#F57251] transition-colors duration-200"
//             >
//               Login
//             </Link>

//             {/* Sign Up */}
//             <Link
//               to="/register"
//               className="bg-[#F57251] text-[#E9E6DD] px-6 py-2 rounded-full hover:bg-[#e56546] transition-colors duration-200"
//             >
//               Sign Up
//             </Link>

//             {/* Rent Now */}
//             <Link
//               to="/login"
//               className="bg-[#027480] text-[#E9E6DD] px-6 py-2 rounded-full hover:bg-[#F57251] transition-colors duration-200"
//             >
//               Rent Now
//             </Link >

//             {/* User Dropdown */}
//             {/* <div className="dropdown dropdown-end">
//               <div
//                 tabIndex={0}
//                 role="button"
//                 className="btn btn-ghost btn-circle avatar"
//               >
//                 <div className="w-10 rounded-full bg-[#D6CC99] flex items-center justify-center">
//                   <span className="text-[#001524] font-semibold">U</span>
//                 </div>
//               </div>

//               {/* <ul
//                 tabIndex={0}
//                 className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-[#001524] rounded-box w-52"
//               >
//                 <li>
//                   <Link to ="" className="text-[#E9E6DD] hover:text-[#F57251]">Profile</Link>
//                 </li>
//                 <li>
//                   <Link to ="" className="text-[#E9E6DD] hover:text-[#F57251]">My Bookings</Link>
//                 </li>
//                 <li>
//                   <button className="text-[#E9E6DD] hover:text-[#F57251]">Logout</button>
//                 </li>
//               </ul> */}
//             {/* </div> */}

//           </div>

//         </div>
//         </div>
//       </nav>
//     </div>
//   );
// };

// export default Navbar;

