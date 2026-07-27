import { useState, useEffect, type Dispatch, type SetStateAction } from "react";
import { FavoriteRow } from "./FavoriteRow";
import { ExchangeRate, Pairs } from "../types";
import { useQuery } from "@tanstack/react-query";

type CompareListProps = {
  favorites: Pairs;
  setFavorites: Dispatch<SetStateAction<Pairs>>;
};
export default function Favorite({
  favorites,
  setFavorites,
}: CompareListProps) {
  const [pairs, setPairs] = useState<ExchangeRate[][]>([]);

  const currencies = pairs.map((history) => {
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

  useEffect(() => {
    const today = new Date();

    today.setDate(today.getDate() - 7);
    async function fetchPairs(): Promise<ExchangeRate[][]> {
      const results = await Promise.all(
        favorites.map(async ({ base, quote }) => {
          const res = await fetch(
            `https://api.frankfurter.dev/v2/rates?from=${today}&base=${base}&quotes=${quote}`,
          );

          if (!res.ok) {
            throw new Error(`Failed to fetch ${base}/${quote}`);
          }

          return res.json();
        }),
      );

      return results;
    }

    fetchPairs()
      .then((data) => {
        setPairs(data);
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [favorites]);
  return (
    <section className="rounded-3xl w-full max-w-6xl border border-zinc-800 bg-[#151515] sm:p-6 p-2">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <h2 className="flex flex-col gap-2 sm:flex-row">
          <span className=" sm:text-preset-3-medium px-2 text-preset-5 uppercase tracking-[0.3em] text-white">
            Pinned Pairs
          </span>
        </h2>

        <span className="text-preset-5 uppercase tracking-[0.25em] text-zinc-500">
          {pairs.length} Pairs
        </span>
      </div>

      <div className="space-y-4">
        {currencies.map((item) => (
          <FavoriteRow
            key={item.quote + item.base}
            base={item.base}
            quote={item.quote}
            setFavorites={setFavorites}
            choosenRate={item.rate}
            percentChange={item.percentChange}
            isFavorite={true}
          />
        ))}
      </div>
    </section>
  );
}
