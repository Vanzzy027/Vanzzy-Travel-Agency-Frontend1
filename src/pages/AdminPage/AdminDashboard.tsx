import React from 'react';
import { Link } from 'react-router-dom';
import { useGetAllBookingsQuery } from '../../features/api/BookingApi'; 
import { useGetVehiclesQuery } from '../../features/api/VehicleAPI'; 

const AdminDashboardHome: React.FC = () => {
  const { data: bookings, isLoading: bookingsLoading } = useGetAllBookingsQuery();
  const { data: vehicles, isLoading: vehiclesLoading } = useGetVehiclesQuery();

  const stats = [
    { 
      title: 'Active Rentals', 
      value: bookings?.filter(b => b.status === 'Active').length || 0, 
      color: 'text-[#027480]',
      icon: '🚗'
    },
    { 
      title: 'Upcoming Bookings', 
      value: bookings?.filter(b => b.status === 'Confirmed').length || 0, 
      color: 'text-[#F57251]',
      icon: '📅'
    },
    { 
      title: 'Total Revenue', 
      value: `$${bookings?.reduce((acc, curr) => acc + Number(curr.total_amount), 0).toLocaleString() || 0}`, 
      color: 'text-[#D6CC99]',
      icon: '💰'
    },
    { 
      title: 'Total Fleet', 
      value: vehicles?.length || 0, 
      color: 'text-[#445048]',
      icon: '🏎️'
    },
  ];

  const quickActions = [
    { icon: '🚗', label: 'Manage Fleet', description: 'Add or edit vehicles', path: '/admin/fleet', color: 'bg-[#027480]' },
    { icon: '👥', label: 'Customers', description: 'Verify users', path: '/admin/customers', color: 'bg-[#F57251]' },
    { icon: '📅', label: 'All Bookings', description: 'Manage reservations', path: '/admin/bookings', color: 'bg-[#445048]' },
    { icon: '📊', label: 'Analytics', description: 'Business reports', path: '/admin/analytics', color: 'bg-[#D6CC99] text-[#001524]' },
  ];

  if (bookingsLoading || vehiclesLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-[#445048] rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-[#001524] rounded-2xl p-6 h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#001524] mb-2">Admin Overview</h1>
        <p className="text-[#445048]">Monitor business performance and fleet status.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-[#001524] rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#C4AD9D] text-sm font-semibold mb-2">{stat.title}</p>
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              </div>
              <div className="text-3xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickActions.map((action, index) => (
          <Link
            key={index}
            to={action.path}
            className={`${action.color} text-[#E9E6DD] rounded-2xl p-6 shadow-lg hover:scale-105 transition-transform duration-300 group`}
          >
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
              {action.icon}
            </div>
            <h3 className="font-bold text-lg mb-2">{action.label}</h3>
            <p className="text-sm opacity-90">{action.description}</p>
          </Link>
        ))}
      </div>

      {/* Recent Activity & Available Vehicles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Bookings */}
        <div className="bg-[#001524] rounded-2xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-[#E9E6DD]">Recent Bookings</h2>
            <Link 
              to="/admin/bookings" 
              className="text-[#027480] hover:text-[#F57251] transition-colors text-sm font-semibold"
            >
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {bookings?.slice(0, 5).map((bookingItem) => {
              // FIX: Cast to 'any' to bypass strict Type checks for properties missing in the Interface
              // This fixes errors for 'user', 'start_date', and 'end_date'
              const booking = bookingItem as any; 
              
              return (
                <div key={booking.booking_id} className="flex items-center justify-between p-4 bg-[#445048] rounded-lg">
                  <div>
                    <div className="text-[#E9E6DD] font-semibold">
                      {booking.user 
                        ? `${booking.user.first_name} ${booking.user.last_name}` 
                        : `Booking #${booking.booking_id}`
                      }
                    </div>
                    <div className="text-[#C4AD9D] text-sm">
                      {/* Fallback to booking_date if start_date is missing in API response */}
                      {booking.start_date 
                        ? new Date(booking.start_date).toLocaleDateString() 
                        : new Date(booking.booking_date).toLocaleDateString()
                      }
                      {booking.end_date && ` - ${new Date(booking.end_date).toLocaleDateString()}`}
                    </div>
                    <div className="text-[#C4AD9D] text-xs">${booking.total_amount}</div>
                  </div>
                  
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    booking.status === 'Active' ? 'bg-[#027480] text-[#E9E6DD]' :
                    booking.status === 'Confirmed' ? 'bg-[#D6CC99] text-[#001524]' :
                    booking.status === 'Completed' ? 'bg-[#445048] text-[#C4AD9D]' :
                    'bg-[#F57251] text-[#E9E6DD]'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              );
            })}
            
            {(!bookings || bookings.length === 0) && (
              <div className="text-center py-8">
                <p className="text-[#C4AD9D]">No bookings found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Fleet Overview */}
        <div className="bg-[#001524] rounded-2xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-[#E9E6DD]">Fleet Status</h2>
            <Link 
              to="/admin/fleet" 
              className="text-[#027480] hover:text-[#F57251] transition-colors text-sm font-semibold"
            >
              Manage Fleet
            </Link>
          </div>
          <div className="space-y-4">
            {vehicles?.slice(0, 4).map((vehicle: any) => (
              <div key={vehicle.vehicle_id} className="flex items-center space-x-4 p-4 bg-[#445048] rounded-lg">
                <img 
                  src={(() => {
                    try { return JSON.parse(vehicle.images)[0]; } 
                    catch { return 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=150&q=80'; }
                  })()}
                  alt={`${vehicle.manufacturer} ${vehicle.model}`}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <div className="text-[#E9E6DD] font-semibold">
                    {vehicle.manufacturer} {vehicle.model}
                  </div>
                  <div className="text-[#C4AD9D] text-sm">${vehicle.rental_rate}/day</div>
                  <div className={`text-xs font-semibold ${
                    vehicle.status === 'Available' ? 'text-[#027480]' : 'text-[#F57251]'
                  }`}>
                    {vehicle.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardHome;