import React, { useState } from 'react';
import { User, Mail, Lock, Loader2, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { AuthLayout } from '../components/AuthLayout';
import { AuthInput } from '../components/AuthInput';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface RegisterProps {
  onNavigateToLogin: () => void;
  onRegisterSuccessWithSession: () => void;
}

export const Register: React.FC<RegisterProps> = ({
  onNavigateToLogin,
  onRegisterSuccessWithSession,
}) => {
  // State form registrasi
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // State loading & error
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [emailConfirmationRequired, setEmailConfirmationRequired] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  /**
   * Validasi seluruh input form sebelum dikirim ke Supabase
   */
  const validateForm = (): boolean => {
    const errors: {
      fullName?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    // 1. Validasi Nama Lengkap
    const trimmedName = fullName.trim();
    if (!trimmedName) {
      errors.fullName = 'Nama lengkap wajib diisi.';
    } else if (trimmedName.length < 2) {
      errors.fullName = 'Nama lengkap minimal 2 karakter.';
    }

    // 2. Validasi Email
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      errors.email = 'Alamat email wajib diisi.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        errors.email = 'Format alamat email tidak valid.';
      }
    }

    // 3. Validasi Password (minimal 6 karakter untuk Supabase)
    if (!password) {
      errors.password = 'Kata sandi wajib diisi.';
    } else if (password.length < 6) {
      errors.password = 'Kata sandi minimal 6 karakter.';
    }

    // 4. Validasi Konfirmasi Password
    if (!confirmPassword) {
      errors.confirmPassword = 'Konfirmasi kata sandi wajib diisi.';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Konfirmasi kata sandi tidak cocok dengan kata sandi.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Menangani submit registrasi ke Supabase Auth
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setEmailConfirmationRequired(false);

    if (isLoading) return;
    if (!validateForm()) return;

    if (!isSupabaseConfigured || !supabase) {
      setAuthError('Supabase belum dikonfigurasi. Silakan isi URL dan Anon Key di file .env.local atau klik tombol konfigurasi di atas.');
      return;
    }

    setIsLoading(true);

    try {
      // Registrasi menggunakan Supabase Auth signUp
      // Nama disimpan di options.data.full_name (user metadata bawaan Supabase)
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
        },
      });

      if (error) {
        if (error.message.includes('User already registered')) {
          setAuthError('Email ini sudah terdaftar. Silakan gunakan email lain atau masuk ke akun Anda.');
        } else if (error.message.includes('Password should be')) {
          setAuthError('Kata sandi terlalu lemah. Gunakan minimal 6 karakter.');
        } else {
          setAuthError(error.message || 'Pendaftaran gagal. Silakan coba kembali.');
        }
        return;
      }

      // Evaluasi apakah konfirmasi email aktif di project Supabase
      // Jika konfirmasi email aktif: data.user ada, tetapi data.session adalah null
      // Jika konfirmasi email non-aktif: data.session langsung terbuat
      if (data?.session) {
        // Sesi langsung ada -> redirect ke keberhasilan login
        onRegisterSuccessWithSession();
      } else if (data?.user) {
        // Memerlukan konfirmasi email
        setEmailConfirmationRequired(true);
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
      title="Create Your Account"
      subtitle="Daftar akun CleanHome untuk memesan layanan kebersihan rumah."
    >
      {/* Tampilan jika registrasi sukses dan butuh konfirmasi email */}
      {emailConfirmationRequired ? (
        <div className="text-center py-4 space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#A6E3C6]/30 text-[#173C32] flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-[#245746]" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-[#173C32]">Pendaftaran Berhasil!</h2>
            <p className="text-sm text-[#63746A] leading-relaxed">
              Tautan verifikasi telah dikirimkan ke <strong className="text-[#173C32]">{email}</strong>. Silakan periksa kotak masuk atau spam email Anda untuk mengaktifkan akun.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={onNavigateToLogin}
              className="w-full h-11 rounded-xl font-semibold text-sm neu-btn-primary flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Lanjut ke Halaman Login</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
          {/* Banner Error Autentikasi */}
          {authError && (
            <div
              className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-sm text-[#DC2626] flex items-start gap-2.5"
              role="alert"
            >
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-[#DC2626]" />
              <span className="leading-snug">{authError}</span>
            </div>
          )}

          {/* Input Nama Lengkap */}
          <AuthInput
            id="register-name"
            label="Nama Lengkap"
            type="text"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              if (fieldErrors.fullName) setFieldErrors((prev) => ({ ...prev, fullName: undefined }));
            }}
            placeholder="Contoh: Budi Santoso"
            required
            disabled={isLoading}
            autoComplete="name"
            icon={User}
            error={fieldErrors.fullName}
          />

          {/* Input Email */}
          <AuthInput
            id="register-email"
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
            id="register-password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: undefined }));
            }}
            placeholder="Minimal 6 karakter"
            required
            disabled={isLoading}
            autoComplete="new-password"
            icon={Lock}
            error={fieldErrors.password}
          />

          {/* Input Konfirmasi Password */}
          <AuthInput
            id="register-confirm-password"
            label="Konfirmasi Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (fieldErrors.confirmPassword) setFieldErrors((prev) => ({ ...prev, confirmPassword: undefined }));
            }}
            placeholder="Ulangi kata sandi Anda"
            required
            disabled={isLoading}
            autoComplete="new-password"
            icon={Lock}
            error={fieldErrors.confirmPassword}
          />

          {/* Tombol Create Account */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-xl font-semibold text-base neu-btn-primary flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Mendaftarkan Akun...</span>
                </>
              ) : (
                <span>Create Account</span>
              )}
            </button>
          </div>

          {/* Link ke Login */}
          <div className="pt-2 text-center text-sm text-[#63746A]">
            Sudah punya akun?{' '}
            <button
              type="button"
              onClick={onNavigateToLogin}
              disabled={isLoading}
              className="font-semibold text-[#173C32] hover:text-[#245746] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#245746] rounded px-1 transition-colors cursor-pointer"
            >
              Login
            </button>
          </div>
        </form>
      )}
    </AuthLayout>
  );
};
