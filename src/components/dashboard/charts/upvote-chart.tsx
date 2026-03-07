"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

interface UpvoteChartProps {
  data?: Array<{ date: string; upvotes: number; comments: number }>;
  isLoading?: boolean;
}

export function UpvoteChart({ data, isLoading = false }: UpvoteChartProps) {
  if (isLoading) {
    return <Skeleton className="w-full h-[300px] rounded-lg" />;
  }

  if (!data?.length) {
    return (
      <div className="flex items-center justify-center h-[300px] text-sm text-gray-400">
        No engagement data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12 }}
          stroke="#9CA3AF"
          tickLine={false}
        />
        <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" tickLine={false} />
        <Tooltip
          contentStyle={{
            background: "white",
            border: "1px solid #E5E7EB",
            borderRadius: "8px",
            fontSize: "13px",
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="upvotes"
          stroke="#F97316"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="comments"
          stroke="#3B82F6"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
