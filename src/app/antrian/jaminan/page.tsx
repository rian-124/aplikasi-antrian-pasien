'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; 
import QueueCard from "@/app/components/QueueCard"; 
import QueueHeader from "@/app/components/QueueHeader"; 
import { ArrowLeft } from 'lucide-react';

export default function JaminanPage() {
  const router = useRouter();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const options = [
    {
      title: 'BPJS',
      image: '/icons/doctor-1.svg',
      page: '/antrian/jaminan',
    },
    {
      title: 'Jamkesda',
      image: '/icons/doctor-2.svg',
      page: '/antrian/jaminan',
    },
    {
      title: 'Askes',
      image: '/icons/doctor-3.svg',
      page: '/antrian/jaminan',
    },
    {
      title: 'Asuransi Swasta',
      image: '/icons/doctor-4.svg',
      page: '/antrian/jaminan',
    },
  ];

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
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <div className="w-full h-screen flex flex-col bg-white relative">
      <QueueHeader />

      <div className="absolute top-[72px] left-4">
        <button
            onClick={() => router.push('/antrian')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-2xl shadow-sm transition"
        >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Kembali</span>
        </button>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-semibold mb-10">Jaminan</h1>
        <div className="flex gap-6 flex-wrap justify-center">
          {options.map((option, i) => (
            <div key={i} onClick={() => router.push(option.page || "/")} className="cursor-pointer">
              <QueueCard title={option.title} image={option.image} />
            </div>
          ))}
        </div>
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
