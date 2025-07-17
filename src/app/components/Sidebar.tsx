'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Sidebar({
  collapsed,
  toggle,
}: {
  collapsed: boolean;
  toggle: () => void;
}) {
  const router = useRouter();

  return (
    <div
      className={`bg-white shadow-md transition-all duration-300 flex flex-col
        ${collapsed ? 'w-20' : 'w-64'} min-h-screen overflow-y-auto`}
    >
      <div
        className={`flex items-center py-5 mb-6 ${collapsed ? 'justify-center' : 'justify-between px-4'}`}
      >
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Image
              src="/icons/logo-medqlab.svg"
              alt="MedQLab Logo"
              width={100}
              height={24}
            />
          </div>
        )}
        <button onClick={toggle} className="p-1">
          <Image
            src="/icons/sidebar.svg"
            alt="Toggle Sidebar"
            width={24}
            height={24}
          />
        </button>
      </div>

      <div className="px-2">
        {!collapsed && (
          <p className="text-gray-400 text-xs font-semibold mb-3 ml-2">NAVIGATION</p>
        )}
        <ul className="space-y-2 text-sm font-medium text-gray-800">
          <li
            onClick={() => router.push('/dashboard')}
            className={`flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 cursor-pointer
              ${collapsed ? 'justify-center' : ''}`}
          >
            <Image src="/icons/dashboard.svg" alt="Dashboard" width={18} height={18} />
            {!collapsed && <span>Dashboard</span>}
          </li>

          <li
            onClick={() => router.push('/queue')}
            className={`flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 cursor-pointer
              ${collapsed ? 'justify-center' : ''}`}
          >
            <Image src="/icons/queue.svg" alt="Queue Managements" width={18} height={18} />
            {!collapsed && <span>Queue Managements</span>}
          </li>

          <li
            onClick={() => router.push('/user')}
            className={`flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 cursor-pointer
              ${collapsed ? 'justify-center' : ''}`}
          >
            <Image src="/icons/users.svg" alt="Queue Manage" width={18} height={18} />
            {!collapsed && <span>Users</span>}
          </li>
        </ul>
      </div>
    </div>
  );
}