"use client";

import { useState } from "react";
import { ForgotPasswordManager } from "@/classes/ForgotPasswordManager";
import { useRouter } from "next/navigation";

export default function ForgotPasswordForm() {
  const manager = new ForgotPasswordManager();
  const field = manager.getField();
  const router = useRouter();

  const [username, setUsername] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "http://192.168.50.222:4000/api/users/check-username",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        console.log("Username ditemukan:", data);
        localStorage.setItem("resetToken", data.data.token);
        router.push("/forgot-password/reset");
      } else {
        alert(data.message || "Username tidak ditemukan");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan. Coba lagi.");
    }
  };

  return (
    <div className="bg-white p-10 rounded-xl shadow-md w-96">
      <h2 className="text-2xl font-bold text-center mb-1">Forgot password</h2>
      <p className="text-gray-500 text-center mb-6">
        Please enter your username
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <input
            type="text"
            name="username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition"
        >
          Send
        </button>
      </form>
    </div>
  );
}
