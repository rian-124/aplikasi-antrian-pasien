'use client';

import { useState } from "react"
import { Stat } from "../classes/Stat";
import { Patient } from "../classes/Patient";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import PatientTable from "../components/PatientTable";

export default function DashboardPage() {
    const [collapsed, setCollapsed] = useState(false);
    const toggleSidebar = () => setCollapsed(!collapsed);

    const stats = [
    new Stat('Waiting', 26, '/icons/wait.svg', 'text-black'),
    new Stat('Called', 2, '/icons/called.svg', 'text-black'),
    new Stat('Completed', 17, '/icons/completed.svg', 'text-black'),
    new Stat('Cancelled', 8, '/icons/cancelled.svg', 'text-black'),
    ];

    const patient = new Patient(1, 'F-100', '120983189', 'IPRJ', 'COMPLETED');
    const patients = Array.from({ length: 10 }, (_, i) => new Patient(i + 1, patient.patientNumber, patient.labReg, patient.outlet, patient.status));


    return (
        <div className="flex">
            <Sidebar collapsed={collapsed} toggle={toggleSidebar} />
            <div className="flex-1 p-2 bg-gray-50 min-h-screen">
            <div className="flex items-center justify-between px-6 py-3 bg-white rounded-xl shadow mb-6">
            <h2 className="text-xl font-semibold text-black">Dashboard</h2>

            <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-black">Meja 10</span>

                <div className="w-8 h-8 rounded-full overflow-hidden">
                <img src="/icons/profile.svg" alt="Profile" className="w-full h-full object-cover" />
                </div>

                <div className="relative">
                    <details className="group">
                        <summary className="w-8 h-8 rounded-full border border-gray-300 cursor-pointer flex items-center justify-center hover:bg-gray-100 transition">
                        <svg
                            className="w-4 h-4 text-gray-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        </summary>
                        <ul className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-10">
                        <li>
                            <a href="/dashboard" className="block px-4 py-2 font-semibold hover:bg-gray-100 text-sm text-gray-700">
                            Antrian
                            </a>
                        </li>
                        <li>
                            <a href="/monitoring" className="block px-4 py-2 font-semibold hover:bg-gray-100 text-sm text-gray-700">
                            Monitoring Antrian
                            </a>
                        </li>
                        <li>
                            <a href="/antrian" className="block px-4 py-2 font-semibold hover:bg-gray-100 text-sm text-gray-700">
                            Pilih Antrian
                            </a>
                        </li>
                        <li>
                            <a href="/" className="block px-4 py-2 font-semibold hover:bg-gray-100 text-sm text-gray-700">
                            Logout
                            </a>
                        </li>
                        </ul>
                    </details>
                    </div>
                </div>
            </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {stats.map((s, i) => (
                        <StatCard key={i} title={s.title} value={s.value} icon={s.icon} color={s.color} />
                    ))}
                </div>

                <PatientTable data={patients} />
            </div>
        </div>
    );
}