// import React from 'react';
// import { Outlet } from 'react-router-dom';
// import DashboardNavbar from '../components/DashboardNavbar';
// import UserDashboardSidebar from './UserSidebar';

// const UserDashboardLayout: React.FC = () => {
//   return (
//     <div className="flex h-screen bg-[#E9E6DD]">
//       {/* Sidebar - full height */}
//       <div className="flex-shrink-0">
//         <UserDashboardSidebar />
//       </div>
      
//       {/* Main content area - scrollable */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         {/* Navbar - fixed in remaining space */}
//         <DashboardNavbar />
        
//         {/* Scrollable content area */}
//         <main className="flex-1 overflow-y-auto p-6">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default UserDashboardLayout;



// src/layouts/UserDashboardLayout.tsx
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