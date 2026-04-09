import React from "react";
import VehicleGrid from "../components/VehicleGrid";

const DashboardHome: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#001524] mb-2">
          Vehicle Fleet Dashboard
        </h1>
        <p className="text-[#445048]">
          Manage and monitor your rental vehicle fleet
        </p>
      </div>

      <VehicleGrid vehicles={[]} />
    </div>
  );
};

export default DashboardHome;
