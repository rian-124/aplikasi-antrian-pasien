'use client';

import { useState } from 'react';
import UserTable from '@/components/UserTable';
import Sidebar from '@/components/Sidebar'; 
import Header from '@/components/Header';

export default function UsersPage() {
  const [collapsed, setCollapsed] = useState(false);
  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <div className="flex">
      <Sidebar collapsed={collapsed} toggle={toggleSidebar} />
      <div className="flex-1 p-2 bg-gray-50 min-h-screen">
        <Header />
        <UserTable/>
      </div>
    </div>
  );
}
