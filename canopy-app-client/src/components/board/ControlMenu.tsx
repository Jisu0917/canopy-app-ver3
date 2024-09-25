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
      label: "그늘막 펴기/접기",
      status: localStatus.status_fold,
    },
    { name: "motor", label: "모터 작동", status: localStatus.status_motor },
    { name: "led", label: "LED 작동", status: localStatus.status_led },
    { name: "sound", label: "스피커 작동", status: localStatus.status_sound },
    {
      name: "inform",
      label: "안내멘트 작동",
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
    <div className="bg-transparent py-2 pl-40 pr-8 space-y-2">
      {controls.map((control) => (
        <div key={control.name} className="flex justify-between items-center">
          <span className="text-gray-500">{control.label}</span>
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
              <div className="w-11 h-6 bg-gray-100 peer-focus:outline-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-[#4dc1e9] rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#4dc1e9]"></div>
            </label>
          )}
        </div>
      ))}
    </div>
  );
};

export default ControlMenu;
