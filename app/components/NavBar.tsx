import { LogsItems, Pairs } from "../types";

type NavBarProps = {
  active: string;
  setActive: (active: string) => void;
  favorites: Pairs;
  logs: LogsItems;
};

export default function NavBar({
  logs,
  active,
  setActive,
  favorites,
}: NavBarProps) {
  const tabs = [
    { id: "history", label: "HISTORY", count: null },
    { id: "compare", label: "COMPARE", count: null },
    { id: "favorites", label: "FAVORITES", count: favorites.length },
    { id: "log", label: "LOG", count: logs.length },
  ];

  return (
    <div className="flex w-full max-w-6xl">
      {/* Mobile */}
      <div className="px-8  w-full md:hidden">
        <select
          aria-label="Select section"
          value={active}
          onChange={(e) => setActive(e.target.value)}
          className="w-full rounded-xl border border-gray-400 text-text dark:border-zinc-700 dark:bg-zinc-900 bg-bg px-4 py-3
                     appearance-none dark:text-zinc-100 uppercase tracking-[0.2em]
                     text-preset-3 focus:outline-none"
        >
          {tabs.map((tab) => (
            <option key={tab.id} value={tab.id}>
              {tab.label}
              {tab.count !== null ? ` (${tab.count})` : ""}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop */}
      <nav
        aria-label="Dashboard sections"
        className="hidden w-full border-b dark:border-zinc-800 border-gray-400 text-preset-3 md:flex"
      >
        <div role="tablist" aria-orientation="horizontal" className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              id={`${tab.id}-tab`}
              role="tab"
              type="button"
              aria-selected={active === tab.id}
              aria-controls={`${tab.id}-panel`}
              tabIndex={active === tab.id ? 0 : -1}
              onClick={() => setActive(tab.id)}
              className={`relative flex cursor-pointer items-center gap-2 px-6 py-4
                uppercase tracking-[0.2em] text-preset-3
                focus-visible:outline-2 focus-visible:outline-amber-600 focus-visible:outline-offset-2
                ${
                  active === tab.id
                    ? "dark:text-white text-text after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-lime-400"
                    : "dark:text-zinc-400 text-text hover:text-gray-500 dark:hover:text-white"
                }`}
            >
              <span>{tab.label}</span>

              {tab.count !== null && (
                <span
                  aria-label={`${tab.count} items`}
                  className="flex h-6 min-w-6 items-center justify-center rounded-full dark:bg-lime-500/20 px-1 py-3 text-preset-4 font-semibold dark:text-lime-400 bg-lime-600 text-lime-200"
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
