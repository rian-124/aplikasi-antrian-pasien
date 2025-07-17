'use client';

import { useState, useEffect } from 'react';
import { User } from '../classes/User';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userData: User | null;
  onSave: (updatedUser: User) => void;
}

export default function EditUserModal({ isOpen, onClose, userData, onSave }: Props) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [outlet, setOutlet] = useState('');
  const [role, setRole] = useState('Admin');

  useEffect(() => {
    if (userData) {
      setEmail(userData.email);
      setName(userData.name);
      setOutlet(userData.outlet);
      setRole(userData.role);
    }
  }, [userData]);

  if (!isOpen || !userData) return null;

//   const handleSave = () => {
//     const updatedUser = new User(email, name, outlet, role);
//     onSave(updatedUser);
//     onClose();
//   };

  return (
    <div className="absolute top-14 left-0 z-20 bg-white shadow-md rounded-xl w-80 p-6 border border-gray-200">
      <h2 className="text-lg font-semibold mb-4">Edit User</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3 text-sm"
      />
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
        className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3 text-sm"
      />
      <input
        type="text"
        placeholder="Outlet"
        value={outlet}
        onChange={e => setOutlet(e.target.value)}
        className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3 text-sm"
      />
      <select
        value={role}
        onChange={e => setRole(e.target.value)}
        className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3 text-sm"
      >
        <option value="Admin">Admin</option>
        <option value="Cashier">Cashier</option>
      </select>

      <div className="flex justify-end gap-2">
        <button onClick={onClose} className="text-sm px-4 py-2 border rounded-md">
          Cancel
        </button>
        <button className="text-sm bg-blue-600 text-white px-4 py-2 rounded-md">
          Save
        </button>
      </div>
    </div>
  );
}
