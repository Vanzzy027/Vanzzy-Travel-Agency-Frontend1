import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // ⬅️ Added
const slides = [
    {
        image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        title: 'Premium Car Rental Experience',
        text: 'Discover our luxury fleet with the best rates and exceptional service for your journey.',
        cta: 'Browse Fleet',
        action: '/UserDashboard/vehicles'
    },
    {
        image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        title: 'Flexible Rental Solutions',
        text: 'Daily, weekly, or monthly rentals with 24/7 customer support and roadside assistance.',
        cta: 'View Rates',
        action: '/UserDashboard/vehicles'
    },
    {
        image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        title: 'Business & Corporate Rentals',
        text: 'Specialized solutions for corporate clients with premium vehicles and dedicated support.',
        cta: 'Business Plans',
        action: '/UserDashboard/vehicles'
    },
];
const Hero = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const navigate = useNavigate(); // ⬅️ Added
    const nextSlide = () => setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1));
    const prevSlide = () => setCurrentSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1));
    useEffect(() => {
        const slideInterval = setInterval(nextSlide, 8000);
        return () => clearInterval(slideInterval);
    }, []);
    // 🔐 CHECK LOGIN
    const handleProtectedNavigation = (path) => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        navigate(path);
    };
    return (_jsxs("div", { className: "relative w-full h-[70vh] min-h-[600px] overflow-hidden bg-[#001524]", children: [slides.map((slide, index) => (_jsx("div", { className: `absolute inset-0 w-full h-full transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`, style: {
                    backgroundImage: `linear-gradient(rgba(0, 21, 36, 0.7), rgba(0, 21, 36, 0.5)), url(${slide.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                } }, index))), _jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: _jsxs("div", { className: "text-center text-[#E9E6DD] max-w-4xl px-8", children: [_jsx("h1", { className: "text-5xl md:text-6xl font-bold mb-6 leading-tight", children: slides[currentSlide].title }), _jsx("p", { className: "text-xl md:text-2xl text-[#C4AD9D] mb-8 leading-relaxed", children: slides[currentSlide].text }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-center", children: [_jsx("button", { onClick: () => handleProtectedNavigation(slides[currentSlide].action), className: "bg-[#F57251] text-[#E9E6DD] px-8 py-4 rounded-full font-semibold hover:bg-[#e56546] transform hover:scale-105 transition-all duration-300 shadow-lg text-lg", children: slides[currentSlide].cta }), _jsx("button", { onClick: () => navigate('/about'), className: "border-2 border-[#E9E6DD] text-[#E9E6DD] px-8 py-4 rounded-full font-semibold hover:bg-[#E9E6DD] hover:text-[#001524] transform hover:scale-105 transition-all duration-300 text-lg", children: "Learn More" })] })] }) }), _jsx("button", { onClick: prevSlide, className: "absolute left-4 top-1/2 ...", children: "\u2026" }), _jsx("button", { onClick: nextSlide, className: "absolute right-4 top-1/2 ...", children: "\u2026" }), _jsx("div", { className: "absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3", children: slides.map((_, index) => (_jsx("button", { onClick: () => setCurrentSlide(index), className: "w-3 h-3 rounded-full transition-all duration-300" }, index))) })] }));
};
export default Hero;
