import { Dispatch, SetStateAction } from "react";
import { timeAgo } from "../utils/timeAgo";
import type { LogsItems } from "../types";

type LogsRowProps = {
  dark: boolean;
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
  dark,
}: LogsRowProps) {
  return (
    <li className="flex items-center justify-between rounded-2xl shadow-lg dark:bg-[#1e1e1f] bg-surface-2 sm:px-5 px-1 py-4 transition ">
      {/* Left */}
      <div className="flex items-center sm:gap-3 gap-1">
        <h4 className="dark:text-neutral-200 text-text-secondary text-preset-4">
          {timeAgo(date)}
        </h4>
        <h3 className="text-preset-4  tracking-widest text-text dark:text-white">
          {" "}
          {base}
        </h3>
        <img className="w-3" src="/images/icon-arrow-right.svg" alt="" />
        <h3 className="text-preset-4  tracking-widest dark:text-white text-text">
          {quote}
        </h3>
      </div>

      {/* Right */}
      <div className="flex items-center sm:gap-6 gap-1">
        <div className="text-right grid sm:grid-cols-2 grid-cols-1 sm:gap-4 gap-1 place-content-center place-items-center">
          <div className=" break-all sm:text-preset-3 text-preset-5 dark:text-white text-text">
            {amount.toFixed(2)}
          </div>
          <div className=" sm:text-preset-3 text-preset-5 text-lime-700 dark:text-lime-400">
            {rate.toFixed(2)}
          </div>
        </div>

        <button
          type="button"
          aria-label="Delete Row"
          onClick={() => {
            setLogs((prevLogs) => prevLogs.filter((log, i) => i !== index));
          }}
          className={`hover:cursor-pointer flex h-11 w-11 items-center justify-center rounded-xl border transitionborder-zinc-700 dark:text-zinc-500 text-text hover:border-zinc-500`}
        >
          <img
            className="w-5"
            src={`/images/icon-delete${dark ? "-filled" : ""}.svg`}
            alt=""
          />
        </button>
      </div>
    </li>
  );
}
