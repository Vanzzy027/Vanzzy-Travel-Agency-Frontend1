import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import VehicleGrid from '../components/VehicleGrid';
const DashboardHome = () => {
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-[#001524] mb-2", children: "Vehicle Fleet Dashboard" }), _jsx("p", { className: "text-[#445048]", children: "Manage and monitor your rental vehicle fleet" })] }), _jsx(VehicleGrid, { vehicles: [] })] }));
};
export default DashboardHome;
