// components/VehicleShowcase.tsx
import React from 'react';
import { useNavigate } from "react-router-dom";

const featuredVehicles = [
  {
    id: 1,
    manufacturer: "Ferrari",
    model: "F8 Tributo",
    image: "https://images.unsplash.com/photo-1614200179396-2bdb77ebf81b?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: 899,
    type: "Sports Car",
    features: ["V8 Engine", "Automatic", "2 Seater"],
  },
  {
    id: 2,
    manufacturer: "Lamborghini",
    model: "Huracán EVO",
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    price: 1299,
    type: "Sports Car",
    features: ["V10 Engine", "Automatic", "2 Seater"]
  },
  {
    id: 3,
    manufacturer: "Porsche",
    model: "911 Turbo S",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    price: 699,
    type: "Sports Car",
    features: ["Flat-6 Engine", "Automatic", "4 Seater"]
  }
];

const VehicleShowcase: React.FC = () => {
  const navigate = useNavigate();

  // 🔐 shared function
  const handleProtectedNav = (path: string) => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    navigate(path);
  };

  return (
    <section className="py-16 bg-[#E9E6DD]">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#001524] mb-4">Featured Supercars</h2>
          <p className="text-[#445048] text-lg max-w-2xl mx-auto">
            Experience the thrill of driving the world's most exclusive supercars
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredVehicles.map((vehicle) => (
            <div key={vehicle.id} className="bg-[#001524] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="h-48 overflow-hidden">
                <img 
                  src={vehicle.image} 
                  alt={`${vehicle.manufacturer} ${vehicle.model}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-[#E9E6DD]">
                      {vehicle.manufacturer} {vehicle.model}
                    </h3>
                    <p className="text-[#C4AD9D]">{vehicle.type}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#F57251]">${vehicle.price}</div>
                    <div className="text-[#C4AD9D] text-sm">per day</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {vehicle.features.map((feature, index) => (
                    <span 
                      key={index}
                      className="bg-[#445048] text-[#E9E6DD] px-3 py-1 rounded-full text-sm"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* 🔐 View Details button with auth check */}
                <button 
                  onClick={() => handleProtectedNav(`/UserDashboard/vehicles/${vehicle.id}`)}
                  className="w-full bg-[#027480] text-[#E9E6DD] py-3 rounded-lg hover:bg-[#F57251] transition-colors duration-200 font-semibold"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          {/* 🔐 View All Vehicles button with auth check */}
          <button 
            onClick={() => handleProtectedNav("/UserDashboard/vehicles")}
            className="bg-[#001524] text-[#E9E6DD] px-8 py-4 rounded-full hover:bg-[#027480] transition-colors duration-200 font-semibold text-lg"
          >
            View All Vehicles
          </button>
        </div>
      </div>
    </section>
  );
};

export default VehicleShowcase;


// // components/VehicleShowcase.tsx
// import React from 'react';

// const featuredVehicles = [
//   {
//     id: 1,
//     manufacturer: "Ferrari",
//     model: "F8 Tributo",
//     image: "https://images.unsplash.com/photo-1614200179396-2bdb77ebf81b?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     price: 899,
//     type: "Sports Car",
//     features: ["V8 Engine", "Automatic", "2 Seater"],
    
//   },
//   {
//     id: 2,
//     manufacturer: "Lamborghini",
//     model: "Huracán EVO",
//     image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
//     price: 1299,
//     type: "Sports Car",
//     features: ["V10 Engine", "Automatic", "2 Seater"]
//   },
//   {
//     id: 3,
//     manufacturer: "Porsche",
//     model: "911 Turbo S",
//     image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
//     price: 699,
//     type: "Sports Car",
//     features: ["Flat-6 Engine", "Automatic", "4 Seater"]
//   }
// ];

// const VehicleShowcase: React.FC = () => {
//   return (
//     <section className="py-16 bg-[#E9E6DD]">
//       <div className="max-w-7xl mx-auto px-8">
//         <div className="text-center mb-12">
//           <h2 className="text-4xl font-bold text-[#001524] mb-4">Featured Supercars</h2>
//           <p className="text-[#445048] text-lg max-w-2xl mx-auto">
//             Experience the thrill of driving the world's most exclusive supercars
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {featuredVehicles.map((vehicle) => (
//             <div key={vehicle.id} className="bg-[#001524] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
//               <div className="h-48 overflow-hidden">
//                 <img 
//                   src={vehicle.image} 
//                   alt={`${vehicle.manufacturer} ${vehicle.model}`}
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//               <div className="p-6">
//                 <div className="flex justify-between items-start mb-3">
//                   <div>
//                     <h3 className="text-xl font-bold text-[#E9E6DD]">
//                       {vehicle.manufacturer} {vehicle.model}
//                     </h3>
//                     <p className="text-[#C4AD9D]">{vehicle.type}</p>
//                   </div>
//                   <div className="text-right">
//                     <div className="text-2xl font-bold text-[#F57251]">${vehicle.price}</div>
//                     <div className="text-[#C4AD9D] text-sm">per day</div>
//                   </div>
//                 </div>
//                 <div className="flex flex-wrap gap-2 mb-4">
//                   {vehicle.features.map((feature, index) => (
//                     <span 
//                       key={index}
//                       className="bg-[#445048] text-[#E9E6DD] px-3 py-1 rounded-full text-sm"
//                     >
//                       {feature}
//                     </span>
//                   ))}
//                 </div>
//                 <button className="w-full bg-[#027480] text-[#E9E6DD] py-3 rounded-lg hover:bg-[#F57251] transition-colors duration-200 font-semibold">
//                   View Details
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="text-center mt-12">
//           <button className="bg-[#001524] text-[#E9E6DD] px-8 py-4 rounded-full hover:bg-[#027480] transition-colors duration-200 font-semibold text-lg">
//             View All Vehicles
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default VehicleShowcase;