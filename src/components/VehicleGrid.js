import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import VehicleCard from './VehicleCard';
const VehicleGrid = ({ vehicles, loading = false }) => {
    if (loading) {
        return (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: [...Array(6)].map((_, index) => (_jsxs("div", { className: "bg-[#001524] rounded-2xl p-6 animate-pulse", children: [_jsx("div", { className: "h-48 bg-[#445048] rounded-lg mb-4" }), _jsx("div", { className: "h-4 bg-[#445048] rounded w-3/4 mb-2" }), _jsx("div", { className: "h-3 bg-[#445048] rounded w-1/2 mb-4" }), _jsx("div", { className: "grid grid-cols-2 gap-2 mb-4", children: [...Array(4)].map((_, i) => (_jsx("div", { className: "h-3 bg-[#445048] rounded" }, i))) }), _jsx("div", { className: "h-10 bg-[#445048] rounded-lg" })] }, index))) }));
    }
    if (vehicles.length === 0) {
        return (_jsxs("div", { className: "text-center py-12", children: [_jsx("div", { className: "text-6xl mb-4", children: "\uD83D\uDE97" }), _jsx("h3", { className: "text-2xl font-bold text-[#E9E6DD] mb-2", children: "No vehicles found" }), _jsx("p", { className: "text-[#C4AD9D]", children: "Try adjusting your filters to find more options." })] }));
    }
    return (_jsxs("div", { children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsxs("h2", { className: "text-2xl font-bold text-[#E9E6DD]", children: ["Available Supercars (", vehicles.length, ")"] }), _jsx("div", { className: "flex items-center space-x-4", children: _jsxs("select", { className: "bg-[#445048] text-[#E9E6DD] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#027480]", children: [_jsx("option", { children: "Sort by: Featured" }), _jsx("option", { children: "Price: Low to High" }), _jsx("option", { children: "Price: High to Low" }), _jsx("option", { children: "Rating: High to Low" }), _jsx("option", { children: "Newest First" })] }) })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: vehicles.map(vehicle => (_jsx(VehicleCard, { vehicle: vehicle }, vehicle.vehicle_id))) })] }));
};
export default VehicleGrid;
