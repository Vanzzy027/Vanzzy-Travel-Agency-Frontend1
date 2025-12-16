import React, { useState, useEffect } from 'react';
import { useGetUserBookingsQuery, useCancelBookingMutation, type BookingDetail } from '../../features/api/BookingApi';
import PaymentModal from '../../Modals/PaymentsModal';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  Calendar, 
  DollarSign, 
  Car, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Loader2,
  ChevronRight
} from 'lucide-react';

const UserBookingsPage = () => {
  const { data: bookings, isLoading, error, refetch } = useGetUserBookingsQuery();
  const [cancelBooking, { isLoading: isCancelling }] = useCancelBookingMutation();
  const [selectedBookingForPayment, setSelectedBookingForPayment] = useState<BookingDetail | null>(null);
  
  // Debug
  useEffect(() => {
    if (bookings) {
      console.log('Bookings loaded:', bookings.length);
    }
  }, [bookings]);
  
  const handleCancelBooking = async (bookingId: number) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await cancelBooking(bookingId).unwrap();
      toast.success("Booking cancelled successfully.");
      refetch();
    } catch (err) {
      toast.error("Failed to cancel booking.");
    }
  };

  if (isLoading) return (
    <div className="min-h-[60vh] flex items-center justify-center bg-[#001524] p-4">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-10 h-10 md:w-12 md:h-12 animate-spin text-[#027480]" />
        <div className="text-[#027480] text-lg md:text-xl font-bold">Loading your journeys...</div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-[60vh] flex items-center justify-center bg-[#001524] p-4">
      <div className="text-center text-[#F57251] p-6 md:p-8 border border-[#F57251] rounded-xl md:rounded-2xl bg-[#F57251]/10 max-w-md w-full">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-[#F57251]" />
        <h2 className="text-xl md:text-2xl font-bold mb-2">Connection Error</h2>
        <p className="text-sm md:text-base text-[#C4AD9D]">Could not load bookings. Please check your connection.</p>
        <button 
          onClick={() => refetch()}
          className="mt-4 bg-[#F57251] text-white px-4 py-2 rounded-lg hover:bg-[#e56546] transition-colors text-sm md:text-base"
        >
          Retry
        </button>
      </div>
    </div>
  );

  const getVehicleImage = (booking: BookingDetail) => {
    const images = booking.vehicle_images;
    if (!images) return 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=80';
    try {
      if (Array.isArray(images)) return images[0];
      const parsed = JSON.parse(images);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : parsed;
    } catch (e) { 
      return images.startsWith('http') ? images : 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=80';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'TBD';
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', day: 'numeric', year: 'numeric' 
    });
  };

  const pendingBookings = bookings?.filter(b => b.status === 'Pending') || [];
  const activeBookings = bookings?.filter(b => b.status === 'Confirmed' || b.status === 'Active') || [];
  const historyBookings = bookings?.filter(b => b.status === 'Completed' || b.status === 'Cancelled') || [];
  const totalSpent = bookings?.reduce((acc, curr) => acc + Number(curr.total_amount), 0) || 0;

  return (
    <div className="min-h-screen bg-[#001524] p-4 md:p-6 lg:p-8 xl:p-10 text-[#E9E6DD] pb-16 md:pb-20">
      
      {/* HEADER */}
      <header className="mb-6 md:mb-8 lg:mb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#E9E6DD]">My Bookings</h1>
            <p className="text-[#C4AD9D] text-sm md:text-base mt-1">Manage your trips, payments, and history</p>
          </div>
          <div className="flex gap-3 md:gap-4 w-full md:w-auto">
            <div className="bg-[#0f2434] px-4 py-2 md:px-5 md:py-3 rounded-lg md:rounded-xl border border-[#445048] flex-1 md:flex-none">
              <p className="text-xs text-[#C4AD9D] uppercase">Total Trips</p>
              <p className="text-lg md:text-xl lg:text-2xl font-bold text-white">{bookings?.length || 0}</p>
            </div>
            <div className="bg-[#0f2434] px-4 py-2 md:px-5 md:py-3 rounded-lg md:rounded-xl border border-[#445048] flex-1 md:flex-none">
              <p className="text-xs text-[#C4AD9D] uppercase">Total Spent</p>
              <p className="text-lg md:text-xl lg:text-2xl font-bold text-[#027480]">${totalSpent.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </header>

      {/* EMPTY STATE */}
      {bookings && bookings.length === 0 && (
        <div className="text-center py-12 md:py-16 lg:py-20 bg-[#0f2434]/50 rounded-xl md:rounded-2xl lg:rounded-3xl border border-[#445048] border-dashed">
          <div className="text-4xl md:text-5xl lg:text-6xl mb-4">🚗</div>
          <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-2">No trips yet?</h3>
          <p className="text-[#C4AD9D] text-sm md:text-base mb-6">You haven't booked any vehicles yet.</p>
          <Link 
            to="/UserDashboard/vehicles" 
            className="bg-[#F57251] text-white px-6 py-3 md:px-8 md:py-3 rounded-lg md:rounded-xl font-bold hover:bg-[#d65f41] transition-all text-sm md:text-base inline-flex items-center gap-2"
          >
            Browse Vehicles
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* SECTION 1: PENDING PAYMENTS */}
      {pendingBookings.length > 0 && (
        <section className="mb-8 md:mb-10 lg:mb-12">
          <div className="flex items-center gap-2 mb-4 md:mb-6">
            <div className="bg-[#F57251]/20 p-1 md:p-1.5 rounded">
              <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-[#F57251]" />
            </div>
            <h2 className="text-lg md:text-xl font-bold text-[#F57251]">Action Required: Payment Pending</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {pendingBookings.map((booking) => (
              <div key={booking.booking_id} className="bg-[#0f2434] border border-[#F57251] rounded-xl md:rounded-2xl overflow-hidden shadow-[0_0_15px_rgba(245,114,81,0.15)] flex flex-col">
                <div className="bg-[#F57251]/10 p-3 md:p-4 border-b border-[#F57251]/30 flex justify-between items-center">
                  <span className="text-[#F57251] font-bold text-xs uppercase tracking-wider">Awaiting Payment</span>
                  <span className="text-xl md:text-2xl font-bold text-[#E9E6DD]">${booking.total_amount}</span>
                </div>
                <div className="p-4 md:p-5 lg:p-6 flex-grow flex flex-col">
                  <div className="flex gap-3 md:gap-4 mb-4 md:mb-6">
                    <img 
                      src={getVehicleImage(booking)} 
                      alt="Vehicle" 
                      className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg md:rounded-xl bg-gray-800 flex-shrink-0" 
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base md:text-lg text-white leading-tight mb-1 truncate">
                        {booking.vehicle_manufacturer} {booking.vehicle_model}
                      </h3>
                      <p className="text-xs text-[#027480] font-bold bg-[#027480]/10 px-2 py-1 rounded w-fit mb-2">
                        {booking.vehicle_year}
                      </p>
                      <div className="flex items-center text-xs md:text-sm text-[#C4AD9D] gap-1">
                        <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                        <span>{formatDate(booking.booking_date)} - {formatDate(booking.return_date)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-auto flex gap-2 md:gap-3 flex-col sm:flex-row">
                    <button 
                      onClick={() => handleCancelBooking(booking.booking_id)} 
                      disabled={isCancelling}
                      className="border border-red-500/50 text-red-400 py-2 md:py-3 rounded-lg md:rounded-xl font-bold hover:bg-red-500/10 transition-all text-xs md:text-sm flex-1 flex items-center justify-center gap-1"
                    >
                      {isCancelling ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3 md:w-4 md:h-4" />}
                      Cancel
                    </button>
                    
                    <button 
                      onClick={() => setSelectedBookingForPayment(booking)}
                      className="bg-[#F57251] hover:bg-[#d65f41] text-white py-2 md:py-3 rounded-lg md:rounded-xl font-bold transition-all shadow-lg flex-1 flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm"
                    >
                      <DollarSign className="w-3 h-3 md:w-4 md:h-4" />
                      Pay Now
                      <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 2: ACTIVE TRIPS */}
      {activeBookings.length > 0 && (
        <section className="mb-8 md:mb-10 lg:mb-12">
          <div className="flex items-center gap-2 mb-4 md:mb-6">
            <div className="bg-[#027480]/20 p-1 md:p-1.5 rounded">
              <Car className="w-4 h-4 md:w-5 md:h-5 text-[#027480]" />
            </div>
            <h2 className="text-lg md:text-xl font-bold text-[#027480]">Active & Upcoming Trips</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {activeBookings.map((booking) => (
              <div key={booking.booking_id} className="bg-[#001524] border border-[#445048] rounded-xl md:rounded-2xl p-4 md:p-5 lg:p-6 relative group hover:bg-[#022a35] transition-colors">
                <div className="absolute top-3 right-3 md:top-4 md:right-4 bg-[#027480] text-white px-2 py-1 md:px-3 md:py-1 rounded-full text-xs font-bold">
                  {booking.status}
                </div>
                <div className="mb-3 md:mb-4">
                  <h3 className="text-base md:text-lg font-bold text-white mb-1 truncate">
                    {booking.vehicle_manufacturer} {booking.vehicle_model}
                  </h3>
                  <p className="text-[#C4AD9D] text-xs uppercase tracking-wide">Ref: #{booking.booking_id}</p>
                </div>
                
                <div className="bg-[#000d16] p-3 md:p-4 rounded-lg md:rounded-xl border border-[#445048] space-y-2 md:space-y-3">
                  <div className="flex justify-between items-center text-xs md:text-sm">
                    <span className="text-[#445048] flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Pick-up
                    </span>
                    <span className="text-[#E9E6DD] font-medium">{formatDate(booking.booking_date)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs md:text-sm">
                    <span className="text-[#445048] flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Return
                    </span>
                    <span className="text-[#E9E6DD] font-medium">{formatDate(booking.return_date)}</span>
                  </div>
                  <div className="border-t border-[#445048] pt-2 mt-2 flex justify-between items-center">
                    <span className="text-[#C4AD9D] text-xs">Total Paid</span>
                    <span className="font-bold text-[#027480] text-base md:text-lg">${booking.total_amount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 3: HISTORY */}
      {historyBookings.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4 md:mb-6">
            <div className="bg-[#445048]/20 p-1 md:p-1.5 rounded">
              <Clock className="w-4 h-4 md:w-5 md:h-5 text-[#445048]" />
            </div>
            <h2 className="text-lg md:text-xl font-bold text-[#445048]">History</h2>
          </div>
          
          <div className="bg-[#0f2434] rounded-xl md:rounded-2xl border border-[#445048] overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden md:block">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#001524] text-[#C4AD9D] text-xs uppercase tracking-wider border-b border-[#445048]">
                    <th className="py-3 px-4 lg:px-6">Ref ID</th>
                    <th className="py-3 px-4 lg:px-6">Vehicle</th>
                    <th className="py-3 px-4 lg:px-6">Dates</th>
                    <th className="py-3 px-4 lg:px-6">Total</th>
                    <th className="py-3 px-4 lg:px-6">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {historyBookings.map((booking) => (
                    <tr key={booking.booking_id} className="border-b border-[#445048]/50 hover:bg-[#152e40] transition-colors last:border-0">
                      <td className="py-3 px-4 lg:px-6 text-[#445048] font-mono">#{booking.booking_id}</td>
                      <td className="py-3 px-4 lg:px-6 font-medium text-white truncate max-w-[200px]">
                        {booking.vehicle_manufacturer} {booking.vehicle_model}
                      </td>
                      <td className="py-3 px-4 lg:px-6 text-[#C4AD9D]">
                        {formatDate(booking.booking_date)} - {formatDate(booking.return_date)}
                      </td>
                      <td className="py-3 px-4 lg:px-6 font-bold text-[#E9E6DD]">${booking.total_amount}</td>
                      <td className="py-3 px-4 lg:px-6">
                        <span className={`px-2 py-1 rounded text-xs font-bold flex items-center justify-center gap-1 w-24 ${
                          booking.status === 'Completed' 
                            ? 'bg-green-900/30 text-green-400 border border-green-900' 
                            : 'bg-red-900/30 text-red-400 border border-red-900'
                        }`}>
                          {booking.status === 'Completed' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Mobile Cards */}
            <div className="md:hidden">
              <div className="divide-y divide-[#445048]/50">
                {historyBookings.map((booking) => (
                  <div key={booking.booking_id} className="p-4 hover:bg-[#152e40] transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-[#445048] font-mono text-xs">#{booking.booking_id}</p>
                        <p className="text-white font-medium text-sm">
                          {booking.vehicle_manufacturer} {booking.vehicle_model}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        booking.status === 'Completed' 
                          ? 'bg-green-900/30 text-green-400 border border-green-900' 
                          : 'bg-red-900/30 text-red-400 border border-red-900'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="text-sm text-[#C4AD9D] mb-2">
                      {formatDate(booking.booking_date)} - {formatDate(booking.return_date)}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-[#445048]">Amount Paid</div>
                      <div className="font-bold text-[#E9E6DD]">${booking.total_amount}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* PAYMENT MODAL */}
      {selectedBookingForPayment && (
        <PaymentModal 
          isOpen={!!selectedBookingForPayment}
          onClose={() => setSelectedBookingForPayment(null)}
          onSuccess={() => {
            refetch();
            toast.success("Booking status updated!");
          }}
          bookingData={{
            booking_id: selectedBookingForPayment.booking_id,
            total_amount: selectedBookingForPayment.total_amount,
            vehicle_manufacturer: selectedBookingForPayment.vehicle_manufacturer,
            vehicle_model: selectedBookingForPayment.vehicle_model,
            vehicle_year: selectedBookingForPayment.vehicle_year
          }}
          userData={{
            user_id: selectedBookingForPayment.user_id || '',
            email: selectedBookingForPayment.user_email || '',
            first_name: selectedBookingForPayment.user_first_name || '',
            last_name: selectedBookingForPayment.user_last_name || '',
            phone: selectedBookingForPayment.user_contact_phone || ''
          }}
          vehicleDetails={{
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
          }}
        />
      )}
    </div>
  );
};

export default UserBookingsPage;


// import React, { useState, useEffect } from 'react';
// import { useGetUserBookingsQuery, useCancelBookingMutation, type BookingDetail } from '../../features/api/BookingApi';
// import PaymentModal from '../../Modals/PaymentsModal';
// import { Link } from 'react-router-dom';
// import { toast } from 'sonner';

// const UserBookingsPage = () => {
//   const { data: bookings, isLoading, error, refetch } = useGetUserBookingsQuery();
//   const [cancelBooking, { isLoading: isCancelling }] = useCancelBookingMutation();
//   const [selectedBookingForPayment, setSelectedBookingForPayment] = useState<BookingDetail | null>(null);
  
//   // Debug
//   useEffect(() => {
//     if (bookings) {
//       console.log('Bookings loaded:', bookings.length);
//     }
//   }, [bookings]);
  
//   const handleCancelBooking = async (bookingId: number) => {
//     if (!window.confirm("Are you sure you want to cancel this booking?")) return;
//     try {
//       await cancelBooking(bookingId).unwrap();
//       toast.success("Booking cancelled successfully.");
//       refetch();
//     } catch (err) {
//       toast.error("Failed to cancel booking.");
//     }
//   };

//   if (isLoading) return (
//     <div className="flex h-screen items-center justify-center bg-[#001524]">
//       <div className="flex flex-col items-center gap-4">
//         <div className="w-12 h-12 border-4 border-[#027480] border-t-transparent rounded-full animate-spin"></div>
//         <div className="text-[#027480] text-xl font-bold animate-pulse">Loading your journey...</div>
//       </div>
//     </div>
//   );

//   if (error) return (
//     <div className="flex h-screen items-center justify-center bg-[#001524]">
//       <div className="text-center text-[#F57251] p-8 border border-[#F57251] rounded-2xl bg-[#F57251]/10">
//         <h2 className="text-2xl font-bold mb-2">Connection Error</h2>
//         <p>Could not load bookings. Please check your internet connection.</p>
//       </div>
//     </div>
//   );

//   const getVehicleImage = (booking: BookingDetail) => {
//     const images = booking.vehicle_images;
//     if (!images) return 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=80';
//     try {
//       if (Array.isArray(images)) return images[0];
//       const parsed = JSON.parse(images);
//       return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : parsed;
//     } catch (e) { 
//       return images.startsWith('http') ? images : 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=80';
//     }
//   };

//   const formatDate = (dateString: string) => {
//     if (!dateString) return 'TBD';
//     return new Date(dateString).toLocaleDateString('en-US', { 
//       month: 'short', day: 'numeric', year: 'numeric' 
//     });
//   };

//   const pendingBookings = bookings?.filter(b => b.status === 'Pending') || [];
//   const activeBookings = bookings?.filter(b => b.status === 'Confirmed' || b.status === 'Active') || [];
//   const historyBookings = bookings?.filter(b => b.status === 'Completed' || b.status === 'Cancelled') || [];
//   const totalSpent = bookings?.reduce((acc, curr) => acc + Number(curr.total_amount), 0) || 0;

//   return (
//     <div className="min-h-screen bg-[#001524] p-6 md:p-10 text-[#E9E6DD] pb-20">
      
//       {/* HEADER */}
//       <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
//         <div>
//           <h1 className="text-3xl font-bold text-[#E9E6DD]">My Bookings</h1>
//           <p className="text-[#C4AD9D] mt-1">Manage your trips, payments, and history.</p>
//         </div>
//         <div className="flex gap-4">
//           <div className="bg-[#0f2434] px-6 py-3 rounded-xl border border-[#445048]">
//             <p className="text-xs text-[#C4AD9D] uppercase">Total Trips</p>
//             <p className="text-xl font-bold text-white">{bookings?.length || 0}</p>
//           </div>
//           <div className="bg-[#0f2434] px-6 py-3 rounded-xl border border-[#445048]">
//             <p className="text-xs text-[#C4AD9D] uppercase">Total Spent</p>
//             <p className="text-xl font-bold text-[#027480]">${totalSpent.toLocaleString()}</p>
//           </div>
//         </div>
//       </header>

//       {/* EMPTY STATE */}
//       {bookings && bookings.length === 0 && (
//         <div className="text-center py-20 bg-[#0f2434]/50 rounded-3xl border border-[#445048] border-dashed">
//           <div className="text-5xl mb-4">🚗</div>
//           <h3 className="text-xl font-bold text-white mb-2">No trips yet?</h3>
//           <p className="text-[#C4AD9D] mb-6">You haven't booked any vehicles yet.</p>
//           <Link to="/vehicles" className="bg-[#F57251] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#d65f41] transition-all">
//             Browse Vehicles
//           </Link>
//         </div>
//       )}

//       {/* SECTION 1: PENDING PAYMENTS */}
//       {pendingBookings.length > 0 && (
//         <section className="mb-12">
//           <h2 className="text-xl font-bold mb-6 text-[#F57251] flex items-center gap-2 animate-pulse">
//             <span className="bg-[#F57251]/20 p-1 rounded">⚠️</span> Action Required: Payment Pending
//           </h2>

//           <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
//             {pendingBookings.map((booking) => (
//               <div key={booking.booking_id} className="bg-[#0f2434] border-2 border-[#F57251] rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(245,114,81,0.15)] flex flex-col">
//                 <div className="bg-[#F57251]/10 p-4 border-b border-[#F57251]/30 flex justify-between items-center">
//                   <span className="text-[#F57251] font-bold text-xs uppercase tracking-wider">Awaiting Payment</span>
//                   <span className="text-2xl font-bold text-[#E9E6DD]">${booking.total_amount}</span>
//                 </div>
//                 <div className="p-6 flex-grow flex flex-col">
//                   <div className="flex gap-4 mb-6">
//                     <img src={getVehicleImage(booking)} alt="Vehicle" className="w-24 h-24 object-cover rounded-xl bg-gray-800" />
//                     <div>
//                       <h3 className="font-bold text-lg text-white leading-tight mb-1">{booking.vehicle_manufacturer} {booking.vehicle_model}</h3>
//                       <p className="text-xs text-[#027480] font-bold bg-[#027480]/10 px-2 py-1 rounded w-fit mb-2">{booking.vehicle_year}</p>
//                       <p className="text-sm text-[#C4AD9D]">{formatDate(booking.booking_date)} ⬇ {formatDate(booking.return_date)}</p>
//                     </div>
//                   </div>
//                   <div className="mt-auto flex gap-3">
//                      <button onClick={() => handleCancelBooking(booking.booking_id)} disabled={isCancelling} className="flex-1 border border-red-500/50 text-red-400 py-3 rounded-xl font-bold hover:bg-red-500/10 transition-all text-sm">Cancel</button>
                     
//                      <button 
//                        onClick={() => setSelectedBookingForPayment(booking)}
//                        className="flex-[2] bg-[#F57251] hover:bg-[#d65f41] text-white py-3 rounded-xl font-bold transition-all transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2"
//                      >
//                        <span>Pay Now</span>
//                        <span>➜</span>
//                      </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>
//       )}

//       {/* SECTION 2: ACTIVE TRIPS */}
//       {activeBookings.length > 0 && (
//         <section className="mb-12">
//           <h2 className="text-xl font-bold mb-6 text-[#027480] flex items-center gap-2">
//             <span className="bg-[#027480]/20 p-1 rounded">🚗</span> Active & Upcoming Trips
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {activeBookings.map((booking) => (
//               <div key={booking.booking_id} className="bg-[#001524] border border-[#027480] rounded-2xl p-6 relative group hover:bg-[#022a35] transition-colors">
//                 <div className="absolute top-4 right-4 bg-[#027480] text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">{booking.status}</div>
//                 <h3 className="text-lg font-bold text-white mb-1">{booking.vehicle_manufacturer} {booking.vehicle_model}</h3>
//                 <p className="text-[#C4AD9D] text-xs uppercase tracking-wide mb-4">Ref: {booking.booking_id}</p>
//                 <div className="bg-[#000d16] p-4 rounded-xl border border-[#445048] space-y-3">
//                   <div className="flex justify-between text-sm"><span className="text-[#445048]">Pick-up</span><span className="text-[#E9E6DD] font-medium">{formatDate(booking.booking_date)}</span></div>
//                   <div className="flex justify-between text-sm"><span className="text-[#445048]">Return</span><span className="text-[#E9E6DD] font-medium">{formatDate(booking.return_date)}</span></div>
//                   <div className="border-t border-[#445048] pt-2 mt-2 flex justify-between items-center"><span className="text-[#C4AD9D] text-xs">Total Paid</span><span className="font-bold text-[#027480] text-lg">${booking.total_amount}</span></div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>
//       )}

//       {/* SECTION 3: HISTORY */}
//       {historyBookings.length > 0 && (
//         <section>
//           <h2 className="text-xl font-bold mb-6 text-[#445048] flex items-center gap-2"><span className="bg-[#445048]/20 p-1 rounded">📜</span> History</h2>
//           <div className="bg-[#0f2434] rounded-2xl border border-[#445048] overflow-hidden">
//             <table className="w-full text-left border-collapse">
//               <thead><tr className="bg-[#001524] text-[#C4AD9D] text-xs uppercase tracking-wider border-b border-[#445048]"><th className="py-4 px-6">Ref ID</th><th className="py-4 px-6">Vehicle</th><th className="py-4 px-6">Dates</th><th className="py-4 px-6">Total</th><th className="py-4 px-6">Status</th></tr></thead>
//               <tbody className="text-sm">
//                 {historyBookings.map((booking) => (
//                   <tr key={booking.booking_id} className="border-b border-[#445048]/50 hover:bg-[#152e40] transition-colors last:border-0">
//                     <td className="py-4 px-6 text-[#445048] font-mono">#{booking.booking_id}</td>
//                     <td className="py-4 px-6 font-medium text-white">{booking.vehicle_manufacturer} {booking.vehicle_model}</td>
//                     <td className="py-4 px-6 text-[#C4AD9D]">{formatDate(booking.booking_date)} - {formatDate(booking.return_date)}</td>
//                     <td className="py-4 px-6 font-bold text-[#E9E6DD]">${booking.total_amount}</td>
//                     <td className="py-4 px-6"><span className={`px-2 py-1 rounded text-xs font-bold ${booking.status === 'Completed' ? 'bg-green-900/30 text-green-400 border border-green-900' : 'bg-red-900/30 text-red-400 border border-red-900'}`}>{booking.status}</span></td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </section>
//       )}

//       {/* PAYMENT MODAL */}
//       {selectedBookingForPayment && (
//         <PaymentModal 
//           isOpen={!!selectedBookingForPayment}
//           onClose={() => setSelectedBookingForPayment(null)}
//           onSuccess={() => {
//             refetch();
//             toast.success("Booking status updated!");
//           }}
//           bookingData={{
//             booking_id: selectedBookingForPayment.booking_id,
//             total_amount: selectedBookingForPayment.total_amount,
//             vehicle_manufacturer: selectedBookingForPayment.vehicle_manufacturer,
//             vehicle_model: selectedBookingForPayment.vehicle_model,
//             vehicle_year: selectedBookingForPayment.vehicle_year
//           }}
//           userData={{
//             user_id: selectedBookingForPayment.user_id || '',
//             email: selectedBookingForPayment.user_email || '',
//             first_name: selectedBookingForPayment.user_first_name || '',
//             last_name: selectedBookingForPayment.user_last_name || '',
//             phone: selectedBookingForPayment.user_contact_phone || ''
//           }}
//           vehicleDetails={{
//             // FIXED: Only use available fields from BookingDetail, assume defaults for the rest
//             vehicle_id: selectedBookingForPayment.vehicle_id || 0,
//             vehicleSpec_id: 0, // Defaulting as this does not exist in BookingDetail
//             vin_number: '', // Defaulting
//             license_plate: '', // Defaulting
//             current_mileage: 0, // Defaulting
//             rental_rate: Number(selectedBookingForPayment.total_amount), // Fallback
//             status: 'Booked', // We know it's booked
//             manufacturer: selectedBookingForPayment.vehicle_manufacturer || '',
//             model: selectedBookingForPayment.vehicle_model || '',
//             year: selectedBookingForPayment.vehicle_year || 0,
//             fuel_type: '', // Defaulting
//             transmission: '', // Defaulting
//             seating_capacity: 4, // Defaulting
//             color: '', // Defaulting
//             features: '[]', // Defaulting
//             images: selectedBookingForPayment.vehicle_images || '[]',
//             on_promo: false // Defaulting
//           }}
//         />
//       )}
//     </div>
//   );
// };

// export default UserBookingsPage;


