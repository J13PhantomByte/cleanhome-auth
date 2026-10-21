import React, { useState } from 'react';
import { Mail, Lock, Loader2, AlertCircle } from 'lucide-react';
import { AuthLayout } from '../components/AuthLayout';
import { AuthInput } from '../components/AuthInput';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface LoginProps {
  onNavigateToRegister: () => void;
  onLoginSuccess: () => void;
}

export const Login: React.FC<LoginProps> = ({ onNavigateToRegister, onLoginSuccess }) => {
  // State form login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // State status & error validasi
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  /**
   * Validasi form di sisi frontend sebelum mengirim request ke Supabase
   */
  const validateForm = (): boolean => {
    const errors: { email?: string; password?: string } = {};

    // Validasi email
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      errors.email = 'Alamat email wajib diisi.';
    } else {
      // Regex standar pemeriksaan format email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        errors.email = 'Format alamat email tidak valid.';
      }
    }

    // Validasi password
    if (!password) {
      errors.password = 'Kata sandi wajib diisi.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Menangani pengiriman form login dengan Supabase Auth
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    // Mencegah request ganda
    if (isLoading) return;

    // Validasi field
    if (!validateForm()) return;

    // Cek konfigurasi Supabase
    if (!isSupabaseConfigured || !supabase) {
      setAuthError('Supabase belum dikonfigurasi. Silakan isi URL dan Anon Key di file .env.local atau klik tombol konfigurasi di atas.');
      return;
    }

    setIsLoading(true);

    try {
      // Panggil Supabase Auth signInWithPassword
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        // Tangani pesan error secara aman tanpa membocorkan detail internal
        if (error.message.includes('Invalid login credentials') || error.message.includes('invalid_grant')) {
          setAuthError('Email atau kata sandi tidak sesuai. Silakan periksa kembali.');
        } else if (error.message.includes('Email not confirmed')) {
          setAuthError('Email Anda belum dikonfirmasi. Silakan periksa inbox email Anda.');
        } else {
          setAuthError(error.message || 'Gagal masuk ke akun. Silakan coba beberapa saat lagi.');
        }
        return;
      }

      // Pastikan ada sesi aktif yang dikembalikan
      if (data?.session) {
        onLoginSuccess();
      } else {
        setAuthError('Sesi tidak ditemukan setelah autentikasi. Silakan ulangi.');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Terjadi kendala saat menghubungkan ke server.';
      setAuthError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Masuk ke akun CleanHome Anda untuk melanjutkan layanan kebersihan."
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Banner Pesan Error Autentikasi */}
        {authError && (
          <div
            className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-sm text-[#DC2626] flex items-start gap-2.5"
            role="alert"
          >
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-[#DC2626]" />
            <span className="leading-snug">{authError}</span>
          </div>
        )}

        {/* Input Email */}
        <AuthInput
          id="login-email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }));
          }}
          placeholder="nama@email.com"
          required
          disabled={isLoading}
          autoComplete="email"
          icon={Mail}
          error={fieldErrors.email}
        />

        {/* Input Password */}
        <AuthInput
          id="login-password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: undefined }));
          }}
          placeholder="Masukkan password Anda"
          required
          disabled={isLoading}
          autoComplete="current-password"
          icon={Lock}
          error={fieldErrors.password}
        />

        {/* Tombol Login */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 rounded-xl font-semibold text-base neu-btn-primary flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Memverifikasi...</span>
              </>
            ) : (
              <span>Login</span>
            )}
          </button>
        </div>

        {/* Link ke Halaman Register */}
        <div className="pt-3 text-center text-sm text-[#63746A]">
          Belum punya akun?{' '}
          <button
            type="button"
            onClick={onNavigateToRegister}
            disabled={isLoading}
            className="font-semibold text-[#173C32] hover:text-[#245746] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#245746] rounded px-1 transition-colors cursor-pointer"
          >
            Register
          </button>
        </div>
      </form>
    </AuthLayout>
  );
};
