import { POPULAR_CURRENCIES, ExchangeRate } from "../types";

export async function getBaseData(base = "USD") {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const date = yesterday.toISOString().split("T")[0];

  const [today, prev]: [ExchangeRate[], ExchangeRate[]] = await Promise.all([
    fetch(`https://api.frankfurter.dev/v2/rates?base=${base}`).then((r) => {
      if (!r.ok) throw new Error(`Failed to fetch today's rates (${r.status})`);
      return r.json();
    }),
    fetch(
      `https://api.frankfurter.dev/v2/rates?base=${base}&date=${date}`,
    ).then((r) => {
      if (!r.ok)
        throw new Error(`Failed to fetch previous rates (${r.status})`);
      return r.json();
    }),
  ]);

  const previousMap = new Map(prev.map((r) => [r.quote, r.rate]));

  const order = new Map(
    POPULAR_CURRENCIES.map((currency, index) => [currency, index]),
  );

  const list = today
    .map(({ quote, rate }) => {
      const previous = previousMap.get(quote);

      return {
        currency: quote,
        rate,
        previous,
        percentChange:
          previous !== undefined ? ((rate - previous) / previous) * 100 : null,
      };
    }) // Filter No Change
    .filter(
      (item) =>
        item.previous !== undefined &&
        Math.abs(item.rate - item.previous) > 1e-12,
    )
    .sort((a, b) => {
      const ai = order.get(a.currency);
      const bi = order.get(b.currency);

      if (ai !== undefined && bi !== undefined) return ai - bi;
      if (ai !== undefined) return -1;
      if (bi !== undefined) return 1;

      return a.currency.localeCompare(b.currency);
    });
  console.log(list);
  return list;
}
