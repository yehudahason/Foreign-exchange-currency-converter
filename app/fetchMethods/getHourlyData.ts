import { ApiResponse } from "../types";
import type { Rates } from "../types";
export async function getHourlyData(rate: Rates) {
  const end = new Date();
  const start = new Date(end.getTime() - 24 * 60 * 60 * 1000);
  if (rate.base === rate.quotes) {
    return;
  }
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
