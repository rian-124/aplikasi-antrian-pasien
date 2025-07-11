"use client";

import { useState } from "react";
import { LoginFormManager } from "../classes/LoginFormManager";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const manager = new LoginFormManager();
  const fields = manager.getFields();
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    router.push("/dashboard")
  };

  return (
    <div className="bg-white p-10 rounded-xl shadow-md w-96">
      <h2 className="text-2xl font-bold text-center mb-1">Login</h2>
      <p className="text-gray-500 text-center mb-6">Sign in with your email</p>

      <form onSubmit={handleSubmit}>
        {fields.map((field) => (
          <div key={field.name} className="mb-4">
            <input
              type={field.type}
              name={field.name}
              placeholder={field.placeholder}
              value={formData[field.name as keyof typeof formData] as string}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}

        <div className="flex items-center justify-between text-sm mb-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="remember"
              checked={formData.remember}
              onChange={handleChange}
              className="form-checkbox"
            />
            Remember me
          </label>
          <Link href="/forgot-password" className="text-blue-600 hover:underline">
            Forget Password?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}