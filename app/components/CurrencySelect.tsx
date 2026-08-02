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

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const id = useId();
  const searchId = `${id}-currency-search`;
  const listboxId = `${id}-currency-listbox`;

  const itemsP = useMemo(
    () =>
      popularCurrencies.filter(
        (code) =>
          code.toLowerCase().includes(query.toLowerCase()) ||
          mergeObject[code]?.name.toLowerCase().includes(query.toLowerCase()),
      ),
    [popularCurrencies, query, mergeObject],
  );

  const itemsO = useMemo(
    () =>
      othersCurrencies.filter(
        (code) =>
          code.toLowerCase().includes(query.toLowerCase()) ||
          mergeObject[code]?.name.toLowerCase().includes(query.toLowerCase()),
      ),
    [othersCurrencies, query, mergeObject],
  );

  const filtered = useMemo(() => [...itemsP, ...itemsO], [itemsP, itemsO]);

  // Helper to close and reset internal search state
  const closeMenu = () => {
    setOpen(false);
    setHighlightedIndex(-1);
    setQuery("");
  };

  // Helper to open and initialize search state
  const openMenu = () => {
    setOpen(true);
    setHighlightedIndex(0);
  };

  // Focus input when opened
  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  // Scroll active descendant into view
  useEffect(() => {
    if (highlightedIndex >= 0 && filtered[highlightedIndex]) {
      document
        .getElementById(`currency-option-${filtered[highlightedIndex]}`)
        ?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex, filtered]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        closeMenu();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!open) {
          openMenu();
        } else {
          setHighlightedIndex((i) => Math.min(i + 1, filtered.length - 1));
        }
        break;

      case "ArrowUp":
        e.preventDefault();
        if (open) {
          setHighlightedIndex((i) => Math.max(i - 1, 0));
        }
        break;

      case "Enter":
        if (open && highlightedIndex >= 0 && filtered[highlightedIndex]) {
          e.preventDefault();
          setSelected(filtered[highlightedIndex]);
          closeMenu();
        }
        break;

      case "Escape":
        if (open) {
          e.preventDefault();
          closeMenu();
        }
        break;

      case "Tab":
        closeMenu();
        break;
    }
  };

  const activeDescendantId =
    open && highlightedIndex >= 0 && filtered[highlightedIndex]
      ? `currency-option-${filtered[highlightedIndex]}`
      : undefined;

  return (
    <div ref={containerRef} className="min-w-fit relative inline-block">
      <button
        type="button"
        aria-label={ariaLabel}
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        onClick={() => (open ? closeMenu() : openMenu())}
        className="flex min-w-fit cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300 bg-surface p-2 dark:border-zinc-700 dark:bg-neutral-800"
      >
        <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full">
          <img
            src={`https://flagcdn.com/${mergeObject[selected]?.flag}.svg`}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
          />
        </div>

        <span className="w-8 text-preset-4 text-text dark:text-neutral-50">
          {selected}
        </span>

        <img
          src="/images/chevron-down.svg"
          alt=""
          aria-hidden="true"
          className={`h-4 w-4 invert transition dark:invert-0 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          className={`absolute top-15 ${
            left ? "z-30 -right-4" : "z-20 -right-4"
          } w-72 rounded-xl border border-zinc-700 bg-[#1b1d24] p-2`}
        >
          <label htmlFor={searchId} className="sr-only">
            Search currencies
          </label>

          <input
            ref={inputRef}
            id={searchId}
            type="text"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={open}
            aria-controls={listboxId}
            aria-activedescendant={activeDescendantId}
            autoComplete="off"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setHighlightedIndex(0); // Reset index to top when search query changes
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search currencies..."
            className="w-full rounded border border-zinc-600 bg-transparent px-3 py-3 text-preset-5 text-gray-200 focus:border-gray-400 focus:outline-none"
          />

          <div className="sr-only" aria-live="polite">
            {filtered.length === 0
              ? "No matching currencies found."
              : `${filtered.length} currencies available.`}
          </div>

          <ul
            id={listboxId}
            role="listbox"
            aria-label="Currencies"
            className="scrollbar m-0 max-h-80 overflow-y-auto px-2 pt-2 pb-4"
          >
            {filtered.length === 0 && (
              <li
                role="option"
                aria-selected="false"
                className="px-4 py-2 text-gray-400"
              >
                No results found
              </li>
            )}

            {itemsP.length > 0 && (
              <li role="group" aria-label="Popular Currencies">
                <div
                  aria-hidden="true"
                  className="flex justify-between border-b border-gray-700 px-4 py-2 uppercase text-xs font-semibold text-gray-400"
                >
                  <span>Popular</span>
                  <span>{itemsP.length}</span>
                </div>
                <ul role="presentation">
                  <CurrencyList
                    items={itemsP}
                    selected={selected}
                    highlightedIndex={highlightedIndex}
                    mergeObject={mergeObject}
                    onSelect={(code) => {
                      setSelected(code);
                      closeMenu();
                    }}
                  />
                </ul>
              </li>
            )}

            {itemsO.length > 0 && (
              <li role="group" aria-label="Other Currencies">
                <div
                  aria-hidden="true"
                  className="mt-2 flex justify-between border-b border-gray-700 px-4 py-2 uppercase text-xs font-semibold text-gray-400"
                >
                  <span>Other currencies</span>
                  <span>{itemsO.length}</span>
                </div>
                <ul role="presentation">
                  <CurrencyList
                    items={itemsO}
                    startIndex={itemsP.length}
                    selected={selected}
                    highlightedIndex={highlightedIndex}
                    mergeObject={mergeObject}
                    onSelect={(code) => {
                      setSelected(code);
                      closeMenu();
                    }}
                  />
                </ul>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
