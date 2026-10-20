# OpenRouter Usage Lens (Client-Side)

Dashboard privat, tanpa backend, dan zero-telemetry untuk memantau saldo, estimasi runway, dan penggunaan model AI di OpenRouter.

Dibangun dengan arsitektur Bring Your Own Key (BYOK): API key dan riwayat data kamu disimpan 100% di browser lokal (localStorage dan IndexedDB). Tidak ada data atau key yang dikirim ke server pihak ketiga.

## Fitur Utama

- Privasi Penuh (Zero-Backend): Request dikirim langsung dari browser ke openrouter.ai melalui CORS resmi.
- Hero Runway & Burn-Rate Gauge: Menampilkan sisa saldo USD & IDR, laju pengeluaran hari ini, serta estimasi sisa hari (runway) berdasarkan konsumsi 7 hari terakhir.
- Tren Harian 14 Hari: Visualisasi bar chart interaktif dengan tooltip inspeksi model dominan pada hari tersebut.
- Hierarki Model: Breakdown konsumsi token (prompt dan completion) per model AI (Claude, DeepSeek, GPT, Llama, Mistral, dll).
- Konversi Kurs Otomatis: Kurs USD ke IDR di-update harian via Frankfurter API publik dengan cache 24 jam.
- Backup & Restore Mandiri: Export seluruh riwayat transaksi ke file JSON lokal, dan import kembali saat berganti perangkat.
- Anti-Slop Design: Mode gelap (Obsidian) dan terang (Cloud) berstandar WCAG AA, bebas dekorasi berlebihan, dan responsif di smartphone.

## Teknologi

- Vite 6 + React 18 + TypeScript
- Tailwind CSS v3 (OpenRouter design tokens)
- idb-keyval (IndexedDB client-side persistence)
- Vitest (Unit testing engine)

## Menjalankan Secara Lokal

`ash
npm install
npm run dev
npm test
npm run build
`

File hasil build berada di folder dist/, siap di-host secara gratis di Vercel, Cloudflare Pages, atau GitHub Pages.

## Lisensi

MIT
