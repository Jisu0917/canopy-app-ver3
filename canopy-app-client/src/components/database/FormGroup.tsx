import React from "react";
import { Option } from "@/types/data";

interface FormGroupProps {
  label: string;
  id: string;
  name: string;
  placeholder?: string;
  value?: string | number; // value 속성을 optional로 추가
  type?: string; // type 속성을 optional로 추가
  checked?: boolean;
  options?: Option[]; // options 속성 추가
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void; // onChange 핸들러 수정
  disabled?: boolean;
  required?: boolean;
}

const FormGroup: React.FC<FormGroupProps> = ({
  label,
  id,
  name,
  placeholder,
  value,
  type = "text", // 기본 type은 text
  checked = false,
  options,
  onChange,
  disabled = false,
  required = false,
}) => {
  if (type === "select" && options) {
    return (
      <div className="mb-4">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <select
          id={id}
          name={name}
          value={value}
          onChange={
            onChange as (e: React.ChangeEvent<HTMLSelectElement>) => void
          }
          disabled={disabled}
          required={required}
          className="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm focus:ring-indigo-400 focus:border-indigo-500 sm:text-sm p-2"
        >
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className={type !== "checkbox" ? "mb-4" : "inline-block align-center"}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={type !== "checkbox" ? placeholder : undefined} // Only set placeholder for non-checkbox inputs
        value={type !== "checkbox" ? value : undefined} // Only set value for non-checkbox inputs
        checked={type === "checkbox" ? checked : undefined} // Only set checked for checkboxes
        onChange={onChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
        disabled={disabled}
        required={required}
        className={
          type !== "checkbox"
            ? "mt-1 block w-full border border-gray-300 rounded-xl shadow-sm focus:ring-indigo-400 focus:border-indigo-500 sm:text-sm p-2"
            : "mt-1 inline-block align-top ml-1 mr-6 mb-6 px-4 py-2 focus:ring-indigo-400 focus:border-indigo-500"
        }
      />
    </div>
  );
};

export default FormGroup;
