import React, { useState, useEffect } from "react";
import Image from "next/image";
import { CanopyModel, CanopyData } from "@/types/models";
import ControlMenu from "./ControlMenu";
import ControlOn from "@/assets/icons/ic_control_on.ico";
import ControlOff from "@/assets/icons/ic_control_off.ico";

interface TableContainerProps {
  data: CanopyModel[];
  onControlChange: (
    id: number,
    control: string,
    value: boolean
  ) => Promise<boolean>;
}

const TableContainer: React.FC<TableContainerProps> = ({
  data,
  onControlChange,
}) => {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  useEffect(() => {
    console.log("TableContainer data:", data);
  }, [data]);

  const toggleMenu = (id: number) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <div className="overflow-x-auto bg-white p-4 h-[600px]">
      <table className="w-full text-base text-center text-gray-500">
        <thead className="text-center text-gray-500 uppercase bg-gray-100 font-semibold">
          <tr>
            <th scope="col" className="px-6 py-2">
              &nbsp;
            </th>
            <th scope="col" className="px-6 py-2">
              관리 번호
            </th>
            <th scope="col" className="px-6 py-2">
              구분 번호
            </th>
            <th scope="col" className="px-6 py-2">
              그늘막 상태
            </th>
            <th scope="col" className="px-6 py-2 text-center">
              제어
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => {
            const canopy = item.data as CanopyData;
            return (
              <React.Fragment key={canopy.id}>
                <tr className="bg-white hover:bg-gray-50 text-gray-800">
                  <td className="px-6 py-2 text-gray-400">{canopy.id}</td>
                  <td className="px-6 py-2">{canopy.manage_number || "N/A"}</td>
                  <td className="px-6 py-2">{canopy.class_number || "N/A"}</td>
                  <td className="px-6 py-2">
                    <span
                      className={`px-2 py-1 mr-4 inline-block w-20 text-center rounded-xl ${
                        canopy.status_fold
                          ? "bg-[#4dc1e9] text-white"
                          : canopy.status_transmit
                            ? "bg-gray-100 text-gray-800"
                            : "bg-red-600 text-white"
                      }`}
                    >
                      {canopy.status_fold ? "펼쳐짐" : "접힘"}
                    </span>
                    <span
                      className={`mr-4 inline-block w-8 text-center
                      ${canopy.status_transmit ? "text-gray-800" : "text-red-600"}
                      `}
                    >
                      {canopy.status_temperature}℃
                    </span>
                    <span
                      className={`inline-block ml-4 text-center ${
                        canopy.status_transmit
                          ? "text-gray-800"
                          : "text-red-600"
                      }`}
                    >
                      (
                      {canopy.status_transmit
                        ? "수신상태 정상"
                        : "수신상태 불량"}
                      )
                    </span>
                  </td>
                  <td className="px-6 py-2 text-center">
                    <button onClick={() => toggleMenu(canopy.id)}>
                      <Image
                        src={
                          openMenuId === canopy.id
                            ? ControlOn.src
                            : ControlOff.src
                        }
                        alt="Control"
                        width={24}
                        height={24}
                      />
                    </button>
                  </td>
                </tr>
                {openMenuId === canopy.id && (
                  <tr>
                    <td colSpan={3}>&nbsp;</td>
                    <td colSpan={2}>
                      <ControlMenu
                        id={canopy.id}
                        status={canopy}
                        onControlChange={onControlChange}
                      />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TableContainer;
