import { ChartRange, Rates } from "../types";
import { rangesArr } from "../data/index";
type TimesProps = {
  setTime: (range: ChartRange) => void;
  rate: Rates;
};

export default function Times({ setTime, rate }: TimesProps) {
  return (
    <div className="flex items-center   sm:flex-row  gap-0 bg-surface shadow dark:bg-zinc-900 rounded-md">
      {rangesArr.map((range) => (
        <button
          type="button"
          onClick={() => setTime(range)}
          key={range}
          className={`focus:z-10  outline-0 focus:outline-1  focus:outline-amber-600 cursor-pointer rounded-md p-3  text-sm ${range === rate?.time ? "dark:bg-gray-800 bg-gray-300" : "dark:bg-zinc-900"} font-medium  dark:hover:bg-gray-800 hover:bg-gray-300`}
        >
          {range}
        </button>
      ))}
    </div>
  );
}
