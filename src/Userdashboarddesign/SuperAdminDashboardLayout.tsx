import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SuperAdminSidebar from './SuperAdminSidebar'

interface DashboardLayoutProps {
    children: React.ReactNode
}

const AdminDashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {



    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Navbar */}
            <Navbar />

            {/* Layout Container */}
            <div className="flex">
                {/* Sidebar */}
                <SuperAdminSidebar />

                {/* Main Content */}
                <main className="flex-1 transition-all duration-300  ml-64" >
                    <div className="p-6 min-h-[calc(100vh-128px)] ">
                        {children}
                    </div>
                </main>
            </div>

            {/* Footer positioned at bottom */}
            <div className="transition-all duration-300 " >

            </div>
        </div>
    )
}

export default AdminDashboardLayout