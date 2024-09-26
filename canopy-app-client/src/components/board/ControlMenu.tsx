import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { CanopyData } from "@/types/models";
import Loading from "@/assets/images/loading.gif";
import useSocketIO from "@/hooks/useSocketIO";

interface ControlMenuProps {
  id: number;
  status: CanopyData;
  userId: string;
}

type ControlName = "fold" | "motor" | "led" | "sound" | "inform";
type StatusKey = `status_${ControlName}`;

const ControlMenu: React.FC<ControlMenuProps> = ({ id, status, userId }) => {
  const [loading, setLoading] = useState<{ [key in ControlName]: boolean }>({
    fold: false,
    motor: false,
    led: false,
    sound: false,
    inform: false,
  });
  const [localStatus, setLocalStatus] = useState(status);
  const { sendControlCommand, commandResults } = useSocketIO("admin", userId);

  useEffect(() => {
    setLocalStatus(status);
  }, [status]);

  useEffect(() => {
    if (commandResults) {
      Object.entries(commandResults).forEach(([command, result]) => {
        if (typeof result === "boolean") {
          setLocalStatus((prev) => ({
            ...prev,
            [`status_${command}`]: result,
          }));
          console.log(
            `Updated status for ${command} to ${result} based on commandResults`
          );
        }
        setLoading((prev) => ({
          ...prev,
          [command as ControlName]: false,
        }));
      });
    }
  }, [commandResults]);

  const handleToggle = useCallback(
    async (control: ControlName, currentStatus: boolean) => {
      setLoading((prevLoading) => ({ ...prevLoading, [control]: true }));
      const newStatus = !currentStatus;

      try {
        const success = await sendControlCommand(id, control, newStatus);
        console.log(`Control change result for ${control}: ${success}`);

        if (success) {
          setLocalStatus((prevStatus) => ({
            ...prevStatus,
            [`status_${control}`]: newStatus,
          }));
          console.log(`Updated local status for ${control} to ${newStatus}`);
        } else {
          console.log(
            `Control change failed for ${control}, keeping original state: ${currentStatus}`
          );
        }
      } catch (error) {
        console.error("Control change error:", error);
      } finally {
        setLoading((prevLoading) => ({ ...prevLoading, [control]: false }));
      }
    },
    [id, sendControlCommand]
  );

  const getControlStatus = (statusKey: StatusKey): boolean => {
    const value = localStatus[statusKey];
    return typeof value === "boolean" ? value : false;
  };

  const controls: Array<{ name: ControlName; label: string }> = [
    { name: "fold", label: "수동 펼침 / 접힘" },
    { name: "motor", label: "모터 정지" },
    { name: "led", label: "조명" },
    { name: "sound", label: "사운드" },
    { name: "inform", label: "정보갱신" },
  ];

  return (
    <div className="bg-transparent pb-3 pl-40 pr-8 space-y-3">
      {controls.map((control) => {
        const statusKey = `status_${control.name}` as StatusKey;
        const isChecked = getControlStatus(statusKey);
        return (
          <div
            key={control.name}
            className="flex justify-between items-center h-7"
          >
            <span
              className={`${isChecked ? "text-gray-800" : "text-gray-400"}`}
            >
              {control.label}
            </span>
            {loading[control.name] ? (
              <Image
                src={Loading.src}
                alt="Loading"
                width={24}
                height={24}
                unoptimized
              />
            ) : (
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={isChecked}
                  onChange={() => handleToggle(control.name, isChecked)}
                  disabled={loading[control.name]}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-[#4dc1e9] rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#4dc1e9]"></div>
              </label>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ControlMenu;
