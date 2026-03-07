"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Loader2, User } from "lucide-react";

const profileSchema = z.object({
  full_name: z.string().min(1, "Name is required").max(100),
});

const passwordSchema = z
  .object({
    new_password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export function AccountForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormData>({ resolver: zodResolver(profileSchema) });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormData>({ resolver: zodResolver(passwordSchema) });

  useEffect(() => {
    async function fetchProfile() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      setEmail(user.email || "");

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", user.id)
        .single();

      if (profile) {
        resetProfile({ full_name: profile.full_name || "" });
        setAvatarUrl(profile.avatar_url);
      }
      setLoading(false);
    }
    fetchProfile();
  }, [resetProfile]);

  async function onProfileSubmit(data: ProfileFormData) {
    setSaving(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("profiles")
        .update({ full_name: data.full_name, updated_at: new Date().toISOString() })
        .eq("id", user.id);
      if (error) throw error;
      toast.success("Profile updated");
    } catch {
      toast.error("Failed to update profile");
    }
    setSaving(false);
  }

  async function onPasswordSubmit(data: PasswordFormData) {
    setChangingPassword(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: data.new_password,
      });
      if (error) throw error;
      toast.success("Password updated");
      resetPassword();
    } catch {
      toast.error("Failed to update password");
    }
    setChangingPassword(false);
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const ext = file.name.split(".").pop();
      const path = `${user.id}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(path);

      await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user.id);

      setAvatarUrl(publicUrl);
      toast.success("Avatar updated");
    } catch {
      toast.error("Failed to upload avatar");
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-32" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <User className="h-8 w-8 text-gray-400" />
            )}
          </div>
          <div>
            <Label htmlFor="avatar" className="cursor-pointer text-sm text-orange-600 hover:text-orange-700 font-medium">
              Change Avatar
            </Label>
            <input id="avatar" type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
          </div>
        </div>

        <div>
          <Label htmlFor="full_name">Full Name</Label>
          <Input id="full_name" {...registerProfile("full_name")} className="mt-1" />
          {profileErrors.full_name && (
            <p className="text-sm text-red-500 mt-1">{profileErrors.full_name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} disabled className="mt-1" />
        </div>

        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </form>

      <Separator />

      <div>
        <h3 className="font-heading font-semibold text-gray-900 mb-4">Change Password</h3>
        <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="new_password">New Password</Label>
            <Input id="new_password" type="password" {...registerPassword("new_password")} className="mt-1" />
            {passwordErrors.new_password && (
              <p className="text-sm text-red-500 mt-1">{passwordErrors.new_password.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="confirm_password">Confirm Password</Label>
            <Input id="confirm_password" type="password" {...registerPassword("confirm_password")} className="mt-1" />
            {passwordErrors.confirm_password && (
              <p className="text-sm text-red-500 mt-1">{passwordErrors.confirm_password.message}</p>
            )}
          </div>
          <Button type="submit" variant="outline" disabled={changingPassword}>
            {changingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update Password
          </Button>
        </form>
      </div>
    </div>
  );
}
