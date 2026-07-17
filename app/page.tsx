"use client";
import Image from "next/image";
import { useMemo, useState } from "react";
import { rangesArr, Changes } from "./types";
import Chart from "./components/Chart";
import type { ExchangeRate, Rates, ChartRange } from "./types";
import { useQuery } from "@tanstack/react-query";
import { compareRate } from "./fetchMethods/compareRates";
import { CURRENCIES } from "@/public/frankfurter_currencies";
import { POPULAR_CURRENCIES } from "@/public/popularCurrencies";
import CurrencySelect from "./components/CurrencySelect";
import { useBaseRates } from "./fetchMethods/useBaseRates";
import { downsample } from "./utils/downsample";

export default function Home() {
  const mergeObject = { ...CURRENCIES, ...POPULAR_CURRENCIES };
  const popularCurrencies = Object.keys(POPULAR_CURRENCIES);
  const othersCurrencies = Object.keys(CURRENCIES);
  const [selected, setSelected] = useState<string>("USD");
  const [selected2, setSelected2] = useState<string>("EUR");
  const [time, setTime] = useState<ChartRange>("1W");
  const [money, setMoney] = useState<number>(1);
  const country = mergeObject[selected].flag;
  const country2 = mergeObject[selected2].flag;
  const flagUrl = `https://flagcdn.com/w40/${country}.png`;
  const flagUrl2 = `https://flagcdn.com/w40/${country2}.png`;
  const rate = useMemo(
    () => ({ base: selected, quotes: selected2, time }) as Rates,
    [selected, selected2, time],
  );

  //Switch currencies
  function handleSwitch() {
    const [a, b] = [selected, selected2];
    setSelected(b);
    setSelected2(a);
  }

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

    return {
      open: first,
      last,
      change: last - first,
      percent: ((last - first) / first) * 100,
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

  //today USD  banner rates

  const { data: todayrates, error, isPending, isError } = useBaseRates("USD");

  return (
    <>
      <header className="bg-neutral-900 w-full">
        <div className="flex items-center gap-2 text-neutral-200 justify-between sm:p-6  px-3 py-6 uppercase sm:text-preset-4  text-preset-6">
          <Image src="/images/logo.svg" alt="" width={130} height={40} />
          <span>165 Currencies · EOD · ECB data</span>
        </div>

        <div className="flex w-full overflow-x-hidden">
          <div className="flex w-32 shrink-0 gap-2 items-center justify-center whitespace-nowrap bg-lime-500 p-1 uppercase text-gray-900 sm:px-2 sm:py-3 text-preset-5-medium">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-current"></span>{" "}
            Live markets
          </div>
          <div className="bg-neutral-700 overflow-hidden whitespace-nowrap w-full text-preset-5">
            {isError && (
              <span className="text-white text-preset-5  py-2 w-full flex justify-center items-center h-full">
                {(error as Error).message}
              </span>
            )}
            <ul className="flex items-center w-max animate-marquee ">
              {isPending
                ? ""
                : todayrates?.map((item) => {
                    const percentChange = item.percentChange ?? 0;
                    return (
                      <li
                        key={item.currency}
                        className="flex gap-2 border-x border-gray-800 shrink-0 px-3 py-3 text-gray-100"
                      >
                        <span>USD/{item.currency}</span>
                        <span>{item.rate.toFixed(3)}</span>
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
                          {percentChange.toFixed(3)}%
                        </span>
                      </li>
                    );
                  })}
            </ul>
          </div>
        </div>
      </header>
      <main className="bg-neutral-900 relative min-h-screen flex flex-col items-center w-full mx-auto gap-6 sm:p-6 px-2 py-6">
        <section className="max-w-7xl mx-auto w-full">
          <h2 className="mb-6 text-preset-2 text-neutral-50 uppercase tracking-widest">
            Check the Rate
          </h2>

          <div className="rounded-3xl w-full bg-zinc-900 sm:p-6 py-4 px-2 shadow-2xl">
            {/* Top */}
            <div className="md:grid md:grid-cols-18 flex items-center md:place-items-center flex-col gap-6">
              {/* Send */}
              <div className="col-span-8 w-full rounded-2xl border border-zinc-700 bg-neutral-600 sm:p-6 px-2 py-6">
                <label className="mb-4 block text-preset-4 uppercase tracking-[0.3em] text-zinc-400">
                  Send
                </label>

                <div className="flex gap-4 items-center justify-between relative">
                  <input
                    type="number"
                    defaultValue={1}
                    className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap  text-preset-2-bold text-white outline-none"
                    onChange={(e) => setMoney(+e.target.value)}
                  />

                  <CurrencySelect
                    selected={selected}
                    onChange={setSelected}
                    setSelected={setSelected}
                    mergeObject={mergeObject}
                    popularCurrencies={popularCurrencies}
                    othersCurrencies={othersCurrencies}
                    left={true}
                  />
                </div>
              </div>

              {/* Swap */}
              <button
                className="flex col-span-2 h-14 w-14 items-center justify-center rounded-xl border border-zinc-700 bg-neutral-600 text-3xl text-white cursor-pointer md:rotate-0 rotate-90"
                type="button"
                onClick={() => handleSwitch()}
              >
                ⇄
              </button>

              {/* Receive */}
              <div className="md:col-span-8  w-full rounded-2xl border border-zinc-700 bg-neutral-600 sm:p-6 px-2 py-6">
                <label className="mb-4 block text-preset-4 uppercase tracking-[0.3em] text-zinc-400">
                  Receive
                </label>

                <div className="flex flex-1 items-center justify-between relative">
                  <output className=" flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap  text-preset-2-bold text-lime-400">
                    {(changes.last * money).toFixed(2)}
                  </output>

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
              </div>
            </div>

            {/* Divider */}
            <div className="my-6 border-t border-dashed border-zinc-700" />

            {/* Bottom */}
            <div className="flex items-center sm:flex-row flex-col gap-3 justify-between">
              <p className="text-preset-2 text-zinc-300">
                1 {rate.base} = {changes.last} {rate.quotes}
              </p>

              <div className="flex  gap-4  ">
                <button className="flex gap-2 rounded-lg bg-lime-400 sm:px-3 px-1 tracking-[3px]  py-3  font-semibold uppercase text-black text-preset-5-medium ">
                  <span>★</span> <span>Favorited</span>
                </button>

                <button className="rounded-lg border border-lime-400 sm:p-3 p-1 font-semibold uppercase tracking-wider text-preset-5-medium text-white">
                  Log Conversion
                </button>
              </div>
            </div>
          </div>
        </section>
        <div className="flex  items-center gap-2 h-fit overflow-hidden">
          <Image src={flagUrl} width={40} height={25} alt="state" /> /
          <Image src={flagUrl2} width={40} height={25} alt="state" />
        </div>

        <div className="flex justify-center gap-8"></div>
        <div className="mb-8 flex items-center  gap-6 justify-between">
          <h2 className="text-3xl font-semibold tracking-wider text-white">
            {rate.base}/{rate.quotes}
          </h2>
          <div className="flex items-center sm:flex-row flex-wrap gap-2">
            {rangesArr.map((range) => (
              <button
                type="button"
                onClick={() => setTime(range)}
                key={range}
                className={`text-amber-200 cursor-pointer rounded-md px-3 py-1 text-sm ${range === rate.time ? "bg-gray-500" : "bg-gray-800"} font-medium `}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
        {!ratesLoading && (
          <div className="flex text-amber-100 flex-wrap uppercase gap-5 text-xl">
            <span className="flex gap-2 bg-gray-800 rounded-lg p-3">
              Open : {changes.open.toFixed(4)}
            </span>
            <span className="flex gap-2 bg-gray-800 rounded-lg p-3">
              Last : {changes.last.toFixed(4)}
            </span>
            <span className="flex gap-2 bg-gray-800 rounded-lg p-3">
              CHange : {changes.change.toFixed(4)}{" "}
            </span>
            <span className="flex gap-2 bg-gray-800 rounded-lg p-3">
              % CHANGE : {changes.percent.toFixed(4)}
            </span>
          </div>
        )}
        <div className="bg-[#171717] rounded-3xl border h-fit mx-auto max-w-3xl  w-full border-zinc-800  p-4 shadow-xl text-amber-200">
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
