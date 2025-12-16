import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo } from 'react';
import { useGetAvailableVehiclesQuery } from '../features/api/VehicleAPI';
import VehicleCard from '../components/VehicleCard';
import VehicleDetailsModal from '../Modals/VehicleDetailsModal';
const UserVehiclesPage = () => {
    const [selectedVehicleId, setSelectedVehicleId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('All');
    // This is now guaranteed to be an array (or undefined while loading)
    const { data: vehicles = [], isLoading, error } = useGetAvailableVehiclesQuery();
    console.log("REAL API DATA:", vehicles);
    // Client-side filtering with useMemo for performance
    const filteredVehicles = useMemo(() => {
        return vehicles.filter((vehicle) => {
            const matchesSearch = vehicle.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = typeFilter === 'All' || vehicle.vehicle_type === typeFilter;
            return matchesSearch && matchesType;
        });
    }, [vehicles, searchTerm, typeFilter]);
    const vehicleTypes = ['All', 'Sports Car', 'SUV', 'Sedan', 'Coupe', 'Convertible'];
    const handleViewDetails = (vehicleId) => setSelectedVehicleId(vehicleId);
    const handleCloseModal = () => setSelectedVehicleId(null);
    // Loading state
    if (isLoading) {
        return (_jsxs("div", { className: "space-y-6 p-6", children: [_jsx("div", { className: "flex justify-between items-center", children: _jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-[#001524] mb-2", children: "Available Vehicles" }), _jsx("p", { className: "text-[#445048]", children: "Browse our luxury fleet" })] }) }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: Array.from({ length: 6 }).map((_, i) => (_jsxs("div", { className: "bg-[#001524] rounded-2xl p-6 animate-pulse", children: [_jsx("div", { className: "h-48 bg-[#445048]/50 rounded-lg mb-4" }), _jsx("div", { className: "h-6 bg-[#445048]/50 rounded w-3/4 mb-3" }), _jsx("div", { className: "h-4 bg-[#445048]/30 rounded w-1/2" })] }, i))) })] }));
    }
    // Error state
    if (error) {
        return (_jsxs("div", { className: "text-center py-20", children: [_jsx("div", { className: "text-6xl mb-4", children: "Car car" }), _jsx("h3", { className: "text-2xl font-bold text-[#001524] mb-2", children: "Error Loading Vehicles" }), _jsx("p", { className: "text-[#445048]", children: "Something went wrong. Please try again later." })] }));
    }
    return (_jsxs("div", { className: "space-y-6 p-6", children: [_jsxs("div", { className: "flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-[#001524] mb-2", children: "Available Vehicles" }), _jsx("p", { className: "text-[#445048]", children: "Browse our luxury fleet" })] }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-4 w-80 w-full lg:w-auto", children: [_jsxs("div", { className: "relative", children: [_jsx("input", { type: "text", placeholder: "Search vehicles...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full px-4 py-2 pl-10 bg-[#001524] text-[#E9E6DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#027480]" }), _jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-[#C4AD9D]", children: "search" })] }), _jsx("select", { value: typeFilter, onChange: (e) => setTypeFilter(e.target.value), className: "px-4 py-2 bg-[#001524] text-[#E9E6DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#027480]", children: vehicleTypes.map((type) => (_jsx("option", { value: type, children: type }, type))) })] })] }), _jsxs("p", { className: "text-[#445048]", children: ["Showing ", filteredVehicles.length, " of ", vehicles.length, " vehicles"] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: filteredVehicles.map((vehicle) => (_jsx(VehicleCard, { vehicle: vehicle, onViewDetails: handleViewDetails }, vehicle.vehicle_id))) }), filteredVehicles.length === 0 && (_jsxs("div", { className: "text-center py-20 bg-[#001524] rounded-2xl", children: [_jsx("div", { className: "text-6xl mb-4", children: "car" }), _jsx("h3", { className: "text-2xl font-bold text-[#E9E6DD] mb-2", children: "No vehicles found" }), _jsx("p", { className: "text-[#C4AD9D]", children: "Try adjusting your search or filters." })] })), selectedVehicleId && (_jsx(VehicleDetailsModal, { vehicleId: selectedVehicleId, onClose: handleCloseModal }))] }));
};
export default UserVehiclesPage;
