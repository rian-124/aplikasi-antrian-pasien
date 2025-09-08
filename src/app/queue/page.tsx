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
  const [selectedLoket, setSelectedLoket] = useState<string>("");
  const [lokets, setLokets] = useState<
    { id: number; nama_loket: string; in_use?: boolean }[]
  >([]);
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

  // === Recall Count Helpers ===
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

  // === Fetch initial data ===
  const fetchPatients = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No access token");

      const [patientRes, outletRes, loketRes] = await Promise.all([
        fetch("http://172.20.10.2:4000/api/antrian-pasien", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://172.20.10.2:4000/api/outlet", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://172.20.10.2:4000/api/lokets", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const [patientJson, outletJson, loketJson] = await Promise.all([
        patientRes.json(),
        outletRes.json(),
        loketRes.json(),
      ]);

      const map = new Map<number, string>();
      (outletJson.data || []).forEach((o: any) =>
        map.set(o.id, o.nama_outlet)
      );
      setOutletMap(map);

      setLokets(
        (loketJson.data || []).map((l: any) => ({
          id: l.id,
          nama_loket: l.nama_loket,
          in_use: l.in_use,
        }))
      );

      const fetchedPatients: Patient[] = (patientJson.data || []).map(
        (p: any, i: number) => Patient.fromJSON(p, i + 1, map)
      );
      setPatients(fetchedPatients);

      const serverCalling = fetchedPatients.find(
        (p) => p.status === "CALL" && p.loketId === Number(selectedLoket)
      );
      if (serverCalling) {
        setCurrentPatient(serverCalling);
        saveCurrentToStorage(serverCalling);
      } else {
        const stored = loadCurrentFromStorage();
        if (stored && String(stored.loketId) === selectedLoket) {
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

  // === Init WS ===
  useEffect(() => {
    fetchPatients();
    const savedLoket = localStorage.getItem("selectedLoket");
    if (savedLoket) setSelectedLoket(savedLoket);

    const token = localStorage.getItem("access_token");
    if (!token) return;

    const ws = io("http://172.20.10.2:4000", {
      auth: { token },
      reconnection: true,
    });
    setSocket(ws);

    ws.on("connect", () => {
      console.log("WS connected:", ws.id);
      ws.emit("join_room", { role: "ADMIN" });
      ws.emit("join_room", { role: "ADMINUSERS" });
    });

    ws.on("disconnect", (reason) => {
      console.warn("WS disconnected:", reason);
    });

    return () => {
      ws.disconnect();
    };
  }, []);

  // === Real-time update via WS ===
  useEffect(() => {
    if (!socket) return;

    socket.on("antrian_pasiens_update", (data: any) => {
      setPatients((prev) => {
        let updatedPatients = [...prev];

        if (Array.isArray(data)) {
          updatedPatients = data.map((p: any, i: number) =>
            Patient.fromJSON(p, i + 1, outletMap)
          );
        } else if (data && typeof data === "object") {
          const idx = prev.findIndex((p) => p.id === data.id);
          const mapped = Patient.fromJSON(
            data,
            idx === -1 ? prev.length + 1 : idx + 1,
            outletMap
          );

          if (idx === -1) {
            updatedPatients = [...prev, mapped];
          } else {
            const copy = [...prev];
            copy[idx] = mapped;
            updatedPatients = copy;
          }
        }

        return updatedPatients.sort((a, b) => a.no - b.no);
      });

      if (
        currentPatient &&
        ((Array.isArray(data) &&
          data.some(
            (p: any) =>
              p.id === currentPatient.id &&
              ["CANCELED", "COMPLETE"].includes(p.status_antrian?.status)
          )) ||
          (!Array.isArray(data) &&
            data.id === currentPatient.id &&
            ["CANCELED", "COMPLETE"].includes(data.status_antrian?.status)))
      ) {
        clearCurrent();
      }
    });

    return () => {
      socket.off("antrian_pasiens_update");
    };
  }, [socket, currentPatient, outletMap]);

  // === Handlers ===
  const handleCallPatient = async (patient: Patient) => {
    if (patient.status !== "WAITING" && patient.status !== "SKIPPED") {
      alert("Hanya pasien WAITING / SKIPPED yang bisa dipanggil.");
      return;
    }
    const token = localStorage.getItem("access_token");
    if (!token || !selectedLoket) return;

    try {
      await fetch(
        `http://172.20.10.2:4000/api/antrian-pasien/${patient.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "CALL",
            loket_id: Number(selectedLoket),
          }),
        }
      );

      const updated = { ...patient, status: "CALL", loketId: Number(selectedLoket) } as Patient;
      setCurrentPatient(updated);
      saveCurrentToStorage(updated);
      setPatients((prev) =>
        prev.map((p) => (p.id === patient.id ? updated : p))
      );
    } catch (error) {
      console.error("Failed to call patient:", error);
    }
  };

  const handleCompletePatient = (patient: Patient) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === patient.id ? { ...p, status: "COMPLETE" } : p))
    );
    clearCurrent();
  };

  const handleCancelPatient = (patient: Patient) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === patient.id ? { ...p, status: "CANCELED" } : p))
    );
    clearCurrent();
  };

  const handleRecallPatient = (patient: Patient) => {
    const recallCount = getRecallCount(patient.id) + 1;
    if (recallCount >= 3) {
      setPatients((prev) =>
        prev.map((p) => (p.id === patient.id ? { ...p, status: "CANCELED" } : p))
      );
      resetRecallCount(patient.id);
      clearCurrent();
      return;
    }
    setRecallCount(patient.id, recallCount);
    setPatients((prev) =>
      prev.map((p) =>
        p.id === patient.id ? { ...p, status: "CALL", bintang: recallCount } : p
      )
    );
    clearCurrent();
  };

  const filteredPatients = patients.filter(
    (p) => activeFilter === "TOTAL" || p.status === activeFilter
  );

  const displayPatients = patients
    .filter(
      (p) =>
        ["WAITING", "SKIPPED"].includes(p.status) ||
        (p.status === "CALL" && p.loketId === Number(selectedLoket))
    )
    .sort((a, b) => {
      if (a.status === "CALL" && b.status !== "CALL") return -1;
      if (a.status !== "CALL" && b.status === "CALL") return 1;
      if (a.status === "SKIPPED" && b.status !== "SKIPPED") return 1;
      if (a.status !== "SKIPPED" && b.status === "SKIPPED") return -1;
      return a.no - b.no;
    })
    .map((p) => ({ ...p, isRecalled: getRecallCount(p.id) > 0 }));

  const stats = {
    TOTAL: patients.length,
    WAITING: patients.filter((p) => p.status === "WAITING").length,
    COMPLETE: patients.filter((p) => p.status === "COMPLETE").length,
    CANCELED: patients.filter((p) => p.status === "CANCELED").length,
    SKIPPED: patients.filter((p) => p.status === "SKIPPED").length,
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
                selectedLoket={selectedLoket ? Number(selectedLoket) : null}
              />
            </div>
            <div className="lg:col-span-6 h-full overflow-y-auto min-h-0">
              <QueueDetail
                patients={filteredPatients}
                currentPatient={currentPatient}
                clearCurrent={clearCurrent}
                fetchPatients={fetchPatients}
                onComplete={handleCompletePatient}
                onRecall={handleRecallPatient}
                onCancel={handleCancelPatient}
              />
            </div>
            <div className="lg:col-span-3 h-full overflow-y-auto min-h-0">
              <QueueStats
                stats={stats}
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                onLoketChange={(loketId) => {
                  setSelectedLoket(String(loketId));
                  localStorage.setItem("selectedLoket", String(loketId));
                }}
                onExit={() => {
                  setSelectedLoket("");
                  localStorage.removeItem("selectedLoket");
                  clearCurrent();
                }}
                lokets={lokets}
                selectedLoket={selectedLoket}
                disableLoket={!!selectedLoket}
                disableExit={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
