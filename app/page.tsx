"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { ExchangeRate } from "./components/Chart";
import Chart from "./components/Chart";
import DailyChart from "./components/DailyChart";

type ApiResponse = {
  meta: {
    symbol: string;
    interval: string;
  };
  values: {
    datetime: string;
    open: string;
    high: string;
    low: string;
    close: string;
  }[];
};

type Rates = {
  quotes: string;
  base: string;
};

export type Currency = {
  iso_code: string;
  iso_numeric: string;
  name: string;
  symbol: string;
  start_date: string;
};

export type CurrencyList = Currency[];
import { ExchangeRateDaily } from "./components/DailyChart";
export default function Home() {
  const [data, setData] = useState<ExchangeRate[]>([]);
  const [dailyData, setDailyData] = useState<ExchangeRateDaily[]>([]);
  const [rate, setrate] = useState<Rates>({ quotes: "ILS", base: "USD" });

  async function getAllcodes() {
    const res = await fetch("https://api.frankfurter.dev/v2/currencies");
    const currencies = (await res.json()) as CurrencyList;
    console.log(currencies);
    const codes = currencies.map((item) => item.iso_code);
    console.log(codes);
  }
  async function getData() {
    try {
      const res = await fetch(
        `https://api.frankfurter.dev/v2/rates?from=2025-01-10&quotes=${rate.quotes}&base=${rate.base}`,
      );

      const data = await res.json();
      console.log(data);
      return data;
    } catch (e) {
      if (e instanceof Error) console.log(e.message);
    }
  }

  async function getHourlyData() {
    const end = new Date();
    const start = new Date(end.getTime() - 24 * 60 * 60 * 1000);

    const url = `https://api.twelvedata.com/time_series?symbol=${rate.base}/${rate.quotes}&interval=1h&start_date=${start.toISOString()}&end_date=${end.toISOString()}&apikey=${process.env.NEXT_PUBLIC_API_KEY}`;

    const res = await fetch(url);

    const data: ApiResponse = await res.json();
    console.log(data);
    return data.values
      .map((item) => ({
        time: new Date(item.datetime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        datetime: item.datetime,
        open: Number(item.open),
        high: Number(item.high),
        low: Number(item.low),
        close: Number(item.close),
      }))
      .reverse();
  }

  useEffect(() => {
    getData().then((result) => {
      if (result) {
        setData(result);
        console.log(result);
      }
    });
    getHourlyData().then((result) => {
      if (result) {
        setDailyData(result);
        console.log(result);
      }
    });
    getAllcodes();
  }, []);

  return (
    <main className="bg-[#171717] h-screen w-[300px] mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl font-semibold tracking-wider text-white">
          {rate.base}/{rate.quotes}
        </h2>

        <div className="font-mono text-sm text-zinc-400">
          0.8530 • MAY 14 16:00 CET
        </div>
      </div>
      <div className="rounded-3xl border  border-zinc-800 bg-[#171717] p-0 shadow-xl">
        <Chart data={data} />
        <DailyChart data={dailyData} />
      </div>
    </main>
  );
}
