import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/slice/AuthSlice';
import { LayoutDashboard, Users, Car, CalendarDays, BarChart3, LogOut, Receipt, CreditCard, LifeBuoy, HelpCircle, ChevronLeft, ChevronRight } from 'lucide-react';
const AdminSidebar = ({ isCollapsed = false, onToggleCollapse, isMobile = false }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // Get user from Redux store
    const { user } = useSelector((state) => state.auth) ||
        { user: JSON.parse(localStorage.getItem('user') || 'null') };
    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };
    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
        { icon: Users, label: 'Customers', path: '/admin/customers' },
        { icon: Car, label: 'Fleet Management', path: '/admin/fleet' },
        { icon: CalendarDays, label: 'Bookings', path: '/admin/bookings' },
        { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
        { icon: CreditCard, label: 'Payments', path: '/admin/payments' },
        { icon: Receipt, label: 'Receipts', path: '/admin/receipts' },
        { icon: HelpCircle, label: 'Support', path: '/admin/support' },
        { icon: LifeBuoy, label: 'Reviews', path: '/admin/review' }
    ];
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
    // Determine if we should show labels
    const showLabels = !isCollapsed;
    return (_jsxs("div", { className: "h-screen flex flex-col bg-[#001524]", children: [_jsx("div", { className: "p-4 border-b border-[#445048] flex items-center justify-between", children: showLabels ? (_jsxs(_Fragment, { children: [_jsxs("h2", { className: "text-xl font-bold text-[#E9E6DD]", children: ["Admin", _jsx("span", { className: "text-[#F57251]", children: "Panel" })] }), isMobile && onToggleCollapse && (_jsx("button", { onClick: onToggleCollapse, className: "text-[#C4AD9D] hover:text-[#E9E6DD]", "aria-label": "Collapse sidebar", children: _jsx(ChevronLeft, { size: 20 }) }))] })) : (_jsxs("div", { className: "w-full flex flex-col items-center gap-2", children: [_jsx("div", { className: "w-8 h-8 bg-[#027480] rounded flex items-center justify-center", children: _jsx("span", { className: "text-[#E9E6DD] font-bold text-sm", children: "A" }) }), isMobile && onToggleCollapse && (_jsx("button", { onClick: onToggleCollapse, className: "text-[#C4AD9D] hover:text-[#E9E6DD]", "aria-label": "Expand sidebar", children: _jsx(ChevronRight, { size: 20 }) }))] })) }), _jsx("nav", { className: "flex-1 overflow-y-auto py-4 px-2", children: _jsx("div", { className: "space-y-1", children: menuItems.map((item, index) => (_jsxs(NavLink, { to: item.path, end: item.path === '/admin', className: ({ isActive }) => `
                flex items-center ${showLabels ? 'space-x-3 px-3' : 'justify-center px-2'} 
                py-3 rounded-lg transition-all duration-200
                ${isActive
                            ? 'bg-[#027480] text-[#E9E6DD] shadow-md'
                            : 'text-[#C4AD9D] hover:bg-[#445048]/50 hover:text-[#E9E6DD]'}
              `, title: !showLabels ? item.label : undefined, children: [_jsx(item.icon, { size: 20 }), showLabels && _jsx("span", { className: "font-medium text-sm", children: item.label })] }, index))) }) }), _jsx("div", { className: "p-3 border-t border-[#445048] bg-[#00101f]", children: showLabels ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex items-center space-x-3 mb-4 p-2", children: [_jsx("div", { className: "w-10 h-10 rounded-full bg-[#D6CC99] flex items-center justify-center", children: _jsx("span", { className: "text-[#001524] font-bold text-sm", children: getUserInitials() }) }), _jsxs("div", { className: "overflow-hidden", children: [_jsx("p", { className: "text-[#E9E6DD] text-sm font-semibold truncate", children: getUserDisplayName() }), _jsx("p", { className: "text-[#C4AD9D] text-xs truncate", children: getUserRole() })] })] }), _jsxs("button", { onClick: handleLogout, className: "flex items-center space-x-3 px-3 py-3 rounded-lg text-[#F57251] hover:bg-[#445048]/50 hover:text-[#E9E6DD] transition-all duration-200 w-full", children: [_jsx(LogOut, { size: 20 }), _jsx("span", { className: "font-medium text-sm", children: "Logout" })] })] })) : (_jsxs(_Fragment, { children: [_jsx("div", { className: "flex justify-center mb-4 p-2", children: _jsx("div", { className: "w-10 h-10 rounded-full bg-[#D6CC99] flex items-center justify-center", children: _jsx("span", { className: "text-[#001524] font-bold text-sm", children: getUserInitials() }) }) }), _jsx("button", { onClick: handleLogout, className: "flex items-center justify-center p-3 rounded-lg text-[#F57251] hover:bg-[#445048]/50 hover:text-[#E9E6DD] transition-all duration-200 w-full", title: "Logout", children: _jsx(LogOut, { size: 20 }) })] })) })] }));
};
export default AdminSidebar;
