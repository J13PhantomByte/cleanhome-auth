# CleanHome - Modul Autentikasi (Pertemuan 6)

Aplikasi autentikasi sederhana untuk **CleanHome**, platform layanan kebersihan rumah terpercaya. Proyek ini dikembangkan khusus untuk tugas pertemuan 6 mata kuliah Pengembangan Website dengan fokus hanya pada:
- **Halaman Login**
- **Halaman Register**
- **Halaman Konfirmasi Keberhasilan Login**

Menggunakan autentikasi nyata berbasis **Supabase Auth** (`@supabase/supabase-js`), bukan simulasi atau dummy data.

---

## 1. Tech Stack & Desain

- **React 19 + TypeScript**: UI deklaratif berbasis tipe data yang kuat.
- **Vite**: Build tool dan dev server ultra-cepat.
- **Tailwind CSS v4**: Styling utilitas modern.
- **Supabase Auth**: Manajemen registrasi, enkripsi password, sesi JWT, dan verifikasi email.
- **Lucide React**: Ikon minimalis dan fungsional.
- **Desain System**: *Soft Neumorphism + Modern Minimalist + Organic Green Palette*.
  - Forest Green: `#173C32`
  - Organic Green: `#245746`
  - Soft Mint: `#A6E3C6`
  - Warm Cream: `#F6F2E9`
  - Soft Background: `#F2F5F0`
  - Text: `#34443B`
  - Muted: `#63746A`

---

## 2. Struktur Proyek

```
cleanhome-auth/
├── .env.example              # Template variabel lingkungan
├── .env.local                # Kredensial Supabase lokal (diabaikan git)
├── .gitignore                # Daftar file yang diabaikan git
├── index.html                # Dokumen HTML utama
├── metadata.json             # Metadata aplikasi
├── package.json              # Daftar dependency & scripts
├── tsconfig.json             # Konfigurasi TypeScript
├── vite.config.ts            # Konfigurasi Vite & Tailwind CSS
├── README.md                 # Dokumentasi lengkap proyek
├── public/
│   └── assets/
│           └── logo_6c6f33ca.png  # Logo resmi CleanHome
└── src/
    ├── main.tsx              # Titik masuk aplikasi React
    ├── App.tsx               # State sesi, routing guard, dan listener auth
    ├── index.css             # Konfigurasi Tailwind & utility soft neumorphic
    ├── components/
    │   ├── AuthInput.tsx     # Komponen input reusable (accessible + toggle password)
    │   └── AuthLayout.tsx    # Layout card neumorphic, logo, & modal konfigurasi
    ├── lib/
    │   └── supabase.ts       # Singleton instance Supabase Client
    └── pages/
        ├── Login.tsx         # Halaman masuk akun
        ├── Register.tsx      # Halaman pendaftaran akun baru
        └── LoginSuccess.tsx  # Halaman konfirmasi keberhasilan login
```

---

## 3. Cara Menyiapkan Proyek Supabase dari Awal

1. Buka [https://supabase.com](https://supabase.com) dan login/daftar akun gratis.
2. Buat organisasi baru (jika belum ada), lalu klik **"New Project"**.
3. Isi:
   - **Name**: `cleanhome-auth`
   - **Database Password**: Buat password yang kuat dan simpan.
   - **Region**: Pilih wilayah terdekat (misal: *Singapore*).
4. Tunggu sekitar 1-2 menit hingga provisioning selesai.
5. Menemukan URL dan Anon Key:
   - Masuk ke menu **Project Settings** (ikon gerigi di sidebar kiri bawah).
   - Klik tab **API**.
   - Salin **Project URL** (contoh: `https://xyzabcdefghijklm.supabase.co`).
   - Salin **Project API Keys** bagian `anon` / `public` (kunci publik yang aman untuk browser frontend).
   - **PENTING**: Jangan pernah menggunakan `service_role` key pada kode frontend.

---

## 4. Pengaturan Verifikasi Email & URL Redirect di Supabase

Secara default, Supabase mengaktifkan konfirmasi email (*Confirm email*). Anda memiliki 2 opsi pengujian:

### Opsi A: Mengizinkan Login Langsung Tanpa Verifikasi Email (Cocok untuk Uji Coba Cepat)
1. Buka dashboard Supabase Anda.
2. Masuk ke **Authentication** > **Providers** > **Email**.
3. Matikan saklar **"Confirm email"**.
4. Klik **Save**.
5. *Hasil*: Saat pengguna mendaftar, sesi langsung aktif dan langsung dialihkan ke halaman **"Berhasil Login!"**.

### Opsi B: Mengaktifkan Verifikasi Email (Standar Produksi)
1. Biarkan opsi **"Confirm email"** aktif.
2. Di menu **Authentication** > **URL Configuration**:
   - Atur **Site URL** ke URL lokal aplikasi Anda, misalnya: `http://localhost:3000` (atau URL preview AI Studio).
   - Tambahkan URL yang sama ke **Redirect URLs**.
3. *Hasil*: Saat pengguna mendaftar, aplikasi akan menampilkan instruksi untuk memeriksa tautan konfirmasi di inbox email sebelum dapat login.

---

## 5. Menjalankan Aplikasi Secara Lokal

1. **Clone atau buka direktori proyek**:
   ```bash
   cd cleanhome-auth
   ```

2. **Instal seluruh dependencies**:
   ```bash
   npm install
   ```

   Atau 

   ```bash
   npm install --legacy-peer-deps
   ```

3. **Buat file konfigurasi `.env.local`**:
   Salin dari `.env.example`:
   ```bash
   cp .env.example .env.local
   ```
   Buka file `.env.local` dan masukkan kredensial Supabase Anda:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-api-key-here
   ```

4. **Jalankan development server**:
   ```bash
   npm run dev
   ```
   Buka browser di `http://localhost:3000`.

5. **Build untuk produksi**:
   ```bash
   npm run build
   ```

---

## 6. Checklist Pengujian Fungsional

| Pengujian | Skenario | Hasil yang Diharapkan |
|---|---|---|
| **Form Kosong** | Klik Login/Register tanpa mengisi data | Validasi frontend aktif, pesan kesalahan muncul di bawah input. |
| **Email Tidak Valid** | Masukkan email tanpa `@` atau domain | Muncul pesan "Format alamat email tidak valid." |
| **Password Pendek** | Masukkan password < 6 karakter di Register | Muncul pesan "Kata sandi minimal 6 karakter." |
| **Konfirmasi Password** | Password dan konfirmasi tidak cocok | Muncul pesan error konfirmasi password tidak cocok. |
| **Kredensial Salah** | Login dengan password keliru | Muncul alert merah "Email atau kata sandi tidak sesuai." |
| **Registrasi Berhasil** | Isi data lengkap dan klik Create Account | Akun tersimpan di Supabase Auth (`auth.users`), metadata `full_name` tersimpan. |
| **Login Berhasil** | Masukkan kredensial yang valid | Dialihkan ke halaman "Berhasil Login!" dengan greeting nama pengguna. |
| **Proteksi Route** | Refresh halaman saat sudah login | Sesi tetap aktif dan langsung menampilkan halaman keberhasilan. |
| **Logout** | Klik tombol Logout di halaman keberhasilan | `supabase.auth.signOut()` terpanggil, sesi dihapus, kembali ke halaman Login. |
