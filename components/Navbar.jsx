"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, ShieldAlert } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  // Daftar menu untuk mempermudah render
  const navLinks = [
    { name: 'Browse Items', href: '/dashboard' },
    { name: 'Report Found', href: '/dashboard/lapor' },
    { name: 'Security Log', href: '/dashboard/log' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Bagian Kiri: Logo CampusFind */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-tema-dark_blue rounded-md flex items-center justify-center text-white shrink-0">
              <Search size={18} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-semibold text-gray-900 text-sm leading-tight">CampusFind</span>
              <span className="text-[10px] text-gray-500 leading-tight">Lost & Found System</span>
            </div>
          </div>

          {/* Bagian Tengah: Tab Navigasi (Hanya muncul di layar agak besar) */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-2 text-sm rounded-md transition-all ${
                    isActive
                      ? 'bg-blue-50 text-tema-dark_blue font-medium border border-blue-200' // Tab Aktif
                      : 'text-gray-500 hover:bg-gray-50 border border-transparent' // Tab Tidak Aktif
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Bagian Kanan: Indikator Security Post */}
          <div className="flex items-center">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-md text-amber-700 text-xs font-medium cursor-pointer hover:bg-amber-100 transition-colors">
              <ShieldAlert size={14} />
              <span className="hidden sm:inline">Security Post</span>
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
}