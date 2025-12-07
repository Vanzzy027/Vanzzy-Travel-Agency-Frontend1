// src/components/dashboard/UserReceipts.tsx
import React from 'react';
import { useGetUserReceiptsQuery } from '../../features/api/paymentApi';
import { Receipt, Download, Eye, Calendar, CreditCard, Car } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const UserReceipts: React.FC = () => {
  const { data: receiptsResponse, isLoading, error } = useGetUserReceiptsQuery();
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

  if (receipts.length === 0) {
    return (
      <div className="text-center py-8">
        <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-white mb-2">No Receipts Yet</h3>
        <p className="text-[#C4AD9D]">Your payment receipts will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white mb-4">Payment Receipts</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {receipts.map((receipt) => (
          <div 
            key={receipt.payment_id} 
            className="bg-[#001524] border border-[#445048] rounded-xl p-4 hover:border-[#027480] transition-all duration-300 hover:shadow-lg hover:shadow-[#027480]/10"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <CreditCard className="h-4 w-4 text-green-400" />
                  <span className="text-sm font-medium text-white">
                    {receipt.payment_method}
                  </span>
                </div>
                <h3 className="font-bold text-white">Receipt #{receipt.payment_id}</h3>
                <p className="text-xs text-gray-400">Transaction: {receipt.transaction_id}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                receipt.amount > 0 
                  ? 'bg-green-900/30 text-green-300 border border-green-800/50' 
                  : 'bg-red-900/30 text-red-300 border border-red-800/50'
              }`}>
                KES {receipt.amount.toLocaleString()}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2">
                <Car className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-[#C4AD9D]">
                  {receipt.vehicle_make} {receipt.vehicle_model}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-[#C4AD9D]">
                  {format(new Date(receipt.payment_date), 'MMM dd, yyyy')}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/receipt/${receipt.payment_id}`)}
                className="flex-1 bg-[#027480] hover:bg-[#02606d] text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <Eye className="h-4 w-4" />
                View
              </button>
              <button
                onClick={() => window.open(`/api/payments/${receipt.payment_id}/receipt?download=true`, '_blank')}
                className="flex-1 border border-[#445048] text-[#C4AD9D] hover:text-white hover:border-gray-500 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="h-4 w-4" />
                PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserReceipts;