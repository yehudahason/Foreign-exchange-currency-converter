import { CurrencyMap } from "../types";

type CurrencyListProps = {
  items: string[];
  startIndex?: number;
  selected: string;
  highlightedIndex: number;
  mergeObject: CurrencyMap;
  onSelect: (code: string) => void;
};

export default function CurrencyList({
  items,
  startIndex = 0,
  selected,
  highlightedIndex,
  mergeObject,
  onSelect,
}: CurrencyListProps) {
  return (
    <>
      {items.map((code, index) => {
        const realIndex = startIndex + index;

        return (
          <li
            key={code}
            id={`currency-${code}`}
            role="option"
            aria-selected={selected === code}
            tabIndex={-1}
            className="w-full"
          >
            <button
              onClick={() => onSelect(code)}
              className={` relative w-full cursor-pointer rounded border-2 border-[#1b1d24] px-4 py-3 ${
                highlightedIndex === realIndex
                  ? "border-gray-500"
                  : "hover:border-gray-500"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full">
                  <img
                    src={`https://flagcdn.com/${mergeObject[code].flag}.svg`}
                    alt=""
                    aria-hidden="true"
                    className="h-full w-full object-cover"
                  />
                </div>

                <span className="w-7 text-preset-4 text-white">{code}</span>

                <span className="truncate text-preset-5 text-zinc-400">
                  {mergeObject[code].name}
                </span>

                {selected === code && (
                  <img
                    src="/images/icon-check.svg"
                    alt=""
                    aria-hidden="true"
                    className="absolute right-2"
                  />
                )}
              </div>
            </button>
          </li>
        );
      })}
    </>
  );
}
