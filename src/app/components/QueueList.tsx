'use client'

import { QueueItem } from "../classes/Queue";

export default function QueueList({ items }: { items: QueueItem[] }) {
  return (
    <div className="w-1/2 border-r border-gray-200 px-6 py-4">
      <table className="w-full text-left table-auto">
        <thead className="border-b border-gray-300">
          <tr className="text-gray-600 text-xl">
            <th className="py-4 px-6 text-center">Antrian</th>
            <th className="py-4 px-6 text-center">Meja</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index} className="border-b border-gray-200 text-black text-lg text-center">
              <td className="py-4 px-6 font-semibold align-middle">{item.number}</td>
              <td className="py-4 px-6 align-middle">{item.table}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
