import React, { useState, useEffect } from "react";

interface FilterState {
  search: string;
  brands: string[];
  priceRange: [number, number];
  minRating: number;
  categories: string[];
  transmission: string[];
  fuelType: string[];
  vehicle_type: string;
  status: string[];
}

interface VehicleFilterProps {
  onFilterChange: (filters: FilterState) => void;
}

const VehicleFilter: React.FC<VehicleFilterProps> = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    brands: [],
    priceRange: [0, 1000],
    minRating: 0,
    categories: [],
    transmission: [],
    fuelType: [],
    vehicle_type: "",
    status: [],
  });

  const brands = [
    "Ferrari",
    "Lamborghini",
    "Porsche",
    "McLaren",
    "Aston Martin",
    "Bugatti",
    "Rolls-Royce",
    "Bentley",
  ];
  const categories = ["Sports Car", "Coupe", "Convertible", "Sedan", "SUV"];
  const transmissions = ["Automatic", "Manual", "Semi-Auto"];
  const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid"];

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const toggleArrayFilter = (key: keyof FilterState, value: string) => {
    const currentArray = filters[key] as string[];
    const updatedArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value];
    handleFilterChange({ [key]: updatedArray });
  };

  const renderFilterContent = (
    <>
      {/* SEARCH */}
      <div className="mb-6">
        <label className="block text-[#E9E6DD] mb-2 font-semibold">
          Search
        </label>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => handleFilterChange({ search: e.target.value })}
          className="w-full bg-[#445048] text-white rounded-lg px-4 py-2"
        />
      </div>

      {/* BRANDS */}
      <div className="mb-6">
        <label className="block text-[#E9E6DD] mb-3 font-semibold">
          Brands
        </label>
        <div className="space-y-2">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.brands.includes(brand)}
                onChange={() => toggleArrayFilter("brands", brand)}
              />
              <span className="text-white">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* PRICE */}
      <div className="mb-6">
        <label className="block text-[#E9E6DD] mb-3 font-semibold">
          Price Range
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            value={filters.priceRange[0]}
            onChange={(e) =>
              handleFilterChange({
                priceRange: [Number(e.target.value), filters.priceRange[1]],
              })
            }
            className="w-1/2 bg-[#445048] text-white px-2 py-1 rounded"
          />
          <input
            type="number"
            value={filters.priceRange[1]}
            onChange={(e) =>
              handleFilterChange({
                priceRange: [filters.priceRange[0], Number(e.target.value)],
              })
            }
            className="w-1/2 bg-[#445048] text-white px-2 py-1 rounded"
          />
        </div>
      </div>

      {/* CATEGORY */}
      <div className="mb-6">
        <label className="block text-[#E9E6DD] mb-3 font-semibold">
          Category
        </label>
        {categories.map((c) => (
          <label key={c} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={filters.categories.includes(c)}
              onChange={() => toggleArrayFilter("categories", c)}
            />
            <span className="text-white">{c}</span>
          </label>
        ))}
      </div>

      {/* TRANSMISSION */}
      <div className="mb-6">
        <label className="block text-[#E9E6DD] mb-3 font-semibold">
          Transmission
        </label>
        {transmissions.map((t) => (
          <label key={t} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={filters.transmission.includes(t)}
              onChange={() => toggleArrayFilter("transmission", t)}
            />
            <span className="text-white">{t}</span>
          </label>
        ))}
      </div>

      {/* FUEL */}
      <div className="mb-6">
        <label className="block text-[#E9E6DD] mb-3 font-semibold">
          Fuel Type
        </label>
        {fuelTypes.map((f) => (
          <label key={f} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={filters.fuelType.includes(f)}
              onChange={() => toggleArrayFilter("fuelType", f)}
            />
            <span className="text-white">{f}</span>
          </label>
        ))}
      </div>

      {/* STATUS */}
      <div className="mb-6">
        <label className="block text-[#E9E6DD] mb-3 font-semibold">
          Availability
        </label>
        {["Available", "Rented", "Maintenance"].map((s) => (
          <label key={s} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={filters.status.includes(s)}
              onChange={() => toggleArrayFilter("status", s)}
            />
            <span className="text-white">{s}</span>
          </label>
        ))}
      </div>

      {/* RESET */}
      <button
        onClick={() =>
          handleFilterChange({
            search: "",
            brands: [],
            priceRange: [0, 1000],
            minRating: 0,
            categories: [],
            transmission: [],
            fuelType: [],
            vehicle_type: "",
            status: [],
          })
        }
        className="w-full bg-[#445048] text-white py-2 rounded-lg hover:bg-[#F57251]"
      >
        Reset Filters
      </button>
    </>
  );

  return (
    <div className="w-full">
      {/* MOBILE FILTER BUTTON */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-3 left-4 z-50 bg-[#027480] text-white px-5 py-3 rounded-full flex items-center gap-2 shadow-2xl transition-all hover:scale-105 active:scale-95"
      >
        <span className="text-sm font-bold uppercase tracking-wider">
          Filters
        </span>
      </button>

      {/* MOBILE SLIDE PANEL */}
      <div
        className={`lg:hidden fixed inset-0 z-[60] transition-all duration-300 ${
          isOpen ? "visible" : "invisible"
        }`}
      >
        {/* BACKDROP */}
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsOpen(false)}
        />

        {/* SLIDE PANEL */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-[#001524] rounded-t-2xl p-4 max-h-[85vh] overflow-y-auto transform transition-transform duration-300 ${
            isOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          {/* HANDLE BAR */}
          <div className="w-12 h-1.5 bg-gray-500 rounded-full mx-auto mb-4" />

          <h2 className="text-xl font-bold text-[#E9E6DD] mb-6">Filters</h2>

          {/* SEARCH */}
          <div className="mb-6">
            <label className="block text-[#E9E6DD] mb-2 font-semibold">
              Search
            </label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange({ search: e.target.value })}
              className="w-full bg-[#445048] text-white rounded-lg px-4 py-2"
            />
          </div>

          {/* BRANDS */}
          <div className="mb-6">
            <label className="block text-[#E9E6DD] mb-3 font-semibold">
              Brands
            </label>
            <div className="space-y-2">
              {brands.map((brand) => (
                <label key={brand} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.brands.includes(brand)}
                    onChange={() => toggleArrayFilter("brands", brand)}
                  />
                  <span className="text-white">{brand}</span>
                </label>
              ))}
            </div>
          </div>

          {/* PRICE */}
          <div className="mb-6">
            <label className="block text-[#E9E6DD] mb-3 font-semibold">
              Price Range
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={filters.priceRange[0]}
                onChange={(e) =>
                  handleFilterChange({
                    priceRange: [Number(e.target.value), filters.priceRange[1]],
                  })
                }
                className="w-1/2 bg-[#445048] text-white px-2 py-1 rounded"
              />
              <input
                type="number"
                value={filters.priceRange[1]}
                onChange={(e) =>
                  handleFilterChange({
                    priceRange: [filters.priceRange[0], Number(e.target.value)],
                  })
                }
                className="w-1/2 bg-[#445048] text-white px-2 py-1 rounded"
              />
            </div>
          </div>

          {/* CATEGORY */}
          <div className="mb-6">
            <label className="block text-[#E9E6DD] mb-3 font-semibold">
              Category
            </label>
            {categories.map((c) => (
              <label key={c} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.categories.includes(c)}
                  onChange={() => toggleArrayFilter("categories", c)}
                />
                <span className="text-white">{c}</span>
              </label>
            ))}
          </div>

          {/* TRANSMISSION */}
          <div className="mb-6">
            <label className="block text-[#E9E6DD] mb-3 font-semibold">
              Transmission
            </label>
            {transmissions.map((t) => (
              <label key={t} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.transmission.includes(t)}
                  onChange={() => toggleArrayFilter("transmission", t)}
                />
                <span className="text-white">{t}</span>
              </label>
            ))}
          </div>

          {/* FUEL */}
          <div className="mb-6">
            <label className="block text-[#E9E6DD] mb-3 font-semibold">
              Fuel Type
            </label>
            {fuelTypes.map((f) => (
              <label key={f} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.fuelType.includes(f)}
                  onChange={() => toggleArrayFilter("fuelType", f)}
                />
                <span className="text-white">{f}</span>
              </label>
            ))}
          </div>

          {/* STATUS */}
          <div className="mb-6">
            <label className="block text-[#E9E6DD] mb-3 font-semibold">
              Availability
            </label>
            {["Available", "Rented", "Maintenance"].map((s) => (
              <label key={s} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.status.includes(s)}
                  onChange={() => toggleArrayFilter("status", s)}
                />
                <span className="text-white">{s}</span>
              </label>
            ))}
          </div>

          {/* RESET */}
          <button
            onClick={() =>
              handleFilterChange({
                search: "",
                brands: [],
                priceRange: [0, 1000],
                minRating: 0,
                categories: [],
                transmission: [],
                fuelType: [],
                vehicle_type: "",
                status: [],
              })
            }
            className="w-full bg-[#445048] text-white py-2 rounded-lg hover:bg-[#F57251] mb-4"
          >
            Reset Filters
          </button>

          {/* CLOSE BUTTON */}
          <button
            onClick={() => setIsOpen(false)}
            className="w-full bg-[#027480] text-white py-3 rounded-lg font-semibold"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* DESKTOP FILTERS - STICKY & FIXED HEIGHT */}
      <div className="hidden lg:flex lg:flex-col bg-[#001524] rounded-2xl shadow-lg p-6 w-full max-h-[calc(100vh-60px)] overflow-y-auto">
        <h2 className="text-2xl font-bold text-[#E9E6DD] mb-6">Filters</h2>

        {/* SEARCH */}
        <div className="mb-6">
          <label className="block text-[#E9E6DD] mb-2 font-semibold">
            Search
          </label>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleFilterChange({ search: e.target.value })}
            className="w-full bg-[#445048] text-white rounded-lg px-4 py-2"
          />
        </div>

        {/* BRANDS */}
        <div className="mb-6">
          <label className="block text-[#E9E6DD] mb-3 font-semibold">
            Brands
          </label>
          <div className="space-y-2">
            {brands.map((brand) => (
              <label
                key={brand}
                className="flex items-center space-x-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={filters.brands.includes(brand)}
                  onChange={() => toggleArrayFilter("brands", brand)}
                  className="w-4 h-4"
                />
                <span className="text-white">{brand}</span>
              </label>
            ))}
          </div>
        </div>

        {/* PRICE */}
        <div className="mb-6">
          <label className="block text-[#E9E6DD] mb-3 font-semibold">
            Price: ${filters.priceRange[0]} - ${filters.priceRange[1]}
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={filters.priceRange[0]}
              onChange={(e) =>
                handleFilterChange({
                  priceRange: [Number(e.target.value), filters.priceRange[1]],
                })
              }
              className="w-1/2 bg-[#445048] text-white px-2 py-1 rounded"
            />
            <input
              type="number"
              value={filters.priceRange[1]}
              onChange={(e) =>
                handleFilterChange({
                  priceRange: [filters.priceRange[0], Number(e.target.value)],
                })
              }
              className="w-1/2 bg-[#445048] text-white px-2 py-1 rounded"
            />
          </div>
        </div>

        {/* CATEGORY */}
        <div className="mb-6">
          <label className="block text-[#E9E6DD] mb-3 font-semibold">
            Category
          </label>
          {categories.map((c) => (
            <label key={c} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.categories.includes(c)}
                onChange={() => toggleArrayFilter("categories", c)}
              />
              <span className="text-white">{c}</span>
            </label>
          ))}
        </div>

        {/* TRANSMISSION */}
        <div className="mb-6">
          <label className="block text-[#E9E6DD] mb-3 font-semibold">
            Transmission
          </label>
          {transmissions.map((t) => (
            <label key={t} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.transmission.includes(t)}
                onChange={() => toggleArrayFilter("transmission", t)}
              />
              <span className="text-white">{t}</span>
            </label>
          ))}
        </div>

        {/* FUEL */}
        <div className="mb-6">
          <label className="block text-[#E9E6DD] mb-3 font-semibold">
            Fuel Type
          </label>
          {fuelTypes.map((f) => (
            <label key={f} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.fuelType.includes(f)}
                onChange={() => toggleArrayFilter("fuelType", f)}
              />
              <span className="text-white">{f}</span>
            </label>
          ))}
        </div>

        {/* STATUS */}
        <div className="mb-6">
          <label className="block text-[#E9E6DD] mb-3 font-semibold">
            Availability
          </label>
          {["Available", "Rented", "Maintenance"].map((s) => (
            <label key={s} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.status.includes(s)}
                onChange={() => toggleArrayFilter("status", s)}
              />
              <span className="text-white">{s}</span>
            </label>
          ))}
        </div>

        {/* RESET BUTTON */}
        <button
          onClick={() =>
            handleFilterChange({
              search: "",
              brands: [],
              priceRange: [0, 1000],
              minRating: 0,
              categories: [],
              transmission: [],
              fuelType: [],
              vehicle_type: "",
              status: [],
            })
          }
          className="w-full bg-[#445048] text-white py-2 rounded-lg hover:bg-[#F57251] mt-auto"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default VehicleFilter;
