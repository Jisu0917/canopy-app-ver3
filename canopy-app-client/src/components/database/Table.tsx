/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import Button from "@/components/database/Button";
import { AnyModel } from "@/types/models";

type Accessor<T> = keyof T | `${Extract<keyof T, string>}.${string}`;

interface TableProps<T extends AnyModel, R extends AnyModel> {
  data: T[];
  columns: {
    Header: string;
    accessor: Accessor<T>;
  }[];
  subcolumns?: {
    Header: string;
    accessor: Accessor<T>;
  }[];
  relatedData?: { [key: number]: R[] };
  relatedcolumns?: {
    Header: string;
    accessor: Accessor<R>;
  }[];
  onUpdate: (item: T) => void;
  onDelete: (id: number) => void;
  isButtonsDisabled: boolean;
  expanded?: boolean;
}

const Table = <T extends AnyModel, R extends AnyModel>({
  data,
  columns,
  subcolumns,
  relatedData = {},
  relatedcolumns,
  onUpdate,
  onDelete,
  isButtonsDisabled,
  expanded = false,
}: TableProps<T, R>) => {
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  const getValue = (
    item: Record<string, any>,
    accessor: Accessor<T> | Accessor<R>
  ): any => {
    const accessorString = accessor.toString();

    if (accessorString.startsWith("data.")) {
      const dataObj = item["data"];
      const keys = accessorString.split(".");
      const lastKey = keys.pop()!;
      return dataObj[lastKey];
    }

    return item[accessorString];
  };

  const toggleRow = (id: number) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const renderCell = (value: any) => {
    if (value === null || value === undefined) return "";
    return typeof value === "boolean"
      ? value
        ? "ON"
        : "OFF"
      : value.toString();
  };

  return (
    <table className="w-full border-collapse border">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.accessor.toString()} className="border p-2">
              {col.Header}
            </th>
          ))}
          {relatedcolumns?.map((col) => (
            <th key={col.accessor.toString()} className="border p-2">
              {col.Header}
            </th>
          ))}
          <th className="border p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <React.Fragment key={item.id}>
            <tr>
              {columns.map((col) => (
                <td key={col.accessor.toString()} className="border p-2">
                  {renderCell(getValue(item, col.accessor))}
                </td>
              ))}
              {relatedcolumns?.map((col) => (
                <td key={col.accessor.toString()} className="border p-2">
                  {relatedData[item.id]
                    ?.filter(
                      (relatedItem, index, self) =>
                        index === self.findIndex((t) => t.id === relatedItem.id)
                    )
                    .map((relatedItem, index) => (
                      <span key={index} className="block">
                        {renderCell(getValue(relatedItem, col.accessor))}
                      </span>
                    ))}
                </td>
              ))}
              <td className="border p-2 text-center">
                <Button
                  className="mr-2"
                  dataId={item.id}
                  onClick={() => !isButtonsDisabled && onUpdate(item)}
                >
                  Edit
                </Button>
                <Button
                  dataId={item.id}
                  onClick={() => !isButtonsDisabled && onDelete(item.id)}
                >
                  Delete
                </Button>
                {expanded && (
                  <Button className="ml-2" onClick={() => toggleRow(item.id)}>
                    {expandedRows.includes(item.id) ? "Hide" : "Details"}
                  </Button>
                )}
              </td>
            </tr>
            {expanded && expandedRows.includes(item.id) && subcolumns && (
              <tr className="details-row">
                <td
                  colSpan={
                    columns.length +
                    (relatedcolumns ? relatedcolumns.length : 0) +
                    1
                  }
                  className="border p-2"
                >
                  <p>
                    {subcolumns.map((subCol) => (
                      <span key={subCol.accessor.toString()} className="block">
                        <strong>{subCol.Header}:</strong>{" "}
                        {renderCell(getValue(item, subCol.accessor))}
                      </span>
                    ))}
                  </p>
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
