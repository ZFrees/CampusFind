/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palet warna utama web kamu
        tema: {
          dark_blue: '#1E3A8A', // Tab/navbar
          light_gray: '#F3F4F6', // Teks/latar
        },
        status: {
          lost: '#EF4444',   // Merah untuk status barang hilang
          found: '#10B981',  // Hijau untuk status barang sudah kembali
        }
      },
    },
  },
  plugins: [],
};