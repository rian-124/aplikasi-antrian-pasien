// QueueStats.tsx
"use client";

import { useEffect, useState } from "react";

interface Loket {
  id: number;
  nama_loket: string;
  in_use?: boolean;
}

interface QueueStatsProps {
  stats: { TOTAL: number; COMPLETE: number; CANCELED: number; WAITING: number };
  activeFilter: string;
  onFilterChange: (status: string) => void;
  onLoketChange: (loket: string) => void;
  onExit: () => void;
  lokets: Loket[];
  selectedLoket: string;
  disableLoket?: boolean;
  disableExit?: boolean;
}

export default function QueueStats({
  stats,
  activeFilter,
  onFilterChange,
  onLoketChange,
  onExit,
  lokets,
  selectedLoket,
  disableLoket = false,
  disableExit = false,
}: QueueStatsProps) {
  const [loket, setLoket] = useState(selectedLoket || "");
  const [availableLokets, setAvailableLokets] = useState<Loket[]>([]);

  useEffect(() => {
    setAvailableLokets(lokets);
  }, [lokets]);

  useEffect(() => {
    if (lokets.length === 0) return;
    const saved = localStorage.getItem("selectedLoket");
    if (saved && lokets.some((l) => l.id.toString() === saved)) {
      setLoket(saved);
      onLoketChange(saved);
    }
  }, [lokets, onLoketChange]);

  const handleLoketChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setLoket(value);
    localStorage.setItem("selectedLoket", value);
    onLoketChange(value);
  };

  const handleExit = () => {
    localStorage.removeItem("selectedLoket");
    setLoket("");
    onExit();
  };

  const statusList = [
    { key: "TOTAL", label: "Total Antrian" },
    { key: "WAITING", label: "Menunggu" },
    { key: "COMPLETE", label: "Selesai" },
    { key: "CANCELED", label: "Dibatalkan" },
  ];

  return (
    <div className="flex flex-col space-y-6 p-1">
      <div className="flex flex-col gap-3 bg-white shadow-md p-4 rounded-xl">
        {availableLokets.length > 0 && (
          <select
            value={loket}
            onChange={handleLoketChange}
            disabled={disableLoket}
            className="border rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
          >
            <option value="">Pilih Loket</option>
            {availableLokets.map((l) => (
              <option key={l.id} value={l.id.toString()}>
                {l.nama_loket} {l.in_use && l.id.toString() === loket ? "(Anda)" : ""}
              </option>
            ))}
          </select>
        )}

        <button
          onClick={handleExit}
          disabled={disableExit || !loket}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Keluar
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {statusList.map((status) => (
          <button
            key={status.key}
            onClick={() => onFilterChange(status.key)}
            className={`w-full bg-white rounded-xl shadow-lg flex flex-col items-center justify-center p-6 transition-transform hover:scale-105 ${
              activeFilter === status.key ? "ring-2 ring-blue-500" : ""
            }`}
          >
            <div className="text-4xl font-bold mb-2">
              {stats[status.key as keyof typeof stats] ?? 0}
            </div>
            <h3 className="text-lg font-semibold">{status.label}</h3>
          </button>
        ))}
      </div>
    </div>
  );
}
