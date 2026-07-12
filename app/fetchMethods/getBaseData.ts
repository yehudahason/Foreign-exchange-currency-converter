import type { Rates } from "../types";

export async function getBaseData(rate: Rates) {
  try {
    const res = await fetch(
      `https://api.frankfurter.dev/v2/rates?base=${rate.base}`,
    );

    const data = await res.json();
    console.log(data);
    return data;
  } catch (e) {
    if (e instanceof Error) console.log(e.message);
  }
}
