// CurrencySelect.tsx
import { useRef, useState, useEffect, useMemo } from "react";
import CurrencyList from "./CurrencyList";
import { CurrencyMap } from "../types";

type Props = {
  selected: string;
  onChange: (code: string) => void;
  setSelected: (code: string) => void;
  mergeObject: CurrencyMap;
  popularCurrencies: string[];
  othersCurrencies: string[];
  left: boolean;
};

export default function CurrencySelect({
  selected,
  onChange,
  mergeObject,
  popularCurrencies,
  setSelected,
  othersCurrencies,
  left,
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);

  const itemsP = popularCurrencies.filter(
    (code) =>
      code.toLowerCase().includes(query.toLowerCase()) ||
      mergeObject[code].name.toLowerCase().includes(query.toLowerCase()),
  );

  const itemsO = othersCurrencies.filter(
    (code) =>
      code.toLowerCase().includes(query.toLowerCase()) ||
      mergeObject[code].name.toLowerCase().includes(query.toLowerCase()),
  );

  const filtered = useMemo(() => [...itemsP, ...itemsO], [itemsO, itemsP]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((i) => Math.min(i + 1, filtered.length - 1));
        break;

      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((i) => Math.max(i - 1, 0));
        break;

      case "Enter":
        if (highlightedIndex >= 0) {
          setSelected(filtered[highlightedIndex]);
          setOpen(false);
        }
        break;

      case "Escape":
        setOpen(false);
        break;
    }
  };

  useEffect(() => {
    if (highlightedIndex >= 0) {
      document
        .getElementById(`currency-${filtered[highlightedIndex]}`)
        ?.scrollIntoView({
          block: "nearest",
        });
    }
  }, [highlightedIndex, filtered]);
  useEffect(() => {
    const id = window.setTimeout(() => {
      if (open) {
        setHighlightedIndex(0);
        inputRef.current?.focus();
      } else {
        setHighlightedIndex(-1);
      }
    }, 0);
    return () => window.clearTimeout(id);
  }, [open]);
  return (
    <>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="currency-listbox"
        onClick={() => setOpen(!open)}
        className="relative  cursor-pointer flex items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-neutral-800 p-2 min-w-fit"
      >
        <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full">
          <img
            src={`https://flagcdn.com/${mergeObject[selected].flag}.svg`}
            alt={mergeObject[selected].name}
            className="h-full w-full object-cover"
          />
        </div>

        <span className="w-8 text-preset-4 text-neutral-50">{selected}</span>

        <img
          src="/images/icon-chevron-down.svg"
          alt=""
          className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className={`absolute top-15 ${left ? "z-30 -right-4" : "-right-4"} border border-zinc-700 w-72 rounded-xl bg-[#1b1d24] p-2`}
        >
          <label htmlFor="currency-search" className="sr-only">
            Search currencies
          </label>

          <input
            ref={inputRef}
            id="currency-search"
            role="combobox"
            aria-expanded={open}
            aria-controls="currency-listbox"
            aria-autocomplete="list"
            aria-haspopup="listbox"
            aria-activedescendant={
              highlightedIndex >= 0
                ? `currency-${filtered[highlightedIndex]}`
                : undefined
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search currencies..."
            className="w-full rounded border  border-zinc-600 bg-transparent px-3 py-3 text-preset-5 text-gray-200 focus:border-gray-400 focus:outline-none"
          />

          <ul
            id="currency-listbox"
            role="listbox"
            className={`scrollbar absolute left-0 z-10 m-0 flex max-h-80  flex-col items-center overflow-y-auto rounded-b-lg bg-[#1b1d24] px-2 pt-2 pb-4 shadow-xl border-t-0 border  border-zinc-700 w-full`}
          >
            {itemsP.length === 0 && itemsO.length === 0 && (
              <li className="flex w-full items-center justify-between border-b border-gray-700 px-4 py-2 uppercase text-gray-400">
                <span>No results</span>
                <span>0</span>
              </li>
            )}

            {itemsP.length > 0 && (
              <>
                <li className="flex w-full justify-between border-b border-gray-700 px-4 py-2 uppercase text-gray-400">
                  <span>Popular</span>
                  <span>{itemsP.length}</span>
                </li>

                <CurrencyList
                  items={itemsP}
                  selected={selected}
                  highlightedIndex={highlightedIndex}
                  mergeObject={mergeObject}
                  onSelect={(code) => {
                    onChange(code);
                    setOpen(false);
                  }}
                />
              </>
            )}

            {itemsO.length > 0 && (
              <>
                <li className="flex w-full justify-between border-b border-gray-700 px-4 py-2 uppercase text-gray-400">
                  <span>Other currencies</span>
                  <span>{itemsO.length}</span>
                </li>

                <CurrencyList
                  items={itemsO}
                  startIndex={itemsP.length}
                  selected={selected}
                  highlightedIndex={highlightedIndex}
                  mergeObject={mergeObject}
                  onSelect={(code) => {
                    onChange(code);
                    setOpen(false);
                  }}
                />
              </>
            )}
          </ul>
        </div>
      )}
    </>
  );
}
