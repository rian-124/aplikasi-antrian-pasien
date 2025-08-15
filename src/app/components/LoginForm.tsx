"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthService } from "../classes/AuthService";
import { LoginFormManager } from "../classes/LoginFormManager";

export default function LoginForm() {
  const router = useRouter();
  const formManager = new LoginFormManager();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    remember: false,
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await AuthService.login(formData.username, formData.password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-white p-10 rounded-xl shadow-md w-96">
      <h2 className="text-2xl font-bold text-center mb-1">Login</h2>
      <p className="text-gray-500 text-center mb-6">Sign in with your username</p>

      <form onSubmit={handleSubmit}>
        {formManager.getFields().map((field) =>
          field.type === "checkbox" ? null : (
            <div className="mb-4" key={field.name}>
              <input
                type={field.type}
                name={field.name}
                placeholder={
                  field.name === "username"
                    ? "Enter your username"
                    : field.placeholder
                }
                value={formData[field.name as "username" | "password"]}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )
        )}

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
            Forgot Password?
          </Link>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

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
