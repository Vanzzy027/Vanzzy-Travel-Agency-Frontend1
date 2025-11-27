import React, { useState } from 'react';

interface FilterState {
  search: string;
  brands: string[];
  priceRange: [number, number];
  minRating: number;
  categories: string[];
  transmission: string[];
  fuelType: string[];
}

interface VehicleFilterProps {
  onFilterChange: (filters: FilterState) => void;
}

const VehicleFilter: React.FC<VehicleFilterProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    brands: [],
    priceRange: [0, 1000],
    minRating: 0,
    categories: [],
    transmission: [],
    fuelType: []
  });

  const brands = ['Ferrari', 'Lamborghini', 'Porsche', 'McLaren', 'Aston Martin', 'Bugatti', 'Rolls Royce', 'Bentley'];
  const categories = ['Sports Car', 'Coupe', 'Convertible', 'Sedan', 'SUV'];
  const transmissions = ['Automatic', 'Manual', 'Semi-Auto'];
  const fuelTypes = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const toggleArrayFilter = (key: keyof FilterState, value: string) => {
    const currentArray = filters[key] as string[];
    const updatedArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    handleFilterChange({ [key]: updatedArray });
  };

  return (
    <div className="bg-[#001524] rounded-2xl p-6 shadow-lg h-fit sticky top-6">
      <h2 className="text-2xl font-bold text-[#E9E6DD] mb-6">Filters</h2>

      {/* Search */}
      <div className="mb-6">
        <label className="block text-[#E9E6DD] mb-2 font-semibold">Search</label>
        <input
          type="text"
          placeholder="Search vehicles..."
          className="w-full bg-[#445048] text-[#E9E6DD] placeholder-[#C4AD9D] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#027480]"
          value={filters.search}
          onChange={(e) => handleFilterChange({ search: e.target.value })}
        />
      </div>

      {/* Brands */}
      <div className="mb-6">
        <label className="block text-[#E9E6DD] mb-3 font-semibold">Brands</label>
        <div className="space-y-2">
          {brands.map(brand => (
            <label key={brand} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.brands.includes(brand)}
                onChange={() => toggleArrayFilter('brands', brand)}
                className="w-4 h-4 text-[#027480] bg-[#445048] border-[#445048] rounded focus:ring-[#027480]"
              />
              <span className="text-[#E9E6DD]">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <label className="block text-[#E9E6DD] mb-3 font-semibold">
          Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}/day
        </label>
        <div className="flex space-x-4">
          <input
            type="number"
            placeholder="Min"
            className="w-1/2 bg-[#445048] text-[#E9E6DD] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#027480]"
            value={filters.priceRange[0]}
            onChange={(e) => handleFilterChange({ 
              priceRange: [Number(e.target.value), filters.priceRange[1]] 
            })}
          />
          <input
            type="number"
            placeholder="Max"
            className="w-1/2 bg-[#445048] text-[#E9E6DD] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#027480]"
            value={filters.priceRange[1]}
            onChange={(e) => handleFilterChange({ 
              priceRange: [filters.priceRange[0], Number(e.target.value)] 
            })}
          />
        </div>
      </div>

      {/* Rating */}
      <div className="mb-6">
        <label className="block text-[#E9E6DD] mb-3 font-semibold">Minimum Rating</label>
        <div className="flex space-x-2">
          {[0, 1, 2, 3, 4, 5].map(rating => (
            <button
              key={rating}
              onClick={() => handleFilterChange({ minRating: rating })}
              className={`flex-1 py-2 rounded-lg transition-all duration-200 ${
                filters.minRating === rating
                  ? 'bg-[#027480] text-[#E9E6DD]'
                  : 'bg-[#445048] text-[#C4AD9D] hover:bg-[#027480] hover:text-[#E9E6DD]'
              }`}
            >
              {rating === 0 ? 'Any' : `${rating}+`}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <label className="block text-[#E9E6DD] mb-3 font-semibold">Vehicle Type</label>
        <div className="space-y-2">
          {categories.map(category => (
            <label key={category} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.categories.includes(category)}
                onChange={() => toggleArrayFilter('categories', category)}
                className="w-4 h-4 text-[#027480] bg-[#445048] border-[#445048] rounded focus:ring-[#027480]"
              />
              <span className="text-[#E9E6DD]">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Transmission */}
      <div className="mb-6">
        <label className="block text-[#E9E6DD] mb-3 font-semibold">Transmission</label>
        <div className="space-y-2">
          {transmissions.map(transmission => (
            <label key={transmission} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.transmission.includes(transmission)}
                onChange={() => toggleArrayFilter('transmission', transmission)}
                className="w-4 h-4 text-[#027480] bg-[#445048] border-[#445048] rounded focus:ring-[#027480]"
              />
              <span className="text-[#E9E6DD]">{transmission}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Fuel Type */}
      <div className="mb-6">
        <label className="block text-[#E9E6DD] mb-3 font-semibold">Fuel Type</label>
        <div className="space-y-2">
          {fuelTypes.map(fuelType => (
            <label key={fuelType} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.fuelType.includes(fuelType)}
                onChange={() => toggleArrayFilter('fuelType', fuelType)}
                className="w-4 h-4 text-[#027480] bg-[#445048] border-[#445048] rounded focus:ring-[#027480]"
              />
              <span className="text-[#E9E6DD]">{fuelType}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Reset Filters */}
      <button
        onClick={() => handleFilterChange({
          search: '',
          brands: [],
          priceRange: [0, 1000],
          minRating: 0,
          categories: [],
          transmission: [],
          fuelType: []
        })}
        className="w-full bg-[#445048] text-[#E9E6DD] py-3 rounded-lg hover:bg-[#F57251] transition-colors duration-200 font-semibold"
      >
        Reset Filters
      </button>
    </div>
  );
};

export default VehicleFilter;