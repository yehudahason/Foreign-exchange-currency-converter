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
        const isSelected = selected === code;
        const isHighlighted = highlightedIndex === realIndex;

        return (
          <li
            key={code}
            id={`currency-option-${code}`}
            role="option"
            aria-selected={isSelected}
            className={`flex cursor-pointer items-center justify-between rounded px-4 py-3 border-2 ${
              isHighlighted
                ? "border-gray-500 bg-zinc-800"
                : "border-[#1b1d24] hover:border-gray-500"
            }`}
            onClick={() => onSelect(code)}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full">
                <img
                  src={`https://flagcdn.com/${mergeObject[code]?.flag}.svg`}
                  alt=""
                  aria-hidden="true"
                  className="h-full w-full object-cover"
                />
              </div>

              <span className="w-7 text-preset-4 text-white">{code}</span>

              <span className="truncate text-preset-5 text-zinc-400">
                {mergeObject[code]?.name}
              </span>
            </div>

            {isSelected && (
              <img
                src="/images/icon-check.svg"
                alt="Selected"
                className="h-4 w-4"
              />
            )}
          </li>
        );
      })}
    </>
  );
}
