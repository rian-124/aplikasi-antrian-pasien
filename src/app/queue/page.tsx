"use client";

import { useEffect, useState } from "react";
import { Patient, PatientStatus } from "../classes/Patient";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import QueueStats from "../components/QueueStats";
import PatientList from "../components/PatientList";
import QueueDetail from "../components/QueueDetail";

export default function QueuePage() {
  const [collapsed, setCollapsed] = useState(false);
  const toggleSidebar = () => setCollapsed(!collapsed);
  const [activeFilter, setActiveFilter] = useState("TOTAL");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);

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
      const fetchedPatients = json.data.map((p: any, index: number) => Patient.fromJSON(p, index));


      setPatients(fetchedPatients);
    } catch (error) {
      console.error("Failed to fetch patients:", error);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const filteredListPatients = patients.filter((p) => {
    if (p.status === "WAITING") return true;
    if (p.status === "CALL" && currentPatient && p.id === currentPatient.id) return true;
    return false;
  });

  const filteredTablePatients = patients.filter((p) => {
    if (activeFilter === "TOTAL") return true;
    return p.status === activeFilter;
  });

  const stats = {
    TOTAL: patients.length,
    COMPLETE: patients.filter((p) => p.status === "COMPLETE").length,
    CANCELED: patients.filter((p) => p.status === "CANCELED").length,
    WAITING: patients.filter((p) => p.status === "WAITING").length,
  };

  const handleCallPatient = async (patient: Patient) => {
    if (patient.status !== "WAITING") {
      alert("Only patients with status WAITING can be called.");
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      const url = `http://192.168.50.2:4000/api/antrian-pasien/${patient.id}`;

      const res = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'CALL' })
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      setCurrentPatient(patient);
      fetchPatients();
    } catch (error) {
      console.error("Failed to call patient:", error);
    }
  };

  const handleStatusChange = async (status: PatientStatus) => {
    if (!currentPatient) return;
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`http://192.168.50.2:4000/api/antrian-pasien/${currentPatient.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      setCurrentPatient(null);
      fetchPatients();
    } catch (error) {
      console.error(`Failed to update status to ${status}:`, error);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar collapsed={collapsed} toggle={toggleSidebar} />
      <div className="flex-1 flex flex-col bg-gray-50">
        <Header />
        <div className="flex-1 overflow-hidden p-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full">
            <div className="lg:col-span-3 h-full overflow-y-auto min-h-0">
              <PatientList patients={filteredListPatients} onCallPatient={handleCallPatient} />
            </div>
            <div className="lg:col-span-6 h-full overflow-y-auto min-h-0">
              <QueueDetail
                onComplete={() => handleStatusChange("COMPLETE")}
                onRecall={() => handleStatusChange("CALL")}
                onSkip={() => handleStatusChange("SKIP")}
                onCancel={() => handleStatusChange("CANCELED")}
                patients={filteredTablePatients}
                currentPatient={currentPatient}
              />
            </div>
            <div className="lg:col-span-3 h-full overflow-y-auto min-h-0">
              <QueueStats
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                stats={stats}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
