"use client";

import { Shield, FileText, CheckCircle, Clock, ExternalLink } from 'lucide-react';

export default function SecurityLog() {
  // Data dikosongkan (Array kosong) agar siap menerima data asli dari tabel 'items' di Supabase
  const logItems = [];

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto">
      {/* Header & Export Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="text-tema-dark_blue" size={24} />
            Security Post — Item Custody Log
          </h1>
          <p className="text-sm text-gray-500 mt-1">Catatan resmi serah terima dan status penyimpanan barang.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
          <FileText size={16} />
          Export Log (.csv)
        </button>
      </div>

      {/* Statistik Ringkas (Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-2xl font-bold text-tema-dark_blue">0</div>
          <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mt-1">Items Held</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-2xl font-bold text-gray-900">0</div>
          <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mt-1">Released (Month)</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-2xl font-bold text-red-600">0</div>
          <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mt-1">Pending &gt; 7 Days</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-2xl font-bold text-gray-900">0</div>
          <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mt-1">Total Reports</div>
        </div>
      </div>

      {/* Tabel Log Barang */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium">
              <tr>
                <th className="px-6 py-4">Item</th>
                <th className="px-6 py-4">Found By</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Date In</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logItems.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                    <Clock size={32} className="mx-auto mb-3 opacity-20" />
                    Belum ada riwayat penyimpanan barang.
                  </td>
                </tr>
              ) : (
                logItems.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    {/* Baris data akan di-render di sini nanti */}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Tambahan */}
      <div className="mt-6 flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <CheckCircle className="text-tema-dark_blue shrink-0" size={18} />
        <p className="text-xs text-blue-800 leading-relaxed">
          Barang yang sudah berstatus <strong>"Released"</strong> berarti telah diambil oleh pemiliknya setelah verifikasi identitas (KTM/KTP) oleh petugas keamanan di gedung terkait.
        </p>
      </div>
    </div>
  );
}