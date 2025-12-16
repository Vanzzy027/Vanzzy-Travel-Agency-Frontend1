import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Car, CalendarDays, CreditCard, Settings, HelpCircle, LogOut, User } from 'lucide-react';
const UserSidebar = () => {
    const { user } = useSelector((state) => state.auth);
    const userFromStorage = JSON.parse(localStorage.getItem('user') || '{}');
    const displayUser = user || userFromStorage;
    const userInitial = displayUser?.first_name ? displayUser.first_name[0].toUpperCase() : 'U';
    const location = useLocation();
    const menuItems = [
        { icon: Home, label: 'Overview', path: '/UserDashboard' },
        { icon: Car, label: 'Browse Vehicles', path: '/UserDashboard/vehicles' },
        { icon: CalendarDays, label: 'My Bookings', path: '/UserDashboard/my-bookings' },
        { icon: CreditCard, label: 'Payments', path: '/UserDashboard/my-payments' },
        { icon: Settings, label: 'Settings', path: '/UserDashboard/settings' },
    ];
    const bottomItems = [
        { icon: HelpCircle, label: 'Support', path: '/UserDashboard/support' },
        { icon: User, label: 'Review', path: '/UserDashboard/review' },
        { icon: LogOut, label: 'Logout', path: '/logout' },
    ];
    return (_jsxs("div", { className: "w-64 bg-[#001524] h-screen flex flex-col border-r border-[#445048]", children: [_jsx("div", { className: "p-6 border-b border-[#445048]", children: _jsxs("h2", { className: "text-2xl font-bold text-[#E9E6DD]", children: ["Rental", _jsx("span", { className: "text-[#F57251]", children: "App" })] }) }), _jsxs("nav", { className: "flex-1 overflow-y-auto py-4 px-3", children: [_jsx("p", { className: "px-3 text-xs font-semibold text-[#C4AD9D] uppercase tracking-wider mb-2", children: "Menu" }), menuItems.map((item, index) => {
                        const isActive = item.path === '/UserDashboard'
                            ? location.pathname === '/UserDashboard'
                            : location.pathname.startsWith(item.path);
                        return (_jsxs(NavLink, { to: item.path, className: ({ isActive: active }) => `
                flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 mb-1
                ${active
                                ? 'bg-[#027480] text-[#E9E6DD] shadow-md shadow-[#027480]/20'
                                : 'text-[#C4AD9D] hover:bg-[#445048]/50 hover:text-[#E9E6DD]'}
              `, end: item.path === '/UserDashboard', children: [_jsx(item.icon, { size: 20 }), _jsx("span", { className: "font-medium", children: item.label })] }, index));
                    }), _jsxs("div", { className: "pt-6", children: [_jsx("p", { className: "px-3 text-xs font-semibold text-[#C4AD9D] uppercase tracking-wider mb-2", children: "Other" }), bottomItems.map((item, index) => (_jsxs(NavLink, { to: item.path, className: "flex items-center space-x-3 px-3 py-3 rounded-lg text-[#C4AD9D] hover:bg-[#445048]/50 hover:text-[#F57251] transition-all duration-200 mb-1", children: [_jsx(item.icon, { size: 20 }), _jsx("span", { className: "font-medium", children: item.label })] }, index)))] })] }), _jsx("div", { className: "p-4 border-t border-[#445048] bg-[#00101f]", children: _jsxs("div", { className: "flex items-center space-x-3 p-2", children: [_jsx("div", { className: "w-10 h-10 rounded-full bg-gradient-to-tr from-[#027480] to-[#F57251] flex items-center justify-center text-[#E9E6DD] font-bold", children: userInitial }), _jsxs("div", { className: "flex-1 overflow-hidden", children: [_jsx("p", { className: "text-[#E9E6DD] text-sm font-semibold truncate", children: displayUser?.first_name || 'Guest' }), _jsx("p", { className: "text-[#C4AD9D] text-xs truncate", children: "View Profile" })] })] }) })] }));
};
export default UserSidebar;
