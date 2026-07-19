"use client";
import Image from "next/image";
import { useMemo, useState } from "react";
import Chart from "./components/Chart";
import type { ExchangeRate, Rates, ChartRange, Changes } from "./types";
import { useQuery } from "@tanstack/react-query";
import { compareRate } from "./fetchMethods/compareRates";

import { useBaseRates } from "./fetchMethods/useBaseRates";
import { downsample } from "./utils/downsample";
import Header from "./components/Header";
import NavBar from "./components/NavBar";
import ChangeBar from "./components/ChangeBar";
import CompareBar from "./components/CompareBar";
import { formatBerlinTime } from "./utils/formatBerlinTime";

export default function Home() {
  const [selected, setSelected] = useState<string>("USD");
  const [selected2, setSelected2] = useState<string>("EUR");
  const [time, setTime] = useState<ChartRange>("1W");

  const rate = useMemo(
    () => ({ base: selected, quotes: selected2, time }) as Rates,
    [selected, selected2, time],
  );

  //Now CET date
  const formatted = formatBerlinTime();

  //today USD  banner rates
  const { data: todayrates, error, isPending, isError } = useBaseRates("USD");

  //The Choosen rate
  const {
    data,
    isPending: ratesLoading,
    error: ratesError,
  } = useQuery({
    queryKey: ["rates", rate],
    queryFn: () => compareRate(rate.time, rate),
  });

  //Setting for Times
  const rates = useMemo(() => {
    if (!data) return [];

    if (rate.time === "1D") {
      return data.slice(-2);
    } else if (rate.time === "5Y" || rate.time === "1Y") {
      return downsample(data, 180);
    } else {
      return data;
    }
  }, [data, rate.time]);

  //Changes
  const changes = useMemo<Changes>(() => {
    if (ratesLoading || rates.length === 0) {
      return {
        open: 0,
        last: 0,
        change: 0,
        percent: 0,
      };
    }

    const first = rates[0].rate;
    const last = rates[rates.length - 1].rate;
    const percent = first !== 0 ? ((last - first) / first) * 100 : 0;

    return {
      open: first,
      last,
      change: last - first,
      percent,
    };
  }, [ratesLoading, rates]);

  //Unique  years ticks for 3y 5y
  const ticks = useMemo(() => {
    if (!ratesLoading) {
      if (rate.time !== "3Y" && rate.time !== "5Y") return undefined;

      const seen = new Set<number>();

      return rates
        .filter((item: ExchangeRate) => {
          const year = new Date(item.date).getUTCFullYear();

          if (seen.has(year)) return false;
          seen.add(year);
          return true;
        })
        .map((item: ExchangeRate) => item.date);
    }
  }, [rate, rates, ratesLoading]);

  return (
    <>
      <Header
        isPending={isPending}
        isError={isError}
        error={error}
        todayrates={todayrates ?? []}
      />
      <main className="bg-neutral-900 relative min-h-screen flex flex-col items-center w-full mx-auto gap-4 sm:p-6 px-2 py-6">
        <CompareBar
          selected={selected}
          setSelected={setSelected}
          selected2={selected2}
          setSelected2={setSelected2}
          ratesLoading={ratesLoading}
          changes={changes}
          rate={rate}
        />

        <NavBar />
        <ChangeBar rate={rate} setTime={setTime} changes={changes} />

        <div className="bg-neutral-900 rounded-3xl border h-fit mx-auto max-w-6xl  w-full border-zinc-800  sm:p-5 p-3 shadow-xl text-amber-200">
          <div className="flex justify-between">
            <h2 className="text-preset-3-medium  tracking-wider text-white">
              {rate.base}/{rate.quotes}
            </h2>

            <div className="text-zinc-300 ml-4 text-preset-5 flex  gap-3 items-center">
              {changes.last}
              <div className="size-1 rounded-full bg-zinc-300" />
              {formatted}
            </div>
          </div>
          {ratesLoading ? (
            <span className="flex animate-spin h-[20rem] flex-col items-center-safe justify-center">
              {" "}
              <Image
                src="/spinner.png"
                alt="loading"
                width={160}
                height={160}
              />
            </span>
          ) : (
            <Chart ticks={ticks} data={rates ?? []} range={rate.time} />
          )}
          {ratesError ? ratesError.message : ""}
        </div>
      </main>
    </>
  );
}
