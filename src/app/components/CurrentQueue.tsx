'use client'

import { Patient } from "../classes/Patient";
import { jenisRegistrasiMap } from "../classes/jenisRegistrasiMap";

export default function CurrentQueue({ patient }: { patient: Patient }) {
  return (
    <div className="w-1/2 flex flex-col justify-center items-center text-center">
      <div className="border-b border-gray-300 w-full py-6">
        <h2 className="text-gray-700 mb-2 text-1xl font-semibold">Antrian</h2>
        <p className="text-9xl font-extrabold mb-10 text-green-500">{patient.patientNumber}</p>
      </div>
      <div className="border-b border-gray-300 w-full py-4">
        <h2 className="text-gray-700 mb-2 mt-10 font-semibold">Meja</h2>
        <p className="text-9xl font-extrabold mb-10 text-green-500">{patient.loketId}</p>
      </div>
      <div className="w-full py-4">
        <h2 className="text-gray-700 mb-2 font-semibold mt-10">Jenis</h2>
        <p className="text-3xl font-bold text-black">
          {jenisRegistrasiMap[patient.jenisRegistrasiId] ?? "-"}
        </p>
      </div>
    </div>
  );
}
