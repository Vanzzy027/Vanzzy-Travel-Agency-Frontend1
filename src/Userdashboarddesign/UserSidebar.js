import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useSelector } from 'react-redux';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Home, Car, CalendarDays, CreditCard, Settings, HelpCircle, LogOut, User, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
const UserSidebar = ({ isCollapsed, onToggleCollapse, isMobile }) => {
    const { user } = useSelector((state) => state.auth);
    const userFromStorage = JSON.parse(localStorage.getItem('user') || '{}');
    const displayUser = user || userFromStorage;
    const userInitial = displayUser?.first_name ? displayUser.first_name[0].toUpperCase() : 'U';
    const location = useLocation();
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };
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
        { icon: LogOut, label: 'Logout', action: handleLogout },
    ];
    const isActive = (path) => {
        if (path === '/UserDashboard')
            return location.pathname === '/UserDashboard';
        return location.pathname.startsWith(path);
    };
    // Logic: Show labels if sidebar is NOT collapsed
    const showLabels = !isCollapsed;
    // Handle clicking a link on mobile -> Close the sidebar to see content
    const handleLinkClick = () => {
        if (isMobile && !isCollapsed) {
            onToggleCollapse();
        }
    };
    return (_jsxs("div", { className: "h-full flex flex-col bg-[#001524] text-[#E9E6DD] overflow-hidden", children: [_jsxs("div", { className: "h-16 flex items-center justify-between px-4 border-b border-[#445048] flex-shrink-0", children: [_jsx("div", { className: `transition-opacity duration-200 ${showLabels ? 'opacity-100' : 'opacity-0 w-0 hidden'}`, children: _jsxs("h2", { className: "text-xl font-bold whitespace-nowrap", children: ["Rental", _jsx("span", { className: "text-[#F57251]", children: "App" })] }) }), _jsx("div", { className: `${!showLabels ? 'mx-auto' : 'hidden'}`, children: _jsx("div", { className: "w-8 h-8 bg-[#027480] rounded flex items-center justify-center font-bold", children: "R" }) }), showLabels && (_jsx("button", { onClick: onToggleCollapse, className: "p-1 rounded-md hover:bg-[#445048] text-[#C4AD9D] transition-colors", children: _jsx(ChevronLeft, { size: 20 }) }))] }), !showLabels && (_jsx("div", { className: "flex justify-center py-2 border-b border-[#445048]", children: _jsx("button", { onClick: onToggleCollapse, className: "p-1 rounded-md hover:bg-[#445048] text-[#C4AD9D]", children: isMobile ? _jsx(Menu, { size: 20 }) : _jsx(ChevronRight, { size: 20 }) }) })), _jsxs("nav", { className: "flex-1 overflow-y-auto py-4 px-2 custom-scrollbar", children: [_jsx("div", { className: "space-y-1", children: menuItems.map((item, index) => (_jsxs(NavLink, { to: item.path, onClick: handleLinkClick, className: `
                flex items-center rounded-lg transition-all duration-200 group
                ${showLabels ? 'px-3 py-3 space-x-3' : 'justify-center py-3 px-2'}
                ${isActive(item.path)
                                ? 'bg-[#027480] text-[#E9E6DD] shadow-md'
                                : 'text-[#C4AD9D] hover:bg-[#445048]/50 hover:text-[#E9E6DD]'}
              `, title: !showLabels ? item.label : '', children: [_jsx(item.icon, { size: 22, className: "flex-shrink-0" }), _jsx("span", { className: `whitespace-nowrap transition-all duration-300 origin-left
                ${showLabels ? 'w-auto opacity-100' : 'w-0 opacity-0 hidden'}
              `, children: item.label }), !isMobile && !showLabels && (_jsx("div", { className: "absolute left-16 bg-[#00101f] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none z-50 whitespace-nowrap border border-[#445048]", children: item.label }))] }, index))) }), _jsx("div", { className: "mt-8 pt-4 border-t border-[#445048]/50 space-y-1", children: bottomItems.map((item, index) => {
                            // Logic to handle button vs NavLink
                            const isButton = 'action' in item;
                            const content = (_jsxs(_Fragment, { children: [_jsx(item.icon, { size: 22, className: "flex-shrink-0" }), _jsx("span", { className: `whitespace-nowrap transition-all duration-300 origin-left
                    ${showLabels ? 'w-auto opacity-100' : 'w-0 opacity-0 hidden'}
                  `, children: item.label })] }));
                            const commonClasses = `
                flex items-center rounded-lg transition-all duration-200 w-full group
                ${showLabels ? 'px-3 py-3 space-x-3' : 'justify-center py-3 px-2'}
                text-[#C4AD9D] hover:bg-[#445048]/50 hover:text-[#F57251]
              `;
                            if (isButton) {
                                return (_jsx("button", { onClick: () => { item.action?.(); handleLinkClick(); }, className: commonClasses, children: content }, index));
                            }
                            return (_jsx(NavLink, { to: item.path, onClick: handleLinkClick, className: commonClasses, children: content }, index));
                        }) })] }), _jsx("div", { className: "p-3 border-t border-[#445048] bg-[#00101f] flex-shrink-0", children: _jsxs("div", { className: `flex items-center ${showLabels ? 'space-x-3' : 'justify-center'}`, children: [_jsx("div", { className: "w-9 h-9 rounded-full bg-gradient-to-tr from-[#027480] to-[#F57251] flex items-center justify-center text-white font-bold shadow-lg flex-shrink-0", children: userInitial }), showLabels && (_jsxs("div", { className: "overflow-hidden", children: [_jsx("p", { className: "text-[#E9E6DD] text-sm font-semibold truncate w-32", children: displayUser?.first_name || 'Guest' }), _jsx("p", { className: "text-[#C4AD9D] text-xs truncate", children: "View Profile" })] }))] }) })] }));
};
export default UserSidebar;
