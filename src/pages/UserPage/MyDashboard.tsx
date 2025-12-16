import React from 'react';
import { Link } from 'react-router-dom';
import { useGetUserBookingsQuery } from '../../features/api/BookingApi';
import { Car, AlertCircle, Calendar, DollarSign, CheckCircle } from 'lucide-react';

const UserDashboardHome: React.FC = () => {
  const { data: bookings, isLoading } = useGetUserBookingsQuery();

  // 1. Status Logic
  const activeBooking = bookings?.find(b => b.status === 'Active');
  
  // Note: Depending on your API, this might need to sort by date to get the *nearest* upcoming booking
  const upcomingBooking = bookings?.find(b => b.status === 'Confirmed' || b.status === 'Pending');

  const totalSpent = bookings?.reduce((acc, curr) => acc + Number(curr.total_amount), 0) || 0;
  const totalTrips = bookings?.filter(b => b.status === 'Completed').length || 0;

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#027480] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#E9E6DD] text-lg">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  // HELPER: function to safely get date to avoid TS errors if field names vary
  const getBookingDate = (dateString?: string) => {
    return dateString ? new Date(dateString).toLocaleDateString() : '—';
  };

  return (
    <div className="space-y-4 md:space-y-6 lg:space-y-8">
      
      {/* HERO SECTION */}
      {activeBooking ? (
        <div className="bg-gradient-to-r from-[#001524] to-[#027480] rounded-xl md:rounded-2xl lg:rounded-3xl p-4 md:p-6 lg:p-8 shadow-xl border border-[#445048] relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="bg-[#F57251] text-[#E9E6DD] px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-block">
                  In Progress
                </span>
              </div>
              <div className="hidden md:block">
                <Car className="text-[#E9E6DD]/50 w-8 h-8" />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div>
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#E9E6DD] mb-2">On the road?</h1>
                <p className="text-[#C4AD9D] text-sm md:text-base mb-4">You are currently renting a vehicle.</p>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="bg-[#E9E6DD] text-[#001524] px-4 py-2 md:px-6 md:py-3 rounded-lg font-bold hover:bg-white transition-colors text-sm md:text-base">
                    Report Issue
                  </button>
                  <button className="border border-[#E9E6DD] text-[#E9E6DD] px-4 py-2 md:px-6 md:py-3 rounded-lg font-bold hover:bg-[#E9E6DD]/10 transition-colors text-sm md:text-base">
                    Extend Rental
                  </button>
                </div>
              </div>
              
              <div className="flex justify-center mt-4 md:mt-0">
                <img 
                  src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=80" 
                  alt="Current Car" 
                  className="rounded-lg md:rounded-xl lg:rounded-xl shadow-lg border-2 md:border-4 border-[#445048]/50 w-full max-w-xs md:max-w-md"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#445048] rounded-xl md:rounded-2xl lg:rounded-3xl p-4 md:p-6 lg:p-8 shadow-xl text-center md:text-left relative overflow-hidden">
          <div className="relative z-10">
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#E9E6DD] mb-2">Ready for your next trip?</h1>
                <p className="text-[#C4AD9D] text-sm md:text-base mb-6">Choose from our premium fleet of SUVs, Sedans, and Off-roaders.</p>
                <Link 
                  to="/UserDashboard/vehicles" 
                  className="bg-[#F57251] text-[#E9E6DD] px-6 py-3 md:px-8 md:py-4 rounded-lg md:rounded-xl font-bold text-base md:text-lg hover:bg-[#e56546] transition-colors shadow-lg inline-block w-full md:w-auto"
                >
                  Find a Car →
                </Link>
              </div>
              <div className="hidden md:flex justify-center opacity-50">
                <span className="text-6xl lg:text-8xl">🏎️</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: PERSONALIZED STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-[#001524] p-4 md:p-6 rounded-xl md:rounded-2xl border-l-4 border-[#027480] shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[#C4AD9D] text-xs md:text-sm font-medium">Upcoming Trips</p>
            <Calendar className="w-4 h-4 md:w-5 md:h-5 text-[#027480]" />
          </div>
          <p className="text-2xl md:text-3xl font-bold text-[#E9E6DD]">{upcomingBooking ? '1' : '0'}</p>
          {upcomingBooking && (
            <p className="text-xs text-[#027480] mt-1">
              Next: {getBookingDate(upcomingBooking.booking_date)}
            </p>
          )}
        </div>
        
        <div className="bg-[#001524] p-4 md:p-6 rounded-xl md:rounded-2xl border-l-4 border-[#F57251] shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[#C4AD9D] text-xs md:text-sm font-medium">Total Trips</p>
            <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-[#F57251]" />
          </div>
          <p className="text-2xl md:text-3xl font-bold text-[#E9E6DD]">{totalTrips}</p>
          <p className="text-xs text-[#C4AD9D] mt-1">Completed rentals</p>
        </div>
        
        <div className="bg-[#001524] p-4 md:p-6 rounded-xl md:rounded-2xl border-l-4 border-[#D6CC99] shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[#C4AD9D] text-xs md:text-sm font-medium">Total Spent</p>
            <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-[#D6CC99]" />
          </div>
          <p className="text-2xl md:text-3xl font-bold text-[#E9E6DD]">${totalSpent.toLocaleString()}</p>
          <p className="text-xs text-[#C4AD9D] mt-1">Lifetime spending</p>
        </div>
      </div>

      {/* SECTION 3: SPLIT VIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* Left: Recent Bookings */}
        <div className="lg:col-span-2 bg-[#001524] rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-[#445048]/30">
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <h3 className="text-lg md:text-xl font-bold text-[#E9E6DD]">Recent Activity</h3>
            <Link to="/UserDashboard/my-bookings" className="text-[#027480] text-xs md:text-sm hover:underline font-medium">
              View All
            </Link>
          </div>

          <div className="space-y-3 md:space-y-4">
            {bookings?.slice(0, 4).map((booking) => (
              <div key={booking.booking_id} className="flex items-center justify-between p-3 md:p-4 bg-[#445048]/20 rounded-lg md:rounded-xl hover:bg-[#445048]/40 transition-colors">
                <div className="flex items-center space-x-3 md:space-x-4">
                  <div className="bg-[#445048] p-2 md:p-3 rounded-lg text-xl md:text-2xl">🚗</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#E9E6DD] font-semibold text-sm md:text-base truncate">Booking #{booking.booking_id}</p>
                    <p className="text-[#C4AD9D] text-xs">
                      {getBookingDate(booking.booking_date)}
                    </p>
                  </div>
                </div>
                <div className="text-right ml-2">
                  <p className="text-[#E9E6DD] font-bold text-sm md:text-base">${booking.total_amount}</p>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    booking.status === 'Active' ? 'bg-[#027480]/20 text-[#027480]' :
                    booking.status === 'Confirmed' ? 'bg-[#D6CC99]/20 text-[#D6CC99]' :
                    'text-[#C4AD9D] bg-[#445048]/30'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
            
            {!bookings?.length && (
              <div className="text-[#C4AD9D] text-center py-4 text-sm md:text-base">
                No recent booking history found.
                <Link to="/UserDashboard/vehicles" className="text-[#027480] hover:underline ml-2">
                  Book your first ride →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right: Notifications */}
        <div className="bg-[#001524] rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-[#445048]/30">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h3 className="text-lg md:text-xl font-bold text-[#E9E6DD]">Alerts</h3>
            <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-[#F57251]" />
          </div>
          
          <div className="space-y-3 md:space-y-4">
            <div className="flex items-start space-x-3 p-3 bg-[#D6CC99]/10 rounded-lg border border-[#D6CC99]/20">
              <span className="text-[#D6CC99] text-sm">🔔</span>
              <div className="flex-1 min-w-0">
                <p className="text-[#E9E6DD] text-xs md:text-sm font-semibold">Complete Profile</p>
                <p className="text-[#C4AD9D] text-xs mt-1">Add your driver's license to speed up checkout.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-[#027480]/10 rounded-lg border border-[#027480]/20">
              <span className="text-[#027480] text-sm">🏷️</span>
              <div className="flex-1 min-w-0">
                <p className="text-[#E9E6DD] text-xs md:text-sm font-semibold">New Promo Available</p>
                <p className="text-[#C4AD9D] text-xs mt-1">Get 10% off your next weekend rental.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-[#F57251]/10 rounded-lg border border-[#F57251]/20">
              <span className="text-[#F57251] text-sm">⚠️</span>
              <div className="flex-1 min-w-0">
                <p className="text-[#E9E6DD] text-xs md:text-sm font-semibold">Policy Update</p>
                <p className="text-[#C4AD9D] text-xs mt-1">Review our updated terms and conditions.</p>
              </div>
            </div>

            <Link 
              to="/UserDashboard/support" 
              className="flex items-center justify-center w-full mt-4 py-2 md:py-3 border border-[#F57251] text-[#F57251] rounded-lg md:rounded-xl hover:bg-[#F57251] hover:text-[#E9E6DD] transition-all font-semibold text-sm md:text-base"
            >
              Emergency Support
            </Link>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS - Mobile Only */}
      <div className="lg:hidden grid grid-cols-2 gap-3 md:gap-4">
        <Link 
          to="/UserDashboard/vehicles" 
          className="bg-[#027480] text-[#E9E6DD] p-3 rounded-xl hover:bg-[#026270] transition-colors text-center"
        >
          <div className="text-lg mb-1">🚗</div>
          <p className="text-xs font-semibold">Book Car</p>
        </Link>
        
        <Link 
          to="/UserDashboard/my-bookings" 
          className="bg-[#445048] text-[#E9E6DD] p-3 rounded-xl hover:bg-[#5a625b] transition-colors text-center"
        >
          <div className="text-lg mb-1">📋</div>
          <p className="text-xs font-semibold">My Bookings</p>
        </Link>
        
        <Link 
          to="/UserDashboard/profile" 
          className="bg-[#D6CC99] text-[#001524] p-3 rounded-xl hover:bg-[#c4b788] transition-colors text-center"
        >
          <div className="text-lg mb-1">👤</div>
          <p className="text-xs font-semibold">Profile</p>
        </Link>
        
        <Link 
          to="/UserDashboard/support" 
          className="bg-[#F57251] text-[#E9E6DD] p-3 rounded-xl hover:bg-[#e56546] transition-colors text-center"
        >
          <div className="text-lg mb-1">🆘</div>
          <p className="text-xs font-semibold">Support</p>
        </Link>
      </div>
    </div>
  );
};

export default UserDashboardHome;



// import React from 'react';
// import { Link } from 'react-router-dom';
// import { useGetUserBookingsQuery } from '../../features/api/BookingApi';

// const UserDashboardHome: React.FC = () => {
//   const { data: bookings, isLoading } = useGetUserBookingsQuery();

//   // 1. Status Logic
//   const activeBooking = bookings?.find(b => b.status === 'Active');
  
//   // Note: Depending on your API, this might need to sort by date to get the *nearest* upcoming booking
//   const upcomingBooking = bookings?.find(b => b.status === 'Confirmed' || b.status === 'Pending');

//   const totalSpent = bookings?.reduce((acc, curr) => acc + Number(curr.total_amount), 0) || 0;
//   const totalTrips = bookings?.filter(b => b.status === 'Completed').length || 0;

//   if (isLoading) {
//     return <div className="text-[#E9E6DD] animate-pulse">Loading Dashboard...</div>;
//   }

//   // HELPER: function to safely get date to avoid TS errors if field names vary
//   // If you update your Interface to include 'start_date', change 'booking_date' back to 'start_date' here.
//   const getBookingDate = (dateString?: string) => {
//     return dateString ? new Date(dateString).toLocaleDateString() : '—';
//   };

//   return (
//     <div className="space-y-8">
      
//       {/* HERO SECTION */}
//       {activeBooking ? (
//         <div className="bg-gradient-to-r from-[#001524] to-[#027480] rounded-3xl p-8 shadow-2xl border border-[#445048] relative overflow-hidden">
//           <div className="relative z-10 flex flex-col md:flex-row justify-between items-center">
//             <div className="mb-6 md:mb-0">
//               <span className="bg-[#F57251] text-[#E9E6DD] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 inline-block">
//                 In Progress
//               </span>
//               <h1 className="text-3xl font-bold text-[#E9E6DD] mb-1">On the road?</h1>
//               <p className="text-[#C4AD9D] mb-4">You are currently renting a vehicle.</p>
              
//               <div className="flex space-x-4">
//                 <button className="bg-[#E9E6DD] text-[#001524] px-6 py-2 rounded-lg font-bold hover:bg-white transition-colors">
//                   Report Issue
//                 </button>
//                 <button className="border border-[#E9E6DD] text-[#E9E6DD] px-6 py-2 rounded-lg font-bold hover:bg-[#E9E6DD]/10 transition-colors">
//                   Extend Rental
//                 </button>
//               </div>
//             </div>
            
//             <div className="w-full md:w-1/2 flex justify-center">
//                <img 
//                  src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=80" 
//                  alt="Current Car" 
//                  className="rounded-xl shadow-lg border-4 border-[#445048]/50" 
//                />
//             </div>
//           </div>
//         </div>
//       ) : (
//         <div className="bg-[#445048] rounded-3xl p-8 shadow-xl text-center md:text-left relative overflow-hidden">
//           <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
//             <div>
//               <h1 className="text-4xl font-bold text-[#E9E6DD] mb-2">Ready for your next trip?</h1>
//               <p className="text-[#C4AD9D] mb-6">Choose from our premium fleet of SUVs, Sedans, and Off-roaders.</p>
//               <Link 
//                 to="/UserDashboard/vehicles" 
//                 className="bg-[#F57251] text-[#E9E6DD] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#e56546] transition-colors shadow-lg inline-block"
//               >
//                 Find a Car ➜
//               </Link>
//             </div>
//             <div className="hidden md:block opacity-50">
//                <span className="text-9xl">🏎️</span>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* SECTION 2: PERSONALIZED STATS */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <div className="bg-[#001524] p-6 rounded-2xl border-l-4 border-[#027480] shadow-lg">
//           <p className="text-[#C4AD9D] text-sm font-medium">Upcoming Trips</p>
//           <p className="text-3xl font-bold text-[#E9E6DD]">{upcomingBooking ? '1' : '0'}</p>
//           {/* FIX 1: Switched to booking_date. If your API has 'start_date', add it to your interface and switch back. */}
//           {upcomingBooking && (
//             <p className="text-xs text-[#027480] mt-1">
//               Next: {getBookingDate(upcomingBooking.booking_date)}
//             </p>
//           )}
//         </div>
//         <div className="bg-[#001524] p-6 rounded-2xl border-l-4 border-[#F57251] shadow-lg">
//           <p className="text-[#C4AD9D] text-sm font-medium">Total Trips Completed</p>
//           <p className="text-3xl font-bold text-[#E9E6DD]">{totalTrips}</p>
//         </div>
//         <div className="bg-[#001524] p-6 rounded-2xl border-l-4 border-[#D6CC99] shadow-lg">
//           <p className="text-[#C4AD9D] text-sm font-medium">Lifetime Spent</p>
//           <p className="text-3xl font-bold text-[#E9E6DD]">${totalSpent.toLocaleString()}</p>
//         </div>
//       </div>

//       {/* SECTION 3: SPLIT VIEW */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
//         {/* Left: Recent Bookings */}
//         <div className="lg:col-span-2 bg-[#001524] rounded-2xl p-6 shadow-lg border border-[#445048]/30">
//           <div className="flex justify-between items-center mb-6">
//             <h3 className="text-xl font-bold text-[#E9E6DD]">Recent Activity</h3>
//             <Link to="/UserDashboard/bookings" className="text-[#027480] text-sm hover:underline">View All</Link>
//           </div>

//           <div className="space-y-4">
//             {bookings?.slice(0, 4).map((booking) => (
//               <div key={booking.booking_id} className="flex items-center justify-between p-4 bg-[#445048]/20 rounded-xl hover:bg-[#445048]/40 transition-colors">
//                 <div className="flex items-center space-x-4">
//                   <div className="bg-[#445048] p-3 rounded-lg text-2xl">🚗</div>
//                   <div>
//                     <p className="text-[#E9E6DD] font-semibold">Booking #{booking.booking_id}</p>
//                     {/* FIX 2: Switched to booking_date */}
//                     <p className="text-[#C4AD9D] text-xs">
//                       {getBookingDate(booking.booking_date)}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-[#E9E6DD] font-bold">${booking.total_amount}</p>
                  
//                   <span className={`text-xs px-2 py-0.5 rounded ${
//                     booking.status === 'Active' ? 'bg-[#027480]/20 text-[#027480]' :
//                     booking.status === 'Confirmed' ? 'bg-[#D6CC99]/20 text-[#D6CC99]' :
//                     'text-[#C4AD9D]'
//                   }`}>
//                     {booking.status}
//                   </span>
//                 </div>
//               </div>
//             ))}
//             {!bookings?.length && (
//               <div className="text-[#C4AD9D] text-center py-4">No recent history found.</div>
//             )}
//           </div>
//         </div>

//         {/* Right: Notifications */}
//         <div className="bg-[#001524] rounded-2xl p-6 shadow-lg border border-[#445048]/30">
//           <h3 className="text-xl font-bold text-[#E9E6DD] mb-6">Alerts</h3>
          
//           <div className="space-y-4">
//             <div className="flex items-start space-x-3 p-3 bg-[#D6CC99]/10 rounded-lg border border-[#D6CC99]/20">
//               <span className="text-[#D6CC99]">🔔</span>
//               <div>
//                 <p className="text-[#E9E6DD] text-sm font-semibold">Complete Profile</p>
//                 <p className="text-[#C4AD9D] text-xs mt-1">Add your driver's license to speed up checkout.</p>
//               </div>
//             </div>

//             <div className="flex items-start space-x-3 p-3 bg-[#027480]/10 rounded-lg border border-[#027480]/20">
//               <span className="text-[#027480]">🏷️</span>
//               <div>
//                 <p className="text-[#E9E6DD] text-sm font-semibold">New Promo Available</p>
//                 <p className="text-[#C4AD9D] text-xs mt-1">Get 10% off your next weekend rental.</p>
//               </div>
//             </div>

//              <Link to="/UserDashboard/emergency" className="flex items-center justify-center w-full mt-6 py-3 border border-[#F57251] text-[#F57251] rounded-xl hover:bg-[#F57251] hover:text-[#E9E6DD] transition-all font-semibold">
//                 Emergency Support
//              </Link>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default UserDashboardHome;