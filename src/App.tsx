import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { LoginSuccess } from './pages/LoginSuccess';
import type { Session, User } from '@supabase/supabase-js';
import { Loader2 } from 'lucide-react';

type AuthView = 'login' | 'register' | 'success';

export default function App() {
  const [currentView, setCurrentView] = useState<AuthView>('login');
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Inisialisasi dan pantau status autentikasi Supabase
  useEffect(() => {
    // Jika Supabase belum dikonfigurasi, lewati pemeriksaan sesi
    if (!isSupabaseConfigured || !supabase) {
      setIsInitializing(false);
      return;
    }

    // 1. Periksa sesi yang tersimpan saat aplikasi dimuat pertama kali
    supabase.auth
      .getSession()
      .then(({ data: { session: existingSession }, error }) => {
        if (error) {
          console.error('Kendala saat membaca sesi:', error.message);
        }
        if (existingSession) {
          setSession(existingSession);
          setUser(existingSession.user);
          setCurrentView('success');
        }
        setIsInitializing(false);
      })
      .catch((err) => {
        console.error('Error inisialisasi sesi:', err);
        setIsInitializing(false);
      });

    // 2. Pasang listener untuk mendengarkan perubahan status autentikasi
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (event === 'SIGNED_IN' && newSession) {
        setCurrentView('success');
      } else if (event === 'SIGNED_OUT') {
        setCurrentView('login');
      }
    });

    // Bersihkan subscription saat unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Tampilkan splash loader saat memeriksa status sesi
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-[#F2F5F0] flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 mb-4 rounded-2xl bg-white shadow-sm border border-[#245746]/10 flex items-center justify-center p-3 animate-pulse">
          <img
            src="/assets/aistudio/logo_6c6f33ca.png"
            alt="CleanHome"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-[#173C32] font-semibold">
          <Loader2 className="w-4 h-4 animate-spin text-[#245746]" />
          <span>Memuat CleanHome Auth...</span>
        </div>
      </div>
    );
  }

  // Proteksi Route: Jika sesi aktif, tampilkan halaman keberhasilan login
  if (session && currentView === 'success') {
    return (
      <LoginSuccess
        user={user}
        onLogout={() => {
          setSession(null);
          setUser(null);
          setCurrentView('login');
        }}
      />
    );
  }

  // Halaman Register
  if (currentView === 'register') {
    return (
      <Register
        onNavigateToLogin={() => setCurrentView('login')}
        onRegisterSuccessWithSession={() => setCurrentView('success')}
      />
    );
  }

  // Default: Halaman Login
  return (
    <Login
      onNavigateToRegister={() => setCurrentView('register')}
      onLoginSuccess={() => setCurrentView('success')}
    />
  );
}
