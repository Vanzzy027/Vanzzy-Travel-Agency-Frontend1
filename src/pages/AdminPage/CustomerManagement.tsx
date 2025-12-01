import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  UserCheck, 
  UserX, 
  ShieldAlert, 
  Trash2, 
  RefreshCcw,
  Mail,
  Phone
} from 'lucide-react';
import { useGetAllUsersQuery, useUpdateUserMutation } from '../../features/api/UserApi'; // Assuming this exists
import { toast } from 'sonner';

// Define the User interface based on your SQL Schema
interface User {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  contact_phone: string;
  role: 'user' | 'admin' | 'superAdmin';
  status: 'active' | 'inactive' | 'banned';
  verified: boolean;
  national_id: string;
  photo?: string;
}

const CustomerManagement: React.FC = () => {
  // 1. Fetch Users
  const { data: users, isLoading, error } = useGetAllUsersQuery();
  const [updateUser] = useUpdateUserMutation();

  // 2. Local State for Filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'banned'>('all');

  // 3. Handle Status Changes (Delete/Retrieve/Ban)
  const handleStatusChange = async (id: string, newStatus: User['status']) => {
    try {
      await updateUser({ id, updates: { status: newStatus } }).unwrap();
      
      const actionMap: Record<User['status'], string> = {
        active: 'User reactivated successfully',
        inactive: 'User deactivated (Soft Deleted)',
        banned: 'User has been banned'
      };
      
      toast.success(actionMap[newStatus]);
    } catch (err) {
      toast.error('Failed to update user status');
    }
  };

  // 4. Filtering Logic
  const filteredUsers = users?.filter((user: User) => {
    const matchesSearch = 
      user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.national_id?.includes(searchTerm);

    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  if (isLoading) return <div className="p-8 text-[#001524] animate-pulse">Loading Customers...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#001524]">Customer Management</h1>
          <p className="text-gray-500">View, manage, and verify customer accounts.</p>
        </div>
        
        <div className="bg-[#E9E6DD] px-4 py-2 rounded-lg border border-[#D6CC99] text-[#001524] font-semibold">
          Total Users: {users?.length || 0}
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 justify-between">
        
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text"
            placeholder="Search by name, email, or National ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#027480]"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-lg">
          {['all', 'active', 'inactive', 'banned'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status as any)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-all ${
                filterStatus === status 
                  ? 'bg-white text-[#027480] shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#001524] text-[#E9E6DD] text-sm uppercase tracking-wider">
              <tr>
                <th className="p-4">Customer</th>
                <th className="p-4">Contact Info</th>
                <th className="p-4">Status</th>
                <th className="p-4">Verification</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers?.map((user: User) => (
                <tr key={user.user_id} className="hover:bg-gray-50 transition-colors">
                  
                  {/* Customer Column */}
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-[#027480]/10 flex items-center justify-center text-[#027480] font-bold">
                         {/* Fallback to initials if no photo */}
                         {user.photo ? (
                           <img src={user.photo} alt="" className="w-full h-full rounded-full object-cover" />
                         ) : (
                           user.first_name[0]
                         )}
                      </div>
                      <div>
                        <div className="font-semibold text-[#001524]">
                          {user.first_name} {user.last_name}
                        </div>
                        <div className="text-xs text-gray-500">ID: {user.national_id || 'N/A'}</div>
                      </div>
                    </div>
                  </td>

                  {/* Contact Info */}
                  <td className="p-4">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail size={14} className="mr-2" /> {user.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone size={14} className="mr-2" /> {user.contact_phone}
                      </div>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.status === 'active' ? 'bg-green-100 text-green-800' :
                      user.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {user.status === 'active' && <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>}
                      {user.status}
                    </span>
                  </td>

                  {/* Verification Status */}
                  <td className="p-4">
                     {user.verified ? (
                       <span className="flex items-center text-[#027480] text-sm font-semibold">
                         <ShieldAlert size={16} className="mr-1" /> Verified
                       </span>
                     ) : (
                       <span className="text-orange-500 text-sm flex items-center">
                         Pending
                       </span>
                     )}
                  </td>

                  {/* Actions Dropdown / Buttons */}
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      {/* ACTION: Retrieve / Reactivate */}
                      {user.status !== 'active' && (
                        <button 
                          onClick={() => handleStatusChange(user.user_id, 'active')}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg tooltip"
                          title="Reactivate User"
                        >
                          <RefreshCcw size={18} />
                        </button>
                      )}

                      {/* ACTION: Soft Delete (Deactivate) */}
                      {user.status === 'active' && (
                        <button 
                          onClick={() => handleStatusChange(user.user_id, 'inactive')}
                          className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                          title="Deactivate (Soft Delete)"
                        >
                          <UserX size={18} />
                        </button>
                      )}

                      {/* ACTION: Ban User */}
                      {user.status !== 'banned' && (
                        <button 
                          onClick={() => handleStatusChange(user.user_id, 'banned')}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                          title="Ban User"
                        >
                          <ShieldAlert size={18} />
                        </button>
                      )}
                    </div>
                  </td>

                </tr>
              ))}

              {filteredUsers?.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    No customers found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomerManagement;