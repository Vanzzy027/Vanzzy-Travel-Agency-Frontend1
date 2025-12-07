// import React, { useState, useMemo } from 'react';
// import { 
//   useGetAllUsersQuery, 
//   useUpdateUserMutation, 
//   useDeleteUserMutation 
// } from '../../features/api/UserApi';
// import type { User } from '../../types/types';
// import { 
//   Search, Filter, Edit, Trash2, 
//   User as UserIcon, Phone, Mail, XCircle,
//   Eye, AlertCircle
// } from 'lucide-react';
// import { toast } from 'sonner';

// const CustomerManagement: React.FC = () => {
//   // --- 1. API HOOKS ---
//   const { data: users = [], isLoading, error } = useGetAllUsersQuery();
//   const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
//   const [deleteUser] = useDeleteUserMutation();

//   // --- 2. STATE ---
//   const [searchTerm, setSearchTerm] = useState('');
//   const [roleFilter, setRoleFilter] = useState<string>('All');
//   const [statusFilter, setStatusFilter] = useState<string>('All');
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

//   // Form State
//   const [formData, setFormData] = useState({
//     first_name: '',
//     last_name: '',
//     contact_phone: '',
//     role: 'user',
//     status: 'active'
//   });

//   // --- 3. HELPERS ---
//   const getInitials = (first: string, last: string) => 
//     `${first?.charAt(0) || ''}${last?.charAt(0) || ''}`.toUpperCase();

//   const formatDate = (dateString?: string) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric', month: 'short', day: 'numeric'
//     });
//   };

//   // --- 4. HANDLERS ---
//   const handleEditClick = (user: User) => {
//     console.log("Editing User:", user);
//     setSelectedUser(user);
//     setFormData({
//       first_name: user.first_name || '',
//       last_name: user.last_name || '',
//       contact_phone: user.contact_phone || '',
//       role: user.role || 'user',
//       status: user.status || 'active'
//     });
//     setIsEditModalOpen(true);
//   };

//   const handleViewClick = (user: User) => {
//     setSelectedUser(user);
//     setIsDetailsModalOpen(true);
//   };

//   const handleEditSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!selectedUser) return;

//     try {
//       await updateUser({
//         id: selectedUser.user_id,
//         updates: {
//             first_name: formData.first_name,
//             last_name: formData.last_name,
//             contact_phone: formData.contact_phone,
//             role: formData.role as 'user' | 'admin' | 'superAdmin',
//             status: formData.status as 'active' | 'inactive' | 'banned'
//         }
//       }).unwrap();

//       toast.success("User updated successfully");
//       setIsEditModalOpen(false);
//     } catch (err: any) {
//       console.error("Update failed:", err);
//       toast.error(err?.data?.error || "Failed to update user");
//     }
//   };

//   const handleDeleteClick = async (userId: string) => {
//     if (window.confirm("Are you sure you want to delete this user?")) {
//       try {
//         await deleteUser(userId).unwrap();
//         toast.success("User deleted successfully");
//       } catch (err: any) {
//         toast.error("Failed to delete user");
//       }
//     }
//   };

//   const handleQuickStatusChange = async (user: User, newStatus: 'active' | 'banned') => {
//     try {
//       await updateUser({
//         id: user.user_id,
//         updates: { status: newStatus }
//       }).unwrap();
//       toast.success(`User status updated to ${newStatus}`);
//     } catch (err) {
//       toast.error("Status update failed");
//     }
//   };

//   // --- 5. FILTERING ---
//   const filteredUsers = useMemo(() => {
//     if (!Array.isArray(users)) return [];
    
//     return users.filter(user => {
//       const matchesSearch = 
//         (user.first_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
//         (user.last_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
//         (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
//         (user.national_id?.toLowerCase() || '').includes(searchTerm.toLowerCase());

//       const matchesRole = roleFilter === 'All' || user.role === roleFilter;
//       const matchesStatus = statusFilter === 'All' || user.status === statusFilter;

//       return matchesSearch && matchesRole && matchesStatus;
//     });
//   }, [users, searchTerm, roleFilter, statusFilter]);

//   // --- 6. RENDERING ---
//   if (isLoading) return (
//     <div className="flex items-center justify-center min-h-screen">
//       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#027480]"></div>
//     </div>
//   );
  
