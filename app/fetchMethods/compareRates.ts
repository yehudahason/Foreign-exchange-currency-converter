import type { Rates } from "../types";

function formatUTCDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
export async function compareRate(time: string, rate: Rates) {
  const today = new Date();

  switch (time) {
    case "1D":
    case "1W":
      today.setDate(today.getDate() - 7);
      break;
    case "1M":
      today.setDate(today.getDate() - 30);
      break;
    case "3M":
      today.setMonth(today.getMonth() - 3);
      break;
    case "1Y":
      today.setFullYear(today.getFullYear() - 1);
      break;
    case "3Y":
      today.setFullYear(today.getFullYear() - 3);
      break;
    case "5Y":
      today.setFullYear(today.getFullYear() - 5);
      break;
  }

  const from = formatUTCDate(today);

  const res = await fetch(
    `/api/rates?base=${rate.base}&quote=${rate.quotes}&from=${from}`,
  );

  if (!res.ok) {
    throw new Error("Failed to fetch rates");
  }

  const log = await res.json();
  console.log(log);
  return log;
}
