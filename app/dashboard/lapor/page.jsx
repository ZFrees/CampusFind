"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase'; // Pastikan path ini @/lib/supabase
import { Package, MapPin, Calendar, FileText, Upload, CheckCircle, Contact } from 'lucide-react';

export default function LaporBarang() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [imageFile, setImageFile] = useState(null);

  // 1. STATE BARU: Untuk menyimpan status tombol toggle Satpam
  const [isAtSecurity, setIsAtSecurity] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: '', 
    lokasi_ditemukan: '',
    find_date: '',
    description: '',
    contact_info: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const { data: { user } } = await supabase.auth.getUser();
      let uploadedImageUrl = null;

      if (imageFile) {
        setMessage({ text: 'Mengunggah gambar...', type: 'info' });
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('Item Photos') // Sesuai dengan nama bucket-mu
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('Item Photos')
          .getPublicUrl(fileName);

        uploadedImageUrl = publicUrlData.publicUrl;
      }

      setMessage({ text: 'Menyimpan data laporan...', type: 'info' });

      const { error } = await supabase
        .from('items')
        .insert([
          {
            title: formData.title,
            category: formData.category,
            lokasi_ditemukan: formData.lokasi_ditemukan,
            find_date: formData.find_date,
            description: formData.description,
            image_url: uploadedImageUrl,
            contact_info: formData.contact_info,
            // 2. LOGIKA STATUS: Berubah tergantung tombol toggle
            status: isAtSecurity ? 'At Security' : 'Published',
            user_id: user?.id || null 
          }
        ]);

      if (error) throw error;

      setMessage({ text: 'Laporan berhasil disimpan! Mengalihkan ke dashboard...', type: 'success' });
      
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);

    } catch (error) {
      setMessage({ text: `Gagal menyimpan: ${error.message}`, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        
        <div className="bg-tema-dark_blue px-6 py-8 text-white text-center">
          <h1 className="text-2xl font-bold mb-2">Report a found item</h1>
          <p className="text-blue-100 text-sm">Fill in the details of the item you found. Campus security will be notified if needed.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Photo of item (Optional)</label>
            <div className="relative">
              <Upload className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="file" 
                accept="image/*"
                onChange={handleFileChange}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-tema-dark_blue outline-none text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-tema-dark_blue hover:file:bg-blue-100 cursor-pointer" 
              />
            </div>
            {imageFile && <p className="text-xs text-emerald-600 mt-1 font-medium">Terpilih: {imageFile.name}</p>}
          </div>
          
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
              <select name="category" required value={formData.category} onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-tema-dark_blue outline-none text-sm">
                <option value="" disabled>Select Category</option>
                <option value="Electronic">Elektronik & Gadget</option>
                <option value="Document">Dokumen & Kartu (KTM, KTP)</option>
                <option value="Accessories">Aksesoris & Pakaian</option>
                <option value="Key">Kunci</option>
                <option value="Others">Lainnya</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Location Found</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="text" name="lokasi_ditemukan" required value={formData.lokasi_ditemukan} onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-tema-dark_blue outline-none text-sm" 
                  placeholder="e.g. Kantin Teknik" />
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

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Description</label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
              <textarea name="description" rows="3" value={formData.description} onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-tema-dark_blue outline-none text-sm resize-none" 
                placeholder="Describe any specific details about the item (color, brand, etc.)" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Contact</label>
            <div className="relative">
              <Contact className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="text" name="contact_info" required value={formData.contact_info} onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-tema-dark_blue outline-none text-sm" 
                placeholder="Phone or ID LINE" />
            </div>
          </div>

          {/* 3. UI TOGGLE KEAMANAN (Meniru desain dari gambar) */}
          <div 
            onClick={() => setIsAtSecurity(!isAtSecurity)}
            className={`mt-4 p-4 rounded-xl border flex items-center cursor-pointer transition-colors ${
              isAtSecurity ? 'bg-orange-50 border-orange-200' : 'bg-orange-50/50 border-orange-100'
            }`}
          >
            {/* Sakelar Visual */}
            <div className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer items-center justify-center rounded-full">
              <span className="sr-only">Hand item to security</span>
              {/* Background Sakelar */}
              <span className={`pointer-events-none absolute mx-auto h-4 w-9 rounded-full transition-colors duration-200 ease-in-out ${isAtSecurity ? 'bg-orange-400' : 'bg-gray-300'}`} />
              {/* Lingkaran Sakelar */}
              <span className={`pointer-events-none absolute left-0 inline-block h-5 w-5 transform rounded-full border border-gray-200 bg-white shadow ring-0 transition-transform duration-200 ease-in-out ${isAtSecurity ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
            
            {/* Teks Toggle */}
            <span className="ml-3 text-sm font-medium text-orange-800">
              Hand item to security post — they will hold it until claimed
            </span>
          </div>

          {message.text && (
            <div className={`p-4 rounded-lg flex items-center gap-2 text-sm font-medium ${message.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-blue-50 text-blue-800 border border-blue-200'}`}>
              {message.type === 'success' && <CheckCircle size={18} className="text-emerald-600" />}
              {message.text}
            </div>
          )}

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