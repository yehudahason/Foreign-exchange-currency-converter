import type { ExchangeRate } from "../types";

export function mapFavoritePairs(pairs: ExchangeRate[][]) {
  return pairs
    .filter((history) => history.length >= 2)
    .map((history) => {
      const first = history[history.length - 2];
      const last = history[history.length - 1];

      return {
        base: last.base,
        quote: last.quote,
        rate: last.rate,
        percentChange:
          first.rate !== 0 ? ((last.rate - first.rate) / first.rate) * 100 : 0,
      };
    });
}
