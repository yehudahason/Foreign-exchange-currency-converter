import { CompareRow } from "./ComapreRow";
import { COMPARE_CURRENCIES } from "../data";
import { ExchangeRate, Rates } from "../types";
import { useBaseRates } from "../fetchMethods/useBaseRates";
const currencies2 = [
  {
    code: "GBP",
    name: "British Pound",
    amount: "736.65",
    rate: "0.7366",
    favorite: true,
    flag: "🇬🇧",
  },
];

type CompareListProps = {
  money: number;
  rate: Rates;
};
export default function CompareBottom({ money, rate }: CompareListProps) {
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
          <span className=" sm:text-preset-4 px-2 text-preset-5 uppercase tracking-[0.3em] text-zinc-500">
            Multi-Currency{" "}
          </span>

          <span className="ml-2 text-preset-3-medium text-white ">
            {money} FROM {rate.base}
          </span>
        </h2>

        <span className="text-preset-5 uppercase tracking-[0.25em] text-zinc-500">
          {currencies.length} Pairs
        </span>
      </div>

      <div className="space-y-4">
        {currencies.map((currency) => (
          <CompareRow key={currency.code} {...currency} />
        ))}
      </div>
    </section>
  );
}
