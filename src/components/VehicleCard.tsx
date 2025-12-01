import React from 'react';
import {type VehicleWithSpecs } from '../features/api/VehicleAPI'; 


interface VehicleCardProps {
  vehicle: VehicleWithSpecs; 
  onViewDetails?: (vehicleId: number) => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onViewDetails }) => {
  
  
  let images: string[] = [];
  try {
    images = vehicle.images ? JSON.parse(vehicle.images) : [];
  } catch (e) {
    images = ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=80'];
  }

  // 4. Safe Feature Parsing
  let features: string[] = [];
  try {
    features = vehicle.features ? JSON.parse(vehicle.features) : [];
  } catch (e) {
    features = [];
  }

  // Helper for status colors
  const getStatusColor = (status: string) => {
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

  return (
    <div className="bg-[#001524] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={images[0] || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'} 
          alt={`${vehicle.manufacturer} ${vehicle.model}`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Status Badge */}
        <div className={`absolute top-4 left-4 ${getStatusColor(vehicle.status)} text-[#E9E6DD] px-3 py-1 rounded-full text-sm font-semibold`}>
          {vehicle.status}
        </div>

        {/* Promo Badge */}
        {vehicle.on_promo && (
          <div className="absolute top-4 right-4 bg-[#F57251] text-[#E9E6DD] px-3 py-1 rounded-full text-sm font-semibold">
            {calculateDiscount()}% OFF
          </div>
        )}

        {/* Vehicle Type Badge */}
        <div className="absolute bottom-4 left-4 bg-[#445048]/90 text-[#E9E6DD] px-3 py-1 rounded-full text-sm backdrop-blur-sm">
          {vehicle.vehicle_type}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div>
            {/* DIRECT ACCESS: No 'spec.' prefix needed */}
            <h3 className="text-xl font-bold text-[#E9E6DD]">
              {vehicle.manufacturer} {vehicle.model}
            </h3>
            <p className="text-[#C4AD9D] text-sm">{vehicle.year} • {vehicle.color}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-1 mb-1">
              <span className="text-[#D6CC99]">⭐</span>
              <span className="text-[#E9E6DD] font-semibold">
                {/* Random star rating if not in DB, assuming DB doesn't have ratings yet */}
                {vehicle.review_count ? '4.8' : 'New'} 
              </span>
              <span className="text-[#C4AD9D] text-sm">
                ({vehicle.review_count || 0})
              </span>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-[#027480]">⚙️</span>
            <span className="text-[#E9E6DD] text-sm truncate">{vehicle.engine_capacity}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[#027480]">⛽</span>
            <span className="text-[#E9E6DD] text-sm truncate">{vehicle.fuel_type}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[#027480]">🚗</span>
            <span className="text-[#E9E6DD] text-sm truncate">{vehicle.transmission}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[#027480]">👥</span>
            <span className="text-[#E9E6DD] text-sm truncate">{vehicle.seating_capacity} Seats</span>
          </div>
        </div>

        {/* Features */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {features.slice(0, 3).map((feature: string, index: number) => (
              <span 
                key={index}
                className="bg-[#445048] text-[#E9E6DD] px-2 py-1 rounded-lg text-xs"
              >
                {feature}
              </span>
            ))}
            {features.length > 3 && (
              <span className="bg-[#027480] text-[#E9E6DD] px-2 py-1 rounded-lg text-xs">
                +{features.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Pricing & Actions */}
        <div className="flex justify-between items-center pt-4 border-t border-[#445048]">
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-[#E9E6DD]">
                ${vehicle.rental_rate}
              </span>
              <span className="text-[#445048] text-sm">/day</span>
            </div>
            {/* Show monthly rate if it exists */}
            {vehicle.monthly_rate && (
                <p className="text-[#C4AD9D] text-xs mt-1">
                ${vehicle.monthly_rate}/mo
                </p>
            )}
          </div>
          
          <div className="flex space-x-2">
            {/* Handle Optional onViewDetails */}
            {onViewDetails && (
                <>
                <button 
                onClick={() => onViewDetails(vehicle.vehicle_id)}
                className="bg-[#027480] text-[#E9E6DD] px-4 py-2 rounded-lg hover:bg-[#026270] transition-colors duration-200 font-semibold text-sm"
                >
                Details
                </button>
                <button 
                onClick={() => onViewDetails(vehicle.vehicle_id)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors duration-200 ${
                    vehicle.status === 'Available' 
                    ? 'bg-[#F57251] text-[#E9E6DD] hover:bg-[#e56546]' 
                    : 'bg-[#445048] text-[#C4AD9D] cursor-not-allowed'
                }`}
                disabled={vehicle.status !== 'Available'}
                >
                {vehicle.status === 'Available' ? 'Rent Now' : vehicle.status}
                </button>
                </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
