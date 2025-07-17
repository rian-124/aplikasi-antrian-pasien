'use client';

import { useState } from 'react';
import { User } from '../classes/User'; 
import UserTable from '../components/UserTable';
import Sidebar from '../components/Sidebar'; 
import Header from '../components/Header';

const users: User[] = Array(10).fill(
  new User(1, 'kirana@gmail.com', 'Kirana', 'IPRJT', 'Admin')
);

export default function UsersPage() {
  const [collapsed, setCollapsed] = useState(false);
  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <div className="flex">
      <Sidebar collapsed={collapsed} toggle={toggleSidebar} />
      <div className="flex-1 p-2 bg-gray-50 min-h-screen">
        <Header />
        <UserTable users={users} />
      </div>
    </div>
  );
}
