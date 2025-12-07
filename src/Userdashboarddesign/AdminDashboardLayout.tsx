

// import React from 'react';
// import { Outlet } from 'react-router-dom'; // 1. Import Outlet
// //import Navbar from '../components/Navbar';
// import AdminSidebar from '../Userdashboarddesign/AdminSidebar'; // Adjust path if needed
// import AdminNavbar from '../components/AdminNavbar';

// const AdminDashboardLayout: React.FC = () => { 

//     return (
//         <div className="min-h-screen bg-gray-50 flex">
//             {/* Sidebar */}
//             <AdminSidebar />

//             <div className="flex-1 flex flex-col">
//                 {/* Top Navbar */}
//                 <AdminNavbar />

//                 {/* Main Content */}
//                 <main className="flex-1 p-6 transition-all duration-300">
//                     {/* 4. Replace {children} with <Outlet /> */}
//                     <Outlet /> 
//                 </main>
//             </div>
//         </div>
//     );
// };

// export default AdminDashboardLayout;

// src/layouts/AdminDashboardLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import DashboardNavbar from '../components/DashboardNavbar';

const AdminDashboardLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-[#E9E6DD]">
      {/* Sidebar - full height, fixed */}
      <AdminSidebar />
      
      {/* Main content area - scrollable */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar - fixed in remaining space */}
        <DashboardNavbar userType="admin" />
        
        {/* Scrollable content area */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#E9E6DD]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;