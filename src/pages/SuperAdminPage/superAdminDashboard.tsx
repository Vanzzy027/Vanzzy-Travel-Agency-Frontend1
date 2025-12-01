// now, we can think of the admin dashboard, where the admin logs, gets all the specifics for adin etc


// i will share some files you scan though and see what to do about it


// my app.tsx

// import { useEffect } from 'react';

// admin sidebar
// import React from 'react';

// const AdminSidebar: React.FC = () => {
//   const menuItems = [
//     { icon: '🏠', label: 'Dashboard', active: true },
//     { icon: '👥', label: 'Customers' },
//     { icon: '📧', label: 'Messages' },
//     { icon: '📊', label: 'Analytics' },
//     { icon: '🚗', label: 'Fleet Management' },
//     { icon: '📋', label: 'Bookings' },
//     { icon: '💰', label: 'Payments' },
//     { icon: '⚙️', label: 'Settings' },
//   ];

//   return (
//     <div className="w-64 bg-[#001524] min-h-screen p-6">
//       {/* Search */}
//       <div className="mb-8">
//         <div className="relative">
//           <input 
//             type="text" 
//             placeholder="Search..."
//             className="w-full bg-[#027480] text-[#E9E6DD] placeholder-[#E9E6DD] rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#F57251]"
//           />
//           <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
//             <span className="text-[#E9E6DD]">🔍</span>
//           </div>
//         </div>
//       </div>

//       {/* Menu Items */}
//       <ul className="space-y-2">
//         {menuItems.map((item, index) => (
//           <li key={index}>
//             <a
//               href="#"
//               className={`flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 ${
//                 item.active 
//                   ? 'bg-[#027480] text-[#E9E6DD]' 
//                   : 'text-[#E9E6DD] hover:bg-[#445048]'
//               }`}
//             >
//               <span className="text-lg">{item.icon}</span>
//               <span className="font-medium">{item.label}</span>
//             </a>
//           </li>
//         ))}
//       </ul>

//       {/* User Profile Section */}
//       <div className="mt-auto pt-6">
//         <div className="flex items-center space-x-3 p-3 bg-[#445048] rounded-lg">
//           <div className="w-12 h-12 rounded-full bg-[#D6CC99] flex items-center justify-center">
//             <span className="text-[#001524] font-bold text-lg">P</span>
//           </div>
//           <div className="flex-1 min-w-0">
//             <p className="text-[#E9E6DD] font-semibold truncate">Vans</p>
//             <p className="text-[#C4AD9D] text-sm truncate">Fleet Manager</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminSidebar;





// you should start using lucide icons
// in the admin sidebar, heshould be able to get all users on their ouw, all bookings, all vehicles, all analytics,

// for the users, he should be able to delete user, retrieve deleted user, create vehicle, create vehicle specs, 
// import { RouterProvider, createBrowserRouter, Outlet } from 'react-router-dom';
// //import Header from './components/Header';
// import Footer from './components/Footer';
// import DashboardLayout from './layouts/DashboardLayout'; 
// import Home from '../src/pages/home';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import DashboardHome from './pages/DashboardHome';
// import UserDashboardLayout from './Userdashboarddesign/UserDashboardLayout';
// import UserDashboardHome from './pages/UserPage/MyDashboard';
// import UserVehiclesPage from './pages/UserPage/VehiclesPage';

// // Layout for Public Pages 
// function PublicLayout() {
//     return (
//       <div className="min-h-screen flex flex-col bg-[#E9E6DD]">
  
//             <main className="flex-grow">
//                 <Outlet />
//             </main>
//             <Footer />
//         </div>
//     );
// }



// // Main App Component
// function App() {



//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     const user = localStorage.getItem('user');

//     if (token && user) {
//     }
//   }, []);
//     const router = createBrowserRouter([
//         // Public Routes
//         {
//             path: '/',
//             element: <PublicLayout />,
//             children: [
//                 { index: true, element: <Home /> },
//                 { path: 'register', element: <Register /> },
//                 { path: 'login', element: <Login /> },
//             ],
//         },

