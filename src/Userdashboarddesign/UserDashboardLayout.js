import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import UserSidebar from "./UserSidebar";
import DashboardNavbar from "../components/DashboardNavbar";
import { Outlet } from "react-router-dom";
import AIChatBot from "../components/AIChatBot";
const UserDashboardLayout = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
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
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
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
    /*
      LAYOUT LOGIC:
      1. Sidebar is always FIXED on the left.
      2. Sidebar Width toggles between w-20 (icons) and w-64 (labels).
      3. Main Content Margin:
         - Desktop: Matches sidebar width (ml-20 or ml-64) so it pushes content.
         - Mobile: ALWAYS ml-20. When sidebar expands to w-64, it floats OVER the content.
    */
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 relative", children: [isMobile && !isSidebarCollapsed && (_jsx("div", { className: "fixed inset-0 bg-black/50 z-30 transition-opacity duration-300 backdrop-blur-sm", onClick: closeSidebar })), _jsx("aside", { className: `
          fixed top-0 left-0 h-full bg-[#001524] z-40
          transition-all duration-300 ease-in-out shadow-2xl
          ${isSidebarCollapsed ? "w-20" : "w-64"}
        `, children: _jsx(UserSidebar, { isCollapsed: isSidebarCollapsed, onToggleCollapse: toggleSidebar, isMobile: isMobile }) }), _jsxs("div", { className: `
    flex-1 flex flex-col min-h-screen
    transition-all duration-300 ease-in-out
    ${isMobile ? "ml-20" : isSidebarCollapsed ? "ml-24" : "ml-72"} 
  `, children: [_jsx(DashboardNavbar, { userType: "user" }), _jsxs("main", { className: "p-4 md:p-6", children: [_jsx(Outlet, {}), _jsx("button", { onClick: () => setIsChatOpen(true), className: "fixed bottom-3 right-4 z-50 bg-[#027480] text-white px-5 py-3 rounded-full \nflex items-center gap-2\ntransition-all duration-300\nhover:scale-110 active:scale-95\nshadow-[0_0_15px_rgba(2,116,128,0.7)]\nanimate-pulse", children: _jsx("span", { className: "text-sm font-bold uppercase tracking-wider", children: "Chat" }) }), isChatOpen && _jsx(AIChatBot, { onClose: () => setIsChatOpen(false) })] })] })] }));
};
export default UserDashboardLayout;
