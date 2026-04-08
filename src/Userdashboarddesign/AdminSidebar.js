import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/slice/AuthSlice';
import { LayoutDashboard, Users, Car, CalendarDays, BarChart3, LogOut, Receipt, CreditCard, LifeBuoy, HelpCircle, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
const AdminSidebar = ({ isCollapsed, onToggleCollapse, isMobile }) => {
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
    ];
    const bottomItems = [
        { icon: HelpCircle, label: 'Support', path: '/admin/support' },
        { icon: LifeBuoy, label: 'Reviews', path: '/admin/review' },
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
    // Logic: Show labels if sidebar is NOT collapsed
    const showLabels = !isCollapsed;
    // Handle clicking a link on mobile -> Close the sidebar to see content
    const handleLinkClick = () => {
        if (isMobile && !isCollapsed) {
            onToggleCollapse();
        }
    };
    return (_jsxs("div", { className: "h-full flex flex-col bg-[#001524] text-[#E9E6DD] overflow-hidden", children: [_jsxs("div", { className: "h-16 flex items-center justify-between px-4 border-b border-[#445048] flex-shrink-0", children: [_jsx("div", { className: `transition-opacity duration-200 ${showLabels ? 'opacity-100' : 'opacity-0 w-0 hidden'}`, children: _jsxs("h2", { className: "text-xl font-bold whitespace-nowrap", children: ["Admin", _jsx("span", { className: "text-[#F57251]", children: "Panel" })] }) }), _jsx("div", { className: `${!showLabels ? 'mx-auto' : 'hidden'}`, children: _jsx("div", { className: "w-8 h-8 bg-[#027480] rounded flex items-center justify-center font-bold", children: "A" }) }), showLabels && (_jsx("button", { onClick: onToggleCollapse, className: "p-1 rounded-md hover:bg-[#445048] text-[#C4AD9D] transition-colors", children: _jsx(ChevronLeft, { size: 20 }) }))] }), !showLabels && (_jsx("div", { className: "flex justify-center py-2 border-b border-[#445048]", children: _jsx("button", { onClick: onToggleCollapse, className: "p-1 rounded-md hover:bg-[#445048] text-[#C4AD9D]", children: isMobile ? _jsx(Menu, { size: 20 }) : _jsx(ChevronRight, { size: 20 }) }) })), _jsxs("nav", { className: "flex-1 overflow-y-auto py-4 px-2 custom-scrollbar", children: [_jsx("div", { className: "space-y-1", children: menuItems.map((item, index) => (_jsxs(NavLink, { to: item.path, onClick: handleLinkClick, end: item.path === '/admin', className: ({ isActive }) => `
                flex items-center rounded-lg transition-all duration-200 group
                ${showLabels ? 'px-3 py-3 space-x-3' : 'justify-center py-3 px-2'}
                ${isActive
                                ? 'bg-[#027480] text-[#E9E6DD] shadow-md'
                                : 'text-[#C4AD9D] hover:bg-[#445048]/50 hover:text-[#E9E6DD]'}
              `, title: !showLabels ? item.label : '', children: [_jsx(item.icon, { size: 22, className: "flex-shrink-0" }), _jsx("span", { className: `whitespace-nowrap transition-all duration-300 origin-left
                ${showLabels ? 'w-auto opacity-100' : 'w-0 opacity-0 hidden'}
              `, children: item.label }), !isMobile && !showLabels && (_jsx("div", { className: "absolute left-16 bg-[#00101f] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none z-50 whitespace-nowrap border border-[#445048]", children: item.label }))] }, index))) }), _jsx("div", { className: "mt-8 pt-4 border-t border-[#445048]/50 space-y-1", children: bottomItems.map((item, index) => (_jsxs(NavLink, { to: item.path, onClick: handleLinkClick, className: ({ isActive }) => `
                flex items-center rounded-lg transition-all duration-200 group
                ${showLabels ? 'px-3 py-3 space-x-3' : 'justify-center py-3 px-2'}
                ${isActive
                                ? 'bg-[#027480] text-[#E9E6DD] shadow-md'
                                : 'text-[#C4AD9D] hover:bg-[#445048]/50 hover:text-[#E9E6DD]'}
              `, title: !showLabels ? item.label : '', children: [_jsx(item.icon, { size: 22, className: "flex-shrink-0" }), _jsx("span", { className: `whitespace-nowrap transition-all duration-300 origin-left
                ${showLabels ? 'w-auto opacity-100' : 'w-0 opacity-0 hidden'}
              `, children: item.label })] }, index))) })] }), _jsxs("div", { className: "p-3 border-t border-[#445048] bg-[#00101f] flex-shrink-0", children: [_jsxs("div", { className: `flex items-center ${showLabels ? 'space-x-3 mb-2' : 'justify-center mb-2'}`, children: [_jsx("div", { className: "w-9 h-9 rounded-full bg-[#D6CC99] flex items-center justify-center text-[#001524] font-bold shadow-lg flex-shrink-0", children: getUserInitials() }), showLabels && (_jsxs("div", { className: "overflow-hidden", children: [_jsx("p", { className: "text-[#E9E6DD] text-sm font-semibold truncate w-32", children: getUserDisplayName() }), _jsx("p", { className: "text-[#C4AD9D] text-xs truncate", children: getUserRole() })] }))] }), _jsxs("button", { onClick: () => { handleLogout(); handleLinkClick(); }, className: `
            flex items-center rounded-lg text-[#F57251] hover:bg-[#445048]/50 hover:text-[#E9E6DD] transition-all duration-200 w-full
            ${showLabels ? 'px-3 py-3 space-x-3' : 'justify-center py-3 px-2'}
          `, title: !showLabels ? "Logout" : undefined, children: [_jsx(LogOut, { size: 20, className: "flex-shrink-0" }), showLabels && _jsx("span", { className: "font-medium text-sm", children: "Logout" })] })] })] }));
};
export default AdminSidebar;
