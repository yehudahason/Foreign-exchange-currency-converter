import { StarIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutline } from "@heroicons/react/24/outline";
import { Rates } from "../types";
type CompareRowProps = {
  flag: string;
  code: string;
  name: string;
  amount: number;
  choosenRate: number;
  favorite: boolean;
  rate: Rates;
  money: number;
};

export function LogsRow({
  flag,
  code,
  name,
  choosenRate,
  favorite,
  amount,
  rate,
  money,
}: CompareRowProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-[#1e1e1f] sm:px-5 px-1 py-4 transition hover:border-zinc-700">
      {/* Left */}
      <div className="flex items-center sm:gap-2 gap-1">
        <h3 className="text-preset-4  tracking-widest text-white">
          {" "}
          {rate.base}
        </h3>
        <img className="w-3" src="/images/icon-arrow-right.svg" alt="" />
        <h3 className="text-preset-4  tracking-widest text-white">{code}</h3>
      </div>

      {/* Right */}
      <div className="flex items-center sm:gap-6 gap-1">
        <div className="text-right grid sm:grid-cols-2 grid-cols-1 sm:gap-4 gap-1 place-content-center place-items-center">
          <div className=" break-all sm:text-preset-3 text-preset-5 text-white">
            {money.toFixed(2)}
          </div>
          <div className=" sm:text-preset-3 text-preset-5 text-lime-400">
            {amount.toFixed(2)}
          </div>
        </div>

        <button
          className={`flex h-11 w-11 items-center justify-center rounded-xl border transition ${
            favorite
              ? "border-lime-400 text-lime-400"
              : "border-zinc-700 text-zinc-500 hover:border-zinc-500"
          }`}
        >
          {favorite ? (
            <img src="/images/icon-delete-filled.svg" alt="" />
          ) : (
            <img src="/images/icon-delete-filled.svg" alt="" />
          )}
        </button>
      </div>
    </div>
  );
}
