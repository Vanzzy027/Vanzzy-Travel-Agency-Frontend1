import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Car, 
  CalendarDays, 
  Wallet, 
  Settings, 
  MessageSquare, 
  BarChart3, 
  LogOut 
} from 'lucide-react';

const AdminSidebar: React.FC = () => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Users, label: 'Customers', path: '/admin/customers' },
    { icon: Car, label: 'Fleet Management', path: '/admin/fleet' },
    { icon: CalendarDays, label: 'Bookings', path: '/admin/bookings' },
    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
    { icon: Wallet, label: 'Payments', path: '/admin/payments' },
    { icon: MessageSquare, label: 'Messages', path: '/admin/messages' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <div className="w-64 bg-[#001524] min-h-screen flex flex-col border-r border-[#445048]">
      {/* Brand */}
      <div className="p-6 border-b border-[#445048]">
        <h2 className="text-2xl font-bold text-[#E9E6DD]">
          Admin<span className="text-[#F57251]">Panel</span>
        </h2>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {menuItems.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.path}
                end={item.path === '/admin'} // Only exact match for home
                className={({ isActive }) => `
                  flex items-center space-x-3 p-3 rounded-lg transition-all duration-200
                  ${isActive 
                    ? 'bg-[#027480] text-[#E9E6DD] shadow-md shadow-[#027480]/20' 
                    : 'text-[#C4AD9D] hover:bg-[#445048]/50 hover:text-[#E9E6DD]'}
                `}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Admin Profile & Logout */}
      <div className="p-4 border-t border-[#445048] bg-[#00101f]">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#D6CC99] flex items-center justify-center">
            <span className="text-[#001524] font-bold">A</span>
          </div>
          <div className="overflow-hidden">
            <p className="text-[#E9E6DD] text-sm font-semibold truncate">Admin User</p>
            <p className="text-[#C4AD9D] text-xs truncate">Super Admin</p>
          </div>
        </div>
        <button className="flex items-center space-x-2 text-[#F57251] hover:text-[#E9E6DD] w-full p-2 rounded-lg hover:bg-[#445048] transition-colors text-sm font-medium">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;