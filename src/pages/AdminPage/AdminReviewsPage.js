import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useGetAllReviewsQuery, useUpdateReviewStatusMutation } from '../../features/api/ReviewApi';
import { toast } from 'sonner';
const AdminReviewsPage = () => {
    const { data: reviews, isLoading } = useGetAllReviewsQuery();
    const [updateReview] = useUpdateReviewStatusMutation();
    const handleAction = async (id, status, isFeatured) => {
        try {
            await updateReview({ id, status, is_featured: isFeatured }).unwrap();
            toast.success(`Review marked as ${status}`);
        }
        catch {
            toast.error("Failed to update");
        }
    };
    if (isLoading)
        return _jsx("div", { className: "p-10 text-[#027480]", children: "Loading..." });
    return (_jsxs("div", { className: "min-h-screen bg-[#001524] p-6 text-[#E9E6DD]", children: [_jsx("h1", { className: "text-3xl font-bold mb-6", children: "Review Moderation" }), _jsx("div", { className: "bg-[#0f2434] rounded-xl border border-[#445048] overflow-hidden", children: _jsxs("table", { className: "w-full text-left", children: [_jsx("thead", { className: "bg-[#001524] text-[#C4AD9D] text-xs uppercase", children: _jsxs("tr", { children: [_jsx("th", { className: "p-4", children: "User" }), _jsx("th", { className: "p-4", children: "Vehicle" }), _jsx("th", { className: "p-4", children: "Rating" }), _jsx("th", { className: "p-4 w-1/3", children: "Comment" }), _jsx("th", { className: "p-4", children: "Status" }), _jsx("th", { className: "p-4", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-[#445048]/50 text-sm", children: reviews?.map(r => (_jsxs("tr", { className: "hover:bg-[#152e40]", children: [_jsx("td", { className: "p-4 font-bold", children: r.full_name }), _jsxs("td", { className: "p-4", children: [r.manufacturer, " ", r.model] }), _jsx("td", { className: "p-4 text-yellow-400", children: '★'.repeat(r.rating) }), _jsx("td", { className: "p-4 text-[#C4AD9D]", children: r.comment }), _jsxs("td", { className: "p-4", children: [_jsx("span", { className: `px-2 py-1 rounded text-xs ${r.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                                    r.status === 'Approved' ? 'bg-green-500/20 text-green-400' :
                                                        'bg-red-500/20 text-red-400'}`, children: r.status }), r.is_featured && _jsx("span", { className: "ml-2 text-xs bg-[#027480] text-white px-2 py-1 rounded", children: "Featured" })] }), _jsxs("td", { className: "p-4 flex gap-2", children: [r.status === 'Pending' && (_jsxs(_Fragment, { children: [_jsx("button", { onClick: () => handleAction(r.review_id, 'Approved', false), className: "text-green-400 hover:text-green-300 border border-green-500/50 px-3 py-1 rounded", children: "Approve" }), _jsx("button", { onClick: () => handleAction(r.review_id, 'Rejected', false), className: "text-red-400 hover:text-red-300 border border-red-500/50 px-3 py-1 rounded", children: "Reject" })] })), r.status === 'Approved' && (_jsx("button", { onClick: () => handleAction(r.review_id, 'Approved', !r.is_featured), className: `px-3 py-1 rounded border ${r.is_featured ? 'border-yellow-500 text-yellow-400' : 'border-gray-500 text-gray-400'}`, children: r.is_featured ? 'Un-Feature' : 'Feature' }))] })] }, r.review_id))) })] }) })] }));
};
export default AdminReviewsPage;
