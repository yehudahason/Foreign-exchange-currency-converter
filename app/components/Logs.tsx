import { Dispatch, SetStateAction } from "react";
import { LogsRow } from "./LogsRow";
import { LogsItems } from "../types";

type CompareListProps = {
  logs: LogsItems;
  setLogs: Dispatch<SetStateAction<LogsItems>>;
};
export default function Logs({ logs, setLogs }: CompareListProps) {
  return (
    <section className="rounded-3xl w-full max-w-6xl border border-zinc-800 bg-[#151515] sm:p-6 p-2">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <h2 className="flex flex-col gap-2 sm:flex-row">
          <span className="uppercase sm:text-preset-3-medium px-2 text-preset-5  tracking-[0.3em] text-white">
            Conversion log
          </span>
        </h2>

        <span className="text-preset-5 uppercase tracking-[0.25em] text-zinc-500">
          {logs.length} Pairs
        </span>
      </div>

      <div className="space-y-4">
        {logs.map((item, index) => (
          <LogsRow key={index} index={index} {...item} setLogs={setLogs} />
        ))}
      </div>
    </section>
  );
}
