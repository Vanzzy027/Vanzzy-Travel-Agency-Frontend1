import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useGetAvailableVehiclesQuery } from '../../features/api/VehicleAPI';
import VehicleCard from '../../components/VehicleCard';
import VehicleDetailsModal from '../../Modals/VehicleDetailsModal';
const UserVehiclesPage = () => {
    const [selectedVehicleId, setSelectedVehicleId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('All');
    const { data: vehicles, isLoading, error } = useGetAvailableVehiclesQuery();
    const filteredVehicles = vehicles?.filter(vehicle => {
        const matchesSearch = vehicle.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === 'All' || vehicle.vehicle_type === typeFilter;
        return matchesSearch && matchesType;
    });
    const handleViewDetails = (vehicleId) => {
        setSelectedVehicleId(vehicleId);
    };
    const handleCloseModal = () => {
        setSelectedVehicleId(null);
    };
    const vehicleTypes = ['All', 'Sports Car', 'SUV', 'Sedan', 'Coupe', 'Convertible'];
    if (isLoading) {
        return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "flex justify-between items-center", children: _jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-[#001524] mb-2", children: "Available Vehicles" }), _jsx("p", { className: "text-[#445048]", children: "Browse our luxury fleet" })] }) }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: [...Array(6)].map((_, index) => (_jsxs("div", { className: "bg-[#001524] rounded-2xl p-6 animate-pulse", children: [_jsx("div", { className: "h-48 bg-[#445048] rounded-lg mb-4" }), _jsx("div", { className: "h-4 bg-[#445048] rounded w-3/4 mb-2" }), _jsx("div", { className: "h-3 bg-[#445048] rounded w-1/2 mb-4" }), _jsx("div", { className: "grid grid-cols-2 gap-2 mb-4", children: [...Array(4)].map((_, i) => (_jsx("div", { className: "h-3 bg-[#445048] rounded" }, i))) }), _jsx("div", { className: "h-10 bg-[#445048] rounded-lg" })] }, index))) })] }));
    }
    if (error) {
        return (_jsxs("div", { className: "text-center py-12", children: [_jsx("div", { className: "text-6xl mb-4", children: "\uD83D\uDE97" }), _jsx("h3", { className: "text-2xl font-bold text-[#001524] mb-2", children: "Error Loading Vehicles" }), _jsx("p", { className: "text-[#445048]", children: "Please try again later." })] }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-[#001524] mb-2", children: "Available Vehicles" }), _jsx("p", { className: "text-[#445048]", children: "Browse our luxury fleet" })] }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-4 w-full lg:w-auto", children: [_jsxs("div", { className: "relative", children: [_jsx("input", { type: "text", placeholder: "Search vehicles...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full sm:w-64 px-4 py-2 bg-[#001524] text-[#E9E6DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#027480]" }), _jsx("div", { className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-[#C4AD9D]", children: "\uD83D\uDD0D" })] }), _jsx("select", { value: typeFilter, onChange: (e) => setTypeFilter(e.target.value), className: "px-4 py-2 bg-[#001524] text-[#E9E6DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#027480]", children: vehicleTypes.map(type => (_jsx("option", { value: type, children: type }, type))) })] })] }), _jsxs("div", { className: "text-[#445048]", children: ["Showing ", filteredVehicles?.length || 0, " of ", vehicles?.length || 0, " vehicles"] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: filteredVehicles?.map((vehicle) => (_jsx(VehicleCard, { vehicle: vehicle, onViewDetails: handleViewDetails }, vehicle.vehicle_id))) }), (!filteredVehicles || filteredVehicles.length === 0) && (_jsxs("div", { className: "text-center py-12 bg-[#001524] rounded-2xl", children: [_jsx("div", { className: "text-6xl mb-4", children: "\uD83D\uDE97" }), _jsx("h3", { className: "text-2xl font-bold text-[#E9E6DD] mb-2", children: "No vehicles found" }), _jsx("p", { className: "text-[#C4AD9D]", children: "Try adjusting your search or filters." })] })), selectedVehicleId && (_jsx(VehicleDetailsModal, { vehicleId: selectedVehicleId, onClose: handleCloseModal }))] }));
};
export default UserVehiclesPage;
