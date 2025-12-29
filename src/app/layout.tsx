// app/layout.tsx

import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";
import { Bangers, Comic_Neue } from "next/font/google";

// --- Load Fonts Globally Here ---
const bangers = Bangers({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bangers",
});
const comicNeue = Comic_Neue({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-comic-neue",
});

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
      {/* Apply the font variables to the entire application */}
      <body className={`${bangers.variable} ${comicNeue.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}