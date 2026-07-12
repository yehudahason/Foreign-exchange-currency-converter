import type { CurrencyList } from "../types";

export async function getAllcodes() {
  const res = await fetch("https://api.frankfurter.dev/v2/currencies");
  const currencies = (await res.json()) as CurrencyList;
  console.log(currencies);
  const codes = currencies.map((item) => item.iso_code);
  console.log(codes);
}
