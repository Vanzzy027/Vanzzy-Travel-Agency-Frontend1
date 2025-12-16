import React from 'react';
import { useGetAllReviewsQuery, useUpdateReviewStatusMutation } from '../../features/api/ReviewApi';
import { toast } from 'sonner';

const AdminReviewsPage = () => {
  const { data: reviews, isLoading } = useGetAllReviewsQuery();
  const [updateReview] = useUpdateReviewStatusMutation();

  const handleAction = async (id: number, status: string, isFeatured: boolean) => {
    try {
      await updateReview({ id, status, is_featured: isFeatured }).unwrap();
      toast.success(`Review marked as ${status}`);
    } catch { toast.error("Failed to update"); }
  };

  if (isLoading) return <div className="p-10 text-[#027480]">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#001524] p-6 text-[#E9E6DD]">
      <h1 className="text-3xl font-bold mb-6">Review Moderation</h1>
      
      <div className="bg-[#0f2434] rounded-xl border border-[#445048] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#001524] text-[#C4AD9D] text-xs uppercase">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Vehicle</th>
              <th className="p-4">Rating</th>
              <th className="p-4 w-1/3">Comment</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#445048]/50 text-sm">
            {reviews?.map(r => (
              <tr key={r.review_id} className="hover:bg-[#152e40]">
                <td className="p-4 font-bold">{r.full_name}</td>
                <td className="p-4">{r.manufacturer} {r.model}</td>
                <td className="p-4 text-yellow-400">{'★'.repeat(r.rating)}</td>
                <td className="p-4 text-[#C4AD9D]">{r.comment}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    r.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' :
                    r.status === 'Approved' ? 'bg-green-500/20 text-green-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>{r.status}</span>
                  {r.is_featured && <span className="ml-2 text-xs bg-[#027480] text-white px-2 py-1 rounded">Featured</span>}
                </td>
                <td className="p-4 flex gap-2">
                  {r.status === 'Pending' && (
                    <>
                      <button onClick={() => handleAction(r.review_id, 'Approved', false)} className="text-green-400 hover:text-green-300 border border-green-500/50 px-3 py-1 rounded">Approve</button>
                      <button onClick={() => handleAction(r.review_id, 'Rejected', false)} className="text-red-400 hover:text-red-300 border border-red-500/50 px-3 py-1 rounded">Reject</button>
                    </>
                  )}
                  {r.status === 'Approved' && (
                    <button 
                      onClick={() => handleAction(r.review_id, 'Approved', !r.is_featured)} 
                      className={`px-3 py-1 rounded border ${r.is_featured ? 'border-yellow-500 text-yellow-400' : 'border-gray-500 text-gray-400'}`}
                    >
                      {r.is_featured ? 'Un-Feature' : 'Feature'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminReviewsPage;