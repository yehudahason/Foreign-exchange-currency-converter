import { LogsRow } from "./LogsRow";
import { COMPARE_CURRENCIES } from "../data";
import { Rates } from "../types";
import { useBaseRates } from "../fetchMethods/useBaseRates";

type CompareListProps = {
  money: number;
  rate: Rates;
};
export default function Logs({ money, rate }: CompareListProps) {
  const {
    data: comparerates,
    error,
    isPending,
    isError,
  } = useBaseRates(rate.base);
  let currencies = Object.entries(COMPARE_CURRENCIES).map(
    ([code, currency]) => {
      const choosenRate =
        comparerates?.find((item) => item.currency === code)?.rate ?? 0;

      return {
        code,
        name: currency.country,
        amount: money * choosenRate,
        choosenRate,
        favorite: false,
        flag: currency.flag,
      };
    },
  );

  //Filtering base
  currencies = currencies.filter((item) => item.code !== rate.base);
  return (
    <section className="rounded-3xl w-full max-w-6xl border border-zinc-800 bg-[#151515] sm:p-6 p-2">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <h2 className="flex flex-col gap-2 sm:flex-row">
          <span className="uppercase sm:text-preset-3-medium px-2 text-preset-5 uppercase tracking-[0.3em] text-white">
            Conversion log
          </span>
        </h2>

        <span className="text-preset-5 uppercase tracking-[0.25em] text-zinc-500">
          {currencies.length} Pairs
        </span>
      </div>

      <div className="space-y-4">
        {currencies.map((currency) => (
          <LogsRow
            key={currency.code}
            money={money}
            {...currency}
            rate={rate}
          />
        ))}
      </div>
    </section>
  );
}
