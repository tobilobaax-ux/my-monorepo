import React from 'react';

interface TableRow {
  label: string;
  count: number;
}

interface AnalyticsTableProps {
  title: string;
  headers: string[];
  data: TableRow[];
}

const AnalyticsTable: React.FC<AnalyticsTableProps> = ({ title, headers, data }) => (
  <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
    <div className="mb-6">
       <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{title}</span>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-50">
            {headers.map(header => (
              <th key={header} className="pb-4 text-[9px] font-black text-gray-300 uppercase tracking-widest">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {data.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="py-8 text-center text-xs text-gray-400 font-bold italic uppercase">No Data Recorded</td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr key={i} className="group hover:bg-gray-50/50 transition-all">
                <td className="py-5 text-[11px] font-bold text-gray-900 tracking-tight truncate max-w-[200px]">
                  {row.label}
                </td>
                <td className="py-5 text-[11px] font-black text-gray-900 tabular-nums">
                  {row.count}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default AnalyticsTable;
