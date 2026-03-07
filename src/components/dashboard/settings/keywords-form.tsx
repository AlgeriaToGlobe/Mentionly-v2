"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";

interface TagInputProps {
  label: string;
  description: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder: string;
  prefix?: string;
}

function TagInput({ label, description, tags, onChange, placeholder, prefix }: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  function addTag() {
    let value = inputValue.trim();
    if (!value) return;
    if (prefix && !value.startsWith(prefix)) {
      value = prefix + value;
    }
    if (tags.length >= 50) {
      toast.error("Maximum 50 items allowed");
      return;
    }
    if (value.length > 100) {
      toast.error("Each item must be under 100 characters");
      return;
    }
    if (!tags.includes(value)) {
      onChange([...tags, value]);
    }
    setInputValue("");
  }

  return (
    <div>
      <Label>{label}</Label>
      <p className="text-xs text-gray-400 mt-0.5 mb-2">{description}</p>
      <div className="flex gap-2">
        <Input
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag();
            }
          }}
        />
        <Button type="button" variant="outline" onClick={addTag}>
          Add
        </Button>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-orange-50 text-orange-700 px-2 py-1 text-xs">
              {tag}
              <button
                type="button"
                onClick={() => onChange(tags.filter((t) => t !== tag))}
                className="ml-1 hover:text-orange-900"
                aria-label={`Remove ${tag}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

export function KeywordsForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [subreddits, setSubreddits] = useState<string[]>([]);
  const [brandNames, setBrandNames] = useState<string[]>([]);

  useEffect(() => {
    async function fetchProject() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: projects } = await supabase
        .from("projects")
        .select("id, target_keywords, target_subreddits, brand_names")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .limit(1);

      if (projects?.[0]) {
        setProjectId(projects[0].id);
        setKeywords(projects[0].target_keywords || []);
        setSubreddits(projects[0].target_subreddits || []);
        setBrandNames(projects[0].brand_names || []);
      }
      setLoading(false);
    }
    fetchProject();
  }, []);

  async function handleSave() {
    if (!projectId) {
      toast.error("No active project found");
      return;
    }
    setSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("projects")
        .update({
          target_keywords: keywords,
          target_subreddits: subreddits,
          brand_names: brandNames,
          updated_at: new Date().toISOString(),
        })
        .eq("id", projectId);
      if (error) throw error;
      toast.success("Keywords saved");
    } catch {
      toast.error("Failed to save keywords");
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TagInput
        label="Target Keywords"
        description="Keywords to monitor on Reddit"
        tags={keywords}
        onChange={setKeywords}
        placeholder="e.g., best watches under 500"
      />
      <TagInput
        label="Target Subreddits"
        description="Subreddits to focus on (r/ prefix auto-added)"
        tags={subreddits}
        onChange={setSubreddits}
        placeholder="e.g., watches"
        prefix="r/"
      />
      <TagInput
        label="Brand Names"
        description="Your brand names to track mentions"
        tags={brandNames}
        onChange={setBrandNames}
        placeholder="e.g., AcmeWatch"
      />
      <Button onClick={handleSave} disabled={saving}>
        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save Keywords
      </Button>
    </div>
  );
}
