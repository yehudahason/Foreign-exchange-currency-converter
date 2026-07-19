import Image from "next/image";

import Times from "./Times";
import { formatSigned } from "../utils/formatSigned";
import type { Changes, Rates } from "../types";
import { ChartRange } from "../types";

type ChangesProps = {
  changes: Changes;
  setTime: (time: ChartRange) => void;
  rate: Rates;
};
export default function ChangeBar({ changes, setTime, rate }: ChangesProps) {
  return (
    <div className="mb-4 flex lg:flex-row   flex-col lg:items-center items-start  w-full max-w-6xl text-preset-4  text-zinc-300  gap-6 justify-between">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:w-[70%] uppercase  text-xl w-full px-2  gap-6">
        <span className="flex gap-1   flex-col justify-center items-start bg-zinc-900 rounded-xl py-1 px-5">
          <span> Open </span>
          <span>{changes.open.toFixed(4)}</span>
        </span>
        <span className="flex gap-1  flex-col justify-center items-start bg-zinc-900 rounded-xl py-2 px-5">
          <span>Last</span>
          <span>{changes.last.toFixed(4)}</span>
        </span>

        <span className="flex gap-1  flex-col justify-center items-start bg-zinc-900  rounded-xl py-2 px-5">
          <span>CHange</span>
          <span
            className={`flex w-4 gap-1  text-preset-2 ${changes.change >= 0 ? "text-green-500" : "text-red-500"}`}
          >
            {formatSigned(+changes.change.toFixed(4))}
          </span>
        </span>
        <span className="flex gap-1   min-w-[8.5rem] flex-col justify-center items-start bg-zinc-900  rounded-xl py-2 sm:px-4 px-2 text-zinc-300">
          <span>% CHANGE</span>

          <span
            className={`flex text-preset-2 w-6 gap-1  ${changes.change >= 0 ? "text-green-500" : "text-red-500"}`}
          >
            <Image
              src="/images/icon-chevron-down.svg"
              alt=""
              className={`max-w-5 ${changes.change >= 0 ? "rotate-180 green" : "red"}`}
              width={20}
              height={16}
            />
            {formatSigned(+changes.percent.toFixed(4))}
          </span>
        </span>
      </div>
      <Times setTime={setTime} rate={rate} />
    </div>
  );
}
