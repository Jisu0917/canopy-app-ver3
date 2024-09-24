import React from "react";
import MapContainer from "./MapContainer";
import TableContainer from "./TableContainer";
import { CanopyData } from "@/types/models";

interface DashboardContentProps {
  dashboardData: CanopyData[];
  onControlChange: (id: number, control: string, value: boolean) => void;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  dashboardData,
  onControlChange,
}) => {
  return (
    <div className="flex space-x-6">
      <div className="w-2/5">
        <MapContainer data={dashboardData} />
      </div>
      <div className="w-3/5 bg-white rounded-lg shadow-md overflow-hidden">
        <TableContainer
          data={dashboardData}
          onControlChange={onControlChange}
        />
      </div>
    </div>
  );
};

export default DashboardContent;