//   if (error) {
//     return (
//       <div className="bg-red-50 border border-red-200 rounded-lg p-6">
//         <div className="flex items-center gap-3 text-red-700">
//           <AlertCircle className="w-6 h-6" />
//           <div>
//             <h3 className="font-semibold">Error loading data</h3>
//             <p className="text-sm">Please check your connection and try again.</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 md:p-6 space-y-6 bg-[#F8F9FA] min-h-screen">
      
//       {/* HEADER */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//         <div>
//           <h1 className="text-2xl md:text-3xl font-bold text-[#001524]">Customer Management</h1>
//           <p className="text-gray-600 mt-1">Total Users: <span className="font-semibold text-[#027480]">{users.length}</span></p>
//         </div>
//         <div className="flex items-center gap-2">
//           <span className="text-sm text-gray-600">Last updated: Today</span>
//         </div>
//       </div>

//       {/* SEARCH AND FILTERS */}
//       <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200">
//         <div className="flex flex-col md:flex-row gap-4">
//           {/* Search */}
//           <div className="relative flex-1">
//             <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
//             <input 
//               type="text" 
//               placeholder="Search by name, email, or ID..." 
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-12 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#027480] focus:border-transparent outline-none transition-all"
//             />
//           </div>
          
//           {/* Filters */}
//           <div className="flex flex-col sm:flex-row gap-3">
//             <div className="relative">
//               <Filter className="absolute left-3 top-3 text-gray-400" size={16} />
//               <select 
//                 value={roleFilter}
//                 onChange={(e) => setRoleFilter(e.target.value)}
//                 className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#027480] focus:border-transparent outline-none appearance-none bg-white"
//               >
//                 <option value="All">All Roles</option>
//                 <option value="user">User</option>
//                 <option value="admin">Admin</option>
//                 <option value="superAdmin">Super Admin</option>
//               </select>
//             </div>
            
//             <select 
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//               className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#027480] focus:border-transparent outline-none appearance-none bg-white"
//             >
//               <option value="All">All Status</option>
//               <option value="active">Active</option>
//               <option value="inactive">Inactive</option>
//               <option value="banned">Banned</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* USERS TABLE */}
//       <div className="bg-white rounded-xl shadow-lg border border-[#445048]/20 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-[#001524] text-[#E9E6DD]">
//               <tr>
//                 <th className="p-4 text-left font-semibold">User Profile</th>
//                 <th className="p-4 text-left font-semibold">Contact</th>
//                 <th className="p-4 text-left font-semibold">Role</th>
//                 <th className="p-4 text-left font-semibold">Status</th>
//                 <th className="p-4 text-left font-semibold">Joined</th>
//                 <th className="p-4 text-right font-semibold">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100">
//               {filteredUsers.length > 0 ? filteredUsers.map((user) => (
//                 <tr key={user.user_id} className="hover:bg-gray-50 transition-colors">
                  
//                   {/* Profile Column */}
//                   <td className="p-4">
//                     <div className="flex items-center gap-3">
//                       <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#027480] to-[#001524] text-white flex items-center justify-center font-bold shadow-md">
//                         {user.photo ? (
//                           <img src={user.photo} alt={`${user.first_name} ${user.last_name}`} className="w-12 h-12 rounded-full object-cover" />
//                         ) : (
//                           getInitials(user.first_name, user.last_name)
//                         )}
//                       </div>
//                       <div>
//                         <div className="font-semibold text-gray-900">{user.first_name} {user.last_name}</div>
//                         <div className="text-sm text-gray-500 truncate max-w-[200px]">{user.email}</div>
//                         {user.national_id && (
//                           <div className="text-xs text-gray-400 mt-1">ID: {user.national_id}</div>
//                         )}
//                       </div>
//                     </div>
//                   </td>

//                   {/* Contact Column */}
//                   <td className="p-4">
//                     <div className="space-y-1">
//                       <div className="flex items-center gap-2 text-sm text-gray-700">
//                         <Phone size={14} />
//                         <span>{user.contact_phone || 'Not provided'}</span>
//                       </div>
//                       <div className="flex items-center gap-2 text-sm text-gray-700">
//                         <Mail size={14} />
//                         <span className="truncate max-w-[180px]">{user.email}</span>
//                       </div>
//                     </div>
//                   </td>

//                   {/* Role Column */}
//                   <td className="p-4">
//                     <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
//                       user.role === 'admin' || user.role === 'superAdmin' 
//                         ? 'bg-[#027480]/10 text-[#027480]' 
//                         : 'bg-gray-100 text-gray-700'
//                     }`}>
//                       {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
//                     </span>
//                   </td>

//                   {/* Status Column */}
//                   <td className="p-4">
//                     <div className="flex flex-col gap-2">
//                       <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
//                         user.status === 'active' 
//                           ? 'bg-green-100 text-green-700' 
//                           : user.status === 'banned'
//                           ? 'bg-red-100 text-red-700'
//                           : 'bg-yellow-100 text-yellow-700'
//                       }`}>
//                         {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
//                       </span>
//                       {user.status !== 'active' && (
//                         <button 
//                           onClick={() => handleQuickStatusChange(user, 'active')}
//                           className="text-xs text-[#027480] hover:text-[#001524] hover:underline"
//                         >
//                           Activate
//                         </button>
//                       )}
//                     </div>
//                   </td>

//                   {/* Joined Date */}
//                   <td className="p-4">
//                     <div className="text-sm text-gray-600">
//                       {formatDate(user.created_at)}
//                     </div>
//                   </td>

//                   {/* Actions Column */}
//                   <td className="p-4">
//                     <div className="flex justify-end gap-2">
//                       <button 
//                         onClick={() => handleViewClick(user)}
//                         className="p-2 text-gray-600 hover:text-[#027480] hover:bg-[#027480]/10 rounded-lg transition-colors"
//                         title="View Details"
//                       >
//                         <Eye size={18} />
//                       </button>
//                       <button 
//                         onClick={() => handleEditClick(user)} 
//                         className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                         title="Edit User"
//                       >
//                         <Edit size={18} />
//                       </button>
//                       <button 
//                         onClick={() => handleDeleteClick(user.user_id)}
//                         className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                         title="Delete User"
//                       >
//                         <Trash2 size={18} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               )) : (
//                 <tr>
//                   <td colSpan={6} className="p-12 text-center">
//                     <div className="flex flex-col items-center justify-center gap-3 text-gray-500">
//                       <UserIcon className="w-12 h-12 text-gray-300" />
//                       <div>
//                         <h3 className="font-semibold text-lg">No users found</h3>
//                         <p className="text-sm mt-1">Try adjusting your search or filters</p>
//                       </div>
//                     </div>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* EDIT MODAL */}
//       {isEditModalOpen && selectedUser && (
//         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeIn">
//             {/* Modal Header */}
//             <div className="bg-gradient-to-r from-[#001524] to-[#027480] p-6 text-white">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <h3 className="text-xl font-bold">Edit User</h3>
//                   <p className="text-sm opacity-90 mt-1">{selectedUser.email}</p>
//                 </div>
//                 <button 
//                   onClick={() => setIsEditModalOpen(false)}
//                   className="p-2 hover:bg-white/20 rounded-lg transition-colors"
//                 >
//                   <XCircle size={20} />
//                 </button>
//               </div>
//             </div>
            
//             {/* Modal Form */}
//             <form onSubmit={handleEditSubmit} className="p-6 space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     First Name
//                   </label>
//                   <input 
//                     type="text" 
//                     value={formData.first_name}
//                     onChange={e => setFormData({...formData, first_name: e.target.value})}
//                     className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#027480] focus:border-transparent outline-none transition-all"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Last Name
//                   </label>
//                   <input 
//                     type="text" 
//                     value={formData.last_name}
//                     onChange={e => setFormData({...formData, last_name: e.target.value})}
//                     className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#027480] focus:border-transparent outline-none transition-all"
//                     required
//                   />
//                 </div>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Phone Number
//                 </label>
//                 <input 
//                   type="tel" 
//                   value={formData.contact_phone}
//                   onChange={e => setFormData({...formData, contact_phone: e.target.value})}
//                   className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#027480] focus:border-transparent outline-none transition-all"
//                 />
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Role
//                   </label>
//                   <select 
//                     value={formData.role}
//                     onChange={e => setFormData({...formData, role: e.target.value})}
//                     className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#027480] focus:border-transparent outline-none transition-all"
//                   >
//                     <option value="user">User</option>
//                     <option value="admin">Admin</option>
//                     <option value="superAdmin">Super Admin</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Status
//                   </label>
//                   <select 
//                     value={formData.status}
//                     onChange={e => setFormData({...formData, status: e.target.value})}
//                     className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#027480] focus:border-transparent outline-none transition-all"
//                   >
//                     <option value="active">Active</option>
//                     <option value="inactive">Inactive</option>
//                     <option value="banned">Banned</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="flex gap-3 pt-4">
//                 <button 
//                   type="button"
//                   onClick={() => setIsEditModalOpen(false)}
//                   className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button 
//                   type="submit" 
//                   disabled={isUpdating}
//                   className="flex-1 bg-gradient-to-r from-[#001524] to-[#027480] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
//                 >
//                   {isUpdating ? (
//                     <span className="flex items-center justify-center gap-2">
//                       <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
//                       Saving...
//                     </span>
//                   ) : 'Save Changes'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* VIEW DETAILS MODAL */}
//       {isDetailsModalOpen && selectedUser && (
//         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeIn">
//             <div className="bg-gradient-to-r from-[#001524] to-[#027480] p-6 text-white">
//               <div className="flex justify-between items-center">
//                 <h3 className="text-xl font-bold">User Details</h3>
//                 <button 
//                   onClick={() => setIsDetailsModalOpen(false)}
//                   className="p-2 hover:bg-white/20 rounded-lg transition-colors"
//                 >
//                   <XCircle size={20} />
//                 </button>
//               </div>
//             </div>
            
