// src/pages/AdminPage/AdminPayments.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  DollarSign, 
  Filter, 
  Search, 
  Download, 
  Eye,
  Calendar,
  User,
  TrendingUp,
  Shield
} from 'lucide-react';
import { format } from 'date-fns';

interface Payment {
  payment_id: number;
  booking_id: number;
  user_id: string;
  amount: number;
  gross_amount: number;
  commission_fee: number;
  net_amount: number;
  payment_status: string;
  payment_method: string;
  transaction_id: string;
  transaction_reference: string;
  phone: string;
  payment_date: string;
  created_at: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  booking_date?: string;
  return_date?: string;
  vehicle_make?: string;
  vehicle_model?: string;
}

const AdminPayments: React.FC = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMethod, setFilterMethod] = useState('all');

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    filterPayments();
  }, [payments, searchTerm, filterStatus, filterMethod]);

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/payments/all-receipts', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.success) {
        setPayments(data.data);
      } else {
        setError(data.message || 'Failed to load payments');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load payments');
      console.error('Error fetching payments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filterPayments = () => {
    let filtered = [...payments];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(payment =>
        payment.transaction_id.toLowerCase().includes(term) ||
        payment.transaction_reference.toLowerCase().includes(term) ||
        `${payment.first_name || ''} ${payment.last_name || ''}`.toLowerCase().includes(term) ||
        payment.email?.toLowerCase().includes(term) ||
        payment.phone.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(payment => payment.payment_status === filterStatus);
    }

    // Method filter
    if (filterMethod !== 'all') {
      filtered = filtered.filter(payment => payment.payment_method === filterMethod);
    }

    setFilteredPayments(filtered);
  };

  const calculateStats = () => {
    const total = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const completed = payments.filter(p => p.payment_status === 'Completed').length;
    const pending = payments.filter(p => p.payment_status === 'Pending').length;
    const failed = payments.filter(p => p.payment_status === 'Failed').length;
    const mpesa = payments.filter(p => p.payment_method === 'M-Pesa').length;
    const card = payments.filter(p => p.payment_method === 'Card').length;

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

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-800/30 rounded-xl p-6 text-center">
        <Shield className="h-12 w-12 text-red-400 mx-auto mb-3" />
        <h3 className="text-xl font-bold text-white mb-2">Failed to Load Payments</h3>
        <p className="text-gray-400 mb-4">{error}</p>
        <button
          onClick={fetchPayments}
          className="px-6 py-2 bg-[#027480] text-white rounded-lg hover:bg-[#02606d] transition-colors"
        >
          Retry
        </button>
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
          <p className="text-gray-600">Manage and track all payment transactions</p>
        </div>
        <div className="text-sm text-gray-600">
          Total: {payments.length} payments • Revenue: KES {stats.total.toLocaleString()}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-gray-300/30 to-red-600/10 border border-blue-800/30 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-300">Total Revenue</p>
              <p className="text-2xl font-bold text-white">KES {stats.total.toLocaleString()}</p>
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

      {/* Payment Method Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#001524] border border-[#445048] rounded-xl p-5">
          <h3 className="text-lg font-bold text-white mb-3">Payment Methods</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <span className="text-gray-300">M-Pesa</span>
              </div>
              <span className="font-bold text-white">{stats.mpesa} payments</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                <span className="text-gray-300">Card</span>
              </div>
              <span className="font-bold text-white">{stats.card} payments</span>
            </div>
          </div>
        </div>

        <div className="bg-[#001524] border border-[#445048] rounded-xl p-5">
          <h3 className="text-lg font-bold text-white mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-3 bg-[#027480] hover:bg-[#02606d] text-white rounded-lg transition-colors flex items-center justify-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </button>
            <button className="p-3 border border-[#445048] hover:border-gray-500 text-gray-300 hover:text-white rounded-lg transition-colors flex items-center justify-center gap-2">
              <Eye className="h-4 w-4" />
              Overview
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by transaction ID, customer, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0f2434] border border-[#445048] rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#027480] focus:ring-2 focus:ring-[#027480]/50"
          />
        </div>
        
        <div className="flex gap-3">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-[#0f2434] border border-[#445048] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#027480] min-w-[140px]"
            >
              <option value="all">All Status</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>

          <select
            value={filterMethod}
            onChange={(e) => setFilterMethod(e.target.value)}
            className="bg-[#0f2434] border border-[#445048] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#027480] min-w-[140px]"
          >
            <option value="all">All Methods</option>
            <option value="M-Pesa">M-Pesa</option>
            <option value="Card">Card</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-[#001524] border border-[#445048] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0f2434]">
              <tr>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-300">Transaction</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-300">Customer</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-300">Amount</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-300">Status</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-300">Method</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-300">Date</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#445048]">
              {filteredPayments.map((payment) => (
                <tr key={payment.payment_id} className="hover:bg-[#0f2434]/50">
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-mono text-sm font-bold text-white">
                        {payment.transaction_id}
                      </div>
                      <div className="text-xs text-gray-500">Ref: {payment.transaction_reference}</div>
                      <div className="text-xs text-gray-500">Booking #{payment.booking_id}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-[#D6CC99] flex items-center justify-center">
                        <span className="text-[#001524] text-xs font-bold">
                          {payment.first_name?.[0]}{payment.last_name?.[0]}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-white">
                          {payment.first_name} {payment.last_name}
                        </div>
                        <div className="text-xs text-gray-400">{payment.email}</div>
                        <div className="text-xs text-gray-500">{payment.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-lg font-bold text-white">
                      KES {payment.amount.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      Net: KES {payment.net_amount.toLocaleString()}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      payment.payment_status === 'Completed' 
                        ? 'bg-green-900/30 text-green-300 border border-green-800/50' 
                        : payment.payment_status === 'Pending'
                        ? 'bg-yellow-900/30 text-yellow-300 border border-yellow-800/50'
                        : 'bg-red-900/30 text-red-300 border border-red-800/50'
                    }`}>
                      {payment.payment_status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        payment.payment_method === 'M-Pesa' 
                          ? 'bg-green-900/30 text-green-300' 
                          : 'bg-blue-900/30 text-blue-300'
                      }`}>
                        {payment.payment_method === 'M-Pesa' ? 'M' : '💳'}
                      </div>
                      <span className="text-sm text-gray-300">{payment.payment_method}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-300">
                        {format(new Date(payment.payment_date), 'MMM dd, yyyy')}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {format(new Date(payment.payment_date), 'hh:mm a')}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/receipt/${payment.payment_id}`)}
                        className="p-2 bg-[#027480] hover:bg-[#02606d] rounded-lg transition-colors"
                        title="View Receipt"
                      >
                        <Eye className="h-4 w-4 text-white" />
                      </button>
                      <button
                        onClick={() => window.open(`/api/payments/${payment.payment_id}/receipt?download=true`, '_blank')}
                        className="p-2 border border-[#445048] text-gray-400 hover:text-white hover:border-gray-500 rounded-lg transition-colors"
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

        {filteredPayments.length === 0 && (
          <div className="text-center py-12">
            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-400">No payments found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="bg-[#00101f] border border-[#445048] rounded-xl p-5">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-white">Summary</h3>
            <p className="text-gray-400 text-sm">Showing {filteredPayments.length} of {payments.length} payments</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">
              KES {filteredPayments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">Total filtered amount</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPayments;