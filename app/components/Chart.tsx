import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type ExchangeRate = {
  date: string;
  base: string;
  quote: string;
  rate: number;
};

type ExchangeRateChartProps = {
  data: ExchangeRate[];
};

type TooltipProps = {
  active?: boolean;
  payload?: {
    payload: ExchangeRate;
  }[];
};

function CustomTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null;

  const { date, base, quote, rate } = payload[0].payload;

  return (
    <div className="rounded-xl border border-gray-400 bg-gray-800 p-3 shadow-lg p-3">
      <p className="text-sm text-gray-50">
        {new Date(date).toLocaleDateString("en-US", {
          weekday: "short",
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      </p>

      <p className="mt-2 font-semibold text-white">
        {base} → {quote}
      </p>

      <p className="text-xl font-bold text-yellow-300">{rate.toFixed(5)}</p>
    </div>
  );
}

export default function Chart({ data }: ExchangeRateChartProps) {
  return (
    <div className="h-[400px] w-full rounded-xl bg-black p-4 shadow">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 20,
            right: 20,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D8FF3E" stopOpacity={0.55} />
              <stop offset="100%" stopColor="#D8FF3E" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            vertical={false}
            stroke="#343434"
            strokeDasharray="3 6"
          />

          <XAxis
            dataKey="date"
            tickFormatter={(date) =>
              new Date(date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            }
            tickLine={false}
            axisLine={false}
            minTickGap={30}
          />

          <YAxis
            tickFormatter={(value: number) => value.toFixed(2)}
            tickLine={false}
            axisLine={false}
            domain={[
              (min: number) => min - 0.002,
              (max: number) => max + 0.002,
            ]}
          />

          {/* <Tooltip
            cursor={{
              stroke: "#555",
              strokeDasharray: "3 3",
            }}
            contentStyle={{
              background: "#1f1f1f",
              border: "1px solid #333",
              borderRadius: 12,
              color: "white",
            }}
          /> */}

          <Tooltip
            cursor={{
              stroke: "#555",
              strokeDasharray: "3 3",
            }}
            content={<CustomTooltip />}
          />
          <Area
            dataKey="rate"
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
