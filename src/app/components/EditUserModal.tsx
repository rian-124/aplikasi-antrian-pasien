'use client';

import { useState, useEffect } from 'react';
import { User } from '../classes/User';
import { Outlet, Role } from '../classes/UserModel';
import { UserService } from '../classes/UserService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userData: User | null;
  onSave: (updatedUser: User) => void;
  outlets: Outlet[];
}

export default function EditUserModal({ isOpen, onClose, userData, onSave, outlets }: Props) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [outletId, setOutletId] = useState<number | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchRoles = async () => {
      try {
        const roleData = await UserService.fetchRoles();
        setRoles(roleData);
      } catch (err) {
        console.error('Failed to fetch roles:', err);
      }
    };

    fetchRoles();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && userData && outlets.length > 0) {
      setEmail(userData.email);
      setName(userData.name);
      setOutletId(userData.outlet_id);  
      setSelectedRoleId(userData.role_id);
    }
  }, [userData, isOpen, outlets]);

  const handleSave = () => {
    if (outletId === null || selectedRoleId === null) {
      alert('Please select an outlet and role');
      return;
    }

    const updatedUser = new User(
      userData!.id,
      email,
      name,
      outletId,
      selectedRoleId
    );

    onSave(updatedUser);
  };

  if (!isOpen || !userData) return null;

  return (
    <div className="fixed inset-0 bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-30">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-md p-6 border border-gray-200 relative">
        <h2 className="text-lg font-semibold mb-4">Edit User</h2>

        <InputField
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="Enter email"
        />
        <InputField
          label="Name"
          type="text"
          value={name}
          onChange={setName}
          placeholder="Enter name"
        />
        <SelectField
          label="Outlet"
          value={outletId}
          onChange={setOutletId}
          options={outlets.map(o => ({ id: o.id, name: o.nama_outlet }))}
        />
        <SelectField
          label="User Role"
          value={selectedRoleId}
          onChange={setSelectedRoleId}
          options={roles.map(r => ({ id: r.id, name: r.name }))}
        />

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="text-sm px-4 py-2 border rounded-md">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="text-sm bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function InputField({
  label,
  type,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="mb-3">
      <label className="block text-sm font-semibold mb-2 text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: number | null;
  onChange: (v: number) => void;
  options: { id: number; name: string }[];
}) {
  return (
    <div className="mb-3">
      <label className="block text-sm font-semibold mb-2 text-gray-700">{label}</label>
      <select
        value={value !== null ? String(value) : ''}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.name}
          </option>
        ))}
      </select>
    </div>
  );
}
