// components/DashboardSidebar.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const DashboardSidebar: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/dashboard', admin: false },
    { icon: '🚗', label: 'Vehicle Fleet', path: '/dashboard/fleet', admin: false },
    { icon: '📋', label: 'Bookings', path: '/dashboard/bookings', admin: false },
    { icon: '👥', label: 'Customers', path: '/dashboard/customers', admin: true },
    { icon: '💰', label: 'Payments', path: '/dashboard/payments', admin: false },
    { icon: '🛠️', label: 'Maintenance', path: '/dashboard/maintenance', admin: false },
    { icon: '📈', label: 'Analytics', path: '/dashboard/analytics', admin: true },
    { icon: '⚙️', label: 'Settings', path: '/dashboard/settings', admin: false },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-64 bg-[#001524] min-h-screen p-6">
      {/* User Profile Section */}
      <div className="flex items-center space-x-3 p-3 bg-[#445048] rounded-lg mb-8">
        <div className="w-12 h-12 rounded-full bg-[#D6CC99] flex items-center justify-center">
          <span className="text-[#001524] font-bold text-lg">P</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[#E9E6DD] font-semibold truncate">Amrit</p>
          <p className="text-[#C4AD9D] text-sm truncate">Fleet Manager</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-[#445048] rounded-lg p-4 mb-8">
        <div className="text-center">
          <div className="text-2xl font-bold text-[#E9E6DD]">23</div>
          <div className="text-[#C4AD9D] text-sm">Active Rentals</div>
        </div>
        <div className="flex justify-between mt-3">
          <div className="text-center">
            <div className="text-lg font-bold text-[#027480]">17</div>
            <div className="text-[#C4AD9D] text-xs">Available</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-[#F57251]">3</div>
            <div className="text-[#C4AD9D] text-xs">Maintenance</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-[#D6CC99]">5</div>
            <div className="text-[#C4AD9D] text-xs">Reserved</div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <ul className="space-y-2">
        {menuItems.map((item, index) => (
          <li key={index}>
            <Link
              to={item.path}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 ${
                isActive(item.path)
                  ? 'bg-[#027480] text-[#E9E6DD] shadow-lg'
                  : 'text-[#E9E6DD] hover:bg-[#445048]'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
              {item.admin && (
                <span className="bg-[#F57251] text-[#E9E6DD] text-xs px-2 py-1 rounded-full ml-auto">
                  Admin
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>

      {/* Promo Banner */}
      <div className="mt-8 bg-gradient-to-r from-[#027480] to-[#F57251] rounded-lg p-4 text-center">
        <p className="text-[#E9E6DD] font-semibold text-sm mb-2">Upgrade to Premium</p>
        <button className="bg-[#001524] text-[#E9E6DD] px-4 py-2 rounded-lg text-sm hover:bg-[#445048] transition-colors">
          Learn More
        </button>
      </div>
    </div>
  );
};

export default DashboardSidebar;