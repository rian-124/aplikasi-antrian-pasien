'use client'

import { useEffect, useState } from "react"

export default function QueueHeader() {
    const [time, setTime] = useState<string>(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        }, 60000);
        return () => clearInterval(interval);
    })

    return (
        <div>
            <header className="w-full px-6 py-4 bg-[#2d2f39] flex items-center justify-between text-white shadow">
                <img src="/icons/logo-medqlab.svg" alt="Logo" className="h-6 object-contain" width={60} height={60}/>
                <span className="text-sm font-bold">{time}</span>
            </header>
        </div>
    );
}