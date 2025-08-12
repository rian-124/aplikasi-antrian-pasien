'use client';

import { useState } from "react";
import { ResetPasswordManager } from "../classes/ResetPasswordManager";
import { useRouter } from 'next/navigation';

export default function ResetPasswordForm() {
  const manager = new ResetPasswordManager();
  const fields = manager.getFields();
  const router = useRouter();

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (formData.newPassword !== formData.confirmPassword) {
    alert('Password dan konfirmasi tidak sama!');
    return;
  }

  const token = localStorage.getItem('resetToken');
  if (!token) {
    alert('Token tidak ditemukan, silakan ulangi proses lupa password.');
    router.push('/forgot-password');
    return;
  }

  try {
    const res = await fetch('http://192.168.50.2:4000/api/users/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        newPassword: formData.newPassword, 
      }),
    });

    const data = await res.json();
    if (res.ok) {
      alert('Password berhasil direset, silakan login.');
      localStorage.removeItem('resetToken');
      router.push('/login');
    } else {
      alert(data.message || 'Gagal reset password');
    }
  } catch (err) {
    console.error(err);
    alert('Terjadi kesalahan. Coba lagi.');
  }
};


  return (
    <div className="bg-white p-10 rounded-xl shadow-md w-96">
      <h2 className="text-2xl font-bold text-center mb-1">Reset password</h2>
      <p className="text-gray-500 text-center mb-6">Please enter the new password</p>

      <form onSubmit={handleSubmit}>
        {fields.map((field) => (
          <div key={field.name} className="mb-4">
            <input
              type={field.type}
              name={field.name}
              placeholder={field.placeholder}
              value={formData[field.name as keyof typeof formData]}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition"
        >
          Reset
        </button>
      </form>
    </div>
  );
}
