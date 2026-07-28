// CurrencySelect.tsx
import { useRef, useState, useEffect, useMemo, useId } from "react";
import CurrencyList from "./CurrencyList";
import { CurrencyMap } from "../types";

type Props = {
  "aria-label": string;
  selected: string;
  setSelected: (code: string) => void;
  mergeObject: CurrencyMap;
  popularCurrencies: string[];
  othersCurrencies: string[];
  left: boolean;
};

export default function CurrencySelect({
  selected,
  mergeObject,
  popularCurrencies,
  setSelected,
  othersCurrencies,
  left,
  "aria-label": ariaLabel,
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);

  const id = useId();
  const searchId = `${id}-currency-search`;
  const listboxId = `${id}-currency-listbox`;

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

  const filtered = useMemo(() => [...itemsP, ...itemsO], [itemsP, itemsO]);

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
    const timer = window.setTimeout(() => {
      if (open) {
        setHighlightedIndex(0);
        inputRef.current?.focus();
      } else {
        setHighlightedIndex(-1);
        setQuery("");
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => setOpen((prev) => !prev)}
        className="relative flex min-w-fit cursor-pointer items-center justify-center gap-2 rounded-lg border dark:border-zinc-700 border-gray-300 bg-surface dark:bg-neutral-800 p-2"
      >
        <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full">
          <img
            src={`https://flagcdn.com/${mergeObject[selected].flag}.svg`}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
          />
        </div>

        <span className="w-8 text-preset-4 dark:text-neutral-50 text-text">
          {selected}
        </span>

        <img
          src={`/images/chevron-down.svg`}
          alt=""
          aria-hidden="true"
          className={` h-4 w-4 transition ${open ? "rotate-180" : ""} invert  dark:invert-0`}
        />
      </button>

      {open && (
        <div
          className={`absolute top-15 ${left ? "z-30 -right-4" : "-right-4"} w-72 rounded-xl border border-zinc-700 bg-[#1b1d24] p-2`}
        >
          <label htmlFor={searchId} className="sr-only">
            Search currencies
          </label>

          <input
            ref={inputRef}
            id={searchId}
            role="combobox"
            aria-expanded={open}
            aria-controls={listboxId}
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
            className="w-full rounded border border-zinc-600 bg-transparent px-3 py-3 text-preset-5 text-gray-200 focus:border-gray-400 focus:outline-none"
          />

          <ul
            id={listboxId}
            role="listbox"
            className="scrollbar absolute left-0 z-10 m-0 flex max-h-80 w-full flex-col items-center overflow-y-auto rounded-b-lg border border-t-0 border-zinc-700 bg-[#1b1d24] px-2 pt-2 pb-4 shadow-xl"
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
                    setSelected(code);
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
                    setSelected(code);
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
