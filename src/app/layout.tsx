// app/layout.tsx

import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "ReportSahayak",
  description: "Your AI sidekick for decoding blood reports!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/*
          Load display fonts at runtime via the browser instead of at build time.
          The previous setup used `next/font/google`, which fetches Google Fonts
          during `next build`. On Vercel/CI with restricted network that throws
          NextFontError and the deploy fails. Loading them here keeps production
          builds fully network-independent while preserving the look; the Tailwind
          font stacks (see tailwind.config.js) provide graceful fallbacks offline.
        */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bangers&family=Comic+Neue:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
