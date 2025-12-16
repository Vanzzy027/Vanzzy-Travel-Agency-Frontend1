import React from "react";
import {  Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <div className="p-4 bg-[#E9E6DD]">
      <nav className="max-w-7xl mx-auto bg-[#001524] rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between">
          
          {/* Brand */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-[#027480] flex items-center justify-center">
              <span className="text-[#E9E6DD] font-bold text-lg">V</span>
            </div>

            <div>
              <h1 className="text-2xl font-bold text-[#E9E6DD]">VansKE Car Rental</h1>
              <p className="text-[#C4AD9D] text-sm">Luxury & Performance</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-[#E9E6DD] hover:text-[#F57251] transition-colors duration-200">
              Home
            </Link> 

            <Link to="/fleet" className="text-[#E9E6DD] hover:text-[#F57251] transition-colors duration-200">
              Fleet
            </Link>

            <Link to="/about" className="text-[#E9E6DD] hover:text-[#F57251] transition-colors duration-200">
              About Us
            </Link>

            <Link to="/contact" className="text-[#E9E6DD] hover:text-[#F57251] transition-colors duration-200">
              Contact Us
            </Link>

            {/* {/* <Link to="/contact" className="text-[#E9E6DD] hover:text-[#F57251] transition-colors duration-200">
              Contact
            </Link>
          </div> */}

          {/* Right-side actions */}
          <div className="flex items-center space-x-8">
            {/* Login */ }
             <Link
              to="/login"
              className="text-[#E9E6DD] hover:text-[#F57251] transition-colors duration-200"
            >
              Login
            </Link>

            {/* Sign Up */}
            <Link
              to="/register"
              className="bg-[#F57251] text-[#E9E6DD] px-6 py-2 rounded-full hover:bg-[#e56546] transition-colors duration-200"
            >
              Sign Up
            </Link>

            {/* Rent Now */}
            <Link
              to="/login"
              className="bg-[#027480] text-[#E9E6DD] px-6 py-2 rounded-full hover:bg-[#F57251] transition-colors duration-200"
            >
              Rent Now
            </Link >

            {/* User Dropdown */}
            {/* <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full bg-[#D6CC99] flex items-center justify-center">
                  <span className="text-[#001524] font-semibold">U</span>
                </div>
              </div>

              {/* <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-[#001524] rounded-box w-52"
              >
                <li>
                  <Link to ="" className="text-[#E9E6DD] hover:text-[#F57251]">Profile</Link>
                </li>
                <li>
                  <Link to ="" className="text-[#E9E6DD] hover:text-[#F57251]">My Bookings</Link>
                </li>
                <li>
                  <button className="text-[#E9E6DD] hover:text-[#F57251]">Logout</button>
                </li>
              </ul> */}
            {/* </div> */}

          </div>

        </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;

