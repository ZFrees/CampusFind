import { redirect } from 'next/navigation';

export default function Home() {
  // Langsung melempar pengguna ke halaman login
  redirect('/login');
}