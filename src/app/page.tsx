"use client";

import React, { useState } from "react";
import { useTheme } from "next-themes";

type ParsedReport = any;
type AnalysisResponse = {
  summary?: string;
  details?: Record<string, any[]>;
  disclaimer?: string;
};

import { FC, ReactElement } from "react";

const Home: FC = (): ReactElement => {

  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [details, setDetails] = useState<Record<string, any[]> | null>(null);
  const [disclaimer, setDisclaimer] = useState<string | null>(null);
  const [lang, setLang] = useState<"en" | "hi">("en");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { theme, setTheme } = useTheme();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const f = e.target.files?.[0] ?? null;
    setFile(f);
  };

  const handleAnalyze = async () => {
    setError(null);
    if (!file) {
      setError("Please choose a PDF report first.");
      return;
    }

    setLoading(true);
    setSummary(null);
    setDetails(null);
    setDisclaimer(null);

    try {
      // 1) Upload + parse
      const formData = new FormData();
      formData.append("file", file);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const uploadRes = await fetch(`${backendUrl}/upload-report/`, {
      method: "POST",
      body: formData,
    });

      if (!uploadRes.ok) {
        throw new Error(`Upload failed (${uploadRes.status})`);
      }
      const parsed: ParsedReport = await uploadRes.json();

      // 2) Analyze
      const analyzeRes = await fetch(`${backendUrl}/analyze-report/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parsed_report: parsed, language: lang }),
      });

      if (!analyzeRes.ok) {
        throw new Error(`Analysis failed (${analyzeRes.status})`);
      }

      const data: AnalysisResponse = await analyzeRes.json();

      setSummary(data.summary ?? null);
      setDetails(data.details ?? null);
      setDisclaimer(data.disclaimer ?? null);
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-sans px-4">
      {/* HEADER */}
      <header className="text-center py-10">
        <h1 className="text-5xl font-display shadow-comic-lg">
          ReportSahayak <span className="text-red-600">🩸📊</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
          Your friendly AI blood report whisperer.
        </p>
      </header>

      {/* CONTROLS */}
      <section className="max-w-3xl mx-auto comic-card mb-10">
        <div className="flex flex-wrap items-center justify-center gap-4 text-center">
          <label
            className="comic-button-blue cursor-pointer flex items-center gap-2"
            aria-label="Upload report"
            title="Upload PDF report"
          >
            <span>Upload Report</span>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="sr-only"
            />
          </label>

          {file && (
            <p className="truncate max-w-xs text-sm italic" title={file.name}>
              {file.name}
            </p>
          )}

          <button
            onClick={handleAnalyze}
            className="comic-button-green"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? "Analyzing…" : "Analyze Report"}
          </button>

          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as "en" | "hi")}
            className="rounded-xl border-2 border-black px-3 py-1 bg-white dark:bg-gray-700 text-sm"
            aria-label="Select language"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
          </select>

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="comic-card w-10 h-10 flex items-center justify-center"
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>

        {error && (
          <div className="mt-4 text-sm text-red-600" role="alert">
            {error}
          </div>
        )}
      </section>

      {/* SUMMARY */}
      {summary && (
        <section className="max-w-3xl mx-auto comic-card mb-8">
          <h2 className="text-2xl font-display text-blue-600 mb-3">
            {lang === "hi" ? "सारांश" : "Summary"}
          </h2>
          <p>{summary}</p>
        </section>
      )}

      {/* DETAILS */}
      {details && (
        <section className="max-w-3xl mx-auto comic-card mb-8">
          <h2 className="text-2xl font-display text-blue-600 mb-3">
            {lang === "hi" ? "विस्तृत विश्लेषण" : "Detailed Analysis"}
          </h2>

          {Object.entries(details).map(([sectionName, items]) => (
            <details key={sectionName}>
              <summary className="rounded-t-2xl">{sectionName}</summary>

              <ul className="list-disc pl-6 pr-4 py-2 space-y-2">
                {items.map((item: any, idx: number) => (
                  <li key={idx}>
                    <p className="font-semibold">{item.test_name}</p>
                    <p className="text-sm">Value: {item.value}</p>
                    {item.status && <p className="text-sm">{item.status}</p>}
                    {item.analogy && (
                      <p className="text-sm italic">{item.analogy}</p>
                    )}
                    {item.explanation && (
                      <p className="text-sm">{item.explanation}</p>
                    )}
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </section>
      )}

      {/* DISCLAIMER */}
      {disclaimer && (
        <section className="max-w-3xl mx-auto comic-card mb-8 text-sm italic text-gray-700 dark:text-gray-300">
          {disclaimer}
        </section>
      )}

      {/* FOOTER */}
      <footer className="text-center text-sm text-gray-500 dark:text-gray-400 py-6">
        © 2025 ReportSahayak
      </footer>
    </div>
  );
}
