import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer'; // <-- 1. Import Footer di sini

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-tema-light_gray">
      {/* Navbar di atas */}
      <Navbar />

      {/* Konten Utama */}
      <main className="flex-1 w-full max-w-7xl mx-auto">
        {children}
      </main>

      {/* 2. Pasang Footer di paling bawah */}
      <Footer />
    </div>
  );
}