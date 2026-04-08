import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import DashboardNavbar from '../components/DashboardNavbar';
const AdminDashboardLayout = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    // Detect screen size
    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 1024; // 1024px is standard lg breakpoint
            setIsMobile(mobile);
            // Auto-collapse on mobile, Expand on desktop by default
            if (mobile) {
                setIsSidebarCollapsed(true);
            }
            else {
                setIsSidebarCollapsed(false);
            }
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);
    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };
    // Explicit close function for the backdrop click
    const closeSidebar = () => {
        if (isMobile) {
            setIsSidebarCollapsed(true);
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 relative", children: [isMobile && !isSidebarCollapsed && (_jsx("div", { className: "fixed inset-0 bg-black/50 z-30 transition-opacity duration-300 backdrop-blur-sm", onClick: closeSidebar })), _jsx("aside", { className: `
          fixed top-0 left-0 h-full bg-[#001524] z-40
          transition-all duration-300 ease-in-out shadow-2xl
          ${isSidebarCollapsed ? 'w-20' : 'w-64'}
        `, children: _jsx(AdminSidebar, { isCollapsed: isSidebarCollapsed, onToggleCollapse: toggleSidebar, isMobile: isMobile }) }), _jsxs("div", { className: `
          flex-1 flex flex-col min-h-screen
          transition-all duration-300 ease-in-out
          ${ /*
                   On Mobile: Always keep 20 margin so icons are visible,
                   but content stays put when sidebar expands over it.
                   On Desktop: Margin moves with sidebar.
                */''}
          ${isMobile ? 'ml-20' : (isSidebarCollapsed ? 'ml-20' : 'ml-64')}
        `, children: [_jsx(DashboardNavbar, { userType: "admin" }), _jsx("main", { className: "flex-1 p-4 md:p-6 overflow-x-hidden", children: _jsx(Outlet, {}) })] })] }));
};
export default AdminDashboardLayout;
