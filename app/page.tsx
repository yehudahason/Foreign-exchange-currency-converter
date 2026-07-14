"use client";
import Image from "next/image";
import { useState } from "react";
import Chart from "./components/Chart";
import HourlyChart from "./components/HourlyChart";
import type { Rates } from "./types";
import { useQuery } from "@tanstack/react-query";
import { compareRate } from "./fetchMethods/compareRates";
import { getHourlyData } from "./fetchMethods/getHourlyData";
import { CURRENCIES } from "@/public/frankfurter_currencies";
import { POPULAR_CURRENCIES } from "@/public/popularCurrencies";
import CurrencySelect from "./components/CurrencySelect";

export default function Home() {
  const mergeObject = { ...CURRENCIES, ...POPULAR_CURRENCIES };
  const popularCurrencies = Object.keys(POPULAR_CURRENCIES);
  const othersCurrencies = Object.keys(CURRENCIES);
  const [selected, setSelected] = useState<string>("USD");
  const [selected2, setSelected2] = useState<string>("EUR");

  const country = mergeObject[selected].flag;
  const country2 = mergeObject[selected2].flag;
  const flagUrl = `https://flagcdn.com/w40/${country}.png`;
  const flagUrl2 = `https://flagcdn.com/w40/${country2}.png`;
  const rate: Rates = { base: selected, quotes: selected2, time: "1y" };
  const {
    data: rates,
    isPending: ratesLoading,
    error: ratesError,
  } = useQuery({
    queryKey: ["rates", rate.base, rate.quotes, rate.time],
    queryFn: () => compareRate(rate.time, rate),
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
    <main className="bg-[#171717] relative min-h-screen flex flex-col items-center w-full mx-auto gap-6 p-6">
      <div className="flex  items-center gap-2 h-fit overflow-hidden">
        <Image src={flagUrl} width={40} height={25} alt="state" /> /
        <Image src={flagUrl2} width={40} height={25} alt="state" />
      </div>

      <div className="flex justify-center gap-8">
        <CurrencySelect
          selected={selected}
          onChange={setSelected}
          setSelected={setSelected}
          mergeObject={mergeObject}
          popularCurrencies={popularCurrencies}
          othersCurrencies={othersCurrencies}
          left={true}
        />
        <CurrencySelect
          selected={selected2}
          onChange={setSelected2}
          setSelected={setSelected2}
          mergeObject={mergeObject}
          popularCurrencies={popularCurrencies}
          othersCurrencies={othersCurrencies}
          left={false}
        />
      </div>
      <div className="mb-8 flex items-center  gap-6 justify-between">
        <h2 className="text-3xl font-semibold tracking-wider text-white">
          {rate.base}/{rate.quotes}
        </h2>

        <div className="font-mono text-xl text-white">{rate.time}</div>
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
