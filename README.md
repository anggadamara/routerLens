# RouterLens

[![AI-Generated](https://img.shields.io/badge/Code-100%25_AI_Generated-blueviolet?style=flat-square)](#)
[![Built With](https://img.shields.io/badge/Model-Gemini_3.8_Flash-4285F4?style=flat-square&logo=google)](#)
[![Method](https://img.shields.io/badge/Method-Prompting_Only-emerald?style=flat-square)](#)

Dashboard web statis tanpa backend untuk memantau saldo, estimasi runway, dan riwayat penggunaan model OpenRouter secara privat.

Semua request dikirim langsung dari browser ke API OpenRouter (CORS). API key dan histori data tersimpan lokal di browser (`localStorage` dan `IndexedDB`). Tidak ada server perantara atau telemetri pihak ketiga.

> **Catatan Pembuatan (AI-Generated):**
> Proyek ini dibuat 100% menggunakan model **Gemini 3.8 Flash** via prompting di Antigravity IDE. Tidak ada baris kode yang ditulis manual oleh pemilik repositori selain instruksi prompt.

## Fitur

- **Saldo & Estimasi Runway:** Menampilkan saldo USD & estimasi IDR, pengeluaran hari ini, dan proyeksi sisa hari berdasarkan rata-rata 7 hari.
- **Riwayat Penggunaan:** Grafik batang konsumsi harian 14 hari terakhir dan model yang paling banyak dipakai per hari.
- **Breakdown Model:** Rincian biaya dan token (prompt & completion) per model (Claude, GPT, DeepSeek, Llama, dll).
- **Konversi Kurs Otomatis:** Mengambil kurs USD ke IDR harian via Frankfurter API publik dengan cache lokal 24 jam.
- **Export & Import:** Backup data histori ke file JSON lokal dan restore tanpa login akun.
- **Mode Demo Interaktif:** Coba seluruh antarmuka dan visualisasi tanpa memasukkan API key (menggunakan data simulasi).
- **UI Minimalis:** Tema gelap dan terang, tata letak responsif untuk desktop dan mobile.

## Keamanan & Privasi ("Don't Trust, Verify")

Apakah aman memasukkan API key OpenRouter? **Ya, dan Anda dapat memverifikasinya sendiri secara langsung:**

1. **100% Client-Side (Zero Backend):** Tidak ada server perantara atau database luar. Kunci tersimpan di `localStorage` peramban Anda.
2. **Content Security Policy (CSP) Ketat:** `index.html` membatasi `connect-src` hanya ke `https://openrouter.ai` dan `https://api.frankfurter.dev`. Browser Anda secara fisik menolak pengiriman data ke server lain.
3. **Verifikasi Mandiri via DevTools:** Tekan `F12` → Tab **Network** → Filter `Fetch/XHR`. Anda dapat membuktikan langsung bahwa tidak ada data yang keluar selain ke endpoint resmi OpenRouter.
4. **Mode Demo:** Jika belum ingin menghubungkan key, klik tombol *"Coba Mode Demo"* di halaman awal untuk mencoba visualisasi dengan data tiruan.
5. **Rekomendasi Key:** Anda bisa membuat API key khusus dengan batas kredit (*credit limit*) terpisah di [OpenRouter Keys](https://openrouter.ai/keys).

## Teknologi

- Vite 8 + React 19 + TypeScript
- Tailwind CSS v3
- idb-keyval (IndexedDB wrapper)
- Vitest

## Menjalankan Secara Lokal

```bash
npm install
npm run dev
npm test
npm run build
```

Hasil build berada di direktori `dist/` dan dapat di-deploy ke static hosting (Vercel, Cloudflare Pages, GitHub Pages).

## Lisensi

MIT
