"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Patient, PatientStatus } from "../classes/Patient";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import QueueStats from "../components/QueueStats";
import PatientList from "../components/PatientList";
import QueueDetail from "../components/QueueDetail";

const STORAGE_KEY = "current_patient";

export default function QueuePage() {
  const [collapsed, setCollapsed] = useState(false);
  const toggleSidebar = () => setCollapsed(!collapsed);

  const [activeFilter, setActiveFilter] = useState("TOTAL");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const [outletMap, setOutletMap] = useState<Map<number, string>>(new Map());

  const currentPatientRef = useRef<Patient | null>(null);
  useEffect(() => {
    currentPatientRef.current = currentPatient;
  }, [currentPatient]);

  const saveCurrentToStorage = (p: Patient | null) => {
    if (!p) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  };

  const loadCurrentFromStorage = (): Patient | null => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const obj = JSON.parse(raw);
      if (obj.createdAt && typeof obj.createdAt === "string") {
        obj.createdAt = new Date(obj.createdAt);
      }
      return obj as Patient;
    } catch {
      return null;
    }
  };

  const clearCurrent = () => {
    setCurrentPatient(null);
    localStorage.removeItem(STORAGE_KEY);
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

      const serverCalling = fetchedPatients.find((p) => p.status === "CALL");

      if (serverCalling) {
        setCurrentPatient(serverCalling);
        saveCurrentToStorage(serverCalling);
      } else {
        const stored = loadCurrentFromStorage();
        if (stored?.status === "CALL") {
          clearCurrent();
        }
      }
    } catch (error) {
      console.error("Failed to fetch patients:", error);
    }
  };

  useEffect(() => {
    const stored = loadCurrentFromStorage();
    if (stored) {
      setCurrentPatient(stored);
    }
    fetchPatients();
  }, []);

  useEffect(() => {
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
      try {
        // Update outlet map jika tersedia
        if (data?.outlets && Array.isArray(data.outlets)) {
          setOutletMap((prev) => {
            const newMap = new Map<number, string>(prev);
            data.outlets.forEach((o: any) => newMap.set(o.id, o.nama_outlet));
            return newMap;
          });
        }

        const list: any[] = Array.isArray(data) ? data : data ? [data] : [];
        if (list.length === 0) return;

        setPatients((prev) => {
          const mapById = new Map<number, Patient>();
          prev.forEach((p) => mapById.set(p.id, p));
          list.forEach((raw, idx) => {
            const hydrated = Patient.fromJSON(
              raw,
              mapById.get(raw.id)?.no ?? idx,
              outletMap
            );
            mapById.set(hydrated.id, hydrated);
          });
          const merged = Array.from(mapById.values());
          return merged;
        });

        const maybeUpdated = Array.isArray(data)
          ? data.find((d: any) => d.id === currentPatientRef.current?.id)
          : data?.id === currentPatientRef.current?.id
          ? data
          : null;

        if (maybeUpdated) {
          const updated = Patient.fromJSON(
            maybeUpdated,
            currentPatientRef.current?.no ?? 0,
            outletMap
          );

          if (updated.status === "COMPLETE" || updated.status === "CANCELED") {
            clearCurrent();
          } else if (updated.status !== "CALL") {
            clearCurrent();
          } else {
            setCurrentPatient(updated);
            saveCurrentToStorage(updated);
          }
        } else {
          const anyCalling =
            (Array.isArray(data) ? data : [data]).find((d: any) => d.status === "CALL");
          if (anyCalling) {
            const hydrated = Patient.fromJSON(anyCalling, 0, outletMap);
            setCurrentPatient(hydrated);
            saveCurrentToStorage(hydrated);
          }
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
   
  }, []); 

  const filteredListPatients = useMemo(() => {
    return patients
      .filter((p) => {
        const isWaiting = p.status === "WAITING";
        const isCurrentCalling =
          p.status === "CALL" && currentPatient && p.id === currentPatient.id;
        const isCompleted = p.status === "COMPLETE";
        if (isCompleted) return false;
        return isWaiting || isCurrentCalling;
      })
      .sort((a, b) => {
        if (a.id === currentPatient?.id) return -1;
        if (b.id === currentPatient?.id) return 1;
        return a.bintang - b.bintang;
      });
  }, [patients, currentPatient]);

  const filteredTablePatients = useMemo(() => {
    if (activeFilter === "TOTAL") return patients;
    return patients.filter((p) => p.status === activeFilter);
  }, [patients, activeFilter]);

  const stats = useMemo(() => {
    return {
      TOTAL: patients.length,
      COMPLETE: patients.filter((p) => p.status === "COMPLETE").length,
      CANCELED: patients.filter((p) => p.status === "CANCELED").length,
      WAITING: patients.filter((p) => p.status === "WAITING").length,
    };
  }, [patients]);

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

      const updatedPatient = {
        ...patient,
        status: "CALL",
        bintang: patient.bintang > 0 ? patient.bintang : 1,
      } as Patient;

      setCurrentPatient(updatedPatient);
      saveCurrentToStorage(updatedPatient);
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
          clearCurrent();
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
          clearCurrent();
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
        clearCurrent();
      } else {
        const updated = { ...currentPatient, status } as Patient;
        setCurrentPatient(updated);
        saveCurrentToStorage(updated);
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
