import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useGetAllBookingsQuery, useUpdateBookingStatusMutation, useCompleteBookingMutation, } from "../../features/api/BookingApi";
import { Car, Search, Calendar, Clock, CheckCircle, XCircle, DollarSign, AlertTriangle, } from "lucide-react";
import { toast } from "sonner";
// -------------------------------
// Component
// -------------------------------
const BookingsManagement = () => {
    // Query + Mutations
    const { data: bookings, isLoading, refetch, } = useGetAllBookingsQuery(undefined, { pollingInterval: 30000 });
    const [updateStatus] = useUpdateBookingStatusMutation();
    const [completeBooking] = useCompleteBookingMutation();
    // Filters
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    // Completion modal
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [completionForm, setCompletionForm] = useState({
        end_mileage: 0,
        return_date: new Date().toISOString().split("T")[0],
    });
    // -------------------------------
    // Helpers
    // -------------------------------
    const changeStatus = async (id, status) => {
        try {
            await updateStatus({ id, status }).unwrap();
            toast.success(`Booking marked as ${status}`);
            refetch();
        }
        catch (err) {
            toast.error(err.data?.error || "Failed to update booking");
        }
    };
    const submitCompletion = async (e) => {
        e.preventDefault();
        if (!selectedBooking)
            return;
        try {
            // result is now typed as BookingCompletionResponse
            const result = await completeBooking({
                id: selectedBooking.booking_id,
                return_date: completionForm.return_date,
                end_mileage: completionForm.end_mileage,
            }).unwrap();
            setModalOpen(false);
            // ✅ This will now work without TypeScript errors
            if (result && result.late_fee > 0) {
                toast.warning(`Vehicle returned late — fee applied: $${result.late_fee}`);
            }
            else {
                toast.success("Return completed successfully");
            }
            refetch();
        }
        catch (err) {
            toast.error(err.data?.error || "Failed to complete booking");
        }
    };
    const openModal = (booking) => {
        setSelectedBooking(booking);
        setCompletionForm({
            end_mileage: 0,
            return_date: new Date().toISOString().split("T")[0],
        });
        setModalOpen(true);
    };
    // -------------------------------
    // Filtered Data
    // -------------------------------
    const filtered = bookings?.filter((b) => {
        const s = search.toLowerCase();
        const matchesSearch = b.user_first_name?.toLowerCase().includes(s) ||
            b.vehicle_model?.toLowerCase().includes(s) ||
            String(b.booking_id).includes(s);
        const status = b.booking_status || b.status;
        const matchesStatus = statusFilter === "All" || status === statusFilter;
        return matchesSearch && matchesStatus;
    });
    // -------------------------------
    // Loading State
    // -------------------------------
    if (isLoading)
        return (_jsx("div", { className: "flex justify-center items-center h-64 text-[#027480]", children: _jsx("div", { className: "animate-spin rounded-full h-10 w-10 border-b-2 border-[#027480]" }) }));
    // -------------------------------
    // Component UI
    // -------------------------------
    return (_jsxs("div", { className: "p-6 space-y-6 bg-gray-50 min-h-screen", children: [_jsxs("div", { className: "flex flex-col md:flex-row justify-between md:items-center gap-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-[#001524]", children: "Bookings" }), _jsx("p", { className: "text-gray-500", children: "Track rentals, returns, and payments." })] }), _jsxs("div", { className: "flex gap-3 w-full md:w-auto", children: [_jsxs("div", { className: "relative flex-1 md:w-64", children: [_jsx(Search, { className: "absolute left-3 top-3 text-gray-400", size: 18 }), _jsx("input", { placeholder: "Search booking...", value: search, onChange: (e) => setSearch(e.target.value), className: "w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#027480]" })] }), _jsxs("select", { value: statusFilter, onChange: (e) => setStatusFilter(e.target.value), className: "px-4 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#027480]", children: [_jsx("option", { value: "All", children: "All Status" }), _jsx("option", { value: "Pending", children: "Pending" }), _jsx("option", { value: "Confirmed", children: "Confirmed" }), _jsx("option", { value: "Active", children: "Active" }), _jsx("option", { value: "Completed", children: "Completed" }), _jsx("option", { value: "Cancelled", children: "Cancelled" })] })] })] }), _jsxs("div", { className: "bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden", children: [_jsxs("table", { className: "w-full text-left", children: [_jsx("thead", { className: "bg-[#001524] text-[#E9E6DD]", children: _jsxs("tr", { children: [_jsx("th", { className: "p-4", children: "Vehicle" }), _jsx("th", { className: "p-4", children: "Customer" }), _jsx("th", { className: "p-4", children: "Timeline & Cost" }), _jsx("th", { className: "p-4", children: "Status" }), _jsx("th", { className: "p-4 text-right", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-100", children: filtered?.map((b) => (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsx("td", { className: "p-4", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-400", children: _jsx(Car, { size: 18 }) }), _jsxs("div", { children: [_jsxs("div", { className: "font-bold", children: [b.vehicle_manufacturer, " ", b.vehicle_model] }), _jsx("div", { className: "text-xs text-gray-500 font-mono", children: b.vehicle_license_plate })] })] }) }), _jsxs("td", { className: "p-4", children: [_jsxs("div", { className: "font-medium", children: [b.user_first_name, " ", b.user_last_name] }), _jsx("div", { className: "text-xs text-gray-500", children: b.user_contact_phone })] }), _jsxs("td", { className: "p-4", children: [_jsxs("div", { className: "flex items-center gap-2 text-gray-600 text-sm", children: [_jsx(Calendar, { size: 14 }), new Date(b.booking_date).toLocaleDateString(), " \u2014", " ", new Date(b.return_date).toLocaleDateString()] }), _jsxs("div", { className: "mt-1 flex items-center gap-1 font-bold text-[#027480]", children: [_jsx(DollarSign, { size: 14 }), Number(b.total_amount).toFixed(2)] })] }), _jsx("td", { className: "p-4", children: _jsxs("span", { className: `px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1
                      ${b.booking_status === "Active"
                                                    ? "bg-blue-100 text-blue-800"
                                                    : b.booking_status === "Completed"
                                                        ? "bg-gray-100 text-gray-600"
                                                        : b.booking_status === "Confirmed"
                                                            ? "bg-teal-100 text-teal-800"
                                                            : b.booking_status === "Cancelled"
                                                                ? "bg-red-100 text-red-800"
                                                                : "bg-yellow-100 text-yellow-800"}
                    `, children: [b.booking_status === "Active" && _jsx(Clock, { size: 12 }), b.booking_status] }) }), _jsx("td", { className: "p-4 text-right", children: _jsxs("div", { className: "flex justify-end gap-2", children: [b.booking_status === "Pending" && (_jsx("button", { onClick: () => changeStatus(b.booking_id, "Confirmed"), className: "p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100", children: _jsx(CheckCircle, { size: 18 }) })), b.booking_status === "Confirmed" && (_jsx("button", { onClick: () => changeStatus(b.booking_id, "Active"), className: "px-3 py-2 bg-[#027480] text-white rounded-lg hover:bg-[#025a63] text-xs font-bold", children: "Start Trip" })), b.booking_status === "Active" && (_jsx("button", { onClick: () => openModal(b), className: "px-3 py-2 bg-[#F57251] text-white rounded-lg hover:bg-[#e06241] text-xs font-bold", children: "Return Vehicle" })), !["Completed", "Active", "Cancelled"].includes(b.booking_status) && (_jsx("button", { onClick: () => {
                                                            if (window.confirm("Cancel this booking?"))
                                                                changeStatus(b.booking_id, "Cancelled");
                                                        }, className: "p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100", children: _jsx(XCircle, { size: 18 }) }))] }) })] }, b.booking_id))) })] }), !filtered?.length && (_jsx("div", { className: "p-8 text-center text-gray-500", children: "No bookings found." }))] }), modalOpen && selectedBooking && (_jsx("div", { className: "fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50", children: _jsxs("div", { className: "bg-white w-full max-w-md p-6 rounded-xl shadow-xl border border-gray-100", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h2", { className: "text-lg font-bold", children: "Complete Rental" }), _jsx("button", { className: "text-gray-500 hover:text-gray-700", onClick: () => setModalOpen(false), children: _jsx(XCircle, { size: 22 }) })] }), _jsxs("div", { className: "flex gap-2 bg-blue-50 p-3 rounded text-blue-800 text-sm mb-4", children: [_jsx(AlertTriangle, { size: 16 }), "Expected return date:", " ", _jsx("strong", { children: new Date(selectedBooking.return_date).toLocaleDateString() })] }), _jsxs("form", { onSubmit: submitCompletion, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium", children: "Actual Return Date" }), _jsx("input", { type: "date", value: completionForm.return_date, onChange: (e) => setCompletionForm({
                                                ...completionForm,
                                                return_date: e.target.value,
                                            }), className: "mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#027480]" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium", children: "Final Mileage" }), _jsx("input", { type: "number", placeholder: "e.g. 45000", value: completionForm.end_mileage, onChange: (e) => setCompletionForm({
                                                ...completionForm,
                                                end_mileage: parseInt(e.target.value),
                                            }), className: "mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#027480]" })] }), _jsxs("div", { className: "flex gap-3 pt-2", children: [_jsx("button", { type: "button", onClick: () => setModalOpen(false), className: "flex-1 py-2 border rounded-lg hover:bg-gray-50", children: "Cancel" }), _jsx("button", { type: "submit", className: "flex-1 py-2 bg-[#027480] text-white rounded-lg hover:bg-[#025a63]", children: "Confirm Return" })] })] })] }) }))] }));
};
export default BookingsManagement;
