'use client';

import { Patient } from "../classes/Patient";
import { ArrowRight, Circle, Star } from "lucide-react";

export default function PatientCard({ patient }: { patient: Patient }) {
  return (
    <div className="bg-white shadow rounded-xl p-4 border border-gray-200">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-800">{patient.patientNumber}</h3>
        <div className="flex gap-1 text-blue-500">
          <Circle fill="currentColor" className="w-5 h-5" />
          <Circle fill="currentColor" className="w-5 h-5" />
        </div>
      </div>

      <p className="text-sm text-gray-600 mt-1">Lab Reg: {patient.labReg}</p>

      <div className="flex justify-end mt-3">
        <button className="border rounded-md p-1 text-gray-600 hover:bg-gray-100">
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
