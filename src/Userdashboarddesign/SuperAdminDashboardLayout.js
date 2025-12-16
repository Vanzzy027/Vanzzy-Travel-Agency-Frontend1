import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet, Link } from 'react-router-dom';
import { ShieldCheck, Users, Settings, LogOut } from 'lucide-react';
//import DashboardNavbar from '../components/DashboardNavbar';
const SuperAdminDashboardLayout = () => {
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 flex", children: [_jsxs("div", { className: "w-64 bg-[#2D0015] min-h-screen flex flex-col text-white", children: [_jsx("div", { className: "p-6 border-b border-white/10", children: _jsxs("h2", { className: "text-2xl font-bold", children: ["Super", _jsx("span", { className: "text-[#F57251]", children: "Admin" })] }) }), _jsxs("nav", { className: "flex-1 p-4 space-y-2", children: [_jsxs(Link, { to: "/super-admin", className: "flex items-center gap-3 p-3 hover:bg-white/10 rounded", children: [_jsx(ShieldCheck, {}), " Overview"] }), _jsxs(Link, { to: "/super-admin/manage-admins", className: "flex items-center gap-3 p-3 hover:bg-white/10 rounded", children: [_jsx(Users, {}), " Manage Admins"] }), _jsxs(Link, { to: "/super-admin/settings", className: "flex items-center gap-3 p-3 hover:bg-white/10 rounded", children: [_jsx(Settings, {}), " Global Settings"] })] }), _jsx("div", { className: "p-4 border-t border-white/10", children: _jsxs(Link, { to: "/login", className: "flex items-center gap-3 text-red-400", children: [_jsx(LogOut, {}), " Logout"] }) })] }), _jsx("main", { className: "flex-1 p-8 overflow-y-auto", children: _jsx(Outlet, {}) })] }));
};
export default SuperAdminDashboardLayout;
