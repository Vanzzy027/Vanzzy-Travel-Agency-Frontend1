// src/components/admin/AdminReceipts.tsx
import React, { useState } from 'react';
import { useGetAllReceiptsQuery } from '../../features/api/paymentApi';
import { Receipt, Search, Filter, Download, Eye, User, Calendar, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const AdminReceipts: React.FC = () => {
  const { data: receiptsResponse, isLoading, error } = useGetAllReceiptsQuery();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMethod, setFilterMethod] = useState('all');
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#027480]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-800/30 rounded-lg p-4 text-center">
        <p className="text-red-300">Failed to load receipts</p>
      </div>
    );
  }

  const receipts = receiptsResponse?.data || [];

  // Filter receipts
  const filteredReceipts = receipts.filter(receipt => {
    const matchesSearch = 
      receipt.transaction_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${receipt.first_name} ${receipt.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.vehicle_make.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMethod = filterMethod === 'all' || receipt.payment_method === filterMethod;
    
    return matchesSearch && matchesMethod;
  });

  // Calculate statistics
  const totalRevenue = receipts.reduce((sum, receipt) => sum + receipt.amount, 0);
  const mpesaCount = receipts.filter(r => r.payment_method === 'M-Pesa').length;
  const cardCount = receipts.filter(r => r.payment_method === 'Card').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Payment Receipts</h2>
        <div className="text-sm text-gray-400">
          Total: {receipts.length} receipts • Revenue: KES {totalRevenue.toLocaleString()}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#001524] border border-[#445048] rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold text-white">KES {totalRevenue.toLocaleString()}</p>
            </div>
            <Receipt className="h-10 w-10 text-green-500" />
          </div>
        </div>
        
        <div className="bg-[#001524] border border-[#445048] rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">M-Pesa Payments</p>
              <p className="text-2xl font-bold text-white">{mpesaCount}</p>
            </div>
            <div className="h-10 w-10 bg-green-900/30 rounded-full flex items-center justify-center">
              <span className="text-green-400">M</span>
            </div>
          </div>
        </div>
        
        <div className="bg-[#001524] border border-[#445048] rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Card Payments</p>
              <p className="text-2xl font-bold text-white">{cardCount}</p>
            </div>
            <CreditCard className="h-10 w-10 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by transaction ID, customer, or vehicle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0f2434] border border-[#445048] rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-[#027480] focus:ring-2 focus:ring-[#027480]/50"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={filterMethod}
            onChange={(e) => setFilterMethod(e.target.value)}
            className="bg-[#0f2434] border border-[#445048] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#027480]"
          >
            <option value="all">All Methods</option>
            <option value="M-Pesa">M-Pesa</option>
            <option value="Card">Card</option>
          </select>
        </div>
      </div>

      {/* Receipts Table */}
      <div className="bg-[#001524] border border-[#445048] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0f2434]">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Transaction</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Customer</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Vehicle</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Method</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Amount</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Date</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#445048]">
              {filteredReceipts.map((receipt) => (
                <tr key={receipt.payment_id} className="hover:bg-[#0f2434]/50">
                  <td className="py-3 px-4">
                    <div className="font-mono text-sm text-gray-300">
                      {receipt.transaction_id}
                    </div>
                    <div className="text-xs text-gray-500">#{receipt.payment_id}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-white">
                          {receipt.first_name} {receipt.last_name}
                        </div>
                        <div className="text-xs text-gray-500">B#{receipt.booking_id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm text-white">
                      {receipt.vehicle_make} {receipt.vehicle_model}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      receipt.payment_method === 'M-Pesa' 
                        ? 'bg-green-900/30 text-green-300' 
                        : 'bg-blue-900/30 text-blue-300'
                    }`}>
                      {receipt.payment_method}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-lg font-bold text-white">
                      KES {receipt.amount.toLocaleString()}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-300">
                        {format(new Date(receipt.payment_date), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/receipt/${receipt.payment_id}`)}
                        className="p-2 bg-[#027480] hover:bg-[#02606d] rounded-lg transition-colors"
                        title="View Receipt"
                      >
                        <Eye className="h-4 w-4 text-white" />
                      </button>
                      <button
                        onClick={() => window.open(`/api/payments/${receipt.payment_id}/receipt?download=true`, '_blank')}
                        className="p-2 border border-[#445048] text-gray-400 hover:text-white hover:border-gray-500 rounded-lg transition-colors"
                        title="Download PDF"
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
        
        {filteredReceipts.length === 0 && (
          <div className="text-center py-12">
            <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-400">No receipts found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReceipts;