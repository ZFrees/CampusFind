"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { Search, Mail, Lock } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState(''); 
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('');

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setStatus(`Gagal: ${error.message}`);
      setIsLoading(false);
    } else {
      // 1. Segarkan data agar Middleware tahu kita sudah punya session
      router.refresh(); 
      
      // 2. Tambahkan delay kecil atau langsung push
      setTimeout(() => {
        router.push('/dashboard');
      }, 100);
    }
  };

  return (
    <div className="min-h-screen bg-tema-light_gray flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-tema-dark_blue rounded-xl flex items-center justify-center text-white mb-4 shadow-md">
            <Search size={24} strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Masuk Kembali</h1>
          <p className="text-sm text-gray-500 mt-1">Gunakan akun yang sudah terdaftar.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600 uppercase">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-tema-dark_blue outline-none text-sm" placeholder="nama@email.com" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600 uppercase">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-tema-dark_blue outline-none text-sm" placeholder="••••••••" />
            </div>
          </div>

          <button type="submit" disabled={isLoading}
            className="w-full py-3 bg-tema-dark_blue text-white rounded-lg font-bold hover:bg-blue-900 transition-all shadow-md">
            {isLoading ? 'Memproses...' : 'Masuk Sekarang'}
          </button>
        </form>

        {status && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg text-center font-medium">
            {status}
          </div>
        )}

        <div className="mt-6 text-center border-t border-gray-100 pt-6">
          <p className="text-xs text-gray-500">
            Belum punya akun? <Link href="/signup" className="text-tema-dark_blue font-bold hover:underline">Daftar di sini</Link>
          </p>
        </div>
      </div>
    </div>
  );
}