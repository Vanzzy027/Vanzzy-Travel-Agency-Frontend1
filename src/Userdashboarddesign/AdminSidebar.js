import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/slice/AuthSlice';
import { LayoutDashboard, Users, Car, CalendarDays, 
// Settings, 
// MessageSquare, 
BarChart3, LogOut, Receipt, CreditCard, 
// Shield,
// Home,
LifeBuoy, HelpCircle } from 'lucide-react';
const AdminSidebar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // Get user from Redux store
    const { user } = useSelector((state) => state.auth) ||
        { user: JSON.parse(localStorage.getItem('user') || 'null') };
    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
        { icon: Users, label: 'Customers', path: '/admin/customers' },
        { icon: Car, label: 'Fleet Management', path: '/admin/fleet' },
        { icon: CalendarDays, label: 'Bookings', path: '/admin/bookings' },
        { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
        { icon: CreditCard, label: 'Payments', path: '/admin/payments' },
        // { icon: MessageSquare, label: 'Messages', path: '/admin/messages' },
        // { icon: Settings, label: 'Settings', path: '/admin/settings' },
        { icon: Receipt, label: 'Receipts', path: '/admin/receipts' },
        { icon: HelpCircle, label: 'Support', path: '/admin/support' },
        { icon: LifeBuoy, label: 'Reviews', path: '/admin/review' }
    ];
    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };
    // Get user initials for avatar
    const getUserInitials = () => {
        if (!user)
            return 'A';
        const { first_name, last_name } = user;
        return `${first_name?.[0] || ''}${last_name?.[0] || ''}`.toUpperCase() || 'A';
    };
    // Get user display name
    const getUserDisplayName = () => {
        if (!user)
            return 'Admin User';
        return `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Admin User';
    };
    // Get user role with proper capitalization
    const getUserRole = () => {
        if (!user)
            return 'Super Admin';
        const role = user.role || 'admin';
        return role === 'superAdmin' ? 'Super Admin' :
            role === 'admin' ? 'Admin' :
                role.charAt(0).toUpperCase() + role.slice(1);
    };
    return (_jsxs("div", { className: "w-64 bg-[#001524] h-screen flex flex-col border-r border-[#445048]", children: [_jsx("div", { className: "p-6 border-b border-[#445048]", children: _jsxs("h2", { className: "text-2xl font-bold text-[#E9E6DD]", children: ["Admin", _jsx("span", { className: "text-[#F57251]", children: "Panel" })] }) }), _jsx("nav", { className: "flex-1 overflow-y-auto py-4", children: _jsx("ul", { className: "space-y-1 px-3", children: menuItems.map((item, index) => (_jsx("li", { children: _jsxs(NavLink, { to: item.path, end: item.path === '/admin', className: ({ isActive }) => `
                  flex items-center space-x-3 p-3 rounded-lg transition-all duration-200
                  ${isActive
                                ? 'bg-[#027480] text-[#E9E6DD] shadow-md shadow-[#027480]/20'
                                : 'text-[#C4AD9D] hover:bg-[#445048]/50 hover:text-[#E9E6DD]'}
                `, children: [_jsx(item.icon, { size: 20 }), _jsx("span", { className: "font-medium", children: item.label })] }) }, index))) }) }), _jsxs("div", { className: "p-4 border-t border-[#445048] bg-[#00101f]", children: [_jsxs("div", { className: "flex items-center space-x-3 mb-4", children: [_jsx("div", { className: "w-10 h-10 rounded-full bg-[#D6CC99] flex items-center justify-center", children: _jsx("span", { className: "text-[#001524] font-bold", children: getUserInitials() }) }), _jsxs("div", { className: "overflow-hidden", children: [_jsx("p", { className: "text-[#E9E6DD] text-sm font-semibold truncate", children: getUserDisplayName() }), _jsx("p", { className: "text-[#C4AD9D] text-xs truncate", children: getUserRole() })] })] }), _jsxs("button", { onClick: handleLogout, className: "flex items-center space-x-2 text-[#F57251] hover:text-[#E9E6DD] w-full p-2 rounded-lg hover:bg-[#445048] transition-colors text-sm font-medium", children: [_jsx(LogOut, { size: 18 }), _jsx("span", { children: "Logout" })] })] })] }));
};
export default AdminSidebar;
