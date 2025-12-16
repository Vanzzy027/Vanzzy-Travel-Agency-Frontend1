import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useGetUserBookingsQuery, useCancelBookingMutation } from '../../features/api/BookingApi';
import PaymentModal from '../../Modals/PaymentsModal';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
const UserBookingsPage = () => {
    const { data: bookings, isLoading, error, refetch } = useGetUserBookingsQuery();
    const [cancelBooking, { isLoading: isCancelling }] = useCancelBookingMutation();
    const [selectedBookingForPayment, setSelectedBookingForPayment] = useState(null);
    // Debug
    useEffect(() => {
        if (bookings) {
            console.log('Bookings loaded:', bookings.length);
        }
    }, [bookings]);
    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm("Are you sure you want to cancel this booking?"))
            return;
        try {
            await cancelBooking(bookingId).unwrap();
            toast.success("Booking cancelled successfully.");
            refetch();
        }
        catch (err) {
            toast.error("Failed to cancel booking.");
        }
    };
    if (isLoading)
        return (_jsx("div", { className: "flex h-screen items-center justify-center bg-[#001524]", children: _jsxs("div", { className: "flex flex-col items-center gap-4", children: [_jsx("div", { className: "w-12 h-12 border-4 border-[#027480] border-t-transparent rounded-full animate-spin" }), _jsx("div", { className: "text-[#027480] text-xl font-bold animate-pulse", children: "Loading your journey..." })] }) }));
    if (error)
        return (_jsx("div", { className: "flex h-screen items-center justify-center bg-[#001524]", children: _jsxs("div", { className: "text-center text-[#F57251] p-8 border border-[#F57251] rounded-2xl bg-[#F57251]/10", children: [_jsx("h2", { className: "text-2xl font-bold mb-2", children: "Connection Error" }), _jsx("p", { children: "Could not load bookings. Please check your internet connection." })] }) }));
    const getVehicleImage = (booking) => {
        const images = booking.vehicle_images;
        if (!images)
            return 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=80';
        try {
            if (Array.isArray(images))
                return images[0];
            const parsed = JSON.parse(images);
            return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : parsed;
        }
        catch (e) {
            return images.startsWith('http') ? images : 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=80';
        }
    };
    const formatDate = (dateString) => {
        if (!dateString)
            return 'TBD';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
        });
    };
    const pendingBookings = bookings?.filter(b => b.status === 'Pending') || [];
    const activeBookings = bookings?.filter(b => b.status === 'Confirmed' || b.status === 'Active') || [];
    const historyBookings = bookings?.filter(b => b.status === 'Completed' || b.status === 'Cancelled') || [];
    const totalSpent = bookings?.reduce((acc, curr) => acc + Number(curr.total_amount), 0) || 0;
    return (_jsxs("div", { className: "min-h-screen bg-[#001524] p-6 md:p-10 text-[#E9E6DD] pb-20", children: [_jsxs("header", { className: "flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-[#E9E6DD]", children: "My Bookings" }), _jsx("p", { className: "text-[#C4AD9D] mt-1", children: "Manage your trips, payments, and history." })] }), _jsxs("div", { className: "flex gap-4", children: [_jsxs("div", { className: "bg-[#0f2434] px-6 py-3 rounded-xl border border-[#445048]", children: [_jsx("p", { className: "text-xs text-[#C4AD9D] uppercase", children: "Total Trips" }), _jsx("p", { className: "text-xl font-bold text-white", children: bookings?.length || 0 })] }), _jsxs("div", { className: "bg-[#0f2434] px-6 py-3 rounded-xl border border-[#445048]", children: [_jsx("p", { className: "text-xs text-[#C4AD9D] uppercase", children: "Total Spent" }), _jsxs("p", { className: "text-xl font-bold text-[#027480]", children: ["$", totalSpent.toLocaleString()] })] })] })] }), bookings && bookings.length === 0 && (_jsxs("div", { className: "text-center py-20 bg-[#0f2434]/50 rounded-3xl border border-[#445048] border-dashed", children: [_jsx("div", { className: "text-5xl mb-4", children: "\uD83D\uDE97" }), _jsx("h3", { className: "text-xl font-bold text-white mb-2", children: "No trips yet?" }), _jsx("p", { className: "text-[#C4AD9D] mb-6", children: "You haven't booked any vehicles yet." }), _jsx(Link, { to: "/vehicles", className: "bg-[#F57251] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#d65f41] transition-all", children: "Browse Vehicles" })] })), pendingBookings.length > 0 && (_jsxs("section", { className: "mb-12", children: [_jsxs("h2", { className: "text-xl font-bold mb-6 text-[#F57251] flex items-center gap-2 animate-pulse", children: [_jsx("span", { className: "bg-[#F57251]/20 p-1 rounded", children: "\u26A0\uFE0F" }), " Action Required: Payment Pending"] }), _jsx("div", { className: "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6", children: pendingBookings.map((booking) => (_jsxs("div", { className: "bg-[#0f2434] border-2 border-[#F57251] rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(245,114,81,0.15)] flex flex-col", children: [_jsxs("div", { className: "bg-[#F57251]/10 p-4 border-b border-[#F57251]/30 flex justify-between items-center", children: [_jsx("span", { className: "text-[#F57251] font-bold text-xs uppercase tracking-wider", children: "Awaiting Payment" }), _jsxs("span", { className: "text-2xl font-bold text-[#E9E6DD]", children: ["$", booking.total_amount] })] }), _jsxs("div", { className: "p-6 flex-grow flex flex-col", children: [_jsxs("div", { className: "flex gap-4 mb-6", children: [_jsx("img", { src: getVehicleImage(booking), alt: "Vehicle", className: "w-24 h-24 object-cover rounded-xl bg-gray-800" }), _jsxs("div", { children: [_jsxs("h3", { className: "font-bold text-lg text-white leading-tight mb-1", children: [booking.vehicle_manufacturer, " ", booking.vehicle_model] }), _jsx("p", { className: "text-xs text-[#027480] font-bold bg-[#027480]/10 px-2 py-1 rounded w-fit mb-2", children: booking.vehicle_year }), _jsxs("p", { className: "text-sm text-[#C4AD9D]", children: [formatDate(booking.booking_date), " \u2B07 ", formatDate(booking.return_date)] })] })] }), _jsxs("div", { className: "mt-auto flex gap-3", children: [_jsx("button", { onClick: () => handleCancelBooking(booking.booking_id), disabled: isCancelling, className: "flex-1 border border-red-500/50 text-red-400 py-3 rounded-xl font-bold hover:bg-red-500/10 transition-all text-sm", children: "Cancel" }), _jsxs("button", { onClick: () => setSelectedBookingForPayment(booking), className: "flex-[2] bg-[#F57251] hover:bg-[#d65f41] text-white py-3 rounded-xl font-bold transition-all transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2", children: [_jsx("span", { children: "Pay Now" }), _jsx("span", { children: "\u279C" })] })] })] })] }, booking.booking_id))) })] })), activeBookings.length > 0 && (_jsxs("section", { className: "mb-12", children: [_jsxs("h2", { className: "text-xl font-bold mb-6 text-[#027480] flex items-center gap-2", children: [_jsx("span", { className: "bg-[#027480]/20 p-1 rounded", children: "\uD83D\uDE97" }), " Active & Upcoming Trips"] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: activeBookings.map((booking) => (_jsxs("div", { className: "bg-[#001524] border border-[#027480] rounded-2xl p-6 relative group hover:bg-[#022a35] transition-colors", children: [_jsx("div", { className: "absolute top-4 right-4 bg-[#027480] text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg", children: booking.status }), _jsxs("h3", { className: "text-lg font-bold text-white mb-1", children: [booking.vehicle_manufacturer, " ", booking.vehicle_model] }), _jsxs("p", { className: "text-[#C4AD9D] text-xs uppercase tracking-wide mb-4", children: ["Ref: ", booking.booking_id] }), _jsxs("div", { className: "bg-[#000d16] p-4 rounded-xl border border-[#445048] space-y-3", children: [_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-[#445048]", children: "Pick-up" }), _jsx("span", { className: "text-[#E9E6DD] font-medium", children: formatDate(booking.booking_date) })] }), _jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-[#445048]", children: "Return" }), _jsx("span", { className: "text-[#E9E6DD] font-medium", children: formatDate(booking.return_date) })] }), _jsxs("div", { className: "border-t border-[#445048] pt-2 mt-2 flex justify-between items-center", children: [_jsx("span", { className: "text-[#C4AD9D] text-xs", children: "Total Paid" }), _jsxs("span", { className: "font-bold text-[#027480] text-lg", children: ["$", booking.total_amount] })] })] })] }, booking.booking_id))) })] })), historyBookings.length > 0 && (_jsxs("section", { children: [_jsxs("h2", { className: "text-xl font-bold mb-6 text-[#445048] flex items-center gap-2", children: [_jsx("span", { className: "bg-[#445048]/20 p-1 rounded", children: "\uD83D\uDCDC" }), " History"] }), _jsx("div", { className: "bg-[#0f2434] rounded-2xl border border-[#445048] overflow-hidden", children: _jsxs("table", { className: "w-full text-left border-collapse", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-[#001524] text-[#C4AD9D] text-xs uppercase tracking-wider border-b border-[#445048]", children: [_jsx("th", { className: "py-4 px-6", children: "Ref ID" }), _jsx("th", { className: "py-4 px-6", children: "Vehicle" }), _jsx("th", { className: "py-4 px-6", children: "Dates" }), _jsx("th", { className: "py-4 px-6", children: "Total" }), _jsx("th", { className: "py-4 px-6", children: "Status" })] }) }), _jsx("tbody", { className: "text-sm", children: historyBookings.map((booking) => (_jsxs("tr", { className: "border-b border-[#445048]/50 hover:bg-[#152e40] transition-colors last:border-0", children: [_jsxs("td", { className: "py-4 px-6 text-[#445048] font-mono", children: ["#", booking.booking_id] }), _jsxs("td", { className: "py-4 px-6 font-medium text-white", children: [booking.vehicle_manufacturer, " ", booking.vehicle_model] }), _jsxs("td", { className: "py-4 px-6 text-[#C4AD9D]", children: [formatDate(booking.booking_date), " - ", formatDate(booking.return_date)] }), _jsxs("td", { className: "py-4 px-6 font-bold text-[#E9E6DD]", children: ["$", booking.total_amount] }), _jsx("td", { className: "py-4 px-6", children: _jsx("span", { className: `px-2 py-1 rounded text-xs font-bold ${booking.status === 'Completed' ? 'bg-green-900/30 text-green-400 border border-green-900' : 'bg-red-900/30 text-red-400 border border-red-900'}`, children: booking.status }) })] }, booking.booking_id))) })] }) })] })), selectedBookingForPayment && (_jsx(PaymentModal, { isOpen: !!selectedBookingForPayment, onClose: () => setSelectedBookingForPayment(null), onSuccess: () => {
                    refetch();
                    toast.success("Booking status updated!");
                }, bookingData: {
                    booking_id: selectedBookingForPayment.booking_id,
                    total_amount: selectedBookingForPayment.total_amount,
                    vehicle_manufacturer: selectedBookingForPayment.vehicle_manufacturer,
                    vehicle_model: selectedBookingForPayment.vehicle_model,
                    vehicle_year: selectedBookingForPayment.vehicle_year
                }, userData: {
                    user_id: selectedBookingForPayment.user_id || '',
                    email: selectedBookingForPayment.user_email || '',
                    first_name: selectedBookingForPayment.user_first_name || '',
                    last_name: selectedBookingForPayment.user_last_name || '',
                    phone: selectedBookingForPayment.user_contact_phone || ''
                }, vehicleDetails: {
                    // FIXED: Only use available fields from BookingDetail, assume defaults for the rest
                    vehicle_id: selectedBookingForPayment.vehicle_id || 0,
                    vehicleSpec_id: 0, // Defaulting as this does not exist in BookingDetail
                    vin_number: '', // Defaulting
                    license_plate: '', // Defaulting
                    current_mileage: 0, // Defaulting
                    rental_rate: Number(selectedBookingForPayment.total_amount), // Fallback
                    status: 'Booked', // We know it's booked
                    manufacturer: selectedBookingForPayment.vehicle_manufacturer || '',
                    model: selectedBookingForPayment.vehicle_model || '',
                    year: selectedBookingForPayment.vehicle_year || 0,
                    fuel_type: '', // Defaulting
                    transmission: '', // Defaulting
                    seating_capacity: 4, // Defaulting
                    color: '', // Defaulting
                    features: '[]', // Defaulting
                    images: selectedBookingForPayment.vehicle_images || '[]',
                    on_promo: false // Defaulting
                } }))] }));
};
export default UserBookingsPage;
