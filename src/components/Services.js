import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const services = [
    {
        icon: "🚗",
        title: "Wide Selection",
        description: "Choose from our extensive fleet of luxury and performance vehicles"
    },
    {
        icon: "⏰",
        title: "24/7 Support",
        description: "Round-the-clock customer service and roadside assistance"
    },
    {
        icon: "💰",
        title: "Best Rates",
        description: "Competitive pricing with no hidden fees"
    },
    {
        icon: "🛡️",
        title: "Full Insurance",
        description: "Comprehensive coverage for complete peace of mind"
    }
];
const Services = () => {
    return (_jsx("section", { className: "py-16 bg-[#001524]", children: _jsxs("div", { className: "max-w-7xl mx-auto px-8", children: [_jsxs("div", { className: "text-center mb-12", children: [_jsx("h2", { className: "text-4xl font-bold text-[#E9E6DD] mb-4", children: "Why Choose VansKE?" }), _jsx("p", { className: "text-[#C4AD9D] text-lg max-w-2xl mx-auto", children: "Experience the difference with our premium car rental services" })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8", children: services.map((service, index) => (_jsxs("div", { className: "text-center p-6 bg-[#445048] rounded-2xl hover:bg-[#027480] transition-colors duration-300", children: [_jsx("div", { className: "text-4xl mb-4", children: service.icon }), _jsx("h3", { className: "text-xl font-bold text-[#E9E6DD] mb-3", children: service.title }), _jsx("p", { className: "text-[#C4AD9D]", children: service.description })] }, index))) })] }) }));
};
export default Services;
