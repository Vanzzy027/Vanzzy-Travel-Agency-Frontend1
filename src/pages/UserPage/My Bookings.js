import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useGetUserBookingsQuery, useCancelBookingMutation } from '../../features/api/BookingApi';
import PaymentModal from '../../Modals/PaymentsModal';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Calendar, DollarSign, Car, Clock, CheckCircle, XCircle, AlertCircle, Loader2, ChevronRight } from 'lucide-react';
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
        return (_jsx("div", { className: "min-h-[60vh] flex items-center justify-center bg-[#001524] p-4", children: _jsxs("div", { className: "flex flex-col items-center gap-4", children: [_jsx(Loader2, { className: "w-10 h-10 md:w-12 md:h-12 animate-spin text-[#027480]" }), _jsx("div", { className: "text-[#027480] text-lg md:text-xl font-bold", children: "Loading your journeys..." })] }) }));
    if (error)
        return (_jsx("div", { className: "min-h-[60vh] flex items-center justify-center bg-[#001524] p-4", children: _jsxs("div", { className: "text-center text-[#F57251] p-6 md:p-8 border border-[#F57251] rounded-xl md:rounded-2xl bg-[#F57251]/10 max-w-md w-full", children: [_jsx(AlertCircle, { className: "w-12 h-12 mx-auto mb-4 text-[#F57251]" }), _jsx("h2", { className: "text-xl md:text-2xl font-bold mb-2", children: "Connection Error" }), _jsx("p", { className: "text-sm md:text-base text-[#C4AD9D]", children: "Could not load bookings. Please check your connection." }), _jsx("button", { onClick: () => refetch(), className: "mt-4 bg-[#F57251] text-white px-4 py-2 rounded-lg hover:bg-[#e56546] transition-colors text-sm md:text-base", children: "Retry" })] }) }));
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
    return (_jsxs("div", { className: "min-h-screen bg-[#001524] p-4 md:p-6 lg:p-8 xl:p-10 text-[#E9E6DD] pb-16 md:pb-20", children: [_jsx("header", { className: "mb-6 md:mb-8 lg:mb-10", children: _jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl md:text-3xl lg:text-4xl font-bold text-[#E9E6DD]", children: "My Bookings" }), _jsx("p", { className: "text-[#C4AD9D] text-sm md:text-base mt-1", children: "Manage your trips, payments, and history" })] }), _jsxs("div", { className: "flex gap-3 md:gap-4 w-full md:w-auto", children: [_jsxs("div", { className: "bg-[#0f2434] px-4 py-2 md:px-5 md:py-3 rounded-lg md:rounded-xl border border-[#445048] flex-1 md:flex-none", children: [_jsx("p", { className: "text-xs text-[#C4AD9D] uppercase", children: "Total Trips" }), _jsx("p", { className: "text-lg md:text-xl lg:text-2xl font-bold text-white", children: bookings?.length || 0 })] }), _jsxs("div", { className: "bg-[#0f2434] px-4 py-2 md:px-5 md:py-3 rounded-lg md:rounded-xl border border-[#445048] flex-1 md:flex-none", children: [_jsx("p", { className: "text-xs text-[#C4AD9D] uppercase", children: "Total Spent" }), _jsxs("p", { className: "text-lg md:text-xl lg:text-2xl font-bold text-[#027480]", children: ["$", totalSpent.toLocaleString()] })] })] })] }) }), bookings && bookings.length === 0 && (_jsxs("div", { className: "text-center py-12 md:py-16 lg:py-20 bg-[#0f2434]/50 rounded-xl md:rounded-2xl lg:rounded-3xl border border-[#445048] border-dashed", children: [_jsx("div", { className: "text-4xl md:text-5xl lg:text-6xl mb-4", children: "\uD83D\uDE97" }), _jsx("h3", { className: "text-lg md:text-xl lg:text-2xl font-bold text-white mb-2", children: "No trips yet?" }), _jsx("p", { className: "text-[#C4AD9D] text-sm md:text-base mb-6", children: "You haven't booked any vehicles yet." }), _jsxs(Link, { to: "/UserDashboard/vehicles", className: "bg-[#F57251] text-white px-6 py-3 md:px-8 md:py-3 rounded-lg md:rounded-xl font-bold hover:bg-[#d65f41] transition-all text-sm md:text-base inline-flex items-center gap-2", children: ["Browse Vehicles", _jsx(ChevronRight, { className: "w-4 h-4" })] })] })), pendingBookings.length > 0 && (_jsxs("section", { className: "mb-8 md:mb-10 lg:mb-12", children: [_jsxs("div", { className: "flex items-center gap-2 mb-4 md:mb-6", children: [_jsx("div", { className: "bg-[#F57251]/20 p-1 md:p-1.5 rounded", children: _jsx(AlertCircle, { className: "w-4 h-4 md:w-5 md:h-5 text-[#F57251]" }) }), _jsx("h2", { className: "text-lg md:text-xl font-bold text-[#F57251]", children: "Action Required: Payment Pending" })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6", children: pendingBookings.map((booking) => (_jsxs("div", { className: "bg-[#0f2434] border border-[#F57251] rounded-xl md:rounded-2xl overflow-hidden shadow-[0_0_15px_rgba(245,114,81,0.15)] flex flex-col", children: [_jsxs("div", { className: "bg-[#F57251]/10 p-3 md:p-4 border-b border-[#F57251]/30 flex justify-between items-center", children: [_jsx("span", { className: "text-[#F57251] font-bold text-xs uppercase tracking-wider", children: "Awaiting Payment" }), _jsxs("span", { className: "text-xl md:text-2xl font-bold text-[#E9E6DD]", children: ["$", booking.total_amount] })] }), _jsxs("div", { className: "p-4 md:p-5 lg:p-6 flex-grow flex flex-col", children: [_jsxs("div", { className: "flex gap-3 md:gap-4 mb-4 md:mb-6", children: [_jsx("img", { src: getVehicleImage(booking), alt: "Vehicle", className: "w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg md:rounded-xl bg-gray-800 flex-shrink-0" }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("h3", { className: "font-bold text-base md:text-lg text-white leading-tight mb-1 truncate", children: [booking.vehicle_manufacturer, " ", booking.vehicle_model] }), _jsx("p", { className: "text-xs text-[#027480] font-bold bg-[#027480]/10 px-2 py-1 rounded w-fit mb-2", children: booking.vehicle_year }), _jsxs("div", { className: "flex items-center text-xs md:text-sm text-[#C4AD9D] gap-1", children: [_jsx(Calendar, { className: "w-3 h-3 md:w-4 md:h-4" }), _jsxs("span", { children: [formatDate(booking.booking_date), " - ", formatDate(booking.return_date)] })] })] })] }), _jsxs("div", { className: "mt-auto flex gap-2 md:gap-3 flex-col sm:flex-row", children: [_jsxs("button", { onClick: () => handleCancelBooking(booking.booking_id), disabled: isCancelling, className: "border border-red-500/50 text-red-400 py-2 md:py-3 rounded-lg md:rounded-xl font-bold hover:bg-red-500/10 transition-all text-xs md:text-sm flex-1 flex items-center justify-center gap-1", children: [isCancelling ? _jsx(Loader2, { className: "w-3 h-3 animate-spin" }) : _jsx(XCircle, { className: "w-3 h-3 md:w-4 md:h-4" }), "Cancel"] }), _jsxs("button", { onClick: () => setSelectedBookingForPayment(booking), className: "bg-[#F57251] hover:bg-[#d65f41] text-white py-2 md:py-3 rounded-lg md:rounded-xl font-bold transition-all shadow-lg flex-1 flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm", children: [_jsx(DollarSign, { className: "w-3 h-3 md:w-4 md:h-4" }), "Pay Now", _jsx(ChevronRight, { className: "w-3 h-3 md:w-4 md:h-4" })] })] })] })] }, booking.booking_id))) })] })), activeBookings.length > 0 && (_jsxs("section", { className: "mb-8 md:mb-10 lg:mb-12", children: [_jsxs("div", { className: "flex items-center gap-2 mb-4 md:mb-6", children: [_jsx("div", { className: "bg-[#027480]/20 p-1 md:p-1.5 rounded", children: _jsx(Car, { className: "w-4 h-4 md:w-5 md:h-5 text-[#027480]" }) }), _jsx("h2", { className: "text-lg md:text-xl font-bold text-[#027480]", children: "Active & Upcoming Trips" })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6", children: activeBookings.map((booking) => (_jsxs("div", { className: "bg-[#001524] border border-[#445048] rounded-xl md:rounded-2xl p-4 md:p-5 lg:p-6 relative group hover:bg-[#022a35] transition-colors", children: [_jsx("div", { className: "absolute top-3 right-3 md:top-4 md:right-4 bg-[#027480] text-white px-2 py-1 md:px-3 md:py-1 rounded-full text-xs font-bold", children: booking.status }), _jsxs("div", { className: "mb-3 md:mb-4", children: [_jsxs("h3", { className: "text-base md:text-lg font-bold text-white mb-1 truncate", children: [booking.vehicle_manufacturer, " ", booking.vehicle_model] }), _jsxs("p", { className: "text-[#C4AD9D] text-xs uppercase tracking-wide", children: ["Ref: #", booking.booking_id] })] }), _jsxs("div", { className: "bg-[#000d16] p-3 md:p-4 rounded-lg md:rounded-xl border border-[#445048] space-y-2 md:space-y-3", children: [_jsxs("div", { className: "flex justify-between items-center text-xs md:text-sm", children: [_jsxs("span", { className: "text-[#445048] flex items-center gap-1", children: [_jsx(Calendar, { className: "w-3 h-3" }), "Pick-up"] }), _jsx("span", { className: "text-[#E9E6DD] font-medium", children: formatDate(booking.booking_date) })] }), _jsxs("div", { className: "flex justify-between items-center text-xs md:text-sm", children: [_jsxs("span", { className: "text-[#445048] flex items-center gap-1", children: [_jsx(Calendar, { className: "w-3 h-3" }), "Return"] }), _jsx("span", { className: "text-[#E9E6DD] font-medium", children: formatDate(booking.return_date) })] }), _jsxs("div", { className: "border-t border-[#445048] pt-2 mt-2 flex justify-between items-center", children: [_jsx("span", { className: "text-[#C4AD9D] text-xs", children: "Total Paid" }), _jsxs("span", { className: "font-bold text-[#027480] text-base md:text-lg", children: ["$", booking.total_amount] })] })] })] }, booking.booking_id))) })] })), historyBookings.length > 0 && (_jsxs("section", { children: [_jsxs("div", { className: "flex items-center gap-2 mb-4 md:mb-6", children: [_jsx("div", { className: "bg-[#445048]/20 p-1 md:p-1.5 rounded", children: _jsx(Clock, { className: "w-4 h-4 md:w-5 md:h-5 text-[#445048]" }) }), _jsx("h2", { className: "text-lg md:text-xl font-bold text-[#445048]", children: "History" })] }), _jsxs("div", { className: "bg-[#0f2434] rounded-xl md:rounded-2xl border border-[#445048] overflow-hidden", children: [_jsx("div", { className: "hidden md:block", children: _jsxs("table", { className: "w-full text-left border-collapse", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-[#001524] text-[#C4AD9D] text-xs uppercase tracking-wider border-b border-[#445048]", children: [_jsx("th", { className: "py-3 px-4 lg:px-6", children: "Ref ID" }), _jsx("th", { className: "py-3 px-4 lg:px-6", children: "Vehicle" }), _jsx("th", { className: "py-3 px-4 lg:px-6", children: "Dates" }), _jsx("th", { className: "py-3 px-4 lg:px-6", children: "Total" }), _jsx("th", { className: "py-3 px-4 lg:px-6", children: "Status" })] }) }), _jsx("tbody", { className: "text-sm", children: historyBookings.map((booking) => (_jsxs("tr", { className: "border-b border-[#445048]/50 hover:bg-[#152e40] transition-colors last:border-0", children: [_jsxs("td", { className: "py-3 px-4 lg:px-6 text-[#445048] font-mono", children: ["#", booking.booking_id] }), _jsxs("td", { className: "py-3 px-4 lg:px-6 font-medium text-white truncate max-w-[200px]", children: [booking.vehicle_manufacturer, " ", booking.vehicle_model] }), _jsxs("td", { className: "py-3 px-4 lg:px-6 text-[#C4AD9D]", children: [formatDate(booking.booking_date), " - ", formatDate(booking.return_date)] }), _jsxs("td", { className: "py-3 px-4 lg:px-6 font-bold text-[#E9E6DD]", children: ["$", booking.total_amount] }), _jsx("td", { className: "py-3 px-4 lg:px-6", children: _jsxs("span", { className: `px-2 py-1 rounded text-xs font-bold flex items-center justify-center gap-1 w-24 ${booking.status === 'Completed'
                                                                ? 'bg-green-900/30 text-green-400 border border-green-900'
                                                                : 'bg-red-900/30 text-red-400 border border-red-900'}`, children: [booking.status === 'Completed' ? _jsx(CheckCircle, { className: "w-3 h-3" }) : _jsx(XCircle, { className: "w-3 h-3" }), booking.status] }) })] }, booking.booking_id))) })] }) }), _jsx("div", { className: "md:hidden", children: _jsx("div", { className: "divide-y divide-[#445048]/50", children: historyBookings.map((booking) => (_jsxs("div", { className: "p-4 hover:bg-[#152e40] transition-colors", children: [_jsxs("div", { className: "flex justify-between items-start mb-2", children: [_jsxs("div", { children: [_jsxs("p", { className: "text-[#445048] font-mono text-xs", children: ["#", booking.booking_id] }), _jsxs("p", { className: "text-white font-medium text-sm", children: [booking.vehicle_manufacturer, " ", booking.vehicle_model] })] }), _jsx("span", { className: `px-2 py-1 rounded text-xs font-bold ${booking.status === 'Completed'
                                                            ? 'bg-green-900/30 text-green-400 border border-green-900'
                                                            : 'bg-red-900/30 text-red-400 border border-red-900'}`, children: booking.status })] }), _jsxs("div", { className: "text-sm text-[#C4AD9D] mb-2", children: [formatDate(booking.booking_date), " - ", formatDate(booking.return_date)] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("div", { className: "text-xs text-[#445048]", children: "Amount Paid" }), _jsxs("div", { className: "font-bold text-[#E9E6DD]", children: ["$", booking.total_amount] })] })] }, booking.booking_id))) }) })] })] })), selectedBookingForPayment && (_jsx(PaymentModal, { isOpen: !!selectedBookingForPayment, onClose: () => setSelectedBookingForPayment(null), onSuccess: () => {
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
                    vehicle_id: selectedBookingForPayment.vehicle_id || 0,
                    vehicleSpec_id: 0,
                    vin_number: '',
                    license_plate: '',
                    current_mileage: 0,
                    rental_rate: Number(selectedBookingForPayment.total_amount),
                    status: 'Booked',
                    manufacturer: selectedBookingForPayment.vehicle_manufacturer || '',
                    model: selectedBookingForPayment.vehicle_model || '',
                    year: selectedBookingForPayment.vehicle_year || 0,
                    fuel_type: '',
                    transmission: '',
                    seating_capacity: 4,
                    color: '',
                    features: '[]',
                    images: selectedBookingForPayment.vehicle_images || '[]',
                    on_promo: false
                } }))] }));
};
export default UserBookingsPage;
