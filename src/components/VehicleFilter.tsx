import React, { useState } from "react";

interface FilterState {
  search: string;
  brands: string[];
  priceRange: [number, number];
  minRating: number;
  categories: string[];
  transmission: string[];
  fuelType: string[];
  vehicle_type: string;
}

interface VehicleFilterProps {
  onFilterChange: (filters: FilterState) => void;
}

const VehicleFilter: React.FC<VehicleFilterProps> = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false); // 🔥 MOBILE DROPDOWN CONTROL

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    brands: [],
    priceRange: [0, 1000],
    minRating: 0,
    categories: [],
    transmission: [],
    fuelType: [],
    vehicle_type: "",
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

  return (
    <div className="w-full">
      {/* 🔥 MOBILE FILTER BUTTON */}
      <div className="sm:hidden mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-[#001524] text-white py-3 rounded-lg font-semibold"
        >
          {isOpen ? "Close Filters" : "Open Filters"}
        </button>
      </div>

      {/* 🔥 FILTER CONTAINER */}
      <div
        className={`
          bg-[#001524] rounded-2xl shadow-lg p-4 sm:p-6
          transition-all duration-300
          
          ${isOpen ? "block" : "hidden"} sm:block
          
          /* DESKTOP SIZE CONTROL */
          sm:max-w-xs w-full
          
          /* 🔥 STICKY SIDEBAR */
          sm:sticky sm:top-6
          
          /* 🔥 INDEPENDENT SCROLL */
          sm:max-h-[85vh] overflow-y-auto
        `}
      >
        <h2 className="text-xl sm:text-2xl font-bold text-[#E9E6DD] mb-6">
          Filters
        </h2>

        {/* SEARCH */}
        <div className="mb-6">
          <label className="block text-[#E9E6DD] mb-2 font-semibold">
            Search
          </label>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleFilterChange({ search: e.target.value })}
            placeholder="Search vehicles..."
            className="w-full bg-[#445048] text-white rounded-lg px-4 py-2"
          />
        </div>

        {/* 🔥 MOBILE QUICK DROPDOWNS */}
        <div className="sm:hidden space-y-3 mb-6">
          <select
            value={filters.vehicle_type}
            onChange={(e) =>
              handleFilterChange({ vehicle_type: e.target.value })
            }
            className="w-full bg-[#445048] text-white rounded-lg px-3 py-2"
          >
            <option value="">All Types</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <select
            onChange={(e) => handleFilterChange({ fuelType: [e.target.value] })}
            className="w-full bg-[#445048] text-white rounded-lg px-3 py-2"
          >
            <option value="">Fuel Type</option>
            {fuelTypes.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>

          <select
            onChange={(e) =>
              handleFilterChange({ transmission: [e.target.value] })
            }
            className="w-full bg-[#445048] text-white rounded-lg px-3 py-2"
          >
            <option value="">Transmission</option>
            {transmissions.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* 🔥 DESKTOP FILTERS ONLY */}
        <div className="hidden sm:block">
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

          {/* RATING */}
          <div className="mb-6">
            <label className="block text-[#E9E6DD] mb-3 font-semibold">
              Rating
            </label>
            <div className="flex gap-2">
              {[0, 1, 2, 3, 4, 5].map((r) => (
                <button
                  key={r}
                  onClick={() => handleFilterChange({ minRating: r })}
                  className={`flex-1 py-1 rounded ${
                    filters.minRating === r
                      ? "bg-[#027480] text-white"
                      : "bg-[#445048] text-gray-300"
                  }`}
                >
                  {r === 0 ? "Any" : `${r}+`}
                </button>
              ))}
            </div>
          </div>

          {/* CATEGORY */}
          <div className="mb-6">
            <label className="block text-[#E9E6DD] mb-3 font-semibold">
              Category
            </label>
            <div className="space-y-2">
              {categories.map((cat) => (
                <label key={cat} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(cat)}
                    onChange={() => toggleArrayFilter("categories", cat)}
                  />
                  <span className="text-white">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* TRANSMISSION */}
          <div className="mb-6">
            <label className="block text-[#E9E6DD] mb-3 font-semibold">
              Transmission
            </label>
            <div className="space-y-2">
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
          </div>

          {/* FUEL */}
          <div className="mb-6">
            <label className="block text-[#E9E6DD] mb-3 font-semibold">
              Fuel Type
            </label>
            <div className="space-y-2">
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
          </div>
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
            })
          }
          className="w-full bg-[#445048] text-white py-2 rounded-lg hover:bg-[#F57251] transition"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default VehicleFilter;
