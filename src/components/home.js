import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// components/Home.tsx
import { useState } from 'react';
import Hero from '../components/Hero';
import VehicleGrid from '../components/VehicleGrid';
import VehicleFilter from '../components/VehicleFilter';
// Mock data based on your schema
const mockVehicles = [
    {
        vehicle_id: 1,
        vehicleSpec_id: 1,
        vin_number: "ZFBERFAH2E6W01111",
        license_plate: "VAN-FER1",
        current_mileage: 12000,
        rental_rate: 899,
        status: "Available",
        created_at: "2024-01-15",
        updated_at: "2024-01-15",
        specification: {
            vehicleSpec_id: 1,
            manufacturer: "Ferrari",
            model: "F8 Tributo",
            year: 2023,
            fuel_type: "Petrol",
            engine_capacity: "3.9L V8",
            transmission: "Automatic",
            seating_capacity: 2,
            color: "Rosso Corsa",
            features: JSON.stringify(["Apple CarPlay", "Carbon Ceramic Brakes", "Launch Control", "Race Mode", "Premium Sound System", "Leather Interior"]),
            images: JSON.stringify(["https://images.unsplash.com/photo-1563720223485-41b76d31f5c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"]),
            on_promo: true,
            review_count: 47,
            vehicle_type: "Sports Car",
            fuel_efficiency: "15 MPG",
            daily_rate: 999,
            weekly_rate: 5999,
            monthly_rate: 21999,
            insurance_group: "High"
        }
    },
    {
        vehicle_id: 2,
        vehicleSpec_id: 2,
        vin_number: "ZHWUR2ZF5LLA01112",
        license_plate: "VAN-LAM1",
        current_mileage: 8000,
        rental_rate: 1299,
        status: "Available",
        created_at: "2024-01-10",
        updated_at: "2024-01-10",
        specification: {
            vehicleSpec_id: 2,
            manufacturer: "Lamborghini",
            model: "Huracán EVO",
            year: 2024,
            fuel_type: "Petrol",
            engine_capacity: "5.2L V10",
            transmission: "Automatic",
            seating_capacity: 2,
            color: "Arancio Borealis",
            features: JSON.stringify(["Lamborghini Dinamica Veicolo", "Magnetic Suspension", "Carbon Fiber Package", "Sport Exhaust", "Lifting System", "Race Mode"]),
            images: JSON.stringify(["https://images.unsplash.com/photo-1544636331-e26879cd4d9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"]),
            on_promo: false,
            review_count: 89,
            vehicle_type: "Sports Car",
            fuel_efficiency: "13 MPG",
            daily_rate: 1299,
            weekly_rate: 7799,
            monthly_rate: 27999,
            insurance_group: "Very High"
        }
    },
    {
        vehicle_id: 3,
        vehicleSpec_id: 3,
        vin_number: "WP0ZZZ99ZTS392111",
        license_plate: "VAN-POR1",
        current_mileage: 15000,
        rental_rate: 699,
        status: "Available",
        created_at: "2024-01-20",
        updated_at: "2024-01-20",
        specification: {
            vehicleSpec_id: 3,
            manufacturer: "Porsche",
            model: "911 Turbo S",
            year: 2023,
            fuel_type: "Petrol",
            engine_capacity: "3.7L Flat-6",
            transmission: "Automatic",
            seating_capacity: 4,
            color: "GT Silver Metallic",
            features: JSON.stringify(["Porsche Communication Management", "Sport Chrono Package", "Adaptive Suspension", "Rear-Axle Steering", "Night Vision Assist"]),
            images: JSON.stringify(["https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"]),
            on_promo: true,
            review_count: 156,
            vehicle_type: "Sports Car",
            fuel_efficiency: "20 MPG",
            daily_rate: 799,
            weekly_rate: 4499,
            monthly_rate: 16999,
            insurance_group: "High"
        }
    },
    {
        vehicle_id: 4,
        vehicleSpec_id: 4,
        vin_number: "SBM12ABA1EW001113",
        license_plate: "VAN-MCL1",
        current_mileage: 5000,
        rental_rate: 1599,
        status: "Rented",
        created_at: "2024-01-05",
        updated_at: "2024-01-25",
        specification: {
            vehicleSpec_id: 4,
            manufacturer: "McLaren",
            model: "720S",
            year: 2024,
            fuel_type: "Petrol",
            engine_capacity: "4.0L V8",
            transmission: "Automatic",
            seating_capacity: 2,
            color: "Sarthe Grey",
            features: JSON.stringify(["Variable Drift Control", "Race Mode", "Carbon Ceramic Brakes", "Bowers & Wilkins Audio", "Telemetry System"]),
            images: JSON.stringify(["https://images.unsplash.com/photo-1626019857f10b22ff2d868b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"]),
            on_promo: false,
            review_count: 34,
            vehicle_type: "Sports Car",
            fuel_efficiency: "18 MPG",
            daily_rate: 1599,
            weekly_rate: 9599,
            monthly_rate: 34999,
            insurance_group: "Very High"
        }
    },
    {
        vehicle_id: 5,
        vehicleSpec_id: 5,
        vin_number: "SCFPD2331MGC11114",
        license_plate: "VAN-AM1",
        current_mileage: 3000,
        rental_rate: 799,
        status: "Available",
        created_at: "2024-01-18",
        updated_at: "2024-01-18",
        specification: {
            vehicleSpec_id: 5,
            manufacturer: "Aston Martin",
            model: "Vantage",
            year: 2024,
            fuel_type: "Petrol",
            engine_capacity: "4.0L V8",
            transmission: "Automatic",
            seating_capacity: 2,
            color: "Quantum Silver",
            features: JSON.stringify(["Bang & Olufsen Sound", "Sports Plus Seats", "Carbon Fiber Exterior", "360 Camera", "Parking Assist"]),
            images: JSON.stringify(["https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"]),
            on_promo: true,
            review_count: 78,
            vehicle_type: "Sports Car",
            fuel_efficiency: "22 MPG",
            daily_rate: 899,
            weekly_rate: 4999,
            monthly_rate: 18999,
            insurance_group: "High"
        }
    },
    {
        vehicle_id: 6,
        vehicleSpec_id: 6,
        vin_number: "W1KYF4DB2RA111115",
        license_plate: "VAN-MER1",
        current_mileage: 10000,
        rental_rate: 599,
        status: "Available",
        created_at: "2024-01-12",
        updated_at: "2024-01-12",
        specification: {
            vehicleSpec_id: 6,
            manufacturer: "Mercedes-Benz",
            model: "AMG GT",
            year: 2023,
            fuel_type: "Petrol",
            engine_capacity: "4.0L V8",
            transmission: "Automatic",
            seating_capacity: 2,
            color: "Selenite Grey",
            features: JSON.stringify(["AMG Performance Exhaust", "AMG Ride Control", "Burmester Sound", "Head-up Display", "Driver Assistance Package"]),
            images: JSON.stringify(["https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"]),
            on_promo: false,
            review_count: 112,
            vehicle_type: "Sports Car",
            fuel_efficiency: "21 MPG",
            daily_rate: 599,
            weekly_rate: 3499,
            monthly_rate: 12999,
            insurance_group: "Medium"
        }
    }
];
const Home = () => {
    const [vehicles] = useState(mockVehicles);
    const [filteredVehicles, setFilteredVehicles] = useState(mockVehicles);
    const [loading, setLoading] = useState(false);
    const handleFilterChange = (filters) => {
        setLoading(true);
        // Simulate API call delay
        setTimeout(() => {
            let filtered = [...vehicles];
            // Search filter
            if (filters.search) {
                filtered = filtered.filter(vehicle => `${vehicle.specification.manufacturer} ${vehicle.specification.model}`
                    .toLowerCase()
                    .includes(filters.search.toLowerCase()));
            }
            // Brand filter
            if (filters.brands.length > 0) {
                filtered = filtered.filter(vehicle => filters.brands.includes(vehicle.specification.manufacturer));
            }
            // Price range filter
            filtered = filtered.filter(vehicle => vehicle.rental_rate >= filters.priceRange[0] &&
                vehicle.rental_rate <= filters.priceRange[1]);
            // Rating filter
            if (filters.minRating > 0) {
                filtered = filtered.filter(v => v.rental_rate >= filters.priceRange[0] &&
                    v.rental_rate <= filters.priceRange[1]);
            }
            // Category filter
            if (filters.categories.length > 0) {
                filtered = filtered.filter(vehicle => filters.categories.includes(vehicle.specification.vehicle_type));
            }
            // Transmission filter
            if (filters.transmission.length > 0) {
                filtered = filtered.filter(vehicle => filters.transmission.includes(vehicle.specification.transmission));
            }
            // Fuel type filter
            if (filters.fuelType.length > 0) {
                filtered = filtered.filter(vehicle => filters.fuelType.includes(vehicle.specification.fuel_type));
            }
            setFilteredVehicles(filtered);
            setLoading(false);
        }, 500);
    };
    return (_jsxs("main", { className: "flex-1", children: [_jsx("div", { className: "px-8", children: _jsx(Hero, {}) }), _jsxs("div", { className: "flex", children: [_jsx("div", { className: "w-80 flex-shrink-0 p-6", children: _jsx(VehicleFilter, { onFilterChange: handleFilterChange }) }), _jsxs("div", { className: "flex-1 p-6", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-4xl font-bold text-[#001524] mb-4", children: "Luxury Supercar Fleet" }), _jsx("p", { className: "text-[#445048] text-lg", children: "Experience the thrill of driving the world's most exclusive supercars. Each vehicle is meticulously maintained and comes with comprehensive insurance." })] }), _jsx(VehicleGrid, { vehicles: filteredVehicles, loading: loading })] })] }), _jsx("div", { className: "bg-[#001524] rounded-2xl mx-6 my-8 p-8", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6 text-center", children: [_jsxs("div", { children: [_jsx("div", { className: "text-3xl font-bold text-[#F57251] mb-2", children: "50+" }), _jsx("div", { className: "text-[#E9E6DD]", children: "Premium Vehicles" })] }), _jsxs("div", { children: [_jsx("div", { className: "text-3xl font-bold text-[#027480] mb-2", children: "24/7" }), _jsx("div", { className: "text-[#E9E6DD]", children: "Customer Support" })] }), _jsxs("div", { children: [_jsx("div", { className: "text-3xl font-bold text-[#D6CC99] mb-2", children: "1000+" }), _jsx("div", { className: "text-[#E9E6DD]", children: "Happy Customers" })] }), _jsxs("div", { children: [_jsx("div", { className: "text-3xl font-bold text-[#C4AD9D] mb-2", children: "5\u2605" }), _jsx("div", { className: "text-[#E9E6DD]", children: "Average Rating" })] })] }) })] }));
};
export default Home;
