# OpenRouter Usage Lens

[![AI-Generated](https://img.shields.io/badge/Code-100%25_AI_Generated-blueviolet?style=flat-square)](#)
[![Built With](https://img.shields.io/badge/Model-Gemini_3.8_Flash-4285F4?style=flat-square&logo=google)](#)
[![Method](https://img.shields.io/badge/Method-Prompting_Only-emerald?style=flat-square)](#)

Dashboard web statis tanpa backend untuk memantau saldo, sisa hari (runway), dan penggunaan token model AI di OpenRouter.

Semua request dikirim langsung dari browser ke API OpenRouter (CORS). API key dan histori data tersimpan lokal di browser (`localStorage` dan `IndexedDB`). Tidak ada server perantara atau telemetri pihak ketiga.

> **Catatan Pembuatan (AI-Generated):**
> Proyek ini dibuat 100% menggunakan model **Gemini 3.8 Flash** via prompting di Antigravity IDE. Tidak ada baris kode yang ditulis manual oleh pemilik repositori selain instruksi prompt.

## Fitur

- **Saldo & Estimasi Runway:** Menampilkan saldo USD & estimasi IDR, pengeluaran hari ini, dan proyeksi sisa hari berdasarkan rata-rata 7 hari.
- **Riwayat Penggunaan:** Grafik batang konsumsi harian 14 hari terakhir dan model yang paling banyak dipakai per hari.
- **Breakdown Model:** Rincian biaya dan token (prompt & completion) per model (Claude, GPT, DeepSeek, Llama, dll).
- **Konversi Kurs Otomatis:** Mengambil kurs USD ke IDR harian via Frankfurter API publik dengan cache lokal 24 jam.
- **Export & Import:** Backup data histori ke file JSON lokal dan restore tanpa login akun.
- **UI Minimalis:** Tema gelap dan terang, tata letak responsif untuk desktop dan mobile.

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
