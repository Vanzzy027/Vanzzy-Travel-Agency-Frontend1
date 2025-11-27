
import React from 'react';
import { RouterProvider, createBrowserRouter, Outlet } from 'react-router-dom';
//import Header from './components/Header';
import Footer from './components/Footer';
import DashboardLayout from './layouts/DashboardLayout'; 
import Home from '../src/pages/home';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardHome from './pages/DashboardHome';
import Navbar from './components/Navbar';
import UserDashboardLayout from './Userdashboarddesign/UserDashboardLayout';
import UserDashboardHome from './pages/UserPage/MyDashboard';
import UserVehiclesPage from './pages/UserPage/VehiclesPage';

// Layout for Public Pages 
function PublicLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-[#E9E6DD]">
  
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}



// Main App Component
function App() {
    const router = createBrowserRouter([
        // Public Routes
        {
            path: '/',
            element: <PublicLayout />,
            children: [
                { index: true, element: <Home /> },
                { path: 'register', element: <Register /> },
                { path: 'login', element: <Login /> },
            ],
        },

{
  path: '/UserDashboard',
  element: <UserDashboardLayout />,  
  children: [
    { index: true, element: <UserDashboardHome /> },
    { path: 'vehicles', element: <UserVehiclesPage /> },
    { path: 'bookings', element: <div className="p-8"><h1 className="text-3xl font-bold text-[#001524]">My Bookings</h1></div> },
    { path: 'payments', element: <div className="p-8"><h1 className="text-3xl font-bold text-[#001524]">Payment History</h1></div> },
    { path: 'messages', element: <div className="p-8"><h1 className="text-3xl font-bold text-[#001524]">Messages</h1></div> },
    { path: 'emergency', element: <div className="p-8"><h1 className="text-3xl font-bold text-[#001524]">Emergency Support</h1></div> },
    { path: 'settings', element: <div className="p-8"><h1 className="text-3xl font-bold text-[#001524]">Settings</h1></div> },
  ],
},


        // Dashboard Routes
        {
            path: '/dashboard',
            element: <DashboardLayout />,  
            children: [
                { index: true, element: <DashboardHome /> },
                { path: 'fleet', element: <div className="p-8"><h1 className="text-3xl font-bold text-[#001524]">Vehicle Fleet Management</h1></div> },
                { path: 'bookings', element: <div className="p-8"><h1 className="text-3xl font-bold text-[#001524]">Bookings Management</h1></div> },
                { path: 'customers', element: <div className="p-8"><h1 className="text-3xl font-bold text-[#001524]">Customer Management</h1></div> },
                { path: 'payments', element: <div className="p-8"><h1 className="text-3xl font-bold text-[#001524]">Payments & Invoices</h1></div> },
                { path: 'maintenance', element: <div className="p-8"><h1 className="text-3xl font-bold text-[#001524]">Vehicle Maintenance</h1></div> },
                { path: 'analytics', element: <div className="p-8"><h1 className="text-3xl font-bold text-[#001524]">Business Analytics</h1></div> },
                { path: 'settings', element: <div className="p-8"><h1 className="text-3xl font-bold text-[#001524]">Settings</h1></div> },
            ],
        },
    ]);

    return <RouterProvider router={router} />;
}

export default App;
