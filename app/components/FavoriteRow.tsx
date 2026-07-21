import { StarIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutline } from "@heroicons/react/24/outline";
import { Rates } from "../types";
import { formatSigned } from "../utils/formatSigned";
type CompareRowProps = {
  flag: string;
  code: string;
  name: string;
  amount: number;
  choosenRate: number;
  favorite: boolean;
  rate: Rates;
  percentChange: number;
};

export function FavoriteRow({
  flag,
  code,
  name,
  choosenRate,
  favorite,
  amount,
  rate,
  percentChange,
}: CompareRowProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-[#1e1e1f] sm:px-5 px-1 py-4 transition hover:border-zinc-700">
      {/* Left */}
      <div className="flex items-center gap-2">
        <h3 className="text-preset-4  tracking-widest text-white">
          {" "}
          {rate.base}
        </h3>
        <img className="w-3" src="/images/icon-arrow-right.svg" alt="" />
        <h3 className="text-preset-4  tracking-widest text-white">{code}</h3>
      </div>

      {/* Right */}
      <div className="flex items-center sm:gap-6 gap-3">
        <div className="text-right mr-4">
          <div className="mt-1 break-all text-right text-preset-3 text-white">
            {choosenRate.toPrecision(4)}
          </div>
          <span
            className={`flex gap-1 items-center justify-end text-preset-4 mt-2 text-right    ${percentChange >= 0 ? "text-green-500" : "text-red-500"}`}
          >
            <img
              src="/images/icon-chevron-down.svg"
              alt=""
              className={`max-w-5 ${percentChange >= 0 ? "rotate-180 green" : "red"}`}
            />
            <span>{formatSigned(+percentChange.toFixed(3))}</span>
          </span>
        </div>

        <button
          className={`flex h-11 w-11 items-center justify-center rounded-xl border transition ${
            favorite
              ? "border-lime-400 text-lime-400"
              : "border-zinc-700 text-zinc-500 hover:border-zinc-500"
          }`}
        >
          {favorite ? (
            <StarIcon className="h-5 w-5" />
          ) : (
            <StarOutline className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );
}