// {
//   path: '/UserDashboard',
//   element: <UserDashboardLayout />,  
//   children: [
//     { index: true, element: <UserDashboardHome /> },
//     { path: 'vehicles', element: <UserVehiclesPage /> },
//     { path: 'bookings', element: <div className="p-8"><h1 className="text-3xl font-bold text-[#001524]">My Bookings</h1></div> },
//     { path: 'payments', element: <div className="p-8"><h1 className="text-3xl font-bold text-[#001524]">Payment History</h1></div> },
//     { path: 'messages', element: <div className="p-8"><h1 className="text-3xl font-bold text-[#001524]">Messages</h1></div> },
//     { path: 'emergency', element: <div className="p-8"><h1 className="text-3xl font-bold text-[#001524]">Emergency Support</h1></div> },
//     { path: 'settings', element: <div className="p-8"><h1 className="text-3xl font-bold text-[#001524]">Settings</h1></div> },
//   ],
// },


//         // Dashboard Routes
//         {
//             path: '/dashboard',
//             element: <DashboardLayout />,  
//             children: [
//                 { index: true, element: <DashboardHome /> },
//                 { path: 'fleet', element: <div className="p-8"><h1 className="text-3xl font-bold text-[#001524]">Vehicle Fleet Management</h1></div> },
//                 { path: 'bookings', element: <div className="p-8"><h1 className="text-3xl font-bold text-[#001524]">Bookings Management</h1></div> },
//                 { path: 'customers', element: <div className="p-8"><h1 className="text-3xl font-bold text-[#001524]">Customer Management</h1></div> },
//                 { path: 'payments', element: <div className="p-8"><h1 className="text-3xl font-bold text-[#001524]">Payments & Invoices</h1></div> },
//                 { path: 'maintenance', element: <div className="p-8"><h1 className="text-3xl font-bold text-[#001524]">Vehicle Maintenance</h1></div> },
//                 { path: 'analytics', element: <div className="p-8"><h1 className="text-3xl font-bold text-[#001524]">Business Analytics</h1></div> },
//                 { path: 'settings', element: <div className="p-8"><h1 className="text-3xl font-bold text-[#001524]">Settings</h1></div> },
//             ],
//         },
//     ]);

//     return <RouterProvider router={router} />;
// }

// export default App;


// user dashboard
// import React from 'react';
// import { Link } from 'react-router-dom';
// import { useGetUserBookingsQuery } from '../../features/api/BookingApi';
// import { useGetAvailableVehiclesQuery } from '../../features/api/VehicleAPI';

// const UserDashboardHome: React.FC = () => {
//   const { data: bookings, isLoading: bookingsLoading, error: bookingsError } = useGetUserBookingsQuery();
//   const { data: vehicles, isLoading: vehiclesLoading, error: vehiclesError } = useGetAvailableVehiclesQuery();

//   const stats = [
//     { 
//       title: 'Active Rentals', 
//       value: bookings?.filter(b => b.status === 'active').length || 0, 
//       color: 'text-[#027480]',
//       icon: '🚗'
//     },
//     { 
//       title: 'Upcoming Bookings', 
//       value: bookings?.filter(b => b.status === 'confirmed').length || 0, 
//       color: 'text-[#F57251]',
//       icon: '📅'
//     },
//     { 
//       title: 'Total Spent', 
//       value: `$${bookings?.reduce((acc, curr) => acc + curr.total_amount, 0) || 0}`, 
//       color: 'text-[#D6CC99]',
//       icon: '💰'
//     },
//     { 
//       title: 'Available Vehicles', 
//       value: vehicles?.length || 0, 
//       color: 'text-[#445048]',
//       icon: '🏎️'
//     },
//   ];

//   const quickActions = [
//     { icon: '🚗', label: 'Browse Vehicles', description: 'Rent a new vehicle', path: '/dashboard/vehicles', color: 'bg-[#027480]' },
//     { icon: '📋', label: 'My Bookings', description: 'View your rentals', path: '/dashboard/bookings', color: 'bg-[#F57251]' },
//     { icon: '💰', label: 'Payment History', description: 'View transactions', path: '/dashboard/payments', color: 'bg-[#445048]' },
//     { icon: '🦺', label: 'Emergency', description: '24/7 Support', path: '/dashboard/emergency', color: 'bg-[#D6CC99] text-[#001524]' },
//   ];

//   console.log("Bookings Data:", bookings);
//   console.log("Bookings Error:", bookingsError);
//   console.log("Vehicles Data:", vehicles);
//   console.log("Vehicles Error:", vehiclesError);

