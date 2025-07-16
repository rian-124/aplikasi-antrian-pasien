'use client'

import { useEffect, useState } from 'react';
import QueueHeader from '../components/QueueHeader';
import QueueList from '../components/QueueList';
import CurrentQueue from '../components/CurrentQueue';

export interface QueueItem {
  number: string;
  table: number;
  type: string;
}

export default function MonitoringPage() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const items: QueueItem[] = Array.from({ length: 9 }, (_, i) => ({
    number: `U-00${i + 1}`,
    table: 2,
    type: 'UMUM',
  }));

  const currentItem = items[0];

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
    <div className="w-full h-screen bg-white flex flex-col relative">
      <QueueHeader />
      <div className="flex flex-1 divide-x divide-gray-300 relative">
        <QueueList items={items} />
        <CurrentQueue item={currentItem} />
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
