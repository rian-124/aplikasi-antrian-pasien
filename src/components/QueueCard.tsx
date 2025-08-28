'use client';

import Link from "next/link";

export default function QueueCard({ title, image }: { title: string, image: string}) {
    return (
        <Link href=''>
            <div className="w-64 h-72 bg-white rounded-xl shadow-lg flex flex-col items-center justify-center p-6 hover:shadow-2xl transition-transform hover:scale-105">
                <img src={image} alt={title} className="w-28 h-28 mb-6" />
                <h3 className="text-xl font-bold text-black">{title}</h3>
            </div>
        </Link>
    );
}