//   if (bookingsLoading || vehiclesLoading) {
//     return (
//       <div className="space-y-6">
//         <div className="animate-pulse">
//           <div className="h-8 bg-[#445048] rounded w-1/4 mb-4"></div>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//             {[...Array(4)].map((_, i) => (
//               <div key={i} className="bg-[#001524] rounded-2xl p-6">
//                 <div className="h-6 bg-[#445048] rounded w-3/4 mb-2"></div>
//                 <div className="h-4 bg-[#445048] rounded w-1/2"></div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Welcome Section */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-[#001524] mb-2">Welcome to Your Dashboard!</h1>
//         <p className="text-[#445048]">Manage your rentals and explore available vehicles</p>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         {stats.map((stat, index) => (
//           <div key={index} className="bg-[#001524] rounded-2xl p-6 shadow-lg">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-[#C4AD9D] text-sm font-semibold mb-2">{stat.title}</p>
//                 <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
//               </div>
//               <div className="text-3xl">{stat.icon}</div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Quick Actions */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         {quickActions.map((action, index) => (
//           <Link
//             key={index}
//             to={action.path}
//             className={`${action.color} text-[#E9E6DD] rounded-2xl p-6 shadow-lg hover:scale-105 transition-transform duration-300 group`}
//           >
//             <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
//               {action.icon}
//             </div>
//             <h3 className="font-bold text-lg mb-2">{action.label}</h3>
//             <p className="text-sm opacity-90">{action.description}</p>
//           </Link>
//         ))}
//       </div>

//       {/* Recent Activity & Available Vehicles */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* Recent Bookings */}
//         <div className="bg-[#001524] rounded-2xl p-6 shadow-lg">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-xl font-bold text-[#E9E6DD]">Recent Bookings</h2>
//             <Link 
//               to="/dashboard/bookings" 
//               className="text-[#027480] hover:text-[#F57251] transition-colors text-sm font-semibold"
//             >
//               View All
//             </Link>
//           </div>
//           <div className="space-y-4">
//             {bookings?.slice(0, 3).map((booking) => (
//               <div key={booking.booking_id} className="flex items-center justify-between p-4 bg-[#445048] rounded-lg">
//                 <div>
//                   <div className="text-[#E9E6DD] font-semibold">Booking #{booking.booking_id}</div>
//                   <div className="text-[#C4AD9D] text-sm">
//                     {new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}
//                   </div>
//                   <div className="text-[#C4AD9D] text-xs">${booking.total_amount}</div>
//                 </div>
//                 <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                   booking.status === 'active' ? 'bg-[#027480] text-[#E9E6DD]' :
//                   booking.status === 'confirmed' ? 'bg-[#D6CC99] text-[#001524]' :
//                   booking.status === 'completed' ? 'bg-[#445048] text-[#C4AD9D]' :
//                   'bg-[#F57251] text-[#E9E6DD]'
//                 }`}>
//                   {booking.status}
//                 </span>
//               </div>
//             ))}
//             {(!bookings || bookings.length === 0) && (
//               <div className="text-center py-8">
//                 <div className="text-4xl mb-2">📋</div>
//                 <p className="text-[#C4AD9D]">No bookings yet</p>
//                 <Link 
//                   to="/dashboard/vehicles" 
//                   className="text-[#027480] hover:text-[#F57251] transition-colors text-sm font-semibold"
//                 >
//                   Rent your first vehicle
//                 </Link>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Featured Vehicles */}
//         <div className="bg-[#001524] rounded-2xl p-6 shadow-lg">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-xl font-bold text-[#E9E6DD]">Featured Vehicles</h2>
//             <Link 
//               to="/dashboard/vehicles" 
//               className="text-[#027480] hover:text-[#F57251] transition-colors text-sm font-semibold"
//             >
//               View All
//             </Link>
//           </div>
//           <div className="space-y-4">
//             {vehicles?.slice(0, 3).map((vehicle) => (
//               <div key={vehicle.vehicle_id} className="flex items-center space-x-4 p-4 bg-[#445048] rounded-lg">
//                 <img 
//                   src={vehicle.images ? JSON.parse(vehicle.images)[0] : 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'} 
//                   alt={`${vehicle.manufacturer} ${vehicle.model}`}
//                   className="w-16 h-16 object-cover rounded-lg"
//                 />
//                 <div className="flex-1">
//                   <div className="text-[#E9E6DD] font-semibold">
//                     {vehicle.manufacturer} {vehicle.model}
//                   </div>
//                   <div className="text-[#C4AD9D] text-sm">${vehicle.rental_rate}/day</div>
//                   <div className="text-[#027480] text-xs font-semibold">{vehicle.status}</div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserDashboardHome;

