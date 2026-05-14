// 1. Import font yang kamu inginkan dari Google Fonts
import { Poppins } from "next/font/google"; 
import "./globals.css";

// 2. Inisialisasi font-nya (atur ketebalan yang mau dipakai)
const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'], // Normal, Medium, SemiBold, Bold
});

export const metadata = {
  title: "CampusFind",
  description: "Sistem Lost and Found Universitas",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      {/* 3. Masukkan variabel font-nya ke dalam className <body> */}
      <body className={`${poppins.className} bg-tema-light_gray text-gray-900 min-h-screen`}>
        {children}
      </body>
    </html>
  );
}