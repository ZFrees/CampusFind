export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-6 mt-8 border-t border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-xs text-gray-500">
          &copy; {currentYear} CampusFind. Sistem Lost and Found.
        </p>
      </div>
    </footer>
  );
}