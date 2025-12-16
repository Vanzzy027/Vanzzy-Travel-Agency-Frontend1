import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import DashboardNavbar from '../components/DashboardNavbar';
const AdminDashboardLayout = () => {
    return (_jsxs("div", { className: "flex h-screen bg-[#E9E6DD]", children: [_jsx(AdminSidebar, {}), _jsxs("div", { className: "flex-1 flex flex-col overflow-hidden", children: [_jsx(DashboardNavbar, { userType: "admin" }), _jsx("main", { className: "flex-1 overflow-y-auto p-6 bg-[#E9E6DD]", children: _jsx(Outlet, {}) })] })] }));
};
export default AdminDashboardLayout;
