import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";
const featuredVehicles = [
    {
        id: 1,
        manufacturer: "Ferrari",
        model: "F8 Tributo",
        image: "https://images.unsplash.com/photo-1614200179396-2bdb77ebf81b?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        price: 899,
        type: "Sports Car",
        features: ["V8 Engine", "Automatic", "2 Seater"],
    },
    {
        id: 2,
        manufacturer: "Lamborghini",
        model: "Huracán EVO",
        image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        price: 1299,
        type: "Sports Car",
        features: ["V10 Engine", "Automatic", "2 Seater"]
    },
    {
        id: 3,
        manufacturer: "Porsche",
        model: "911 Turbo S",
        image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        price: 699,
        type: "Sports Car",
        features: ["Flat-6 Engine", "Automatic", "4 Seater"]
    }
];
const VehicleShowcase = () => {
    const navigate = useNavigate();
    // 🔐 shared function
    const handleProtectedNav = (path) => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }
        navigate(path);
    };
    return (_jsx("section", { className: "py-16 bg-[#E9E6DD]", children: _jsxs("div", { className: "max-w-7xl mx-auto px-8", children: [_jsxs("div", { className: "text-center mb-12", children: [_jsx("h2", { className: "text-4xl font-bold text-[#001524] mb-4", children: "Featured Supercars" }), _jsx("p", { className: "text-[#445048] text-lg max-w-2xl mx-auto", children: "Experience the thrill of driving the world's most exclusive supercars" })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8", children: featuredVehicles.map((vehicle) => (_jsxs("div", { className: "bg-[#001524] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105", children: [_jsx("div", { className: "h-48 overflow-hidden", children: _jsx("img", { src: vehicle.image, alt: `${vehicle.manufacturer} ${vehicle.model}`, className: "w-full h-full object-cover" }) }), _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex justify-between items-start mb-3", children: [_jsxs("div", { children: [_jsxs("h3", { className: "text-xl font-bold text-[#E9E6DD]", children: [vehicle.manufacturer, " ", vehicle.model] }), _jsx("p", { className: "text-[#C4AD9D]", children: vehicle.type })] }), _jsxs("div", { className: "text-right", children: [_jsxs("div", { className: "text-2xl font-bold text-[#F57251]", children: ["$", vehicle.price] }), _jsx("div", { className: "text-[#C4AD9D] text-sm", children: "per day" })] })] }), _jsx("div", { className: "flex flex-wrap gap-2 mb-4", children: vehicle.features.map((feature, index) => (_jsx("span", { className: "bg-[#445048] text-[#E9E6DD] px-3 py-1 rounded-full text-sm", children: feature }, index))) }), _jsx("button", { onClick: () => handleProtectedNav(`/UserDashboard/vehicles/${vehicle.id}`), className: "w-full bg-[#027480] text-[#E9E6DD] py-3 rounded-lg hover:bg-[#F57251] transition-colors duration-200 font-semibold", children: "View Details" })] })] }, vehicle.id))) }), _jsx("div", { className: "text-center mt-12", children: _jsx("button", { onClick: () => handleProtectedNav("/UserDashboard/vehicles"), className: "bg-[#001524] text-[#E9E6DD] px-8 py-4 rounded-full hover:bg-[#027480] transition-colors duration-200 font-semibold text-lg", children: "View All Vehicles" }) })] }) }));
};
export default VehicleShowcase;
