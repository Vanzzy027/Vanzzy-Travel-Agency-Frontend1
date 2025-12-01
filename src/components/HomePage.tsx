// import React, { useState } from 'react';
// import VehicleGrid from './VehicleGrid';
// import VehicleFilter from './VehicleFilter';

// // Mock data based on your schema
// const mockVehicles = [
//   {
//     vehicle_id: 1,
//     vehicleSpec_id: 1,
//     vin_number: "ZFBERFAH2E6W01111",
//     license_plate: "VAN-FER1",
//     current_mileage: 12000,
//     rental_rate: 899,
//     status: "Available",
//     created_at: "2024-01-15",
//     updated_at: "2024-01-15",
//     specification: {
//       vehicleSpec_id: 1,
//       manufacturer: "Ferrari",
//       model: "F8 Tributo",
//       year: 2023,
//       fuel_type: "Petrol",
//       engine_capacity: "3.9L V8",
//       transmission: "Automatic",
//       seating_capacity: 2,
//       color: "Rosso Corsa",
//       features: JSON.stringify(["Apple CarPlay", "Carbon Ceramic Brakes", "Launch Control", "Race Mode"]),
//       images: JSON.stringify(["https://images.unsplash.com/photo-1563720223485-41b76d31f5c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"]),
//       on_promo: true,
//       review_count: 47,
//       vehicle_type: "Sports Car",
//       fuel_efficiency: "15 MPG",
//       daily_rate: 999,
//       weekly_rate: 5999,
//       monthly_rate: 21999,
//       insurance_group: "High"
//     }
//   },
//   {
//     vehicle_id: 2,
//     vehicleSpec_id: 2,
//     vin_number: "ZHWUR2ZF5LLA01112",
//     license_plate: "VAN-LAM1",
//     current_mileage: 8000,
//     rental_rate: 1299,
//     status: "Available",
//     created_at: "2024-01-10",
//     updated_at: "2024-01-10",
//     specification: {
//       vehicleSpec_id: 2,
//       manufacturer: "Lamborghini",
//       model: "Huracán EVO",
//       year: 2024,
//       fuel_type: "Petrol",
//       engine_capacity: "5.2L V10",
//       transmission: "Automatic",
//       seating_capacity: 2,
//       color: "Arancio Borealis",
//       features: JSON.stringify(["Lamborghini Dinamica Veicolo", "Magnetic Suspension", "Carbon Fiber Package", "Sport Exhaust"]),
//       images: JSON.stringify(["https://images.unsplash.com/photo-1544636331-e26879cd4d9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"]),
//       on_promo: false,
//       review_count: 89,
//       vehicle_type: "Sports Car",
//       fuel_efficiency: "13 MPG",
//       daily_rate: 1299,
//       weekly_rate: 7799,
//       monthly_rate: 27999,
//       insurance_group: "Very High"
//     }
//   },
//   // Add more mock vehicles as needed
// ];

// const HomePage: React.FC = () => {
//   const [vehicles] = useState(mockVehicles);
//   const [filteredVehicles, setFilteredVehicles] = useState(mockVehicles);
//   const [loading, setLoading] = useState(false);

//   const handleFilterChange = (filters: any) => {
//     setLoading(true);
    
//     // Simulate API call delay
//     setTimeout(() => {
//       let filtered = [...vehicles];

//       // Search filter
//       if (filters.search) {
//         filtered = filtered.filter(vehicle =>
//           `${vehicle.specification.manufacturer} ${vehicle.specification.model}`
//             .toLowerCase()
//             .includes(filters.search.toLowerCase())
//         );
//       }

//       // Brand filter
//       if (filters.brands.length > 0) {
//         filtered = filtered.filter(vehicle =>
//           filters.brands.includes(vehicle.specification.manufacturer)
//         );
//       }

//       // Price range filter
//       filtered = filtered.filter(vehicle =>
//         vehicle.rental_rate >= filters.priceRange[0] &&
//         vehicle.rental_rate <= filters.priceRange[1]
//       );

//       // Category filter
//       if (filters.categories.length > 0) {
//         filtered = filtered.filter(vehicle =>
//           filters.categories.includes(vehicle.specification.vehicle_type)
//         );
//       }

//       setFilteredVehicles(filtered);
//       setLoading(false);
//     }, 500);
//   };

//   return (
//     <div className="min-h-screen bg-[#E9E6DD]">
//       <div className="flex">
//         {/* Sidebar with Filters */}
//         <div className="w-80 flex-shrink-0 p-6">
//           <VehicleFilter onFilterChange={handleFilterChange} />
//         </div>

//         {/* Main Content */}
//         <main className="flex-1 p-6">
//           <div className="mb-8">
//             <h1 className="text-4xl font-bold text-[#001524] mb-4">
//               Luxury Supercar Fleet
//             </h1>
//             <p className="text-[#445048] text-lg">
//               Experience the thrill of driving the world's most exclusive supercars
//             </p>
//           </div>

//           <VehicleGrid vehicles={filteredVehicles} loading={loading} />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default HomePage;