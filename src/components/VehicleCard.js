import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// components/VehicleCard.tsx
import React from "react";
import { Settings, Droplet, Users, Car, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
const VehicleCard = ({ vehicle, onViewDetails, onRentVehicle, }) => {
    // --- Parse images safely ---
    const images = React.useMemo(() => {
        try {
            return vehicle.images ? JSON.parse(vehicle.images) : [];
        }
        catch {
            return [];
        }
    }, [vehicle.images]);
    // --- Parse features safely ---
    const features = React.useMemo(() => {
        try {
            return vehicle.features ? JSON.parse(vehicle.features) : [];
        }
        catch {
            return [];
        }
    }, [vehicle.features]);
    // --- Status badge color ---
    const getStatusColor = (status) => {
        switch (status) {
            case "Available":
                return "bg-green-500";
            case "Rented":
                return "bg-red-500";
            case "Maintenance":
                return "bg-gray-500";
            default:
                return "bg-gray-400";
        }
    };
    // --- Discount & pricing ---
    const discountRate = vehicle.on_promo && vehicle.promo_rate ? vehicle.promo_rate : 0;
    const discountedPrice = vehicle.on_promo && vehicle.promo_rate
        ? Math.round(vehicle.rental_rate * (1 - vehicle.promo_rate / 100))
        : vehicle.rental_rate;
    // --- Auth state from Redux ---
    const navigate = useNavigate();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    return (_jsxs("div", { className: "bg-[#001524] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group w-full", children: [_jsxs("div", { className: "relative h-48 overflow-hidden", children: [_jsx("img", { src: images[0] ||
                            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=80", alt: `${vehicle.manufacturer} ${vehicle.model}`, className: "w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" }), _jsx("div", { className: `absolute top-4 left-4 ${getStatusColor(vehicle.status)} text-white px-3 py-1 rounded-full text-sm font-semibold`, children: vehicle.status }), vehicle.on_promo && discountRate > 0 && (_jsxs("div", { className: "absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold", children: [discountRate, "% OFF"] })), _jsx("div", { className: "absolute bottom-4 left-4 bg-gray-700/80 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm", children: vehicle.vehicle_type || "Unknown" })] }), _jsxs("div", { className: "p-4 sm:p-6 flex flex-col", children: [_jsxs("div", { className: "flex flex-col sm:flex-row justify-between mb-3", children: [_jsxs("div", { children: [_jsxs("h3", { className: "text-lg sm:text-xl font-bold text-white truncate", children: [vehicle.manufacturer, " ", vehicle.model] }), _jsxs("p", { className: "text-gray-300 text-sm truncate", children: [vehicle.year || "Year N/A", " \u2022 ", vehicle.color || "Color N/A"] })] }), _jsxs("div", { className: "flex items-center mt-2 sm:mt-0 space-x-1", children: [_jsx(Star, { className: "w-4 h-4 text-yellow-400" }), _jsx("span", { className: "text-white font-semibold", children: vehicle.review_count ? vehicle.review_count.toFixed(1) : "New" }), _jsxs("span", { className: "text-gray-400 text-xs", children: ["(", vehicle.review_count || 0, ")"] })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-2 mb-3 text-gray-300 text-sm", children: [_jsxs("div", { className: "flex items-center space-x-1", children: [_jsx(Settings, { className: "w-4 h-4 text-cyan-400" }), _jsx("span", { className: "truncate", children: vehicle.engine_capacity || "N/A" })] }), _jsxs("div", { className: "flex items-center space-x-1", children: [_jsx(Droplet, { className: "w-4 h-4 text-blue-400" }), _jsx("span", { className: "truncate", children: vehicle.fuel_type || "N/A" })] }), _jsxs("div", { className: "flex items-center space-x-1", children: [_jsx(Car, { className: "w-4 h-4 text-green-400" }), _jsx("span", { className: "truncate", children: vehicle.transmission || "N/A" })] }), _jsxs("div", { className: "flex items-center space-x-1", children: [_jsx(Users, { className: "w-4 h-4 text-pink-400" }), _jsxs("span", { className: "truncate", children: [vehicle.seating_capacity || "N/A", " Seats"] })] })] }), features.length > 0 && (_jsxs("div", { className: "flex flex-wrap gap-1 mb-3", children: [features.slice(0, 3).map((feature, idx) => (_jsx("span", { className: "bg-gray-700 text-gray-300 px-2 py-1 rounded-lg text-xs truncate", children: feature }, idx))), features.length > 3 && (_jsxs("span", { className: "bg-cyan-500 text-white px-2 py-1 rounded-lg text-xs", children: ["+", features.length - 3, " more"] }))] })), _jsxs("div", { className: "pt-4 border-t border-gray-700 space-y-3", children: [_jsxs("div", { className: "flex flex-col", children: [_jsxs("div", { className: "flex items-center flex-wrap gap-2 text-white", children: [_jsxs("span", { className: "text-xl sm:text-2xl font-bold", children: ["$", discountedPrice] }), vehicle.on_promo && vehicle.promo_rate && (_jsxs("span", { className: "text-gray-400 text-sm line-through", children: ["$", vehicle.rental_rate] })), _jsx("span", { className: "text-gray-400 text-sm", children: "/day" })] }), vehicle.monthly_rate && (_jsxs("span", { className: "text-gray-400 text-xs sm:text-sm", children: ["$", vehicle.monthly_rate, "/mo"] }))] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2", children: [_jsx("button", { onClick: () => onViewDetails?.(vehicle.vehicle_id), className: "w-full bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 transition text-sm font-semibold", children: "Details" }), _jsx("button", { onClick: () => {
                                            if (!isAuthenticated) {
                                                navigate("/login");
                                                return;
                                            }
                                            onRentVehicle?.(vehicle.vehicle_id);
                                        }, className: `w-full px-4 py-2 rounded-lg text-sm font-semibold transition ${vehicle.status === "Available"
                                            ? "bg-orange-500 text-white hover:bg-orange-600"
                                            : "bg-gray-700 text-gray-300 cursor-not-allowed"}`, children: !isAuthenticated
                                            ? "Login to Rent"
                                            : vehicle.status === "Available"
                                                ? "Rent Now"
                                                : vehicle.status })] })] })] })] }));
};
export default VehicleCard;
