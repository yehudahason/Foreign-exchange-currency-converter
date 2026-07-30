import { ExchangeRate } from "../types";
import { POPULAR_CURRENCIES_NO_USD } from "../data/index";

export async function getBaseData(base = "USD") {
  function formatUTCDate(date: Date) {
    return date.toISOString().slice(0, 10);
  }

  const yesterday = new Date();
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);

  const date = formatUTCDate(yesterday);

  const [today, prev]: [ExchangeRate[], ExchangeRate[]] = await Promise.all([
    fetch(`https://api.frankfurter.dev/v2/rates?base=${base}`, {
      cache: "no-store",
    }).then((r) => {
      if (!r.ok) throw new Error(`Failed to fetch today's rates (${r.status})`);
      return r.json();
    }),
    fetch(`https://api.frankfurter.dev/v2/rates?base=${base}&date=${date}`, {
      cache: "no-store",
    }).then((r) => {
      if (!r.ok)
        throw new Error(`Failed to fetch previous rates (${r.status})`);
      return r.json();
    }),
  ]);

  const previousMap = new Map(prev.map((r) => [r.quote, r.rate]));

  const order = new Map(
    POPULAR_CURRENCIES_NO_USD.map((currency, index) => [currency, index]),
  );

  const isNoChange = (value: number) => Math.abs(value) < 1e-10;
  const list = today
    .map(({ quote, rate }) => {
      const previous = previousMap.get(quote) ?? rate;

      return {
        currency: quote,
        rate,
        previous,
        percentChange: ((rate - previous) / previous) * 100,
      };
    })
    .sort((a, b) => {
      const aNoChange = isNoChange(a.percentChange);
      const bNoChange = isNoChange(b.percentChange);

      if (aNoChange !== bNoChange) {
        return aNoChange ? 1 : -1;
      }

      const ai = order.get(a.currency);
      const bi = order.get(b.currency);

      if (ai !== undefined && bi !== undefined) return ai - bi;
      if (ai !== undefined) return -1;
      if (bi !== undefined) return 1;

      return a.currency.localeCompare(b.currency);
    });
  console.log("useBase data:", list);
  return list;
}
