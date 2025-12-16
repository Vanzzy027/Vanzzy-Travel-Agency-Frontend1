
import React from 'react';
import { Outlet } from 'react-router-dom';
import UserDashboardSidebar from './UserSidebar';
import DashboardNavbar from '../components/DashboardNavbar';
import AIChatBot from '../components/AIChatBot';

const UserDashboardLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-[#E9E6DD]">
      {/* Sidebar - full height, fixed */}
      <UserDashboardSidebar />
      
      {/* Main content area - scrollable */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar - fixed in remaining space */}
        <DashboardNavbar userType="user" />
        
        {/* Scrollable content area */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#E9E6DD]">
          <Outlet />
          <AIChatBot />
        </main>
      </div>
    </div>
  );
};

export default UserDashboardLayout;