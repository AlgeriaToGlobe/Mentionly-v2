"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AccountForm } from "@/components/dashboard/settings/account-form";
import { KeywordsForm } from "@/components/dashboard/settings/keywords-form";
import { NotificationsForm } from "@/components/dashboard/settings/notifications-form";
import { Users, Key, CreditCard } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your account and project configuration.
        </p>
      </div>

      <Tabs defaultValue="account">
        <TabsList className="flex-wrap">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="mt-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 max-w-2xl">
            <h2 className="font-heading font-semibold text-gray-900 text-lg mb-6">Account Settings</h2>
            <AccountForm />
          </div>
        </TabsContent>

        <TabsContent value="keywords" className="mt-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 max-w-2xl">
            <h2 className="font-heading font-semibold text-gray-900 text-lg mb-6">Keyword Configuration</h2>
            <KeywordsForm />
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 max-w-2xl">
            <h2 className="font-heading font-semibold text-gray-900 text-lg mb-6">Notification Preferences</h2>
            <NotificationsForm />
          </div>
        </TabsContent>

        <TabsContent value="billing" className="mt-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 max-w-2xl text-center py-12">
            <CreditCard className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h2 className="font-heading font-semibold text-gray-900 text-lg">Payments Coming Soon</h2>
            <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
              You&apos;re currently on the <strong>Free</strong> plan. Paid plans with advanced features are launching soon.
              Join the waitlist to be the first to know.
            </p>
            <Button asChild className="mt-6">
              <Link href="/#pricing">Join Waitlist</Link>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="team" className="mt-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 max-w-2xl text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h2 className="font-heading font-semibold text-gray-900 text-lg">Team Management</h2>
            <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
              Available on Pro and Max plans. Upgrade to invite team members and collaborate on projects.
            </p>
            <Button disabled className="mt-6" variant="outline">
              Invite Member
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="api" className="mt-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 max-w-2xl text-center py-12">
            <Key className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h2 className="font-heading font-semibold text-gray-900 text-lg">API Access</h2>
            <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
              Available on Max plan. Access the Mentionly API to integrate with your tools.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-2 text-sm text-gray-400 font-mono">
              mk_••••••••••••••••
              <Button size="sm" variant="outline" disabled>Copy</Button>
            </div>
            <div className="mt-4">
              <Button variant="outline">Upgrade to Max</Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
