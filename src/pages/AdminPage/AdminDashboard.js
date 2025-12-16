import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { useGetAllBookingsQuery } from '../../features/api/BookingApi';
import { useGetVehiclesQuery } from '../../features/api/VehicleAPI';
const AdminDashboardHome = () => {
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
        return (_jsx("div", { className: "space-y-6", children: _jsxs("div", { className: "animate-pulse", children: [_jsx("div", { className: "h-8 bg-[#445048] rounded w-1/4 mb-4" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8", children: [...Array(4)].map((_, i) => (_jsx("div", { className: "bg-[#001524] rounded-2xl p-6 h-32" }, i))) })] }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-[#001524] mb-2", children: "Admin Overview" }), _jsx("p", { className: "text-[#445048]", children: "Monitor business performance and fleet status." })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8", children: stats.map((stat, index) => (_jsx("div", { className: "bg-[#001524] rounded-2xl p-6 shadow-lg", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-[#C4AD9D] text-sm font-semibold mb-2", children: stat.title }), _jsx("div", { className: `text-2xl font-bold ${stat.color}`, children: stat.value })] }), _jsx("div", { className: "text-3xl", children: stat.icon })] }) }, index))) }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8", children: quickActions.map((action, index) => (_jsxs(Link, { to: action.path, className: `${action.color} text-[#E9E6DD] rounded-2xl p-6 shadow-lg hover:scale-105 transition-transform duration-300 group`, children: [_jsx("div", { className: "text-3xl mb-3 group-hover:scale-110 transition-transform duration-300", children: action.icon }), _jsx("h3", { className: "font-bold text-lg mb-2", children: action.label }), _jsx("p", { className: "text-sm opacity-90", children: action.description })] }, index))) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [_jsxs("div", { className: "bg-[#001524] rounded-2xl p-6 shadow-lg", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h2", { className: "text-xl font-bold text-[#E9E6DD]", children: "Recent Bookings" }), _jsx(Link, { to: "/admin/bookings", className: "text-[#027480] hover:text-[#F57251] transition-colors text-sm font-semibold", children: "View All" })] }), _jsxs("div", { className: "space-y-4", children: [bookings?.slice(0, 5).map((bookingItem) => {
                                        // FIX: Cast to 'any' to bypass strict Type checks for properties missing in the Interface
                                        // This fixes errors for 'user', 'start_date', and 'end_date'
                                        const booking = bookingItem;
                                        return (_jsxs("div", { className: "flex items-center justify-between p-4 bg-[#445048] rounded-lg", children: [_jsxs("div", { children: [_jsx("div", { className: "text-[#E9E6DD] font-semibold", children: booking.user
                                                                ? `${booking.user.first_name} ${booking.user.last_name}`
                                                                : `Booking #${booking.booking_id}` }), _jsxs("div", { className: "text-[#C4AD9D] text-sm", children: [booking.start_date
                                                                    ? new Date(booking.start_date).toLocaleDateString()
                                                                    : new Date(booking.booking_date).toLocaleDateString(), booking.end_date && ` - ${new Date(booking.end_date).toLocaleDateString()}`] }), _jsxs("div", { className: "text-[#C4AD9D] text-xs", children: ["$", booking.total_amount] })] }), _jsx("span", { className: `px-3 py-1 rounded-full text-xs font-semibold ${booking.status === 'Active' ? 'bg-[#027480] text-[#E9E6DD]' :
                                                        booking.status === 'Confirmed' ? 'bg-[#D6CC99] text-[#001524]' :
                                                            booking.status === 'Completed' ? 'bg-[#445048] text-[#C4AD9D]' :
                                                                'bg-[#F57251] text-[#E9E6DD]'}`, children: booking.status })] }, booking.booking_id));
                                    }), (!bookings || bookings.length === 0) && (_jsx("div", { className: "text-center py-8", children: _jsx("p", { className: "text-[#C4AD9D]", children: "No bookings found." }) }))] })] }), _jsxs("div", { className: "bg-[#001524] rounded-2xl p-6 shadow-lg", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h2", { className: "text-xl font-bold text-[#E9E6DD]", children: "Fleet Status" }), _jsx(Link, { to: "/admin/fleet", className: "text-[#027480] hover:text-[#F57251] transition-colors text-sm font-semibold", children: "Manage Fleet" })] }), _jsx("div", { className: "space-y-4", children: vehicles?.slice(0, 4).map((vehicle) => (_jsxs("div", { className: "flex items-center space-x-4 p-4 bg-[#445048] rounded-lg", children: [_jsx("img", { src: (() => {
                                                try {
                                                    return JSON.parse(vehicle.images)[0];
                                                }
                                                catch {
                                                    return 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=150&q=80';
                                                }
                                            })(), alt: `${vehicle.manufacturer} ${vehicle.model}`, className: "w-16 h-16 object-cover rounded-lg" }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "text-[#E9E6DD] font-semibold", children: [vehicle.manufacturer, " ", vehicle.model] }), _jsxs("div", { className: "text-[#C4AD9D] text-sm", children: ["$", vehicle.rental_rate, "/day"] }), _jsx("div", { className: `text-xs font-semibold ${vehicle.status === 'Available' ? 'text-[#027480]' : 'text-[#F57251]'}`, children: vehicle.status })] })] }, vehicle.vehicle_id))) })] })] })] }));
};
export default AdminDashboardHome;
