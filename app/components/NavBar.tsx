type NavBarProps = {
  active: string;
  setActive: (active: string) => void;
};

export default function NavBar({ active, setActive }: NavBarProps) {
  const tabs = [
    { id: "history", label: "HISTORY", count: null },
    { id: "compare", label: "COMPARE", count: null },
    { id: "favorites", label: "FAVORITES", count: 10 },
    { id: "log", label: "LOG", count: 8 },
  ];
  return (
    <div className="flex w-full max-w-6xl ">
      {/* Mobile */}
      <div className="md:hidden px-8">
        <select
          value={active}
          onChange={(e) => setActive(e.target.value)}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3
               uppercase tracking-[0.2em] text-zinc-100
               focus:outline-none appearance-none text-preset-3"
        >
          {tabs.map((tab) => (
            <option key={tab.id} value={tab.id}>
              {tab.label}
              {tab.count ? ` (${tab.count})` : ""}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop */}
      <nav className="hidden md:flex border-b border-zinc-800 w-full text-preset-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`relative flex items-center gap-2 px-6 py-4
        uppercase tracking-[0.2em]
        text-preset-3 
        cursor-pointer
        ${
          active === tab.id
            ? "text-white after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-lime-400"
            : "text-zinc-400 hover:text-white"
        }`}
          >
            {tab.label}

            {tab.count && (
              <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-lime-500/20 px-1 py-3 text-preset-4 font-semibold text-lime-400">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}
