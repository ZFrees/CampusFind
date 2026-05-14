"use client";

import { useState } from 'react';
import { Search, Mail, User, Lock } from 'lucide-react'; // Tambahan ikon Lock di sini
import { supabase } from '../../lib/supabase';
import Link from 'next/link';

export default function Signup() {
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // State untuk password
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    // Menggunakan signUp dengan Email + Password + Data Nama
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password, // Mengirim password ke Supabase
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          full_name: nama, 
        },
      },
    });

    if (error) {
      setMessage(`Gagal: ${error.message}`);
    } else {
      setMessage('Pendaftaran berhasil! Cek email kamu dan klik tautan verifikasi.');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-tema-light_gray flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-gray-100 p-8">
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-tema-dark_blue rounded-xl flex items-center justify-center text-white mb-4 shadow-md">
            <Search size={24} strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Daftar Akun Baru</h1>
          <p className="text-sm text-gray-500 mt-2">Mulai bantu sesama mahasiswa di CampusFind.</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          
          {/* Input Nama Lengkap */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Nama Lengkap</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                required
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-tema-dark_blue outline-none text-sm"
                placeholder="Your Name"
              />
            </div>
          </div>

          {/* Input Email */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Email Kampus / Pribadi</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-tema-dark_blue outline-none text-sm"
                placeholder="nama@email.com"
              />
            </div>
          </div>

          {/* Input Password (Baru) */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Buat Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-tema-dark_blue outline-none text-sm"
                placeholder="Minimal 6 karakter"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-tema-dark_blue text-white rounded-lg font-bold hover:bg-blue-900 transition-all shadow-md active:scale-[0.98] disabled:opacity-50 mt-2"
          >
            {isLoading ? 'Memproses...' : 'Daftar Sekarang'}
          </button>
        </form>

        {message && (
          <div className={`mt-4 p-3 rounded-lg border text-sm text-center font-medium ${
            message.includes('Gagal') 
            ? 'bg-red-50 border-red-200 text-red-700' 
            : 'bg-emerald-50 border-emerald-200 text-emerald-700'
          }`}>
            {message}
          </div>
        )}

        <div className="mt-6 text-center border-t border-gray-100 pt-6">
          <p className="text-xs text-gray-500">
            Sudah punya akun?{' '}
            <Link href="/login" className="text-tema-dark_blue font-bold hover:underline">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}