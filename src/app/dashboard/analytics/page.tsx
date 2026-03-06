"use client";

import { TrafficChart } from "@/components/dashboard/charts/traffic-chart";
import { StatCard } from "@/components/dashboard/stat-card";
import { BarChart3, Eye, MessageSquare, TrendingUp } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-gray-900">
          Analytics
        </h1>
        <p className="text-body-sm text-gray-500 mt-1">
          Track your Reddit marketing performance
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Impressions"
          value="45.2K"
          change="+22% this month"
          changeType="positive"
          icon={Eye}
        />
        <StatCard
          title="Comments Posted"
          value={47}
          change="+12 this month"
          changeType="positive"
          icon={MessageSquare}
        />
        <StatCard
          title="Brand Mentions"
          value={156}
          change="+34 this month"
          changeType="positive"
          icon={BarChart3}
        />
        <StatCard
          title="AI Citations"
          value={8}
          change="+3 this month"
          changeType="positive"
          icon={TrendingUp}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-card">
          <h3 className="font-heading font-semibold text-gray-900 mb-4">
            Traffic Over Time
          </h3>
          <TrafficChart />
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-card">
          <h3 className="font-heading font-semibold text-gray-900 mb-4">
            Top Subreddits
          </h3>
          <div className="space-y-4">
            {[
              { name: "r/watches", mentions: 18, traffic: "5.2K" },
              { name: "r/BuyItForLife", mentions: 12, traffic: "3.8K" },
              { name: "r/malefashionadvice", mentions: 8, traffic: "1.9K" },
              { name: "r/frugalmalefashion", mentions: 6, traffic: "1.2K" },
              { name: "r/EDC", mentions: 3, traffic: "340" },
            ].map((sub) => (
              <div key={sub.name} className="flex items-center justify-between">
                <div>
                  <p className="text-body-sm font-medium text-gray-900">
                    {sub.name}
                  </p>
                  <p className="text-caption text-gray-400">
                    {sub.mentions} mentions
                  </p>
                </div>
                <span className="text-body-sm font-semibold text-gray-700">
                  {sub.traffic} visits
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
