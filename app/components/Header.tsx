import { Dispatch, SetStateAction } from "react";

import { todayRates } from "../types";
import Link from "next/link";
type HeaderProps = {
  isError: boolean;
  error: Error | null;
  isPending: boolean;
  todayrates: todayRates[];
  reset: () => void;
  setDark: Dispatch<SetStateAction<boolean>>;
  dark: boolean;
};

export default function Header({
  isError,
  error,
  isPending,
  todayrates,
  reset,
  setDark,
  dark,
}: HeaderProps) {
  return (
    <header className="dark:bg-neutral-900 bg-bg w-full">
      <div className="flex items-center gap-2 text-neutral-200 justify-between sm:p-6  px-3 py-6 uppercase sm:text-preset-4  text-preset-6">
        <Link
          href="/"
          onClick={(e) => {
            e.preventDefault();
            reset();
          }}
        >
          <img
            src={`/images/logo${dark ? "" : "_black"}.svg`}
            alt=""
            className="h-4.5 w-auto sm:h-8 "
          />
        </Link>
        <div className="flex sm:flex-row flex-col items-center gap-4">
          <button
            className="bg-none border-0 cursor-pointer"
            onClick={() => setDark((prev) => !prev)}
          >
            <img
              className="w-6 h-6"
              src={`/images/${dark ? "light" : "dark"}_mode.svg`}
              alt=""
            />
          </button>
          <span className="sm:text-preset-4  text-preset-6">
            165 Currencies · EOD · ECB data
          </span>
        </div>
      </div>

      <div className="flex w-full overflow-x-hidden">
        <div className="flex sm:w-32 w-29 shrink-0 gap-2 items-center justify-center whitespace-nowrap bg-lime-500 p-1 uppercase text-gray-900 sm:px-2 sm:py-3 text-preset-5-medium">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-current"></span>{" "}
          Live markets
        </div>
        <div className="dark:bg-neutral-700 bg-surface overflow-hidden whitespace-nowrap w-full text-preset-5">
          {isError && (
            <span
              className="dark:text-text 
            text-text
            text-preset-5  py-2 w-full flex justify-center items-center h-full"
            >
              {(error as Error).message}
            </span>
          )}
          <ul className="flex items-center w-max animate-marquee ">
            {isPending
              ? ""
              : todayrates?.map((item) => {
                  const percentChange = item.percentChange ?? 0;
                  return (
                    <li
                      key={item.currency}
                      className="flex gap-2 border-x dark:border-gray-800 shrink-0 border-gray-200 px-3 py-3 dark:text-gray-100 text-text"
                    >
                      <span>USD/{item.currency}</span>
                      <span>{item.rate.toFixed(3)}</span>
                      <span
                        className={`flex ${percentChange >= 0 ? " text-green-500" : "text-red-500"} justify-between items-center gap-1`}
                      >
                        <img
                          className={`w-4 h-full ${percentChange >= 0 ? "green rotate-180" : "red"}`}
                          src="/images/chevron-down.svg"
                          alt=""
                          width={16}
                          height={16}
                        />
                        {percentChange.toFixed(3)}%
                      </span>
                    </li>
                  );
                })}
          </ul>
        </div>
      </div>
    </header>
  );
}
