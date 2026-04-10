// pages/UserVehiclesPage.tsx
import React, { useState, useMemo } from "react";
import { useGetAvailableVehiclesQuery } from "../../features/api/VehicleAPI";
import VehicleGrid from "../../components/VehicleGrid";
import VehicleFilter from "../../components/VehicleFilter";
import VehicleDetailsModal from "../../Modals/VehicleDetailsModal";
import { Search, Car } from "lucide-react";

const UserVehiclesPage: React.FC = () => {
  const { data: vehicles, isLoading, error } = useGetAvailableVehiclesQuery();
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(
    null,
  );
  const [filters, setFilters] = useState({
    search: "",
    brands: [] as string[],
    categories: [] as string[],
    priceRange: [0, 1000] as [number, number],
    minRating: 0,
    transmission: [] as string[],
    fuelType: [] as string[],
  });

  const handleViewDetails = (vehicleId: number) =>
    setSelectedVehicleId(vehicleId);
  const handleCloseModal = () => setSelectedVehicleId(null);
  const handleFilterChange = (updatedFilters: typeof filters) =>
    setFilters(updatedFilters);

  // Filter vehicles based on search & filters
  const filteredVehicles = useMemo(() => {
    if (!vehicles) return [];

    return vehicles.filter((vehicle) => {
      const searchMatch =
        (vehicle.manufacturer ?? "")
          .toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        (vehicle.model ?? "")
          .toLowerCase()
          .includes(filters.search.toLowerCase());

      const brandMatch =
        filters.brands.length === 0 ||
        filters.brands.includes(vehicle.manufacturer ?? "");

      const categoryMatch =
        filters.categories.length === 0 ||
        filters.categories.includes(vehicle.vehicle_type ?? "");

      const priceMatch =
        vehicle.rental_rate >= filters.priceRange[0] &&
        vehicle.rental_rate <= filters.priceRange[1];

      const transmissionMatch =
        filters.transmission.length === 0 ||
        filters.transmission.includes(vehicle.transmission ?? "");

      const fuelMatch =
        filters.fuelType.length === 0 ||
        filters.fuelType.includes(vehicle.fuel_type ?? "");

      const ratingMatch =
        !(vehicle as any).avg_rating ||
        (vehicle as any).avg_rating >= filters.minRating;

      return (
        searchMatch &&
        brandMatch &&
        categoryMatch &&
        priceMatch &&
        transmissionMatch &&
        fuelMatch &&
        ratingMatch
      );
    });
  }, [vehicles, filters]);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* MOBILE FILTER TRIGGER */}
      <div className="lg:hidden">
        <VehicleFilter onFilterChange={handleFilterChange} />
      </div>

      {/* DESKTOP SIDEBAR */}
      {/* CRITICAL: We remove 'self-start' because we WANT the aside to 
       stretch to the full height of its sibling (the grid). 
       The INNER div is what actually sticks.
    */}
      <aside className="hidden lg:block lg:w-80 shrink-0 relative">
        <div className="sticky top-24 h-fit">
          <VehicleFilter onFilterChange={handleFilterChange} />
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 min-w-0 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#001524]">
              Available Vehicles
            </h1>
            <p className="text-[#445048]">Browse our luxury fleet</p>
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search vehicles..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              className="w-full px-4 py-2 bg-[#001524] text-[#E9E6DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#027480]"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C4AD9D] w-4 h-4" />
          </div>
        </div>

        {/* Results Count */}
        <div className="text-[#445048]">
          Showing {filteredVehicles.length} of {vehicles?.length || 0} vehicles
        </div>

        {/* Vehicle Grid */}
        <VehicleGrid
          vehicles={filteredVehicles}
          loading={isLoading}
          onViewDetails={handleViewDetails}
          onRentVehicle={handleViewDetails}
        />

        {/* MODAL (ONLY ONCE) */}
        {selectedVehicleId !== null && (
          <VehicleDetailsModal
            vehicleId={selectedVehicleId}
            onClose={handleCloseModal}
          />
        )}

        {/* Error */}
        {error && !isLoading && (
          <div className="text-center py-12 bg-[#001524] rounded-2xl">
            <div className="text-6xl mb-4">🚗</div>
            <h3 className="text-2xl font-bold text-[#E9E6DD] mb-2">
              Error Loading Vehicles
            </h3>
            <p className="text-[#C4AD9D]">Please try again later.</p>
          </div>
        )}

        {/* Empty */}
        {!isLoading && filteredVehicles.length === 0 && (
          <div className="text-center py-12 bg-[#001524] rounded-2xl">
            <Car className="mx-auto text-[#C4AD9D] w-16 h-16 mb-4" />
            <h3 className="text-2xl font-bold text-[#E9E6DD] mb-2">
              No vehicles found
            </h3>
            <p className="text-[#C4AD9D]">Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserVehiclesPage;
