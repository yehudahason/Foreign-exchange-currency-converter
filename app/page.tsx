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
import { ExchangeRateDaily } from "./components/DailyChart";
export default function Home() {
  const [data, setData] = useState<ExchangeRate[]>([]);
  const [dailyData, setDailyData] = useState<ExchangeRateDaily[]>([]);
  async function getData() {
    try {
      const res = await fetch(
        "https://api.frankfurter.dev/v2/rates?from=2026-07-01&quotes=USD&base=EUR",
      );

      const data = await res.json();
      return data;
    } catch (e) {
      if (e instanceof Error) console.log(e.message);
    }
  }

  async function getHourlyData() {
    const res = await fetch(
      `https://api.twelvedata.com/time_series?symbol=EUR/USD&interval=1h&apikey=${process.env.NEXT_PUBLIC_API_KEY}`,
    );

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
      .slice(2, 24)
      .reverse();
  }

  useEffect(() => {
    getData().then((result) => {
      if (result) {
        setData(result);
      }
    });
    getHourlyData().then((result) => {
      if (result) {
        setDailyData(result);
      }
    });
  }, []);

  return (
    <main className="bg-[#171717] h-screen">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl font-semibold tracking-wider text-white">
          USD/EUR
        </h2>

        <div className="font-mono text-sm text-zinc-400">
          0.8530 • MAY 14 16:00 CET
        </div>
      </div>
      <div className="rounded-3xl border border-zinc-800 bg-[#171717] p-8 shadow-xl">
        <Chart data={data} />
        <DailyChart data={dailyData} />
      </div>
    </main>
  );
}
