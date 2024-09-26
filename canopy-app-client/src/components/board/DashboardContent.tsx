import React, { useEffect } from "react";
import MapContainer from "./MapContainer";
import TableContainer from "./TableContainer";
import { CanopyModel } from "@/types/models";

interface DashboardContentProps {
  dashboardData: CanopyModel[];
  onControlChange: (
    id: number,
    control: string,
    value: boolean
  ) => Promise<boolean>;
  userId: string;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  dashboardData,
  onControlChange,
  userId,
}) => {
  useEffect(() => {
    console.log("DashboardContent dashboardData:", dashboardData);
  }, [dashboardData]);

  return (
    <div className="flex flex-row px-10 py-6">
      <div className="w-2/5">
        <MapContainer data={dashboardData} />
      </div>
      <div className="w-3/5 bg-white rounded-lg shadow-md overflow-hidden">
        <TableContainer
          data={dashboardData}
          onControlChange={onControlChange}
          userId={userId}
        />
      </div>
    </div>
  );
};

export default DashboardContent;
