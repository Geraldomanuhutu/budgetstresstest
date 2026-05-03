"use client";

import { useState } from "react";
import { ChevronDown, BookOpen, Calculator, TrendingUp, Briefcase, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionProps {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function MethodSection({ icon: Icon, title, children, defaultOpen = false }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3 bg-slate-50 hover:bg-slate-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-brand" />
          <span className="text-sm font-semibold text-foreground">{title}</span>
        </div>
        <ChevronDown
          className={cn("w-4 h-4 text-muted-foreground transition-transform", open && "rotate-180")}
        />
      </button>
      {open && (
        <div className="px-5 py-4 bg-white text-sm leading-relaxed text-foreground space-y-3 animate-in">
          {children}
        </div>
      )}
    </div>
  );
}

export function Methodology() {
  return (
    <section className="mt-16 pt-12 border-t border-slate-200/60">
      <div className="flex items-center gap-2 mb-2">
        <BookOpen className="w-5 h-5 text-brand" />
        <h2 className="text-xl font-bold font-display tracking-tight">Methodology</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-6">
        Penjelasan lengkap gimana stress test & macro health score dihitung. Transparansi penuh biar lo bisa validate logic-nya sendiri.
      </p>

      <div className="space-y-3">
        <MethodSection icon={Calculator} title="🧪 Cara Stress Test Dihitung" defaultOpen>
          <p>
            Stress test pake <strong>deterministic scenario modeling</strong> berbasis data historis. Tiap skenario punya 3 set parameter:
          </p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              <strong>Income multiplier per sektor</strong> — gimana sektor lo terdampak (range: 0.3x sampai 1.2x)
            </li>
            <li>
              <strong>Expense multiplier per kategori</strong> — kenaikan harga per kategori belanja (range: 0.1x sampai 4.0x)
            </li>
            <li>
              <strong>Asset impact multiplier</strong> — gimana nilai aset berubah (range: 0.25x sampai 3.5x)
            </li>
          </ol>
          <div className="bg-slate-50 rounded-lg p-3 font-mono text-xs">
            <p>incomeAfter = income × incomeMultiplier[sektor]</p>
            <p>expenseAfter = Σ(expense[i] × expenseMultiplier[i])</p>
            <p>cashflowAfter = incomeAfter - expenseAfter</p>
            <p className="mt-2">
              <strong>survivalMonths</strong> = totalAssetAfter / |cashflowAfter|
            </p>
            <p className="text-muted-foreground"># Capped at 24 bulan untuk display</p>
          </div>
        </MethodSection>

        <MethodSection icon={Briefcase} title="💼 Kenapa Sektor Pekerjaan Pengaruh?">
          <p>
            Tiap krisis punya karakter beda — sektor lo nentuin lo masuk &quot;tim survivor&quot; atau &quot;tim korban&quot;:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left p-2">Sektor</th>
                  <th className="text-center p-2">1998</th>
                  <th className="text-center p-2">2008</th>
                  <th className="text-center p-2">2020</th>
                  <th className="text-left p-2">Logika</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-2 font-medium">Digital/Tech</td>
                  <td className="text-center p-2">0.5x</td>
                  <td className="text-center p-2">0.95x</td>
                  <td className="text-center p-2 text-success-fg font-bold">1.10x ↑</td>
                  <td className="p-2 text-muted-foreground">2020 boom karena WFH</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">Banking</td>
                  <td className="text-center p-2 text-danger-fg font-bold">0.30x ↓</td>
                  <td className="text-center p-2">0.70x</td>
                  <td className="text-center p-2">0.90x</td>
                  <td className="p-2 text-muted-foreground">1998: 600+ bank kolaps</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">Pariwisata/F&B</td>
                  <td className="text-center p-2">0.40x</td>
                  <td className="text-center p-2">0.85x</td>
                  <td className="text-center p-2 text-danger-fg font-bold">0.30x ↓</td>
                  <td className="p-2 text-muted-foreground">2020 lockdown hancurin</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">Manufaktur Ekspor</td>
                  <td className="text-center p-2 text-success-fg font-bold">1.20x ↑</td>
                  <td className="text-center p-2">0.80x</td>
                  <td className="text-center p-2">0.75x</td>
                  <td className="p-2 text-muted-foreground">1998: rupiah lemah = ekspor untung</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">Pemerintahan</td>
                  <td className="text-center p-2">0.80x</td>
                  <td className="text-center p-2">1.00x</td>
                  <td className="text-center p-2">1.00x</td>
                  <td className="p-2 text-muted-foreground">Paling stabil — gaji PNS jarang dipotong</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground italic mt-2">
            Multiplier &lt;1 = income turun. Multiplier &gt;1 = income naik. 1.0 = stabil.
          </p>
        </MethodSection>

        <MethodSection icon={Wallet} title="💸 Expense Multiplier per Skenario">
          <p>Tiap kategori expense kena impact beda berdasarkan karakter krisis:</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left p-2">Kategori</th>
                  <th className="text-center p-2">1998</th>
                  <th className="text-center p-2">2008</th>
                  <th className="text-center p-2">2020</th>
                  <th className="text-left p-2">Logika</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-2 font-medium">Cicilan (floating)</td>
                  <td className="text-center p-2">4.0x</td>
                  <td className="text-center p-2">1.3x</td>
                  <td className="text-center p-2 text-success-fg">0.95x</td>
                  <td className="p-2 text-muted-foreground">Sensitif ke BI Rate</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">Pokok</td>
                  <td className="text-center p-2">2.5x</td>
                  <td className="text-center p-2">1.15x</td>
                  <td className="text-center p-2">1.05x</td>
                  <td className="p-2 text-muted-foreground">Inflasi pangan</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">Subscription</td>
                  <td className="text-center p-2">3.5x</td>
                  <td className="text-center p-2">1.3x</td>
                  <td className="text-center p-2">1.2x</td>
                  <td className="p-2 text-muted-foreground">Quoted USD (Spotify, Netflix)</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">Lifestyle</td>
                  <td className="text-center p-2">3.0x</td>
                  <td className="text-center p-2">1.3x</td>
                  <td className="text-center p-2 text-success-fg">0.5x</td>
                  <td className="p-2 text-muted-foreground">2020 turun karena lockdown</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">Healing</td>
                  <td className="text-center p-2">3.5x</td>
                  <td className="text-center p-2">1.35x</td>
                  <td className="text-center p-2 text-success-fg">0.1x</td>
                  <td className="p-2 text-muted-foreground">Travel mati di 2020</td>
                </tr>
              </tbody>
            </table>
          </div>
        </MethodSection>

        <MethodSection icon={TrendingUp} title="💎 Asset Impact per Skenario">
          <p>
            <strong>Penting:</strong> Tabungan rupiah dihitung dari sisi <em>purchasing power</em> (daya beli), bukan nilai nominal.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left p-2">Aset</th>
                  <th className="text-center p-2">1998</th>
                  <th className="text-center p-2">2008</th>
                  <th className="text-center p-2">2020</th>
                  <th className="text-left p-2">Logika</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-2 font-medium">Tabungan IDR</td>
                  <td className="text-center p-2 text-danger-fg font-bold">0.25x</td>
                  <td className="text-center p-2">0.90x</td>
                  <td className="text-center p-2">0.95x</td>
                  <td className="p-2 text-muted-foreground">Tergerus inflasi</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">Tabungan USD</td>
                  <td className="text-center p-2 text-success-fg font-bold">3.5x</td>
                  <td className="text-center p-2">1.30x</td>
                  <td className="text-center p-2">1.20x</td>
                  <td className="p-2 text-muted-foreground">Kurs naik = nilai rupiah meledak</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">Emas</td>
                  <td className="text-center p-2 text-success-fg">2.5x</td>
                  <td className="text-center p-2">1.25x</td>
                  <td className="text-center p-2">1.30x</td>
                  <td className="p-2 text-muted-foreground">Safe haven asset</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">Reksadana/Saham</td>
                  <td className="text-center p-2 text-danger-fg">0.40x</td>
                  <td className="text-center p-2 text-danger-fg">0.50x</td>
                  <td className="text-center p-2">0.75x</td>
                  <td className="p-2 text-muted-foreground">IHSG anjlok di tiap krisis</td>
                </tr>
              </tbody>
            </table>
          </div>
        </MethodSection>

        <MethodSection icon={Calculator} title="📊 Macro Health Score Formula">
          <p>
            Composite score 0-100 dari weighted average 8 indikator:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left p-2">Indikator</th>
                  <th className="text-center p-2">Bobot</th>
                  <th className="text-left p-2">Threshold Scoring</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr><td className="p-2 font-medium">USD/IDR vs APBN</td><td className="text-center p-2">20%</td><td className="p-2 text-muted-foreground">&lt;2% gap = 100, &gt;5% gap = 25</td></tr>
                <tr><td className="p-2 font-medium">Cadangan Devisa</td><td className="text-center p-2">15%</td><td className="p-2 text-muted-foreground">&gt;6 bulan impor = 80, &lt;3 bulan = 20</td></tr>
                <tr><td className="p-2 font-medium">Inflasi (CPI)</td><td className="text-center p-2">15%</td><td className="p-2 text-muted-foreground">Dalam target BI = 100, &gt;5% = 40</td></tr>
                <tr><td className="p-2 font-medium">PDB Growth</td><td className="text-center p-2">15%</td><td className="p-2 text-muted-foreground">≥5% = 100, &lt;3% = 40</td></tr>
                <tr><td className="p-2 font-medium">Yield SBN 10Y</td><td className="text-center p-2">10%</td><td className="p-2 text-muted-foreground">&lt;7% = 90, &gt;8.5% = 30</td></tr>
                <tr><td className="p-2 font-medium">PMI Manufaktur</td><td className="text-center p-2">10%</td><td className="p-2 text-muted-foreground">≥50 (ekspansi) = 100</td></tr>
                <tr><td className="p-2 font-medium">Trade Balance</td><td className="text-center p-2">10%</td><td className="p-2 text-muted-foreground">Surplus &gt;$1M = 100</td></tr>
                <tr><td className="p-2 font-medium">BI Rate Stance</td><td className="text-center p-2">5%</td><td className="p-2 text-muted-foreground">Spread vs Fed ≥1.5% = 90</td></tr>
              </tbody>
            </table>
          </div>
          <div className="bg-slate-50 rounded-lg p-3 font-mono text-xs">
            <p>score = Σ(indicatorScore[i] × weight[i])</p>
          </div>
          <p className="text-xs">
            <strong>Interpretasi:</strong> 80-100 🟢 Sehat · 60-79 🟡 Waspada · 40-59 🟠 Berisiko · &lt;40 🔴 Kritis
          </p>
        </MethodSection>

        <MethodSection icon={BookOpen} title="📚 Sumber Data & Asumsi">
          <p>
            <strong>Live data (auto-refresh tiap 1 jam):</strong>
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li>USD/IDR, IHSG, Brent Oil, Dollar Index → Yahoo Finance API</li>
            <li>Fed Funds Rate → FRED API (St. Louis Fed)</li>
          </ul>
          <p>
            <strong>Manual data (sumber resmi, update bulanan):</strong>
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li>Cadangan Devisa, BI Rate → Bank Indonesia (bi.go.id)</li>
            <li>Inflasi, PDB, Neraca Dagang → BPS (bps.go.id)</li>
            <li>Yield SBN 10Y → PHEI / Bloomberg</li>
            <li>PMI Manufaktur → S&P Global</li>
          </ul>
          <p>
            <strong>Asumsi APBN 2026:</strong> Kurs Rp 16.500, Pertumbuhan 5.4%, Inflasi 2.5%, Yield SBN 10Y 6.9%, ICP $70/barel — sumber: Kemenkeu RI.
          </p>
          <p className="text-xs text-muted-foreground italic">
            Multiplier skenario disusun berdasarkan studi historis krisis (LPEM UI, Bank Dunia, IMF) dengan adjustment konservatif. Bukan financial advice — buat edukasi & simulasi.
          </p>
        </MethodSection>
      </div>
    </section>
  );
}
