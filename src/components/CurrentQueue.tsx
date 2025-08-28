'use client'

import { Patient } from "@/app/classes/Patient";

export default function CurrentQueue({ patient }: { patient: Patient }) {
  return (
    <>
      <div className="border-b border-gray-700 w-full text-center">
        <h2 className="text-black mb-2 text-3xl font-semibold">Antrian</h2>
        <p className="text-9xl font-extrabold mb-4 text-green-400">{patient.patientNumber}</p>
      </div>
      <div className="border-b border-gray-700 w-full text-center">
        <h2 className="text-black mb-2 text-3xl mt-4 font-semibold">Oulet</h2>
        <p className="text-9xl font-extrabold mb-4 text-green-400">{patient.loketId}</p>
      </div>
      <div className="w-full text-center">
        <h2 className="text-black mb-2 text-3xl font-semibold mt-4">Status</h2>
        <p className="text-9xl font-bold text-blue-400">CALL</p>
      </div>
    </>
  );
}
