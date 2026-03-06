import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mentionly — AI-Powered Reddit Marketing Platform",
  description:
    "Discover high-intent Reddit threads, generate natural comments, and get your brand mentioned — all without managing a single Reddit account.",
  openGraph: {
    title: "Mentionly — Turn Reddit Into Your #1 Growth Channel",
    description:
      "Discover high-intent Reddit threads, generate natural comments, and get your brand mentioned.",
    url: "https://mentionly.com",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
  },
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
