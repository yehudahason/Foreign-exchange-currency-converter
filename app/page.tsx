"use client";
import Image from "next/image";

import { useState } from "react";
import Chart from "./components/Chart";
import HourlyChart from "./components/HourlyChart";
import type { Rates } from "./types";
import { useQuery } from "@tanstack/react-query";
import { compareRate } from "./fetchMethods/compareRates";
import { getHourlyData } from "./fetchMethods/getHourlyData";
import { CURRENCIES } from "@/public/images/flags/map";
export default function Home() {
  const [rate, setrate] = useState<Rates>({ quotes: "ILS", base: "USD" });

  const currencies = Object.keys(CURRENCIES);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = currencies.filter((c) =>
    c.toLowerCase().includes(query.toLowerCase()),
  );
  const country = CURRENCIES[rate.base].flag; // "us"
  const country2 = CURRENCIES[rate.quotes].flag; // "us"
  const flagUrl = `https://flagcdn.com/w40/${country}.png`;
  const flagUrl2 = `https://flagcdn.com/w40/${country2}.png`;
  const {
    data: rates,
    isPending: ratesLoading,
    error: ratesError,
  } = useQuery({
    queryKey: ["rates", rate.base, rate.quotes, "1y"],
    queryFn: () => compareRate("1y", rate),
  });

  const {
    data: hourlyData,
    isPending: hourlyLoading,
    error: hourlyError,
  } = useQuery({
    queryKey: ["hourly", rate.base, rate.quotes],
    queryFn: () => getHourlyData(rate),
  });

  return (
    <main className="bg-[#171717] min-h-screen flex flex-col items-center w-full mx-auto">
      <div className="flex items-center gap-2 h-fit overflow-hidden">
        <Image src={flagUrl} width={40} height={25} alt="state" /> /
        <Image src={flagUrl2} width={40} height={25} alt="state" />
      </div>

      <div className="relative w-72">
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onClick={() => setOpen(true)}
          placeholder="Search.."
          className="w-full rounded border border-zinc-600 bg-transparent px-3 py-2 text-amber-100 focus:border-amber-200 focus:outline-none"
        />

        {open && (
          <ul
            className="absolute z-10 mt-1 max-h-60 w-full  overflow-auto rounded-b-xl  text-yellow-100  flex flex-col 
          
          scrollbar  overflow-y-auto border border-zinc-700 bg-[#1b1d24] shadow-xl"
          >
            {filtered.map((code) => (
              <li
                key={code}
                onClick={() => {
                  setQuery(code);
                  setOpen(false);
                }}
                className="cursor-pointer px-2 py-4 hover:bg-gray-800 border-b border-b-gray-600"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full">
                    <img
                      src={`https://flagcdn.com/${CURRENCIES[code].flag}.svg`}
                      alt={CURRENCIES[code].name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <span className="w-12 text-sm font-bold text-white">
                    {code}
                  </span>

                  <span className="truncate text-sm text-zinc-400">
                    {CURRENCIES[code].name}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl font-semibold tracking-wider text-white">
          {rate.base}/{rate.quotes}
        </h2>

        <div className="font-mono text-sm text-zinc-400">
          0.8530 • MAY 14 16:00 CET
        </div>
      </div>
      <div className="bg-[#171717] rounded-3xl border h-fit mx-auto max-w-[768px]  w-full border-zinc-800  p-0 shadow-xl text-amber-200">
        {ratesLoading ? (
          <span className="flex animate-spin h-[100px] flex-col items-center-safe justify-center">
            {" "}
            <Image src="/spinner.png" alt="loading" width={80} height={80} />
          </span>
        ) : (
          <Chart data={rates ?? []} />
        )}
        {ratesError ? ratesError.message : ""}

        {hourlyLoading ? (
          <span className="flex animate-spin h-[100px] flex-col items-center-safe justify-center">
            <Image src="/spinner.png" alt="" height={80} width={80} />
          </span>
        ) : (
          <HourlyChart data={hourlyData ?? []} />
        )}
        {hourlyError ? hourlyError.message : ""}
      </div>
    </main>
  );
}
