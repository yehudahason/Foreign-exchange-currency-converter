import type { Dispatch, SetStateAction } from "react";
import { FavoriteRow } from "./FavoriteRow";
import { mergeObject } from "../data";
import { Rates } from "../types";
import { useBaseRates } from "../fetchMethods/useBaseRates";

type CompareListProps = {
  money: number;
  rate: Rates;
  favorites: string[];
  setFavorites: Dispatch<SetStateAction<string[]>>;
};
export default function Favorite({
  money,
  rate,
  favorites,
  setFavorites,
}: CompareListProps) {
  const {
    data: comparerates,
    error,
    isPending,
    isError,
  } = useBaseRates(rate.base);

  let currencies = Object.entries(mergeObject).map(([code, currency]) => {
    const choosenRate =
      comparerates?.find((item) => item.currency === code)?.rate ?? 0;
    const percentChange =
      comparerates?.find((item) => item.currency === code)?.percentChange ?? 0;

    return {
      code,
      name: currency.name,
      amount: money * choosenRate,
      choosenRate,
      isFavorite: false,
      flag: currency.flag,
      percentChange,
    };
  });

  //Filtering base
  currencies = currencies.filter((item) => item.code !== rate.base);
  currencies = currencies.filter((item) => favorites.includes(item.code));

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
          {currencies.length} Pairs
        </span>
      </div>

      <div className="space-y-4">
        {currencies.map((currency) => (
          <FavoriteRow
            key={currency.code}
            {...currency}
            rate={rate}
            isFavorite={favorites.includes(currency.code)}
            setFavorites={setFavorites}
          />
        ))}
      </div>
    </section>
  );
}
