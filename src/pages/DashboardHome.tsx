
import React from 'react';
import VehicleGrid from '../components/VehicleGrid';

const DashboardHome: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#001524] mb-2">Vehicle Fleet Dashboard</h1>
        <p className="text-[#445048]">Manage and monitor your rental vehicle fleet</p>
      </div>
      
      <VehicleGrid vehicles={[]} />
    </div>
  );
};

export default DashboardHome;








// import React from 'react';

// const DashboardHome: React.FC = () => {
//   const stats = [
//     { title: 'Total Revenue', value: '$24,580', change: '+12%', color: 'text-[#027480]' },
//     { title: 'Active Rentals', value: '12', change: '+5%', color: 'text-[#F57251]' },
//     { title: 'Available Vehicles', value: '8', change: '-2%', color: 'text-[#D6CC99]' },
//     { title: 'Customer Satisfaction', value: '98%', change: '+3%', color: 'text-[#445048]' },
//   ];

//   const recentBookings = [
//     { id: 'BK001', customer: 'John Smith', vehicle: 'Ferrari F8 Tributo', date: '2024-01-25', status: 'Active' },
//     { id: 'BK002', customer: 'Sarah Johnson', vehicle: 'Lamborghini Huracán', date: '2024-01-24', status: 'Completed' },
//     { id: 'BK003', customer: 'Mike Wilson', vehicle: 'Porsche 911 Turbo', date: '2024-01-23', status: 'Upcoming' },
//   ];

//   return (
//     <div>
//       {/* Welcome Section */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-[#001524] mb-2">Welcome back, VansKE-Travel-Agency!</h1>
//         <p className="text-[#445048]">Here's what's happening with your business today.</p>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         {stats.map((stat, index) => (
//           <div key={index} className="bg-[#001524] rounded-2xl p-6 shadow-lg">
//             <h3 className="text-[#C4AD9D] text-sm font-semibold mb-2">{stat.title}</h3>
//             <div className="flex items-baseline justify-between">
//               <div className="text-2xl font-bold text-[#E9E6DD]">{stat.value}</div>
//               <div className={`text-sm font-semibold ${stat.color}`}>{stat.change}</div>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* Recent Bookings */}
//         <div className="bg-[#001524] rounded-2xl p-6 shadow-lg">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-xl font-bold text-[#E9E6DD]">Recent Bookings</h2>
//             <button className="text-[#027480] hover:text-[#F57251] transition-colors text-sm font-semibold">
//               View All
//             </button>
//           </div>
//           <div className="space-y-4">
//             {recentBookings.map((booking) => (
//               <div key={booking.id} className="flex items-center justify-between p-4 bg-[#445048] rounded-lg">
//                 <div>
//                   <div className="text-[#E9E6DD] font-semibold">{booking.customer}</div>
//                   <div className="text-[#C4AD9D] text-sm">{booking.vehicle}</div>
//                   <div className="text-[#C4AD9D] text-xs">{booking.date}</div>
//                 </div>
//                 <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                   booking.status === 'Active' ? 'bg-[#027480] text-[#E9E6DD]' :
//                   booking.status === 'Completed' ? 'bg-[#445048] text-[#C4AD9D]' :
//                   'bg-[#D6CC99] text-[#001524]'
//                 }`}>
//                   {booking.status}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Quick Actions */}
//         <div className="bg-[#001524] rounded-2xl p-6 shadow-lg">
//           <h2 className="text-xl font-bold text-[#E9E6DD] mb-6">Quick Actions</h2>
//           <div className="grid grid-cols-2 gap-4">
//             <button className="bg-[#027480] text-[#E9E6DD] p-4 rounded-lg hover:bg-[#026270] transition-colors text-center">
//               <div className="text-2xl mb-2">🚗</div>
//               <div className="font-semibold">Add Vehicle</div>
//             </button>
//             <button className="bg-[#F57251] text-[#E9E6DD] p-4 rounded-lg hover:bg-[#e56546] transition-colors text-center">
//               <div className="text-2xl mb-2">📋</div>
//               <div className="font-semibold">New Booking</div>
//             </button>
//             <button className="bg-[#445048] text-[#E9E6DD] p-4 rounded-lg hover:bg-[#39423b] transition-colors text-center">
//               <div className="text-2xl mb-2">👥</div>
//               <div className="font-semibold">Customers</div>
//             </button>
//             <button className="bg-[#D6CC99] text-[#001524] p-4 rounded-lg hover:bg-[#c9bc87] transition-colors text-center">
//               <div className="text-2xl mb-2">📊</div>
//               <div className="font-semibold">Reports</div>
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardHome;