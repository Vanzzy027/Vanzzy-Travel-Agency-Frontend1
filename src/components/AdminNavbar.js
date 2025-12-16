// import React, { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { Link } from "react-router-dom";
// import { Bell, Search, ChevronDown, LogOut } from "lucide-react";
export {};
// const AdminNavbar: React.FC = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [userMenuOpen, setUserMenuOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   // Get user from Redux store or localStorage
//   const { user } = useSelector((state: any) => state.auth) || 
//     { user: JSON.parse(localStorage.getItem('user') || 'null') };
//   // Get page title from path
//   const getPageTitle = (path: string): string => {
//     const pageTitles: Record<string, string> = {
//       '/admin': 'Dashboard',
//       '/admin/customers': 'Customers',
//       '/admin/fleet': 'Fleet',
//       '/admin/bookings': 'Bookings',
//       '/admin/analytics': 'Analytics',
//       '/admin/payments': 'Payments',
//       '/admin/messages': 'Messages',
//       '/admin/settings': 'Settings',
//       '/admin/receipts': 'Receipts',
//       '/admin/profile': 'Profile'
//     };
//     return pageTitles[path] || 'Admin';
//   };
//   // Get user initials
//   const getUserInitials = (): string => {
//     if (!user) return 'A';
//     const { first_name, last_name } = user;
//     return `${first_name?.[0] || ''}${last_name?.[0] || ''}`.toUpperCase() || 'A';
//   };
//   // Handle logout
//   const handleLogout = (): void => {
//     localStorage.removeItem('user');
//     localStorage.removeItem('token');
//     navigate('/login');
//   };
//   const currentPage = getPageTitle(location.pathname);
//   return (
//     <div className="p-4 bg-[#E9E6DD]">
//       <nav className="max-w-7xl mx-auto bg-[#001524] rounded-2xl p-4 shadow-lg">
//         <div className="flex items-center justify-between">
//           {/* Brand - Keep your original styling */}
//           <Link to="/admin" className="flex items-center space-x-2">
//             <div className="w-10 h-10 rounded-full bg-[#027480] flex items-center justify-center">
//               <span className="text-[#E9E6DD] font-bold text-lg">V</span>
//             </div>
//             <div>
//               <h1 className="text-2xl font-bold text-[#E9E6DD]">VansKE Car Rental</h1>
//               <p className="text-[#C4AD9D] text-sm">Luxury & Performance</p>
//             </div>
//           </Link>
//           {/* Current Page Title */}
//           <div className="hidden md:block">
//             <h2 className="text-xl font-bold text-[#E9E6DD]">{currentPage}</h2>
//           </div>
//           {/* Right: Search and User */}
//           <div className="flex items-center space-x-4">
//             {/* Search */}
//             <div className="hidden md:block">
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Search className="h-4 w-4 text-[#C4AD9D]" />
//                 </div>
//                 <input
//                   type="search"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   placeholder="Search..."
//                   className="pl-10 pr-4 py-2 w-48 bg-[#00101f] border border-[#445048] rounded-lg text-[#E9E6DD] text-sm placeholder-[#C4AD9D] focus:outline-none focus:ring-1 focus:ring-[#027480]"
//                 />
//               </div>
//             </div>
//             {/* Notifications */}
//             <button className="relative p-2 text-[#C4AD9D] hover:text-[#E9E6DD] transition-colors">
//               <Bell size={20} />
//               <span className="absolute top-1 right-1 h-2 w-2 bg-[#F57251] rounded-full"></span>
//             </button>
//             {/* User Menu */}
//             <div className="relative">
//               <button
//                 onClick={() => setUserMenuOpen(!userMenuOpen)}
//                 className="flex items-center space-x-2 p-2 hover:bg-[#00101f] rounded-lg transition-colors"
//               >
//                 <div className="w-10 h-10 rounded-full bg-[#D6CC99] flex items-center justify-center overflow-hidden">
//                   <span className="text-[#001524] font-bold">
//                     {getUserInitials()}
//                   </span>
//                 </div>
//                 <ChevronDown className={`h-4 w-4 text-[#C4AD9D] transition-transform ${
//                   userMenuOpen ? 'rotate-180' : ''
//                 }`} />
//               </button>
//               {/* Dropdown */}
//               {userMenuOpen && (
//                 <div className="absolute right-0 mt-2 w-56 bg-[#001524] border border-[#445048] rounded-lg shadow-lg z-50">
//                   <div className="p-3 border-b border-[#445048]">
//                     <p className="text-[#E9E6DD] font-medium">
//                       {user?.first_name} {user?.last_name}
//                     </p>
//                     <p className="text-sm text-[#C4AD9D]">{user?.email}</p>
//                     <span className="text-xs text-[#027480] bg-[#027480]/10 px-2 py-1 rounded mt-1 inline-block">
//                       {user?.role === 'superAdmin' ? 'Super Admin' : 
//                        user?.role === 'admin' ? 'Administrator' : 'User'}
//                     </span>
//                   </div>
//                   <div className="p-2">
//                     <button
//                       onClick={() => {
//                         navigate('/admin/profile');
//                         setUserMenuOpen(false);
//                       }}
//                       className="w-full text-left px-3 py-2 text-[#E9E6DD] hover:bg-[#00101f] rounded text-sm transition-colors"
//                     >
//                       Profile Settings
//                     </button>
//                   </div>
//                   <div className="p-2 border-t border-[#445048]">
//                     <button
//                       onClick={handleLogout}
//                       className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm bg-[#F57251]/10 text-[#F57251] hover:bg-[#F57251] hover:text-[#001524] rounded-lg transition-colors font-medium"
//                     >
//                       <LogOut size={16} />
//                       <span>Logout</span>
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//         {/* Mobile: Current Page Title */}
//         <div className="md:hidden mt-4 pt-4 border-t border-[#445048]">
//           <h2 className="text-lg font-bold text-[#E9E6DD]">{currentPage}</h2>
//         </div>
//       </nav>
//     </div>
//   );
// };
// export default AdminNavbar;
