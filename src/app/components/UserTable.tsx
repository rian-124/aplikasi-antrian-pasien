'use client';

import { useState } from 'react';
import { User } from '../classes/User';
import AddUserModal from './AddUserModal';
import { UserPlus2 } from "lucide-react";

export default function UserTable({ users }: { users: User[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <AddUserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

    <div className="rounded-xl p-4 relative">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex items-center gap-2 text-base font-semibold text-gray-800">
            <UserPlus2 className="w-6 h-6 mr-2 text-gray-700" />
            Users List
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600 transition"
          >
            + Add New User
          </button>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
          <input
            type="text"
            placeholder="Search Email / name / Outlet ..."
            className="flex-1 px-4 py-2 border border-gray-300 bg-white rounded-md text-sm"
          />
          <select className="border border-gray-300 bg-white rounded-md px-4 py-2 text-sm">
            <option value="">User Permissions</option>
            <option value="Admin">Admin</option>
            <option value="Cashier">Table</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition">
            Cari
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-fixed text-sm text-left bg-white border border-gray-200 rounded-md overflow-hidden">
            <colgroup>
              <col className="w-[5%]" />
              <col className="w-[25%]" />
              <col className="w-[20%]" />
              <col className="w-[20%]" />
              <col className="w-[15%]" />
              <col className="w-[15%]" />
            </colgroup>
            <thead className="bg-gray-200 text-gray-700 border-b border-gray-300">
              <tr>
                <th className="px-6 py-3">No.</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Outlet</th>
                <th className="px-6 py-3">User Permissions</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index} className="border-t border-gray-200">
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.name}</td>
                  <td className="px-6 py-4">{user.outlet}</td>
                  <td className="px-6 py-4 text-blue-600 font-medium">{user.role}</td>
                  <td className="px-6 py-4 space-x-2">
                    <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-xs">
                      Edit
                    </button>
                    <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
