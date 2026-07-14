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
import CurrencySelect from "./components/CurrencySelect";
import { useBaseRates } from "./fetchMethods/useBaseRates";

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
  const rate: Rates = { base: selected, quotes: selected2, time: "1d" };
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
    queryKey: ["hourly", rate.base, rate.quotes, rate.time],
    queryFn: () => getHourlyData(rate),
    enabled: rate.base !== rate.quotes,
  });

  const { data: todayrates, error, isPending, isError } = useBaseRates("USD");

  return (
    <>
      <header className="bg-neutral-900 w-full">
        <div className="flex items-center text-neutral-200 justify-between p-6 uppercase text-preset-4">
          <Image src="/images/logo.svg" alt="" width={130} height={60} />
          <span>165 Currencies · EOD · ECB data</span>
        </div>

        <div className="flex w-full overflow-x-hidden">
          <div className="flex items-center w-32 text-preset-5-medium text-gray-900 uppercase bg-yellow-200 px-2 py-3">
            Live markets
          </div>
          <div className="bg-neutral-700 overflow-hidden whitespace-nowrap w-full text-preset-5">
            {isError && (
              <span className="text-white text-preset-5  py-2 w-full flex justify-center items-center h-full">
                {(error as Error).message}
              </span>
            )}
            <ul className="flex items-center w-max animate-marquee">
              {isPending
                ? ""
                : todayrates?.map((item) => {
                    const percentChange = item.percentChange ?? 0;
                    return (
                      <li
                        key={item.currency}
                        className="flex gap-3 shrink-0 px-2 py-3 text-gray-100"
                      >
                        <span>USD/{item.currency}</span>
                        <span>{item.rate.toFixed(2)}</span>
                        <span
                          className={`flex ${percentChange >= 0 ? " text-green-500" : "text-red-500"} justify-between items-center gap-1`}
                        >
                          <Image
                            className={`w-4 h-full ${percentChange >= 0 ? "green rotate-180" : "red"}`}
                            src="/images/icon-chevron-down.svg"
                            alt=""
                            width={16}
                            height={16}
                          />
                          {percentChange.toFixed(2)}%
                        </span>
                      </li>
                    );
                  })}
            </ul>
          </div>
        </div>
      </header>
      <main className="bg-neutral-900 relative min-h-screen flex flex-col items-center w-full mx-auto gap-6 p-6">
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
            <Chart data={rates ?? []} range={rate.time} />
          )}
          {ratesError ? ratesError.message : ""}
          {rate.base === rate.quotes ? (
            ""
          ) : hourlyLoading ? (
            <span className="flex animate-spin h-25 flex-col items-center-safe justify-center">
              <Image src="/spinner.png" alt="" height={80} width={80} />
            </span>
          ) : (
            <HourlyChart data={hourlyData ?? []} />
          )}
          {hourlyError ? hourlyError.message : ""}
        </div>
      </main>
    </>
  );
}
