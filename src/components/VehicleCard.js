import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
const VehicleCard = ({ vehicle, onViewDetails }) => {
    let images = [];
    try {
        images = vehicle.images ? JSON.parse(vehicle.images) : [];
    }
    catch (e) {
        images = ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=80'];
    }
    // 4. Safe Feature Parsing
    let features = [];
    try {
        features = vehicle.features ? JSON.parse(vehicle.features) : [];
    }
    catch (e) {
        features = [];
    }
    // Helper for status colors
    const getStatusColor = (status) => {
        switch (status) {
            case 'Available': return 'bg-[#027480]';
            case 'Rented': return 'bg-[#F57251]';
            case 'Maintenance': return 'bg-[#445048]';
            default: return 'bg-gray-500';
        }
    };
    // Helper for discount math
    const calculateDiscount = () => {
        if (vehicle.on_promo && vehicle.daily_rate) {
            // Assuming 'rental_rate' is the discounted price and 'daily_rate' is original
            return Math.round(((vehicle.daily_rate - vehicle.rental_rate) / vehicle.daily_rate) * 100);
        }
        return 0;
    };
    return (_jsxs("div", { className: "bg-[#001524] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group", children: [_jsxs("div", { className: "relative h-48 overflow-hidden", children: [_jsx("img", { src: images[0] || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', alt: `${vehicle.manufacturer} ${vehicle.model}`, className: "w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" }), _jsx("div", { className: `absolute top-4 left-4 ${getStatusColor(vehicle.status)} text-[#E9E6DD] px-3 py-1 rounded-full text-sm font-semibold`, children: vehicle.status }), vehicle.on_promo && (_jsxs("div", { className: "absolute top-4 right-4 bg-[#F57251] text-[#E9E6DD] px-3 py-1 rounded-full text-sm font-semibold", children: [calculateDiscount(), "% OFF"] })), _jsx("div", { className: "absolute bottom-4 left-4 bg-[#445048]/90 text-[#E9E6DD] px-3 py-1 rounded-full text-sm backdrop-blur-sm", children: vehicle.vehicle_type })] }), _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex justify-between items-start mb-3", children: [_jsxs("div", { children: [_jsxs("h3", { className: "text-xl font-bold text-[#E9E6DD]", children: [vehicle.manufacturer, " ", vehicle.model] }), _jsxs("p", { className: "text-[#C4AD9D] text-sm", children: [vehicle.year, " \u2022 ", vehicle.color] })] }), _jsx("div", { className: "text-right", children: _jsxs("div", { className: "flex items-center space-x-1 mb-1", children: [_jsx("span", { className: "text-[#D6CC99]", children: "\u2B50" }), _jsx("span", { className: "text-[#E9E6DD] font-semibold", children: vehicle.review_count ? '4.8' : 'New' }), _jsxs("span", { className: "text-[#C4AD9D] text-sm", children: ["(", vehicle.review_count || 0, ")"] })] }) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3 mb-4", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("span", { className: "text-[#027480]", children: "\u2699\uFE0F" }), _jsx("span", { className: "text-[#E9E6DD] text-sm truncate", children: vehicle.engine_capacity })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("span", { className: "text-[#027480]", children: "\u26FD" }), _jsx("span", { className: "text-[#E9E6DD] text-sm truncate", children: vehicle.fuel_type })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("span", { className: "text-[#027480]", children: "\uD83D\uDE97" }), _jsx("span", { className: "text-[#E9E6DD] text-sm truncate", children: vehicle.transmission })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("span", { className: "text-[#027480]", children: "\uD83D\uDC65" }), _jsxs("span", { className: "text-[#E9E6DD] text-sm truncate", children: [vehicle.seating_capacity, " Seats"] })] })] }), _jsx("div", { className: "mb-4", children: _jsxs("div", { className: "flex flex-wrap gap-2", children: [features.slice(0, 3).map((feature, index) => (_jsx("span", { className: "bg-[#445048] text-[#E9E6DD] px-2 py-1 rounded-lg text-xs", children: feature }, index))), features.length > 3 && (_jsxs("span", { className: "bg-[#027480] text-[#E9E6DD] px-2 py-1 rounded-lg text-xs", children: ["+", features.length - 3, " more"] }))] }) }), _jsxs("div", { className: "flex justify-between items-center pt-4 border-t border-[#445048]", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-baseline space-x-2", children: [_jsxs("span", { className: "text-2xl font-bold text-[#E9E6DD]", children: ["$", vehicle.rental_rate] }), _jsx("span", { className: "text-[#445048] text-sm", children: "/day" })] }), vehicle.monthly_rate && (_jsxs("p", { className: "text-[#C4AD9D] text-xs mt-1", children: ["$", vehicle.monthly_rate, "/mo"] }))] }), _jsx("div", { className: "flex space-x-2", children: onViewDetails && (_jsxs(_Fragment, { children: [_jsx("button", { onClick: () => onViewDetails(vehicle.vehicle_id), className: "bg-[#027480] text-[#E9E6DD] px-4 py-2 rounded-lg hover:bg-[#026270] transition-colors duration-200 font-semibold text-sm", children: "Details" }), _jsx("button", { onClick: () => onViewDetails(vehicle.vehicle_id), className: `px-4 py-2 rounded-lg font-semibold text-sm transition-colors duration-200 ${vehicle.status === 'Available'
                                                ? 'bg-[#F57251] text-[#E9E6DD] hover:bg-[#e56546]'
                                                : 'bg-[#445048] text-[#C4AD9D] cursor-not-allowed'}`, disabled: vehicle.status !== 'Available', children: vehicle.status === 'Available' ? 'Rent Now' : vehicle.status })] })) })] })] })] }));
};
export default VehicleCard;
