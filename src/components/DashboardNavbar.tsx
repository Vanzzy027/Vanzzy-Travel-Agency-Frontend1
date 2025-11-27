// components/DashboardNavbar.tsx
import React from 'react';

const DashboardNavbar: React.FC = () => {
  return (
    <div className="p-4 bg-[#E9E6DD]">
      <nav className="max-w-7xl mx-auto bg-[#001524] rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-[#027480] flex items-center justify-center">
              <span className="text-[#E9E6DD] font-bold text-lg">V</span>
            </div>
            <span className="text-[#E9E6DD] text-xl font-bold">VansKE Dashboard</span>
          </div>

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search dashboard..."
                className="w-full bg-[#445048] text-[#E9E6DD] placeholder-[#C4AD9D] rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#027480]"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <span className="text-[#C4AD9D]">🔍</span>
              </div>
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                <div className="indicator">
                  <svg className="w-6 h-6 text-[#E9E6DD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.5 3.75a6 6 0 0 0-6 6v2.25l-2.47 2.47a.75.75 0 0 0 .53 1.28h15.88a.75.75 0 0 0 .53-1.28L16.5 12V9.75a6 6 0 0 0-6-6z" />
                  </svg>
                  <span className="badge badge-xs badge-primary indicator-item bg-[#F57251]">3</span>
                </div>
              </div>
              <div tabIndex={0} className="mt-3 z-[1] card card-compact dropdown-content w-52 bg-[#001524] shadow">
                <div className="card-body">
                  <span className="font-bold text-lg text-[#E9E6DD]">3 Notifications</span>
                  <div className="text-[#C4AD9D]">
                    <div className="border-b border-[#445048] py-2">New booking request</div>
                    <div className="border-b border-[#445048] py-2">Vehicle maintenance due</div>
                    <div className="py-2">Payment received</div>
                  </div>
                </div>
              </div>
            </div>

            {/* User Profile */}
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full bg-[#D6CC99] flex items-center justify-center">
                  <span className="text-[#001524] font-semibold">U</span>
                </div>
              </div>
              <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-[#001524] rounded-box w-52">
                <li>
                  <a className="text-[#E9E6DD] hover:text-[#F57251] justify-between">
                    Profile
                    <span className="badge bg-[#027480]">New</span>
                  </a>
                </li>
                <li><a className="text-[#E9E6DD] hover:text-[#F57251]">Settings</a></li>
                <li><a className="text-[#E9E6DD] hover:text-[#F57251]">Logout</a></li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default DashboardNavbar;