"use client";
import Image from "next/image";

import { useEffect, useState } from "react";
import Chart from "./components/Chart";
import HourlyChart from "./components/HourlyChart";
import type { Rates } from "./types";
import { useQuery } from "@tanstack/react-query";
import { compareRate } from "./fetchMethods/compareRates";
import { getHourlyData } from "./fetchMethods/getHourlyData";
import { CURRENCIES } from "@/public/frankfurter_currencies";
import { POPULAR_CURRENCIES } from "@/public/popularCurrencies";
import { getAllcodes } from "./fetchMethods/getAllCodes";
export default function Home() {
  const [rate, setrate] = useState<Rates>({ quotes: "ILS", base: "USD" });
  const mergeObject = { ...CURRENCIES, ...POPULAR_CURRENCIES };
  const AllCurrencies = Object.keys(mergeObject);
  const popularCurrencies = Object.keys(POPULAR_CURRENCIES);
  const othersCurrencies = Object.keys(CURRENCIES);
  const [query, setQuery] = useState("USD");
  const [open, setOpen] = useState(false);

  const items = othersCurrencies.filter((c) =>
    c.toLowerCase().includes(query.toLowerCase()),
  );

  const country = mergeObject[rate.base].flag;
  const country2 = mergeObject[rate.quotes].flag;
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

  useEffect(() => {
    getAllcodes();
  }, []);
  return (
    <main className="bg-[#171717] min-h-screen flex flex-col items-center w-full mx-auto">
      <div className="flex items-center gap-2 h-fit overflow-hidden">
        <Image src={flagUrl} width={40} height={25} alt="state" /> /
        <Image src={flagUrl2} width={40} height={25} alt="state" />
      </div>

      <button className="flex justify-center items-center px-3 py-2 bg-neutral-800 rounded-lg border border-neutral-600">
        {" "}
        <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full">
          <img
            src={`https://flagcdn.com/${mergeObject[query]?.flag}.svg`}
            alt={mergeObject[query]?.name}
            className="h-full w-full object-cover"
          />
        </div>
        <span className="w-12 text-sm font-bold text-white">{query}</span>
        <img
          src="/images/icon-chevron-down.svg"
          alt=""
          className={`${open ? "rotate-180" : ""} w-4 h-4 transition`}
        />
      </button>
      <div className="relative w-72 p-2 bg-[#1b1d24]  rounded-xl">
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
          <ul className="absolute z-10 mt-0 max-h-80 w-full overflow-y-auto rounded-b-xl bg-[#1b1d24] text-yellow-100 shadow-xl scrollbar left-0">
            <li className="uppercase flex justify-between items-center font-medium pt-2 px-4 text-gray-400">
              <span className="text-preset-5-medium">Popular</span>
              <span className="text-preset-5-medium">
                {popularCurrencies.length}
              </span>
            </li>
            {popularCurrencies.map((code) => (
              <li
                key={code}
                onClick={() => {
                  setQuery(code);
                  setOpen(false);
                }}
                tabIndex={1}
                className="cursor-pointer border-b border-gray-600 px-2 py-3 hover:bg-gray-800"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full">
                    <img
                      src={`https://flagcdn.com/${mergeObject[code].flag}.svg`}
                      alt={mergeObject[code].name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <span className="w-12 text-sm font-bold text-white">
                    {code}
                  </span>

                  <span className="truncate text-sm text-zinc-400">
                    {mergeObject[code].name}
                  </span>
                </div>
              </li>
            ))}
            <li className="flex justify-between  uppercase font-medium pt-2 px-3 text-gray-400">
              <span className="text-preset-5-medium">Others Currencies </span>
              <span className="text-preset-5-medium">
                {othersCurrencies.length}
              </span>
            </li>
            {items.map((code) => (
              <li
                key={code}
                onClick={() => {
                  setQuery(code);
                  setOpen(false);
                }}
                tabIndex={1}
                className="cursor-pointer border-b border-gray-600 px-2 py-3 hover:bg-gray-800"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full">
                    <img
                      src={`https://flagcdn.com/${mergeObject[code].flag}.svg`}
                      alt={mergeObject[code].name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <span className="w-12 text-sm font-bold text-white">
                    {code}
                  </span>

                  <span className="truncate text-sm text-zinc-400">
                    {mergeObject[code].name}
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
      <div className="bg-[#171717] rounded-3xl border h-fit mx-auto max-w-3xl  w-full border-zinc-800  p-0 shadow-xl text-amber-200">
        {ratesLoading ? (
          <span className="flex animate-spin h-25 flex-col items-center-safe justify-center">
            {" "}
            <Image src="/spinner.png" alt="loading" width={80} height={80} />
          </span>
        ) : (
          <Chart data={rates ?? []} />
        )}
        {ratesError ? ratesError.message : ""}

        {hourlyLoading ? (
          <span className="flex animate-spin h-25 flex-col items-center-safe justify-center">
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
