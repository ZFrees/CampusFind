/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}", // Tambahan untuk mendeteksi folder src
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}", // Tambahan untuk mendeteksi folder src
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        tema: {
          dark_blue: '#1E3A8A', 
          light_gray: '#F3F4F6', 
        },
        status: {
          lost: '#EF4444',  
          found: '#10B981',  
        }
      },
    },
  },
  plugins: [],
};