"use client";
import Image from "next/image";

import { useEffect, useState, useRef } from "react";
import Chart from "./components/Chart";
import HourlyChart from "./components/HourlyChart";
import type { Rates } from "./types";
import { useQuery } from "@tanstack/react-query";
import { compareRate } from "./fetchMethods/compareRates";
import { getHourlyData } from "./fetchMethods/getHourlyData";
import { CURRENCIES } from "@/public/frankfurter_currencies";
import { POPULAR_CURRENCIES } from "@/public/popularCurrencies";
export default function Home() {
  const [rate, setrate] = useState<Rates>({ quotes: "ILS", base: "USD" });
  const mergeObject = { ...CURRENCIES, ...POPULAR_CURRENCIES };
  const popularCurrencies = Object.keys(POPULAR_CURRENCIES);
  const othersCurrencies = Object.keys(CURRENCIES);
  const [query, setQuery] = useState<string>("");
  const [selected, setSelected] = useState<string>("USD");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const itemsO = othersCurrencies.filter((c) =>
    c.toLowerCase().includes(query.toLowerCase()),
  );
  const itemsP = popularCurrencies.filter((c) =>
    c.toLowerCase().includes(query.toLowerCase()),
  );
  const filtered = [...itemsP, ...itemsO];

  const country = mergeObject[rate.base].flag;
  const country2 = mergeObject[rate.quotes].flag;
  const flagUrl = `https://flagcdn.com/w40/${country}.png`;
  const flagUrl2 = `https://flagcdn.com/w40/${country2}.png`;

  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((i) => Math.min(i + 1, filtered.length - 1));
        break;

      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((i) => Math.max(i - 1, 0));
        break;

      case "Enter":
        if (highlightedIndex >= 0) {
          setSelected(filtered[highlightedIndex]);
        }
        break;

      case "Escape":
        setOpen(false);
        break;
    }
  };

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
    if (highlightedIndex >= 0) {
      document
        .getElementById(`currency-${filtered[highlightedIndex]}`)
        ?.scrollIntoView({
          block: "nearest",
        });
    }
  }, [highlightedIndex, filtered]);
  useEffect(() => {
    const id = window.setTimeout(() => {
      if (open) {
        setHighlightedIndex(0);
        inputRef.current?.focus();
      } else {
        setHighlightedIndex(-1);
      }
    }, 0);
    return () => window.clearTimeout(id);
  }, [open]);
  return (
    <main className="bg-[#171717] relative min-h-screen flex flex-col items-center w-full mx-auto">
      <div className="flex  items-center gap-2 h-fit overflow-hidden">
        <Image src={flagUrl} width={40} height={25} alt="state" /> /
        <Image src={flagUrl2} width={40} height={25} alt="state" />
      </div>

      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="currency-listbox"
        onClick={() => setOpen(!open)}
        className="flex justify-center items-center  p-2 bg-neutral-800  gap-2 rounded-lg border border-neutral-600"
      >
        {" "}
        <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full">
          <img
            src={`https://flagcdn.com/${mergeObject[selected]?.flag}.svg`}
            alt={mergeObject[selected]?.name}
            className="h-full w-full object-cover"
          />
        </div>
        <span className="w-8 text-preset-4  text-neutral-50">{selected}</span>
        <img
          src="/images/icon-chevron-down.svg"
          alt=""
          className={`${open ? "rotate-180" : ""}  w-4 h-4 transition`}
        />
      </button>
      {open && (
        <div className="absolute  top-20 w-72 p-2 bg-[#1b1d24]  rounded-xl">
          <label htmlFor="currency-search" className="sr-only">
            Search currencies
          </label>
          <input
            ref={inputRef}
            onKeyDown={handleKeyDown}
            id="currency-search"
            role="combobox"
            aria-expanded={open}
            aria-controls="currency-listbox"
            aria-autocomplete="list"
            aria-haspopup="listbox"
            aria-activedescendant={
              highlightedIndex >= 0
                ? `currency-${filtered[highlightedIndex]}`
                : undefined
            }
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            placeholder="Search currencies ..."
            className="w-full rounded border border-zinc-600 bg-transparent px-3 py-2 text-preset-5 text-gray-200 focus:border-gray-400 focus:outline-none"
          />

          <ul
            id="currency-listbox"
            role="listbox"
            className="absolute z-10 mt-0  pb-2 max-h-80 w-full overflow-y-auto rounded-b-lg bg-[#1b1d24] text-yellow-100 shadow-xl scrollbar left-0 flex flex-col items-center"
          >
            <li className="uppercase  w-full flex justify-between items-center font-medium py-2 px-4 text-gray-400 border-b border-b-gray-700">
              <span className="text-preset-5-medium">Popular</span>
              <span className="text-preset-5-medium">
                {popularCurrencies.length}
              </span>
            </li>
            {itemsP.map((code, index) => (
              <li
                key={code}
                id={`currency-${code}`}
                role="option"
                aria-selected={selected === code}
                tabIndex={-1}
                className={`  cursor-pointer w-full focus:border relative `}
              >
                <button
                  className={` ${highlightedIndex === index ? " border border-gray-500" : ""} cursor-pointer w-full focus:border relative px-3 py-4  hover:bg-gray-800`}
                  onClick={() => {
                    setSelected(code);
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full">
                      <img
                        src={`https://flagcdn.com/${mergeObject[code].flag}.svg`}
                        aria-hidden="true"
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <span className="w-7 text-preset-4 text-white">{code}</span>

                    <span className="truncate text-preset-5 text-zinc-400">
                      {mergeObject[code].name}
                    </span>
                    <img
                      className={`${selected === code ? "" : "hidden "}  absolute right-2 z-20`}
                      src="/images/icon-check.svg"
                      alt=""
                      aria-hidden="true"
                    />
                  </div>
                </button>
              </li>
            ))}
            <li className="flex justify-between w-full uppercase font-medium py-2 px-4 text-gray-400  border-b border-b-gray-700">
              <span className="text-preset-5-medium">Others Currencies </span>
              <span className="text-preset-5-medium">
                {othersCurrencies.length}
              </span>
            </li>
            {itemsO.map((code, index) => {
              const realIndex = itemsP.length + index;
              return (
                <li
                  role="option"
                  aria-selected={selected === code}
                  id={`currency-${code}`}
                  key={code}
                  tabIndex={-1}
                  className={`cursor-pointer w-full relative  hover:bg-gray-800 `}
                >
                  <button
                    onClick={() => {
                      setSelected(code);
                    }}
                    className={`${highlightedIndex === realIndex ? "border border-gray-600" : ""}  cursor-pointer w-full relative px-4 py-3 hover:bg-gray-800 focus:border rounded`}
                  >
                    <div className=" flex items-center gap-4">
                      <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full">
                        <img
                          src={`https://flagcdn.com/${mergeObject[code].flag}.svg`}
                          aria-hidden="true"
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <span className="w-7 text-preset-4 text-white">
                        {code}
                      </span>

                      <span className="truncate text-preset-5 text-zinc-400">
                        {mergeObject[code].name}
                      </span>
                      <img
                        className={`${selected === code ? "" : "hidden "} block absolute right-2 z-20`}
                        src="/images/icon-check.svg"
                        alt=""
                        aria-hidden="true"
                      />
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
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
