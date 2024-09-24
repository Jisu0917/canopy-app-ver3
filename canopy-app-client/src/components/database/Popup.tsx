import React from "react";

interface PopupProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Popup: React.FC<PopupProps> = ({
  id,
  isOpen,
  onClose,
  title,
  children,
}) => {
  return (
    <div
      className={`fixed inset-0 bg-gray-500 bg-opacity-50 flex items-end justify-end z-40 ${
        isOpen ? "flex" : "hidden"
      }`}
    >
      <div
        id={id}
        className="w-96 bg-white shadow-lg flex flex-col p-5 rounded-lg m-4"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <span className="cursor-pointer text-xl" onClick={onClose}>
            &times;
          </span>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Popup;