//             <div className="p-6 space-y-6">
//               <div className="flex flex-col items-center">
//                 <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#027480] to-[#001524] text-white flex items-center justify-center font-bold text-2xl shadow-lg mb-4">
//                   {selectedUser.photo ? (
//                     <img src={selectedUser.photo} alt={selectedUser.first_name} className="w-24 h-24 rounded-full object-cover" />
//                   ) : (
//                     getInitials(selectedUser.first_name, selectedUser.last_name)
//                   )}
//                 </div>
//                 <h4 className="text-2xl font-bold text-gray-900">{selectedUser.first_name} {selectedUser.last_name}</h4>
//                 <p className="text-gray-600">{selectedUser.email}</p>
//               </div>

//               <div className="space-y-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="bg-gray-50 p-4 rounded-lg">
//                     <p className="text-sm text-gray-500">Role</p>
//                     <p className="font-semibold">{selectedUser.role}</p>
//                   </div>
//                   <div className="bg-gray-50 p-4 rounded-lg">
//                     <p className="text-sm text-gray-500">Status</p>
//                     <p className={`font-semibold ${
//                       selectedUser.status === 'active' ? 'text-green-600' : 
//                       selectedUser.status === 'banned' ? 'text-red-600' : 
//                       'text-yellow-600'
//                     }`}>
//                       {selectedUser.status}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <p className="text-sm text-gray-500">Phone</p>
//                   <p className="font-semibold">{selectedUser.contact_phone || 'Not provided'}</p>
//                 </div>

//                 {selectedUser.national_id && (
//                   <div className="bg-gray-50 p-4 rounded-lg">
//                     <p className="text-sm text-gray-500">National ID</p>
//                     <p className="font-semibold">{selectedUser.national_id}</p>
//                   </div>
//                 )}

//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <p className="text-sm text-gray-500">Joined On</p>
//                   <p className="font-semibold">{formatDate(selectedUser.created_at)}</p>
//                 </div>
//               </div>

//               <div className="pt-4 border-t">
//                 <button 
//                   onClick={() => {
//                     setIsDetailsModalOpen(false);
//                     handleEditClick(selectedUser);
//                   }}
//                   className="w-full bg-gradient-to-r from-[#001524] to-[#027480] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
//                 >
//                   Edit User
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CustomerManagement;



// // import React, { useState, useMemo } from 'react';
// // import { 
// //   useGetAllUsersQuery, 
// //   useUpdateUserMutation, 
// //   useDeleteUserMutation 
// // } from '../../features/api/UserApi';
// // import type { User } from '../../types/types'; // Ensure this path is correct
// // import { 
// //   Search, Filter, Edit, Trash2, 
// //   User as UserIcon, Phone, Mail, Shield, CheckCircle, AlertTriangle 
// // } from 'lucide-react';
// // import { toast } from 'sonner';

// // const CustomerManagement: React.FC = () => {
// //   // --- 1. API HOOKS ---
// //   const { data: users = [], isLoading, error } = useGetAllUsersQuery();
// //   const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
// //   const [deleteUser] = useDeleteUserMutation();

// //   // --- 2. DEBUGGING LOGS ---
// //   // Look at your browser console to see what is actually coming in
// //   console.log("Component Rendered. Users Data:", users);
// //   console.log("Is Loading:", isLoading);
// //   console.log("Error:", error);

// //   // --- 3. STATE ---
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [roleFilter, setRoleFilter] = useState<string>('All');
// //   const [statusFilter, setStatusFilter] = useState<string>('All');

// //   // Modal State
// //   const [selectedUser, setSelectedUser] = useState<User | null>(null);
// //   const [isEditModalOpen, setIsEditModalOpen] = useState(false);

