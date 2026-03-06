import { cn } from "@/lib/utils";
import type { ActivityItem } from "@/types";

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-card">
      <h3 className="font-heading font-semibold text-gray-900 mb-4">
        Recent Activity
      </h3>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-start gap-3">
            <div
              className={cn(
                "mt-1.5 h-2 w-2 rounded-full flex-shrink-0",
                item.type === "thread" && "bg-blue-500",
                item.type === "comment" && "bg-green-500",
                item.type === "alert" && "bg-orange-500",
                item.type === "credit" && "bg-gray-400"
              )}
            />
            <div className="flex-1 min-w-0">
              <p className="text-body-sm text-gray-700">{item.message}</p>
              <p className="text-caption text-gray-400">{item.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
