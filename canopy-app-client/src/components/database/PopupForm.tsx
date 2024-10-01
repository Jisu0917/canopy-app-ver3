/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { AnyModel, AnyData } from "@/types/models";
import { RelatedData, Option } from "@/types/data";
import FormGroup from "@/components/database/FormGroup";
import Button from "@/components/database/Button";

interface PopupFormProps<T extends AnyModel> {
  model: T;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onCheckboxChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
  isUpdate: boolean;
  fields: {
    [K in keyof AnyData]: {
      label: string;
      type: string;
      required?: boolean;
    };
  };
  relatedData?: { [key: number]: RelatedData[] };
  relatedFields?: {
    [key: string]: {
      label: string;
      type: string;
      required: boolean;
    };
  };
}

const PopupForm = <T extends AnyModel>({
  model,
  onChange,
  onCheckboxChange,
  onSubmit,
  onClose,
  isUpdate,
  fields,
  relatedData = {},
  relatedFields = {},
}: PopupFormProps<T>) => {
  const getFieldValue = (value: any, type: string) => {
    if (type === "number" && value === 0) return "";
    if (type === "password" && isUpdate) return "";
    return value ? value.toString() : "";
  };

  const generateOptions = (fieldKey: string): Option[] => {
    const options: Option[] = [];
    if (relatedData) {
      for (const key in relatedData) {
        relatedData[key].forEach((item) => {
          if (fieldKey in item.data) {
            options.push({
              id: item.id,
              label: item.data[fieldKey], // fieldKey를 사용하여 label 설정
            });
          }
        });
      }
    }
    // 중복 제거
    return options.filter(
      (option, index, self) =>
        index === self.findIndex((t) => t.id === option.id)
    );
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* 메인 데이터 필드 */}
      {Object.entries(fields).map(([key, { label, type, required }]) => {
        const value = model.data
          ? model.data[key as keyof AnyData]
          : (undefined as unknown);

        return type === "checkbox" ? (
          <FormGroup
            key={key}
            label={label}
            id={key}
            name={key}
            checked={value as boolean}
            type="checkbox"
            onChange={onCheckboxChange || onChange}
          />
        ) : (
          <FormGroup
            key={key}
            label={label}
            id={key}
            name={key}
            value={getFieldValue(value, type)}
            type={type}
            onChange={onChange}
            required={required}
            placeholder={`${label}를(을) 입력하세요.`}
          />
        );
      })}

      {relatedFields &&
        Object.entries(relatedFields).map(
          ([key, { label, type, required }]) => {
            if (type === "text") {
              return (
                <FormGroup
                  key={key}
                  label={label}
                  id={key}
                  name={key}
                  type={type}
                  onChange={onChange}
                  required={required}
                  placeholder={label}
                />
              );
            } else {
              const options = generateOptions(key);
              const value = model.data
                ? model.data[key as keyof AnyData]
                : undefined;

              return (
                <FormGroup
                  key={key}
                  label={label}
                  id={key}
                  name={key}
                  value={value}
                  type={type}
                  options={options}
                  onChange={onChange}
                  required={required}
                  placeholder={`Select ${label}`}
                />
              );
            }
          }
        )}

      <div className="flex justify-end space-x-4">
        <Button type="button" onClick={onClose}>
          닫기
        </Button>
        <Button type="submit">{isUpdate ? "수정" : "추가"}</Button>
      </div>
    </form>
  );
};

export default PopupForm;
