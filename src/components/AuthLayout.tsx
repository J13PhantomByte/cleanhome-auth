import React, { useState } from 'react';
import { isSupabaseConfigured, setRuntimeSupabaseConfig, clearRuntimeSupabaseConfig, supabaseUrl } from '../lib/supabase';
import { Settings, ShieldCheck, AlertCircle, ExternalLink, X } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [customKey, setCustomKey] = useState('');

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl || !customKey) return;
    setRuntimeSupabaseConfig(customUrl, customKey);
  };

  return (
    <main className="min-h-screen bg-[#F2F5F0] flex flex-col justify-center items-center px-4 py-8 sm:px-6 lg:px-8">
      {/* Top Banner jika Supabase belum terhubung */}
      {!isSupabaseConfigured && (
        <div className="w-full max-w-md mb-6 bg-[#FEF3C7] border border-[#F59E0B]/30 rounded-2xl p-4 shadow-sm text-sm text-[#92400E] flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-[#78350F]">Kredensial Supabase Belum Dikonfigurasi</p>
            <p className="text-xs text-[#92400E] mt-0.5">
              Masukkan <code className="bg-[#FDE68A] px-1 rounded">VITE_SUPABASE_URL</code> dan <code className="bg-[#FDE68A] px-1 rounded">VITE_SUPABASE_ANON_KEY</code> di file <code className="bg-[#FDE68A] px-1 rounded">.env.local</code>.
            </p>
            <button
              type="button"
              onClick={() => setShowConfigModal(true)}
              className="mt-2 text-xs font-semibold text-[#173C32] bg-white border border-[#173C32]/20 px-2.5 py-1 rounded-lg hover:bg-[#F6F2E9] transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" /> Masukkan Kredensial di Sini
            </button>
          </div>
        </div>
      )}

      {/* Main Auth Card Container */}
      <div className="w-full max-w-[440px] flex flex-col items-center">
        {/* Brand Header */}
        <header className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mb-3 rounded-2xl bg-white shadow-sm border border-[#245746]/10 flex items-center justify-center p-2.5 transition-transform hover:scale-105 duration-200">
            <img
              src="/assets/aistudio/logo_6c6f33ca.png"
              alt="Logo CleanHome"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-2xl font-bold tracking-tight text-[#173C32]">CleanHome</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#245746] bg-[#A6E3C6]/35 px-2 py-0.5 rounded-full border border-[#245746]/15">
              <ShieldCheck className="w-3 h-3" /> Auth
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-[#173C32] mt-3 tracking-tight">
            {title}
          </h1>
          <p className="text-sm text-[#63746A] mt-1 max-w-sm">
            {subtitle}
          </p>
        </header>

        {/* Card Body with Soft Neumorphism */}
        <section className="w-full neu-card rounded-2xl p-6 sm:p-8 bg-white transition-all">
          {children}
        </section>

        {/* Footer Academic Notice & Status */}
        <footer className="mt-8 text-center text-xs text-[#63746A] space-y-1">
          <p className="font-medium text-[#34443B]">
            CleanHome &bull; Tugas Pertemuan 6 Pengembangan Website
          </p>
          <div className="flex items-center justify-center gap-2 pt-1">
            <span className="inline-flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${isSupabaseConfigured ? 'bg-emerald-500' : 'bg-amber-400'}`}></span>
              {isSupabaseConfigured ? 'Supabase Terhubung' : 'Mode Offline / Belum Dikonfigurasi'}
            </span>
            {isSupabaseConfigured && (
              <button
                type="button"
                onClick={() => setShowConfigModal(true)}
                className="text-[#245746] hover:underline text-[11px] cursor-pointer"
              >
                (Detail API)
              </button>
            )}
          </div>
        </footer>
      </div>

      {/* Supabase Configuration Modal */}
      {showConfigModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#173C32]/10 p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#F2F5F0]">
              <div className="flex items-center gap-2 text-[#173C32] font-bold">
                <Settings className="w-5 h-5 text-[#245746]" />
                <h3>Konfigurasi Supabase Auth</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="text-[#63746A] hover:text-[#173C32] p-1 rounded-lg cursor-pointer"
                aria-label="Tutup modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#63746A] leading-relaxed">
              Kredensial dapat dimasukkan langsung di sini untuk pengujian cepat, atau disetel secara permanen di file <code className="bg-[#F2F5F0] px-1 py-0.5 rounded text-[#173C32] font-semibold">.env.local</code>.
            </p>

            {isSupabaseConfigured && (
              <div className="p-3 bg-[#F2F5F0] rounded-xl text-xs space-y-1">
                <p className="font-semibold text-[#173C32]">Status URL Aktif:</p>
                <p className="text-[#63746A] truncate font-mono">{supabaseUrl}</p>
                <button
                  type="button"
                  onClick={clearRuntimeSupabaseConfig}
                  className="mt-2 text-xs text-red-600 hover:underline font-medium cursor-pointer"
                >
                  Reset Konfigurasi Sesi
                </button>
              </div>
            )}

            <form onSubmit={handleSaveConfig} className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-[#173C32] mb-1">
                  Project URL Supabase
                </label>
                <input
                  type="url"
                  placeholder="https://xxxxxxxxxxxx.supabase.co"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className="w-full h-10 px-3 text-xs rounded-xl neu-input font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#173C32] mb-1">
                  Anon / Publishable Key
                </label>
                <input
                  type="text"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={customKey}
                  onChange={(e) => setCustomKey(e.target.value)}
                  className="w-full h-10 px-3 text-xs rounded-xl neu-input font-mono"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="px-3 py-2 text-xs font-medium text-[#63746A] hover:text-[#173C32] cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold neu-btn-primary rounded-xl cursor-pointer"
                >
                  Simpan & Hubungkan
                </button>
              </div>
            </form>

            <div className="text-[11px] text-[#63746A] border-t border-[#F2F5F0] pt-3 flex items-center justify-between">
              <span>Buka Supabase Dashboard &gt; Project Settings &gt; API</span>
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noreferrer"
                className="text-[#245746] hover:underline inline-flex items-center gap-0.5 font-medium"
              >
                Dashboard <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
