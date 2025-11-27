import React from 'react';

interface VehicleSpecification {
  vehicleSpec_id: number;
  manufacturer: string;
  model: string;
  year: number;
  fuel_type: string;
  engine_capacity: string;
  transmission: string;
  seating_capacity: number;
  color: string;
  features: string;
  images: string;
  on_promo: boolean;
  review_count: number;
  vehicle_type: string;
  fuel_efficiency: string;
  daily_rate: number;
  weekly_rate: number;
  monthly_rate: number;
  insurance_group: string;
}

// This component accepts two shapes that come from different API patterns:
// 1) Nested specification object: { specification: { ... } }
// 2) Flattened vehicle-with-specs: { manufacturer, model, ... } (VehicleWithSpecs)
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
  specification?: VehicleSpecification; // optional to support flattened responses
  // flattened fields (present when API returns a VehicleWithSpecs)
  manufacturer?: string;
  model?: string;
  year?: number;
  fuel_type?: string;
  engine_capacity?: string;
  transmission?: string;
  seating_capacity?: number;
  color?: string;
  features?: string;
  images?: string;
  on_promo?: boolean;
  review_count?: number;
  vehicle_type?: string;
  fuel_efficiency?: string;
  daily_rate?: number;
  weekly_rate?: number;
  monthly_rate?: number;
  insurance_group?: string;
}

interface VehicleCardProps {
  vehicle: Vehicle;
  // make optional — some consumers render the card without a click handler
  onViewDetails?: (vehicleId: number) => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onViewDetails }) => {
  // Normalize spec whether the API returned a nested `specification` object
  // or a flattened object with the spec fields at root.
  const spec: VehicleSpecification = vehicle.specification
    ? vehicle.specification
    : {
        vehicleSpec_id: vehicle.vehicleSpec_id ?? -1,
        manufacturer: vehicle.manufacturer ?? 'Unknown',
        model: vehicle.model ?? 'Unknown',
        year: vehicle.year ?? 0,
        fuel_type: vehicle.fuel_type ?? 'N/A',
        engine_capacity: vehicle.engine_capacity ?? '',
        transmission: vehicle.transmission ?? 'N/A',
        seating_capacity: vehicle.seating_capacity ?? 0,
        color: vehicle.color ?? 'Unknown',
        features: vehicle.features ?? '[]',
        images: vehicle.images ?? '[]',
        on_promo: vehicle.on_promo ?? false,
        review_count: vehicle.review_count ?? 0,
        vehicle_type: vehicle.vehicle_type ?? 'Unknown',
        fuel_efficiency: vehicle.fuel_efficiency ?? '',
        daily_rate: vehicle.daily_rate ?? 0,
        weekly_rate: vehicle.weekly_rate ?? 0,
        monthly_rate: vehicle.monthly_rate ?? 0,
        insurance_group: vehicle.insurance_group ?? '',
      };
  const images = spec.images ? JSON.parse(spec.images) : [];
  const features = spec.features ? JSON.parse(spec.features) : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-[#027480]';
      case 'Rented': return 'bg-[#F57251]';
      case 'Maintenance': return 'bg-[#445048]';
      default: return 'bg-gray-500';
    }
  };

  const calculateDiscount = () => {
    if (spec.on_promo && spec.daily_rate) {
      return Math.round(((spec.daily_rate - vehicle.rental_rate) / spec.daily_rate) * 100);
    }
    return 0;
  };

  return (
    <div className="bg-[#001524] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={images[0] || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'} 
          alt={`${spec.manufacturer} ${spec.model}`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Status Badge */}
        <div className={`absolute top-4 left-4 ${getStatusColor(vehicle.status)} text-[#E9E6DD] px-3 py-1 rounded-full text-sm font-semibold`}>
          {vehicle.status}
        </div>

        {/* Promo Badge */}
        {spec.on_promo && (
          <div className="absolute top-4 right-4 bg-[#F57251] text-[#E9E6DD] px-3 py-1 rounded-full text-sm font-semibold">
            {calculateDiscount()}% OFF
          </div>
        )}

        {/* Vehicle Type Badge */}
        <div className="absolute bottom-4 left-4 bg-[#445048]/90 text-[#E9E6DD] px-3 py-1 rounded-full text-sm backdrop-blur-sm">
          {spec.vehicle_type}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-xl font-bold text-[#E9E6DD]">
              {spec.manufacturer} {spec.model}
            </h3>
            <p className="text-[#C4AD9D] text-sm">{spec.year} • {spec.color}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-1 mb-1">
              <span className="text-[#D6CC99]">⭐</span>
              <span className="text-[#E9E6DD] font-semibold">
                {((Math.random() * 2) + 3).toFixed(1)}
              </span>
              <span className="text-[#C4AD9D] text-sm">
                ({spec.review_count || Math.floor(Math.random() * 100)})
              </span>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-[#027480]">⚙️</span>
            <span className="text-[#E9E6DD] text-sm">{spec.engine_capacity}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[#027480]">⛽</span>
            <span className="text-[#E9E6DD] text-sm">{spec.fuel_type}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[#027480]">🚗</span>
            <span className="text-[#E9E6DD] text-sm">{spec.transmission}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[#027480]">👥</span>
            <span className="text-[#E9E6DD] text-sm">{spec.seating_capacity} Seats</span>
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
                ${vehicle.rental_rate}/day
              </span>
              {spec.on_promo && spec.daily_rate && (
                <span className="text-[#C4AD9D] line-through text-sm">
                  ${spec.daily_rate}
                </span>
              )}
            </div>
            <p className="text-[#C4AD9D] text-sm">
              ${spec.weekly_rate}/week • ${spec.monthly_rate}/month
            </p>
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={() => onViewDetails?.(vehicle.vehicle_id)}
              className="bg-[#027480] text-[#E9E6DD] px-4 py-2 rounded-lg hover:bg-[#026270] transition-colors duration-200 font-semibold text-sm"
            >
              Details
            </button>
            <button 
              onClick={() => onViewDetails?.(vehicle.vehicle_id)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors duration-200 ${
                vehicle.status === 'Available' 
                  ? 'bg-[#F57251] text-[#E9E6DD] hover:bg-[#e56546]' 
                  : 'bg-[#445048] text-[#C4AD9D] cursor-not-allowed'
              }`}
              disabled={vehicle.status !== 'Available'}
            >
              {vehicle.status === 'Available' ? 'Rent Now' : vehicle.status}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;