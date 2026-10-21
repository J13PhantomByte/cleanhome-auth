import React, { useState } from 'react';
import { CheckCircle, LogOut, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface LoginSuccessProps {
  user: User | null;
  onLogout: () => void;
}

/**
 * Halaman Keberhasilan Login
 * Halaman sederhana sesuai spesifikasi:
 * - Ikon centang sederhana
 * - Judul besar "Berhasil Login!"
 * - Teks "Anda berhasil masuk ke akun CleanHome."
 * - Tombol Logout yang memanggil supabase.auth.signOut()
 */
export const LoginSuccess: React.FC<LoginSuccessProps> = ({ user, onLogout }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      if (supabase) {
        await supabase.auth.signOut();
      }
    } catch (error) {
      console.error('Kendala saat logout:', error);
    } finally {
      setIsLoggingOut(false);
      onLogout();
    }
  };

  const displayName = user?.user_metadata?.full_name || user?.email || 'Pengguna CleanHome';

  return (
    <main className="min-h-screen bg-[#F2F5F0] flex flex-col justify-center items-center px-4 py-8 sm:px-6">
      <div className="w-full max-w-[440px] flex flex-col items-center">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mb-3 rounded-2xl bg-white shadow-sm border border-[#245746]/10 flex items-center justify-center p-2.5">
            <img
              src="/assets/aistudio/logo_6c6f33ca.png"
              alt="Logo CleanHome"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#173C32]">CleanHome</span>
        </div>

        {/* Card Konfirmasi Keberhasilan */}
        <section className="w-full neu-card rounded-2xl p-8 sm:p-10 bg-white text-center flex flex-col items-center space-y-6">
          {/* Ikon Centang Sederhana */}
          <div className="w-20 h-20 rounded-full bg-[#A6E3C6]/30 flex items-center justify-center text-[#245746]">
            <CheckCircle className="w-12 h-12 stroke-[2] text-[#245746]" />
          </div>

          {/* Judul & Teks */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#173C32] tracking-tight">
              Berhasil Login!
            </h1>
            <p className="text-base text-[#34443B]">
              Anda berhasil masuk ke akun CleanHome.
            </p>
            {user && (
              <p className="text-xs text-[#63746A] pt-1">
                Login sebagai: <span className="font-semibold text-[#173C32]">{displayName}</span>
              </p>
            )}
          </div>

          {/* Tombol Logout Sederhana */}
          <div className="w-full pt-4 border-t border-[#F2F5F0]">
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full h-11 rounded-xl font-semibold text-sm text-[#173C32] bg-[#F6F2E9] hover:bg-[#A6E3C6]/40 border border-[#245746]/15 flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-60"
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#173C32]" />
                  <span>Sedang Logout...</span>
                </>
              ) : (
                <>
                  <LogOut className="w-4 h-4 text-[#173C32]" />
                  <span>Logout</span>
                </>
              )}
            </button>
          </div>
        </section>

        {/* Info footer */}
        <p className="mt-8 text-center text-xs text-[#63746A]">
          Pertemuan 6 &bull; Sesi autentikasi aman dengan Supabase Auth
        </p>
      </div>
    </main>
  );
};
