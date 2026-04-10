// src/pages/AdminPage/AdminPayments.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// 1. Import the hook from your API slice
import { useGetAllReceiptsQuery } from "../../features/api/paymentApi";
import {
  CreditCard,
  DollarSign,
  Search,
  Download,
  Eye,
  TrendingUp,
  Shield,
} from "lucide-react";
import { format } from "date-fns";

const AdminPayments: React.FC = () => {
  const navigate = useNavigate();

  // 2. REPLACE manual fetch/states with RTK Query
  const {
    data: receiptsResponse,
    isLoading,
    error: apiError,
  } = useGetAllReceiptsQuery();

  // Local states for filtering only
  const [filteredPayments, setFilteredPayments] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterMethod, setFilterMethod] = useState("all");

  // 3. Extract payments from response
  const payments = receiptsResponse?.data || [];

  // 4. Update filtering effect to run when 'payments' changes
  useEffect(() => {
    let filtered = [...payments];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (payment) =>
          payment.transaction_id.toLowerCase().includes(term) ||
          `${payment.first_name || ""} ${payment.last_name || ""}`
            .toLowerCase()
            .includes(term) ||
          payment.email?.toLowerCase().includes(term) ||
          payment.phone.toLowerCase().includes(term),
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter(
        (payment) => payment.payment_status === filterStatus,
      );
    }

    if (filterMethod !== "all") {
      filtered = filtered.filter(
        (payment) => payment.payment_method === filterMethod,
      );
    }

    setFilteredPayments(filtered);
  }, [payments, searchTerm, filterStatus, filterMethod]);

  const calculateStats = () => {
    const total = payments.reduce(
      (sum: number, payment: any) => sum + payment.amount,
      0,
    );
    const completed = payments.filter(
      (p: any) => p.payment_status === "Completed",
    ).length;
    const pending = payments.filter(
      (p: any) => p.payment_status === "Pending",
    ).length;
    const failed = payments.filter(
      (p: any) => p.payment_status === "Failed",
    ).length;
    const mpesa = payments.filter(
      (p: any) => p.payment_method === "M-Pesa",
    ).length;
    const card = payments.filter(
      (p: any) => p.payment_method === "Card",
    ).length;

    return { total, completed, pending, failed, mpesa, card };
  };

  const stats = calculateStats();

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#027480]"></div>
      </div>
    );
  }

  if (apiError) {
    return (
      <div className="bg-red-900/20 border border-red-800/30 rounded-xl p-6 text-center">
        <Shield className="h-12 w-12 text-red-400 mx-auto mb-3" />
        <h3 className="text-xl font-bold text-white mb-2">
          Failed to Load Payments
        </h3>
        <p className="text-gray-400 mb-4">
          {(apiError as any)?.data?.message || "Error fetching data"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-black flex items-center gap-2">
            <CreditCard className="h-8 w-8" />
            Payment Management
          </h1>
          <p className="text-gray-600">
            Manage and track all payment transactions
          </p>
        </div>
        <div className="text-sm text-gray-600">
          Total: {payments.length} payments • Revenue: KES{" "}
          {stats.total.toLocaleString()}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-gray-300/30 to-red-600/10 border border-blue-800/30 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-300">Total Revenue</p>
              <p className="text-2xl font-bold text-white">
                KES {stats.total.toLocaleString()}
              </p>
            </div>
            <DollarSign className="h-10 w-10 text-blue-400" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-900/30 to-green-800/10 border border-green-800/30 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-300">Completed</p>
              <p className="text-2xl font-bold text-white">{stats.completed}</p>
            </div>
            <TrendingUp className="h-10 w-10 text-green-400" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-900/30 to-orange-800/10 border border-orange-800/30 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-300">Pending</p>
              <p className="text-2xl font-bold text-white">{stats.pending}</p>
            </div>
            <CreditCard className="h-10 w-10 text-orange-400" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-900/30 to-red-800/10 border border-red-800/30 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-300">Failed</p>
              <p className="text-2xl font-bold text-white">{stats.failed}</p>
            </div>
            <Shield className="h-10 w-10 text-red-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0f2434] border border-[#445048] rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#027480]"
          />
        </div>
        <div className="flex gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[#0f2434] border border-[#445048] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#027480]"
          >
            <option value="all">All Status</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#001524] border border-[#445048] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0f2434]">
              <tr>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-300">
                  Transaction
                </th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-300">
                  Customer
                </th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-300">
                  Amount
                </th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-300">
                  Status
                </th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-300">
                  Date
                </th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#445048]">
              {filteredPayments.map((payment) => (
                <tr key={payment.payment_id} className="hover:bg-[#0f2434]/50">
                  <td className="py-4 px-6 text-white font-mono text-sm">
                    {payment.transaction_id}
                  </td>
                  <td className="py-4 px-6 text-white">
                    {payment.first_name} {payment.last_name}
                  </td>
                  <td className="py-4 px-6 text-white font-bold">
                    KES {payment.amount.toLocaleString()}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${payment.payment_status === "Completed" ? "bg-green-900/30 text-green-300" : "bg-yellow-900/30 text-yellow-300"}`}
                    >
                      {payment.payment_status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-300 text-sm">
                    {format(new Date(payment.payment_date), "MMM dd, yyyy")}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          navigate(`/receipt/${payment.payment_id}`)
                        }
                        className="p-2 bg-[#027480] hover:bg-[#02606d] rounded-lg transition-colors"
                        title="View Receipt"
                      >
                        <Eye className="h-4 w-4 text-white" />
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/receipt/${payment.payment_id}`)
                        }
                        className="p-2 border border-[#445048] text-gray-400 hover:text-white rounded-lg transition-colors"
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPayments;