// admin dash layout
// import React from 'react'
// import Navbar from '../components/Navbar'
// import AdminSidebar from './AdminSidebar'

// interface DashboardLayoutProps {
//     children: React.ReactNode
// }

// const AdminDashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {



//     return (
//         <div className="min-h-screen bg-gray-50">
//             {/* Top Navbar */}
//             <Navbar />

//             {/* Layout Container */}
//             <div className="flex">
//                 {/* Sidebar */}
//                 <AdminSidebar />

//                 {/* Main Content */}
//                 <main className="flex-1 transition-all duration-300  ml-64" >
//                     <div className="p-6 min-h-[calc(100vh-128px)] ">
//                         {children}
//                     </div>
//                 </main>
//             </div>

//             {/* Footer positioned at bottom */}
//             <div className="transition-all duration-300 " >

//             </div>
//         </div>
//     )
// }

// export default AdminDashboardLayout


// on the schema for user, the admin should do the required things i said, as well as status and verification
// CREATE TABLE Users (  -- will add a column for national id, incase you mess you get banned
//     user_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
//     first_name NVARCHAR(50) NOT NULL,
//     last_name NVARCHAR(50) NOT NULL,
//     email NVARCHAR(100) NOT NULL UNIQUE,
//     password NVARCHAR(255) NOT NULL, 
//     contact_phone NVARCHAR(20) NOT NULL,
//     address NVARCHAR(255) NULL,
//     photo NVARCHAR(255) NULL, 
//     role NVARCHAR(20) DEFAULT 'user' NOT NULL, 
//     status NVARCHAR(20) DEFAULT 'active' NOT NULL,
//     verified BIT DEFAULT 0 NOT NULL, 
//     otp_code NVARCHAR(10) NULL,
//     otp_expires_at DATETIME2 NULL,
//     created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
//     updated_at DATETIME2 NULL,
//     national_id VARCHAR(20) NOT NULL UNIQUE,
    
//     CONSTRAINT CK_Users_Status CHECK (status IN ('active', 'inactive', 'banned')),
//     CONSTRAINT CK_Users_Role CHECK (role IN ('superAdmin', 'admin', 'user'))
// );
// GO

// admin should get bookig by id,getall, update, cancel,getuserbooking,getvehiclebooking,completebooking,

// backend routes
// import { Hono } from 'hono';
// import * as userControllers from './user.controller';
// import { bothRolesAuth, adminRoleAuth, superAdminRoleAuth } from '../middleware/bearAuth';

// const userRoutes = new Hono();

// // user prof
// userRoutes.use('/profile/*', bothRolesAuth); 

// // Read own profile
// userRoutes.get('/profile',  userControllers.getProfile);

// // Update own profile
// userRoutes.put('/profile/update', bothRolesAuth, userControllers.updateProfile);

// // admin
// // Get all users
// userRoutes.get('/all', adminRoleAuth, userControllers.getAllUsers);

// // Get user by ID
// userRoutes.get('/:id',  userControllers.getUserById);

// // Update a user by ID 
// userRoutes.put('/:id', adminRoleAuth, userControllers.updateUserById); 

// // Delete a user by ID 
// userRoutes.delete('/:id', adminRoleAuth, userControllers.deleteUser);


// //superadmin
// // Change user role
// userRoutes.patch('/:id/role', superAdminRoleAuth, userControllers.changeUserRole);

// export default userRoutes;

// import { Hono } from 'hono';
// import * as userControllers from './user.controller';
// import { bothRolesAuth, adminRoleAuth, superAdminRoleAuth } from '../middleware/bearAuth';

// const userRoutes = new Hono();

// // user prof
// userRoutes.use('/profile/*', bothRolesAuth); 

// // Read own profile
// userRoutes.get('/profile',  userControllers.getProfile);

// // Update own profile
// userRoutes.put('/profile/update', bothRolesAuth, userControllers.updateProfile);

// // admin
// // Get all users
// userRoutes.get('/all', adminRoleAuth, userControllers.getAllUsers);

// // Get user by ID
// userRoutes.get('/:id',  userControllers.getUserById);

// // Update a user by ID 
// userRoutes.put('/:id', adminRoleAuth, userControllers.updateUserById); 

// // Delete a user by ID 
// userRoutes.delete('/:id', adminRoleAuth, userControllers.deleteUser);


// //superadmin
// // Change user role
// userRoutes.patch('/:id/role', superAdminRoleAuth, userControllers.changeUserRole);

// export default userRoutes;

// ask questions before we proceede to understand my point




