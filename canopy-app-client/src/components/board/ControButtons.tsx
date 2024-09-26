import React from "react";

interface ControlButtonsProps {
  onConfirm: () => void;
  onControlConfirm: () => void;
  onSave: () => void;
}

const ControlButtons: React.FC<ControlButtonsProps> = ({
  onConfirm,
  onControlConfirm,
  onSave,
}) => {
  return (
    <div className="flex justify-end items-start flex-nowrap mx-5 mt-0 mr-24 max-w-full box-border">
      <table className="w-[50%] h-14 table-fixed font-light">
        <tbody>
          <tr className="flex">
            <td className="flex-1 p-[7px_5px]">
              <input
                type="text"
                placeholder="관리 번호"
                className="py-2 px-8 border border-white rounded-sm bg-white text-sm max-h-[50px] w-full text-[#3d3d3d] box-border placeholder-[#b2b0b0]"
              />
            </td>
            <td className="flex-1 p-[7px_5px]">
              <input
                type="text"
                placeholder="구분 번호"
                className="py-2 px-8 border border-white rounded-sm bg-white text-sm max-h-[50px] w-full text-[#3d3d3d] box-border placeholder-[#b2b0b0]"
              />
            </td>
            <td className="p-[7px_5px]">
              <button
                onClick={onConfirm}
                className="rounded-sm text-sm h-[100%] px-8 text-white opacity-100 transition-opacity duration-300 ease-in-out box-border border border-[#a9a9a9] bg-[#a9a9a9] hover:opacity-80 hover:cursor-pointer whitespace-nowrap"
              >
                확인
              </button>
            </td>
            <td className="p-[7px_5px]">
              <button
                onClick={onControlConfirm}
                className="rounded-sm text-sm h-[100%] px-8 text-white opacity-100 transition-opacity duration-300 ease-in-out box-border border border-[#4dc1e9] bg-[#4dc1e9] hover:opacity-80 hover:cursor-pointer whitespace-nowrap"
              >
                그늘막 연동 확인
              </button>
            </td>
            <td className="p-[7px_5px]">
              <button
                onClick={onSave}
                className="rounded-sm text-sm h-[100%] px-8 text-white opacity-100 transition-opacity duration-300 ease-in-out box-border border border-[#4b4b4b] bg-[#4b4b4b] hover:opacity-80 hover:cursor-pointer whitespace-nowrap"
              >
                저장
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ControlButtons;
