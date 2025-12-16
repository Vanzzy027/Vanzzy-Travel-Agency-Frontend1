import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
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
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { token, user } = useSelector((state) => state.auth) ||
        { token: localStorage.getItem('token'), user: JSON.parse(localStorage.getItem('user') || '{}') };
    if (!token)
        return _jsx(Navigate, { to: "/login", replace: true });
    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        if (user.role === 'user')
            return _jsx(Navigate, { to: "/UserDashboard", replace: true });
        if (user.role === 'admin')
            return _jsx(Navigate, { to: "/admin", replace: true });
        return _jsx(Navigate, { to: "/unauthorized", replace: true });
    }
    return _jsx(_Fragment, { children: children });
};
function App() {
    const router = createBrowserRouter([
        // 1. PUBLIC ROUTES
        {
            path: '/',
            element: _jsx(PublicLayout, {}),
            children: [
                { index: true, element: _jsx(Home, {}) },
                { path: 'login', element: _jsx(Login, {}) },
                { path: 'register', element: _jsx(Register, {}) },
                { path: "contact", element: _jsx(ContactPage, {}) },
                { path: 'about', element: _jsx(About, {}) }
            ],
        },
        // 2. USER DASHBOARD
        {
            path: '/UserDashboard',
            element: (_jsx(ProtectedRoute, { allowedRoles: ['user'], children: _jsx(UserDashboardLayout, {}) })),
            children: [
                { index: true, element: _jsx(UserDashboardHome, {}) },
                { path: 'vehicles', element: _jsx(UserVehiclesPage, {}) },
                { path: 'my-bookings', element: _jsx(UserBookingsPage, {}) },
                { path: 'my-receipts', element: _jsx(UserReceiptsPage, {}) },
                { path: "profile", element: _jsx(ProfilePage, {}) },
                { path: 'my-payments', element: _jsx(UserPaymentsPage, {}) },
                { path: "support", element: _jsx(SupportPage, {}) },
                { path: 'review', element: _jsx(MyReviewsPage, {}) }
            ],
        },
        // 3. ADMIN DASHBOARD - FIXED: Added all child routes
        {
            path: '/admin',
            element: (_jsx(ProtectedRoute, { allowedRoles: ['admin'], children: _jsx(AdminDashboardLayout, {}) })),
            children: [
                { index: true, element: _jsx(AdminOverview, {}) },
                { path: 'customers', element: _jsx(CustomerManagement, {}) },
                { path: 'fleet', element: _jsx(FleetManagement, {}) },
                { path: 'bookings', element: _jsx(BookingsManagement, {}) },
                { path: 'analytics', element: _jsx(Analytics, {}) },
                { path: 'payments', element: _jsx(AdminPayments, {}) },
                { path: 'receipts', element: _jsx(AdminReceiptsPage, {}) },
                { path: 'profile', element: _jsx(ProfilePage, {}) },
                { path: 'support', element: _jsx(AdminSupportPage, {}) },
                { path: 'review', element: _jsx(AdminReviewsPage, {}) }
            ],
        },
        // 4. SUPER ADMIN
        {
            path: '/super-admin',
            element: (_jsx(ProtectedRoute, { allowedRoles: ['superAdmin'], children: _jsx(SuperAdminDashboardLayout, {}) })),
            children: [
                { index: true, element: _jsx("div", { className: "p-8", children: _jsx("h1", { children: "Super Admin Overview" }) }) },
            ],
        },
        // 5. CATCH ALL / REDIRECTS
        {
            path: '*',
            element: _jsx(Navigate, { to: "/", replace: true }),
        },
    ]);
    return _jsx(RouterProvider, { router: router });
}
export default App;
