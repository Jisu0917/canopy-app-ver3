import React, { useState, useEffect } from "react";
import Image from "next/image";
import { CanopyData } from "@/types/models";
import Loading from "@/assets/images/loading.gif";

interface ControlMenuProps {
  id: number;
  status: CanopyData;
  onControlChange: (
    id: number,
    control: string,
    value: boolean
  ) => Promise<boolean>;
}

const ControlMenu: React.FC<ControlMenuProps> = ({
  id,
  status,
  onControlChange,
}) => {
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [localStatus, setLocalStatus] = useState(status);

  useEffect(() => {
    setLocalStatus(status);
  }, [status]);

  const controls = [
    {
      name: "fold",
      label: "수동 펼침 / 접힘",
      status: localStatus.status_fold,
    },
    { name: "motor", label: "모터 정지", status: localStatus.status_motor },
    { name: "led", label: "조명", status: localStatus.status_led },
    { name: "sound", label: "사운드", status: localStatus.status_sound },
    {
      name: "inform",
      label: "정보갱신",
      status: localStatus.status_inform,
    },
  ];

  const handleToggle = async (
    control: string,
    currentStatus: boolean | null
  ) => {
    setLoading({ ...loading, [control]: true });
    const newStatus = !currentStatus;

    try {
      const success = await onControlChange(id, control, newStatus);
      if (success) {
        setLocalStatus((prevStatus) => ({
          ...prevStatus,
          [`status_${control}`]: newStatus,
        }));
      }
    } catch (error) {
      console.error("Control change failed:", error);
    } finally {
      setLoading({ ...loading, [control]: false });
    }
  };

  return (
    <div className="bg-transparent pb-3 pl-40 pr-8 space-y-3">
      {controls.map((control) => (
        <div
          key={control.name}
          className="flex justify-between items-center h-7"
        >
          <span
            className={`${control.status ? "text-gray-800" : "text-gray-400"}`}
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
                checked={control.status ?? false}
                onChange={() => handleToggle(control.name, control.status)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-[#4dc1e9] rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#4dc1e9]"></div>
            </label>
          )}
        </div>
      ))}
    </div>
  );
};

export default ControlMenu;
