// ============================================================
// Types untuk macro indicators
// ============================================================

export type StatusColor = "green" | "yellow" | "orange" | "red";

export interface MetricData {
  value: number;
  status: StatusColor;
  label: string;
  source?: "live" | "fallback";
}

export interface USDIDRData extends MetricData {
  benchmark: number;
  changePct: number;
  history?: { date: string; value: number }[];
}

export interface IHSGData extends MetricData {
  changePct: number;
  foreignFlow: string;
}

export interface YieldData extends MetricData {
  change: number;
}

export interface CadevData extends MetricData {
  change: number;
  monthsImport: number;
}

export interface InflationData extends MetricData {
  change: number;
}

export interface BIRateData extends MetricData {
  holdMonths: number;
}

export interface TradeData extends MetricData {
  streak: number;
}

export interface GDPData extends MetricData {
  change: number;
}

export interface MacroData {
  usdIdr: USDIDRData;
  yield10y: YieldData;
  ihsg: IHSGData;
  cadev: CadevData;
  inflation: InflationData;
  biRate: BIRateData;
  tradeBalance: TradeData;
  gdp: GDPData;
  pmi: MetricData;
  fedRate: number;
  brent: number;
  dxy: number;
  lastUpdated: string;
}

export interface HealthScore {
  score: number;
  status: string;
  color: StatusColor;
}

// ============================================================
// Types untuk stress test
// ============================================================

export type ScenarioId = "1998" | "2008" | "2020";
export type Sektor =
  | "Digital/Tech"
  | "Finansial/Banking"
  | "Pariwisata/F&B"
  | "Manufaktur/Ekspor"
  | "Pemerintahan"
  | "Lainnya";

export interface Expenses {
  cicilan: number;
  pokok: number;
  utilities: number;
  subscription: number;
  lifestyle: number;
  healing: number;
}

export interface Savings {
  rupiah: number;
  usd: number;
  emas: number;
  invest: number;
}

export interface UserProfile {
  income: number;
  expenses: Expenses;
  savings: Savings;
  sektor: Sektor;
  cicilanFloating: boolean;
}

export interface BreakdownItem {
  before: number;
  after: number;
  changePct: number;
}

export interface StressTestResult {
  survivalMonths: number;
  cashflowBefore: number;
  cashflowAfter: number;
  incomeAfter: number;
  expenseAfter: number;
  expenseBreakdown: Record<string, BreakdownItem>;
  savingsBreakdown: Record<string, BreakdownItem>;
  risks: string[];
  actions: {
    quick: string[];
    medium: string[];
    long: string[];
  };
}
