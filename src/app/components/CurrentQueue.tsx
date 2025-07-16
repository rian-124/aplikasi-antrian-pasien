'use client'

import { QueueItem } from "../classes/Queue";

export default function CurrentQueue({ item }: { item: QueueItem }) {
  return (
    <div className="w-1/2 flex flex-col justify-center items-center text-center">
      <div className="border-b border-gray-300 w-full py-6">
        <h2 className="text-gray-700 mb-2 text-1xl font-semibold">Antrian</h2>
        <p className="text-9xl font-extrabold mb-10 text-green-500">{item.number}</p>
      </div>
      <div className="border-b border-gray-300 w-full py-4">
        <h2 className="text-gray-700 mb-2 mt-10 font-semibold">Meja</h2>
        <p className="text-9xl font-extrabold mb-10 text-green-500">{item.table}</p>
      </div>
      <div className="w-full py-4">
        <h2 className="text-gray-700 mb-2 font-semibold mt-10">Jenis</h2>
        <p className="text-3xl font-bold text-black">{item.type}</p>
      </div>
    </div>
  );
}