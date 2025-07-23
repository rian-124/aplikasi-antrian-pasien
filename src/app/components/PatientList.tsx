'use client';

import { useState } from "react";
import { Patient } from "../classes/Patient";
import PatientCard from "./PatientCard";

interface PatientListProps {
  patients: Patient[];
}

export default function PatientList({ patients }: PatientListProps) {
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
          <PatientCard key={patient.id} patient={patient} />
        ))}
      </div>
    </div>
  );
}
