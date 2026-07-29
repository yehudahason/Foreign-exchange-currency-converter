import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Home from "../app/components/Home";

import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
const replace = vi.fn();

vi.mock("next/image", () => ({ default: (p: any) => <img {...p} /> }));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
  useSearchParams: () => ({
    get: (k: string) =>
      ({ baseRate: "USD", quoteRate: "EUR", amount: "1" })[k as any],
  }),
}));
vi.mock("@tanstack/react-query", () => ({
  useQuery: () => ({
    data: [
      { date: "1", rate: 1 },
      { date: "2", rate: 2 },
    ],
    isPending: false,
    isError: false,
  }),
}));
vi.mock("../app/fetchMethods/useBaseRates", () => ({
  useBaseRates: () => ({
    data: [],
    isPending: false,
    isError: false,
    error: null,
  }),
}));
vi.mock("../app/utils/useLocalStorage", () => ({
  useLocalStorage: (_: any, v: any) => [v, vi.fn()],
}));
vi.mock("../app/fetchMethods/compareRates", () => ({ compareRate: vi.fn() }));
vi.mock("../app/utils/downsample", () => ({ downsample: (d: any) => d }));
vi.mock("../app/utils/formatBerlinTime", () => ({
  formatBerlinTime: () => "12:00",
}));

vi.mock("../app/components/Chart", () => ({ default: () => <div>Chart</div> }));
vi.mock("../app/components/Header", () => ({
  default: ({ reset }: any) => <button onClick={reset}>Reset</button>,
}));
vi.mock("../app/components/TopCompareBar", () => ({
  default: ({ selected, selected2 }: any) => (
    <div>
      {selected}/{selected2}
    </div>
  ),
}));
vi.mock("../app/components/NavBar", () => ({ default: () => null }));
vi.mock("../app/components/ChangeBar", () => ({ default: () => null }));
vi.mock("../app/components/Favorite", () => ({ default: () => null }));
vi.mock("../app/components/Logs", () => ({ default: () => null }));
vi.mock("../app/components/CompareBottom", () => ({ default: () => null }));
vi.mock("../app/components/Footer", () => ({ default: () => null }));

describe("Home", () => {
  it("renders selected currencies", () => {
    render(<Home />);
    expect(screen.getAllByText("USD/EUR")).toHaveLength(2);
  });

  it("renders chart", () => {
    render(<Home />);
    expect(screen.getByText("Chart")).toBeDefined();
  });

  it("updates URL", () => {
    render(<Home />);
    expect(replace).toHaveBeenCalledWith(
      expect.stringContaining("baseRate=USD"),
    );
  });

  it("reset navigates home", () => {
    render(<Home />);
    screen.getByText("Reset").click();
    expect(replace).toHaveBeenLastCalledWith("/");
  });

  it("adds dark class", () => {
    render(<Home />);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });
});
