import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  DollarSign, 
  Users, 
  Car, 
  CalendarCheck,
  TrendingUp 
} from 'lucide-react';
import { format, parseISO, startOfMonth } from 'date-fns';

// Import your API hooks
import { useGetAllBookingsQuery } from '../../features/api/BookingApi'; // Update path
import { useGetAllUsersQuery } from '../../features/api/UserApi';       // Update path
import { useGetVehiclesQuery } from '../../features/api/VehicleAPI';    // Update path

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
    if (isLoading) return null;

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

  if (isLoading) return <div className="p-10 text-center">Loading Analytics...</div>;
  if (!stats) return <div className="p-10 text-center">No Data Available</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Dashboard Analytics</h1>

      {/* --- SECTION 1: KPI CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiCard 
          title="Total Revenue" 
          value={`$${stats.kpi.totalRevenue.toLocaleString()}`} 
          icon={<DollarSign className="text-green-600" />} 
          color="bg-green-100"
        />
        <KpiCard 
          title="Active Bookings" 
          value={stats.kpi.activeBookings} 
          icon={<CalendarCheck className="text-blue-600" />} 
          color="bg-blue-100"
        />
        <KpiCard 
          title="Total Fleet" 
          value={stats.kpi.totalVehicles} 
          icon={<Car className="text-purple-600" />} 
          color="bg-purple-100"
        />
        <KpiCard 
          title="Total Users" 
          value={stats.kpi.totalUsers} 
          icon={<Users className="text-orange-600" />} 
          color="bg-orange-100"
        />
      </div>

      {/* --- SECTION 2: CHARTS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* CHART: Revenue Trends */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
            <TrendingUp size={20} /> Revenue Trends
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.charts.revenueData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                <Area type="monotone" dataKey="value" stroke="#8884d8" fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART: Vehicle Fleet Status */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Fleet Utilization</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.charts.vehicleStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  {stats.charts.vehicleStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART: Booking Status Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Booking Statuses</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.charts.statusData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#82ca9d" radius={[4, 4, 0, 0]}>
                   {stats.charts.statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Placeholder for future specific analytics */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center">
             <div className="text-center text-gray-400">
                <p>More analytics coming soon...</p>
             </div>
        </div>

      </div>
    </div>
  );
};

// Helper Component for KPI Cards
const KpiCard = ({ title, value, icon, color }: { title: string, value: string | number, icon: React.ReactNode, color: string }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
    <div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <h3 className="text-3xl font-bold text-gray-800 mt-1">{value}</h3>
    </div>
    <div className={`p-4 rounded-full ${color}`}>
      {icon}
    </div>
  </div>
);

export default AnalyticsDashboard;