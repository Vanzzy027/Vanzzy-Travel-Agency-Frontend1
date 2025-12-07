import React, { useState, useEffect } from 'react';
import { useGetUserBookingsQuery, useCancelBookingMutation, type BookingDetail } from '../../features/api/BookingApi'; // Ensure correct casing for bookingApi
import PaymentModal from '../../Modals/PaymentsModal';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const UserBookingsPage = () => {
  // 1. API Hooks
  //const { data: bookings, isLoading, error } = useGetUserBookingsQuery();
  
  const { data: bookings, isLoading, error, refetch } = useGetUserBookingsQuery();

  const [cancelBooking, { isLoading: isCancelling }] = useCancelBookingMutation();
  
  // 🔴 CHANGE 1: Store the full booking object, not just ID
  const [selectedBookingForPayment, setSelectedBookingForPayment] = useState<BookingDetail | null>(null);
  
  // Debug
  useEffect(() => {
    if (bookings) {
      console.log('Bookings loaded:', bookings.length);
    }
  }, [bookings]);
  
  // --- ACTIONS ---
  const handleCancelBooking = async (bookingId: number) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await cancelBooking(bookingId).unwrap();
      toast.success("Booking cancelled successfully.");
    } catch (err) {
      toast.error("Failed to cancel booking.");
    }
  };

  // --- LOADING & ERROR STATES ---
  if (isLoading) return (
    <div className="flex h-screen items-center justify-center bg-[#001524]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#027480] border-t-transparent rounded-full animate-spin"></div>
        <div className="text-[#027480] text-xl font-bold animate-pulse">Loading your journey...</div>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex h-screen items-center justify-center bg-[#001524]">
      <div className="text-center text-[#F57251] p-8 border border-[#F57251] rounded-2xl bg-[#F57251]/10">
        <h2 className="text-2xl font-bold mb-2">Connection Error</h2>
        <p>Could not load bookings. Please check your internet connection.</p>
      </div>
    </div>
  );

  // --- HELPERS ---
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

  // --- FILTERING ---
  const pendingBookings = bookings?.filter(b => b.status === 'Pending') || [];
  const activeBookings = bookings?.filter(b => b.status === 'Confirmed' || b.status === 'Active') || [];
  const historyBookings = bookings?.filter(b => b.status === 'Completed' || b.status === 'Cancelled') || [];
  const totalSpent = bookings?.reduce((acc, curr) => acc + Number(curr.total_amount), 0) || 0;

  return (
    <div className="min-h-screen bg-[#001524] p-6 md:p-10 text-[#E9E6DD] pb-20">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-bold text-[#E9E6DD]">My Bookings</h1>
          <p className="text-[#C4AD9D] mt-1">Manage your trips, payments, and history.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-[#0f2434] px-6 py-3 rounded-xl border border-[#445048]">
            <p className="text-xs text-[#C4AD9D] uppercase">Total Trips</p>
            <p className="text-xl font-bold text-white">{bookings?.length || 0}</p>
          </div>
          <div className="bg-[#0f2434] px-6 py-3 rounded-xl border border-[#445048]">
            <p className="text-xs text-[#C4AD9D] uppercase">Total Spent</p>
            <p className="text-xl font-bold text-[#027480]">${totalSpent.toLocaleString()}</p>
          </div>
        </div>
      </header>

      {/* EMPTY STATE */}
      {bookings && bookings.length === 0 && (
        <div className="text-center py-20 bg-[#0f2434]/50 rounded-3xl border border-[#445048] border-dashed">
          <div className="text-5xl mb-4">🚗</div>
          <h3 className="text-xl font-bold text-white mb-2">No trips yet?</h3>
          <p className="text-[#C4AD9D] mb-6">You haven't booked any vehicles yet.</p>
          <Link to="/vehicles" className="bg-[#F57251] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#d65f41] transition-all">
            Browse Vehicles
          </Link>
        </div>
      )}

      {/* SECTION 1: PENDING PAYMENTS */}
      {pendingBookings.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-6 text-[#F57251] flex items-center gap-2 animate-pulse">
            <span className="bg-[#F57251]/20 p-1 rounded">⚠️</span> Action Required: Payment Pending
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {pendingBookings.map((booking) => (
              <div key={booking.booking_id} className="bg-[#0f2434] border-2 border-[#F57251] rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(245,114,81,0.15)] flex flex-col">
                <div className="bg-[#F57251]/10 p-4 border-b border-[#F57251]/30 flex justify-between items-center">
                  <span className="text-[#F57251] font-bold text-xs uppercase tracking-wider">Awaiting Payment</span>
                  <span className="text-2xl font-bold text-[#E9E6DD]">${booking.total_amount}</span>
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex gap-4 mb-6">
                    <img src={getVehicleImage(booking)} alt="Vehicle" className="w-24 h-24 object-cover rounded-xl bg-gray-800" />
                    <div>
                      <h3 className="font-bold text-lg text-white leading-tight mb-1">{booking.vehicle_manufacturer} {booking.vehicle_model}</h3>
                      <p className="text-xs text-[#027480] font-bold bg-[#027480]/10 px-2 py-1 rounded w-fit mb-2">{booking.vehicle_year}</p>
                      <p className="text-sm text-[#C4AD9D]">{formatDate(booking.booking_date)} ⬇ {formatDate(booking.return_date)}</p>
                    </div>
                  </div>
                  <div className="mt-auto flex gap-3">
                     <button onClick={() => handleCancelBooking(booking.booking_id)} disabled={isCancelling} className="flex-1 border border-red-500/50 text-red-400 py-3 rounded-xl font-bold hover:bg-red-500/10 transition-all text-sm">Cancel</button>
                     
                     {/* 🔴 CHANGE 2: Set the FULL object on click */}
                     <button 
                       onClick={() => setSelectedBookingForPayment(booking)}
                       className="flex-[2] bg-[#F57251] hover:bg-[#d65f41] text-white py-3 rounded-xl font-bold transition-all transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2"
                     >
                       <span>Pay Now</span>
                       <span>➜</span>
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
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-6 text-[#027480] flex items-center gap-2">
            <span className="bg-[#027480]/20 p-1 rounded">🚗</span> Active & Upcoming Trips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeBookings.map((booking) => (
              <div key={booking.booking_id} className="bg-[#001524] border border-[#027480] rounded-2xl p-6 relative group hover:bg-[#022a35] transition-colors">
                <div className="absolute top-4 right-4 bg-[#027480] text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">{booking.status}</div>
                <h3 className="text-lg font-bold text-white mb-1">{booking.vehicle_manufacturer} {booking.vehicle_model}</h3>
                <p className="text-[#C4AD9D] text-xs uppercase tracking-wide mb-4">Ref: {booking.booking_id}</p>
                <div className="bg-[#000d16] p-4 rounded-xl border border-[#445048] space-y-3">
                  <div className="flex justify-between text-sm"><span className="text-[#445048]">Pick-up</span><span className="text-[#E9E6DD] font-medium">{formatDate(booking.booking_date)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-[#445048]">Return</span><span className="text-[#E9E6DD] font-medium">{formatDate(booking.return_date)}</span></div>
                  <div className="border-t border-[#445048] pt-2 mt-2 flex justify-between items-center"><span className="text-[#C4AD9D] text-xs">Total Paid</span><span className="font-bold text-[#027480] text-lg">${booking.total_amount}</span></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 3: HISTORY */}
      {historyBookings.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-6 text-[#445048] flex items-center gap-2"><span className="bg-[#445048]/20 p-1 rounded">📜</span> History</h2>
          <div className="bg-[#0f2434] rounded-2xl border border-[#445048] overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead><tr className="bg-[#001524] text-[#C4AD9D] text-xs uppercase tracking-wider border-b border-[#445048]"><th className="py-4 px-6">Ref ID</th><th className="py-4 px-6">Vehicle</th><th className="py-4 px-6">Dates</th><th className="py-4 px-6">Total</th><th className="py-4 px-6">Status</th></tr></thead>
              <tbody className="text-sm">
                {historyBookings.map((booking) => (
                  <tr key={booking.booking_id} className="border-b border-[#445048]/50 hover:bg-[#152e40] transition-colors last:border-0">
                    <td className="py-4 px-6 text-[#445048] font-mono">#{booking.booking_id}</td>
                    <td className="py-4 px-6 font-medium text-white">{booking.vehicle_manufacturer} {booking.vehicle_model}</td>
                    <td className="py-4 px-6 text-[#C4AD9D]">{formatDate(booking.booking_date)} - {formatDate(booking.return_date)}</td>
                    <td className="py-4 px-6 font-bold text-[#E9E6DD]">${booking.total_amount}</td>
                    <td className="py-4 px-6"><span className={`px-2 py-1 rounded text-xs font-bold ${booking.status === 'Completed' ? 'bg-green-900/30 text-green-400 border border-green-900' : 'bg-red-900/30 text-red-400 border border-red-900'}`}>{booking.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 🔴 CHANGE 3: Update Modal Props to match the new definition */}
      {/* {selectedBookingForPayment && (
        <PaymentModal 
          isOpen={!!selectedBookingForPayment}
          onClose={() => setSelectedBookingForPayment(null)}
          bookingData={{
            booking_id: selectedBookingForPayment.booking_id,
            total_amount: selectedBookingForPayment.total_amount
          }}
          userData={{
            // These fields exist because of the JOIN in your API response
            user_id: selectedBookingForPayment.user_id,
            email: selectedBookingForPayment.user_email,
            first_name: selectedBookingForPayment.user_first_name,
            last_name: selectedBookingForPayment.user_last_name,
            phone: selectedBookingForPayment.user_contact_phone
          }}
          vehicleDetails={{
            // These fields exist because of the JOIN in your API response
            make: selectedBookingForPayment.vehicle_manufacturer,
            model: selectedBookingForPayment.vehicle_model,
            year: selectedBookingForPayment.vehicle_year
          }}
        />
      )} */}
{selectedBookingForPayment && (
  <PaymentModal 
    isOpen={!!selectedBookingForPayment}
    onClose={() => setSelectedBookingForPayment(null)}
    onSuccess={() => {
      // 🔴 This triggers a refetch of bookings data
      refetch();
      toast.success("Booking status updated!");
    }}
    bookingData={{
      booking_id: selectedBookingForPayment.booking_id,
      total_amount: selectedBookingForPayment.total_amount
    }}
    userData={{
      user_id: selectedBookingForPayment.user_id,
      email: selectedBookingForPayment.user_email,
      first_name: selectedBookingForPayment.user_first_name,
      last_name: selectedBookingForPayment.user_last_name,
      phone: selectedBookingForPayment.user_contact_phone
    }}
    vehicleDetails={{
      make: selectedBookingForPayment.vehicle_manufacturer,
      model: selectedBookingForPayment.vehicle_model,
      year: selectedBookingForPayment.vehicle_year
    }}
  />
)}



    </div>
  );
};

export default UserBookingsPage;






// import React, { useState, useEffect } from 'react';
// import { useGetUserBookingsQuery, useCancelBookingMutation, type BookingDetail } from '../../features/api/BookingApi'; // Ensure correct casing for bookingApi
// import PaymentModal from '../../Modals/PaymentsModal';
// import { Link } from 'react-router-dom';
// import { toast } from 'sonner';

// const UserBookingsPage = () => {
//   // 1. API Hooks
//   const { data: bookings, isLoading, error } = useGetUserBookingsQuery();
//   const [cancelBooking, { isLoading: isCancelling }] = useCancelBookingMutation();
  
//   // 🔴 CHANGE 1: Store the full booking object, not just ID
//   const [selectedBookingForPayment, setSelectedBookingForPayment] = useState<BookingDetail | null>(null);

//   // Debug
//   useEffect(() => {
//     if (bookings) {
//       console.log('Bookings loaded:', bookings.length);
//     }
//   }, [bookings]);
  
//   // --- ACTIONS ---
//   const handleCancelBooking = async (bookingId: number) => {
//     if (!window.confirm("Are you sure you want to cancel this booking?")) return;
//     try {
//       await cancelBooking(bookingId).unwrap();
//       toast.success("Booking cancelled successfully.");
//     } catch (err) {
//       toast.error("Failed to cancel booking.");
//     }
//   };

//   // --- LOADING & ERROR STATES ---
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

//   // --- HELPERS ---
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

//   // --- FILTERING ---
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
                     
//                      {/* 🔴 CHANGE 2: Set the FULL object on click */}
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

//       {/* 🔴 CHANGE 3: Update Modal Props to match the new definition */}
//       {selectedBookingForPayment && (
//         <PaymentModal 
//           isOpen={!!selectedBookingForPayment}
//           onClose={() => setSelectedBookingForPayment(null)}
//           bookingData={{
//             booking_id: selectedBookingForPayment.booking_id,
//             total_amount: selectedBookingForPayment.total_amount
//           }}
//           userData={{
//             // These fields exist because of the JOIN in your API response
//             user_id: selectedBookingForPayment.user_id,
//             email: selectedBookingForPayment.user_email,
//             first_name: selectedBookingForPayment.user_first_name,
//             last_name: selectedBookingForPayment.user_last_name,
//             phone: selectedBookingForPayment.user_contact_phone
//           }}
//           vehicleDetails={{
//             // These fields exist because of the JOIN in your API response
//             make: selectedBookingForPayment.vehicle_manufacturer,
//             model: selectedBookingForPayment.vehicle_model,
//             year: selectedBookingForPayment.vehicle_year
//           }}
//         />
//       )}
//     </div>
//   );
// };

// export default UserBookingsPage;




