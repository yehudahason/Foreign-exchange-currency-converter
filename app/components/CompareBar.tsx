import { useState } from "react";
import { CURRENCIES } from "@/public/frankfurter_currencies";
import { POPULAR_CURRENCIES } from "@/public/popularCurrencies";
import CurrencySelect from "./CurrencySelect";
import type { Changes, Rates } from "../types";
export const mergeObject = { ...CURRENCIES, ...POPULAR_CURRENCIES };
const popularCurrencies = Object.keys(POPULAR_CURRENCIES);
const othersCurrencies = Object.keys(CURRENCIES);

type CompareBarProps = {
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

export default function CompareBar({
  selected,
  setSelected,
  selected2,
  setSelected2,
  ratesLoading,
  changes,
  rate,
  money,
  setMoney,
}: CompareBarProps) {
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
            <label className="mb-3 block text-preset-4 uppercase tracking-[0.3em] text-zinc-300">
              Send
            </label>

            <div className="flex gap-4 items-center justify-between relative">
              <input
                type="number"
                defaultValue={1}
                className="min-w-0 no-spinner overflow-hidden text-ellipsis whitespace-nowrap  text-preset-2-bold text-white outline-none"
                onChange={(e) => setMoney(+e.target.value)}
              />

              <CurrencySelect
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
          >
            ⇄
          </button>

          {/* Receive */}
          <div className="md:col-span-8  w-full rounded-2xl border border-zinc-700 bg-neutral-600 sm:px-6 px-2 py-3">
            <label className="mb-3 block text-preset-4 uppercase tracking-[0.3em] text-zinc-300">
              Receive
            </label>

            <div className="flex flex-1 items-center justify-between relative">
              <output className=" flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap  text-preset-2-bold text-lime-400">
                {ratesLoading ? (
                  <span className="flex animate-spin h-[2rem] flex-col items-center-safe justify-center">
                    {" "}
                    <img
                      src="/spinner.png"
                      alt="loading"
                      width={160}
                      height={160}
                    />
                  </span>
                ) : (
                  (changes.last * money).toFixed(2)
                )}
              </output>

              <CurrencySelect
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
            <button className="flex gap-2 rounded-lg bg-lime-400   tracking-[3px] sm:p-3 p-2  font-semibold uppercase text-black text-preset-5-medium ">
              <span>★</span> <span>Favorited</span>
            </button>

            <button className="rounded-lg border border-lime-400 sm:p-3 font-semibold p-2 uppercase tracking-wider text-preset-5-medium text-white">
              Log Conversion
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
