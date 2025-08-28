'use client'

import { QueueItem } from "@/app/classes/Queue";

interface QueueListProps {
  items: QueueItem[];
}

export default function QueueList({ items }: QueueListProps) {
  const limitedItems = items.slice(0, 5);

  return (
    <div className="w-full border-gray-700 px-6 py-4">
      <table className="w-full text-left table-auto">
        <thead className="border-b border-gray-700">
          <tr className="text-black text-xl">
            <th className="py-4 px-6 text-center">Antrian</th>
            <th className="py-4 px-6 text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          {limitedItems.map((item, index) => (
            <tr key={index} className="border-b border-gray-700 text-black text-lg text-center">
              <td className="py-4 px-6 align-middle">{item.number}</td>
              <td className="py-4 px-6 align-middle text-yellow-400">WAITING</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

