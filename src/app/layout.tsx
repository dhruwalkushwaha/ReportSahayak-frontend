// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Bangers, Comic_Neue } from "next/font/google";

export const metadata: Metadata = {
  title: "ReportSahayak",
  description: "Your friendly AI blood report whisperer",
};

// Load fonts and expose CSS variables Tailwind can use
const bangers = Bangers({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bangers",
});
const comic = Comic_Neue({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-comic-neue",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${bangers.variable} ${comic.variable}`}
    >
      <body className="min-h-screen bg-brand-bg text-brand-text dark:bg-dark-bg dark:text-dark-text">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
