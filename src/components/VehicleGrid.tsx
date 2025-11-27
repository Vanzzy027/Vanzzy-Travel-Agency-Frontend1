// components/VehicleGrid.tsx
import React from 'react';
import VehicleCard from './VehicleCard';

interface Vehicle {
  vehicle_id: number;
  vehicleSpec_id: number;
  vin_number: string;
  license_plate: string;
  current_mileage: number;
  rental_rate: number;
  status: string;
  created_at: string;
  updated_at: string;
  specification?: any;
}

interface VehicleGridProps {
  vehicles: Vehicle[];
  loading?: boolean;
}

const VehicleGrid: React.FC<VehicleGridProps> = ({ vehicles, loading = false }) => {
  if (loading) {
    return (
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
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🚗</div>
        <h3 className="text-2xl font-bold text-[#E9E6DD] mb-2">No vehicles found</h3>
        <p className="text-[#C4AD9D]">Try adjusting your filters to find more options.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#E9E6DD]">
          Available Supercars ({vehicles.length})
        </h2>
        <div className="flex items-center space-x-4">
          <select className="bg-[#445048] text-[#E9E6DD] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#027480]">
            <option>Sort by: Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Rating: High to Low</option>
            <option>Newest First</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map(vehicle => (
          <VehicleCard key={vehicle.vehicle_id} vehicle={vehicle} />
        ))}
      </div>
    </div>
  );
};

export default VehicleGrid;