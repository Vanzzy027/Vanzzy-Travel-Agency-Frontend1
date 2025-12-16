import React, { useState } from 'react';
import { useGetUserReceiptsQuery } from '../../features/api/paymentApi';
import { 
  CreditCard, 
  Download, 
  Eye, 
  Filter, 
  Search, 
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Smartphone,
  Receipt,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface UserPayment {
  payment_id: number;
  payment_date: string;
  payment_method: string;
  amount: number;
  gross_amount: number;
  commission_fee: number;
  net_amount: number;
  payment_status: string;
  transaction_id: string;
  transaction_reference: string;
  phone: string;
  booking_id: number;
  booking_date: string;
  vehicle_make: string;
  vehicle_model: string;
  first_name: string;
  last_name: string;
}

const UserPaymentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMethod, setFilterMethod] = useState('all');

  // Fetch user payments
  const { data: paymentsResponse, isLoading, error, refetch } = useGetUserReceiptsQuery();
  
const payments = (paymentsResponse?.data as unknown as UserPayment[]) || [];

  // Filter payments based on search and filters
  const filteredPayments = payments.filter(payment => {
    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        payment.transaction_id.toLowerCase().includes(term) ||
        payment.transaction_reference.toLowerCase().includes(term) ||
        payment.vehicle_make.toLowerCase().includes(term) ||
        payment.vehicle_model.toLowerCase().includes(term) ||
        payment.phone.toLowerCase().includes(term)
      );
    }
    return true;
  }).filter(payment => {
    // Status filter
    if (filterStatus !== 'all') {
      return payment.payment_status === filterStatus;
    }
    return true;
  }).filter(payment => {
    // Method filter
    if (filterMethod !== 'all') {
      return payment.payment_method === filterMethod;
    }
    return true;
  });

  // Calculate stats
  const calculateStats = () => {
    const totalSpent = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const completed = payments.filter(p => p.payment_status === 'Completed').length;
    const pending = payments.filter(p => p.payment_status === 'Pending').length;
    const failed = payments.filter(p => p.payment_status === 'Failed').length;
    const mpesa = payments.filter(p => p.payment_method === 'M-Pesa').length;
    const card = payments.filter(p => p.payment_method === 'Card').length;

    return { totalSpent, completed, pending, failed, mpesa, card };
  };

  const stats = calculateStats();

  // Handle receipt download
  const handleDownloadReceipt = async (paymentId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/payments/${paymentId}/receipt?download=true`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Create blob and download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `receipt-${paymentId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast.success('Receipt downloaded successfully!');
      } else {
        toast.error('Failed to download receipt');
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Error downloading receipt');
    }
  };

  // Handle view receipt (in modal or new page)
  const handleViewReceipt = (paymentId: number) => {
    window.open(`/receipt/${paymentId}`, '_blank');
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Get status icon and color
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'Completed':
        return { 
          icon: <CheckCircle size={16} />, 
          color: 'text-green-400', 
          bgColor: 'bg-green-900/30',
          borderColor: 'border-green-800/50'
        };
      case 'Pending':
        return { 
          icon: <Clock size={16} />, 
          color: 'text-yellow-400', 
          bgColor: 'bg-yellow-900/30',
          borderColor: 'border-yellow-800/50'
        };
      case 'Failed':
        return { 
          icon: <XCircle size={16} />, 
          color: 'text-red-400', 
          bgColor: 'bg-red-900/30',
          borderColor: 'border-red-800/50'
        };
      default:
        return { 
          icon: <Clock size={16} />, 
          color: 'text-gray-400', 
          bgColor: 'bg-gray-900/30',
          borderColor: 'border-gray-800/50'
        };
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#001524] p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-[#027480] animate-spin mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white">Loading your payments...</h3>
          <p className="text-[#C4AD9D]">Please wait while we fetch your payment history</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#001524] p-6 flex items-center justify-center">
        <div className="bg-red-900/20 border border-red-800/30 rounded-2xl p-8 max-w-md text-center">
          <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">Failed to Load Payments</h3>
          <p className="text-[#C4AD9D] mb-6">
            We couldn't load your payment history. Please try again.
          </p>
          <button
            onClick={() => refetch()}
            className="bg-[#F57251] hover:bg-[#d65f41] text-white px-6 py-3 rounded-xl font-bold transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#001524] p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <CreditCard size={32} className="text-[#027480]" />
              My Payments
            </h1>
            <p className="text-[#C4AD9D] mt-2">View your payment history and download receipts</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-[#C4AD9D]">Total Spent</p>
              <p className="text-2xl font-bold text-[#027480]">{formatCurrency(stats.totalSpent)}</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-[#0f2434] to-[#1a3247] border border-[#027480]/30 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#C4AD9D]">Completed</p>
                <p className="text-2xl font-bold text-green-400">{stats.completed}</p>
              </div>
              <CheckCircle className="h-10 w-10 text-green-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#0f2434] to-[#1a3247] border border-[#F57251]/30 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#C4AD9D]">Pending</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
              </div>
              <Clock className="h-10 w-10 text-yellow-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#0f2434] to-[#1a3247] border border-red-800/30 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#C4AD9D]">Failed</p>
                <p className="text-2xl font-bold text-red-400">{stats.failed}</p>
              </div>
              <XCircle className="h-10 w-10 text-red-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#0f2434] to-[#1a3247] border border-[#445048] rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#C4AD9D]">Total Payments</p>
                <p className="text-2xl font-bold text-white">{payments.length}</p>
              </div>
              <Receipt className="h-10 w-10 text-[#027480]" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#C4AD9D]" />
            <input
              type="text"
              placeholder="Search by transaction ID, vehicle, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0f2434] border border-[#445048] rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#027480] focus:ring-2 focus:ring-[#027480]/50"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-[#C4AD9D]" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-[#0f2434] border border-[#445048] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#027480] min-w-[140px]"
              >
                <option value="all">All Status</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
              </select>
            </div>

            <select
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value)}
              className="bg-[#0f2434] border border-[#445048] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#027480] min-w-[140px]"
            >
              <option value="all">All Methods</option>
              <option value="M-Pesa">M-Pesa</option>
              <option value="Card">Card</option>
            </select>
          </div>
        </div>

        {/* Payment Methods Summary */}
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-green-900/20 rounded-lg border border-green-800/30">
            <Smartphone size={16} className="text-green-400" />
            <span className="text-white text-sm">M-Pesa: {stats.mpesa} payments</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-900/20 rounded-lg border border-blue-800/30">
            <CreditCard size={16} className="text-blue-400" />
            <span className="text-white text-sm">Card: {stats.card} payments</span>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-[#0f2434] border border-[#445048] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#001524]">
              <tr>
                <th className="py-4 px-6 text-left text-sm font-semibold text-[#C4AD9D]">Transaction</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-[#C4AD9D]">Vehicle</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-[#C4AD9D]">Amount</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-[#C4AD9D]">Status</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-[#C4AD9D]">Method</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-[#C4AD9D]">Date</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-[#C4AD9D]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#445048]">
              {filteredPayments.map((payment) => {
                const statusInfo = getStatusInfo(payment.payment_status);
                
                return (
                  <tr 
                    key={payment.payment_id} 
                    className="hover:bg-[#152e40]/50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="font-mono text-sm font-bold text-white">
                          {payment.transaction_id}
                        </div>
                        <div className="text-xs text-[#C4AD9D]">
                          Ref: {payment.transaction_reference}
                        </div>
                        <div className="text-xs text-[#445048]">
                          Booking #{payment.booking_id}
                        </div>
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-medium text-white">
                          {payment.vehicle_make} {payment.vehicle_model}
                        </div>
                        <div className="text-xs text-[#C4AD9D]">
                          {format(new Date(payment.booking_date), 'MMM dd, yyyy')}
                        </div>
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="text-lg font-bold text-white">
                          {formatCurrency(payment.amount)}
                        </div>
                        <div className="text-xs text-[#C4AD9D]">
                          Net: {formatCurrency(payment.net_amount)}
                        </div>
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.bgColor} ${statusInfo.borderColor}`}>
                        {statusInfo.icon}
                        <span className={statusInfo.color}>
                          {payment.payment_status}
                        </span>
                      </div>
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
                      {payment.phone && (
                        <div className="text-xs text-[#445048] mt-1">
                          {payment.phone}
                        </div>
                      )}
                    </td>
                    
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-[#C4AD9D]" />
                        <span className="text-sm text-gray-300">
                          {format(new Date(payment.payment_date), 'MMM dd, yyyy')}
                        </span>
                      </div>
                      <div className="text-xs text-[#445048] ml-6">
                        {format(new Date(payment.payment_date), 'hh:mm a')}
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewReceipt(payment.payment_id)}
                          className="p-2 bg-[#027480] hover:bg-[#02606d] rounded-lg transition-colors"
                          title="View Receipt"
                        >
                          <Eye className="h-4 w-4 text-white" />
                        </button>
                        <button
                          onClick={() => handleDownloadReceipt(payment.payment_id)}
                          className="p-2 border border-[#445048] text-gray-400 hover:text-white hover:border-gray-500 rounded-lg transition-colors"
                          title="Download Receipt"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredPayments.length === 0 && (
          <div className="text-center py-12">
            <CreditCard className="h-16 w-16 text-[#445048] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">
              {payments.length === 0 ? 'No payments yet' : 'No matching payments found'}
            </h3>
            <p className="text-[#C4AD9D]">
              {payments.length === 0 
                ? 'You haven\'t made any payments yet. Book a vehicle to get started!'
                : 'Try adjusting your search or filters'
              }
            </p>
          </div>
        )}
      </div>

      {/* Summary Footer */}
      <div className="mt-6 bg-[#00101f] border border-[#445048] rounded-2xl p-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="text-lg font-bold text-white">Payment Summary</h3>
            <p className="text-[#C4AD9D] text-sm">
              Showing {filteredPayments.length} of {payments.length} payments
            </p>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-white">
              {formatCurrency(filteredPayments.reduce((sum, p) => sum + p.amount, 0))}
            </div>
            <div className="text-sm text-[#C4AD9D]">Total filtered amount</div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-green-400">
                {formatCurrency(payments.filter(p => p.payment_status === 'Completed').reduce((sum, p) => sum + p.amount, 0))}
              </div>
              <div className="text-xs text-[#C4AD9D]">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-400">
                {formatCurrency(payments.filter(p => p.payment_status === 'Pending').reduce((sum, p) => sum + p.amount, 0))}
              </div>
              <div className="text-xs text-[#C4AD9D]">Pending</div>
            </div>
          </div>
        </div>
      </div>

      {/* Help Text */}
      <div className="mt-6 p-4 bg-[#027480]/10 rounded-xl border border-[#027480]/20">
        <div className="flex items-start gap-3">
          <InfoIcon className="h-5 w-5 text-[#027480] mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-white mb-1">About Your Payments</h4>
            <ul className="text-sm text-[#C4AD9D] space-y-1 list-disc list-inside">
              <li>Receipts can be downloaded as PDF files</li>
              <li>Payments may take up to 24 hours to reflect as "Completed"</li>
              <li>Contact support if you have any issues with your payments</li>
              <li>Keep your transaction IDs for reference</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Info Icon component
const InfoIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

export default UserPaymentsPage;