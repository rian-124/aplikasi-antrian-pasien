"use client";

import { useEffect, useState } from "react";
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
        fetch("http://192.168.1.19:4000/api/antrian-pasien", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://192.168.1.19:4000/api/outlet", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://192.168.1.19:4000/api/lokets", {
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

  // === Init data fetch ===
  useEffect(() => {
    fetchPatients();
    const savedLoket = localStorage.getItem("selectedLoket");
    if (savedLoket) setSelectedLoket(savedLoket);
  }, []);

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
        `http://192.168.1.19:4000/api/antrian-pasien/${patient.id}`,
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

  const handleRecallPatient = async (patient: Patient) => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    const recallCount = getRecallCount(patient.id) + 1;

    if (recallCount >= 2) {
      await fetch(
        `http://192.168.1.19:4000/api/antrian-pasien/${patient.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "CANCELED", bintang: recallCount }),
        }
      );
      resetRecallCount(patient.id);
      clearCurrent();
      fetchPatients();
      return;
    }

    await fetch(
      `http://192.168.1.19:4000/api/antrian-pasien/${patient.id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "RECALL", bintang: recallCount }),
      }
    );
    setRecallCount(patient.id, recallCount);
    fetchPatients();
  };

  const handleRecallClick = async () => {
    const token = localStorage.getItem("access_token");
    if (!currentPatient || !token) return;

    if (!["CALL", "SKIPPED", "RECALL"].includes(currentPatient.status)) {
      alert("Recall hanya bisa dilakukan setelah pasien dipanggil (CALL).");
      return;
    }

    const nextBintang = currentPatient.bintang + 1;
    let res: Response | undefined;

    try {
      res = await fetch(
        `http://192.168.1.19:4000/api/antrian-pasien/${currentPatient.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: nextBintang >= 2 ? "CANCELED" : "RECALL",
            bintang: nextBintang,
          }),
        }
      );
      if (!res.ok) throw new Error("Gagal recall pasien");
      await fetchPatients();

      const updatedPatient = patients.find((p) => p.id === currentPatient.id);
      if (updatedPatient?.status === "CANCELED") {
        clearCurrent();
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      }
      if (res) {
        const errorText = await res.text();
        console.error("Backend error:", errorText);
      }
    }
  };

  const filteredPatients = patients.filter(
    (p) => activeFilter === "TOTAL" || p.status === activeFilter
  );

  const displayPatients = patients
    .filter(
      (p) =>
        ["WAITING", "SKIPPED", "CALL"].includes(p.status)
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
