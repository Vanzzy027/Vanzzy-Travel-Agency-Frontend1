

import React, { useState } from 'react';
import { 
  useGetAllBookingsQuery, 
  useUpdateBookingStatusMutation, 
  useUpdateBookingMutation,
  useCompleteBookingMutation,
  type BookingDetail
} from '../../features/api/BookingApi';
import { 
  CheckCircle, XCircle, Calendar,
  Car, Search, Filter, Edit, Clock
} from 'lucide-react';
import { toast } from 'sonner';

const BookingsManagement: React.FC = () => {
  // 1. Hooks
  const { data: bookings, isLoading } = useGetAllBookingsQuery();
  const [updateStatus] = useUpdateBookingStatusMutation();
  const [updateBooking] = useUpdateBookingMutation();
  const [completeBooking] = useCompleteBookingMutation();

  // 2. State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  
  const [selectedBooking, setSelectedBooking] = useState<BookingDetail | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  
  // FIXED: Using booking_date/return_date to match API
  const [editFormData, setEditFormData] = useState({ booking_date: '', return_date: '' });
  
  const [completionData, setCompletionData] = useState({ 
    end_mileage: 0, 
    return_date: new Date().toISOString().split('T')[0] 
  });

  // 3. Helpers
  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', month: 'short', day: 'numeric' 
    });
  };

  const parseImage = (jsonString: string | undefined | null): string | null => {
    if (!jsonString || jsonString === '[]') return null;
    try {
      if (Array.isArray(jsonString)) return jsonString[0];
      const parsed = JSON.parse(jsonString);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : null;
    } catch {
      return jsonString.startsWith('http') ? jsonString : null;
    }
  };

  // 4. Actions
  const handleStatusChange = async (id: number, newStatus: string) => {
    if (!window.confirm(`Mark booking #${id} as ${newStatus}?`)) return;

    try {
      await updateStatus({ id, status: newStatus }).unwrap();
      toast.success(`Status updated to ${newStatus}`);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;
    try {
      // FIXED: Sending booking_date/return_date
      await updateBooking({ 
        id: selectedBooking.booking_id, 
        data: { 
          booking_date: editFormData.booking_date, 
          return_date: editFormData.return_date 
        } 
      }).unwrap();
      toast.success("Dates updated");
      setIsEditModalOpen(false);
    } catch (err) {
      toast.error("Failed update");
    }
  };

  const handleCompletionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;
    try {
      await completeBooking({ 
        id: selectedBooking.booking_id, 
        return_date: completionData.return_date, // Will be mapped to actual_return_date in API
        end_mileage: completionData.end_mileage
      }).unwrap();
      toast.success("Vehicle returned");
      setIsCompleteModalOpen(false);
    } catch (err) {
      toast.error("Failed completion");
    }
  };

  const openEditModal = (booking: BookingDetail) => {
    setSelectedBooking(booking);
    // FIXED: Using booking_date/return_date
    setEditFormData({
      booking_date: booking.booking_date ? new Date(booking.booking_date).toISOString().split('T')[0] : '',
      return_date: booking.return_date ? new Date(booking.return_date).toISOString().split('T')[0] : ''
    });
    setIsEditModalOpen(true);
  };

  // 5. Filter
  const filteredBookings = bookings?.filter(b => {
    const matchesSearch = 
      b.user_first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.vehicle_model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(b.booking_id).includes(searchTerm);
    
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) return <div className="p-8 text-[#027480] animate-pulse font-bold">Loading...</div>;

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#001524]">Bookings Management</h1>
        <div className="flex gap-2">
           <input 
             className="border p-2 rounded-lg" 
             placeholder="Search..." 
             value={searchTerm} 
             onChange={e => setSearchTerm(e.target.value)} 
           />
           <select 
             className="border p-2 rounded-lg"
             value={statusFilter}
             onChange={e => setStatusFilter(e.target.value)}
           >
             <option value="All">All</option>
             <option value="Pending">Pending</option>
             <option value="Confirmed">Confirmed</option>
             <option value="Active">Active</option>
             <option value="Completed">Completed</option>
             <option value="Cancelled">Cancelled</option>
           </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#001524] text-[#E9E6DD]">
            <tr>
              <th className="p-4">Vehicle</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Dates</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings?.map((b) => (
              <tr key={b.booking_id} className="border-b hover:bg-gray-50">
                <td className="p-4 flex items-center gap-3">
                  <img src={parseImage(b.vehicle_images) || ''} className="w-12 h-12 rounded object-cover bg-gray-200" alt="" />
                  <div>
                    <div className="font-bold">{b.vehicle_manufacturer} {b.vehicle_model}</div>
                    <div className="text-xs text-gray-500">{b.vehicle_license_plate}</div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="font-bold">{b.user_first_name} {b.user_last_name}</div>
                  <div className="text-xs text-gray-500">{b.user_contact_phone}</div>
                </td>
                <td className="p-4 text-sm">
                  {/* FIXED: Using booking_date / return_date */}
                  {formatDate(b.booking_date)} - {formatDate(b.return_date)}
                  <div className="font-bold text-[#027480]">${b.total_amount}</div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    b.status === 'Active' ? 'bg-blue-100 text-blue-700' :
                    b.status === 'Completed' ? 'bg-gray-100 text-gray-700' :
                    b.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {b.status}
                  </span>
                </td>
                <td className="p-4 text-right flex justify-end gap-2">
                  {['Pending', 'Confirmed'].includes(b.status) && (
                    <button onClick={() => openEditModal(b)} className="p-2 hover:bg-gray-200 rounded"><Edit size={16}/></button>
                  )}
                  {b.status === 'Pending' && (
                    <button onClick={() => handleStatusChange(b.booking_id, 'Confirmed')} className="p-2 text-green-600 hover:bg-green-50 rounded"><CheckCircle size={16}/></button>
                  )}
                  {b.status === 'Confirmed' && (
                    <button onClick={() => handleStatusChange(b.booking_id, 'Active')} className="p-2 text-blue-600 hover:bg-blue-50 rounded flex items-center gap-1"><Clock size={16}/> Start</button>
                  )}
                  {b.status === 'Active' && (
                    <button onClick={() => {setSelectedBooking(b); setIsCompleteModalOpen(true)}} className="p-2 text-[#027480] hover:bg-teal-50 rounded flex items-center gap-1"><CheckCircle size={16}/> Return</button>
                  )}
                  {!['Completed', 'Cancelled'].includes(b.status) && (
                    <button onClick={() => handleStatusChange(b.booking_id, 'Cancelled')} className="p-2 text-red-600 hover:bg-red-50 rounded"><XCircle size={16}/></button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* EDIT MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="font-bold mb-4">Edit Dates</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <input type="date" className="w-full border p-2 rounded" value={editFormData.booking_date} onChange={e => setEditFormData({...editFormData, booking_date: e.target.value})} />
              <input type="date" className="w-full border p-2 rounded" value={editFormData.return_date} onChange={e => setEditFormData({...editFormData, return_date: e.target.value})} />
              <button className="w-full bg-[#027480] text-white p-2 rounded">Save</button>
              <button type="button" onClick={() => setIsEditModalOpen(false)} className="w-full text-gray-500 p-2">Cancel</button>
            </form>
          </div>
        </div>
      )}

      {/* COMPLETE MODAL */}
      {isCompleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="font-bold mb-4">Complete Rental</h3>
            <form onSubmit={handleCompletionSubmit} className="space-y-4">
              <input type="date" className="w-full border p-2 rounded" value={completionData.return_date} onChange={e => setCompletionData({...completionData, return_date: e.target.value})} />
              <input type="number" placeholder="End Mileage" className="w-full border p-2 rounded" value={completionData.end_mileage} onChange={e => setCompletionData({...completionData, end_mileage: parseInt(e.target.value)})} />
              <button className="w-full bg-[#F57251] text-white p-2 rounded">Confirm Return</button>
              <button type="button" onClick={() => setIsCompleteModalOpen(false)} className="w-full text-gray-500 p-2">Cancel</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default BookingsManagement;

// import React, { useState } from 'react';
// import { useGetAllBookingsQuery, useUpdateBookingStatusMutation } from '../../features/api/BookingApi'; // Assume these exist
// import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

// const BookingsManagement: React.FC = () => {
//   const { data: bookings } = useGetAllBookingsQuery();
//   const [updateStatus] = useUpdateBookingStatusMutation();
  
//   const [completionModal, setCompletionModal] = useState<{isOpen: boolean, id: number | null}>({isOpen: false, id: null});
//   const [completionData, setCompletionData] = useState({
//     return_date: new Date().toISOString().split('T')[0],
//     condition: 'Good',
//     notes: ''
//   });

//   const handleComplete = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (completionModal.id) {
//         // Here you would call an API like: POST /bookings/:id/complete
//         console.log(`Completing booking ${completionModal.id}`, completionData);
//         // await completeBooking({ id: completionModal.id, ...completionData });
//         setCompletionModal({isOpen: false, id: null});
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <h1 className="text-3xl font-bold text-[#001524]">Bookings</h1>
      
//       {/* Table */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200">
//         <table className="w-full text-left">
//           <thead className="bg-gray-50 text-gray-600 text-sm">
//             <tr>
//               <th className="p-4">ID</th>
//               <th className="p-4">User</th>
//               <th className="p-4">Vehicle</th>
//               <th className="p-4">Dates</th>
//               <th className="p-4">Status</th>
//               <th className="p-4">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {bookings?.map((b: any) => (
//               <tr key={b.id} className="border-t border-gray-100 hover:bg-gray-50">
//                 <td className="p-4">#{b.id}</td>
//                 <td className="p-4">{b.user?.full_name || 'User ' + b.user_id}</td>
//                 <td className="p-4">{b.vehicle?.model || 'Vehicle ' + b.vehicle_id}</td>
//                 <td className="p-4 text-sm">{new Date(b.start_date).toLocaleDateString()} → {new Date(b.end_date).toLocaleDateString()}</td>
//                 <td className="p-4">
//                   <span className={`px-2 py-1 rounded text-xs font-bold ${
//                     b.booking_status === 'Completed' ? 'bg-gray-200 text-gray-700' :
//                     b.booking_status === 'Active' ? 'bg-green-100 text-green-700' :
//                     'bg-yellow-100 text-yellow-700'
//                   }`}>{b.booking_status}</span>
//                 </td>
//                 <td className="p-4 flex gap-2">
//                   {b.booking_status === 'Pending' && (
//                      <button className="text-green-600 hover:bg-green-50 p-1 rounded" title="Approve">
//                         <CheckCircle size={18} />
//                      </button>
//                   )}
//                   {b.booking_status === 'Active' && (
//                      <button 
//                        onClick={() => setCompletionModal({isOpen: true, id: b.id})}
//                        className="text-blue-600 hover:bg-blue-50 p-1 rounded flex items-center gap-1 text-xs font-bold"
//                      >
//                         <CheckCircle size={14} /> Return Car
//                      </button>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* COMPLETE BOOKING MODAL */}
//       {completionModal.isOpen && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//            <div className="bg-white p-6 rounded-xl w-96 shadow-xl">
//               <h3 className="text-lg font-bold mb-4">Complete Booking #{completionModal.id}</h3>
//               <form onSubmit={handleComplete} className="space-y-4">
//                  <div>
//                     <label className="block text-sm text-gray-600">Actual Return Date</label>
//                     <input type="date" className="w-full border p-2 rounded" 
//                       value={completionData.return_date}
//                       onChange={e => setCompletionData({...completionData, return_date: e.target.value})}
//                     />
//                  </div>
//                  <div>
//                     <label className="block text-sm text-gray-600">Vehicle Condition</label>
//                     <select className="w-full border p-2 rounded"
//                       value={completionData.condition}
//                       onChange={e => setCompletionData({...completionData, condition: e.target.value})}
//                     >
//                         <option>Good</option>
//                         <option>Scratched</option>
//                         <option>Damaged</option>
//                         <option>Needs Cleaning</option>
//                     </select>
//                  </div>
//                  <div className="flex gap-2 pt-2">
//                     <button type="button" onClick={() => setCompletionModal({isOpen: false, id: null})} className="flex-1 bg-gray-200 py-2 rounded">Cancel</button>
//                     <button type="submit" className="flex-1 bg-[#027480] text-white py-2 rounded">Complete</button>
//                  </div>
//               </form>
//            </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BookingsManagement;





// import React, { useState } from 'react';
// import { 
//   useGetAllBookingsQuery, 
//   useUpdateBookingStatusMutation, 
//   useUpdateBookingMutation,
//   useCompleteBookingMutation,
//   type BookingDetail
// } from '../../features/api/BookingApi';
// import { 
//   CheckCircle, XCircle, Calendar,
//   Car, Search, Filter, Edit, Clock
// } from 'lucide-react';
// import { toast } from 'sonner';

// const BookingsManagement: React.FC = () => {
//   // --- API HOOKS ---
//   // We pass void/empty object to query hooks
//   const { data: bookings, isLoading } = useGetAllBookingsQuery();
  
//   // Mutations
//   const [updateStatus] = useUpdateBookingStatusMutation();
//   const [updateBooking] = useUpdateBookingMutation();
//   const [completeBooking] = useCompleteBookingMutation();

//   // --- STATE ---
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState<string>('All');
  
//   // Modals State
//   const [selectedBooking, setSelectedBooking] = useState<BookingDetail | null>(null);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  
//   // Form State
//   // FIXED: Initialized with start/end to match database columns for "Rental Period"
//   const [editFormData, setEditFormData] = useState({ start_date: '', end_date: '' });
  
//   const [completionData, setCompletionData] = useState({ 
//     end_mileage: 0, 
//     return_date: new Date().toISOString().split('T')[0] 
//   });

//   // --- HELPERS ---

//   const formatDate = (dateString: string | undefined | null) => {
//     if (!dateString) return '—';
//     const date = new Date(dateString);
//     if (isNaN(date.getTime())) return 'Invalid Date';
//     return date.toLocaleDateString('en-US', { 
//       year: 'numeric', month: 'short', day: 'numeric' 
//     });
//   };

//   const parseImage = (jsonString: string | undefined | null): string | null => {
//     if (!jsonString || jsonString === '[]') return null;
//     try {
//       if (Array.isArray(jsonString)) return jsonString[0];
//       const parsed = JSON.parse(jsonString);
//       return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : null;
//     } catch {
//       return jsonString.startsWith('http') ? jsonString : null;
//     }
//   };

//   // --- ACTIONS ---

//   const handleStatusChange = async (id: number, newStatus: string) => {
//     if (!window.confirm(`Mark booking #${id} as ${newStatus}?`)) return;

//     try {
//       await updateStatus({ id, status: newStatus }).unwrap();
//       toast.success(`Booking status updated to ${newStatus}`);
//     } catch (err: any) {
//       console.error("Status Update Failed", err);
//       if (err.status === 404) {
//         toast.error("Endpoint not found. Check Backend Routes.");
//       } else {
//         toast.error("Failed to update status");
//       }
//     }
//   };

//   const handleEditSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!selectedBooking) return;
//     try {
//       // FIXED: Used start_date and end_date to match the State and API Interface
//       await updateBooking({ 
//         id: selectedBooking.booking_id, 
//         data: { 
//           start_date: editFormData.start_date, 
//           end_date: editFormData.end_date 
//         } 
//       }).unwrap();
//       toast.success("Booking dates updated");
//       setIsEditModalOpen(false);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to update booking");
//     }
//   };

//   const handleCompletionSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!selectedBooking) return;
//     try {
//       await completeBooking({ 
//         id: selectedBooking.booking_id, 
//         return_date: completionData.return_date,
//         end_mileage: completionData.end_mileage
//       }).unwrap();
//       toast.success("Vehicle returned successfully");
//       setIsCompleteModalOpen(false);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to complete booking");
//     }
//   };

//   const openEditModal = (booking: BookingDetail) => {
//     setSelectedBooking(booking);
//     // FIXED: Mapping API 'start_date' to form state
//     setEditFormData({
//       start_date: booking.booking_date ? new Date(booking.start_date).toISOString().split('T')[0] : '',
//       end_date: booking.end_date ? new Date(booking.end_date).toISOString().split('T')[0] : ''
//     });
//     setIsEditModalOpen(true);
//   };

//   // --- FILTERING ---
//   const filteredBookings = bookings?.filter(b => {
//     // Check fields safely
//     const matchesSearch = 
//       b.user_first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       b.user_last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       b.vehicle_model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       b.vehicle_license_plate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       String(b.booking_id).includes(searchTerm);
    
//     // Status filter
//     const matchesStatus = statusFilter === 'All' || b.booking_status === statusFilter;
    
//     return matchesSearch && matchesStatus;
//   });

//   if (isLoading) return <div className="p-8 text-[#027480] animate-pulse font-bold text-xl">Loading Bookings...</div>;

//   return (
//     <div className="space-y-6">
      
//       {/* HEADER & FILTERS */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//         <div>
//           <h1 className="text-3xl font-bold text-[#001524]">Bookings Management</h1>
//           <p className="text-[#445048]">Monitor rentals and manage returns.</p>
//         </div>

//         <div className="flex gap-3 w-full md:w-auto">
//           <div className="relative">
//             <Filter className="absolute left-3 top-3 text-gray-400" size={16} />
//             <select 
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//               className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#027480] appearance-none bg-white cursor-pointer"
//             >
//               <option value="All">All Status</option>
//               <option value="Pending">Pending</option>
//               <option value="Confirmed">Confirmed</option>
//               <option value="Active">Active</option>
//               <option value="Completed">Completed</option>
//               <option value="Cancelled">Cancelled</option>
//             </select>
//           </div>

//           <div className="relative flex-1 md:w-64">
//             <Search className="absolute left-3 top-3 text-gray-400" size={16} />
//             <input 
//               type="text" 
//               placeholder="Search ID, Name, Plate..." 
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#027480]"
//             />
//           </div>
//         </div>
//       </div>

//       {/* TABLE */}
//       <div className="bg-white rounded-xl shadow-lg border border-[#445048]/20 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left border-collapse">
//             <thead className="bg-[#001524] text-[#E9E6DD]">
//               <tr>
//                 <th className="p-4 font-semibold">Vehicle</th>
//                 <th className="p-4 font-semibold">Customer</th>
//                 <th className="p-4 font-semibold">Schedule</th>
//                 <th className="p-4 font-semibold">Status</th>
//                 <th className="p-4 font-semibold text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100">
//               {filteredBookings?.map((b) => (
//                 <tr key={b.booking_id} className="hover:bg-gray-50 transition-colors group">
                  
//                   {/* 1. Vehicle Column */}
//                   <td className="p-4">
//                     <div className="flex items-center gap-3">
//                       <div className="w-16 h-12 bg-gray-200 rounded overflow-hidden flex-shrink-0 border border-gray-300">
//                         {parseImage(b.vehicle_images) ? (
//                           <img 
//                             src={parseImage(b.vehicle_images)!} 
//                             alt="Car" 
//                             className="w-full h-full object-cover" 
//                           />
//                         ) : (
//                           <div className="w-full h-full flex items-center justify-center text-gray-400">
//                             <Car size={20}/>
//                           </div>
//                         )}
//                       </div>
//                       <div>
//                         <div className="font-bold text-[#001524]">{b.vehicle_manufacturer} {b.vehicle_model}</div>
//                         <div className="text-xs font-mono bg-gray-100 px-1 rounded inline-block text-gray-600 border border-gray-200">
//                           {b.vehicle_license_plate}
//                         </div>
//                       </div>
//                     </div>
//                   </td>

//                   {/* 2. Customer Column */}
//                   <td className="p-4">
//                     <div className="flex items-center gap-3">
//                       <div className="w-8 h-8 rounded-full bg-[#027480]/10 text-[#027480] flex items-center justify-center font-bold text-xs uppercase">
//                         {b.user_first_name?.[0] || 'U'}{b.user_last_name?.[0] || ''}
//                       </div>
//                       <div>
//                         <div className="font-semibold text-gray-800">{b.user_first_name} {b.user_last_name}</div>
//                         <div className="text-xs text-gray-500">{b.user_contact_phone}</div>
//                       </div>
//                     </div>
//                   </td>

//                   {/* 3. Schedule Column */}
//                   <td className="p-4">
//                     <div className="flex flex-col text-sm">
//                       <div className="flex items-center gap-1 text-gray-700">
//                         <Calendar size={14} className="text-[#027480]"/> 
//                         {/* FIXED: Using 'end_date' here instead of undefined 'return_date' */}
//                         {formatDate(b.start_date)} - {formatDate(b.end_date)}
//                       </div>
//                       <div className="font-bold text-[#001524] mt-1 text-xs">
//                         Total: ${Number(b.total_amount).toLocaleString()}
//                       </div>
//                     </div>
//                   </td>

//                   {/* 4. Status Column */}
//                   <td className="p-4">
//                     <span className={`px-3 py-1 rounded-full text-xs font-bold border inline-block ${
//                       b.booking_status === 'Completed' ? 'bg-gray-100 text-gray-600 border-gray-200' :
//                       b.booking_status === 'Active' ? 'bg-[#027480]/10 text-[#027480] border-[#027480]/20' :
//                       b.booking_status === 'Confirmed' ? 'bg-blue-100 text-blue-700 border-blue-200' :
//                       b.booking_status === 'Cancelled' ? 'bg-red-100 text-red-700 border-red-200' :
//                       'bg-yellow-100 text-yellow-700 border-yellow-200'
//                     }`}>
//                       {b.booking_status || 'Unknown'}
//                     </span>
//                   </td>

//                   {/* 5. Actions Column */}
//                   <td className="p-4 text-right">
//                     <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      
//                       {/* EDIT DATES */}
//                       {['Pending', 'Confirmed'].includes(b.booking_status) && (
//                         <button onClick={() => openEditModal(b)} className="p-2 text-gray-500 hover:bg-gray-200 rounded tooltip" title="Edit Dates">
//                           <Edit size={16} />
//                         </button>
//                       )}

//                       {/* APPROVE (Pending -> Confirmed) */}
//                       {b.booking_status === 'Pending' && (
//                         <button onClick={() => handleStatusChange(b.booking_id, 'Confirmed')} className="p-2 text-green-600 hover:bg-green-100 rounded font-bold" title="Approve">
//                           <CheckCircle size={16} />
//                         </button>
//                       )}

//                       {/* START RENTAL (Confirmed -> Active) */}
//                       {b.booking_status === 'Confirmed' && (
//                         <button onClick={() => handleStatusChange(b.booking_id, 'Active')} className="p-2 text-blue-600 hover:bg-blue-100 rounded font-bold flex items-center gap-1" title="Start Trip">
//                           <Clock size={16} /> 
//                         </button>
//                       )}

//                       {/* RETURN CAR (Active -> Completed) */}
//                       {b.booking_status === 'Active' && (
//                         <button onClick={() => { setSelectedBooking(b); setIsCompleteModalOpen(true); }} className="p-2 text-[#027480] hover:bg-[#027480]/10 rounded font-bold flex items-center gap-1" title="Return Vehicle">
//                           <CheckCircle size={16} /> 
//                         </button>
//                       )}

//                       {/* CANCEL (Not Completed/Cancelled) */}
//                       {!['Completed', 'Cancelled'].includes(b.booking_status) && (
//                         <button onClick={() => handleStatusChange(b.booking_id, 'Cancelled')} className="p-2 text-red-500 hover:bg-red-100 rounded" title="Cancel">
//                           <XCircle size={16} />
//                         </button>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* --- EDIT MODAL --- */}
//       {isEditModalOpen && selectedBooking && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
//             <h3 className="text-xl font-bold mb-4 text-[#001524]">Edit Booking Schedule</h3>
//             <form onSubmit={handleEditSubmit} className="space-y-4">
//               <div>
//                 <label className="text-xs font-bold text-gray-500">Start Date</label>
//                 {/* FIXED: binding to editFormData.start_date */}
//                 <input 
//                   type="date" 
//                   required 
//                   className="w-full border p-2 rounded" 
//                   value={editFormData.start_date} 
//                   onChange={e => setEditFormData({...editFormData, start_date: e.target.value})} 
//                 />
//               </div>
//               <div>
//                 <label className="text-xs font-bold text-gray-500">End Date</label>
//                 {/* FIXED: binding to editFormData.end_date */}
//                 <input 
//                   type="date" 
//                   required 
//                   className="w-full border p-2 rounded" 
//                   value={editFormData.end_date} 
//                   onChange={e => setEditFormData({...editFormData, end_date: e.target.value})} 
//                 />
//               </div>
//               <div className="flex gap-3 pt-4">
//                 <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 text-gray-500">Cancel</button>
//                 <button type="submit" className="flex-1 bg-[#027480] text-white py-2 rounded font-bold">Save Changes</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* --- COMPLETE MODAL --- */}
//       {isCompleteModalOpen && selectedBooking && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
//             <h3 className="text-xl font-bold mb-1 text-[#001524]">Complete Rental</h3>
//             <p className="text-sm text-gray-500 mb-4">Car: {selectedBooking.vehicle_model} ({selectedBooking.vehicle_license_plate})</p>
//             <form onSubmit={handleCompletionSubmit} className="space-y-4">
//               <div>
//                 <label className="text-xs font-bold text-gray-500">Return Date</label>
//                 <input 
//                   type="date" 
//                   required 
//                   className="w-full border p-2 rounded" 
//                   value={completionData.return_date} 
//                   onChange={e => setCompletionData({...completionData, return_date: e.target.value})} 
//                 />
//               </div>
//               <div>
//                 <label className="text-xs font-bold text-gray-500">End Mileage</label>
//                 <input 
//                   type="number" 
//                   required 
//                   placeholder="e.g. 52000" 
//                   className="w-full border p-2 rounded" 
//                   value={completionData.end_mileage} 
//                   onChange={e => setCompletionData({...completionData, end_mileage: parseInt(e.target.value)})} 
//                 />
//               </div>
//               <div className="flex gap-3 pt-4">
//                 <button type="button" onClick={() => setIsCompleteModalOpen(false)} className="flex-1 text-gray-500">Cancel</button>
//                 <button type="submit" className="flex-1 bg-[#F57251] text-white py-2 rounded font-bold">Confirm Return</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// };

// export default BookingsManagement;