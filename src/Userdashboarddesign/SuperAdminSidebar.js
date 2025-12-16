import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const SuperAdminSidebar = () => {
    const menuItems = [
        { icon: '🏠', label: 'Dashboard', active: true },
        { icon: '👥', label: 'Customers' }, // for changing user role to admin or normal user
        { icon: '📧', label: 'Messages' },
    ];
    return (_jsxs("div", { className: "w-64 bg-[#001524] min-h-screen p-6", children: [_jsx("div", { className: "mb-8", children: _jsxs("div", { className: "relative", children: [_jsx("input", { type: "text", placeholder: "Search...", className: "w-full bg-[#027480] text-[#E9E6DD] placeholder-[#E9E6DD] rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#F57251]" }), _jsx("div", { className: "absolute left-3 top-1/2 transform -translate-y-1/2", children: _jsx("span", { className: "text-[#E9E6DD]", children: "\uD83D\uDD0D" }) })] }) }), _jsx("ul", { className: "space-y-2", children: menuItems.map((item, index) => (_jsx("li", { children: _jsxs("a", { href: "#", className: `flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 ${item.active
                            ? 'bg-[#027480] text-[#E9E6DD]'
                            : 'text-[#E9E6DD] hover:bg-[#445048]'}`, children: [_jsx("span", { className: "text-lg", children: item.icon }), _jsx("span", { className: "font-medium", children: item.label })] }) }, index))) }), _jsx("div", { className: "mt-auto pt-6", children: _jsxs("div", { className: "flex items-center space-x-3 p-3 bg-[#445048] rounded-lg", children: [_jsx("div", { className: "w-12 h-12 rounded-full bg-[#D6CC99] flex items-center justify-center", children: _jsx("span", { className: "text-[#001524] font-bold text-lg", children: "V" }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-[#E9E6DD] font-semibold truncate", children: "Vans" }), _jsx("p", { className: "text-[#C4AD9D] text-sm truncate", children: "Fleet Manager" })] })] }) })] }));
};
export default SuperAdminSidebar;
