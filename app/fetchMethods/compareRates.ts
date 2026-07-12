import type { Rates } from "../types";

function formatUTCDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
export async function compareRate(long: string, rate: Rates) {
  const today = new Date();

  switch (long) {
    case "1d":
      today.setDate(today.getDate() - 1);
      break;
    case "1w":
      today.setDate(today.getDate() - 7);
      break;
    case "1m":
      today.setMonth(today.getMonth() - 1);
      break;
    case "3m":
      today.setMonth(today.getMonth() - 3);
      break;
    case "1y":
      today.setFullYear(today.getFullYear() - 1);
      break;
    case "5y":
      today.setFullYear(today.getFullYear() - 5);
      break;
  }

  const from = formatUTCDate(today);

  const res = await fetch(
    `https://api.frankfurter.dev/v2/rates?from=${from}&base=${rate.base}&quotes=${rate.quotes}`,
  );

  if (!res.ok) {
    throw new Error("Failed to fetch rates");
  }

  return res.json();
}
