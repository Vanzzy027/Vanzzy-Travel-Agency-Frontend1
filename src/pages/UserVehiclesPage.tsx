// pages/UserVehiclesPage.tsx (or wherever you keep it)
import React, { useState, useMemo } from 'react';
import { useGetAvailableVehiclesQuery } from '../features/api/VehicleAPI';
import VehicleCard from '../components/VehicleCard';
import VehicleDetailsModal from '../components/VehicleDetailsModal';

const UserVehiclesPage: React.FC = () => {
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  // This is now guaranteed to be an array (or undefined while loading)
  const { data: vehicles = [], isLoading, error } = useGetAvailableVehiclesQuery();

  // Client-side filtering with useMemo for performance
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((vehicle) => {
      const matchesSearch =
        vehicle.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = typeFilter === 'All' || vehicle.vehicle_type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [vehicles, searchTerm, typeFilter]);

  const vehicleTypes = ['All', 'Sports Car', 'SUV', 'Sedan', 'Coupe', 'Convertible'];

  const handleViewDetails = (vehicleId: number) => setSelectedVehicleId(vehicleId);
  const handleCloseModal = () => setSelectedVehicleId(null);

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#001524] mb-2">Available Vehicles</h1>
            <p className="text-[#445048]">Browse our luxury fleet</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-[#001524] rounded-2xl p-6 animate-pulse">
              <div className="h-48 bg-[#445048]/50 rounded-lg mb-4" />
              <div className="h-6 bg-[#445048]/50 rounded w-3/4 mb-3" />
              <div className="h-4 bg-[#445048]/30 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">Car car</div>
        <h3 className="text-2xl font-bold text-[#001524] mb-2">Error Loading Vehicles</h3>
        <p className="text-[#445048]">Something went wrong. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header + Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-[#001524] mb-2">Available Vehicles</h1>
          <p className="text-[#445048]">Browse our luxury fleet</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-80 w-full lg:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search vehicles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 bg-[#001524] text-[#E9E6DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#027480]"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C4AD9D]">search</span>
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 bg-[#001524] text-[#E9E6DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#027480]"
          >
            {vehicleTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results counter */}
      <p className="text-[#445048]">
        Showing {filteredVehicles.length} of {vehicles.length} vehicles
      </p>

      {/* Vehicle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.vehicle_id}
            vehicle={vehicle}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>

      {/* Empty state */}
      {filteredVehicles.length === 0 && (
        <div className="text-center py-20 bg-[#001524] rounded-2xl">
          <div className="text-6xl mb-4">car</div>
          <h3 className="text-2xl font-bold text-[#E9E6DD] mb-2">No vehicles found</h3>
          <p className="text-[#C4AD9D]">Try adjusting your search or filters.</p>
        </div>
      )}

      {/* Details Modal */}
      {selectedVehicleId && (
        <VehicleDetailsModal vehicleId={selectedVehicleId} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default UserVehiclesPage;