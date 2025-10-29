"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import QueueHeader from "@/components/QueueHeader";

type Outlet = {
  id: number;
  nama_outlet: string;
};

const outletImages: Record<number, string> = {
  1: "/icons/doctor-1.svg",
  2: "/icons/doctor-2.svg",
  3: "/icons/doctor-3.svg",
  4: "/icons/doctor-4.svg",
};

export default function OutletPage() {
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("http://192.168.50.222:5000/api/outlet")
      .then((res) => res.json())
      .then((json) => setOutlets(json.data || []));
  }, []);

  const handleOutletClick = (id: number) => {
    localStorage.setItem("selected_outlet_id", String(id));
    router.push("/outlet/antrian");
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-white relative">
      <QueueHeader />
      {!isFullscreen && (
        <div className="absolute top-[72px] left-4">
          <button
            onClick={() => router.push("/login")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-2xl shadow-sm transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Kembali</span>
          </button>
        </div>
      )}

      <main className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-semibold mb-6">Daftar Outlet</h1>
        <div className="flex gap-6 flex-wrap justify-center mb-4">
          {outlets.map((outlet) => (
            <div
              key={outlet.id}
              className="cursor-pointer"
              onClick={() => handleOutletClick(outlet.id)}
            >
              <div className="w-64 h-72 bg-white rounded-xl shadow-lg flex flex-col items-center justify-center p-6 hover:shadow-2xl transition-transform hover:scale-105">
                <img
                  src={outletImages[outlet.id] || "/icons/queue.svg"}
                  alt={outlet.nama_outlet}
                  className="w-28 h-28 mb-6"
                />
                <h3 className="text-xl font-bold text-black">
                  {outlet.nama_outlet}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
