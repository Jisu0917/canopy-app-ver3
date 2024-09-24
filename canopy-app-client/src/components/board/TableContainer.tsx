import React, { useState } from "react";
import Image from "next/image";
import { CanopyData } from "@/types/models";
import ControlMenu from "./ControlMenu";
import ControlOn from "@/assets/icons/ic_control_on.ico";
import ControlOff from "@/assets/icons/ic_control_off.ico";

interface TableContainerProps {
  data: CanopyData[];
  onControlChange: (id: number, control: string, value: boolean) => void;
}

const TableContainer: React.FC<TableContainerProps> = ({
  data,
  onControlChange,
}) => {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const toggleMenu = (id: number) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3">
              관리 번호
            </th>
            <th scope="col" className="px-6 py-3">
              구분 번호
            </th>
            <th scope="col" className="px-6 py-3">
              그늘막 상태
            </th>
            <th scope="col" className="px-6 py-3 text-center">
              제어
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((canopy) => (
            <React.Fragment key={canopy.id}>
              <tr className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4">{canopy.manage_number}</td>
                <td className="px-6 py-4">{canopy.class_number}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded ${canopy.status_fold ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}
                  >
                    {canopy.status_fold ? "펼쳐짐" : "접힘"}
                  </span>
                  <span className="ml-2">{canopy.status_temperature}℃</span>
                  <span
                    className={`ml-2 ${canopy.status_transmit ? "text-green-600" : "text-red-600"}`}
                  >
                    (
                    {canopy.status_transmit ? "수신상태 정상" : "수신상태 불량"}
                    )
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
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
                  <td colSpan={4}>
                    <ControlMenu
                      id={canopy.id}
                      status={canopy}
                      onControlChange={onControlChange}
                    />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableContainer;
