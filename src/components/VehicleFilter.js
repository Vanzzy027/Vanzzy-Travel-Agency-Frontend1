import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
const VehicleFilter = ({ onFilterChange }) => {
    const [filters, setFilters] = useState({
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
    const handleFilterChange = (newFilters) => {
        const updatedFilters = { ...filters, ...newFilters };
        setFilters(updatedFilters);
        onFilterChange(updatedFilters);
    };
    const toggleArrayFilter = (key, value) => {
        const currentArray = filters[key];
        const updatedArray = currentArray.includes(value)
            ? currentArray.filter(item => item !== value)
            : [...currentArray, value];
        handleFilterChange({ [key]: updatedArray });
    };
    return (_jsxs("div", { className: "bg-[#001524] rounded-2xl p-6 shadow-lg h-fit sticky top-6", children: [_jsx("h2", { className: "text-2xl font-bold text-[#E9E6DD] mb-6", children: "Filters" }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-[#E9E6DD] mb-2 font-semibold", children: "Search" }), _jsx("input", { type: "text", placeholder: "Search vehicles...", className: "w-full bg-[#445048] text-[#E9E6DD] placeholder-[#C4AD9D] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#027480]", value: filters.search, onChange: (e) => handleFilterChange({ search: e.target.value }) })] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-[#E9E6DD] mb-3 font-semibold", children: "Brands" }), _jsx("div", { className: "space-y-2", children: brands.map(brand => (_jsxs("label", { className: "flex items-center space-x-3 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: filters.brands.includes(brand), onChange: () => toggleArrayFilter('brands', brand), className: "w-4 h-4 text-[#027480] bg-[#445048] border-[#445048] rounded focus:ring-[#027480]" }), _jsx("span", { className: "text-[#E9E6DD]", children: brand })] }, brand))) })] }), _jsxs("div", { className: "mb-6", children: [_jsxs("label", { className: "block text-[#E9E6DD] mb-3 font-semibold", children: ["Price Range: $", filters.priceRange[0], " - $", filters.priceRange[1], "/day"] }), _jsxs("div", { className: "flex space-x-4", children: [_jsx("input", { type: "number", placeholder: "Min", className: "w-1/2 bg-[#445048] text-[#E9E6DD] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#027480]", value: filters.priceRange[0], onChange: (e) => handleFilterChange({
                                    priceRange: [Number(e.target.value), filters.priceRange[1]]
                                }) }), _jsx("input", { type: "number", placeholder: "Max", className: "w-1/2 bg-[#445048] text-[#E9E6DD] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#027480]", value: filters.priceRange[1], onChange: (e) => handleFilterChange({
                                    priceRange: [filters.priceRange[0], Number(e.target.value)]
                                }) })] })] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-[#E9E6DD] mb-3 font-semibold", children: "Minimum Rating" }), _jsx("div", { className: "flex space-x-2", children: [0, 1, 2, 3, 4, 5].map(rating => (_jsx("button", { onClick: () => handleFilterChange({ minRating: rating }), className: `flex-1 py-2 rounded-lg transition-all duration-200 ${filters.minRating === rating
                                ? 'bg-[#027480] text-[#E9E6DD]'
                                : 'bg-[#445048] text-[#C4AD9D] hover:bg-[#027480] hover:text-[#E9E6DD]'}`, children: rating === 0 ? 'Any' : `${rating}+` }, rating))) })] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-[#E9E6DD] mb-3 font-semibold", children: "Vehicle Type" }), _jsx("div", { className: "space-y-2", children: categories.map(category => (_jsxs("label", { className: "flex items-center space-x-3 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: filters.categories.includes(category), onChange: () => toggleArrayFilter('categories', category), className: "w-4 h-4 text-[#027480] bg-[#445048] border-[#445048] rounded focus:ring-[#027480]" }), _jsx("span", { className: "text-[#E9E6DD]", children: category })] }, category))) })] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-[#E9E6DD] mb-3 font-semibold", children: "Transmission" }), _jsx("div", { className: "space-y-2", children: transmissions.map(transmission => (_jsxs("label", { className: "flex items-center space-x-3 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: filters.transmission.includes(transmission), onChange: () => toggleArrayFilter('transmission', transmission), className: "w-4 h-4 text-[#027480] bg-[#445048] border-[#445048] rounded focus:ring-[#027480]" }), _jsx("span", { className: "text-[#E9E6DD]", children: transmission })] }, transmission))) })] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-[#E9E6DD] mb-3 font-semibold", children: "Fuel Type" }), _jsx("div", { className: "space-y-2", children: fuelTypes.map(fuelType => (_jsxs("label", { className: "flex items-center space-x-3 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: filters.fuelType.includes(fuelType), onChange: () => toggleArrayFilter('fuelType', fuelType), className: "w-4 h-4 text-[#027480] bg-[#445048] border-[#445048] rounded focus:ring-[#027480]" }), _jsx("span", { className: "text-[#E9E6DD]", children: fuelType })] }, fuelType))) })] }), _jsx("button", { onClick: () => handleFilterChange({
                    search: '',
                    brands: [],
                    priceRange: [0, 1000],
                    minRating: 0,
                    categories: [],
                    transmission: [],
                    fuelType: []
                }), className: "w-full bg-[#445048] text-[#E9E6DD] py-3 rounded-lg hover:bg-[#F57251] transition-colors duration-200 font-semibold", children: "Reset Filters" })] }));
};
export default VehicleFilter;
