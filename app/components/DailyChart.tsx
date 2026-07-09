"use client";
import type { TooltipProps } from "recharts";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type ExchangeRateDaily = {
  time: string;
  datetime: string;
  open: number;
  high: number;
  low: number;
  close: number;
};

type ExchangeRateChartProps = {
  data: ExchangeRateDaily[];
};

type TooltipEntry = {
  payload: ExchangeRateDaily;
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: TooltipEntry[];
};

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  const point = payload[0].payload as ExchangeRateDaily;

  return (
    <div className="min-w-48 rounded-xl border border-zinc-700 bg-[#171717] p-4 shadow-2xl">
      <p className="mb-3 border-b border-zinc-700 pb-2 text-xs font-medium tracking-wide text-zinc-400">
        {new Date(point.datetime).toLocaleString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>

      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-zinc-400">Open</span>
          <span className="font-mono text-white">{point.open.toFixed(5)}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-zinc-400">High</span>
          <span className="font-mono text-green-400">
            {point.high.toFixed(5)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-zinc-400">Low</span>
          <span className="font-mono text-red-400">{point.low.toFixed(5)}</span>
        </div>

        <div className="mt-2 border-t border-zinc-700 pt-3">
          <div className="flex items-center justify-between">
            <span className="font-medium text-[#D8FF3E]">Close</span>

            <span className="font-mono text-lg font-bold text-[#D8FF3E]">
              {point.close.toFixed(5)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DailyChart({ data }: ExchangeRateChartProps) {
  return (
    <div className="h-[420px] w-full rounded-3xl bg-[#171717] p-6">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 20,
            left: 10,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D8FF3E" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#D8FF3E" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            vertical={false}
            stroke="#343434"
            strokeDasharray="3 6"
          />

          <XAxis
            dataKey="time"
            interval={2}
            tickLine={false}
            axisLine={false}
            tick={{
              fill: "#8b8b8b",
              fontSize: 12,
            }}
            minTickGap={20}
          />

          <YAxis
            dataKey="close"
            tickFormatter={(value: number) => value.toFixed(4)}
            tickLine={false}
            axisLine={false}
            tick={{
              fill: "#8b8b8b",
              fontSize: 12,
            }}
            domain={[
              (min: number) => min - 0.0005,
              (max: number) => max + 0.0005,
            ]}
          />

          <Tooltip
            cursor={{
              stroke: "#555",
              strokeDasharray: "3 3",
            }}
            content={<CustomTooltip />}
          />

          <Area
            type="monotone"
            dataKey="close"
            stroke="#D8FF3E"
            strokeWidth={3}
            fill="url(#gradient)"
            dot={false}
            activeDot={{
              r: 5,
              fill: "#D8FF3E",
              stroke: "#171717",
              strokeWidth: 3,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
