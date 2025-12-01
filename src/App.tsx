import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// --- LAYOUTS ---
import PublicLayout from './layouts/PublicLayout';
import UserDashboardLayout from './Userdashboarddesign/UserDashboardLayout';
import AdminDashboardLayout from './Userdashboarddesign/AdminDashboardLayout';
import SuperAdminDashboardLayout from './Userdashboarddesign/SuperAdminDashboardLayout';

// --- PAGES ---
import Home from './pages/home';
import Login from './pages/Login';
import Register from './pages/Register';

// User Pages
import UserDashboardHome from './pages/UserPage/MyDashboard';
import UserVehiclesPage from './pages/UserPage/VehiclesPage';
import UserBookingsPage from './pages/UserPage/My Bookings'; 

// Admin Pages
import AdminOverview from './pages/AdminPage/AdminDashboard';
import FleetManagement from './pages/AdminPage/FleetManagement';
import BookingsManagement from './pages/AdminPage/BookingsManagement';
import CustomerManagement from './pages/AdminPage/CustomerManagement';

// --- AUTH GUARD ---
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const { token, user } = useSelector((state: any) => state.auth) || 
                          { token: localStorage.getItem('token'), user: JSON.parse(localStorage.getItem('user') || '{}') };

  if (!token) return <Navigate to="/login" replace />;
  
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    if (user.role === 'user') return <Navigate to="/UserDashboard" replace />;
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    return <Navigate to="/unauthorized" replace />;
  }
  return <>{children}</>;
};

function App() {
  const router = createBrowserRouter([
    // 1. PUBLIC ROUTES
    {
      path: '/',
      element: <PublicLayout />,
      children: [
        { index: true, element: <Home /> },
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
      ],
    },

    // 2. USER DASHBOARD
    {
      path: '/UserDashboard', // <--- PARENT PATH
      element: (
        <ProtectedRoute allowedRoles={['user']}>
          <UserDashboardLayout />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <UserDashboardHome /> },
        { path: 'vehicles', element: <UserVehiclesPage /> },
        { path: 'my-bookings', element: <UserBookingsPage /> }, // <--- THIS ADDS THE ROUTE
      ],
    },

    // 3. ADMIN DASHBOARD
    {
      path: '/admin',
      element: (
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboardLayout />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <AdminOverview /> },
        { path: 'fleet', element: <FleetManagement /> },
        { path: 'bookings', element: <BookingsManagement /> },
        { path: 'customers', element: <CustomerManagement /> },
      ],
    },

    // 4. SUPER ADMIN
    {
      path: '/super-admin',
      element: (
        <ProtectedRoute allowedRoles={['superAdmin']}>
          <SuperAdminDashboardLayout />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <div className="p-8"><h1>Super Admin Overview</h1></div> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;




// import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';

// // --- LAYOUTS ---
// import PublicLayout from './layouts/PublicLayout';
// import UserDashboardLayout from './Userdashboarddesign/UserDashboardLayout';
// import AdminDashboardLayout from './Userdashboarddesign/AdminDashboardLayout';
// import SuperAdminDashboardLayout from './Userdashboarddesign/SuperAdminDashboardLayout'; // Ensure this exists

// // --- PAGES ---
// import Home from './pages/home';
// import Login from './pages/Login';
// import Register from './pages/Register';

// // User Pages
// import UserDashboardHome from './pages/UserPage/MyDashboard';
// import UserVehiclesPage from './pages/UserPage/VehiclesPage';

// // Admin Pages
// import AdminOverview from './pages/AdminPage/AdminDashboard';
// import FleetManagement from './pages/AdminPage/FleetManagement';
// import BookingsManagement from './pages/AdminPage/BookingsManagement';
// import CustomerManagement from './pages/AdminPage/CustomerManagement';

// // Super Admin Pages (Examples)
// // import SystemSettings from './pages/SuperAdmin/SystemSettings';
// // import ManageAdmins from './pages/SuperAdmin/ManageAdmins';

// // --- AUTH GUARD ---
// const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
//   const { token, user } = useSelector((state: any) => state.auth) || 
//                           { token: localStorage.getItem('token'), user: JSON.parse(localStorage.getItem('user') || '{}') };

//   if (!token) return <Navigate to="/login" replace />;
  
//   if (allowedRoles && !allowedRoles.includes(user?.role)) {
//     // Optional: Redirect to their correct dashboard instead of generic unauthorized
//     if (user.role === 'user') return <Navigate to="/UserDashboard" replace />;
//     if (user.role === 'admin') return <Navigate to="/admin" replace />;
//     return <Navigate to="/unauthorized" replace />;
//   }

//   return <>{children}</>;
// };

// function App() {
//   const router = createBrowserRouter([
//     // 1. PUBLIC ROUTES
//     {
//       path: '/',
//       element: <PublicLayout />,
//       children: [
//         { index: true, element: <Home /> },
//         { path: 'login', element: <Login /> },
//         { path: 'register', element: <Register /> },
//       ],
//     },

//     // 2. USER DASHBOARD (Only 'user')
//     {
//       path: '/UserDashboard',
//       element: (
//         <ProtectedRoute allowedRoles={['user']}>
//           <UserDashboardLayout />
//         </ProtectedRoute>
//       ),
//       children: [
//         { index: true, element: <UserDashboardHome /> },
//         { path: 'vehicles', element: <UserVehiclesPage /> },
//         // other user routes...
//       ],
//     },

//     // 3. ADMIN DASHBOARD (Only 'admin')
//     {
//       path: '/admin',
//       element: (
//         <ProtectedRoute allowedRoles={['admin']}>
//           <AdminDashboardLayout />
//         </ProtectedRoute>
//       ),
//       children: [
//         { index: true, element: <AdminOverview /> },
//         { path: 'fleet', element: <FleetManagement /> },
//         { path: 'bookings', element: <BookingsManagement /> },
//         { path: 'customers', element: <CustomerManagement /> },
//       ],
//     },

//     // 4. SUPER ADMIN DASHBOARD (Only 'superAdmin')
//     {
//       path: '/super-admin',
//       element: (
//         <ProtectedRoute allowedRoles={['superAdmin']}>
//           <SuperAdminDashboardLayout />
//         </ProtectedRoute>
//       ),
//       children: [
//         // Create a specific home page for Super Admin
//         { index: true, element: <div className="p-8"><h1>Super Admin Overview</h1></div> },
        
//         // Example: Only Super Admin can manage other Admins
//         { path: 'manage-admins', element: <div className="p-8"><h1>Manage Admins</h1></div> },
        
//         // Example: System-wide settings
//         { path: 'settings', element: <div className="p-8"><h1>Global Settings</h1></div> },
//       ],
//     },
//   ]);

//   return <RouterProvider router={router} />;
// }

// export default App;