// //   // Form State
// //   const [formData, setFormData] = useState({
// //     first_name: '',
// //     last_name: '',
// //     contact_phone: '',
// //     role: 'user',
// //     status: 'active'
// //   });

// //   // --- 4. HELPERS ---
// //   const getInitials = (first: string, last: string) => 
// //     `${first?.charAt(0) || ''}${last?.charAt(0) || ''}`.toUpperCase();

// //   const formatDate = (dateString?: string) => {
// //     if (!dateString) return 'N/A';
// //     return new Date(dateString).toLocaleDateString('en-US', {
// //       year: 'numeric', month: 'short', day: 'numeric'
// //     });
// //   };

// //   // --- 5. HANDLERS ---

// //   // 🟢 FIXED: Open Modal and Set Data
// //   const handleEditClick = (user: User) => {
// //     console.log("Editing User:", user);
// //     setSelectedUser(user);
// //     setFormData({
// //       first_name: user.first_name || '',
// //       last_name: user.last_name || '',
// //       contact_phone: user.contact_phone || '',
// //       role: user.role || 'user',
// //       status: user.status || 'active'
// //     });
// //     setIsEditModalOpen(true);
// //   };

// //   // 🟢 FIXED: Submit Form Data
// //   const handleEditSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     if (!selectedUser) return;

// //     try {
// //       await updateUser({
// //         id: selectedUser.user_id,
// //         updates: {
// //             first_name: formData.first_name,
// //             last_name: formData.last_name,
// //             contact_phone: formData.contact_phone,
// //             role: formData.role as 'user' | 'admin' | 'superAdmin',
// //             status: formData.status as 'active' | 'inactive' | 'banned'
// //         }
// //       }).unwrap();

// //       toast.success("User updated successfully");
// //       setIsEditModalOpen(false);
// //     } catch (err: any) {
// //       console.error("Update failed:", err);
// //       toast.error(err?.data?.error || "Failed to update user");
// //     }
// //   };

// //   const handleDeleteClick = async (userId: string) => {
// //     if (window.confirm("Are you sure you want to delete this user?")) {
// //       try {
// //         await deleteUser(userId).unwrap();
// //         toast.success("User deleted");
// //       } catch (err: any) {
// //         toast.error("Failed to delete user");
// //       }
// //     }
// //   };

// //   const handleQuickStatusChange = async (user: User, newStatus: 'active' | 'banned') => {
// //     try {
// //       await updateUser({
// //         id: user.user_id,
// //         updates: { status: newStatus }
// //       }).unwrap();
// //       toast.success(`User status updated to ${newStatus}`);
// //     } catch (err) {
// //       toast.error("Status update failed");
// //     }
// //   };

// //   // --- 6. FILTERING (Memoized for performance) ---
// //   const filteredUsers = useMemo(() => {
// //     if (!Array.isArray(users)) return [];
    
// //     return users.filter(user => {
// //       const matchesSearch = 
// //         (user.first_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
// //         (user.last_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
// //         (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
// //         (user.national_id?.toLowerCase() || '').includes(searchTerm.toLowerCase());

// //       const matchesRole = roleFilter === 'All' || user.role === roleFilter;
// //       const matchesStatus = statusFilter === 'All' || user.status === statusFilter;

// //       return matchesSearch && matchesRole && matchesStatus;
// //     });
// //   }, [users, searchTerm, roleFilter, statusFilter]);


// //   // --- 7. RENDERING ---
// //   if (isLoading) return <div className="p-10 text-center text-blue-600 font-bold">Loading Users...</div>;
  
// //   if (error) {
// //     // Check console for specific error details
// //     return <div className="p-10 text-center text-red-600">Error loading data. Check console.</div>;
// //   }

// //   return (
// //     <div className="space-y-6">
      
// //       {/* HEADER & SEARCH (Same as before) */}
// //       <div className="flex flex-col md:flex-row justify-between gap-4">
// //         <div>
// //            <h1 className="text-3xl font-bold text-[#001524]">Customer Management</h1>
// //            <p>Total Users: {users.length}</p>
// //         </div>
// //       </div>

// //       <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4">
// //         <div className="relative flex-1">
// //           <Search className="absolute left-3 top-3 text-gray-400" size={18} />
// //           <input 
// //             type="text" 
// //             placeholder="Search users..." 
// //             value={searchTerm}
// //             onChange={(e) => setSearchTerm(e.target.value)}
// //             className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg outline-none"
// //           />
// //         </div>
// //         {/* Filters Selects would go here */}
// //       </div>

