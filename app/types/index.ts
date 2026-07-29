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

export type ExchangeRate = {
  date: string;
  base: string;
  quote: string;
  rate: number;
};

export type ChartRange = "1D" | "1W" | "1M" | "3M" | "1Y" | "3Y" | "5Y";
export type ChartProps = {
  data: ExchangeRate[];
  range: ChartRange;
  ticks: string[] | undefined;
  dark: boolean;
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

export type Changes = {
  open: number;
  last: number;
  change: number;
  percent: number;
};

export type todayRates = {
  percentChange: number;
  currency: string;
  rate: number;
  previous: number;
};
export type Pairs = {
  base: string;
  quote: string;
}[];

export type LogsItems = {
  base: string;
  quote: string;
  amount: number;
  rate: number;
  date: Date;
}[];

export type LogItem = {
  base: string;
  quote: string;
  amount: number;
  rate: number;
  date: Date;
};
