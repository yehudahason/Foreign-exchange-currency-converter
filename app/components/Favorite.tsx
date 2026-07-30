import { useEffect, type Dispatch, type SetStateAction } from "react";
import { FavoriteRow } from "./FavoriteRow";
import { ExchangeRate, Pairs } from "../types";
import { useQuery } from "@tanstack/react-query";
import { useToday } from "../utils/useToday";
import { useMemo } from "react";
import { fetchFavoritePairs } from "../fetchMethods/fetchFavoritesPairs";
import { mapFavoritePairs } from "../utils/mapFavoritePairs";

type CompareListProps = {
  favorites: Pairs;
  setFavorites: Dispatch<SetStateAction<Pairs>>;
};
export default function Favorite({
  favorites,
  setFavorites,
}: CompareListProps) {
  const today = useToday();
  const favoritesKey = useMemo(
    () =>
      favorites
        .map(({ base, quote }) => `${base}-${quote}`)
        .sort()
        .join(","),
    [favorites],
  );

  const {
    status,
    fetchStatus,
    dataUpdatedAt,
    data: pairs = [],
    isPending,
    error,
    isError,
  } = useQuery({
    queryKey: ["favorite-pairs", today, favoritesKey],
    queryFn: () => {
      console.log("QUERY FN");
      return fetchFavoritePairs(favorites);
    },
    enabled: favorites.length > 0,
    select: mapFavoritePairs,
  });
  console.log(status);
  console.log(fetchStatus);
  console.log(dataUpdatedAt);
  useEffect(() => {
    console.log(favorites, "-\n", favoritesKey);
  }, [favorites, favoritesKey]);

  if (isError) {
    console.log(error.message);
    return (
      <p className="text-amber-700" role="alert">
        {" "}
        Failed to load exchange rates. Please try again.
      </p>
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
        {isPending && favorites.length > 0 && (
          <span className="flex animate-spin h-[20rem] flex-col items-center-safe justify-center">
            <img
              className="h-full"
              src="/spinner.png"
              alt=""
              aria-hidden="true"
            />
          </span>
        )}
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
