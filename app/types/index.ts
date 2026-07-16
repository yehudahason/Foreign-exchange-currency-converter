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

export type ExchangeRate = {
  date: string;
  base: string;
  quote: string;
  rate: number;
};
export const rangesArr: ChartRange[] = ["1D", "1W", "1M", "3M", "1Y", "5Y"];
export type ChartRange = "1D" | "1W" | "1M" | "3M" | "1Y" | "3Y" | "5Y";
export type ChartProps = {
  data: ExchangeRate[];
  range: ChartRange;
  ticks: string[] | undefined;
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

//WITH NO  USD !!
export const POPULAR_CURRENCIES = [
  "EUR",
  "GBP",
  "JPY",
  "CHF",
  "CAD",
  "AUD",
  "NZD",
  "CNY",
  "HKD",
  "SGD",
  "SEK",
  "NOK",
  "DKK",
  "PLN",
  "CZK",
  "HUF",
  "RON",
  "TRY",
  "ILS",
  "MXN",
  "BRL",
  "INR",
  "ZAR",
];
