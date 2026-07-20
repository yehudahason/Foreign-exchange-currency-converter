import { StarIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutline } from "@heroicons/react/24/outline";
type CurrencyRowProps = {
  flag: string;
  code: string;
  name: string;
  amount: number;
  rate: number;
  favorite: boolean;
};

export function CompareRow({
  flag,
  code,
  name,
  rate,
  favorite,
  amount,
}: CurrencyRowProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-[#1e1e1f] px-5 py-4 transition hover:border-zinc-700">
      {/* Left */}
      <div className="flex items-center gap-4">
        <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full">
          <img
            src={`https://flagcdn.com/${flag}.svg`}
            alt={name}
            className="h-full w-full object-cover"
          />
        </div>

        <div>
          <h3 className="text-preset-4 mb-2 tracking-widest text-white">
            {code}
          </h3>

          <p className="text-preset-5 tracking-wide text-zinc-500">{name}</p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-6">
        <div className="text-right">
          <div className="mt-1 text-preset-3 text-white">
            {amount.toFixed(2)}
          </div>
          <div className="mt-2 text-sm text-zinc-500">@ {rate}</div>
        </div>

        <button
          className={`flex h-11 w-11 items-center justify-center rounded-xl border transition ${
            favorite
              ? "border-lime-400 text-lime-400"
              : "border-zinc-700 text-zinc-500 hover:border-zinc-500"
          }`}
        >
          {favorite ? (
            <StarIcon className="h-5 w-5" />
          ) : (
            <StarOutline className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );
}
