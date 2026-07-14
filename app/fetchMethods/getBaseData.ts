import { ExchangeRate } from "../types";

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

  const previousMap = new Map(prev.map((rate) => [rate.quote, rate.rate]));

  return today.map(({ quote, rate }) => {
    const previous = previousMap.get(quote);

    return {
      currency: quote,
      rate,
      previous,
      percentChange:
        previous !== undefined ? ((rate - previous) / previous) * 100 : null,
    };
  });
}