// //       {/* TABLE */}
// //       <div className="bg-white rounded-xl shadow-lg border border-[#445048]/20 overflow-hidden">
// //         <div className="overflow-x-auto">
// //           <table className="w-full text-left border-collapse">
// //             <thead className="bg-[#001524] text-[#E9E6DD]">
// //               <tr>
// //                 <th className="p-4">User Profile</th>
// //                 <th className="p-4">Role</th>
// //                 <th className="p-4">Status</th>
// //                 <th className="p-4 text-right">Actions</th>
// //               </tr>
// //             </thead>
// //             <tbody className="divide-y divide-gray-100">
// //               {filteredUsers.length > 0 ? filteredUsers.map((user) => (
// //                 <tr key={user.user_id} className="hover:bg-gray-50">
                  
// //                   {/* Profile */}
// //                   <td className="p-4">
// //                     <div className="flex items-center gap-3">
// //                       <div className="w-10 h-10 rounded-full bg-[#027480] text-white flex items-center justify-center font-bold">
// //                         {user.photo ? <img src={user.photo} className="w-10 h-10 rounded-full"/> : getInitials(user.first_name, user.last_name)}
// //                       </div>
// //                       <div>
// //                         <div className="font-bold">{user.first_name} {user.last_name}</div>
// //                         <div className="text-xs text-gray-500">{user.email}</div>
// //                       </div>
// //                     </div>
// //                   </td>

// //                   {/* Role */}
// //                   <td className="p-4">
// //                      <span className="px-2 py-1 bg-gray-100 rounded text-xs font-bold">{user.role}</span>
// //                   </td>

// //                   {/* Status */}
// //                   <td className="p-4">
// //                     <span className={`px-2 py-1 rounded text-xs font-bold ${user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
// //                       {user.status}
// //                     </span>
// //                   </td>

// //                   {/* Actions */}
// //                   <td className="p-4 text-right">
// //                     <div className="flex justify-end gap-2">
// //                       <button 
// //                         onClick={() => handleEditClick(user)} 
// //                         className="p-2 text-blue-600 hover:bg-blue-50 rounded"
// //                       >
// //                         <Edit size={16} />
// //                       </button>

// //                       {user.status === 'active' ? (
// //                         <button onClick={() => handleQuickStatusChange(user, 'banned')} className="p-2 text-orange-600">
// //                            <AlertTriangle size={16} />
// //                         </button>
// //                       ) : (
// //                         <button onClick={() => handleQuickStatusChange(user, 'active')} className="p-2 text-green-600">
// //                            <CheckCircle size={16} />
// //                         </button>
// //                       )}

// //                       <button onClick={() => handleDeleteClick(user.user_id)} className="p-2 text-red-600">
// //                         <Trash2 size={16} />
// //                       </button>
// //                     </div>
// //                   </td>
// //                 </tr>
// //               )) : (
// //                  <tr><td colSpan={4} className="p-8 text-center">No users found</td></tr>
// //               )}
// //             </tbody>
// //           </table>
// //         </div>
// //       </div>

// //       {/* MODAL */}
// //       {isEditModalOpen && selectedUser && (
// //         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
// //           <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
// //             <div className="bg-[#001524] p-6 text-white flex justify-between">
// //                <h3 className="font-bold">Edit {selectedUser.first_name}</h3>
// //                <button onClick={() => setIsEditModalOpen(false)}>X</button>
// //             </div>
            
// //             <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
// //                {/* Form Fields */}
// //                <div className="grid grid-cols-2 gap-4">
// //                  <div>
// //                     <label className="text-xs font-bold text-gray-500">First Name</label>
// //                     <input className="w-full border p-2 rounded" value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} />
// //                  </div>
// //                  <div>
// //                     <label className="text-xs font-bold text-gray-500">Last Name</label>
// //                     <input className="w-full border p-2 rounded" value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} />
// //                  </div>
// //                </div>
               
// //                <div>
// //                   <label className="text-xs font-bold text-gray-500">Role</label>
// //                   <select className="w-full border p-2 rounded" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
// //                     <option value="user">User</option>
// //                     <option value="admin">Admin</option>
// //                   </select>
// //                </div>

// //                <button type="submit" disabled={isUpdating} className="w-full bg-[#027480] text-white p-3 rounded font-bold">
// //                   {isUpdating ? 'Saving...' : 'Save Changes'}
// //                </button>
// //             </form>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default CustomerManagement;