"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface NotificationPrefs {
  new_thread_alerts: boolean;
  brand_mention_alerts: boolean;
  weekly_digest: boolean;
}

const STORAGE_KEY = "mentionly_notification_prefs";

const defaultPrefs: NotificationPrefs = {
  new_thread_alerts: true,
  brand_mention_alerts: true,
  weekly_digest: false,
};

export function NotificationsForm() {
  const [prefs, setPrefs] = useState<NotificationPrefs>(defaultPrefs);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Stored in localStorage for MVP; backend persistence will be added later
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setPrefs(JSON.parse(stored));
      } catch {
        // ignore parse errors
      }
    }
  }, []);

  function updatePref(key: keyof NotificationPrefs, value: boolean) {
    setPrefs((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    setSaving(true);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    setTimeout(() => {
      setSaving(false);
      toast.success("Notification preferences saved");
    }, 300);
  }

  const toggles: { key: keyof NotificationPrefs; label: string; description: string }[] = [
    {
      key: "new_thread_alerts",
      label: "New Thread Alerts",
      description: "Get notified when high-score threads are discovered in your target subreddits.",
    },
    {
      key: "brand_mention_alerts",
      label: "Brand Mention Alerts",
      description: "Get notified when your brand is mentioned in Reddit threads.",
    },
    {
      key: "weekly_digest",
      label: "Weekly Digest",
      description: "Receive a weekly email summary of your Reddit marketing performance.",
    },
  ];

  return (
    <div className="space-y-6">
      {toggles.map((toggle) => (
        <div key={toggle.key} className="flex items-start justify-between gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-900">{toggle.label}</Label>
            <p className="text-xs text-gray-400 mt-0.5">{toggle.description}</p>
          </div>
          <Switch
            checked={prefs[toggle.key]}
            onCheckedChange={(checked) => updatePref(toggle.key, checked)}
            aria-label={toggle.label}
          />
        </div>
      ))}

      <Button onClick={handleSave} disabled={saving}>
        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save Preferences
      </Button>
    </div>
  );
}
