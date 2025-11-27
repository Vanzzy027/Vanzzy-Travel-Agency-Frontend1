import React, { useState } from 'react';
import { useGetAvailableVehiclesQuery } from '../../features/api/VehicleAPI';
import VehicleCard from '../../components/VehicleCard';
import VehicleDetailsModal from '../../components/VehicleDetailsModal';

const UserVehiclesPage: React.FC = () => {
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  
  const { data: vehicles, isLoading, error } = useGetAvailableVehiclesQuery();

  const filteredVehicles = vehicles?.filter(vehicle => {
    const matchesSearch = vehicle.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'All' || vehicle.vehicle_type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleViewDetails = (vehicleId: number) => {
    setSelectedVehicleId(vehicleId);
  };

  const handleCloseModal = () => {
    setSelectedVehicleId(null);
  };

  const vehicleTypes = ['All', 'Sports Car', 'SUV', 'Sedan', 'Coupe', 'Convertible'];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#001524] mb-2">Available Vehicles</h1>
            <p className="text-[#445048]">Browse our luxury fleet</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-[#001524] rounded-2xl p-6 animate-pulse">
              <div className="h-48 bg-[#445048] rounded-lg mb-4"></div>
              <div className="h-4 bg-[#445048] rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-[#445048] rounded w-1/2 mb-4"></div>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-3 bg-[#445048] rounded"></div>
                ))}
              </div>
              <div className="h-10 bg-[#445048] rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🚗</div>
        <h3 className="text-2xl font-bold text-[#001524] mb-2">Error Loading Vehicles</h3>
        <p className="text-[#445048]">Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#001524] mb-2">Available Vehicles</h1>
          <p className="text-[#445048]">Browse our luxury fleet</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search vehicles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 px-4 py-2 bg-[#001524] text-[#E9E6DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#027480]"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#C4AD9D]">
              🔍
            </div>
          </div>
          
          {/* Type Filter */}
          <select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 bg-[#001524] text-[#E9E6DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#027480]"
          >
            {vehicleTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-[#445048]">
        Showing {filteredVehicles?.length || 0} of {vehicles?.length || 0} vehicles
      </div>

      {/* Vehicle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles?.map((vehicle) => (
          <VehicleCard 
            key={vehicle.vehicle_id} 
            vehicle={vehicle}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>

      {(!filteredVehicles || filteredVehicles.length === 0) && (
        <div className="text-center py-12 bg-[#001524] rounded-2xl">
          <div className="text-6xl mb-4">🚗</div>
          <h3 className="text-2xl font-bold text-[#E9E6DD] mb-2">No vehicles found</h3>
          <p className="text-[#C4AD9D]">Try adjusting your search or filters.</p>
        </div>
      )}

      {/* Vehicle Details Modal */}
      {selectedVehicleId && (
        <VehicleDetailsModal 
          vehicleId={selectedVehicleId}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default UserVehiclesPage;