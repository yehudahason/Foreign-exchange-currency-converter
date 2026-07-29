import { type Dispatch, type SetStateAction } from "react";
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
  const {
    data: pairs = [],
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["favorite-pairs", favorites],
    queryFn: async (): Promise<ExchangeRate[][]> => {
      const today = new Date();
      today.setDate(today.getDate() - 7);

      const from = today.toISOString().split("T")[0]; // YYYY-MM-DD

      return Promise.all(
        favorites.map(async ({ base, quote }) => {
          const res = await fetch(
            `https://api.frankfurter.dev/v2/rates?from=${from}&base=${base}&quotes=${quote}`,
          );

          if (!res.ok) {
            throw new Error(`Failed to fetch ${base}/${quote}`);
          }

          return res.json();
        }),
      );
    },
    enabled: favorites.length > 0,
    select: (pairs) =>
      pairs
        .filter((history) => history.length >= 2)
        .map((history) => {
          const first = history[history.length - 2];
          const last = history[history.length - 1];

          return {
            base: last.base,
            quote: last.quote,
            rate: last.rate,
            percentChange:
              first.rate !== 0
                ? ((last.rate - first.rate) / first.rate) * 100
                : 0,
          };
        }),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    console.log(error.message);
    return (
      <p role="alert"> Failed to load exchange rates. Please try again.</p>
    );
  }

  return (
    <section className="rounded-3xl min-h-[11rem] w-full max-w-6xl border border-gray-300 dark:border-gray-800 dark:bg-[#151515] bg-surface sm:p-6 p-2 shadow-lg">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <h2 className="flex flex-col gap-2 sm:flex-row">
          <span className=" sm:text-preset-3-medium px-2 text-preset-5 uppercase tracking-[0.3em] text-text dark:text-white">
            Pinned Pairs
          </span>
        </h2>

        <span className="text-preset-5 uppercase tracking-[0.25em] dark:text-zinc-500 text-text-secondary">
          {pairs.length} Pairs
        </span>
      </div>

      <ul aria-label="List of all Choosen favorites" className="space-y-4">
        {pairs?.map((item) => (
          <FavoriteRow
            key={item.quote + item.base}
            fbase={item.base}
            fquote={item.quote}
            setFavorites={setFavorites}
            choosenRate={item.rate}
            percentChange={item.percentChange}
            isFavorite={true}
          />
        ))}
        {pairs.length === 0 && (
          <h3 className="uppercase text-center text-preset-2-bold dark:text-neutral-100 text-text">
            No favorite yet
          </h3>
        )}
      </ul>
    </section>
  );
}
