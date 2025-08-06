"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { Patient } from "../classes/Patient";

interface PatientListProps {
  patients: Patient[];
  onCallPatient: (patient: Patient) => void;
}

export default function PatientList({ patients, onCallPatient }: PatientListProps) {
  const [search, setSearch] = useState("");

  const filteredPatients = patients.filter((p) =>
    p.patientNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center mb-4">
        <img src="/icons/patient.svg" alt="User Icon" className="w-5 h-5 mr-2" />
        <h2 className="text-xl1 font-semibold text-gray-800">Queue Patient</h2>
      </div>

      <div className="flex mb-4 gap-2">
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-3 py-2 border bg-white border-gray-300 rounded-md focus:outline-none"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md">
          Cari
        </button>
      </div>

      <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-230px)] pr-1">
        {filteredPatients.map((patient) => (
          <div key={patient.id} className="bg-white shadow rounded-xl p-4 border border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-800">{patient.patientNumber}</h3>
              <div className="flex gap-1 text-blue-500">
                <div className="w-5 h-5 bg-blue-500 rounded-full" />
                <div className="w-5 h-5 bg-blue-500 rounded-full" />
              </div>
            </div>

            <p className="text-sm text-gray-600 mt-1">Lab Reg: {patient.labReg}</p>

            <div className="flex justify-end mt-3">
              <button onClick={() => onCallPatient(patient)} className="border rounded-md p-1 text-gray-600 hover:bg-gray-100">
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
