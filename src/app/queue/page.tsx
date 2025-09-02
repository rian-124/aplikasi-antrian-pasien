// QueuePage.tsx
"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import PatientList from "@/components/PatientList";
import QueueDetail from "@/components/QueueDetail";
import QueueStats from "@/components/QueueStats";
import { Patient } from "@/classes/Patient";

export default function QueuePage() {
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const [selectedLoket, setSelectedLoket] = useState<number | null>(null);
  const [lokets, setLokets] = useState<{ id: number; nama_loket: string; in_use?: boolean }[]>([]);
  const [outletMap, setOutletMap] = useState<Map<number, string>>(new Map());
  const [activeFilter, setActiveFilter] = useState("TOTAL");
  const [socket, setSocket] = useState<Socket | null>(null);

  const toggleSidebar = () => setCollapsed((prev) => !prev);

  const saveCurrentToStorage = (patient: Patient) =>
    localStorage.setItem("currentPatient", JSON.stringify(patient));
  const loadCurrentFromStorage = () => {
    const stored = localStorage.getItem("currentPatient");
    if (stored) {
      const patient = JSON.parse(stored) as Patient;
      patient.createdAt = new Date(patient.createdAt);
      patient.updatedAt = new Date(patient.updatedAt);
      return patient;
    }
    return null;
  };
  const clearCurrent = () => {
    setCurrentPatient(null);
    localStorage.removeItem("currentPatient");
  };

  const getRecallCount = (patientId: number) => {
    const recallData = JSON.parse(localStorage.getItem("recallCounts") || "{}");
    return recallData[patientId] || 0;
  };
  const setRecallCount = (patientId: number, count: number) => {
    const recallData = JSON.parse(localStorage.getItem("recallCounts") || "{}");
    recallData[patientId] = count;
    localStorage.setItem("recallCounts", JSON.stringify(recallData));
  };
  const resetRecallCount = (patientId: number) => {
    const recallData = JSON.parse(localStorage.getItem("recallCounts") || "{}");
    delete recallData[patientId];
    localStorage.setItem("recallCounts", JSON.stringify(recallData));
  };

  const fetchPatients = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No access token");

      const [patientRes, outletRes, loketRes] = await Promise.all([
        fetch("http://192.168.50.9:3000/api/antrian-pasien", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("http://192.168.50.9:3000/api/outlet", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("http://192.168.50.9:3000/api/lokets", { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (!patientRes.ok || !outletRes.ok || !loketRes.ok) throw new Error("Failed fetching data from API");

      const [patientJson, outletJson, loketJson] = await Promise.all([patientRes.json(), outletRes.json(), loketRes.json()]);

      const outlets: any[] = outletJson.data || [];
      const map = new Map<number, string>();
      outlets.forEach((o) => map.set(o.id, o.nama_outlet));
      setOutletMap(map);

      const loketData = (loketJson.data || []).map((l: any) => ({
        id: l.id,
        nama_loket: l.nama_loket,
        in_use: l.in_use,
      }));
      setLokets(loketData);

      const fetchedPatients: Patient[] = (patientJson.data || []).map((p: any, i: number) => Patient.fromJSON(p, i, map));
      setPatients(fetchedPatients);

      const serverCalling = fetchedPatients.find(
        (p) => p.status === "CALL" && p.loketId === selectedLoket
      );

      if (serverCalling) {
        setCurrentPatient(serverCalling);
        saveCurrentToStorage(serverCalling);
      } else {
        const stored = loadCurrentFromStorage();
        if (stored && stored.loketId === selectedLoket) {
          setCurrentPatient(stored);
        } else {
          clearCurrent();
        }
      }
    } catch (error) {
      console.error("Failed to fetch patients:", error);
    } finally {
      setLoading(false);
    }
  };

  const assignLoketToUser = async (loketId: number) => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    try {
      const res = await fetch(`http://192.168.50.9:3000/api/users/loket`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ loket_id: loketId }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        alert(errData?.errors?.message || "Gagal mengatur loket untuk user");
        return;
      }
      setSelectedLoket(loketId);
      localStorage.setItem("selectedLoket", loketId.toString());
    } catch (error) {
      console.error("Failed to assign loket to user:", error);
    }
  };

  const exitLoket = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    try {
      const res = await fetch("http://192.168.50.9:3000/api/users/loket/checkout", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ loket_id: 0 }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        alert(errData?.errors?.message || "Gagal keluar dari loket");
        return;
      }
      setSelectedLoket(null);
      localStorage.removeItem("selectedLoket");
    } catch (error) {
      console.error("Gagal keluar dari loket:", error);
    }
  };

  const handleCallPatient = async (patient: Patient) => {
    if (patient.status !== "WAITING") {
      alert("Only patients with status WAITING can be called.");
      return;
    }

    const token = localStorage.getItem("access_token");
    if (!token) return;
    if (!selectedLoket) return alert("Silakan pilih loket terlebih dahulu.");

    try {
      const res = await fetch(`http://192.168.50.9:3000/api/antrian-pasien/${patient.id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CALL", loket_id: selectedLoket }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        alert(errData?.errors?.message || "Gagal memanggil pasien");
        return;
      }

      const updatedPatient = { ...patient, status: "CALL", loket_id: selectedLoket } as Patient;
      setCurrentPatient(updatedPatient);
      saveCurrentToStorage(updatedPatient);
      setPatients((prev) =>
        prev.map((p) => (p.id === patient.id ? updatedPatient : p))
      );
    } catch (error) {
      console.error("Failed to call patient:", error);
    }
  };

  useEffect(() => {
    fetchPatients();
    const savedLoket = localStorage.getItem("selectedLoket");
    if (savedLoket) {
      setSelectedLoket(Number(savedLoket));
    }

    const token = localStorage.getItem("access_token");
    if (!token) return;

    const ws = io("http://192.168.50.9:3000", { auth: { token } });
    setSocket(ws);

    ws.on("connect", () => {
      console.log("WS connected:", ws.id);
      ws.emit("join_room", { role: "ADMINUSERS" });
    });

    ws.on("antrian_pasiens_update", (data: any) => {
      setPatients((prev) => {
        if (Array.isArray(data)) {
          const map = new Map(prev.map((p) => [p.id, p]));
          data.forEach((p: any) => map.set(p.id, Patient.fromJSON(p, 0, outletMap)));
          return Array.from(map.values());
        } else if (data && typeof data === "object") {
          const idx = prev.findIndex((p) => p.id === data.id);
          if (idx === -1) return [...prev, Patient.fromJSON(data, prev.length, outletMap)];
          const copy = [...prev];
          copy[idx] = Patient.fromJSON(data, idx, outletMap);
          return copy;
        }
        return prev;
      });
    });

    ws.on("disconnect", () => console.warn("WS disconnected"));

    return () => {
      ws.disconnect();
    };
  }, [outletMap, selectedLoket]);

  const filteredPatients = patients.filter(
    (p) => activeFilter === "TOTAL" || p.status === activeFilter
  );

  const displayPatients = filteredPatients
    .filter((p) => p.status === "WAITING" || (p.status === "CALL" && p.loketId === selectedLoket))
    .sort((a, b) => {
      if (a.status === "CALL" && b.status !== "CALL") return -1;
      if (a.status !== "CALL" && b.status === "CALL") return 1;
      return a.no - b.no;
    })
    .map((p) => ({
      ...p,
      isRecalled: getRecallCount(p.id) > 0,
    }));

  const stats = {
    TOTAL: patients.length,
    WAITING: patients.filter((p) => p.status === "WAITING").length,
    COMPLETE: patients.filter((p) => p.status === "COMPLETE").length,
    CANCELED: patients.filter((p) => p.status === "CANCELED").length,
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
                patients={displayPatients}
                onCallPatient={handleCallPatient}
                currentPatient={currentPatient}
                disableCall={!selectedLoket}
              />
            </div>

            <div className="lg:col-span-6 h-full overflow-y-auto min-h-0">
              <QueueDetail
                onComplete={async () => {
                  if (!currentPatient) return;
                  const token = localStorage.getItem("access_token");
                  if (!token) return;
                  try {
                    const res = await fetch(`http://192.168.50.9:3000/api/antrian-pasien/${currentPatient.id}`, {
                      method: "PATCH",
                      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                      body: JSON.stringify({ status: "COMPLETE" }),
                    });
                    if (!res.ok) {
                      const err = await res.json().catch(() => null);
                      alert(err?.errors?.message || "Gagal menyelesaikan pasien");
                      return;
                    }
                    resetRecallCount(currentPatient.id);
                    clearCurrent();
                    fetchPatients();
                  } catch (err) {
                    console.error(err);
                  }
                }}
                onRecall={async () => {
                  if (!currentPatient) return;
                  const recallCount = getRecallCount(currentPatient.id);
                  const token = localStorage.getItem("access_token");
                  if (!token) return;

                  try {
                    if (recallCount >= 2) {
                      const cancelRes = await fetch(`http://192.168.50.9:3000/api/antrian-pasien/${currentPatient.id}`, {
                        method: "PATCH",
                        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                        body: JSON.stringify({ status: "CANCELED" }),
                      });
                      if (!cancelRes.ok) {
                        const err = await cancelRes.json().catch(() => null);
                        alert(err?.errors?.message || "Gagal membatalkan pasien");
                        return;
                      }
                      resetRecallCount(currentPatient.id);
                      clearCurrent();
                      fetchPatients();
                      return;
                    }

                    const res = await fetch(`http://192.168.50.9:3000/api/antrian-pasien/${currentPatient.id}`, {
                      method: "PATCH",
                      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                      body: JSON.stringify({ status: "WAITING" }),
                    });
                    if (!res.ok) {
                      const err = await res.json().catch(() => null);
                      alert(err?.errors?.message || "Gagal recall pasien");
                      return;
                    }
                    setRecallCount(currentPatient.id, recallCount + 1);
                    clearCurrent();
                    fetchPatients();
                  } catch (err) {
                    console.error(err);
                  }
                }}
                onCancel={async () => {
                  if (!currentPatient) return;
                  const token = localStorage.getItem("access_token");
                  if (!token) return;
                  try {
                    const res = await fetch(`http://192.168.50.9:3000/api/antrian-pasien/${currentPatient.id}`, {
                      method: "PATCH",
                      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                      body: JSON.stringify({ status: "CANCELED" }),
                    });
                    if (!res.ok) {
                      const err = await res.json().catch(() => null);
                      alert(err?.errors?.message || "Gagal membatalkan pasien");
                      return;
                    }
                    resetRecallCount(currentPatient.id);
                    clearCurrent();
                    fetchPatients();
                  } catch (err) {
                    console.error(err);
                  }
                }}
                patients={filteredPatients}
                currentPatient={currentPatient}
              />
            </div>

            <div className="lg:col-span-3 h-full overflow-y-auto min-h-0">
              <QueueStats
                stats={stats}
                activeFilter={activeFilter}
                onFilterChange={(status) => setActiveFilter(status)}
                onLoketChange={(loketId) => {
                  const id = Number(loketId) || null;
                  if (id) assignLoketToUser(id);
                  else setSelectedLoket(null);
                }}
                onExit={exitLoket}
                lokets={lokets}
                selectedLoket={selectedLoket ? selectedLoket.toString() : ""}
                disableLoket={currentPatient?.status === "CALL"} 
                disableExit={currentPatient?.status === "CALL"}   
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}