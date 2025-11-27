import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardNavbar from '../components/DashboardNavbar';
import UserDashboardSidebar from './UserSidebar';

const UserDashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#E9E6DD]">
      <DashboardNavbar />
      <div className="flex">
        <UserDashboardSidebar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserDashboardLayout;


