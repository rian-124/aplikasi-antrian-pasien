'use client';

import React from "react";

type Props = {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  stats: {
    TOTAL: number;
    COMPLETED: number;
    CANCELLED: number;
    WAITING: number;
  };
};

const statusList = ["TOTAL", "COMPLETED", "CANCELLED", "WAITING"];

const QueueStats: React.FC<Props> = ({ activeFilter, onFilterChange, stats }) => {
  return (
    <div className="grid grid-cols-1 gap-4 h-182 pl-3 pr-3 pt-1 pb-1">
      {statusList.map((status) => (
        <button
          key={status}
          onClick={() => onFilterChange(status)}
          className={`w-full h-full bg-white rounded-xl shadow-lg flex flex-col items-center justify-center p-6 transition-transform hover:scale-105 ${
            activeFilter === status ? "" : ""
          }`}
        >
          <div className="text-4xl font-bold mb-3">
            {stats[status as keyof typeof stats]}
          </div>
          <h3 className="text-lg font-semibold">{status}</h3>
        </button>
      ))}
    </div>
  );
};

export default QueueStats;
