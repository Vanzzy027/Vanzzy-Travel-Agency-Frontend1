import React, { useState, useMemo } from "react";
import { useGetVehiclesQuery } from "../features/api/VehicleAPI";
import VehicleGrid from "../components/VehicleGrid";
import VehicleFilter from "../components/VehicleFilter";
import VehicleDetailsModal from "../Modals/VehicleDetailsModal";
import { Search, Car } from "lucide-react";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

const FleetPage: React.FC = () => {
  const { data: vehicles, isLoading, error } = useGetVehiclesQuery();

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
    status: [] as string[],
  });

  // ✅ HANDLE BUTTON CLICK (THIS OPENS MODAL)
  const handleViewDetails = (vehicleId: number) => {
    console.log("Opening modal for:", vehicleId); // debug (optional)
    setSelectedVehicleId(vehicleId);
  };

  const handleCloseModal = () => {
    setSelectedVehicleId(null);
  };

  const handleFilterChange = (updatedFilters: typeof filters) => {
    setFilters(updatedFilters);
  };

  // ✅ FILTER LOGIC
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

      const statusMatch =
        filters.status.length === 0 || filters.status.includes(vehicle.status);

      return (
        searchMatch &&
        brandMatch &&
        categoryMatch &&
        priceMatch &&
        transmissionMatch &&
        fuelMatch &&
        ratingMatch &&
        statusMatch
      );
    });
  }, [vehicles, filters]);

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#E9E6DD]">
      <Navbar />

      {/* ✅ MAIN CONTENT BELOW NAVBAR */}
      <div className="flex flex-col lg:flex-row gap-6 p-4 flex-1">
        {/* FILTER SIDEBAR */}
        <div className="hidden lg:block lg:w-80 flex-shrink-0">
      
            <div className="sticky top-6">
            <VehicleFilter onFilterChange={handleFilterChange} />
          </div>
        </div>

        {/* MOBILE FILTER - Only rendered on mobile/tablet */}
        <div className="lg:hidden">
          <VehicleFilter onFilterChange={handleFilterChange} />
        </div>

        {/* ================= MAIN CONTENT ================= */}
        <div className="flex-1 space-y-6 min-w-0">
          {/* HEADER */}
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#001524]">
                Our Vehicles
              </h1>
              <p className="text-[#445048]">Browse our luxury fleet</p>
            </div>

            {/* SEARCH */}
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

          {/* RESULTS COUNT */}
          <div className="text-[#445048]">
            Showing {filteredVehicles.length} of {vehicles?.length || 0}{" "}
            vehicles
          </div>

          {/* VEHICLE GRID */}
          <VehicleGrid
            vehicles={filteredVehicles}
            loading={isLoading}
            onViewDetails={handleViewDetails}
            onRentVehicle={handleViewDetails}
          />

          {/* MODAL */}
          {selectedVehicleId && (
            <VehicleDetailsModal
              vehicleId={selectedVehicleId}
              onClose={handleCloseModal}
            />
          )}

          {/* ERROR */}
          {error && !isLoading && (
            <div className="text-center py-12 bg-[#001524] rounded-2xl">
              <Car className="mx-auto text-red-400 w-16 h-16 mb-4" />
              <h3 className="text-2xl font-bold text-[#E9E6DD] mb-2">
                Error Loading Vehicles
              </h3>
              <p className="text-[#C4AD9D]">Please try again later.</p>
            </div>
          )}

          {/* EMPTY */}
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
    </div>
  );
};

export default FleetPage;
