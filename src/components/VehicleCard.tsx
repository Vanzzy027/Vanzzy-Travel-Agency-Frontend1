// components/VehicleCard.tsx
import React from "react";
import type { VehicleWithSpecs } from "../features/api/VehicleAPI";
import { Settings, Droplet, Users, Car, Star } from "lucide-react";

interface VehicleCardProps {
  vehicle: VehicleWithSpecs;
  onViewDetails?: (vehicleId: number) => void;
  onRentVehicle?: (vehicleId: number) => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  onViewDetails,
  onRentVehicle,
}) => {
  // --- Parse images safely ---
  const images: string[] = React.useMemo(() => {
    try {
      return vehicle.images ? JSON.parse(vehicle.images) : [];
    } catch {
      return [];
    }
  }, [vehicle.images]);

  // --- Parse features safely ---
  const features: string[] = React.useMemo(() => {
    try {
      return vehicle.features ? JSON.parse(vehicle.features) : [];
    } catch {
      return [];
    }
  }, [vehicle.features]);

  // --- Status badge color ---
  const getStatusColor = (status: string) => {
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
  const discountRate =
    vehicle.on_promo && vehicle.promo_rate ? vehicle.promo_rate : 0;
  const discountedPrice =
    vehicle.on_promo && vehicle.promo_rate
      ? Math.round(vehicle.rental_rate * (1 - vehicle.promo_rate / 100))
      : vehicle.rental_rate;

  return (
    <div className="bg-[#001524] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group w-full">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={
            images[0] ||
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=80"
          }
          alt={`${vehicle.manufacturer} ${vehicle.model}`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Status Badge */}
        <div
          className={`absolute top-4 left-4 ${getStatusColor(vehicle.status)} text-white px-3 py-1 rounded-full text-sm font-semibold`}
        >
          {vehicle.status}
        </div>

        {/* Promo Badge */}
        {vehicle.on_promo && discountRate > 0 && (
          <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {discountRate}% OFF
          </div>
        )}

        {/* Vehicle Type Badge */}
        <div className="absolute bottom-4 left-4 bg-gray-700/80 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
          {vehicle.vehicle_type || "Unknown"}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-6 flex flex-col">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between mb-3">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white truncate">
              {vehicle.manufacturer} {vehicle.model}
            </h3>
            <p className="text-gray-300 text-sm truncate">
              {vehicle.year || "Year N/A"} • {vehicle.color || "Color N/A"}
            </p>
          </div>
          <div className="flex items-center mt-2 sm:mt-0 space-x-1">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-white font-semibold">
              {vehicle.review_count ? vehicle.review_count.toFixed(1) : "New"}
            </span>
            <span className="text-gray-400 text-xs">
              ({vehicle.review_count || 0})
            </span>
          </div>
        </div>

        {/* Specifications */}
        <div className="grid grid-cols-2 gap-2 mb-3 text-gray-300 text-sm">
          <div className="flex items-center space-x-1">
            <Settings className="w-4 h-4 text-cyan-400" />
            <span className="truncate">{vehicle.engine_capacity || "N/A"}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Droplet className="w-4 h-4 text-blue-400" />
            <span className="truncate">{vehicle.fuel_type || "N/A"}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Car className="w-4 h-4 text-green-400" />
            <span className="truncate">{vehicle.transmission || "N/A"}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4 text-pink-400" />
            <span className="truncate">
              {vehicle.seating_capacity || "N/A"} Seats
            </span>
          </div>
        </div>

        {/* Features */}
        {features.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {features.slice(0, 3).map((feature, idx) => (
              <span
                key={idx}
                className="bg-gray-700 text-gray-300 px-2 py-1 rounded-lg text-xs truncate"
              >
                {feature}
              </span>
            ))}
            {features.length > 3 && (
              <span className="bg-cyan-500 text-white px-2 py-1 rounded-lg text-xs">
                +{features.length - 3} more
              </span>
            )}
          </div>
        )}

        <div className="pt-4 border-t border-gray-700 space-y-3">
          {/* Pricing */}
          <div className="flex flex-col">
            <div className="flex items-center flex-wrap gap-2 text-white">
              <span className="text-xl sm:text-2xl font-bold">
                ${discountedPrice}
              </span>

              {vehicle.on_promo && vehicle.promo_rate && (
                <span className="text-gray-400 text-sm line-through">
                  ${vehicle.rental_rate}
                </span>
              )}

              <span className="text-gray-400 text-sm">/day</span>
            </div>

            {vehicle.monthly_rate && (
              <span className="text-gray-400 text-xs sm:text-sm">
                ${vehicle.monthly_rate}/mo
              </span>
            )}
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={() => onViewDetails?.(vehicle.vehicle_id)}
              className="w-full bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 transition text-sm font-semibold"
            >
              Details
            </button>

            <button
              onClick={() => onRentVehicle?.(vehicle.vehicle_id)}
              disabled={vehicle.status !== "Available"}
              className={`w-full px-4 py-2 rounded-lg text-sm font-semibold transition ${
                vehicle.status === "Available"
                  ? "bg-orange-500 text-white hover:bg-orange-600"
                  : "bg-gray-700 text-gray-300 cursor-not-allowed"
              }`}
            >
              {vehicle.status === "Available" ? "Rent Now" : vehicle.status}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
