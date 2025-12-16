import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { DollarSign, Users, Car, CalendarCheck, TrendingUp } from 'lucide-react';
import { format, parseISO } from 'date-fns';
// Import your API hooks
import { useGetAllBookingsQuery } from '../../features/api/BookingApi'; // Update path
import { useGetAllUsersQuery } from '../../features/api/UserApi'; // Update path
import { useGetVehiclesQuery } from '../../features/api/VehicleAPI'; // Update path
// --- COLORS FOR CHARTS ---
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
const AnalyticsDashboard = () => {
    // 1. Fetch Data
    const { data: bookings = [], isLoading: loadingBookings } = useGetAllBookingsQuery();
    const { data: users = [], isLoading: loadingUsers } = useGetAllUsersQuery();
    const { data: vehicles = [], isLoading: loadingVehicles } = useGetVehiclesQuery();
    const isLoading = loadingBookings || loadingUsers || loadingVehicles;
    // 2. Process Data (Memoized for performance)
    const stats = useMemo(() => {
        if (isLoading)
            return null;
        // --- KPI Cards Calculation ---
        const totalRevenue = bookings.reduce((acc, curr) => acc + (Number(curr.total_amount) || 0), 0);
        const activeBookings = bookings.filter(b => b.status === 'Active' || b.status === 'Confirmed').length;
        const totalVehicles = vehicles.length;
        const totalUsers = users.length;
        // --- Chart 1: Revenue Over Time (Group by Month) ---
        const revenueMap = new Map();
        bookings.forEach(b => {
            const date = b.booking_date ? format(parseISO(b.booking_date), 'MMM yyyy') : 'Unknown';
            const amount = Number(b.total_amount) || 0;
            revenueMap.set(date, (revenueMap.get(date) || 0) + amount);
        });
        // Convert Map to Array and sort (simple sort for now, better to sort by actual date object)
        const revenueData = Array.from(revenueMap, ([name, value]) => ({ name, value }));
        // --- Chart 2: Booking Status Distribution ---
        const statusMap = new Map();
        bookings.forEach(b => {
            const status = b.status || 'Unknown';
            statusMap.set(status, (statusMap.get(status) || 0) + 1);
        });
        const statusData = Array.from(statusMap, ([name, value]) => ({ name, value }));
        // --- Chart 3: Vehicle Status (Available vs Rented) ---
        const vehicleStatusMap = new Map();
        vehicles.forEach(v => {
            const status = v.status || 'Other';
            vehicleStatusMap.set(status, (vehicleStatusMap.get(status) || 0) + 1);
        });
        const vehicleStatusData = Array.from(vehicleStatusMap, ([name, value]) => ({ name, value }));
        return {
            kpi: { totalRevenue, activeBookings, totalVehicles, totalUsers },
            charts: { revenueData, statusData, vehicleStatusData }
        };
    }, [bookings, users, vehicles, isLoading]);
    if (isLoading)
        return _jsx("div", { className: "p-10 text-center", children: "Loading Analytics..." });
    if (!stats)
        return _jsx("div", { className: "p-10 text-center", children: "No Data Available" });
    return (_jsxs("div", { className: "p-6 bg-gray-50 min-h-screen", children: [_jsx("h1", { className: "text-2xl font-bold mb-6 text-gray-800", children: "Dashboard Analytics" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8", children: [_jsx(KpiCard, { title: "Total Revenue", value: `$${stats.kpi.totalRevenue.toLocaleString()}`, icon: _jsx(DollarSign, { className: "text-green-600" }), color: "bg-green-100" }), _jsx(KpiCard, { title: "Active Bookings", value: stats.kpi.activeBookings, icon: _jsx(CalendarCheck, { className: "text-blue-600" }), color: "bg-blue-100" }), _jsx(KpiCard, { title: "Total Fleet", value: stats.kpi.totalVehicles, icon: _jsx(Car, { className: "text-purple-600" }), color: "bg-purple-100" }), _jsx(KpiCard, { title: "Total Users", value: stats.kpi.totalUsers, icon: _jsx(Users, { className: "text-orange-600" }), color: "bg-orange-100" })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [_jsxs("div", { className: "bg-white p-6 rounded-xl shadow-sm border border-gray-100", children: [_jsxs("h3", { className: "text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2", children: [_jsx(TrendingUp, { size: 20 }), " Revenue Trends"] }), _jsx("div", { className: "h-80", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(AreaChart, { data: stats.charts.revenueData, children: [_jsx("defs", { children: _jsxs("linearGradient", { id: "colorValue", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "5%", stopColor: "#8884d8", stopOpacity: 0.8 }), _jsx("stop", { offset: "95%", stopColor: "#8884d8", stopOpacity: 0 })] }) }), _jsx(CartesianGrid, { strokeDasharray: "3 3", vertical: false }), _jsx(XAxis, { dataKey: "name" }), _jsx(YAxis, {}), _jsx(Tooltip, { formatter: (value) => `$${Number(value).toLocaleString()}` }), _jsx(Area, { type: "monotone", dataKey: "value", stroke: "#8884d8", fillOpacity: 1, fill: "url(#colorValue)" })] }) }) })] }), _jsxs("div", { className: "bg-white p-6 rounded-xl shadow-sm border border-gray-100", children: [_jsx("h3", { className: "text-lg font-semibold mb-4 text-gray-700", children: "Fleet Utilization" }), _jsx("div", { className: "h-80", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(PieChart, { children: [_jsx(Pie, { data: stats.charts.vehicleStatusData, cx: "50%", cy: "50%", innerRadius: 60, outerRadius: 100, fill: "#8884d8", paddingAngle: 5, dataKey: "value", label: true, children: stats.charts.vehicleStatusData.map((entry, index) => (_jsx(Cell, { fill: COLORS[index % COLORS.length] }, `cell-${index}`))) }), _jsx(Tooltip, {}), _jsx(Legend, { verticalAlign: "bottom", height: 36 })] }) }) })] }), _jsxs("div", { className: "bg-white p-6 rounded-xl shadow-sm border border-gray-100", children: [_jsx("h3", { className: "text-lg font-semibold mb-4 text-gray-700", children: "Booking Statuses" }), _jsx("div", { className: "h-80", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(BarChart, { data: stats.charts.statusData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", vertical: false }), _jsx(XAxis, { dataKey: "name" }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Bar, { dataKey: "value", fill: "#82ca9d", radius: [4, 4, 0, 0], children: stats.charts.statusData.map((entry, index) => (_jsx(Cell, { fill: COLORS[index % COLORS.length] }, `cell-${index}`))) })] }) }) })] }), _jsx("div", { className: "bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center", children: _jsx("div", { className: "text-center text-gray-400", children: _jsx("p", { children: "More analytics coming soon..." }) }) })] })] }));
};
// Helper Component for KPI Cards
const KpiCard = ({ title, value, icon, color }) => (_jsxs("div", { className: "bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-gray-500 text-sm font-medium", children: title }), _jsx("h3", { className: "text-3xl font-bold text-gray-800 mt-1", children: value })] }), _jsx("div", { className: `p-4 rounded-full ${color}`, children: icon })] }));
export default AnalyticsDashboard;
