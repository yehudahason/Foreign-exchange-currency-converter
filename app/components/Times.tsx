import { ChartRange, Rates } from "../types";
import { rangesArr } from "../types";
type TimesProps = {
  setTime: (range: ChartRange) => void;
  rate: Rates;
};

export default function Times({ setTime, rate }: TimesProps) {
  return (
    <div className="flex items-center   sm:flex-row  gap-0 bg-zinc-900 rounded-md">
      {rangesArr.map((range) => (
        <button
          type="button"
          onClick={() => setTime(range)}
          key={range}
          className={` cursor-pointer rounded-md p-3  text-sm ${range === rate.time ? "bg-gray-800" : "bg-zinc-900"} font-medium  hover:bg-gray-800`}
        >
          {range}
        </button>
      ))}
    </div>
  );
}
