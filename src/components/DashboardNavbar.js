import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// DashboardNavbar.tsx (Responsive Updated)
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Bell, Search, ChevronDown, LogOut, Settings, HelpCircle, User } from "lucide-react";
const DashboardNavbar = ({ userType }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    // Get user from Redux store or localStorage
    const { user } = useSelector((state) => state.auth) ||
        { user: JSON.parse(localStorage.getItem('user') || 'null') };
    // Get page title from path based on user type
    const getPageTitle = (path) => {
        if (userType === 'admin') {
            const adminTitles = {
                '/admin': 'Dashboard',
                '/admin/customers': 'Customers',
                '/admin/fleet': 'Fleet Management',
                '/admin/bookings': 'Bookings',
                '/admin/analytics': 'Analytics',
                '/admin/payments': 'Payments',
                '/admin/messages': 'Messages',
                '/admin/settings': 'Settings',
                '/admin/receipts': 'Receipts',
                '/admin/profile': 'Profile'
            };
            return adminTitles[path] || 'Admin Dashboard';
        }
        else {
            const userTitles = {
                '/UserDashboard': 'Overview',
                '/UserDashboard/vehicles': 'Browse Vehicles',
                '/UserDashboard/my-bookings': 'My Bookings',
                '/UserDashboard/payments': 'Payments',
                '/UserDashboard/settings': 'Settings',
                '/UserDashboard/profile': 'Profile',
                '/UserDashboard/emergency': 'Support'
            };
            return userTitles[path] || 'User Dashboard';
        }
    };
    // Get user initials
    const getUserInitials = () => {
        if (!user)
            return userType === 'admin' ? 'A' : 'U';
        const { first_name, last_name } = user;
        return `${first_name?.[0] || ''}${last_name?.[0] || ''}`.toUpperCase() ||
            (userType === 'admin' ? 'A' : 'U');
    };
    // Get user role display text
    const getUserRole = () => {
        if (!user)
            return userType === 'admin' ? 'Administrator' : 'Customer';
        const role = user.role || (userType === 'admin' ? 'admin' : 'user');
        return role === 'superAdmin' ? 'Super Administrator' :
            role === 'admin' ? 'Administrator' :
                role.charAt(0).toUpperCase() + role.slice(1);
    };
    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };
    // Get profile route based on user type - FIXED to use correct route
    const getProfileRoute = () => {
        return userType === 'admin' ? '/admin/profile' : '/UserDashboard/profile';
    };
    // Check if profile route exists in user's routes
    const canNavigateToProfile = () => {
        return true; // You might want to add actual route checking logic here
    };
    const currentPage = getPageTitle(location.pathname);
    // Fixed navigation function with validation
    const handleProfileNavigation = () => {
        const profileRoute = getProfileRoute();
        if (canNavigateToProfile()) {
            navigate(profileRoute);
            setUserMenuOpen(false);
        }
        else {
            console.warn(`Profile route ${profileRoute} not available`);
            // You could show a toast message here
        }
    };
    const handleSettingsNavigation = () => {
        const settingsRoute = userType === 'admin' ? '/admin/settings' : '/UserDashboard/settings';
        navigate(settingsRoute);
        setUserMenuOpen(false);
    };
    return (_jsx("div", { className: "p-4 bg-[#E9E6DD]", children: _jsxs("nav", { className: "max-w-7xl mx-auto bg-[#001524] rounded-2xl p-4 shadow-lg", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs(Link, { to: userType === 'admin' ? '/admin' : '/UserDashboard', className: "flex items-center space-x-2", children: [_jsx("div", { className: "w-10 h-10 rounded-full bg-[#027480] flex items-center justify-center", children: _jsx("span", { className: "text-[#E9E6DD] font-bold text-lg", children: "V" }) }), _jsxs("div", { className: "hidden sm:block", children: [_jsx("h1", { className: "text-xl sm:text-2xl font-bold text-[#E9E6DD]", children: "VansKE Car Rental" }), _jsx("p", { className: "text-[#C4AD9D] text-xs sm:text-sm", children: "Luxury & Performance" })] }), _jsx("div", { className: "sm:hidden", children: _jsx("h1", { className: "text-lg font-bold text-[#E9E6DD]", children: "VansKE" }) })] }), _jsx("div", { className: "hidden md:block", children: _jsx("h2", { className: "text-xl font-bold text-[#E9E6DD]", children: currentPage }) }), _jsxs("div", { className: "flex items-center space-x-2 sm:space-x-4", children: [_jsx("div", { className: "hidden md:block", children: _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(Search, { className: "h-4 w-4 text-[#C4AD9D]" }) }), _jsx("input", { type: "search", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), placeholder: "Search...", className: "pl-10 pr-4 py-2 w-48 bg-[#00101f] border border-[#445048] rounded-lg text-[#E9E6DD] text-sm placeholder-[#C4AD9D] focus:outline-none focus:ring-1 focus:ring-[#027480]" })] }) }), _jsxs("div", { className: "relative", children: [_jsxs("button", { onClick: () => setNotificationsOpen(!notificationsOpen), className: "relative p-2 text-[#C4AD9D] hover:text-[#E9E6DD] transition-colors", children: [_jsx(Bell, { size: 20 }), _jsx("span", { className: "absolute top-1 right-1 h-2 w-2 bg-[#F57251] rounded-full" })] }), notificationsOpen && (_jsxs("div", { className: "absolute right-0 mt-2 w-56 bg-[#001524] border border-[#445048] rounded-lg shadow-lg z-50", children: [_jsx("div", { className: "p-3 border-b border-[#445048]", children: _jsx("h3", { className: "text-[#E9E6DD] font-medium", children: "Notifications" }) }), _jsx("div", { className: "p-3", children: [1, 2, 3].map((notification) => (_jsxs("div", { className: "py-2 border-b border-[#445048] last:border-b-0 cursor-pointer hover:bg-[#00101f] px-2 rounded", children: [_jsx("p", { className: "text-[#E9E6DD] text-sm", children: userType === 'admin'
                                                                    ? `Admin notification ${notification}`
                                                                    : `User notification ${notification}` }), _jsx("p", { className: "text-[#C4AD9D] text-xs mt-1", children: "2 min ago" })] }, notification))) })] }))] }), _jsx("button", { className: "hidden md:flex p-2 text-[#C4AD9D] hover:text-[#E9E6DD] transition-colors", title: "Help & Support", children: _jsx(HelpCircle, { size: 20 }) }), _jsxs("div", { className: "relative", children: [_jsxs("button", { onClick: () => setUserMenuOpen(!userMenuOpen), className: "flex items-center space-x-2 p-2 hover:bg-[#00101f] rounded-lg transition-colors", children: [_jsx("div", { className: "w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#D6CC99] flex items-center justify-center overflow-hidden", children: _jsx("span", { className: "text-[#001524] font-bold text-sm sm:text-base", children: getUserInitials() }) }), _jsx(ChevronDown, { className: `hidden sm:block h-4 w-4 text-[#C4AD9D] transition-transform ${userMenuOpen ? 'rotate-180' : ''}` })] }), userMenuOpen && (_jsxs("div", { className: "absolute right-0 mt-2 w-56 bg-[#001524] border border-[#445048] rounded-lg shadow-lg z-50", children: [_jsxs("div", { className: "p-3 border-b border-[#445048]", children: [_jsxs("p", { className: "text-[#E9E6DD] font-medium", children: [user?.first_name, " ", user?.last_name] }), _jsx("p", { className: "text-sm text-[#C4AD9D]", children: user?.email }), _jsx("span", { className: "text-xs text-[#027480] bg-[#027480]/10 px-2 py-1 rounded mt-1 inline-block", children: getUserRole() })] }), _jsx("div", { className: "p-2", children: _jsxs("button", { onClick: handleProfileNavigation, className: "w-full text-left px-3 py-2 text-[#E9E6DD] hover:bg-[#00101f] rounded text-sm transition-colors flex items-center", children: [_jsx(User, { size: 16, className: "mr-2" }), "Profile Settings"] }) }), _jsx("div", { className: "p-2", children: _jsxs("button", { onClick: handleSettingsNavigation, className: "w-full text-left px-3 py-2 text-[#E9E6DD] hover:bg-[#00101f] rounded text-sm transition-colors flex items-center", children: [_jsx(Settings, { size: 16, className: "mr-2" }), "Settings"] }) }), _jsx("div", { className: "p-2 border-t border-[#445048]", children: _jsxs("button", { onClick: handleLogout, className: "w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm bg-[#F57251]/10 text-[#F57251] hover:bg-[#F57251] hover:text-[#001524] rounded-lg transition-colors font-medium", children: [_jsx(LogOut, { size: 16 }), _jsx("span", { children: "Logout" })] }) })] }))] })] })] }), _jsx("div", { className: "md:hidden mt-4 pt-4 border-t border-[#445048]", children: _jsx("h2", { className: "text-lg font-bold text-[#E9E6DD]", children: currentPage }) })] }) }));
};
export default DashboardNavbar;
