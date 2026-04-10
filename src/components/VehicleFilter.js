import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
const VehicleFilter = ({ onFilterChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [filters, setFilters] = useState({
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
    const renderFilterContent = (_jsxs(_Fragment, { children: [_jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-[#E9E6DD] mb-2 font-semibold", children: "Search" }), _jsx("input", { type: "text", value: filters.search, onChange: (e) => handleFilterChange({ search: e.target.value }), className: "w-full bg-[#445048] text-white rounded-lg px-4 py-2" })] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-[#E9E6DD] mb-3 font-semibold", children: "Brands" }), _jsx("div", { className: "space-y-2", children: brands.map((brand) => (_jsxs("label", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "checkbox", checked: filters.brands.includes(brand), onChange: () => toggleArrayFilter("brands", brand) }), _jsx("span", { className: "text-white", children: brand })] }, brand))) })] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-[#E9E6DD] mb-3 font-semibold", children: "Price Range" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "number", value: filters.priceRange[0], onChange: (e) => handleFilterChange({
                                    priceRange: [Number(e.target.value), filters.priceRange[1]],
                                }), className: "w-1/2 bg-[#445048] text-white px-2 py-1 rounded" }), _jsx("input", { type: "number", value: filters.priceRange[1], onChange: (e) => handleFilterChange({
                                    priceRange: [filters.priceRange[0], Number(e.target.value)],
                                }), className: "w-1/2 bg-[#445048] text-white px-2 py-1 rounded" })] })] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-[#E9E6DD] mb-3 font-semibold", children: "Category" }), categories.map((c) => (_jsxs("label", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "checkbox", checked: filters.categories.includes(c), onChange: () => toggleArrayFilter("categories", c) }), _jsx("span", { className: "text-white", children: c })] }, c)))] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-[#E9E6DD] mb-3 font-semibold", children: "Transmission" }), transmissions.map((t) => (_jsxs("label", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "checkbox", checked: filters.transmission.includes(t), onChange: () => toggleArrayFilter("transmission", t) }), _jsx("span", { className: "text-white", children: t })] }, t)))] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-[#E9E6DD] mb-3 font-semibold", children: "Fuel Type" }), fuelTypes.map((f) => (_jsxs("label", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "checkbox", checked: filters.fuelType.includes(f), onChange: () => toggleArrayFilter("fuelType", f) }), _jsx("span", { className: "text-white", children: f })] }, f)))] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-[#E9E6DD] mb-3 font-semibold", children: "Availability" }), ["Available", "Rented", "Maintenance"].map((s) => (_jsxs("label", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "checkbox", checked: filters.status.includes(s), onChange: () => toggleArrayFilter("status", s) }), _jsx("span", { className: "text-white", children: s })] }, s)))] }), _jsx("button", { onClick: () => handleFilterChange({
                    search: "",
                    brands: [],
                    priceRange: [0, 1000],
                    minRating: 0,
                    categories: [],
                    transmission: [],
                    fuelType: [],
                    vehicle_type: "",
                    status: [],
                }), className: "w-full bg-[#445048] text-white py-2 rounded-lg hover:bg-[#F57251]", children: "Reset Filters" })] }));
    return (_jsxs("div", { className: "w-full", children: [_jsx("button", { onClick: () => setIsOpen(true), className: "lg:hidden fixed bottom-3 left-4 z-50 bg-[#027480] text-white px-5 py-3 rounded-full flex items-center gap-2 shadow-2xl transition-all hover:scale-105 active:scale-95", children: _jsx("span", { className: "text-sm font-bold uppercase tracking-wider", children: "Filters" }) }), _jsxs("div", { className: `lg:hidden fixed inset-0 z-[60] transition-all duration-300 ${isOpen ? "visible" : "invisible"}`, children: [_jsx("div", { className: `absolute inset-0 bg-black/40 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`, onClick: () => setIsOpen(false) }), _jsxs("div", { className: `absolute bottom-0 left-0 right-0 bg-[#001524] rounded-t-2xl p-4 max-h-[85vh] overflow-y-auto transform transition-transform duration-300 ${isOpen ? "translate-y-0" : "translate-y-full"}`, children: [_jsx("div", { className: "w-12 h-1.5 bg-gray-500 rounded-full mx-auto mb-4" }), _jsx("h2", { className: "text-xl font-bold text-[#E9E6DD] mb-6", children: "Filters" }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-[#E9E6DD] mb-2 font-semibold", children: "Search" }), _jsx("input", { type: "text", value: filters.search, onChange: (e) => handleFilterChange({ search: e.target.value }), className: "w-full bg-[#445048] text-white rounded-lg px-4 py-2" })] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-[#E9E6DD] mb-3 font-semibold", children: "Brands" }), _jsx("div", { className: "space-y-2", children: brands.map((brand) => (_jsxs("label", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "checkbox", checked: filters.brands.includes(brand), onChange: () => toggleArrayFilter("brands", brand) }), _jsx("span", { className: "text-white", children: brand })] }, brand))) })] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-[#E9E6DD] mb-3 font-semibold", children: "Price Range" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "number", value: filters.priceRange[0], onChange: (e) => handleFilterChange({
                                                    priceRange: [Number(e.target.value), filters.priceRange[1]],
                                                }), className: "w-1/2 bg-[#445048] text-white px-2 py-1 rounded" }), _jsx("input", { type: "number", value: filters.priceRange[1], onChange: (e) => handleFilterChange({
                                                    priceRange: [filters.priceRange[0], Number(e.target.value)],
                                                }), className: "w-1/2 bg-[#445048] text-white px-2 py-1 rounded" })] })] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-[#E9E6DD] mb-3 font-semibold", children: "Category" }), categories.map((c) => (_jsxs("label", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "checkbox", checked: filters.categories.includes(c), onChange: () => toggleArrayFilter("categories", c) }), _jsx("span", { className: "text-white", children: c })] }, c)))] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-[#E9E6DD] mb-3 font-semibold", children: "Transmission" }), transmissions.map((t) => (_jsxs("label", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "checkbox", checked: filters.transmission.includes(t), onChange: () => toggleArrayFilter("transmission", t) }), _jsx("span", { className: "text-white", children: t })] }, t)))] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-[#E9E6DD] mb-3 font-semibold", children: "Fuel Type" }), fuelTypes.map((f) => (_jsxs("label", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "checkbox", checked: filters.fuelType.includes(f), onChange: () => toggleArrayFilter("fuelType", f) }), _jsx("span", { className: "text-white", children: f })] }, f)))] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-[#E9E6DD] mb-3 font-semibold", children: "Availability" }), ["Available", "Rented", "Maintenance"].map((s) => (_jsxs("label", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "checkbox", checked: filters.status.includes(s), onChange: () => toggleArrayFilter("status", s) }), _jsx("span", { className: "text-white", children: s })] }, s)))] }), _jsx("button", { onClick: () => handleFilterChange({
                                    search: "",
                                    brands: [],
                                    priceRange: [0, 1000],
                                    minRating: 0,
                                    categories: [],
                                    transmission: [],
                                    fuelType: [],
                                    vehicle_type: "",
                                    status: [],
                                }), className: "w-full bg-[#445048] text-white py-2 rounded-lg hover:bg-[#F57251] mb-4", children: "Reset Filters" }), _jsx("button", { onClick: () => setIsOpen(false), className: "w-full bg-[#027480] text-white py-3 rounded-lg font-semibold", children: "Apply Filters" })] })] }), _jsxs("div", { className: "hidden lg:flex lg:flex-col bg-[#001524] rounded-2xl shadow-lg p-6 w-full max-h-[calc(100vh-60px)] overflow-y-auto", children: [_jsx("h2", { className: "text-2xl font-bold text-[#E9E6DD] mb-6", children: "Filters" }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-[#E9E6DD] mb-2 font-semibold", children: "Search" }), _jsx("input", { type: "text", value: filters.search, onChange: (e) => handleFilterChange({ search: e.target.value }), className: "w-full bg-[#445048] text-white rounded-lg px-4 py-2" })] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-[#E9E6DD] mb-3 font-semibold", children: "Brands" }), _jsx("div", { className: "space-y-2", children: brands.map((brand) => (_jsxs("label", { className: "flex items-center space-x-3 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: filters.brands.includes(brand), onChange: () => toggleArrayFilter("brands", brand), className: "w-4 h-4" }), _jsx("span", { className: "text-white", children: brand })] }, brand))) })] }), _jsxs("div", { className: "mb-6", children: [_jsxs("label", { className: "block text-[#E9E6DD] mb-3 font-semibold", children: ["Price: $", filters.priceRange[0], " - $", filters.priceRange[1]] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "number", value: filters.priceRange[0], onChange: (e) => handleFilterChange({
                                            priceRange: [Number(e.target.value), filters.priceRange[1]],
                                        }), className: "w-1/2 bg-[#445048] text-white px-2 py-1 rounded" }), _jsx("input", { type: "number", value: filters.priceRange[1], onChange: (e) => handleFilterChange({
                                            priceRange: [filters.priceRange[0], Number(e.target.value)],
                                        }), className: "w-1/2 bg-[#445048] text-white px-2 py-1 rounded" })] })] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-[#E9E6DD] mb-3 font-semibold", children: "Category" }), categories.map((c) => (_jsxs("label", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "checkbox", checked: filters.categories.includes(c), onChange: () => toggleArrayFilter("categories", c) }), _jsx("span", { className: "text-white", children: c })] }, c)))] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-[#E9E6DD] mb-3 font-semibold", children: "Transmission" }), transmissions.map((t) => (_jsxs("label", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "checkbox", checked: filters.transmission.includes(t), onChange: () => toggleArrayFilter("transmission", t) }), _jsx("span", { className: "text-white", children: t })] }, t)))] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-[#E9E6DD] mb-3 font-semibold", children: "Fuel Type" }), fuelTypes.map((f) => (_jsxs("label", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "checkbox", checked: filters.fuelType.includes(f), onChange: () => toggleArrayFilter("fuelType", f) }), _jsx("span", { className: "text-white", children: f })] }, f)))] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-[#E9E6DD] mb-3 font-semibold", children: "Availability" }), ["Available", "Rented", "Maintenance"].map((s) => (_jsxs("label", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "checkbox", checked: filters.status.includes(s), onChange: () => toggleArrayFilter("status", s) }), _jsx("span", { className: "text-white", children: s })] }, s)))] }), _jsx("button", { onClick: () => handleFilterChange({
                            search: "",
                            brands: [],
                            priceRange: [0, 1000],
                            minRating: 0,
                            categories: [],
                            transmission: [],
                            fuelType: [],
                            vehicle_type: "",
                            status: [],
                        }), className: "w-full bg-[#445048] text-white py-2 rounded-lg hover:bg-[#F57251] mt-auto", children: "Reset Filters" })] })] }));
};
export default VehicleFilter;
