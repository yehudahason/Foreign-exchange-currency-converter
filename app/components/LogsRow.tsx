import { Dispatch, SetStateAction } from "react";
import { timeAgo } from "../utils/timeAgo";
import type { LogsItems } from "../types";

type CompareRowProps = {
  quote: string;
  base: string;
  amount: number;
  rate: number;
  date: Date;
  index: number;
  setLogs: Dispatch<SetStateAction<LogsItems>>;
};

export function LogsRow({
  setLogs,
  quote,
  base,
  amount,
  rate,
  date,
  index,
}: CompareRowProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-[#1e1e1f] sm:px-5 px-1 py-4 transition hover:border-zinc-700">
      {/* Left */}
      <div className="flex items-center sm:gap-3 gap-1">
        <h4 className="text-neutral-200 text-preset-4">{timeAgo(date)}</h4>
        <h3 className="text-preset-4  tracking-widest text-white"> {base}</h3>
        <img className="w-3" src="/images/icon-arrow-right.svg" alt="" />
        <h3 className="text-preset-4  tracking-widest text-white">{quote}</h3>
      </div>

      {/* Right */}
      <div className="flex items-center sm:gap-6 gap-1">
        <div className="text-right grid sm:grid-cols-2 grid-cols-1 sm:gap-4 gap-1 place-content-center place-items-center">
          <div className=" break-all sm:text-preset-3 text-preset-5 text-white">
            {amount.toFixed(2)}
          </div>
          <div className=" sm:text-preset-3 text-preset-5 text-lime-400">
            {rate.toFixed(2)}
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setLogs((prevLogs) => prevLogs.filter((log, i) => i !== index));
          }}
          className={`hover:cursor-pointer flex h-11 w-11 items-center justify-center rounded-xl border transitionborder-zinc-700 text-zinc-500 hover:border-zinc-500`}
        >
          <img src="/images/icon-delete-filled.svg" alt="" />
        </button>
      </div>
    </div>
  );
}
