'use client'

import { useEffect, useState } from "react";
import { Patient } from "../classes/Patient";
import PatientCard from "./PatientCard";

export default function QueuePatient() {
  type PatientStatus = 'WAITING' | 'CALLED' | 'COMPLETED' | 'CANCELLED';

  type PatientMap = {
    [key in PatientStatus]: Patient[];
  };

  const [patientsByStatus, setPatientsByStatus] = useState<PatientMap>({
    WAITING: [],
    CALLED: [],
    COMPLETED: [],
    CANCELLED: [],
  });

  useEffect(() => {
    const statuses: PatientStatus[] = ['WAITING', 'CALLED', 'COMPLETED', 'CANCELLED'];
    const grouped: PatientMap = {
      WAITING: [],
      CALLED: [],
      COMPLETED: [],
      CANCELLED: [],
    };

    let globalId = 1;
    statuses.forEach((status) => {
      for (let i = 0; i < 3; i++) {
        grouped[status].push(
          new Patient(
            globalId, // id unik
            i + 1, // nomor urut di status tersebut
            `U-${globalId.toString().padStart(3, '0')}`,
            `LAB-${1000 + globalId}`,
            'IPRJ',
            status
          )
        );
        globalId++;
      }
    });

    setPatientsByStatus(grouped);
  }, []);

  const statusTitles = {
    WAITING: 'Waiting',
    CALLED: 'Called',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
  };

  return (
    <div className="= rounded-xl p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <div className="flex items-center gap-2 font-semibold text-gray-800 text-sm mb-2 md:mb-0">
          <img src="/icons/patient.svg" alt="Patient Icon" className="w-5" />
          Patient List
        </div>
        <div className="flex gap-2 md:items-center text-gray-400">
          Search Patient
          <input
            type="text"
            placeholder="No. Patient / Lab Reg / Ruang..."
            className="px-3 py-2 border border-gray-300 bg-white rounded-md text-sm w-64"
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition">
            Cari
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.entries(patientsByStatus).map(([status, patients]) => (
          <div key={status}>
            <h3 className="font-bold text-lg mb-2">{statusTitles[status as keyof typeof statusTitles]}</h3>
            <div className="space-y-4">
              {patients.map((patient) => (
                <PatientCard key={patient.id} patient={patient} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
