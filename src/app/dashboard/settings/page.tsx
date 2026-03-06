"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-heading font-bold text-gray-900">
          Settings
        </h1>
        <p className="text-body-sm text-gray-500 mt-1">
          Manage your account and preferences
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-card space-y-6">
        <div>
          <h2 className="font-heading font-semibold text-gray-900 text-lg mb-4">
            Account
          </h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue="Demo User" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue="demo@mentionly.com"
                disabled
              />
            </div>
            <Button>Save Changes</Button>
          </div>
        </div>

        <Separator />

        <div>
          <h2 className="font-heading font-semibold text-gray-900 text-lg mb-4">
            Project Settings
          </h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="project-name">Project Name</Label>
              <Input id="project-name" defaultValue="AcmeWatch" />
            </div>
            <div>
              <Label htmlFor="website">Website URL</Label>
              <Input
                id="website"
                type="url"
                defaultValue="https://acmewatch.com"
              />
            </div>
            <div>
              <Label htmlFor="keywords">Target Keywords</Label>
              <Input
                id="keywords"
                defaultValue="best watches under 500, affordable luxury watches"
                placeholder="Comma-separated keywords"
              />
            </div>
            <Button>Save Project</Button>
          </div>
        </div>

        <Separator />

        <div>
          <h2 className="font-heading font-semibold text-gray-900 text-lg mb-4">
            Billing
          </h2>
          <p className="text-body-sm text-gray-500 mb-4">
            You are on the <strong>Free</strong> plan. Upgrade to unlock more
            features.
          </p>
          <Button variant="outline">Upgrade Plan</Button>
        </div>

        <Separator />

        <div>
          <h2 className="font-heading font-semibold text-gray-900 text-lg mb-4 text-red-600">
            Danger Zone
          </h2>
          <p className="text-body-sm text-gray-500 mb-4">
            Permanently delete your account and all associated data.
          </p>
          <Button variant="destructive">Delete Account</Button>
        </div>
      </div>
    </div>
  );
}
