import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ShieldCheck, Users, Settings, LogOut } from 'lucide-react';
//import DashboardNavbar from '../components/DashboardNavbar';

const SuperAdminDashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
              
      {/* Super Admin Sidebar - Distinct Color (e.g., Dark Red/Purple) */}
      <div className="w-64 bg-[#2D0015] min-h-screen flex flex-col text-white">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold">Super<span className="text-[#F57251]">Admin</span></h2>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/super-admin" className="flex items-center gap-3 p-3 hover:bg-white/10 rounded">
            <ShieldCheck /> Overview
          </Link>
          <Link to="/super-admin/manage-admins" className="flex items-center gap-3 p-3 hover:bg-white/10 rounded">
            <Users /> Manage Admins
          </Link>
          <Link to="/super-admin/settings" className="flex items-center gap-3 p-3 hover:bg-white/10 rounded">
            <Settings /> Global Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link to="/login" className="flex items-center gap-3 text-red-400">
            <LogOut /> Logout
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default SuperAdminDashboardLayout;