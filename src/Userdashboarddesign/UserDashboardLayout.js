import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet } from 'react-router-dom';
import UserDashboardSidebar from './UserSidebar';
import DashboardNavbar from '../components/DashboardNavbar';
import AIChatBot from '../components/AIChatBot';
const UserDashboardLayout = () => {
    return (_jsxs("div", { className: "flex h-screen bg-[#E9E6DD]", children: [_jsx(UserDashboardSidebar, {}), _jsxs("div", { className: "flex-1 flex flex-col overflow-hidden", children: [_jsx(DashboardNavbar, { userType: "user" }), _jsxs("main", { className: "flex-1 overflow-y-auto p-6 bg-[#E9E6DD]", children: [_jsx(Outlet, {}), _jsx(AIChatBot, {})] })] })] }));
};
export default UserDashboardLayout;
