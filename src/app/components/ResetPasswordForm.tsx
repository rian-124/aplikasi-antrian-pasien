'use client'

import { useState } from "react";
import { ResetPasswordManager } from "../classes/ResetPasswordManager"

export default function ResetPasswordForm() {
    const manager = new ResetPasswordManager();
    const fields = manager.getFields();

    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: '',
    });

    const handelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        console.log('Resetting password to:', formData.newPassword);
    };

    return (
        <div className="bg-white p-10 rounded-xl shadow-md w-96">
            <h2 className="text-2xl font-bold text-center mb-1">Forgot passsword</h2>
            <p className="text-gray-500 text-center mb-6">Please enter the new password</p>

            <form onSubmit={handleSubmit}>
                {fields.map((field) => (
                    <div key={field.name} className="mb-4">
                        <input 
                            type={field.type}
                            name={field.type}
                            placeholder={field.placeholder}
                            value={formData[field.name as keyof typeof formData]}
                            onChange={handelChange}
                            className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                    </div>
                ))}
                <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition">
                    Reset                    
                </button>
            </form>
        </div>
    );
}