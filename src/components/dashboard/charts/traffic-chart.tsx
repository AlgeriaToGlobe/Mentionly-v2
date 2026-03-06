"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const demoData = Array.from({ length: 30 }, (_, i) => ({
  date: `Day ${i + 1}`,
  clicks: Math.floor(80 + i * 8 + Math.random() * 40),
}));

export function TrafficChart({
  data,
}: {
  data?: { date: string; clicks: number }[];
}) {
  const chartData = data ?? demoData;

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12 }}
          stroke="#9CA3AF"
          tickLine={false}
        />
        <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" tickLine={false} />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="clicks"
          stroke="#F97316"
          fill="#FFF7ED"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
