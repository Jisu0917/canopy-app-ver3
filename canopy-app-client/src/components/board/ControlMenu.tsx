import React, { useState } from "react";
import Image from "next/image";
import { CanopyData } from "@/types/models";
import Loading from "@/assets/images/loading.gif";

interface ControlMenuProps {
  id: number;
  status: CanopyData;
  onControlChange: (id: number, control: string, value: boolean) => void;
}

const ControlMenu: React.FC<ControlMenuProps> = ({
  id,
  status,
  onControlChange,
}) => {
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

  const controls = [
    { name: "fold", label: "그늘막 펴기/접기", status: status.status_fold },
    { name: "motor", label: "모터 작동", status: status.status_motor },
    { name: "led", label: "LED 작동", status: status.status_led },
    { name: "sound", label: "스피커 작동", status: status.status_sound },
    { name: "inform", label: "안내멘트 작동", status: status.status_inform },
  ];

  const handleToggle = (control: string, currentStatus: boolean | null) => {
    setLoading({ ...loading, [control]: true });
    onControlChange(id, control, !currentStatus);

    // Simulate WebSocket response
    setTimeout(() => {
      setLoading({ ...loading, [control]: false });
    }, 2000);
  };

  return (
    <div className="bg-gray-100 p-4 space-y-2">
      {controls.map((control) => (
        <div key={control.name} className="flex justify-between items-center">
          <span>{control.label}</span>
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
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          )}
        </div>
      ))}
    </div>
  );
};

export default ControlMenu;
