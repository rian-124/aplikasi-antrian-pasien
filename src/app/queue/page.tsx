"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
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

  const [outletMap, setOutletMap] = useState<Map<number, string>>(new Map());

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

      if (!patientRes.ok || !outletRes.ok) {
        throw new Error("Failed fetching patients or outlets");
      }

      const [patientJson, outletJson] = await Promise.all([
        patientRes.json(),
        outletRes.json(),
      ]);

      const outlets: any[] = outletJson.data || [];
      const map = new Map<number, string>();
      outlets.forEach((o) => map.set(o.id, o.nama_outlet));
      setOutletMap(map);

      const fetchedPatients: Patient[] = (patientJson.data || []).map(
        (p: any, i: number) => Patient.fromJSON(p, i, map)
      );

      setPatients(fetchedPatients);
      console.log("Fetched patients:", fetchedPatients);
    } catch (error) {
      console.error("Failed to fetch patients:", error);
    }
  };

  useEffect(() => {
    fetchPatients();

    const token = localStorage.getItem("access_token");
    if (!token) return;

    const socket: Socket = io("http://192.168.50.2:4000", {
      auth: { token },
    });

    socket.on("connect", () => {
      console.log("WebSocket connected:", socket.id);
      socket.emit("join_room", { role: "ADMINUSERS" });
    });

    socket.on("antrian_pasiens_update", (data: any) => {
      console.log("Update dari WS:", data);
      try {
        if (data.outlets && Array.isArray(data.outlets)) {
          const newMap = new Map<number, string>(outletMap);
          data.outlets.forEach((o: any) => newMap.set(o.id, o.nama_outlet));
          setOutletMap(newMap);
        }

        if (Array.isArray(data)) {
          const updatedPatients = data.map((p: any, i: number) =>
            Patient.fromJSON(p, i, outletMap)
          );
          setPatients(updatedPatients);
        } else if (data && typeof data === "object") {
          setPatients((prev) => {
            const idx = prev.findIndex((p) => p.id === data.id);
            if (idx === -1) {
              return [...prev, Patient.fromJSON(data, prev.length, outletMap)];
            } else {
              const copy = [...prev];
              copy[idx] = Patient.fromJSON(data, idx, outletMap);
              return copy;
            }
          });
        } else {
          console.warn("Format data WS tidak dikenali:", data);
        }
      } catch (err) {
        console.error("Gagal update pasien dari WS:", err);
      }
    });

    socket.on("disconnect", () => {
      console.warn("WebSocket disconnected");
    });

    return () => {
      socket.disconnect();
    };
  }, [outletMap]);

  const filteredListPatients = patients
    .filter((p) => {
      const isWaiting = p.status === "WAITING";
      const isCurrentCalling = p.status === "CALL" && currentPatient && p.id === currentPatient.id;
      const isCompleted = p.status === "COMPLETE";

      if (isCompleted) return false;
      return isWaiting || isCurrentCalling;
    })
    .sort((a, b) => {
      if (a.id === currentPatient?.id) return -1;
      if (b.id === currentPatient?.id) return 1;
      return a.bintang - b.bintang;
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
      const token = localStorage.getItem("access_token");
      const url = `http://192.168.50.2:4000/api/antrian-pasien/${patient.id}`;

      const res = await fetch(url, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "CALL" }),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      setCurrentPatient({ ...patient, bintang: patient.bintang > 0 ? patient.bintang : 1 });
      fetchPatients();
    } catch (error) {
      console.error("Failed to call patient:", error);
    }
  };

  const handleStatusChange = async (status: PatientStatus) => {
    if (!currentPatient) return;

    try {
      const token = localStorage.getItem("access_token");
      const baseUrl = `http://192.168.50.2:4000/api/antrian-pasien/${currentPatient.id}`;

      if (status === "CALL") {
        const newBintang = currentPatient.bintang + 1;
        if (newBintang >= 3) {
          await fetch(baseUrl, {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: "CANCELED" }),
          });
          setCurrentPatient(null);
          fetchPatients();
          return;
        } else {
          await fetch(baseUrl, {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ bintang: newBintang, status: "WAITING" }),
          });
          setCurrentPatient(null);
          fetchPatients();
          return;
        }
      }

      await fetch(baseUrl, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (status === "CANCELED" || status === "COMPLETE") {
        setCurrentPatient(null);
      } else {
        setCurrentPatient({ ...currentPatient, status });
      }

      fetchPatients();
    } catch (error) {
      console.error(`Failed to update status to ${status}:`, error);
    }
  };

  return (
    <div className="flex">
      <Sidebar collapsed={collapsed} toggle={toggleSidebar} />
      <div className="flex-1 p-2 bg-gray-50 min-h-screen">
        <Header />
        <div className="flex-1 overflow-hidden p-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full">
            <div className="lg:col-span-3 h-full overflow-y-auto min-h-0">
              <PatientList
                patients={filteredListPatients}
                onCallPatient={handleCallPatient}
                currentPatient={currentPatient}
              />
            </div>
            <div className="lg:col-span-6 h-full overflow-y-auto min-h-0">
              <QueueDetail
                onComplete={() => handleStatusChange("COMPLETE")}
                onRecall={() => handleStatusChange("CALL")}
                onCancel={() => handleStatusChange("CANCELED")}
                patients={filteredTablePatients}
                currentPatient={currentPatient}
              />
            </div>
            <div className="lg:col-span-3 h-full overflow-y-auto min-h-0">
              <QueueStats activeFilter={activeFilter} onFilterChange={setActiveFilter} stats={stats} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
