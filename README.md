# 📊 Macro Stress Test (Next.js)

> Cek ketahanan finansial lo, sebelum krisis ngecek lo duluan.

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8)](https://tailwindcss.com/)

Web app untuk monitoring kondisi makro ekonomi Indonesia + stress test budget personal berdasarkan skenario krisis historis.

**Stack:** Next.js 14 (App Router) + TypeScript + Tailwind CSS + Recharts + Yahoo Finance API + FRED API

---

## 🚀 Quick Start (Lokal)

### Prasyarat
- **Node.js 18+** — install dari https://nodejs.org
- npm (udah include sama Node.js)

### Setup

```bash
# Clone repo
git clone https://github.com/[username]/macro-stress-test.git
cd macro-stress-test

# Install dependencies (sekali doang, ~2 menit)
npm install

# (Optional) Setup FRED API key buat Fed Rate live
cp .env.example .env.local
# Edit .env.local, isi FRED_API_KEY

# Run dev server
npm run dev
```

App buka otomatis di `http://localhost:3000`. Hot reload aktif — edit file langsung kelihatan perubahannya.

### Build buat Production

```bash
npm run build  # build production bundle
npm start      # run production server
```

---

## 🌐 Deploy ke Vercel (One Click!)

**Cara paling gampang:**

1. Push code lo ke GitHub
2. Buka https://vercel.com → Login pake GitHub
3. **Import Project** → pilih repo lo
4. Vercel auto-detect Next.js, **klik Deploy**
5. Done! Live dalam ~2 menit

**Tambahin FRED API Key (optional):**
- Vercel dashboard → Project Settings → Environment Variables
- Add: `FRED_API_KEY` = your key
- Redeploy

---

## 📁 Struktur Project

```
macro-stress-test/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/macro/route.ts  # API: fetch macro data
│   │   ├── globals.css         # Global styles + Tailwind
│   │   ├── layout.tsx          # Root layout (fonts, metadata)
│   │   └── page.tsx            # Main page
│   ├── components/             # React components
│   │   ├── dashboard.tsx       # Tab Dashboard Makro
│   │   ├── stress-test.tsx     # Tab Stress Test
│   │   ├── health-score-hero.tsx
│   │   ├── metric-card.tsx
│   │   └── usd-idr-chart.tsx
│   ├── lib/                    # Business logic
│   │   ├── health-score.ts     # Composite score calculator
│   │   ├── scenarios.ts        # 1998/2008/2020 scenario defs
│   │   ├── stress-test.ts      # Stress test logic
│   │   └── utils.ts            # Helpers (formatRupiah, cn, dll)
│   └── types/index.ts          # TypeScript type defs
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

---

## ✨ Fitur

### 📊 Tab Dashboard Makro
- **Macro Health Score** (0-100) — composite indicator
- 4 tier indikator: Live, Core, Growth, Global
- Traffic light system (🟢🟡🔴)
- Chart USD/IDR 30 hari (Recharts)
- Auto-refresh data tiap 1 jam

### 🧪 Tab Budget Stress Test
- Form input data finansial
- 3 skenario krisis historis (1998, 2008, 2020)
- Survival score + breakdown dampak
- Risk highlights personalized
- Action plan (quick/medium/long-term)

---

## 📡 Data Sources

**🟢 Live (auto-refresh):**
| Indikator | Source | Update |
|-----------|--------|--------|
| USD/IDR | Yahoo Finance (`IDR=X`) | Daily |
| IHSG | Yahoo Finance (`^JKSE`) | Daily |
| Brent Oil | Yahoo Finance (`BZ=F`) | Daily |
| Dollar Index | Yahoo Finance (`DX-Y.NYB`) | Daily |
| Fed Funds Rate | FRED API | Daily |

**📅 Manual (update di `src/app/api/macro/route.ts`):**
- Cadangan Devisa, BI Rate, Inflasi, PDB, Yield SBN, PMI, Trade Balance
- Source: BI, BPS, Kemenkeu — perlu update bulanan

---

## 🛠️ Stack Choices

- **Next.js 14** — full-stack framework, deploy gampang ke Vercel
- **TypeScript** — type safety, less bug
- **Tailwind CSS** — utility-first styling, fast iteration
- **Recharts** — chart library yang gampang dipake
- **Lucide Icons** — clean icon set
- **App Router** — Next.js 14 modern routing

---

## 🎨 Design System

**Fonts:**
- `Inter` — body text
- `Plus Jakarta Sans` — display/headings

**Colors:**
- Brand: `hsl(221 83% 53%)` (modern blue)
- Status: success/warning/danger (semantic colors)

**Components:**
- Glass cards dengan backdrop blur
- Premium cards dengan subtle shadow
- Smooth animations (fade-in, slide-up)

---

## 📝 Customization

### Update angka indicator manual

Edit `src/app/api/macro/route.ts`, cari object `FALLBACK`:

```typescript
const FALLBACK = {
  cadev: { value: 148.2, change: -3.7, monthsImport: 6.2 },
  inflation: { value: 3.48, change: -1.28 },
  // ... update angka di sini
};
```

### Tweak asumsi skenario krisis

Edit `src/lib/scenarios.ts`, ubah multiplier sesuai kebutuhan.

### Custom theme

Edit `tailwind.config.ts` di section `colors`.

---

## 🤝 Contributing

Pull requests welcome! Untuk perubahan besar, buka issue dulu.

---

## ⚠️ Disclaimer

Apps ini untuk edukasi & simulasi. Bukan financial advice. Konsultasi dengan financial planner profesional untuk keputusan finansial.

---

## 📄 License

MIT
