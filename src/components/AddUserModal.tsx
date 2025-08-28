"use client";

import { useEffect, useRef, useState } from 'react';
import { UserService } from '@/app/classes/UserService';
import { Role, Outlet } from '@/app/classes/UserModel';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserAdded: () => void; 
}

export default function AddUserModal({ isOpen, onClose, onUserAdded }: AddUserModalProps) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [selectedOutletId, setSelectedOutletId] = useState<number | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      try {
        const [rolesData, outletsData] = await Promise.all([
          UserService.fetchRoles(),
          UserService.fetchOutlets(),
        ]);
        setRoles(rolesData);
        setOutlets(outletsData);
      } catch (error) {
        console.error('Failed to load roles or outlets:', error);
      }
    };

    fetchData();
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password || !name || !selectedRoleId || !selectedOutletId) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      await UserService.createUser({
        username,
        password,
        name,
        role_id: selectedRoleId,
        outlet_id: selectedOutletId,
      });

      toast.success('User created successfully');
      resetForm();
      onUserAdded(); 
      onClose();  
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast.error(error.message || 'An error occurred');
    }
  };

  const resetForm = () => {
    setUsername('');
    setPassword('');
    setName('');
    setSelectedRoleId(null);
    setSelectedOutletId(null);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 flex justify-center items-center z-50 bg-white/30 backdrop-blur-sm transition-opacity duration-300">
        <div
          ref={modalRef}
          className="bg-white p-6 rounded-lg shadow-xl w-[500px] relative border border-gray-200"
        >
          <h2 className="text-lg font-semibold mb-4 text-center">Add New User</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <InputField
              label="Username"
              type="text"
              value={username}
              onChange={setUsername}
              placeholder="Enter username"
            />
            <InputField
              label="Password"
              type="text"
              value={password}
              onChange={setPassword}
              placeholder="Enter password"
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
              value={selectedOutletId}
              onChange={setSelectedOutletId}
              options={outlets.map((o) => ({ id: o.id, name: o.nama_outlet }))}
            />
            <SelectField
              label="User Role"
              value={selectedRoleId}
              onChange={setSelectedRoleId}
              options={roles.map((r) => ({ id: r.id, name: r.name }))}
            />
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  onClose();
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar newestOnTop closeOnClick pauseOnHover />
    </>
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
    <div>
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
    <div>
      <label className="block text-sm font-semibold mb-2 text-gray-700">{label}</label>
      <select
        value={value || ''}
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
