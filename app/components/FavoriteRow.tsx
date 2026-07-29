import type { Dispatch, SetStateAction } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutline } from "@heroicons/react/24/outline";
import { Pairs } from "../types";
import { formatSigned } from "../utils/formatSigned";

type CompareRowProps = {
  choosenRate: number;
  fbase: string;
  fquote: string;
  percentChange: number;
  isFavorite: boolean;
  setFavorites: Dispatch<SetStateAction<Pairs>>;
};

export function FavoriteRow({
  fbase,
  fquote,
  choosenRate,
  percentChange,
  setFavorites,
  isFavorite,
}: CompareRowProps) {
  const removeFavorite = () => {
    setFavorites((prev) => {
      return prev.filter(
        ({ base, quote }) => !(base === fbase && quote === fquote),
      );
    });
  };
  return (
    <li className="flex items-center justify-between rounded-2xl shadow-lg dark:bg-[#1e1e1f] bg-surface-2 sm:px-5 px-1 py-4 transition hover:border-zinc-700">
      {/* Left */}
      <div className="flex items-center gap-2">
        <h3 className="text-preset-4  tracking-widest text-text dark:text-white">
          {" "}
          {fbase}
        </h3>
        <img
          className="w-3"
          src="/images/icon-arrow-right.svg"
          alt=""
          aria-hidden="true"
        />
        <h3 className="text-preset-4  tracking-widest text-text dark:text-white">
          {fquote}
        </h3>
      </div>

      {/* Right */}
      <div className="flex items-center sm:gap-6 gap-3">
        <div className="text-right mr-4">
          <div
            className="mt-1 break-all text-right text-preset-3 dark:text-white text-text"
            aria-label={`Exchange rate: 1 ${fbase} equals ${choosenRate.toPrecision(4)} ${fquote}`}
          >
            {choosenRate.toPrecision(4)}
          </div>
          <span
            className={`flex gap-1 items-center justify-end text-preset-4 mt-2 text-right    ${percentChange >= 0 ? " dark:text-green-500 text-green-700" : "dark:text-red-500 text-red-700"}`}
          >
            <img
              src="/images/chevron-down.svg"
              alt=""
              aria-hidden="true"
              className={`max-w-5 ${percentChange >= 0 ? "rotate-180 green" : "red"}`}
            />
            <span
              aria-label={`${
                percentChange >= 0 ? "Up" : "Down"
              } ${Math.abs(percentChange).toFixed(3)} percent`}
            >
              {formatSigned(+percentChange.toFixed(3))}
            </span>
          </span>
        </div>

        <button
          type="button"
          aria-label={`Remove ${fbase} to ${fquote} from favorites`}
          onClick={removeFavorite}
          className={`focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1e1e1f] flex hover:cursor-pointer h-11 w-11 items-center justify-center rounded-xl border transition border-lime-400 text-lime-400`}
        >
          <StarIcon aria-hidden="true" className="h-5 w-5" />
        </button>
      </div>
    </li>
  );
}
