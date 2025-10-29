"use client";

import { useEffect, useState } from "react";

declare interface Window {
  BrowserPrint?: any;
}
import { useRouter } from "next/navigation";
import QueueCard from "@/components/QueueCard";
import QueueHeader from "@/components/QueueHeader";
import { ArrowLeft } from "lucide-react";

import Script from "next/script";

export default function JaminanPage() {
  const router = useRouter();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [penjamins, setPenjamins] = useState<{ id: number; nama: string }[]>(
    []
  );
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [printer, setPrinter] = useState<any>(null);
  const [printerStatus, setPrinterStatus] = useState<string>(
    "Mencari printer Zebra..."
  );
  // Inisialisasi printer Zebra
  useEffect(() => {
    // @ts-ignore
    if (window.BrowserPrint) {
      // @ts-ignore
      window.BrowserPrint.getDefaultDevice(
        "printer",
        function (printerObj: any) {
          if (printerObj) {
            setPrinter(printerObj);
            setPrinterStatus("Printer Zebra terdeteksi: " + printerObj.name);
          } else {
            setPrinterStatus("Printer Zebra tidak ditemukan.");
          }
        },
        function (error: any) {
          setPrinterStatus("Gagal mendapatkan printer: " + error);
        }
      );
    } else {
      setPrinterStatus(
        "BrowserPrint SDK belum tersedia. Silakan install extension Zebra Browser Print."
      );
    }
  }, []);

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
          router.push("/outlet/antrian");
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, router]);

  const fetchPenjamins = async () => {
    try {
      const res = await fetch("http://192.168.50.222:5000/api/penjamins");
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const json = await res.json();
      const filtered = (json.data || []).filter(
        (p: any) => p.jenis_registrasi_id === 2
      );
      setPenjamins(filtered);
    } catch (err) {
      console.error("Gagal mengambil data penjamin:", err);
      setMessage("Gagal mengambil daftar penjamin.");
    }
  };

  const createAntrian = async (penjamin_id: number) => {
    setLoading(true);
    const outletId =
      typeof window !== "undefined"
        ? localStorage.getItem("selected_outlet_id")
        : null;
    if (!outletId) {
      setMessage("Outlet belum dipilih.");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(
        `http://192.168.50.222:5000/api/pasiens/${outletId}/outlet`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jenis: "JAMINAN",
            penjamin_id: penjamin_id,
          }),
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const json = await res.json();
      const nomorAntrian = json.data.AntrianPasiens[0]?.nomor_Antrian;
      setMessage(`Nomor antrian ${nomorAntrian} berhasil dibuat.`);
      printNomorAntrian(nomorAntrian);
    } catch (err) {
      console.error("Gagal membuat antrian pasien:", err);
      setMessage("Terjadi kesalahan saat membuat antrian.");
    } finally {
      setLoading(false);
    }
  };

  // Fungsi print Zebra Browser Print
  const printNomorAntrian = (nomor: string) => {
    if (!printer) {
      setMessage(
        "Printer Zebra belum siap. Pastikan extension dan printer sudah terdeteksi."
      );
      return;
    }
    // Susunan dan penataan sama persis dengan UMUM
    const zpl = `^XA
^PW203
^LL203
^CF0,30
^FO0,70^FB203,1,0,C,0^FDANTRIAN LAB^FS
^CF0,20
^FO0,110^FB203,1,0,C,0^FDJenis: JAMINAN^FS
^CF0,40
^FO0,150^FB203,1,0,C,0^FD${nomor}^FS
^XZ`;
    printer.send(zpl, undefined, function (error: any) {
      if (error) setMessage("Gagal print: " + error);
    });
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
          onClick={() => router.push("/outlet/antrian")}
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

        <div className="mb-2 text-sm text-gray-500">{printerStatus}</div>
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
      <Script
        src="/js/BrowserPrint-3.0.216.min.js"
        strategy="beforeInteractive"
      />
    </div>
  );
}
