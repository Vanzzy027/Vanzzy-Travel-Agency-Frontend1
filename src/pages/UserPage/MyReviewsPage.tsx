import React, { useState } from 'react';
import { useGetEligibleBookingsQuery, useCreateReviewMutation, useGetUserReviewsQuery } from '../../features/api/ReviewApi';
import { toast } from 'sonner';

const MyReviewsPage = () => {
  // 1. 🟢 GET USER FROM LOCAL STORAGE
  // We try to retrieve the 'user' string and parse it. 
  // If it fails or doesn't exist, we default to null.
  const storedUser = localStorage.getItem('user'); 
  const user = storedUser ? JSON.parse(storedUser) : null;
  const currentUserId = user?.user_id;

  // 2. 🟢 API HOOKS (With Safety Check)
  // The { skip: !currentUserId } option prevents the API from firing if ID is missing
  const { data: eligibleBookings, isLoading: isLoadingEligible } = useGetEligibleBookingsQuery(currentUserId, {
    skip: !currentUserId 
  });
  
  const { data: myReviews, isLoading: isLoadingReviews } = useGetUserReviewsQuery(currentUserId, {
    skip: !currentUserId
  });

  const [createReview, { isLoading: isSubmitting }] = useCreateReviewMutation();

  // --- STATE ---
  const [selectedBooking, setSelectedBooking] = useState<string>('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  // --- HANDLERS ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUserId) {
        toast.error("User session invalid. Please log in again.");
        return;
    }

    if (!selectedBooking) return toast.error("Please select a vehicle");
    
    // Find vehicle ID from the booking selection
    const booking = eligibleBookings?.find(b => b.booking_id.toString() === selectedBooking);

    try {
      await createReview({
        user_id: currentUserId, // 🟢 Use the dynamic ID
        booking_id: parseInt(selectedBooking),
        vehicle_id: booking?.vehicle_id,
        rating,
        comment
      }).unwrap();
      
      toast.success("Review submitted! Waiting for approval.");
      
      // Reset Form
      setSelectedBooking('');
      setComment('');
      setRating(5);
    } catch (err) {
      toast.error("Failed to submit review");
    }
  };

  // Helper to parse images safely
  const getImage = (imgStr: string) => {
    try { 
      const parsed = JSON.parse(imgStr);
      return Array.isArray(parsed) ? parsed[0] : parsed;
    } catch { 
      return 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80'; 
    }
  };

  // --- RENDER LOADING STATE ---
  if (!currentUserId) {
      return <div className="p-10 text-red-500">Please log in to view your reviews.</div>;
  }

  return (
    <div className="min-h-screen bg-[#001524] p-6 md:p-10 text-[#E9E6DD] pb-20">
      <h1 className="text-3xl font-bold mb-8">My Reviews</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* SECTION 1: WRITE A REVIEW */}
        <div className="bg-[#0f2434] p-6 rounded-2xl border border-[#445048]">
          <h2 className="text-xl font-bold text-[#F57251] mb-4 flex items-center gap-2">
            <span>✍️</span> Write a Review
          </h2>
          
          {isLoadingEligible ? (
             <div className="text-[#027480] animate-pulse">Checking eligible trips...</div>
          ) : eligibleBookings && eligibleBookings.length > 0 ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-[#C4AD9D] mb-2">Select Vehicle</label>
                <select 
                  value={selectedBooking}
                  onChange={(e) => setSelectedBooking(e.target.value)}
                  className="w-full bg-[#001524] border border-[#445048] rounded-xl p-3 text-white outline-none focus:border-[#027480]"
                  required
                >
                  <option value="">-- Choose a completed trip --</option>
                  {eligibleBookings.map(b => (
                    <option key={b.booking_id} value={b.booking_id}>
                      {b.year} {b.manufacturer} {b.model} (Returned: {new Date(b.return_date).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-[#C4AD9D] mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-2xl transition-transform hover:scale-110 ${star <= rating ? 'text-yellow-400' : 'text-gray-600'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-[#C4AD9D] mb-2">Comment</label>
                <textarea 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-[#001524] border border-[#445048] rounded-xl p-3 text-white outline-none focus:border-[#027480]"
                  rows={4}
                  placeholder="How was your experience?"
                  required
                />
              </div>

              <button disabled={isSubmitting} className="w-full bg-[#027480] text-white py-3 rounded-xl font-bold hover:bg-[#025a63] transition-colors">
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          ) : (
            <div className="text-center py-10 text-[#C4AD9D]">
              <p>You have no unreviewed completed trips.</p>
              <p className="text-xs mt-2">Only "Completed" bookings can be reviewed.</p>
            </div>
          )}
        </div>

        {/* SECTION 2: PAST REVIEWS */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[#E9E6DD]">My Review History</h2>
          
          {isLoadingReviews && <div className="text-[#027480]">Loading history...</div>}

          {!isLoadingReviews && myReviews?.length === 0 && (
             <div className="text-[#C4AD9D]">No past reviews found.</div>
          )}

          {myReviews?.map(review => (
            <div key={review.review_id} className="bg-[#0f2434] p-4 rounded-xl border border-[#445048] flex gap-4">
              <img src={getImage(review.images)} className="w-20 h-20 object-cover rounded-lg bg-black/50" alt="Vehicle" />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-white">{review.manufacturer} {review.model}</h3>
                  <span className={`text-xs px-2 py-1 rounded border ${
                    review.status === 'Approved' ? 'border-green-500 text-green-400' :
                    review.status === 'Rejected' ? 'border-red-500 text-red-400' :
                    'border-yellow-500 text-yellow-400'
                  }`}>{review.status}</span>
                </div>
                <div className="text-yellow-400 text-sm my-1">{'★'.repeat(review.rating)}</div>
                <p className="text-[#C4AD9D] text-sm">{review.comment}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyReviewsPage;

// import React, { useState } from 'react';
// import { useGetEligibleBookingsQuery, useCreateReviewMutation, useGetUserReviewsQuery } from '../../features/api/ReviewApi';
// import { toast } from 'sonner';

// // Mock ID
// const CURRENT_USER_ID = "user-guid-here"; 

// const MyReviewsPage = () => {
//   const { data: eligibleBookings } = useGetEligibleBookingsQuery(CURRENT_USER_ID);
//   const { data: myReviews } = useGetUserReviewsQuery(CURRENT_USER_ID);
//   const [createReview, { isLoading }] = useCreateReviewMutation();

//   const [selectedBooking, setSelectedBooking] = useState<string>('');
//   const [rating, setRating] = useState(5);
//   const [comment, setComment] = useState('');

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!selectedBooking) return toast.error("Please select a vehicle");
    
//     // Find vehicle ID from the booking selection
//     const booking = eligibleBookings?.find(b => b.booking_id.toString() === selectedBooking);

//     try {
//       await createReview({
//         user_id: CURRENT_USER_ID,
//         booking_id: parseInt(selectedBooking),
//         vehicle_id: booking?.vehicle_id,
//         rating,
//         comment
//       }).unwrap();
      
//       toast.success("Review submitted! Waiting for approval.");
//       setSelectedBooking('');
//       setComment('');
//       setRating(5);
//     } catch (err) {
//       toast.error("Failed to submit review");
//     }
//   };

//   // Helper to parse images
//   const getImage = (imgStr: string) => {
//     try { return JSON.parse(imgStr)[0]; } catch { return 'https://via.placeholder.com/150'; }
//   };

//   return (
//     <div className="min-h-screen bg-[#001524] p-6 md:p-10 text-[#E9E6DD] pb-20">
//       <h1 className="text-3xl font-bold mb-8">My Reviews</h1>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
//         {/* SECTION 1: WRITE A REVIEW */}
//         <div className="bg-[#0f2434] p-6 rounded-2xl border border-[#445048]">
//           <h2 className="text-xl font-bold text-[#F57251] mb-4 flex items-center gap-2">
//             <span>✍️</span> Write a Review
//           </h2>
          
//           {eligibleBookings && eligibleBookings.length > 0 ? (
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <label className="block text-sm text-[#C4AD9D] mb-2">Select Vehicle</label>
//                 <select 
//                   value={selectedBooking}
//                   onChange={(e) => setSelectedBooking(e.target.value)}
//                   className="w-full bg-[#001524] border border-[#445048] rounded-xl p-3 text-white outline-none focus:border-[#027480]"
//                   required
//                 >
//                   <option value="">-- Choose a completed trip --</option>
//                   {eligibleBookings.map(b => (
//                     <option key={b.booking_id} value={b.booking_id}>
//                       {b.year} {b.manufacturer} {b.model} (Returned: {new Date(b.return_date).toLocaleDateString()})
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm text-[#C4AD9D] mb-2">Rating</label>
//                 <div className="flex gap-2">
//                   {[1, 2, 3, 4, 5].map(star => (
//                     <button
//                       key={star}
//                       type="button"
//                       onClick={() => setRating(star)}
//                       className={`text-2xl transition-transform hover:scale-110 ${star <= rating ? 'text-yellow-400' : 'text-gray-600'}`}
//                     >
//                       ★
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm text-[#C4AD9D] mb-2">Comment</label>
//                 <textarea 
//                   value={comment}
//                   onChange={(e) => setComment(e.target.value)}
//                   className="w-full bg-[#001524] border border-[#445048] rounded-xl p-3 text-white outline-none focus:border-[#027480]"
//                   rows={4}
//                   placeholder="How was your experience?"
//                   required
//                 />
//               </div>

//               <button disabled={isLoading} className="w-full bg-[#027480] text-white py-3 rounded-xl font-bold hover:bg-[#025a63] transition-colors">
//                 {isLoading ? 'Submitting...' : 'Submit Review'}
//               </button>
//             </form>
//           ) : (
//             <div className="text-center py-10 text-[#C4AD9D]">
//               <p>You have no unreviewed completed trips.</p>
//             </div>
//           )}
//         </div>

//         {/* SECTION 2: PAST REVIEWS */}
//         <div className="space-y-4">
//           <h2 className="text-xl font-bold text-[#E9E6DD]">My Review History</h2>
//           {myReviews?.map(review => (
//             <div key={review.review_id} className="bg-[#0f2434] p-4 rounded-xl border border-[#445048] flex gap-4">
//               <img src={getImage(review.images)} className="w-20 h-20 object-cover rounded-lg bg-black" />
//               <div className="flex-1">
//                 <div className="flex justify-between items-start">
//                   <h3 className="font-bold text-white">{review.manufacturer} {review.model}</h3>
//                   <span className={`text-xs px-2 py-1 rounded border ${
//                     review.status === 'Approved' ? 'border-green-500 text-green-400' :
//                     review.status === 'Rejected' ? 'border-red-500 text-red-400' :
//                     'border-yellow-500 text-yellow-400'
//                   }`}>{review.status}</span>
//                 </div>
//                 <div className="text-yellow-400 text-sm my-1">{'★'.repeat(review.rating)}</div>
//                 <p className="text-[#C4AD9D] text-sm">{review.comment}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MyReviewsPage;