import type { Dispatch, SetStateAction } from "react";

import { CompareBottomRow } from "./CompareBottomRow";
import { COMPARE_CURRENCIES } from "../data";
import { Pairs, Rates } from "../types";
import { useBaseRates } from "../fetchMethods/useBaseRates";

type CompareListProps = {
  money: number;
  rate: Rates;
  favorites: Pairs;
  setFavorites: Dispatch<SetStateAction<Pairs>>;
  selected: string;
};
export default function CompareBottom({
  money,
  rate,
  favorites,
  setFavorites,
  selected,
}: CompareListProps) {
  const {
    data: comparerates,
    error,
    isPending,
    isError,
  } = useBaseRates(rate.base);
  let currencies = Object.entries(COMPARE_CURRENCIES).map(
    ([code, currency]) => {
      const choosenRate =
        comparerates?.find((item) => item.currency === code)?.rate ?? 0;

      return {
        code,
        name: currency.country,
        amount: money * choosenRate,
        choosenRate,
        flag: currency.flag,
      };
    },
  );
  if (isError) {
    console.log(error.message);
    return (
      <p className="text-amber-700 py-4" role="alert">
        Failed to load exchange rates. Please try again.
      </p>
    );
  }

  //Filtering base
  currencies = currencies.filter((item) => item.code !== rate.base);
  return (
    <section className="rounded-3xl w-full max-w-6xl border border-gray-300 dark:border-gray-800 dark:bg-[#151515] bg-surface sm:p-6 p-2 shadow-lg">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <h2 className="flex flex-col gap-2 sm:flex-row">
          <span className=" sm:text-preset-4 px-2 text-preset-5 uppercase tracking-[0.3em] dark:text-zinc-500 text-text-secondary">
            Multi-Currency{" "}
          </span>

          <span className="ml-2 text-preset-3-medium text-text dark:text-white ">
            {money} FROM {rate.base}
          </span>
        </h2>

        <span className="text-preset-5 uppercase tracking-[0.25em] dark:text-zinc-500 text-text-secondary">
          {currencies.length} Pairs
        </span>
      </div>

      <ul className="space-y-4" aria-label="List of Top Currenicies">
        {isPending && (
          <div className="h-[10rem] flex items-center justify-center flex-col">
            {" "}
            <div className=" animate-fade text-amber-500">Loading Rates..</div>
          </div>
        )}
        {currencies.map((currency) => (
          <li key={currency.code}>
            <CompareBottomRow
              setFavorites={setFavorites}
              {...currency}
              isFavorite={favorites.some(
                ({ base, quote }) =>
                  base === selected && quote === currency.code,
              )}
              selected={selected}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
