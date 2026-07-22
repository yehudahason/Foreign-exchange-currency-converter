import { useState } from "react";
import { CURRENCIES } from "@/app/data/frankfurter_currencies";
import { POPULAR_CURRENCIES } from "@/app/data/popularCurrencies";
import CurrencySelect from "./CurrencySelect";
import type { Changes, Rates } from "../types";
import { mergeObject } from "../data";

const popularCurrencies = Object.keys(POPULAR_CURRENCIES);
const othersCurrencies = Object.keys(CURRENCIES);

type TopCompareBarProps = {
  selected: string;
  setSelected: (rate: string) => void;
  selected2: string;
  setSelected2: (rate: string) => void;
  ratesLoading: boolean;
  changes: Changes;
  rate: Rates;
  money: number;
  setMoney: (money: number) => void;
};

export default function TopCompareBar({
  selected,
  setSelected,
  selected2,
  setSelected2,
  ratesLoading,
  changes,
  rate,
  money,
  setMoney,
}: TopCompareBarProps) {
  //Switch currencies
  function handleSwitch() {
    const [a, b] = [selected, selected2];
    setSelected(b);
    setSelected2(a);
  }
  //The amount of money

  return (
    <section className="max-w-6xl mx-auto w-full">
      <h2 className="mb-6 text-preset-2 text-neutral-50 uppercase tracking-widest">
        Check the Rate
      </h2>

      <div className="rounded-3xl w-full bg-zinc-900 sm:px-4 py-4 px-2 shadow-2xl">
        {/* Top */}
        <div className="md:grid md:grid-cols-18 flex items-center md:place-items-center flex-col gap-6">
          {/* Send */}
          <div className="col-span-8 w-full rounded-2xl border border-zinc-700 bg-neutral-600  sm:px-6 px-2 py-3">
            <label
              htmlFor="send-amount"
              className="mb-3 block text-preset-4 uppercase tracking-[0.3em] text-zinc-300"
            >
              Send
            </label>

            <div className="flex gap-4 items-center justify-between relative">
              <input
                id="send-amount"
                type="number"
                defaultValue={1}
                className="min-w-0 no-spinner overflow-hidden text-ellipsis whitespace-nowrap  text-preset-2-bold text-white outline-none"
                onChange={(e) => setMoney(+e.target.value)}
              />

              <CurrencySelect
                aria-label="Send currency"
                selected={selected}
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
            aria-label="Swap currencies"
          >
            ⇄
          </button>

          {/* Receive */}
          <div className="md:col-span-8  w-full rounded-2xl border border-zinc-700 bg-neutral-600 sm:px-6 px-2 py-3">
            <label
              htmlFor="receive-amount"
              className="mb-3 block text-preset-4 uppercase tracking-[0.3em] text-zinc-300"
            >
              Receive
            </label>

            <div className="flex flex-1 items-center justify-between relative">
              {ratesLoading ? (
                <div
                  role="status"
                  aria-live="polite"
                  className="flex animate-spin h-[2rem] flex-col items-center-safe justify-center"
                >
                  <img
                    src="/spinner.png"
                    alt=""
                    aria-hidden="true"
                    width={160}
                    height={160}
                  />
                  <span className="sr-only">Calculating conversion...</span>
                </div>
              ) : (
                <output
                  id="receive-amount"
                  aria-live="polite"
                  aria-atomic="true"
                  className=" flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap  text-preset-2-bold text-lime-400"
                >
                  {(changes.last * money).toFixed(2)}
                </output>
              )}

              <CurrencySelect
                aria-label="Receive currency"
                selected={selected2}
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
        <div className="my-3 border-t border-dashed border-zinc-700" />

        {/* Bottom */}
        <div className="flex items-center sm:flex-row flex-col gap-3 justify-between">
          <p className="text-preset-2 text-zinc-300">
            1 {rate.base} = {changes.last} {rate.quotes}
          </p>

          <div className="flex  gap-4  ">
            <button
              type="button"
              className="outline-0 focus:outline-3  focus:outline-amber-200 flex gap-2 rounded-lg bg-lime-400   tracking-[3px] sm:p-3 p-2  font-semibold uppercase text-black text-preset-5-medium  items-center"
            >
              <span>
                <img
                  className="invert-0 brightness-0"
                  src="/images/icon-star.svg"
                  alt=""
                  aria-hidden="true"
                />
              </span>{" "}
              <span>Favorited</span>
            </button>

            <button
              type="button"
              className="rounded-lg outline-0 focus:outline-2  focus:outline-amber-200 border border-lime-400 sm:p-3 font-semibold p-2 uppercase tracking-wider text-preset-5-medium text-white"
            >
              Log Conversion
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
