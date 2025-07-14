'use client';

import { Patient } from "../classes/Patient";

type PatientStatus = 'WAITING' | 'CALLED' | 'COMPLETED' | 'CANCELLED';

export default function PatientCard({ patient }: { patient: Patient }) {
  const statusColor: Record<PatientStatus, string> = {
    WAITING: "text-black",
    CALLED: "text-blue-600",
    COMPLETED: "text-green-600",
    CANCELLED: "text-red-600",
  };

  const renderButtons = () => {
    switch (patient.status) {
      case 'WAITING':
        return (
          <button className="bg-blue-500 text-white px-4 py-1 rounded mt-3 text-sm font-medium hover:bg-blue-600">
            Call
          </button>
        );
      case 'CALLED':
        return (
          <div className="flex flex-wrap gap-2 mt-3">
            <button className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">Complete</button>
            <button className="bg-sky-500 text-white px-3 py-1 rounded text-sm hover:bg-sky-600">Recall</button>
            <button className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600">Skip</button>
            <button className="bg-rose-500 text-white px-3 py-1 rounded text-sm hover:bg-rose-600">Cancel</button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white shadow rounded-xl p-4 border border-gray-200">
      <div className="flex items-center justify-between">
        <h3 className={`text-lg font-bold ${statusColor[patient.status as PatientStatus]}`}>
          {patient.patientNumber}
        </h3>
        <div className="text-right">
          <p className="text-xs font-semibold text-gray-600">Lab Reg</p>
          <p className="text-sm text-black font-semibold">{patient.labReg}</p>
        </div>
      </div>
      <p className="text-sm mt-1 text-black font-medium">Sample ({patient.outlet})</p>
      <p className="text-sm text-black font-medium">{patient.outlet}</p>

      {(patient.status === 'CALLED' || patient.status === 'COMPLETED' || patient.status === 'CANCELLED') && (
        <p className="text-sm text-black font-medium mt-1">Meja 10</p>
      )}

      <div className="mt-2">
        <span className="text-yellow-400 text-xl font-medium">★ ★</span>
      </div>

      {renderButtons()}
    </div>
  );
}
