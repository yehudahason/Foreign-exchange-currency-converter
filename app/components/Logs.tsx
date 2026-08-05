import { Dispatch, SetStateAction } from "react";
import { LogsRow } from "./LogsRow";
import { LogsItems } from "../types";

type CompareListProps = {
  logs: LogsItems;
  setLogs: Dispatch<SetStateAction<LogsItems>>;
  dark: boolean;
};
export default function Logs({ dark, logs, setLogs }: CompareListProps) {
  return (
    <section className="rounded-3xl w-full  min-h-[11rem]  max-w-6xl border border-gray-300 dark:border-gray-800  dark:bg-[#151515] bg-surface sm:py-4 sm:px-6 p-2 shadow-lg ">
      {/* Header */}
      <div className="mb-5   px-2 gap-2 flex flex-col sm:flex-row items-start  sm:items-center justify-between">
        <h2 className="">
          <span className="uppercase sm:text-preset-3-medium  text-preset-5  tracking-[0.3em] text-text dark:text-white">
            Conversion log
          </span>
        </h2>
        <div className="flex gap-4 items-center w-full sm:w-fit justify-between">
          <span
            aria-label={`${logs.length} Logged`}
            className="text-preset-4 font-medium uppercase text-text-secondary dark:text-zinc-500"
          >
            {logs.length} Logged
          </span>
          <button
            type="button"
            aria-label="Clear Logs"
            onClick={() => setLogs([])}
            className="uppercase sm:p-2  cursor-pointer p-1 rounded-lg border border-neutral-200 text-preset-5 dark:text-neutral-200 text-text-secondary"
          >
            Clear All
          </button>
        </div>
      </div>

      <ul className="space-y-4" aria-label="List of all Logs">
        {logs.map((item, index) => (
          <LogsRow
            dark={dark}
            key={index}
            index={index}
            {...item}
            setLogs={setLogs}
          />
        ))}
        {logs.length === 0 && (
          <div className="flex flex-col items-center gap-4">
            <h3 className=" text-center text-preset-3-medium dark:text-neutral-100 text-text">
              No conversions logged yet
            </h3>
            <p className="max-w-[29rem] text-center text-preset-4 dark:text-gray-400 text-gray-700">
              Every conversion is recorded here automatically when you tap Log
              conversion. Your log is private to this session and this browser
            </p>
          </div>
        )}
      </ul>
    </section>
  );
}
