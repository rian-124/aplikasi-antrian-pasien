'use client'

import { useEffect, useState } from "react";
import QueueCard from "../components/QueueCard";
import QueueHeader from "../components/QueueHeader";

export default function AntrianPage() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const options = [
    {
      title: 'UMUM',
      image: '/icons/umum.svg',
    },
    {
      title: 'JAMINAN',
      image: '/icons/jaminan.svg',
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

      <main className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-semibold mb-10">Labotorium PK & MK</h1>
        <div className="flex gap-6 flex-wrap justify-center">
          {options.map((option, i) => (
            <QueueCard key={i} title={option.title} image={option.image}/>
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
