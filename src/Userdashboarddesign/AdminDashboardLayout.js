import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
// AdminDashboardLayout.tsx
import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import DashboardNavbar from '../components/DashboardNavbar';
import { Menu, X } from 'lucide-react';
const AdminDashboardLayout = () => {
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
            }
            else {
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
        }
        else {
            setIsSidebarCollapsed(!isSidebarCollapsed);
        }
    };
    const handleOverlayClick = () => {
        if (isMobile && isSidebarOpen) {
            setIsSidebarOpen(false);
        }
    };
    return (_jsxs("div", { className: "relative min-h-screen bg-gray-50", children: [!isMobile && (_jsx("div", { className: `
          fixed left-0 top-0 h-screen bg-[#001524] z-30
          transition-all duration-300 ease-in-out
          ${isSidebarCollapsed ? 'w-20' : 'w-64'}
          shadow-xl
        `, children: _jsx(AdminSidebar, { isCollapsed: isSidebarCollapsed, onToggleCollapse: toggleSidebar, isMobile: false }) })), isMobile && isSidebarOpen && (_jsxs(_Fragment, { children: [_jsx("div", { className: "fixed inset-0 bg-black/30 z-40", onClick: handleOverlayClick }), _jsx("div", { className: `
            fixed left-0 top-0 h-screen bg-[#001524] z-50
            transition-all duration-300 ease-in-out
            ${isSidebarCollapsed ? 'w-20' : 'w-64'}
            shadow-2xl
          `, children: _jsx(AdminSidebar, { isCollapsed: false, onToggleCollapse: toggleSidebar, isMobile: true }) })] })), _jsxs("div", { className: `
        min-h-screen w-full transition-all duration-300
        ${!isMobile && isSidebarCollapsed ? 'ml-20' : ''}
        ${!isMobile && !isSidebarCollapsed ? 'ml-64' : ''}
      `, children: [_jsx("header", { className: "sticky top-0 z-20 bg-white border-b border-gray-200 px-4 py-3", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("button", { onClick: toggleSidebar, className: "p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 lg:hidden", "aria-label": isSidebarOpen ? "Close sidebar" : "Open sidebar", children: isSidebarOpen ? _jsx(X, { size: 24 }) : _jsx(Menu, { size: 24 }) }), _jsx("button", { onClick: toggleSidebar, className: "p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 hidden lg:block", "aria-label": isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar", children: _jsx(Menu, { size: 24 }) }), _jsx("h1", { className: "text-lg font-semibold text-gray-800", children: "Admin Dashboard" })] }), _jsx("div", { className: "flex items-center gap-3", children: _jsx("div", { className: "w-8 h-8 bg-gradient-to-tr from-[#027480] to-[#F57251] rounded-full flex items-center justify-center text-white font-bold", children: "A" }) })] }) }), _jsx(DashboardNavbar, { userType: "admin" }), _jsx("main", { className: "p-4 md:p-6", children: _jsx(Outlet, {}) })] })] }));
};
export default AdminDashboardLayout;
