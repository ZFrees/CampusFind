import { createClient } from '@supabase/supabase-js';

// Mengambil URL dan API Key dari "brankas" .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Membuat dan mengekspor koneksi jembatan ke Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);