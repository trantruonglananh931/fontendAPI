import React from "react";

type TableProps<T> = {
  headers: string[];
  data: T[];
  renderRow: (item: T) => React.ReactNode;
  emptyMessage?: string;
};

function Table<T>({ headers, data, renderRow, emptyMessage }: TableProps<T>) {
  return (
     <div className="max-w-screen-xl mx-auto bg-white mb-5 mt-5">
          <div className="overflow-hidden border border-gray-200 rounded-sm">
               <table className="w-full text-left">
               <thead className="bg-gray-100">
                    <tr className="text-gray-700">
                    {headers.map((header, index) => (
                    <th key={index} className="py-3 px-4">
                         {header}
                    </th>
                    ))}
                    </tr>
               </thead>
               <tbody>
                    {data.length === 0 ? (
                    <tr>
                    <td colSpan={headers.length} className="text-center py-4 text-gray-600">
                         {emptyMessage || "No data available."}
                    </td>
                    </tr>
                    ) : (
                    data.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                         {renderRow(item)}
                    </tr>
                    ))
                    )}
               </tbody>
               </table>
          </div>
     </div>
  );
}

export default Table;
