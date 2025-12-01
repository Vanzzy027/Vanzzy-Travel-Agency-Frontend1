import React, { useState } from 'react';
import { 
  useGetAllUsersQuery, useUpdateUserMutation, useDeleteUserMutation,} from '../../features/api/UserApi';
import type {User} from '../../types/types';
import { 
  Search, Filter, MoreVertical, Edit, Trash2, 
  User as UserIcon, Phone, Mail, Shield, CheckCircle, XCircle, AlertTriangle 
} from 'lucide-react';
import { toast } from 'sonner';

const CustomerManagement: React.FC = () => {
  // --- API HOOKS ---
  // We pass undefined/void to the query
  const { data: users, isLoading, error } = useGetAllUsersQuery();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  // --- STATE ---
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Modal State
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    contact_phone: '',
    role: 'user',
    status: 'active'
  });

  // --- HELPERS ---

  const getInitials = (first: string, last: string) => {
    return `${first?.charAt(0) || ''}${last?.charAt(0) || ''}`.toUpperCase();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // --- HANDLERS ---

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setFormData({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      contact_phone: user.contact_phone || '',
      role: user.role || 'user',
      status: user.status || 'active'
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      // We only send the fields that changed or are necessary
      await updateUser({
        id: selectedUser.user_id,
        updates: {
          first_name: formData.first_name,
          last_name: formData.last_name,
          contact_phone: formData.contact_phone,
          role: formData.role as 'user' | 'admin' | 'superAdmin',
          status: formData.status as 'active' | 'inactive' | 'banned'
        }
      }).unwrap();

      toast.success(`Profile for ${formData.first_name} updated successfully`);
      setIsEditModalOpen(false);
    } catch (err: any) {
      console.error(err);
      toast.error(err.data?.error || "Failed to update user");
    }
  };

  const handleDeleteClick = async (user: User) => {
    if (window.confirm(`Are you sure you want to PERMANENTLY delete ${user.first_name} ${user.last_name}? This action cannot be undone.`)) {
      try {
        await deleteUser(user.user_id).unwrap();
        toast.success("User deleted successfully");
      } catch (err: any) {
        toast.error(err.data?.error || "Failed to delete user");
      }
    }
  };

  const handleQuickStatusChange = async (user: User, newStatus: 'active' | 'banned') => {
    try {
      await updateUser({
        id: user.user_id,
        updates: { status: newStatus }
      }).unwrap();
      const action = newStatus === 'active' ? 'activated' : 'banned';
      toast.success(`User ${action} successfully`);
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  // --- FILTERING ---
  const filteredUsers = users?.filter(user => {
    const matchesSearch = 
      user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.national_id?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // --- RENDER HELPERS ---
  if (isLoading) return (
    <div className="flex h-96 items-center justify-center">
      <div className="w-12 h-12 border-4 border-[#027480] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong className="font-bold">Connection Error!</strong>
      <span className="block sm:inline"> Failed to load customers. Please check your connection.</span>
    </div>
  );

  return (
    <div className="space-y-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#001524]">Customer Management</h1>
          <p className="text-[#445048]">View, verify, and manage user accounts.</p>
        </div>
        
        {/* Quick Stats */}
        <div className="flex gap-3">
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
            <span className="text-xs text-gray-500 uppercase font-bold">Total Users</span>
            <div className="text-xl font-bold text-[#027480]">{users?.length || 0}</div>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
            <span className="text-xs text-gray-500 uppercase font-bold">Active</span>
            <div className="text-xl font-bold text-green-600">
              {users?.filter(u => u.status === 'active').length || 0}
            </div>
          </div>
        </div>
      </div>

      {/* TOOLBAR (Search & Filter) */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by Name, Email, or National ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#027480] focus:border-transparent transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <div className="relative">
            <Filter className="absolute left-3 top-3 text-gray-400" size={16} />
            <select 
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#027480] appearance-none bg-white cursor-pointer h-full"
            >
              <option value="All">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="superAdmin">Super Admin</option>
            </select>
          </div>

          <div className="relative">
            <Shield className="absolute left-3 top-3 text-gray-400" size={16} />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#027480] appearance-none bg-white cursor-pointer h-full"
            >
              <option value="All">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="banned">Banned</option>
            </select>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-lg border border-[#445048]/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#001524] text-[#E9E6DD]">
              <tr>
                <th className="p-4 font-semibold rounded-tl-xl">User Profile</th>
                <th className="p-4 font-semibold">Contact Info</th>
                <th className="p-4 font-semibold">Role</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Joined</th>
                <th className="p-4 font-semibold rounded-tr-xl text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers?.map((user) => (
                <tr key={user.user_id} className="hover:bg-gray-50 transition-colors group">
                  
                  {/* 1. Profile */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#027480] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                        {user.photo ? (
                           <img src={user.photo} alt="" className="w-full h-full rounded-full object-cover" />
                        ) : (
                           getInitials(user.first_name, user.last_name)
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-[#001524]">{user.first_name} {user.last_name}</div>
                        <div className="text-xs text-gray-500 font-mono">ID: {user.national_id}</div>
                      </div>
                    </div>
                  </td>

                  {/* 2. Contact */}
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Mail size={14} className="text-[#027480]" />
                        {user.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Phone size={14} className="text-[#F57251]" />
                        {user.contact_phone}
                      </div>
                    </div>
                  </td>

                  {/* 3. Role */}
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold border ${
                      user.role === 'superAdmin' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                      user.role === 'admin' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                      'bg-gray-100 text-gray-700 border-gray-200'
                    }`}>
                      {user.role === 'superAdmin' && <Shield size={12} />}
                      {user.role}
                    </span>
                  </td>

                  {/* 4. Status */}
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold border ${
                      user.status === 'active' ? 'bg-green-100 text-green-700 border-green-200' :
                      user.status === 'banned' ? 'bg-red-100 text-red-700 border-red-200' :
                      'bg-yellow-100 text-yellow-700 border-yellow-200'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${
                        user.status === 'active' ? 'bg-green-500' : 
                        user.status === 'banned' ? 'bg-red-500' : 'bg-yellow-500'
                      }`}></span>
                      {user.status}
                    </span>
                  </td>

                  {/* 5. Date */}
                  <td className="p-4 text-sm text-gray-500">
                    {formatDate(user.created_at)}
                  </td>

                  {/* 6. Actions */}
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      
                      {/* Edit */}
                      <button 
                        onClick={() => handleEditClick(user)} 
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit User"
                      >
                        <Edit size={16} />
                      </button>

                      {/* Quick Ban / Unban */}
                      {user.status !== 'banned' ? (
                        <button 
                          onClick={() => handleQuickStatusChange(user, 'banned')} 
                          className="p-2 text-orange-600 hover:bg-orange-50 rounded transition-colors"
                          title="Ban User"
                        >
                          <AlertTriangle size={16} />
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleQuickStatusChange(user, 'active')} 
                          className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                          title="Activate User"
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}

                      {/* Delete */}
                      <button 
                        onClick={() => handleDeleteClick(user)} 
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete Permanently"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers?.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <UserIcon size={48} className="text-gray-300" />
                      <p>No users found matching your filters.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- EDIT MODAL --- */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="bg-[#001524] p-6 flex justify-between items-center">
              <h3 className="text-xl font-bold text-[#E9E6DD]">Edit User Profile</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-white">&times;</button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">First Name</label>
                  <input 
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-[#027480] outline-none" 
                    value={formData.first_name} 
                    onChange={e => setFormData({...formData, first_name: e.target.value})} 
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Last Name</label>
                  <input 
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-[#027480] outline-none" 
                    value={formData.last_name} 
                    onChange={e => setFormData({...formData, last_name: e.target.value})} 
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Contact Phone</label>
                <input 
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-[#027480] outline-none" 
                  value={formData.contact_phone} 
                  onChange={e => setFormData({...formData, contact_phone: e.target.value})} 
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Role</label>
                  <select 
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-[#027480] outline-none bg-white"
                    value={formData.role}
                    onChange={e => setFormData({...formData, role: e.target.value})}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="superAdmin">Super Admin</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Status</label>
                  <select 
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-[#027480] outline-none bg-white"
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="banned">Banned</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t mt-4">
                <button 
                  type="button" 
                  onClick={() => setIsEditModalOpen(false)} 
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isUpdating}
                  className="flex-1 px-4 py-2 bg-[#027480] text-white rounded-lg hover:bg-[#025e69] font-bold disabled:opacity-50"
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CustomerManagement;