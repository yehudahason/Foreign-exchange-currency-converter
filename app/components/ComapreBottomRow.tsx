import type { Dispatch, SetStateAction } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutline } from "@heroicons/react/24/outline";
import { Pairs } from "../types";
type CompareRowProps = {
  flag: string;
  code: string;
  name: string;
  amount: number;
  choosenRate: number;
  isFavorite: boolean;
  setFavorites: Dispatch<SetStateAction<Pairs>>;
  selected: string;
};

export function CompareBottomRow({
  flag,
  code,
  name,
  choosenRate,
  isFavorite,
  amount,
  setFavorites,
  selected,
}: CompareRowProps) {
  const toggleFavorite = (currency: string) => {
    setFavorites((prev) => {
      const exists = prev.some(
        ({ base, quote }) => base === selected && quote === currency,
      );

      return exists
        ? prev.filter(
            ({ base, quote }) => !(base === selected && quote === currency),
          )
        : [...prev, { base: selected, quote: currency }];
    });
  };
  return (
    <div className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-[#1e1e1f] sm:px-5 px-1 py-4 transition hover:border-zinc-700">
      {/* Left */}
      <div className="flex items-center sm:gap-4 gap-2">
        <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full">
          <img
            src={`https://flagcdn.com/${flag}.svg`}
            alt={name}
            className="h-full w-full object-cover"
          />
        </div>

        <div>
          <h3 className="text-preset-4 mb-2 tracking-widest text-white">
            {code}
          </h3>

          <p className=" text-preset-5 overflow-hidden tracking-wide text-zinc-500">
            {name}
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center sm:gap-6 gap-1">
        <div className="text-right">
          <div className="mt-1 break-all text-preset-3 text-white">
            {amount.toFixed(2)}
          </div>
          <div className="mt-2 text-sm text-zinc-500">
            @ {choosenRate.toFixed(2)}
          </div>
        </div>

        <button
          type="button"
          aria-pressed={isFavorite}
          aria-label={
            isFavorite
              ? `Remove ${selected} to ${code} from favorites`
              : `Add ${selected} to ${code} to favorites`
          }
          onClick={() => toggleFavorite(code)}
          className={` focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1e1e1f] flex hover:cursor-pointer h-11 w-11 items-center justify-center rounded-xl border transition ${
            isFavorite
              ? "border-lime-400 text-lime-400"
              : "border-zinc-700 text-zinc-500 hover:border-zinc-500"
          }`}
        >
          {isFavorite ? (
            <StarIcon className="h-5 w-5" />
          ) : (
            <StarOutline className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );
}
