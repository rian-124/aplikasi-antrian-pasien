'use client'

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import QueueHeader from '../components/QueueHeader';
import QueueList from '../components/QueueList';
import CurrentQueue from '../components/CurrentQueue';
import { Patient } from '../classes/Patient';

export default function MonitoringPage() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [lastPatientId, setLastPatientId] = useState<number | null>(null);

  const [outletMap, setOutletMap] = useState<Map<number, string>>(new Map());

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) throw new Error("No access token");

      const [patientRes, outletRes] = await Promise.all([
        fetch("http://192.168.50.2:4000/api/antrian-pasien", {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch("http://192.168.50.2:4000/api/outlet", {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (!patientRes.ok || !outletRes.ok) {
        throw new Error("Error fetching patients or outlets");
      }

      const [patientJson, outletJson] = await Promise.all([
        patientRes.json(),
        outletRes.json()
      ]);

      const outlets = outletJson.data || [];
      const newOutletMap = new Map<number, string>();
      outlets.forEach((o: any) => newOutletMap.set(o.id, o.nama_outlet));
      setOutletMap(newOutletMap);

      const fetchedPatients: Patient[] = patientJson.data.map(
        (p: any, index: number) => Patient.fromJSON(p, index, newOutletMap)
      );

      setPatients(fetchedPatients);
      console.log("Raw API data:", patientJson.data);
      console.log("Mapped Patients:", fetchedPatients);

    } catch (error) {
      console.error("Failed to fetch patients or outlets:", error);
    }
  };

  useEffect(() => {
    fetchPatients();

    const token = localStorage.getItem('access_token');
    if (!token) return;

    const socket: Socket = io("http://192.168.50.2:4000", {
      auth: { token }
    });

    socket.on('connect', () => {
      console.log('WebSocket connected:', socket.id);
      socket.emit('join_room', { role: 'MONITORING' });
    });

    socket.on('antrian_pasiens_update', (data: any) => {
      console.log('Update dari WS:', data);

      try {
        if (data.outlets && Array.isArray(data.outlets)) {
          const updatedMap = new Map(outletMap);
          data.outlets.forEach((o: any) => updatedMap.set(o.id, o.nama_outlet));
          setOutletMap(updatedMap);
        }

        if (Array.isArray(data)) {
          const updatedPatients = data.map((p: any, i: number) =>
            Patient.fromJSON(p, i, outletMap)
          );
          setPatients(updatedPatients);
        } else if (data && typeof data === 'object') {
          setPatients((prev) => {
            const idx = prev.findIndex(p => p.id === data.id);
            if (idx === -1) {
              return [...prev, Patient.fromJSON(data, prev.length, outletMap)];
            } else {
              const copy = [...prev];
              copy[idx] = Patient.fromJSON(data, idx, outletMap);
              return copy;
            }
          });
        } else {
          console.warn('Format data WS tidak dikenali:', data);
        }
      } catch (err) {
        console.error('Gagal update pasien dari WS:', err);
      }
    });

    socket.on('disconnect', () => {
      console.warn('WebSocket disconnected');
    });

    return () => {
      socket.disconnect();
    };
  }, [outletMap]);

  const currentPatient = (() => {
    const active = patients
      .filter(p => p.status === "CALL")
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())[0] ?? null;

    if (active) {
      if (lastPatientId !== active.id) {
        setLastPatientId(active.id);
      }
      return active;
    }

    if (lastPatientId) {
      const last = patients.find(p => p.id === lastPatientId);
      if (last?.status === "COMPLETE") {
        return null;
      }
    }

    return null;
  })();

  const waitingPatients = patients.filter(p => p.status === "WAITING");

  const handleEnterFullscreen = () => {
    if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn('Fullscreen error:', err);
      });
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement !== null);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div className="w-full h-screen bg-white flex flex-col relative">
      <QueueHeader />
      <div className="flex flex-1 divide-x divide-gray-300 relative">
        <QueueList
          items={waitingPatients.map(p => ({
            number: p.patientNumber,
            table: p.userName,
            type: p.outlet
          }))}
        />

        {currentPatient ? (
          <CurrentQueue patient={currentPatient} />
        ) : (
          <div className="w-1/2 flex justify-center items-center text-gray-500">
            Tidak ada pasien yang sedang dipanggil
          </div>
        )}
      </div>

      {!isFullscreen && (
        <img
          src="/icons/fullscreen.svg"
          alt="Fullscreen Icon"
          onClick={handleEnterFullscreen}
          className="w-10 h-10 fixed bottom-4 right-4 opacity-80 hover:opacity-100 transition cursor-pointer"
        />
      )}
    </div>
  );
}
