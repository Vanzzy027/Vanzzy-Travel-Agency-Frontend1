import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Navbar.tsx
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
const Navbar = () => {
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const isActive = (path) => {
        return location.pathname === path;
    };
    const navLinks = [
        { path: "/", label: "Home" },
        { path: "/fleet", label: "Fleet" },
        { path: "/about", label: "About Us" },
        { path: "/contact", label: "Contact Us" },
    ];
    return (_jsx("div", { className: "sticky top-0 z-50 p-4 bg-[#E9E6DD] shadow-md", children: _jsxs("nav", { className: "max-w-7xl mx-auto bg-[#001524] rounded-2xl p-4 shadow-lg", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs(Link, { to: "/", className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-10 h-10 rounded-full bg-[#027480] flex items-center justify-center", children: _jsx("span", { className: "text-[#E9E6DD] font-bold text-lg", children: "V" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-xl md:text-2xl font-bold text-[#E9E6DD]", children: "VansKE Car Rental" }), _jsx("p", { className: "text-[#C4AD9D] text-sm", children: "Luxury & Performance" })] })] }), _jsx("div", { className: "hidden lg:flex items-center space-x-8", children: navLinks.map((link) => (_jsx(Link, { to: link.path, className: `text-lg font-medium transition-colors duration-200 ${isActive(link.path)
                                    ? "text-[#F57251]"
                                    : "text-[#E9E6DD] hover:text-[#F57251]"}`, children: link.label }, link.path))) }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("div", { className: "hidden lg:flex items-center space-x-4", children: [_jsx(Link, { to: "/login", className: "px-6 py-2 text-[#E9E6DD] hover:text-[#F57251] transition-colors duration-200 font-medium", children: "Login" }), _jsx(Link, { to: "/register", className: "px-6 py-2 bg-[#F57251] text-[#E9E6DD] rounded-full hover:bg-[#e56546] transition-colors duration-200 font-medium", children: "Sign Up" }), _jsx(Link, { to: "/login" // Redirects to login for booking
                                            , className: "px-6 py-2 bg-[#027480] text-[#E9E6DD] rounded-full hover:bg-[#01616d] transition-colors duration-200 font-medium", children: "Rent Now" })] }), _jsx("button", { onClick: () => setMobileMenuOpen(!mobileMenuOpen), className: "lg:hidden p-2 text-[#C4AD9D] hover:text-[#E9E6DD] hover:bg-[#00101f] rounded-lg transition-colors", "aria-label": "Toggle menu", children: mobileMenuOpen ? _jsx(X, { size: 24 }) : _jsx(Menu, { size: 24 }) })] })] }), mobileMenuOpen && (_jsxs("div", { className: "lg:hidden absolute left-4 right-4 mt-4 bg-[#001524] border border-[#445048] rounded-2xl shadow-xl z-50", children: [_jsx("div", { className: "p-4", children: navLinks.map((link) => (_jsx(Link, { to: link.path, onClick: () => setMobileMenuOpen(false), className: `block px-4 py-3 rounded-lg mb-2 last:mb-0 transition-all duration-200 ${isActive(link.path)
                                    ? "text-[#F57251] bg-[#00101f]"
                                    : "text-[#E9E6DD] hover:text-[#F57251] hover:bg-[#00101f]/50"}`, children: _jsx("span", { className: "font-medium text-lg", children: link.label }) }, link.path))) }), _jsxs("div", { className: "p-4 border-t border-[#445048] space-y-3", children: [_jsx(Link, { to: "/login", onClick: () => setMobileMenuOpen(false), className: "block w-full text-center px-4 py-3 text-[#E9E6DD] bg-[#00101f] hover:bg-[#00101f]/80 rounded-lg transition-colors font-medium", children: "Login" }), _jsx(Link, { to: "/register", onClick: () => setMobileMenuOpen(false), className: "block w-full text-center px-4 py-3 bg-[#F57251] text-[#E9E6DD] hover:bg-[#e56546] rounded-lg transition-colors font-medium", children: "Sign Up" }), _jsx(Link, { to: "/login", onClick: () => setMobileMenuOpen(false), className: "block w-full text-center px-4 py-3 bg-[#027480] text-[#E9E6DD] hover:bg-[#01616d] rounded-lg transition-colors font-medium", children: "Rent a Car Now" })] })] }))] }) }));
};
export default Navbar;
