import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  dataId?: number;
  dataUserId?: string;
  dataName?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  onClick,
  type = "button",
  dataId,
  dataUserId,
  dataName,
}) => (
  <button
    type={type}
    className={`cursor-pointer hover:opacity-80 bg-blue-300 py-1 px-2 rounded-xl border border-blue-400 text-sm ${className}`}
    onClick={onClick}
    data-id={dataId}
    data-user-id={dataUserId}
    data-name={dataName}
  >
    {children}
  </button>
);

export default Button;
