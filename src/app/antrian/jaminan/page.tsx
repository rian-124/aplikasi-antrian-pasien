"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import QueueCard from "@/components/QueueCard";
import QueueHeader from "@/components/QueueHeader";
import { ArrowLeft } from "lucide-react";

export default function JaminanPage() {
  const router = useRouter();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [penjamins, setPenjamins] = useState<{ id: number; nama: string }[]>(
    []
  );
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement !== null);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    fetchPenjamins();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
        if (message.includes("berhasil dibuat")) {
          router.push("/antrian");
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, router]);

  const fetchPenjamins = async () => {
    try {
      const res = await fetch(
        "http://172.20.10.2:4000/api/penjamins/jenis-registrasi?jenis=JAMINAN",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const json = await res.json();
      setPenjamins(json.data);
    } catch (err) {
      console.error("Gagal mengambil data penjamin:", err);
      setMessage("Gagal mengambil daftar penjamin.");
    }
  };

  const createAntrian = async (penjamin_id: number) => {
    setLoading(true);
    try {
      const res = await fetch("http://172.20.10.2:4000/api/pasiens", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          jenis: "JAMINAN",
          outlet_id: 1,
          penjamin_id: penjamin_id,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const json = await res.json();
      setMessage(
        `Nomor antrian ${json.data.AntrianPasiens[0].nomor_Antrian} berhasil dibuat.`
      );
    } catch (err) {
      console.error("Gagal membuat antrian pasien:", err);
      setMessage("Terjadi kesalahan saat membuat antrian.");
    } finally {
      setLoading(false);
    }
  };

  const handleEnterFullscreen = () => {
    if (
      !document.fullscreenElement &&
      document.documentElement.requestFullscreen
    ) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn("Fullscreen error:", err);
      });
    }
  };

  return (
    <div className="w-full h-screen flex flex-col bg-white relative">
      <QueueHeader />

      <div className="absolute top-[72px] left-4">
        <button
          onClick={() => router.push("/antrian")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-2xl shadow-sm transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-medium">Kembali</span>
        </button>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-semibold mb-10">Pilih Jenis Jaminan</h1>
        <div className="flex gap-6 flex-wrap justify-center">
          {penjamins.map((penjamin, i) => (
            <div
              key={i}
              onClick={() => createAntrian(penjamin.id)}
              className="cursor-pointer"
            >
              <QueueCard
                title={penjamin.nama}
                image={`/icons/doctor-${(i % 4) + 1}.svg`}
              />
            </div>
          ))}
        </div>

        {message && (
          <div className="mt-4 p-3 bg-green-100 text-green-700 rounded shadow">
            {message}
          </div>
        )}
      </main>

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
