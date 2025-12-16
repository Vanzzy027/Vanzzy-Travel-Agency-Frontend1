// AdminDashboardLayout.tsx
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import DashboardNavbar from '../components/DashboardNavbar';
import { Menu, X } from 'lucide-react';

const AdminDashboardLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Detect screen size
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      
      if (mobile) {
        setIsSidebarCollapsed(true);
        setIsSidebarOpen(false);
      } else {
        setIsSidebarCollapsed(false);
        setIsSidebarOpen(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(!isSidebarOpen);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  const handleOverlayClick = () => {
    if (isMobile && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Desktop Sidebar - Fixed position */}
      {!isMobile && (
        <div className={`
          fixed left-0 top-0 h-screen bg-[#001524] z-30
          transition-all duration-300 ease-in-out
          ${isSidebarCollapsed ? 'w-20' : 'w-64'}
          shadow-xl
        `}>
          <AdminSidebar
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={toggleSidebar}
            isMobile={false}
          />
        </div>
      )}

      {/* Mobile Overlay Sidebar */}
      {isMobile && isSidebarOpen && (
        <>
          {/* Overlay backdrop */}
          <div 
            className="fixed inset-0 bg-black/30 z-40"
            onClick={handleOverlayClick}
          />
          
          {/* Sidebar */}
          <div className={`
            fixed left-0 top-0 h-screen bg-[#001524] z-50
            transition-all duration-300 ease-in-out
            ${isSidebarCollapsed ? 'w-20' : 'w-64'}
            shadow-2xl
          `}>
            <AdminSidebar
              isCollapsed={false}
              onToggleCollapse={toggleSidebar}
              isMobile={true}
            />
          </div>
        </>
      )}

      {/* Main Content Area */}
      <div className={`
        min-h-screen w-full transition-all duration-300
        ${!isMobile && isSidebarCollapsed ? 'ml-20' : ''}
        ${!isMobile && !isSidebarCollapsed ? 'ml-64' : ''}
      `}>
        {/* Top Header */}
        <header className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 lg:hidden"
                aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
              >
                {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 hidden lg:block"
                aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <Menu size={24} />
              </button>
              
              <h1 className="text-lg font-semibold text-gray-800">
                Admin Dashboard
              </h1>
            </div>
            
            {/* Admin profile */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-tr from-[#027480] to-[#F57251] rounded-full flex items-center justify-center text-white font-bold">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Navbar */}
        <DashboardNavbar userType="admin" />
        
        {/* Page Content */}
        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;


// // AdminDashboardLayout.tsx
// import React, { useState, useEffect } from 'react';
// import { Outlet } from 'react-router-dom';
// import AdminSidebar from './AdminSidebar';
// import DashboardNavbar from '../components/DashboardNavbar'; // ADD THIS IMPORT

// const AdminDashboardLayout: React.FC = () => {
//   const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);

//   // Detect screen size
//   useEffect(() => {
//     const checkMobile = () => {
//       const mobile = window.innerWidth < 1024;
//       setIsMobile(mobile);
      
//       // On mobile, start with collapsed sidebar (icons only)
//       if (mobile) {
//         setIsSidebarCollapsed(true);
//       } else {
//         // On desktop, start with expanded sidebar
//         setIsSidebarCollapsed(false);
//       }
//     };
    
//     checkMobile();
//     window.addEventListener('resize', checkMobile);
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   const toggleSidebar = () => {
//     setIsSidebarCollapsed(!isSidebarCollapsed);
//   };

//   // Determine sidebar width
//   const sidebarWidth = isSidebarCollapsed ? 'w-20' : 'w-64';
//   const contentMargin = isSidebarCollapsed ? 'ml-20' : 'ml-64';

//   return (
//     <div className="flex h-screen bg-gray-50">
//       {/* Sidebar - Always visible */}
//       <div className={`
//         ${sidebarWidth}
//         bg-[#001524] h-full
//         transition-all duration-300 ease-in-out
//         flex-shrink-0
//       `}>
//         <AdminSidebar
//           isCollapsed={isSidebarCollapsed}
//           onToggleCollapse={toggleSidebar}
//           isMobile={isMobile}
//         />
//       </div>

//       {/* Main Content */}
//       <div className={`
//         flex-1 flex flex-col
//         transition-all duration-300 ease-in-out
//         ${contentMargin}
//       `}>
//         {/* Dashboard Navbar - REPLACED the simple header with DashboardNavbar */}
//         <DashboardNavbar userType="admin" />
        
//         {/* Page Content */}
//         <main className="flex-1 overflow-y-auto p-4 md:p-6">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboardLayout;

