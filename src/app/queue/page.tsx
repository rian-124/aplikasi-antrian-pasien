// Updated QueuePage.tsx (Responsive Layout)
'use client';

import { useState } from "react";
import { Patient } from "../classes/Patient";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import QueueStats from "../components/QueueStats";
import PatientList from "../components/PatientList";
import QueueDetail from "../components/QueueDetail";

export default function QueuePage() {
  const [collapsed, setCollapsed] = useState(false);
  const toggleSidebar = () => setCollapsed(!collapsed);
  const [activeFilter, setActiveFilter] = useState("TOTAL");

  const patients: Patient[] = Array.from({ length: 7 }, (_, i) => {
    const status = i % 3 === 0 ? "CANCELLED" : i % 2 === 0 ? "COMPLETED" : "WAITING";
    return new Patient(
      i + 1,
      i + 1,
      `00${i + 1}`,
      `LAB-${1000 + i}`,
      `Outlet ${i + 1}`,
      status as any
    );
  });

  const filteredPatients =
    activeFilter === "TOTAL"
      ? patients
      : patients.filter((p) => p.status === activeFilter);

  const stats = {
    TOTAL: patients.length,
    COMPLETED: patients.filter((p) => p.status === "COMPLETED").length,
    CANCELLED: patients.filter((p) => p.status === "CANCELLED").length,
    WAITING: patients.filter((p) => p.status === "WAITING").length,
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar collapsed={collapsed} toggle={toggleSidebar} />
      <div className="flex-1 flex flex-col bg-gray-50">
        <Header />
        <div className="flex-1 overflow-hidden p-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full">
            <div className="lg:col-span-3 h-full overflow-y-auto min-h-0">
              <PatientList patients={patients} />
            </div>
            <div className="lg:col-span-6 h-full overflow-y-auto min-h-0">
              <QueueDetail
                onComplete={() => console.log("Complete")}
                onRecall={() => console.log("Recall")}
                onSkip={() => console.log("Skip")}
                onCancel={() => console.log("Cancel")}
                patients={filteredPatients}
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
