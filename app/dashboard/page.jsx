"use client";
import { useState } from 'react';
import { Search } from 'lucide-react';

export default function Dashboard() {
  // State untuk filter tombol (All / Available / At Security)
  const [filter, setFilter] = useState('all');
  
  // Data dikosongkan (Array kosong) sesuai permintaan.
  // Nanti array ini akan diisi oleh data tarikan dari Supabase.
  const items = []; 

  return (
    <div className="max-w-6xl mx-auto">
      
      {/* 1. HEADER & SEARCH BAR */}
      <div className="p-6 pb-4 flex items-center gap-3 flex-wrap">
        <div className="flex-1 relative min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 opacity-60" />
          <input 
            type="text" 
            placeholder="Search items, location, date..." 
            className="w-full py-2 pl-9 pr-3 text-sm border border-gray-300 rounded-md bg-gray-50 focus:bg-white focus:border-tema-dark_blue outline-none transition-all"
          />
        </div>
        
        {/* Tombol Filter */}
        <button 
          onClick={() => setFilter('all')}
          className={`px-4 py-2 text-sm border rounded-md transition-colors ${
            filter === 'all' 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-medium' 
              : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
          }`}
        >
          All
        </button>
        <button 
          onClick={() => setFilter('available')}
          className={`px-4 py-2 text-sm border rounded-md transition-colors ${
            filter === 'available' 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-medium' 
              : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
          }`}
        >
          Available
        </button>
        <button 
          onClick={() => setFilter('security')}
          className={`px-4 py-2 text-sm border rounded-md transition-colors ${
            filter === 'security' 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-medium' 
              : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
          }`}
        >
          At Security
        </button>
      </div>

      {/* 2. STATS PILL (Indikator Angka) */}
      <div className="flex gap-2 px-6 pb-5 flex-wrap">
        <div className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600 border border-gray-200">
          <span className="font-semibold text-gray-900">0</span> items found this month
        </div>
        <div className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600 border border-gray-200">
          <span className="font-semibold text-gray-900">0</span> returned to owner
        </div>
        <div className="px-3 py-1 text-xs rounded-full bg-amber-50 text-amber-700 border border-amber-200">
          <span className="font-semibold text-amber-900">0</span> at security post
        </div>
      </div>

      {/* 3. ITEM GRID / EMPTY STATE */}
      <div className="px-6 pb-6">
        {items.length === 0 ? (
          // Tampilan jika data barang kosong
          <div className="col-span-full text-center py-16 text-gray-400 text-sm bg-white rounded-xl border border-gray-200 border-dashed">
            <div className="text-4xl mb-3">🔍</div>
            No items found matching your criteria.
          </div>
        ) : (
          // Tampilan Grid jika ada data (Saat ini tidak akan tereksekusi karena items kosong)
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {/* Komponen <ItemCard /> akan diletakkan di sini nantinya */}
          </div>
        )}
      </div>

    </div>
  );
}