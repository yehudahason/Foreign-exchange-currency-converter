import type { ChartRange } from "../types";
import { POPULAR_CURRENCIES } from "./popularCurrencies";
import { CURRENCIES } from "./frankfurter_currencies";
// ALL Currencies object
export const mergeObject = { ...CURRENCIES, ...POPULAR_CURRENCIES };

// Bottom comapre rates
export const COMPARE_CURRENCIES = {
  USD: { country: "United States", flag: "us" },
  EUR: { country: "European Union", flag: "eu" },
  GBP: { country: "United Kingdom", flag: "gb" },
  JPY: { country: "Japan", flag: "jp" },
  CHF: { country: "Switzerland", flag: "ch" },
  CAD: { country: "Canada", flag: "ca" },
  AUD: { country: "Australia", flag: "au" },
  CNY: { country: "China", flag: "cn" },
  INR: { country: "India", flag: "in" },
  BDT: { country: "Bangladeshi Taka", flag: "bd" },
} as const;

//popular list WITH NO  USD !!
export const POPULAR_CURRENCIES_NO_USD = [
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

export const rangesArr: ChartRange[] = ["1D", "1W", "1M", "3M", "1Y", "5Y"];
