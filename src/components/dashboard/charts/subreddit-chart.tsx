"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

interface SubredditChartProps {
  data?: Array<{ subreddit: string; count: number }>;
  isLoading?: boolean;
}

export function SubredditChart({
  data,
  isLoading = false,
}: SubredditChartProps) {
  if (isLoading) {
    return <Skeleton className="w-full h-[300px] rounded-lg" />;
  }

  const chartData = (data ?? [])
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  if (!chartData.length) {
    return (
      <div className="flex items-center justify-center h-[300px] text-sm text-gray-400">
        No subreddit data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
        <XAxis type="number" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
        <YAxis
          type="category"
          dataKey="subreddit"
          tick={{ fontSize: 12 }}
          stroke="#9CA3AF"
          width={120}
        />
        <Tooltip
          contentStyle={{
            background: "white",
            border: "1px solid #E5E7EB",
            borderRadius: "8px",
            fontSize: "13px",
          }}
        />
        <Bar dataKey="count" fill="#F97316" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
