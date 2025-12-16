import React, { useState } from "react";
import {
  useGetAllBookingsQuery,
  useUpdateBookingStatusMutation,
  useCompleteBookingMutation,
} from "../../features/api/BookingApi";

import {
  Car,
  Search,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  AlertTriangle,
} from "lucide-react";

import { toast } from "sonner";

// -------------------------------
// Interfaces
// -------------------------------
interface BookingDetail {
  booking_id: number;
  vehicle_manufacturer: string;
  vehicle_model: string;
  vehicle_license_plate: string;
  user_first_name: string;
  user_last_name: string;
  user_contact_phone: string;
  booking_date: string;
  return_date: string;
  total_amount: number;
  status: "Pending" | "Confirmed" | "Active" | "Completed" | "Cancelled";
}

// -------------------------------
// Component
// -------------------------------
const BookingsManagement: React.FC = () => {
  // Query + Mutations
  const {
    data: bookings,
    isLoading,
    refetch,
  } = useGetAllBookingsQuery(undefined, { pollingInterval: 30000 });

  const [updateStatus] = useUpdateBookingStatusMutation();
  const [completeBooking] = useCompleteBookingMutation();

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Completion modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingDetail | null>(
    null
  );
  const [completionForm, setCompletionForm] = useState({
    end_mileage: 0,
    return_date: new Date().toISOString().split("T")[0],
  });

  // -------------------------------
  // Helpers
  // -------------------------------
  const changeStatus = async (id: number, status: string) => {
    try {
      await updateStatus({ id, status }).unwrap();
      toast.success(`Booking marked as ${status}`);
      refetch();
    } catch (err: any) {
      toast.error(err.data?.error || "Failed to update booking");
    }
  };

const submitCompletion = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!selectedBooking) return;

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
      toast.warning(
        `Vehicle returned late — fee applied: $${result.late_fee}`
      );
    } else {
      toast.success("Return completed successfully");
    }

    refetch();
  } catch (err: any) {
    toast.error(err.data?.error || "Failed to complete booking");
  }
};

  const openModal = (booking: BookingDetail) => {
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
  const filtered = bookings?.filter((b: any) => {
    const s = search.toLowerCase();

    const matchesSearch =
      b.user_first_name?.toLowerCase().includes(s) ||
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
    return (
      <div className="flex justify-center items-center h-64 text-[#027480]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#027480]"></div>
      </div>
    );

  // -------------------------------
  // Component UI
  // -------------------------------
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#001524]">Bookings</h1>
          <p className="text-gray-500">Track rentals, returns, and payments.</p>
        </div>

        {/* Search + Filter */}
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              placeholder="Search booking..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#027480]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#027480]"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#001524] text-[#E9E6DD]">
            <tr>
              <th className="p-4">Vehicle</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Timeline & Cost</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {filtered?.map((b: any) => (
              <tr key={b.booking_id} className="hover:bg-gray-50">
                {/* Vehicle */}
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                      <Car size={18} />
                    </div>
                    <div>
                      <div className="font-bold">
                        {b.vehicle_manufacturer} {b.vehicle_model}
                      </div>
                      <div className="text-xs text-gray-500 font-mono">
                        {b.vehicle_license_plate}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Customer */}
                <td className="p-4">
                  <div className="font-medium">
                    {b.user_first_name} {b.user_last_name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {b.user_contact_phone}
                  </div>
                </td>

                {/* Timeline */}
                <td className="p-4">
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Calendar size={14} />
                    {new Date(b.booking_date).toLocaleDateString()} —{" "}
                    {new Date(b.return_date).toLocaleDateString()}
                  </div>

                  <div className="mt-1 flex items-center gap-1 font-bold text-[#027480]">
                    <DollarSign size={14} />
                    {Number(b.total_amount).toFixed(2)}
                  </div>
                </td>

                {/* Status */}
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1
                      ${
                        b.booking_status === "Active"
                          ? "bg-blue-100 text-blue-800"
                          : b.booking_status === "Completed"
                          ? "bg-gray-100 text-gray-600"
                          : b.booking_status === "Confirmed"
                          ? "bg-teal-100 text-teal-800"
                          : b.booking_status === "Cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }
                    `}
                  >
                    {b.booking_status === "Active" && <Clock size={12} />}
                    {b.booking_status}
                  </span>
                </td>

                {/* Actions */}
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    {/* PENDING → CONFIRMED */}
                    {b.booking_status === "Pending" && (
                      <button
                        onClick={() =>
                          changeStatus(b.booking_id, "Confirmed")
                        }
                        className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"
                      >
                        <CheckCircle size={18} />
                      </button>
                    )}

                    {/* CONFIRMED → ACTIVE */}
                    {b.booking_status === "Confirmed" && (
                      <button
                        onClick={() => changeStatus(b.booking_id, "Active")}
                        className="px-3 py-2 bg-[#027480] text-white rounded-lg hover:bg-[#025a63] text-xs font-bold"
                      >
                        Start Trip
                      </button>
                    )}

                    {/* ACTIVE → COMPLETED (modal) */}
                    {b.booking_status === "Active" && (
                      <button
                        onClick={() => openModal(b)}
                        className="px-3 py-2 bg-[#F57251] text-white rounded-lg hover:bg-[#e06241] text-xs font-bold"
                      >
                        Return Vehicle
                      </button>
                    )}

                    {/* CANCEL */}
                    {!["Completed", "Active", "Cancelled"].includes(
                      b.booking_status
                    ) && (
                      <button
                        onClick={() => {
                          if (window.confirm("Cancel this booking?"))
                            changeStatus(b.booking_id, "Cancelled");
                        }}
                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                      >
                        <XCircle size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!filtered?.length && (
          <div className="p-8 text-center text-gray-500">
            No bookings found.
          </div>
        )}
      </div>

      {/* ------------------ */}
      {/* Completion Modal */}
      {/* ------------------ */}
      {modalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Complete Rental</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setModalOpen(false)}
              >
                <XCircle size={22} />
              </button>
            </div>

            <div className="flex gap-2 bg-blue-50 p-3 rounded text-blue-800 text-sm mb-4">
              <AlertTriangle size={16} />
              Expected return date:{" "}
              <strong>
                {new Date(selectedBooking.return_date).toLocaleDateString()}
              </strong>
            </div>

            <form onSubmit={submitCompletion} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Actual Return Date</label>
                <input
                  type="date"
                  value={completionForm.return_date}
                  onChange={(e) =>
                    setCompletionForm({
                      ...completionForm,
                      return_date: e.target.value,
                    })
                  }
                  className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#027480]"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Final Mileage</label>
                <input
                  type="number"
                  placeholder="e.g. 45000"
                  value={completionForm.end_mileage}
                  onChange={(e) =>
                    setCompletionForm({
                      ...completionForm,
                      end_mileage: parseInt(e.target.value),
                    })
                  }
                  className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#027480]"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#027480] text-white rounded-lg hover:bg-[#025a63]"
                >
                  Confirm Return
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsManagement;
