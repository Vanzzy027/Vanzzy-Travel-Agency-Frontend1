import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
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
    const [selectedBooking, setSelectedBooking] = useState('');
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    // --- HANDLERS ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentUserId) {
            toast.error("User session invalid. Please log in again.");
            return;
        }
        if (!selectedBooking)
            return toast.error("Please select a vehicle");
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
        }
        catch (err) {
            toast.error("Failed to submit review");
        }
    };
    // Helper to parse images safely
    const getImage = (imgStr) => {
        try {
            const parsed = JSON.parse(imgStr);
            return Array.isArray(parsed) ? parsed[0] : parsed;
        }
        catch {
            return 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80';
        }
    };
    // --- RENDER LOADING STATE ---
    if (!currentUserId) {
        return _jsx("div", { className: "p-10 text-red-500", children: "Please log in to view your reviews." });
    }
    return (_jsxs("div", { className: "min-h-screen bg-[#001524] p-6 md:p-10 text-[#E9E6DD] pb-20", children: [_jsx("h1", { className: "text-3xl font-bold mb-8", children: "My Reviews" }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [_jsxs("div", { className: "bg-[#0f2434] p-6 rounded-2xl border border-[#445048]", children: [_jsxs("h2", { className: "text-xl font-bold text-[#F57251] mb-4 flex items-center gap-2", children: [_jsx("span", { children: "\u270D\uFE0F" }), " Write a Review"] }), isLoadingEligible ? (_jsx("div", { className: "text-[#027480] animate-pulse", children: "Checking eligible trips..." })) : eligibleBookings && eligibleBookings.length > 0 ? (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm text-[#C4AD9D] mb-2", children: "Select Vehicle" }), _jsxs("select", { value: selectedBooking, onChange: (e) => setSelectedBooking(e.target.value), className: "w-full bg-[#001524] border border-[#445048] rounded-xl p-3 text-white outline-none focus:border-[#027480]", required: true, children: [_jsx("option", { value: "", children: "-- Choose a completed trip --" }), eligibleBookings.map(b => (_jsxs("option", { value: b.booking_id, children: [b.year, " ", b.manufacturer, " ", b.model, " (Returned: ", new Date(b.return_date).toLocaleDateString(), ")"] }, b.booking_id)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm text-[#C4AD9D] mb-2", children: "Rating" }), _jsx("div", { className: "flex gap-2", children: [1, 2, 3, 4, 5].map(star => (_jsx("button", { type: "button", onClick: () => setRating(star), className: `text-2xl transition-transform hover:scale-110 ${star <= rating ? 'text-yellow-400' : 'text-gray-600'}`, children: "\u2605" }, star))) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm text-[#C4AD9D] mb-2", children: "Comment" }), _jsx("textarea", { value: comment, onChange: (e) => setComment(e.target.value), className: "w-full bg-[#001524] border border-[#445048] rounded-xl p-3 text-white outline-none focus:border-[#027480]", rows: 4, placeholder: "How was your experience?", required: true })] }), _jsx("button", { disabled: isSubmitting, className: "w-full bg-[#027480] text-white py-3 rounded-xl font-bold hover:bg-[#025a63] transition-colors", children: isSubmitting ? 'Submitting...' : 'Submit Review' })] })) : (_jsxs("div", { className: "text-center py-10 text-[#C4AD9D]", children: [_jsx("p", { children: "You have no unreviewed completed trips." }), _jsx("p", { className: "text-xs mt-2", children: "Only \"Completed\" bookings can be reviewed." })] }))] }), _jsxs("div", { className: "space-y-4", children: [_jsx("h2", { className: "text-xl font-bold text-[#E9E6DD]", children: "My Review History" }), isLoadingReviews && _jsx("div", { className: "text-[#027480]", children: "Loading history..." }), !isLoadingReviews && myReviews?.length === 0 && (_jsx("div", { className: "text-[#C4AD9D]", children: "No past reviews found." })), myReviews?.map(review => (_jsxs("div", { className: "bg-[#0f2434] p-4 rounded-xl border border-[#445048] flex gap-4", children: [_jsx("img", { src: getImage(review.images), className: "w-20 h-20 object-cover rounded-lg bg-black/50", alt: "Vehicle" }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("h3", { className: "font-bold text-white", children: [review.manufacturer, " ", review.model] }), _jsx("span", { className: `text-xs px-2 py-1 rounded border ${review.status === 'Approved' ? 'border-green-500 text-green-400' :
                                                            review.status === 'Rejected' ? 'border-red-500 text-red-400' :
                                                                'border-yellow-500 text-yellow-400'}`, children: review.status })] }), _jsx("div", { className: "text-yellow-400 text-sm my-1", children: '★'.repeat(review.rating) }), _jsx("p", { className: "text-[#C4AD9D] text-sm", children: review.comment })] })] }, review.review_id)))] })] })] }));
};
export default MyReviewsPage;
