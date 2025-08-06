"use client";

import { useState, useEffect } from "react";
import { Stat } from "../classes/Stat";
import { Patient } from "../classes/Patient";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import PatientTable from "../components/PatientTable";
import Header from "../components/Header";

export default function DashboardPage() {
  const [collapsed, setCollapsed] = useState(false);
  const toggleSidebar = () => setCollapsed(!collapsed);

  const [patients, setPatients] = useState<Patient[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch("http://192.168.50.2:4000/api/antrian-pasien", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const json = await res.json();
      const fetchedPatients: Patient[] = json.data.map((p: any, index: number) => Patient.fromJSON(p, index));
      setPatients(fetchedPatients);

      const waitingCount = fetchedPatients.filter(p => p.status === 'WAITING').length;
      const completedCount = fetchedPatients.filter(p => p.status === 'COMPLETE').length;
      const canceledCount = fetchedPatients.filter(p => p.status === 'CANCELED').length;
      const totalCount = fetchedPatients.length;

      const newStats: Stat[] = [
        new Stat('Total', totalCount, '/icons/called.svg', 'text-black'),
        new Stat('Waiting', waitingCount, '/icons/wait.svg', 'text-black'),
        new Stat('Completed', completedCount, '/icons/completed.svg', 'text-black'),
        new Stat('Cancelled', canceledCount, '/icons/cancelled.svg', 'text-black'),
      ];

      setStats(newStats);
    } catch (error) {
      console.error("Failed to fetch patients:", error);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

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
