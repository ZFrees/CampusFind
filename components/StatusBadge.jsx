export default function StatusBadge({ status }) {
  // Menentukan warna berdasarkan status dari database
  let badgeStyle = "bg-gray-100 text-gray-600 border-gray-200"; // Warna Default

  if (status === 'Published') {
    // Hijau untuk barang yang masih hilang / tersedia
    badgeStyle = "bg-emerald-100 text-emerald-800 border-emerald-200";
  } else if (status === 'Returned') {
    // Abu-abu redup untuk barang yang sudah diambil pemiliknya
    badgeStyle = "bg-gray-100 text-gray-500 border-gray-200";
  } else if (status === 'Expired') {
    // Merah untuk barang yang sudah terlalu lama tidak diambil
    badgeStyle = "bg-red-100 text-red-800 border-red-200";
  }

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border uppercase tracking-wider ${badgeStyle}`}>
      {status}
    </span>
  );
}