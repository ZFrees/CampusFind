import Navbar from '../../components/Navbar';

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* 1. Navbar akan selalu menempel di atas untuk semua halaman /dashboard */}
      <Navbar />

      {/* 2. Konten utama (Beranda, Lapor, Log) akan bergantian masuk ke dalam <main> ini */}
      <main className="flex-1 w-full max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}