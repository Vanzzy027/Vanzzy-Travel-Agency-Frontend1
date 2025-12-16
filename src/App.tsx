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
import ContactPage from './pages/ContactPage';
import About from './pages/About';

// User Pages
import UserDashboardHome from './pages/UserPage/MyDashboard';
import UserVehiclesPage from './pages/UserPage/VehiclesPage';
import UserBookingsPage from './pages/UserPage/My Bookings'; 
import UserReceiptsPage from './pages/UserPage/UserReceipts';
import UserPaymentsPage from './pages/UserPage/UserPaymentsPage';
import ProfilePage from './pages/AdminPage/ProfilePage';
import SupportPage from './pages/UserPage/SupportPage';
import MyReviewsPage from './pages/UserPage/MyReviewsPage';

// Admin Pages - ADD THESE IMPORTS
import AdminOverview from './pages/AdminPage/AdminDashboard';
import FleetManagement from './pages/AdminPage/FleetManagement';
import BookingsManagement from './pages/AdminPage/BookingsManagement';
import CustomerManagement from './pages/AdminPage/CustomerManagement';
import Analytics from './pages/AdminPage/Analytics';
import AdminReceiptsPage from './pages/AdminPage/AdminReceipts';
import AdminPayments from './pages/AdminPage/AdminPayments';
import AdminSupportPage from './pages/AdminPage/AdminSupportPage';
import AdminReviewsPage from './pages/AdminPage/AdminReviewsPage';

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
        { path: "contact", element: <ContactPage />},
        { path: 'about', element: <About/>}
      ],
    },

    // 2. USER DASHBOARD
    {
      path: '/UserDashboard',
      element: (
        <ProtectedRoute allowedRoles={['user']}>
          <UserDashboardLayout />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <UserDashboardHome /> },
        { path: 'vehicles', element: <UserVehiclesPage /> },
        { path: 'my-bookings', element: <UserBookingsPage /> },
        { path: 'my-receipts', element: <UserReceiptsPage /> },
        { path: "profile", element: <ProfilePage />},
        { path: 'my-payments', element: <UserPaymentsPage />},
        { path: "support", element: <SupportPage /> },
        { path: 'review', element: <MyReviewsPage/>}
      ],
    },

    // 3. ADMIN DASHBOARD - FIXED: Added all child routes
    {
      path: '/admin',
      element: (
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboardLayout />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <AdminOverview /> },
        { path: 'customers', element: <CustomerManagement /> },
        { path: 'fleet', element: <FleetManagement /> },
        { path: 'bookings', element: <BookingsManagement /> },
        { path: 'analytics', element: <Analytics /> },
        { path: 'payments', element: <AdminPayments /> },
        { path: 'receipts', element: <AdminReceiptsPage /> },
        { path: 'profile', element: <ProfilePage /> },
        { path: 'support', element: <AdminSupportPage /> },
        { path: 'review', element: <AdminReviewsPage /> }
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

    // 5. CATCH ALL / REDIRECTS
    {
      path: '*',
      element: <Navigate to="/" replace />,
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
// import SuperAdminDashboardLayout from './Userdashboarddesign/SuperAdminDashboardLayout';

// // --- PAGES ---
// import Home from './pages/home';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import ContactPage from './pages/ContactPage';
// import About from './pages/About';

// // User Pages
// import UserDashboardHome from './pages/UserPage/MyDashboard';
// import UserVehiclesPage from './pages/UserPage/VehiclesPage';
// import UserBookingsPage from './pages/UserPage/My Bookings'; 
// import UserReceiptsPage from './pages/UserPage/UserReceipts'; // ADD THIS
// import UserPaymentsPage from './pages/UserPage/UserPaymentsPage';

// // Admin Pages
// import AdminOverview from './pages/AdminPage/AdminDashboard';
// import FleetManagement from './pages/AdminPage/FleetManagement';
// import BookingsManagement from './pages/AdminPage/BookingsManagement';
// import CustomerManagement from './pages/AdminPage/CustomerManagement';
// import Analytics from './pages/AdminPage/Analytics';
// import AdminReceiptsPage from './pages/AdminPage/AdminReceipts';
// import AdminPayments from './pages/AdminPage/AdminPayments';
// // In your admin routes file
// import ProfilePage from './pages/AdminPage/ProfilePage';
// import SupportPage from './pages/UserPage/SupportPage';
// import AdminSupportPage from './pages/AdminPage/AdminSupportPage';
// // Receipt Pages (Standalone)
// import ReceiptPage from './pages/ReceiptPage';



// import AdminReviewsPage from './pages/AdminPage/AdminReviewsPage';
// import MyReviewsPage from './pages/UserPage/MyReviewsPage';
// // --- AUTH GUARD ---
// const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
//   const { token, user } = useSelector((state: any) => state.auth) || 
//                           { token: localStorage.getItem('token'), user: JSON.parse(localStorage.getItem('user') || '{}') };

//   if (!token) return <Navigate to="/login" replace />;
  
//   if (allowedRoles && !allowedRoles.includes(user?.role)) {
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
//         // Public receipt view (shareable links)
//         { path: 'receipt/:paymentId', element: <ReceiptPage /> },
//         { path: 'receipt', element: <ReceiptPage /> }, 
//         { path: "contact", element: <ContactPage />},
//         { path: 'about', element: <About/>}
//       ],
//     },

//     // 2. USER DASHBOARD
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
//         { path: 'my-bookings', element: <UserBookingsPage /> },
//         { path: 'my-receipts', element: <UserReceiptsPage /> }, // User's receipts
//         //{ path:"/UserDashboard/profile", element:<UserProfilePage />}
//         {path: "profile", element: <ProfilePage />},
//         {path: '/UserDashboard/my-payments',element: <UserPaymentsPage />},
//         {path:"support", element:<SupportPage /> },
//         { path: 'review', element: <MyReviewsPage/>}
        
//       ],
//     },

//     // 3. ADMIN DASHBOARD
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
//         { path: 'analytics', element: <Analytics /> },
//         { path: 'payments', element: <AdminPayments /> },
//         { path: 'receipts', element: <AdminReceiptsPage /> }, // Admin receipts
//         {path: '/admin/profile', element: <ProfilePage />}, 
//         {path:'support', element:<AdminSupportPage /> },
//         { path: 'review', element: <AdminReviewsPage/>}
//       ],
//     },

//     // 4. SUPER ADMIN
//     {
//       path: '/super-admin',
//       element: (
//         <ProtectedRoute allowedRoles={['superAdmin']}>
//           <SuperAdminDashboardLayout />
//         </ProtectedRoute>
//       ),
//       children: [
//         { index: true, element: <div className="p-8"><h1>Super Admin Overview</h1></div> },
//       ],
//     },

//     // 5. CATCH ALL / REDIRECTS
//     {
//       path: '*',
//       element: <Navigate to="/" replace />,
//     },
//   ]);

//   return <RouterProvider router={router} />;
// }

// export default App;

