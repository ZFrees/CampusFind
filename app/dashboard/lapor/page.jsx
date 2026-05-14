"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase'; // Sesuaikan path ini jika perlu
import { Package, MapPin, Calendar, FileText, Image as ImageIcon, CheckCircle, Contact } from 'lucide-react';

export default function LaporBarang() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [imageFile, setImageFile] = useState(null);

  // State untuk menyimpan input form
  const [formData, setFormData] = useState({
    title: '',
    category: 'Select Category', // Default pilihan
    lokasi_ditemukan: '',
    find_date: '',
    description: '',
    contact_info: '',
    image_url: ''
  });

  // Fungsi untuk mengupdate state saat user mengetik
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  // Fungsi untuk mengirim data ke Supabase
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: '' });

    try {
      // 1. (Opsional) Ambil ID user yang sedang login agar kita tahu siapa pelapornya
      const { data: { user } } = await supabase.auth.getUser();

      let uploadedImageUrl = null;

      if (imageFile) {
        setMessage({ text: 'Uploading image...', type: 'info' });

        // Buat nama file unik (gabungan waktu dan nama asli) agar tidak bentrok
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;

        // Upload ke bucket 'item-images'
        const { error: uploadError } = await supabase.storage
          .from('Item Photos') // Pastikan nama bucket ini persis sama dengan yang di Supabase
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        // Ambil URL publik dari gambar yang baru di-upload
        const { data: publicUrlData } = supabase.storage
          .from('item-images')
          .getPublicUrl(filePath);

        uploadedImageUrl = publicUrlData.publicUrl;
      }

      setMessage({ text: 'Menyimpan data laporan...', type: 'info' });

      // 2. Tembak datanya ke tabel 'items' di Supabase
      const { error } = await supabase
        .from('items')
        .insert([
          {
            title: formData.title,
            category: formData.category,
            lokasi_ditemukan: formData.lokasi_ditemukan,
            find_date: formData.find_date,
            description: formData.description,
            image_url: formData.image_url || null, // Kosongkan jika tidak ada URL gambar
            contact_info: formData.contact_info || null, // Tambahkan informasi kontak
            status: 'Published', // Status otomatis aktif
            user_id: user?.id || null 
          }
        ]);

      if (error) throw error;

      // 3. Jika berhasil
      setMessage({ text: 'Submit Successfull...', type: 'success' });
      
      // Tunggu 1,5 detik agar user bisa membaca pesan sukses, lalu pindah halaman
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);

    } catch (error) {
      setMessage({ text: `Failed Submitting: ${error.message}`, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Header Form */}
        <div className="bg-tema-dark_blue px-6 py-8 text-white text-center">
          <h1 className="text-2xl font-bold mb-2">Report a found item</h1>
          <p className="text-blue-100 text-sm">Fill in the details of the item you found. Campus security will be notified if needed.</p>
        </div>

        {/* Form Isi */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">

          {/* Upload Gambar */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Photo of item (Optional)</label>
            <div className="relative">
              <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="file" 
                accept="image/*" // Hanya izinkan file gambar
                onChange={handleFileChange}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-tema-dark_blue outline-none text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-tema-dark_blue hover:file:bg-blue-100 cursor-pointer" 
              />
            </div>
            {imageFile && (
              <p className="text-xs text-emerald-600 mt-1 font-medium">
                Terpilih: {imageFile.name}
              </p>
            )}
          </div>
          
          {/* Baris 1: Nama & Kategori */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Item name</label>
              <div className="relative">
                <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="text" name="title" required value={formData.title} onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-tema-dark_blue outline-none text-sm" 
                  placeholder="e.g. Black Wallet, Keychain, ..." />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Category</label>
              <select name="category" value={formData.category} onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-tema-dark_blue outline-none text-sm">
                <option value="" disabled>Select Category</option>
                <option value="Electronic">Electronic</option>
                <option value="Document">Document & Card</option>
                <option value="Accessories">Accessories & Clothing</option>
                <option value="Key">Keys</option>
                <option value="Others">Others</option>
              </select>
            </div>
          </div>

          {/* Baris 2: Lokasi & Tanggal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Location Found</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="text" name="lokasi_ditemukan" required value={formData.lokasi_ditemukan} onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-tema-dark_blue outline-none text-sm" 
                  placeholder="e.g. Lobby Gedung K" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Date Found</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="date" name="find_date" required value={formData.find_date} onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-tema-dark_blue outline-none text-sm" />
              </div>
            </div>
          </div>

          {/* Deskripsi */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Description</label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
              <textarea name="description" rows="3" value={formData.description} onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-tema-dark_blue outline-none text-sm resize-none" 
                placeholder="Describe any specific details about the item (color, brand, etc.)" />
            </div>
          </div>

          {/* Informasi Kontak */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Contact</label>
            <div className="relative">
              <Contact className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="text" name="contact_info" required value={formData.contact_info} onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-tema-dark_blue outline-none text-sm" 
                placeholder="Phone or ID LINE" />
            </div>
          </div>

          {/* Notifikasi */}
          {message.text && (
            <div className={`p-4 rounded-lg flex items-center gap-2 text-sm font-medium ${message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
              {message.type === 'success' && <CheckCircle size={18} />}
              {message.text}
            </div>
          )}

          {/* Tombol Submit */}
          <div className="pt-4 border-t border-gray-100">
            <button type="submit" disabled={isLoading}
              className="w-full py-3 bg-tema-dark_blue text-white rounded-lg font-bold hover:bg-blue-900 transition-all shadow-md active:scale-[0.98] disabled:opacity-50">
              {isLoading ? 'Submitting Report...' : 'Submit Item Report'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}