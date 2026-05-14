import { MapPin, Calendar, Image as ImageIcon } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function ItemCard({ item }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 group cursor-pointer hover:-translate-y-1">
      
      {/* Area Foto Atas */}
      <div className="h-32 bg-gray-50 flex items-center justify-center relative border-b border-gray-100 overflow-hidden">
        {item.image_url ? (
          <img 
            src={item.image_url} 
            alt={item.title} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="flex flex-col items-center text-gray-300 group-hover:scale-110 transition-transform duration-300">
            <ImageIcon size={32} />
          </div>
        )}
        
        {/* Panggil komponen StatusBadge yang sudah kamu buat */}
        <div className="absolute top-2 right-2">
          <StatusBadge status={item.status} />
        </div>
      </div>

      {/* Area Info Barang (Bawah) */}
      <div className="p-3">
        {/* Kategori */}
        <div className="text-[10px] font-bold text-tema-dark_blue mb-1 uppercase tracking-wider">
          {item.category}
        </div>
        
        {/* Nama Barang */}
        <h3 className="text-gray-900 font-semibold text-sm mb-2 line-clamp-1" title={item.title}>
          {item.title}
        </h3>
        
        {/* Lokasi */}
        <div className="flex items-center text-gray-500 text-[11px] mb-1">
          <MapPin size={12} className="mr-1.5 shrink-0" />
          <span className="truncate">{item.lokasi_ditemukan}</span>
        </div>
        
        {/* Tanggal & Tombol Aksi */}
        <div className="flex flex-row justify-between items-center mt-2 pt-2 border-t border-gray-50">
          <div className="flex items-center text-gray-400 text-[10px]">
            <Calendar size={12} className="mr-1.5 shrink-0" />
            <span>{item.find_date}</span>
          </div>
          <button className="text-[10px] font-medium px-2.5 py-1 rounded-md border border-gray-200 text-gray-600 hover:bg-tema-dark_blue hover:text-white hover:border-tema-dark_blue transition-colors">
            Detail
          </button>
        </div>
      </div>
    </div>
  );
}