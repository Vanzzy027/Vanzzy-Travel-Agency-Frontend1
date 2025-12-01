// import React from 'react'
// import Navbar from '../components/Navbar'
// import AdminSidebar from './AdminSidebar'

// const AdminDashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {



//     return (
//         <div className="min-h-screen bg-gray-50">
//             {/* Top Navbar */}
//             <Navbar />

//             {/* Layout Container */}
//             <div className="flex">
//                 {/* Sidebar */}
//                 <AdminSidebar />

//                 {/* Main Content */}
//                 <main className="flex-1 transition-all duration-300  ml-64" >
//                     <div className="p-6 min-h-[calc(100vh-128px)] ">
//                         {children}
//                     </div>
//                 </main>
//             </div>

//             {/* Footer positioned at bottom */}
//             <div className="transition-all duration-300 " >

//             </div>
//         </div>
//     )
// }

// export default AdminDashboardLayout



import React from 'react';
import { Outlet } from 'react-router-dom'; // 1. Import Outlet
import Navbar from '../components/Navbar';
import AdminSidebar from '../Userdashboarddesign/AdminSidebar'; // Adjust path if needed

// 2. Remove the Interface requiring children
// interface DashboardLayoutProps {
//    children: React.ReactNode
// }

// 3. Remove props from the component definition
const AdminDashboardLayout: React.FC = () => { 

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <AdminSidebar />

            <div className="flex-1 flex flex-col">
                {/* Top Navbar */}
                <Navbar />

                {/* Main Content */}
                <main className="flex-1 p-6 transition-all duration-300">
                    {/* 4. Replace {children} with <Outlet /> */}
                    <Outlet /> 
                </main>
            </div>
        </div>
    );
};

export default AdminDashboardLayout;