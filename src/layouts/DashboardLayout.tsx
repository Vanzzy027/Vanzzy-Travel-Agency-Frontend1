import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardNavbar from '../components/DashboardNavbar';
import DashboardSidebar from '../components/DashboardSidebar';
import UserSidebar from '../Userdashboarddesign/UserSidebar';

const DashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#E9E6DD]">
      <DashboardNavbar />
      <div className="flex">
        <UserSidebar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
