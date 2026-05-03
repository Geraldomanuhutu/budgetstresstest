// ============================================================
// Crisis Scenarios — port dari scenarios.py
// ============================================================

import type { ScenarioId, Sektor } from "@/types";

export interface ScenarioDef {
  name: string;
  severity: number;
  expenseMultiplier: {
    cicilanFloating: number;
    cicilanFixed: number;
    pokok: number;
    utilities: number;
    subscription: number;
    lifestyle: number;
    healing: number;
  };
  incomeImpact: Record<Sektor, number>;
  assetImpact: {
    rupiah: number;
    usd: number;
    emas: number;
    invest: number;
  };
  story: string;
}

export const CRISIS_SCENARIOS: Record<ScenarioId, ScenarioDef> = {
  "1998": {
    name: "Krisis Asia 1998",
    severity: 5,
    expenseMultiplier: {
      cicilanFloating: 4.0,
      cicilanFixed: 1.0,
      pokok: 2.5,
      utilities: 1.8,
      subscription: 3.5,
      lifestyle: 3.0,
      healing: 3.5,
    },
    incomeImpact: {
      "Digital/Tech": 0.5,
      "Finansial/Banking": 0.3,
      "Pariwisata/F&B": 0.4,
      "Manufaktur/Ekspor": 1.2,
      Pemerintahan: 0.8,
      Lainnya: 0.5,
    },
    assetImpact: {
      rupiah: 0.25,
      usd: 3.5,
      emas: 2.5,
      invest: 0.4,
    },
    story:
      "Tahun 1998, rupiah jeblok dari Rp2.500 jadi Rp16.000 dalam beberapa bulan. Inflasi meroket 77,6% — harga sembako naik 3-4x lipat. 600+ bank kolaps. 13 juta orang kehilangan pekerjaan. Yang bertahan: yang punya tabungan dolar/emas, ga punya utang gede, atau kerja di sektor ekspor.",
  },
  "2008": {
    name: "Global Financial Crisis 2008",
    severity: 3,
    expenseMultiplier: {
      cicilanFloating: 1.3,
      cicilanFixed: 1.0,
      pokok: 1.15,
      utilities: 1.1,
      subscription: 1.3,
      lifestyle: 1.3,
      healing: 1.35,
    },
    incomeImpact: {
      "Digital/Tech": 0.95,
      "Finansial/Banking": 0.7,
      "Pariwisata/F&B": 0.85,
      "Manufaktur/Ekspor": 0.8,
      Pemerintahan: 1.0,
      Lainnya: 0.85,
    },
    assetImpact: {
      rupiah: 0.9,
      usd: 1.3,
      emas: 1.25,
      invest: 0.5,
    },
    story:
      "GFC 2008 dipicu krisis subprime mortgage di AS. Rupiah lemah dari Rp9.000 ke Rp12.000. IHSG anjlok 50%+. Sektor finansial terdampak parah. Indonesia relatif tahan dibanding negara lain karena sistem perbankan udah lebih kuat pasca-98.",
  },
  "2020": {
    name: "Pandemic Shock 2020",
    severity: 4,
    expenseMultiplier: {
      cicilanFloating: 0.95,
      cicilanFixed: 1.0,
      pokok: 1.05,
      utilities: 1.2,
      subscription: 1.2,
      lifestyle: 0.5,
      healing: 0.1,
    },
    incomeImpact: {
      "Digital/Tech": 1.1,
      "Finansial/Banking": 0.9,
      "Pariwisata/F&B": 0.3,
      "Manufaktur/Ekspor": 0.75,
      Pemerintahan: 1.0,
      Lainnya: 0.7,
    },
    assetImpact: {
      rupiah: 0.95,
      usd: 1.2,
      emas: 1.3,
      invest: 0.75,
    },
    story:
      "Maret 2020, COVID-19 bikin ekonomi Indonesia masuk resesi pertama sejak 1998. PDB kontraksi -2,07%. Pengangguran naik ke 7,1%. Sektor pariwisata, transportasi, F&B kolaps. Sektor digital, e-commerce, kesehatan boom. BI turunin BI Rate dari 5% ke 3,5%.",
  },
};
