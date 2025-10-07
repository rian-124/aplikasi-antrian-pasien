"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import QueueHeader from "@/components/QueueHeader";
import QueueList from "@/components/QueueList";
import CurrentQueue from "@/components/CurrentQueue";
import { Patient } from "@/classes/Patient";
// Hapus CardStack, Card

export default function MonitoringPage() {
  const [isClient, setIsClient] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [lastPatientId, setLastPatientId] = useState<number | null>(null);
  const [calledPatients, setCalledPatients] = useState<Patient[]>([]);
  const [outletMap, setOutletMap] = useState<Map<number, string>>(new Map());

  useEffect(() => {
    if (!isClient) setIsClient(true);

    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("No access token");

        const [patientRes, outletRes] = await Promise.all([
          fetch("http://192.168.50.222:4000/api/antrian-pasien", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://192.168.50.222:4000/api/outlet", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!patientRes.ok || !outletRes.ok)
          throw new Error("Error fetching patients or outlets");

        const [patientJson, outletJson] = await Promise.all([
          patientRes.json(),
          outletRes.json(),
        ]);

        const outlets = outletJson.data || [];
        const newOutletMap = new Map<number, string>();
        outlets.forEach((o: any) => newOutletMap.set(o.id, o.nama_outlet));
        setOutletMap(newOutletMap);

        let fetchedPatients: Patient[] = [];
        if (Array.isArray(patientJson.data?.antrian_pasiens)) {
          fetchedPatients = patientJson.data.antrian_pasiens.map(
            (p: any, index: number) => Patient.fromJSON(p, index)
          );
        }
        setPatients(fetchedPatients);
      } catch (error) {
        console.error("Failed to fetch patients or outlets:", error);
      }
    };

    fetchPatients();

    const token = localStorage.getItem("access_token");
    if (!token) return;

    const socket: Socket = io("http://192.168.50.222:4000", {
      auth: { token },
    });

    socket.on("connect", () => console.log("WebSocket connected:", socket.id));
    socket.on("disconnect", () => console.warn("WebSocket disconnected"));

    socket.on("antrian_pasiens_update", (data: any) => {
      try {
        if (data.outlets && Array.isArray(data.outlets)) {
          const updatedMap = new Map(outletMap);
          data.outlets.forEach((o: any) => updatedMap.set(o.id, o.nama_outlet));
          setOutletMap(updatedMap);
        }

        if (Array.isArray(data)) {
          const updatedPatients = data.map((p: any, i: number) =>
            Patient.fromJSON(p, i)
          );
          setPatients(updatedPatients);
        } else if (data && typeof data === "object") {
          setPatients((prev) => {
            const idx = prev.findIndex((p) => p.id === data.id);
            if (idx === -1) {
              return [...prev, Patient.fromJSON(data, prev.length)];
            } else {
              const copy = [...prev];
              copy[idx] = Patient.fromJSON(data, idx);
              return copy;
            }
          });
        }
      } catch (err) {
        console.error("Gagal update pasien dari WS:", err);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [outletMap]);

  const currentPatient = (() => {
    const active =
      patients
        .filter((p) => p.status === "CALL")
        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())[0] ??
      null;

    if (active) {
      if (lastPatientId !== active.id) {
        setLastPatientId(active.id);
        setCalledPatients((prev) => [active, ...prev]);
      }
      return active;
    }

    if (lastPatientId) {
      const last = patients.find((p) => p.id === lastPatientId);
      if (last?.status === "COMPLETE" || last?.status === "CANCELED") {
        setCalledPatients([]);
        setLastPatientId(null);
        return null;
      }
    }
    return null;
  })();

  const waitingPatients = patients.filter((p) => p.status === "WAITING");

  const handleEnterFullscreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(console.warn);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () =>
      setIsFullscreen(document.fullscreenElement !== null);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const dummyPatient: Patient = {
    id: 0,
    no: 0,
    patientNumber: "-",
    labReg: "-",
    outlet: "-",
    userName: "-",
    bintang: 0,
    jenisRegistrasiId: 0,
    status: "WAITING",
    loket: "-",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const patientCall = patients.find((p) => p.status === "CALL");
  console.log("patients:", patients);
  console.log("patientCall:", patientCall);
  let currentCard = <CurrentQueue patient={dummyPatient} />;
  if (patientCall) {
    currentCard = <CurrentQueue patient={patientCall} />;
  }

  if (!isClient) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-black text-white">
        Memuat Monitor...
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-x-hidden bg-white">
      <QueueHeader />
      <div className="flex flex-col md:flex-row h-full w-full mt-6 md:mt-20">
  <div className="w-full md:w-1/3 lg:w-1/4 border-gray-700 overflow-y-auto px-2 md:px-4 flex flex-col gap-2 md:gap-4 justify-start">
          <QueueList
            items={patients
              .filter((p) => p.status === "WAITING")
              .map((p) => ({
                number: p.patientNumber,
                table: p.jenisRegistrasiId,
                type: p.outlet,
                status: p.status,
              }))
              .slice(0, 5)}
          />
          <div className="rounded-xl overflow-hidden shadow-lg mt-2 mb-6 max-w-full">
            <div className="aspect-video w-full">
              <iframe
                className="w-full aspect-video"
                src="https://www.youtube.com/embed/8qPQ6E6ywvs?autoplay=1&loop=1&mute=1"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>

  <div className="flex flex-col flex-1 space-y-2 md:space-y-4 p-2 md:p-4 items-center">
          <div className="flex justify-center items-start w-full min-h-[400px]">
            <div className="w-full max-w-md h-[400px] flex items-start justify-center mx-auto">
              <div className="bg-white rounded-3xl p-7 shadow-xl border border-neutral-200 flex flex-col justify-between w-full max-w-md mx-auto">
                <div className="font-normal text-neutral-700">
                  {currentCard}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {!isFullscreen && (
        <img
          src="/icons/fullscreen.svg"
          alt="Fullscreen Icon"
          onClick={handleEnterFullscreen}
          className="w-10 h-10 fixed bottom-4 right-4 opacity-80 hover:opacity-100 transition cursor-pointer z-20"
        />
      )}
    </div>
  );
}
