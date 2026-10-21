/**
 * Supabase Client Configuration
 * CleanHome - Pertemuan 6 Pengembangan Website
 *
 * Menginisialisasi satu instance Supabase Client menggunakan
 * Environment Variables (VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY).
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Ambil kredensial dari environment variable (Vite prefix VITE_)
const envUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

// Dukung juga penyimpanan sesi lokal jika mahasiswa memasukkan kredensial via UI pengaturan sementara
const storedUrl = typeof window !== 'undefined' ? sessionStorage.getItem('cleanhome_supabase_url')?.trim() : null;
const storedKey = typeof window !== 'undefined' ? sessionStorage.getItem('cleanhome_supabase_key')?.trim() : null;

export const supabaseUrl = envUrl && envUrl !== 'URL_PROJECT_SUPABASE' && !envUrl.includes('your-project-id')
  ? envUrl
  : (storedUrl || '');

export const supabaseAnonKey = envKey && envKey !== 'SUPABASE_PUBLISHABLE_KEY' && !envKey.includes('your-anon-public-api-key')
  ? envKey
  : (storedKey || '');

/**
 * Validasi apakah konfigurasi Supabase sudah lengkap dan valid
 */
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('https://') &&
  supabaseAnonKey.length > 20
);

/**
 * Singleton instance Supabase Client
 * Mencegah pembuatan multiple client instances
 */
let clientInstance: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  try {
    clientInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  } catch (error) {
    console.error('Gagal menginisialisasi Supabase Client:', error);
  }
}

export const supabase = clientInstance as SupabaseClient;

/**
 * Helper untuk menyimpan kredensial sementara saat testing di browser
 * jika .env.local belum diisi.
 */
export function setRuntimeSupabaseConfig(url: string, key: string) {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('cleanhome_supabase_url', url.trim());
    sessionStorage.setItem('cleanhome_supabase_key', key.trim());
    window.location.reload();
  }
}

/**
 * Helper untuk menghapus kredensial sementara
 */
export function clearRuntimeSupabaseConfig() {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('cleanhome_supabase_url');
    sessionStorage.removeItem('cleanhome_supabase_key');
    window.location.reload();
  }
}
