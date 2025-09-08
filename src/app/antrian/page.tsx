'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; 
import QueueCard from "@/components/QueueCard";
import QueueHeader from "@/components/QueueHeader";
import { ArrowLeft } from 'lucide-react';

export default function AntrianPage() {
  const router = useRouter();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const options = [
    { title: 'UMUM', image: '/icons/umum.svg', jenis: 'UMUM' },
    { title: 'JAMINAN', image: '/icons/jaminan.svg', jenis: 'JAMINAN' },
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

  const handleCardClick = async (jenis: string) => {
    if (jenis === 'UMUM') {
      await createAntrian(jenis);
    } else if (jenis === 'JAMINAN') {
      router.push('/antrian/jaminan');
    }
  };

  const createAntrian = async (jenis: string) => {
    try {
      const res = await fetch('http://172.20.10.2:4000/api/pasiens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({ jenis })
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const json = await res.json();
      const nomorAntrian = json.data.AntrianPasiens[0]?.nomor_Antrian;
      setMessage(`Nomor antrian ${nomorAntrian} berhasil dibuat.`);
    } catch (err) {
      console.error('Gagal membuat antrian pasien:', err);
      setMessage('Terjadi kesalahan saat membuat antrian.');
    }
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="w-full h-screen flex flex-col bg-white relative">
      <QueueHeader />

      {!isFullscreen && (
        <div className="absolute top-[72px] left-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-2xl shadow-sm transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Kembali</span>
          </button>
        </div>
      )}

      <main className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-semibold mb-4">Laboratorium PK & MK</h1>
        <div className="flex gap-6 flex-wrap justify-center mb-4">
          {options.map((option, i) => (
            <div
              key={i}
              onClick={() => handleCardClick(option.jenis)}
              className="cursor-pointer"
            >
              <QueueCard title={option.title} image={option.image} />
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
