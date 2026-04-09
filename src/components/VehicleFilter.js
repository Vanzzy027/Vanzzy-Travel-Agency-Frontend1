import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
const VehicleFilter = ({ onFilterChange }) => {
    const [isOpen, setIsOpen] = useState(false); // 🔥 MOBILE DROPDOWN CONTROL
    const [filters, setFilters] = useState({
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
    const handleFilterChange = (newFilters) => {
        const updatedFilters = { ...filters, ...newFilters };
        setFilters(updatedFilters);
        onFilterChange(updatedFilters);
    };
    const toggleArrayFilter = (key, value) => {
        const currentArray = filters[key];
        const updatedArray = currentArray.includes(value)
            ? currentArray.filter((item) => item !== value)
            : [...currentArray, value];
        handleFilterChange({ [key]: updatedArray });
    };
    return (_jsxs("div", { className: "w-full", children: [_jsx("div", { className: "sm:hidden mb-4", children: _jsx("button", { onClick: () => setIsOpen(!isOpen), className: "w-full bg-[#001524] text-white py-3 rounded-lg font-semibold", children: isOpen ? "Close Filters" : "Open Filters" }) }), _jsxs("div", { className: `
          bg-[#001524] rounded-2xl shadow-lg p-4 sm:p-6
          transition-all duration-300
          
          ${isOpen ? "block" : "hidden"} sm:block
          
          /* DESKTOP SIZE CONTROL */
          sm:max-w-xs w-full
          
          /* 🔥 STICKY SIDEBAR */
          sm:sticky sm:top-6
          
          /* 🔥 INDEPENDENT SCROLL */
          sm:max-h-[85vh] overflow-y-auto
        `, children: [_jsx("h2", { className: "text-xl sm:text-2xl font-bold text-[#E9E6DD] mb-6", children: "Filters" }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-[#E9E6DD] mb-2 font-semibold", children: "Search" }), _jsx("input", { type: "text", value: filters.search, onChange: (e) => handleFilterChange({ search: e.target.value }), placeholder: "Search vehicles...", className: "w-full bg-[#445048] text-white rounded-lg px-4 py-2" })] }), _jsxs("div", { className: "sm:hidden space-y-3 mb-6", children: [_jsxs("select", { value: filters.vehicle_type, onChange: (e) => handleFilterChange({ vehicle_type: e.target.value }), className: "w-full bg-[#445048] text-white rounded-lg px-3 py-2", children: [_jsx("option", { value: "", children: "All Types" }), categories.map((c) => (_jsx("option", { children: c }, c)))] }), _jsxs("select", { onChange: (e) => handleFilterChange({ fuelType: [e.target.value] }), className: "w-full bg-[#445048] text-white rounded-lg px-3 py-2", children: [_jsx("option", { value: "", children: "Fuel Type" }), fuelTypes.map((f) => (_jsx("option", { children: f }, f)))] }), _jsxs("select", { onChange: (e) => handleFilterChange({ transmission: [e.target.value] }), className: "w-full bg-[#445048] text-white rounded-lg px-3 py-2", children: [_jsx("option", { value: "", children: "Transmission" }), transmissions.map((t) => (_jsx("option", { children: t }, t)))] })] }), _jsxs("div", { className: "hidden sm:block", children: [_jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-[#E9E6DD] mb-3 font-semibold", children: "Brands" }), _jsx("div", { className: "space-y-2", children: brands.map((brand) => (_jsxs("label", { className: "flex items-center space-x-3 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: filters.brands.includes(brand), onChange: () => toggleArrayFilter("brands", brand), className: "w-4 h-4" }), _jsx("span", { className: "text-white", children: brand })] }, brand))) })] }), _jsxs("div", { className: "mb-6", children: [_jsxs("label", { className: "block text-[#E9E6DD] mb-3 font-semibold", children: ["Price: $", filters.priceRange[0], " - $", filters.priceRange[1]] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "number", value: filters.priceRange[0], onChange: (e) => handleFilterChange({
                                                    priceRange: [Number(e.target.value), filters.priceRange[1]],
                                                }), className: "w-1/2 bg-[#445048] text-white px-2 py-1 rounded" }), _jsx("input", { type: "number", value: filters.priceRange[1], onChange: (e) => handleFilterChange({
                                                    priceRange: [filters.priceRange[0], Number(e.target.value)],
                                                }), className: "w-1/2 bg-[#445048] text-white px-2 py-1 rounded" })] })] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-[#E9E6DD] mb-3 font-semibold", children: "Rating" }), _jsx("div", { className: "flex gap-2", children: [0, 1, 2, 3, 4, 5].map((r) => (_jsx("button", { onClick: () => handleFilterChange({ minRating: r }), className: `flex-1 py-1 rounded ${filters.minRating === r
                                                ? "bg-[#027480] text-white"
                                                : "bg-[#445048] text-gray-300"}`, children: r === 0 ? "Any" : `${r}+` }, r))) })] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-[#E9E6DD] mb-3 font-semibold", children: "Category" }), _jsx("div", { className: "space-y-2", children: categories.map((cat) => (_jsxs("label", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "checkbox", checked: filters.categories.includes(cat), onChange: () => toggleArrayFilter("categories", cat) }), _jsx("span", { className: "text-white", children: cat })] }, cat))) })] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-[#E9E6DD] mb-3 font-semibold", children: "Transmission" }), _jsx("div", { className: "space-y-2", children: transmissions.map((t) => (_jsxs("label", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "checkbox", checked: filters.transmission.includes(t), onChange: () => toggleArrayFilter("transmission", t) }), _jsx("span", { className: "text-white", children: t })] }, t))) })] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-[#E9E6DD] mb-3 font-semibold", children: "Fuel Type" }), _jsx("div", { className: "space-y-2", children: fuelTypes.map((f) => (_jsxs("label", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "checkbox", checked: filters.fuelType.includes(f), onChange: () => toggleArrayFilter("fuelType", f) }), _jsx("span", { className: "text-white", children: f })] }, f))) })] })] }), _jsx("button", { onClick: () => handleFilterChange({
                            search: "",
                            brands: [],
                            priceRange: [0, 1000],
                            minRating: 0,
                            categories: [],
                            transmission: [],
                            fuelType: [],
                            vehicle_type: "",
                        }), className: "w-full bg-[#445048] text-white py-2 rounded-lg hover:bg-[#F57251] transition", children: "Reset Filters" })] })] }));
};
export default VehicleFilter;
