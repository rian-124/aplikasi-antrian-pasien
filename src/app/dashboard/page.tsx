"use client";

import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
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
  const [activeFilter, setActiveFilter] = useState<string>("TOTAL");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [outletMap, setOutletMap] = useState<Map<number, string>>(new Map());

  const handleSearch = () => {
    console.log("Searching for:", searchTerm);
  };

  const initStats = () => [
    new Stat("Total Pasien", 0, "/icons/wait.svg", "text-blue-600"),
    new Stat("Menunggu", 0, "/icons/called.svg", "text-yellow-500"),
    new Stat("Selesai", 0, "/icons/completed.svg", "text-green-600"),
    new Stat("Dibatalkan", 0, "/icons/cancelled.svg", "text-red-600"),
  ];

  useEffect(() => {
    setStats(initStats());
  }, []);

  const recalcStats = (patientList: Patient[]) => {
    const total = patientList.length;
    const waiting = patientList.filter((p) => p.status === "WAITING").length;
    const completed = patientList.filter((p) => p.status === "COMPLETE").length;
    const canceled = patientList.filter((p) => p.status === "CANCELED").length;

    setStats([
      new Stat("Total Pasien", total, "/icons/wait.svg", "text-blue-600"),
      new Stat("Menunggu", waiting, "/icons/called.svg", "text-yellow-500"),
      new Stat("Selesai", completed, "/icons/completed.svg", "text-green-600"),
      new Stat("Dibatalkan", canceled, "/icons/cancelled.svg", "text-red-600"),
    ]);
  };

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No access token");

      const [patientRes, outletRes] = await Promise.all([
        fetch("http://192.168.50.2:4000/api/antrian-pasien", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://192.168.50.2:4000/api/outlet", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!patientRes.ok || !outletRes.ok) throw new Error("Error fetching data");

      const [patientJson, outletJson] = await Promise.all([patientRes.json(), outletRes.json()]);

      const outlets = outletJson.data;
      const map = new Map<number, string>();
      outlets.forEach((o: any) => map.set(o.id, o.nama_outlet));
      setOutletMap(map);

      const fetchedPatients: Patient[] = patientJson.data.map((p: any, index: number) =>
        Patient.fromJSON(p, index, map)
      );

      setPatients(fetchedPatients);
      recalcStats(fetchedPatients);
    } catch (error) {
      console.error("Failed to fetch patients or outlets:", error);
    }
  };

  useEffect(() => {
    fetchPatients();

    const token = localStorage.getItem("access_token");
    if (!token) return;

    const socket: Socket = io("http://192.168.50.2:4000", { auth: { token } });

    socket.on("connect", () => {
      console.log("WebSocket connected:", socket.id);
      socket.emit("join_room", { role: "DASHBOARD" });
    });

    socket.on("antrian_pasiens_update", (data: any) => {
      if (!data || !Array.isArray(data)) return;

      // gunakan outletMap global
      const updatedPatients: Patient[] = data.map((p: any, index: number) =>
        Patient.fromJSON(p, index, outletMap)
      );

      setPatients(updatedPatients);
      recalcStats(updatedPatients);
    });

    socket.on("disconnect", () => console.warn("WebSocket disconnected"));

    return () => {
      socket.disconnect();
    };
  }, [outletMap]);

  const filteredPatients = patients
    .filter((p) => {
      if (activeFilter === "TOTAL") return true;
      if (activeFilter === "Menunggu") return p.status === "WAITING";
      if (activeFilter === "Selesai") return p.status === "COMPLETE";
      if (activeFilter === "Dibatalkan") return p.status === "CANCELED";
      return true;
    })
    .filter((p) => {
      const keyword = searchTerm.toLowerCase();
      return (
        p.patientNumber?.toLowerCase().includes(keyword) ||
        p.labReg?.toLowerCase().includes(keyword) ||
        p.outlet?.toLowerCase().includes(keyword)
      );
    });

  return (
    <div className="flex">
      <Sidebar collapsed={collapsed} toggle={toggleSidebar} />
      <div className="flex-1 p-2 bg-gray-50 min-h-screen">
        <Header />
        <div className="grid grid-cols-2 p-2 pt-4 md:grid-cols-4 gap-4 mb-6">
          {stats.map((s, i) => (
            <StatCard
              key={i}
              title={s.title}
              value={s.value}
              icon={s.icon}
              color={s.color}
              active={activeFilter === s.title}
              onClick={() => setActiveFilter(s.title)}
            />
          ))}
        </div>
        <PatientTable
          data={filteredPatients}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleSearch={handleSearch}
        />
      </div>
    </div>
  );
}
