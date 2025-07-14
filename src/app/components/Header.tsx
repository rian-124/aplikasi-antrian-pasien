'use client';

import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  // Fungsi konversi path ke judul
  const getTitle = (path: string) => {
    const map: Record<string, string> = {
      '/dashboard': 'Dashboard',
      '/queue': 'Queue Manage',
      '/monitoring': 'Monitoring Antrian',
      '/antrian': 'Pilih Antrian',
    };

    return map[path] || 'Page';
  };

  const title = getTitle(pathname);

  return (
    <div className="flex items-center justify-between px-6 py-3 bg-white rounded-xl shadow mb-6">
      <h2 className="text-xl font-semibold text-black">{title}</h2>
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-black">Meja 10</span>

        <div className="w-8 h-8 rounded-full overflow-hidden">
          <img src="/icons/profile.svg" alt="Profile" className="w-full h-full object-cover" />
        </div>

        <div className="relative">
          <details className="group">
            <summary className="w-8 h-8 rounded-full border border-gray-300 cursor-pointer flex items-center justify-center hover:bg-gray-100 transition">
              <svg
                className="w-4 h-4 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <ul className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-10">
              <li><a href="/dashboard" className="block px-4 py-2 hover:bg-gray-100 text-sm font-semibold text-gray-700">Antrian</a></li>
              <li><a href="/monitoring" className="block px-4 py-2 hover:bg-gray-100 text-sm font-semibold text-gray-700">Monitoring Antrian</a></li>
              <li><a href="/antrian" className="block px-4 py-2 hover:bg-gray-100 text-sm font-semibold text-gray-700">Pilih Antrian</a></li>
              <li><a href="/" className="block px-4 py-2 hover:bg-gray-100 text-sm font-semibold text-gray-700">Logout</a></li>
            </ul>
          </details>
        </div>
      </div>
    </div>
  );
}
