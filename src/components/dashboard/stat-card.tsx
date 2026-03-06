import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
}

export function StatCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-body-sm text-gray-500">{title}</p>
          <p className="mt-1 text-2xl font-heading font-bold text-gray-900">
            {value}
          </p>
          {change && (
            <p
              className={cn(
                "mt-1 text-sm font-medium",
                changeType === "positive" && "text-green-600",
                changeType === "negative" && "text-red-600",
                changeType === "neutral" && "text-gray-400"
              )}
            >
              {change}
            </p>
          )}
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50">
          <Icon className="h-6 w-6 text-orange-500" />
        </div>
      </div>
    </div>
  );
}
