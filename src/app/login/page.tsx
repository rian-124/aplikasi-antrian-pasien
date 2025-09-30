"use client";

import LoginForm from '@/components/LoginForm';
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <LoginForm />
      <button
        style={{
          marginTop: '32px',
          padding: '12px 32px',
          background: '#2563eb',
          color: '#fff',
          borderRadius: '8px',
          border: 'none',
          fontSize: '1rem',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}
        onClick={() => router.push('/outlet')}
      >
        Masuk ke Antrian
      </button>
    </main>
  );
}
