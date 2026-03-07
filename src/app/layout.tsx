import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#F97316",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://mentionly.com"),
  title: {
    default: "Mentionly — AI-Powered Reddit Marketing Platform",
    template: "%s | Mentionly",
  },
  description:
    "Discover high-intent Reddit threads, generate natural comments, and get your brand mentioned — all without managing a single Reddit account.",
  openGraph: {
    title: "Mentionly — AI-Powered Reddit Marketing Platform",
    description:
      "Turn Reddit into your #1 growth channel with AI-powered thread discovery and comment generation.",
    url: "https://mentionly.com",
    siteName: "Mentionly",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Mentionly — AI-Powered Reddit Marketing Platform",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mentionly — AI-Powered Reddit Marketing Platform",
    description: "Turn Reddit into your #1 growth channel.",
    images: ["/og-image.png"],
  },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="font-body antialiased">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
