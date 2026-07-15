export type ApiResponse = {
  meta: {
    symbol: string;
    interval: string;
  };
  values: {
    datetime: string;
    open: string;
    high: string;
    low: string;
    close: string;
  }[];
};

export type Rates = {
  quotes: string;
  base: string;
  time: ChartRange;
};

export type Currency = {
  iso_code: string;
  iso_numeric: string;
  name: string;
  symbol: string;
  start_date: string;
};

export type CurrencyList = Currency[];

export type ExchangeRateHourly = {
  time: string;
  datetime: string;
  open: number;
  high: number;
  low: number;
  close: number;
};

export type HourlyChartProps = {
  data: ExchangeRateHourly[];
};

export type TooltipEntry = {
  payload: ExchangeRateHourly;
};

export type CustomTooltipProps = {
  active?: boolean;
  payload?: TooltipEntry[];
};

export type ExchangeRate = {
  date: string;
  base: string;
  quote: string;
  rate: number;
};
export const rangesArr: ChartRange[] = [
  "1d",
  "1w",
  "1m",
  "3m",
  "1y",
  "3y",
  "5y",
];
export type ChartRange = "1d" | "1w" | "1m" | "3m" | "1y" | "3y" | "5y";
export type ChartProps = {
  data: ExchangeRate[];
  range: ChartRange;
  ticks: string[];
};

export type TooltipProps = {
  active?: boolean;
  payload?: {
    payload: ExchangeRate;
  }[];
};

export type CurrencyInfo = {
  flag: string;
  name: string;
};
export type CurrencyMap = Record<string, CurrencyInfo>;
