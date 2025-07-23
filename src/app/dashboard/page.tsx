'use client';

import { useState } from "react";
import { Stat } from "../classes/Stat";
import { Patient } from "../classes/Patient";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import PatientTable from "../components/PatientTable";
import Header from "../components/Header";

export default function DashboardPage() {
  const [collapsed, setCollapsed] = useState(false);
  const toggleSidebar = () => setCollapsed(!collapsed);

  const stats = [
    new Stat('Waiting', 26, '/icons/wait.svg', 'text-black'),
    new Stat('Called', 2, '/icons/called.svg', 'text-black'),
    new Stat('Completed', 17, '/icons/completed.svg', 'text-black'),
    new Stat('Cancelled', 8, '/icons/cancelled.svg', 'text-black'),
  ];

  const patient = new Patient(1, 1, 'F-100', '120983189', 'IPRJ', 'COMPLETED');
  const patients = Array.from({ length: 10 }, (_, i) =>
    new Patient(i + 1, i + 1, patient.patientNumber, patient.labReg, patient.outlet, patient.status)
  );

  return (
    <div className="flex">
      <Sidebar collapsed={collapsed} toggle={toggleSidebar} />
      <div className="flex-1 p-2 bg-gray-50 min-h-screen">
        <Header />
        <div className="grid grid-cols-2 pt-4 md:grid-cols-4 gap-4 mb-6">
          {stats.map((s, i) => (
            <StatCard key={i} title={s.title} value={s.value} icon={s.icon} color={s.color} />
          ))}
        </div>
        <PatientTable data={patients} />
      </div>
    </div>
  );
}
