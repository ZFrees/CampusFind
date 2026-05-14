"use client";

import { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Image as ImageIcon, X, Phone } from 'lucide-react';
import { supabase } from '../../lib/supabase'; // Pastikan path ini sesuai dengan yang berhasil di komputermu

export default function Dashboard() {
  // 1. STATE MANAGEMENT
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State baru untuk menampung data barang yang sedang di-klik
  const [selectedItem, setSelectedItem] = useState(null);

  // 2. FETCH DATA DARI SUPABASE
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error("Gagal menarik data:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 3. LOGIKA FILTER & PENCARIAN
  const filteredItems = items.filter(item => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      item.title?.toLowerCase().includes(query) || 
      item.lokasi_ditemukan?.toLowerCase().includes(query) ||
      item.category?.toLowerCase().includes(query) ||
      (item.description && item.description.toLowerCase().includes(query));
    
    let matchesFilter = true;
    if (filter === 'available') matchesFilter = item.status === 'Published'; 
    else if (filter === 'security') matchesFilter = item.status === 'At Security'; 

    return matchesSearch && matchesFilter;
  });

  // 4. LOGIKA STATISTIK ANGKA
  const currentMonth = new Date().getMonth();
  const itemsThisMonth = items.filter(item => new Date(item.created_at).getMonth() === currentMonth).length;
  const returnedItems = items.filter(item => item.status === 'Returned').length;
  const securityItems = items.filter(item => item.status === 'At Security').length;

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  return (
    <div className="max-w-6xl mx-auto relative">
      
      {/* HEADER & SEARCH BAR */}
      <div className="p-6 pb-4 flex items-center gap-3 flex-wrap">
        <div className="flex-1 relative min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 opacity-60" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama barang, lokasi, atau kategori..." 
            className="w-full py-2 pl-9 pr-3 text-sm border border-gray-300 rounded-md bg-gray-50 focus:bg-white focus:border-tema-dark_blue outline-none transition-all"
          />
        </div>
        
        <button onClick={() => setFilter('all')} className={`px-4 py-2 text-sm border rounded-md transition-colors ${filter === 'all' ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-medium' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}>All</button>
        <button onClick={() => setFilter('available')} className={`px-4 py-2 text-sm border rounded-md transition-colors ${filter === 'available' ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-medium' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}>Available</button>
        <button onClick={() => setFilter('security')} className={`px-4 py-2 text-sm border rounded-md transition-colors ${filter === 'security' ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-medium' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}>At Security</button>
      </div>

      {/* STATS PILL */}
      <div className="flex gap-2 px-6 pb-5 flex-wrap">
        <div className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600 border border-gray-200"><span className="font-semibold text-gray-900">{itemsThisMonth}</span> items found this month</div>
        <div className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600 border border-gray-200"><span className="font-semibold text-gray-900">{returnedItems}</span> returned to owner</div>
        <div className="px-3 py-1 text-xs rounded-full bg-amber-50 text-amber-700 border border-amber-200"><span className="font-semibold text-amber-900">{securityItems}</span> at security post</div>
      </div>

      {/* ITEM GRID */}
      <div className="px-6 pb-6">
        {isLoading ? (
           <div className="col-span-full flex flex-col items-center py-16 text-gray-400">
             <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-tema-dark_blue mb-3"></div>
             <p className="text-sm">Memuat data barang...</p>
           </div>
        ) : filteredItems.length === 0 ? (
          <div className="col-span-full text-center py-16 text-gray-400 text-sm bg-white rounded-xl border border-gray-200 border-dashed">
            <div className="text-4xl mb-3">🔍</div>
            Tidak ada barang yang cocok dengan pencarianmu.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
                
                <div className="h-36 bg-gray-100 relative overflow-hidden flex-shrink-0 cursor-pointer" onClick={() => setSelectedItem(item)}>
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageIcon size={32} strokeWidth={1.5} /></div>
                  )}
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-tema-dark_blue text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">{item.category}</div>
                </div>

                <div className="p-3 flex flex-col flex-grow">
                  <h3 className="text-sm font-bold text-gray-900 mb-1.5 line-clamp-1">{item.title}</h3>
                  <div className="space-y-1 mb-3">
                    <div className="flex items-center text-xs text-gray-600"><MapPin size={12} className="mr-1.5 text-gray-400 flex-shrink-0" /><span className="line-clamp-1">{item.lokasi_ditemukan}</span></div>
                    <div className="flex items-center text-xs text-gray-600"><Calendar size={12} className="mr-1.5 text-gray-400 flex-shrink-0" /><span>{formatDate(item.find_date)}</span></div>
                  </div>
                  {/* Tombol yang memicu Pop-up Modal */}
                  <button onClick={() => setSelectedItem(item)} className="w-full py-1.5 mt-auto bg-gray-50 text-tema-dark_blue font-semibold text-xs rounded-md border border-gray-200 hover:bg-tema-dark_blue hover:text-white transition-colors">
                    Lihat Detail
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* POP-UP MODAL (Hanya muncul jika selectedItem tidak null) */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Detail Barang</h2>
              <button onClick={() => setSelectedItem(null)} className="p-1 rounded-full hover:bg-gray-100 transition-colors text-gray-500">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body (Bisa di-scroll jika isinya panjang) */}
            <div className="overflow-y-auto p-5 space-y-5">
              {/* Gambar Besar */}
              <div className="w-full h-64 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center border border-gray-200">
                {selectedItem.image_url ? (
                  <img src={selectedItem.image_url} alt={selectedItem.title} className="w-full h-full object-contain bg-gray-50" />
                ) : (
                  <div className="flex flex-col items-center text-gray-400">
                    <ImageIcon size={48} className="mb-2 opacity-50" />
                    <span className="text-sm font-medium">Tidak ada foto</span>
                  </div>
                )}
              </div>

              {/* Info Utama */}
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{selectedItem.title}</h3>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    selectedItem.status === 'Published' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {selectedItem.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mt-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Kategori</p>
                    <p className="text-sm font-medium text-gray-800">{selectedItem.category}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Tanggal Ditemukan</p>
                    <p className="text-sm font-medium text-gray-800">{formatDate(selectedItem.find_date)}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Lokasi Temuan</p>
                    <p className="text-sm font-medium text-gray-800 flex items-center gap-1.5">
                      <MapPin size={14} className="text-tema-dark_blue" />
                      {selectedItem.lokasi_ditemukan}
                    </p>
                  </div>
                </div>
              </div>

              {/* Deskripsi Tambahan */}
              <div>
                <p className="text-xs font-bold text-gray-900 uppercase mb-2">Deskripsi Lengkap</p>
                <p className="text-sm text-gray-600 bg-white border border-gray-100 p-3 rounded-lg leading-relaxed">
                  {selectedItem.description || "Pelapor tidak menambahkan deskripsi tambahan."}
                </p>
              </div>

            </div>

            {/* Modal Footer (Kontak) */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 mb-0.5">Kontak Penemu:</p>
                <p className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                  <Phone size={14} className="text-tema-dark_blue" />
                  {selectedItem.contact_info || "Tidak ada kontak"}
                </p>
              </div>
              <button className="px-4 py-2 bg-tema-dark_blue text-white text-sm font-bold rounded-lg hover:bg-blue-900 transition-colors shadow-sm">
                Hubungi Penemu
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}