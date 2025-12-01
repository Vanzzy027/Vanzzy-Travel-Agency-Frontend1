import React from 'react';
import { Link } from 'react-router-dom';
import { useGetUserBookingsQuery } from '../../features/api/BookingApi';

const UserDashboardHome: React.FC = () => {
  const { data: bookings, isLoading } = useGetUserBookingsQuery();

  // 1. Status Logic
  const activeBooking = bookings?.find(b => b.status === 'Active');
  
  // Note: Depending on your API, this might need to sort by date to get the *nearest* upcoming booking
  const upcomingBooking = bookings?.find(b => b.status === 'Confirmed' || b.status === 'Pending');

  const totalSpent = bookings?.reduce((acc, curr) => acc + Number(curr.total_amount), 0) || 0;
  const totalTrips = bookings?.filter(b => b.status === 'Completed').length || 0;

  if (isLoading) {
    return <div className="text-[#E9E6DD] animate-pulse">Loading Dashboard...</div>;
  }

  // HELPER: function to safely get date to avoid TS errors if field names vary
  // If you update your Interface to include 'start_date', change 'booking_date' back to 'start_date' here.
  const getBookingDate = (dateString?: string) => {
    return dateString ? new Date(dateString).toLocaleDateString() : '—';
  };

  return (
    <div className="space-y-8">
      
      {/* HERO SECTION */}
      {activeBooking ? (
        <div className="bg-gradient-to-r from-[#001524] to-[#027480] rounded-3xl p-8 shadow-2xl border border-[#445048] relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <span className="bg-[#F57251] text-[#E9E6DD] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 inline-block">
                In Progress
              </span>
              <h1 className="text-3xl font-bold text-[#E9E6DD] mb-1">On the road?</h1>
              <p className="text-[#C4AD9D] mb-4">You are currently renting a vehicle.</p>
              
              <div className="flex space-x-4">
                <button className="bg-[#E9E6DD] text-[#001524] px-6 py-2 rounded-lg font-bold hover:bg-white transition-colors">
                  Report Issue
                </button>
                <button className="border border-[#E9E6DD] text-[#E9E6DD] px-6 py-2 rounded-lg font-bold hover:bg-[#E9E6DD]/10 transition-colors">
                  Extend Rental
                </button>
              </div>
            </div>
            
            <div className="w-full md:w-1/2 flex justify-center">
               <img 
                 src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=80" 
                 alt="Current Car" 
                 className="rounded-xl shadow-lg border-4 border-[#445048]/50" 
               />
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#445048] rounded-3xl p-8 shadow-xl text-center md:text-left relative overflow-hidden">
          <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl font-bold text-[#E9E6DD] mb-2">Ready for your next trip?</h1>
              <p className="text-[#C4AD9D] mb-6">Choose from our premium fleet of SUVs, Sedans, and Off-roaders.</p>
              <Link 
                to="/UserDashboard/vehicles" 
                className="bg-[#F57251] text-[#E9E6DD] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#e56546] transition-colors shadow-lg inline-block"
              >
                Find a Car ➜
              </Link>
            </div>
            <div className="hidden md:block opacity-50">
               <span className="text-9xl">🏎️</span>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: PERSONALIZED STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#001524] p-6 rounded-2xl border-l-4 border-[#027480] shadow-lg">
          <p className="text-[#C4AD9D] text-sm font-medium">Upcoming Trips</p>
          <p className="text-3xl font-bold text-[#E9E6DD]">{upcomingBooking ? '1' : '0'}</p>
          {/* FIX 1: Switched to booking_date. If your API has 'start_date', add it to your interface and switch back. */}
          {upcomingBooking && (
            <p className="text-xs text-[#027480] mt-1">
              Next: {getBookingDate(upcomingBooking.booking_date)}
            </p>
          )}
        </div>
        <div className="bg-[#001524] p-6 rounded-2xl border-l-4 border-[#F57251] shadow-lg">
          <p className="text-[#C4AD9D] text-sm font-medium">Total Trips Completed</p>
          <p className="text-3xl font-bold text-[#E9E6DD]">{totalTrips}</p>
        </div>
        <div className="bg-[#001524] p-6 rounded-2xl border-l-4 border-[#D6CC99] shadow-lg">
          <p className="text-[#C4AD9D] text-sm font-medium">Lifetime Spent</p>
          <p className="text-3xl font-bold text-[#E9E6DD]">${totalSpent.toLocaleString()}</p>
        </div>
      </div>

      {/* SECTION 3: SPLIT VIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Recent Bookings */}
        <div className="lg:col-span-2 bg-[#001524] rounded-2xl p-6 shadow-lg border border-[#445048]/30">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-[#E9E6DD]">Recent Activity</h3>
            <Link to="/UserDashboard/bookings" className="text-[#027480] text-sm hover:underline">View All</Link>
          </div>

          <div className="space-y-4">
            {bookings?.slice(0, 4).map((booking) => (
              <div key={booking.booking_id} className="flex items-center justify-between p-4 bg-[#445048]/20 rounded-xl hover:bg-[#445048]/40 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="bg-[#445048] p-3 rounded-lg text-2xl">🚗</div>
                  <div>
                    <p className="text-[#E9E6DD] font-semibold">Booking #{booking.booking_id}</p>
                    {/* FIX 2: Switched to booking_date */}
                    <p className="text-[#C4AD9D] text-xs">
                      {getBookingDate(booking.booking_date)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[#E9E6DD] font-bold">${booking.total_amount}</p>
                  
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    booking.status === 'Active' ? 'bg-[#027480]/20 text-[#027480]' :
                    booking.status === 'Confirmed' ? 'bg-[#D6CC99]/20 text-[#D6CC99]' :
                    'text-[#C4AD9D]'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
            {!bookings?.length && (
              <div className="text-[#C4AD9D] text-center py-4">No recent history found.</div>
            )}
          </div>
        </div>

        {/* Right: Notifications */}
        <div className="bg-[#001524] rounded-2xl p-6 shadow-lg border border-[#445048]/30">
          <h3 className="text-xl font-bold text-[#E9E6DD] mb-6">Alerts</h3>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-3 bg-[#D6CC99]/10 rounded-lg border border-[#D6CC99]/20">
              <span className="text-[#D6CC99]">🔔</span>
              <div>
                <p className="text-[#E9E6DD] text-sm font-semibold">Complete Profile</p>
                <p className="text-[#C4AD9D] text-xs mt-1">Add your driver's license to speed up checkout.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-[#027480]/10 rounded-lg border border-[#027480]/20">
              <span className="text-[#027480]">🏷️</span>
              <div>
                <p className="text-[#E9E6DD] text-sm font-semibold">New Promo Available</p>
                <p className="text-[#C4AD9D] text-xs mt-1">Get 10% off your next weekend rental.</p>
              </div>
            </div>

             <Link to="/UserDashboard/emergency" className="flex items-center justify-center w-full mt-6 py-3 border border-[#F57251] text-[#F57251] rounded-xl hover:bg-[#F57251] hover:text-[#E9E6DD] transition-all font-semibold">
                Emergency Support
             </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserDashboardHome;