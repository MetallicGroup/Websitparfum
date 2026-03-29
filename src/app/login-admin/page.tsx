"use client";

import React, { useState } from "react";
import { loginAdmin } from "@/actions/auth";
import { Lock, User, KeyRound } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await loginAdmin(formData);
    
    if (result && !result.success) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#E0F7FA] via-[#FCE4EC] to-[#F3E5F5] relative overflow-hidden">
      
      {/* Decorative Blob */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-white opacity-40 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#E0F7FA] opacity-60 blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden relative z-10 border border-white/50">
        <div className="p-10 text-center pb-6">
          <Link href="/" className="inline-block mb-6">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Kiddy<span className="text-pink-500">Shop</span>
            </h1>
          </Link>
          <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-blue-500 to-turquoise rounded-2xl flex items-center justify-center mb-4 shadow-lg transform rotate-3">
            <Lock className="text-white" size={28} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Panou Administrare</h2>
          <p className="text-gray-500 mt-2">Introdu datele pentru a continua</p>
        </div>
        
        <form onSubmit={handleSubmit} className="px-10 pb-10">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg text-sm font-medium animate-pulse">
              {error}
            </div>
          )}

          <div className="mb-5 relative">
            <label className="block text-sm font-bold text-gray-700 mb-2">Utilizator</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="text" 
                name="username"
                required
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-4 ring-blue-50 focus:border-blue-400 transition-all outline-none font-medium text-gray-800 placeholder-gray-400 shadow-sm"
                placeholder="Introdu contul"
              />
            </div>
          </div>

          <div className="mb-8 relative">
            <label className="block text-sm font-bold text-gray-700 mb-2">Parolă</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <KeyRound className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="password" 
                name="password"
                required
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-4 ring-blue-50 focus:border-blue-400 transition-all outline-none font-medium text-gray-800 placeholder-gray-400 shadow-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-lg hover:bg-turquoise transition-all disabled:opacity-70 flex justify-center items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {loading ? (
              <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : "Conectează-te acum"}
          </button>
        </form>
      </div>
    </div>
  );
}
