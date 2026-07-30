import type { Pairs, ExchangeRate } from "../types";

export async function fetchFavoritePairs(
  favorites: Pairs,
): Promise<ExchangeRate[][]> {
  const from = new Date();
  from.setDate(from.getDate() - 7);

  const date = from.toISOString().split("T")[0];

  return Promise.all(
    favorites.map(async ({ base, quote }) => {
      const res = await fetch(
        `https://api.frankfurter.dev/v2/rates?from=${date}&base=${base}&quotes=${quote}`,
        {
          cache: "no-store",
        },
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch ${base}/${quote}`);
      }
      const log = await res.json();
      console.log("fetchFavorites:", log);
      return log;
    }),
  );
}
